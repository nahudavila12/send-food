"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

type TableStatus = 'disponible' | 'reservada' | 'ocupada'

type Table = {
  id: string
  x: number
  y: number
  status: TableStatus
}

type OrderItem = {
  dish: string
  quantity: number
}

type Order = {
  id: string
  table: string
  items: OrderItem[]
  notes: string
  status: 'Pendiente' | 'En proceso' | 'Completado'
}

const initialTables: Table[] = [
  { id: '1', x: 1, y: 1, status: 'disponible' },
  { id: '2', x: 3, y: 1, status: 'reservada' },
  { id: '3', x: 5, y: 1, status: 'ocupada' },
  { id: '4', x: 1, y: 3, status: 'disponible' },
  { id: '5', x: 3, y: 3, status: 'disponible' },
  { id: '6', x: 5, y: 3, status: 'reservada' },
  { id: '7', x: 1, y: 5, status: 'ocupada' },
  { id: '8', x: 3, y: 5, status: 'disponible' },
  { id: '9', x: 5, y: 5, status: 'disponible' },
]

const initialOrders: Order[] = [
  {
    id: '1',
    table: '2',
    items: [
      { dish: 'Entrada 1', quantity: 2 },
      { dish: 'Plato principal 1', quantity: 1 }
    ],
    notes: 'Sin cebolla en la entrada',
    status: 'Pendiente'
  },
  {
    id: '2',
    table: '5',
    items: [
      { dish: 'Plato principal 2', quantity: 3 },
      { dish: 'Postre 1', quantity: 3 }
    ],
    notes: 'Un postre sin azúcar',
    status: 'En proceso'
  },
  {
    id: '3',
    table: '7',
    items: [
      { dish: 'Entrada 2', quantity: 1 },
      { dish: 'Plato principal 3', quantity: 2 },
      { dish: 'Postre 2', quantity: 2 }
    ],
    notes: 'Alergias: nueces',
    status: 'Completado'
  }
]

export default function WaiterOrders() {
  const [tables, setTables] = useState<Table[]>(initialTables)
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [waiterName, setWaiterName] = useState('Juan')
  const [orders, setOrders] = useState<Order[]>(initialOrders)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const getTableColor = (status: TableStatus) => {
    switch (status) {
      case 'disponible':
        return 'bg-green-500 hover:bg-green-600'
      case 'reservada':
        return 'bg-yellow-500 hover:bg-yellow-600'
      case 'ocupada':
        return 'bg-red-500 hover:bg-red-600'
      default:
        return 'bg-gray-500 hover:bg-gray-600'
    }
  }

  const changeTableStatus = (tableId: string, newStatus: TableStatus) => {
    setTables(tables.map(table => 
      table.id === tableId ? { ...table, status: newStatus } : table
    ))
  }

  if (!isClient) {
    return <div>Cargando...</div>
  }

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">¡Bienvenido, {waiterName} 👋 !</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Estado de las Mesas</h2>
          <div className="mb-6">
            <div className="grid grid-cols-7 gap-2 p-4 bg-amber-100 rounded-lg">
              <TooltipProvider>
                {tables.map((table) => (
                  <Tooltip key={table.id}>
                    <TooltipTrigger asChild>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className={`col-start-${table.x} row-start-${table.y} h-12 w-12 ${getTableColor(table.status)}`}
                          >
                            {table.id}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Mesa {table.id}</DialogTitle>
                          </DialogHeader>
                          <div className="py-4">
                            <h4 className="text-sm font-medium mb-3">Estado actual: {table.status}</h4>
                            <RadioGroup defaultValue={table.status} onValueChange={(value) => changeTableStatus(table.id, value as TableStatus)}>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="disponible" id="disponible" />
                                <Label htmlFor="disponible">Disponible</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="reservada" id="reservada" />
                                <Label htmlFor="reservada">Reservada</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="ocupada" id="ocupada" />
                                <Label htmlFor="ocupada">Ocupada</Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Mesa {table.id}: {table.status}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
            <div className="flex justify-center mt-4 space-x-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                <span>Disponible</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                <span>Reservada</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                <span>Ocupada</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Órdenes Recientes</h2>
          <Card>
            <CardHeader>
              <CardTitle>Órdenes</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full">
                {orders.map((order) => (
                  <div key={order.id} className="mb-4 p-4 border-b">
                    <h3 className="font-semibold">Mesa {order.table}</h3>
                    <ul className="list-disc list-inside">
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.quantity}x {item.dish}
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm text-gray-600 mt-2">Notas: {order.notes}</p>
                    <p className="text-sm font-semibold mt-1">Estado: {order.status}</p>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}