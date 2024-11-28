"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import {
  addReservation,
  fetchReservationsRequest,
} from '@/redux/slices/reservationsSlice';

export interface IReservation {
  id: string;
  day: Date | null; // Permitir valores nulos
  startTime: Date;
  tableNumber: number;
  guests: number;
}

export default function ReservationSystem() {
  const dispatch = useDispatch();

  const [currentReservation, setCurrentReservation] = useState<IReservation>({
    id: '',
    day: new Date(), // Inicializar como un objeto Date válido
    startTime: new Date(),
    tableNumber: 1,
    guests: 1,
  });

  const [isEditing, setIsEditing] = useState(false);

  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Por favor, inicia sesión para realizar una reserva.');
    }
  }, [isAuthenticated]);

  const handleChange = (name: keyof IReservation, value: string) => {
    if (name === 'guests' || name === 'tableNumber') {
      const parsedValue = parseInt(value);
      if (!isNaN(parsedValue)) {
        setCurrentReservation((prev) => ({ ...prev, [name]: parsedValue }));
      }
    } else if (name === 'day') {
      const newDate = new Date(value);
      setCurrentReservation((prev) => ({
        ...prev,
        day: isNaN(newDate.getTime()) ? null : newDate,  // Permitir null si la fecha no es válida
      }));
    } else if (name === 'startTime') {
      const [hours, minutes] = value.split(':').map(Number);
      if (!isNaN(hours) && !isNaN(minutes)) {
        setCurrentReservation((prev) => ({
          ...prev,
          startTime: new Date(prev.day.setHours(hours, minutes)),
        }));
      }
    }
  };
  
  

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
  
    if (!day) {
      toast.error('Por favor, selecciona una fecha válida.');
      return;
    }
  
    const reservationData = {
      day: day.toISOString(),  // Asegúrate de enviar una fecha válida
      startTime: startTime.toISOString(),
      tableNumber: currentReservation.tableNumber,
      guests: currentReservation.guests,
    };
  
    try {
      dispatch(fetchReservationsRequest());
  
      const response = await fetch(`http://localhost:3000/reservations/booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.accessToken}`, // Enviamos el accesToken
        },
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
    } catch {
      toast.error('Hubo un error al realizar la reserva');
    }
  };
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Reservas</h1>
      <div className="grid gap-6 font-poppins text-primary md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? 'Editar Reserva' : 'Reserva tu mesa'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="tableNumber" className="block text-sm text-gray-700">
                  Número de mesa
                </label>
                <Input
                  type="number"
                  id="tableNumber"
                  value={currentReservation.tableNumber}
                  onChange={(e) => handleChange('tableNumber', e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="day" className="block text-sm text-gray-700">
                  Fecha
                </label>
                <Input
  type="date"
  id="day"
  name="day"
  value={currentReservation.day ? currentReservation.day.toISOString().split('T')[0] : ''}  // Usa cadena vacía si day es null
  onChange={(e) => handleChange('day', e.target.value)}
  required
/>

              </div>
              <div>
                <label htmlFor="startTime" className="block text-sm text-gray-700">
                  Hora
                </label>
                <Input
                  type="time"
                  id="startTime"
                  value={`${currentReservation.startTime
                    .getHours()
                    .toString()
                    .padStart(2, '0')}:${currentReservation.startTime
                    .getMinutes()
                    .toString()
                    .padStart(2, '0')}`}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="guests" className="block text-sm text-gray-700">
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
      <ToastContainer />
    </div>
  );
}
