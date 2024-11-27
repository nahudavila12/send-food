"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import {
  addReservation,
  fetchReservationsRequest,
  fetchReservationsSuccess,
  fetchReservationsFailure,
} from '@/redux/slices/reservationsSlice';
import { loginFailure } from '@/redux/slices/authSlice';

// Define la interfaz IReservation con un id
export interface IReservation {
  id: string;
  day: Date;
  startTime: Date;
  tableNumber: number;
  guests: number;
}

export default function ReservationSystem() {
  const dispatch = useDispatch();

  // Estado local del componente
  const [currentReservation, setCurrentReservation] = useState<IReservation>({
    id: '',
    day: new Date(),
    startTime: new Date(),
    tableNumber: 1,
    guests: 1,
  });

  const [isEditing, setIsEditing] = useState(false);

  // Estado global de Redux
  const { reservations, loading, error } = useSelector((state: RootState) => state.reservations);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // Cargar reservas al montar el componente
  useEffect(() => {
    const fetchReservations = async () => {
      dispatch(fetchReservationsRequest());
      try {
        const response = await fetch('http://localhost:3000/reservations');
        if (!response.ok) throw new Error('Error al cargar las reservas');
        const data = await response.json();
        dispatch(fetchReservationsSuccess(data));
      } catch (error) {
        dispatch(fetchReservationsFailure('No se pudieron cargar las reservas'));
      }
    };
    fetchReservations();
  }, [dispatch]);

  // Verificar autenticación
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Por favor, inicia sesión para realizar una reserva.');
    }
  }, [isAuthenticated]);

  // Manejar cambios en el formulario
  const handleChange = (name: keyof IReservation, value: string) => {
    if (name === 'guests' || name === 'tableNumber') {
      const parsedValue = parseInt(value);
      if (!isNaN(parsedValue)) {
        setCurrentReservation(prev => ({ ...prev, [name]: parsedValue }));
      }
    } else if (name === 'day' || name === 'startTime') {
      setCurrentReservation(prev => ({
        ...prev,
        [name]: new Date(value),
      }));
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Usuario no autenticado, por favor inicie sesión.');
      return;
    }

    const { startTime, day } = currentReservation;
    const hour = startTime.getHours();
    if (hour < 13 || hour > 23) {
      toast.error('La hora debe estar entre las 13:00 y las 23:00');
      return;
    }

    const reservationData = {
      day: day.toISOString().split('T')[0],
      startTime: startTime.toISOString(),
      tableNumber: currentReservation.tableNumber,
      guests: currentReservation.guests,
    };

    try {
      dispatch(fetchReservationsRequest());

      const response = await fetch('http://localhost:3000/reservations/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationData),
      });

      if (!response.ok) throw new Error('Error al crear la reserva');

      const newReservation = await response.json();
      dispatch(addReservation(newReservation));

      setCurrentReservation({
        id: '',
        day: new Date(),
        startTime: new Date(),
        tableNumber: 1,
        guests: 1,
      });

      toast.success('Reserva realizada con éxito');
    } catch (error) {
      dispatch(fetchReservationsFailure('Error al procesar la reserva'));
      toast.error('Hubo un error al realizar la reserva');
    }
  };

  // Filtrar reservas del usuario autenticado
  const userReservations = reservations.filter((reservation: IReservation) => reservation.userId === user?.uuid);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Reservas</h1>

      {/* Formulario de nueva reserva */}
      <div className="grid gap-6 font-poppins text-primary md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? 'Editar Reserva' : 'Reserva tu mesa'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="tableNumber" className="block text-sm font-poppins text-gray-700">
                  Número de mesa
                </label>
                <Input
                  type="number"
                  id="tableNumber"
                  name="tableNumber"
                  value={currentReservation.tableNumber || 0}
                  onChange={(e) => handleChange('tableNumber', e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="day" className="block text-sm font-poppins text-gray-700">
                  Fecha
                </label>
                <Input
                  type="date"
                  id="day"
                  name="day"
                  value={currentReservation.day.toISOString().split('T')[0]}
                  onChange={(e) => handleChange('day', e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="startTime" className="block text-sm font-poppins text-gray-700">
                  Hora
                </label>
                <Input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={`${currentReservation.startTime
                    .getHours()
                    .toString()
                    .padStart(2, '0')}:${currentReservation.startTime
                    .getMinutes()
                    .toString()
                    .padStart(2, '0')}`}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(':').map(Number);
                    setCurrentReservation((prev) => ({
                      ...prev,
                      startTime: new Date(prev.day.setHours(hours, minutes)),
                    }));
                  }}
                  required
                />
              </div>
              <div>
                <label htmlFor="guests" className="block text-sm font-poppins text-gray-700">
                  Número de personas
                </label>
                <Select
                  value={currentReservation.guests.toString()}
                  onValueChange={(value) => handleChange('guests', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(100).keys()].map((num) => (
                      <SelectItem key={num + 1} value={(num + 1).toString()}>
                        {num + 1} persona{num > 0 && 's'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-secondary text-amber-100 hover:bg-primary">
                {isEditing ? 'Actualizar Reserva' : 'Reservar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Sección "Mis Reservas" */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Mis Reservas</h2>
        {userReservations.length > 0 ? (
          <div>
            {userReservations.map((reservation) => (
              <Card key={reservation.id} className="mb-4">
                <CardHeader>
                  <CardTitle>Reserva para el {new Date(reservation.date).toLocaleDateString()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Mesa:</strong> {reservation.tableNumber}</p>
                  <p><strong>Hora:</strong> {new Date(reservation.startTime).toLocaleTimeString()}</p>
                  <p><strong>Comensales:</strong> {reservation.guests}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p>No tienes reservas pendientes.</p>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}
