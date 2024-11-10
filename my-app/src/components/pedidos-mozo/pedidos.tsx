"use client"
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Select, { SingleValue } from 'react-select'

type DishOption = {
  value: string
  label: string
}

type OrderItem = {
  dish: DishOption | null
  quantity: number
}

type Order = {
  table: string
  items: OrderItem[]
}

export default function WaiterOrders() {
  const [order, setOrder] = useState<Order>({
    table: '',
    items: [{ dish: null, quantity: 1 }],
  })
  
  // Estado para saber si estamos en el cliente
  const [isClient, setIsClient] = useState(false)

  // useEffect para indicar que estamos en el cliente
  useEffect(() => {
    setIsClient(true) // Solo se ejecuta en el cliente
  }, [])

  const handleChange = (value: string | number | SingleValue<DishOption>, index: number, field: 'dish' | 'quantity') => {
    const newItems = [...order.items]
    
    // Si el campo es 'quantity' y el valor es un string, lo convertimos a número
    if (field === 'quantity' && typeof value === 'string') {
      value = Number(value)
    }

    newItems[index] = { ...newItems[index], [field]: value }
    setOrder({ ...order, items: newItems })
  }

  const addItem = () => {
    setOrder({ ...order, items: [...order.items, { dish: null, quantity: 1 }] })
  }

  const removeItem = (index: number) => {
    const newItems = order.items.filter((_, i) => i !== index)
    setOrder({ ...order, items: newItems })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Orden enviada:', order)
    setOrder({ table: '', items: [{ dish: null, quantity: 1 }] })
  }

  const dishOptions: DishOption[] = [
    { value: 'Entrada 1', label: 'Entrada 1' },
    { value: 'Plato principal 1', label: 'Plato principal 1' },
    { value: 'Postre 1', label: 'Postre 1' },
  ]

  if (!isClient) {
    // Mientras se determina si estamos en el cliente, puedes devolver un placeholder o un estado de carga
    return <div>Cargando...</div>
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Tomar Orden</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="table" className="block text-sm font-medium text-gray-700">Mesa</label>
          <Input
            type="text"
            id="table"
            name="table"
            value={order.table}
            onChange={(e) => setOrder({ ...order, table: e.target.value })}
            required
            className="mt-1"
          />
        </div>
        {order.items.map((item, index) => (
          <div key={index} className="flex space-x-2">
            <Select
              options={dishOptions}
              value={item.dish}
              onChange={(option) => handleChange(option, index, 'dish')}
              placeholder="Selecciona un plato"
              className="flex-grow"
            />
            <Input
              type="number"
              name="quantity"
              value={item.quantity}
              onChange={(e) => handleChange(e.target.value, index, 'quantity')} 
              min="1"
              required
              className="w-20"
            />
            <Button type="button" onClick={() => removeItem(index)} variant="destructive">
              Eliminar
            </Button>
          </div>
        ))}
        <Button type="button" onClick={addItem} variant="outline" className="w-full">
          Agregar plato
        </Button>
        <Button type="submit" className="w-full">Enviar orden</Button>
      </form>
    </div>
  )
}
