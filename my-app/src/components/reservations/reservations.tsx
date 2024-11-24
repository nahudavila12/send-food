'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type Reservation = {
  id: number
  name: string
  date: string
  time: string
  guests: string
}

export default function ReservationSystem() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [currentReservation, setCurrentReservation] = useState<Reservation>({
    id: 0,
    name: '',
    date: '',
    time: '',
    guests: '',
  })
  const [isEditing, setIsEditing] = useState(false)

  const handleChange = (name: string, value: string) => {
    setCurrentReservation(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Formatear los datos para que coincidan con el DTO del backend
    const reservationData = {
      day: currentReservation.date,  // Utilizando el formato de fecha
      startTime: currentReservation.time,  // La hora de inicio
      tableNumber: 1,  // Puedes cambiar el número de mesa según la lógica de tu sistema
      guests: parseInt(currentReservation.guests),  // Número de personas como entero
    }

    try {
      // Enviar la reserva al backend
      const response = await fetch('http://localhost:3001/reservations/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
      })

      if (!response.ok) {
        throw new Error('Error al crear la reserva')
      }

      // Añadir la nueva reserva a la lista de reservas en el frontend
      const newReservation = await response.json()
      setReservations(prev => [...prev, newReservation])
      
      // Limpiar el formulario
      setCurrentReservation({ id: 0, name: '', date: '', time: '', guests: '' })
    } catch (error) {
      console.error('Error enviando la reserva:', error)
    }
  }

  const editReservation = (reservation: Reservation) => {
    setCurrentReservation(reservation)
    setIsEditing(true)
  }

  const cancelReservation = (id: number) => {
    setReservations(prev => prev.filter(res => res.id !== id))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Reservas</h1>
      <div className="grid gap-6 font-poppins text-primary md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? 'Editar Reserva' : 'Reserva tu mesa'}</CardTitle>
            <CardDescription>Costo de la reserva, valor que sera descontado a la hora de pagar lo consumido: $5</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-poppins text-gray-700">Nombre</label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={currentReservation.name}
                  onChange={(e) => handleChange('name', e.target.value)}
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
                    value={currentReservation.date}
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
                    value={currentReservation.time}
                    onChange={(e) => handleChange('time', e.target.value)}
                    required
                    className="pl-8 mt-1"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="guests" className="block text-sm font-poppins text-gray-700">Número de personas</label>
                <Select
                  value={currentReservation.guests}
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
                    <p><strong>Nombre:</strong> {reservation.name}</p>
                    <p><strong>Fecha:</strong> {reservation.date}</p>
                    <p><strong>Hora:</strong> {reservation.time}</p>
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
    </div>
  )
}
