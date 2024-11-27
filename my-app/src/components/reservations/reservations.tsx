"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store/store'
import { addReservation, fetchReservationsRequest, fetchReservationsSuccess, fetchReservationsFailure, removeReservation } from '@/redux/slices/reservationsSlice'
import { loginFailure } from '@/redux/slices/authSlice'

// Define la interfaz IReservation con un id
export interface IReservation {
  id: string; // Agregamos el campo id
  date: Date; // Fecha de la reserva
  startTime: Date; // Hora de la reserva
  tableNumber: string;
  guests: number;
}

export default function ReservationSystem() {
  const dispatch = useDispatch()

  // Estado local del componente
  const [currentReservation, setCurrentReservation] = useState<IReservation>({
    id: '', // Inicializamos el id vacío
    date: new Date(), // Establecemos una fecha predeterminada
    startTime: new Date(), // Establecemos la hora predeterminada
    tableNumber: '',
    guests: 0,
  })
  const [isEditing, setIsEditing] = useState(false)

  // Traemos el estado global de Redux
  const { reservations, loading, error } = useSelector((state: RootState) => state.reservations)
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

  // Verificar la autenticación en un efecto
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Por favor, inicia sesión para realizar una reserva.')
    }
  }, [isAuthenticated])

  // Función para manejar cambios en los campos del formulario
  const handleChange = (name: keyof IReservation, value: string) => {
    if (name === 'guests') {
      setCurrentReservation(prev => ({ ...prev, [name]: parseInt(value) }))
    } else if (name === 'date' || name === 'startTime') {
      // Convertimos las fechas a Date al recibirlas como string
      setCurrentReservation(prev => ({
        ...prev,
        [name]: new Date(value),
      }))
    } else {
      setCurrentReservation(prev => ({ ...prev, [name]: value }))
    }
  }

  // Función para enviar el formulario de reserva
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Verificar si el usuario está autenticado
    if (!isAuthenticated) {
      toast.error('Usuario no autenticado, por favor inicie sesión.');
      return;
    }

    const time = currentReservation.startTime
    const hour = time.getHours()

    if (hour < 13 || hour > 23) {
      toast.error('La hora debe estar entre las 13:00 y las 23:00');
      return;
    }

    const reservationData = {
      day: currentReservation.date.toISOString().split('T')[0], // Fecha en formato ISO
      startTime: currentReservation.startTime.toISOString(), // Hora en formato ISO
      tableNumber: currentReservation.tableNumber,  // Número de mesa
      guests: currentReservation.guests,
    }

    try {
      dispatch(fetchReservationsRequest())

      const response = await fetch('http://localhost:3000/reservations/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
      })

      if (!response.ok) {
        throw new Error('Error al crear la reserva')
      }

      const newReservation = await response.json()
      dispatch(addReservation(newReservation))

      setCurrentReservation({ id: '', date: new Date(), startTime: new Date(), tableNumber: '', guests: 0 })
      toast.success('Reserva realizada con éxito')

    } catch (error) {
      dispatch(fetchReservationsFailure('Error al procesar la reserva'))
      toast.error('Hubo un error al realizar la reserva')
    }
  }

  // Función para editar una reserva existente
  const editReservation = (reservation: IReservation) => {
    setCurrentReservation(reservation)
    setIsEditing(true)
  }

  // Función para cancelar una reserva
  const cancelReservation = (id: string) => {
    dispatch(removeReservation(id)) // Usamos la acción de eliminar
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Reservas</h1>
      <div className="grid gap-6 font-poppins text-primary md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? 'Editar Reserva' : 'Reserva tu mesa'}</CardTitle>
            <CardDescription>Costo de la reserva, valor que será descontado a la hora de pagar lo consumido: $5</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-poppins text-gray-700">Nombre</label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={currentReservation.tableNumber}
                  onChange={(e) => handleChange('tableNumber', e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-poppins text-gray-700">Fecha</label>
                <div className="relative">
                  <Input
                    type="date"
                    id="date"
                    name="date"
                    value={currentReservation.date.toISOString().split('T')[0]}  // Formatea la fecha
                    onChange={(e) => handleChange('date', e.target.value)}
                    required
                    className="pl-8 mt-1"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-poppins text-gray-700">Hora</label>
                <div className="relative">
                  <Input
                    type="time"
                    id="time"
                    name="time"
                    value={`${currentReservation.startTime.getHours().toString().padStart(2, '0')}:${currentReservation.startTime.getMinutes().toString().padStart(2, '0')}`}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':').map(num => parseInt(num));
                      setCurrentReservation(prev => ({ ...prev, startTime: new Date(prev.date.setHours(hours, minutes)) }));
                    }}
                    required
                    className="pl-8 mt-1"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="guests" className="block text-sm font-poppins text-gray-700">Número de personas</label>
                <Select
                  value={currentReservation.guests.toString()}  // Convertirlo a string
                  onValueChange={(value) => handleChange('guests', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 persona</SelectItem>
                    <SelectItem value="2">2 personas</SelectItem>
                    <SelectItem value="3">3 personas</SelectItem>
                    <SelectItem value="4">4 personas</SelectItem>
                    <SelectItem value="5">5 personas</SelectItem>
                    <SelectItem value="6">6 personas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-secondary text-amber-100 hover:bg-primary hover:text-amber-100">
                {isEditing ? 'Actualizar Reserva' : 'Reservar y pagar'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mis Reservas</CardTitle>
          </CardHeader>
          <CardContent>
            {reservations.length === 0 ? (
              <p>No tienes reservas actualmente.</p>
            ) : (
              <ul className="space-y-4">
                {reservations.map((reservation) => (
                  <li key={reservation.id} className="bg-secondary text-amber-100 font-poppins p-4 rounded-lg">
                    <p><strong>Fecha:</strong> {reservation.date.toLocaleDateString()}</p>
                    <p><strong>Hora:</strong> {reservation.startTime.toLocaleTimeString()}</p>
                    <p><strong>Personas:</strong> {reservation.guests}</p>
                    <div className="mt-2 space-x-2">
                      <Button variant="outline" size="sm" onClick={() => editReservation(reservation)}>
                        Editar
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => cancelReservation(reservation.id)}>
                        Cancelar
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <ToastContainer />
      </div>
    </div>
  )
}
