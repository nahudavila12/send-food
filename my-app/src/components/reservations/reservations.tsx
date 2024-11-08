// components/ReservationForm.tsx
"use client"
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CustomSelect } from '../customSelect/customSelect'


export default function ReservationForm() {
  const [reservation, setReservation] = useState({
    name: '',
    date: '',
    time: '',
    guests: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setReservation(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Reserva enviada:', reservation)
    setReservation({ name: '', date: '', time: '', guests: '' })
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Reserva tu mesa</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
          <Input
            type="text"
            id="name"
            name="name"
            value={reservation.name}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Fecha</label>
          <Input
            type="date"
            id="date"
            name="date"
            value={reservation.date}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700">Hora</label>
          <Input
            type="time"
            id="time"
            name="time"
            value={reservation.time}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700">Número de personas</label>
          <CustomSelect
            id="guests"
            name="guests"
            value={reservation.guests}
            onChange={handleChange}
            required
            className="mt-1"
          >
            <option value="">Selecciona</option>
            <option value="1">1 persona</option>
            <option value="2">2 personas</option>
            <option value="3">3 personas</option>
            <option value="4">4 personas</option>
            <option value="5">5 personas</option>
            <option value="6">6 personas</option>
          </CustomSelect>
        </div>
        <Button type="submit" className="w-full">Reservar</Button>
      </form>
    </div>
  )
}
