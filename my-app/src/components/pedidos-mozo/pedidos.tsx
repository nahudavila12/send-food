// components/WaiterOrders.tsx
"use client"
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Select, { SingleValue } from 'react-select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

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

type TableStatus = 'disponible' | 'reservada' | 'ocupada'

type Table = {
  id: string
  x: number
  y: number
  status: TableStatus
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

export default function WaiterOrders() {
  const [order, setOrder] = useState<Order>({
    table: '',
    items: [{ dish: null, quantity: 1 }],
  })
  const [tables, setTables] = useState<Table[]>(initialTables)
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleChange = (value: string | number | SingleValue<DishOption>, index: number, field: 'dish' | 'quantity') => {
    const newItems = [...order.items]
    
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

  const selectTable = (tableId: string) => {
    const selectedTable = tables.find(table => table.id === tableId)
    if (selectedTable) {
      setSelectedTable(selectedTable)
      if (selectedTable.status === 'disponible') {
        setOrder({ ...order, table: tableId })
      }
    }
  }

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

  const changeTableStatus = (newStatus: TableStatus) => {
    if (selectedTable) {
      const updatedTables = tables.map(table => 
        table.id === selectedTable.id ? { ...table, status: newStatus } : table
      )
      setTables(updatedTables)
      setSelectedTable({ ...selectedTable, status: newStatus })
      if (newStatus !== 'disponible' && order.table === selectedTable.id) {
        setOrder({ ...order, table: '' })
      }
    }
  }

  if (!isClient) {
    return <div>Cargando...</div>
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Tomar Orden</h2>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Seleccionar Mesa</h3>
        <div className="grid grid-cols-7 gap-2 p-4 bg-amber-100 rounded-lg">
          <TooltipProvider>
            {tables.map((table) => (
              <Tooltip key={table.id}>
                <TooltipTrigger asChild>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => selectTable(table.id)}
                        className={`col-start-${table.x} row-start-${table.y} h-12 w-12 ${getTableColor(table.status)} ${
                          order.table === table.id ? 'ring-2 ring-amber-600 ring-offset-2' : ''
                        }`}
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
                        <RadioGroup defaultValue={table.status} onValueChange={(value) => changeTableStatus(value as TableStatus)}>
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="table" className="block text-sm font-medium text-gray-700">Mesa Seleccionada</label>
          <Input
            type="text"
            id="table"
            name="table"
            value={order.table}
            disabled
            className="mt-1"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Platos</h3>
          {order.items.map((item, index) => (
            <div key={index} className="flex space-x-4 items-center">
              <div className="w-3/5">
                <Select
                  value={item.dish}
                  onChange={(value) => handleChange(value, index, 'dish')}
                  options={dishOptions}
                  placeholder="Seleccionar plato"
                />
              </div>
              <Input
                type="number"
                value={item.quantity}
                onChange={(e) => handleChange(e.target.value, index, 'quantity')}
                min={1}
                className="w-1/5"
              />
              <Button onClick={() => removeItem(index)} variant="destructive" size="sm">
                Eliminar
              </Button>
            </div>
          ))}
          <Button onClick={addItem} className="mt-2">Añadir Plato</Button>
        </div>
        <div className="flex justify-center">
          <Button type="submit" className="mt-4">Enviar Orden</Button>
        </div>
      </form>
    </div>
  )
}
