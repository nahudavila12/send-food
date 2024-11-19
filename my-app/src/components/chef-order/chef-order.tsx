"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Clock, CheckCircle2, ChefHat, Utensils, Bell, Search, Printer, RotateCcw } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast, Toaster } from 'react-hot-toast'

type OrderItem = {
  dish: string
  quantity: number
  estimatedTime: number // in minutes
}

type Order = {
  id: number
  table: string
  items: OrderItem[]
  notes: string
  status: 'Pendiente' | 'En proceso' | 'Completado'
  priority: 'Baja' | 'Media' | 'Alta'
  startTime?: number
  estimatedDuration?: number
}

const chefName = "María"

const initialOrders: Order[] = [
  { 
    id: 1, 
    table: '5', 
    items: [
      { dish: 'Ensalada César', quantity: 2, estimatedTime: 10 }, 
      { dish: 'Filete de salmón', quantity: 1, estimatedTime: 20 }
    ], 
    notes: 'Sin cebolla en la ensalada', 
    status: 'Pendiente',
    priority: 'Media'
  },
  { 
    id: 2, 
    table: '3', 
    items: [
      { dish: 'Risotto de champiñones', quantity: 3, estimatedTime: 25 }, 
      { dish: 'Tiramisú', quantity: 3, estimatedTime: 15 }
    ], 
    notes: 'Un postre sin azúcar', 
    status: 'En proceso', 
    startTime: Date.now() - 600000, 
    estimatedDuration: 2400000,
    priority: 'Alta'
  },
  { 
    id: 3, 
    table: '7', 
    items: [
      { dish: 'Carpaccio de res', quantity: 1, estimatedTime: 15 }, 
      { dish: 'Pasta al pesto', quantity: 2, estimatedTime: 20 }
    ], 
    notes: 'Pasta al dente', 
    status: 'Pendiente',
    priority: 'Baja'
  },
]

export default function ChefOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [currentTime, setCurrentTime] = useState(Date.now())
  const [activeTab, setActiveTab] = useState<'Pendiente' | 'En proceso' | 'Completado'>('Pendiente')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'priority' | 'time'>('priority')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const updateOrderStatus = (id: number, newStatus: 'Pendiente' | 'En proceso' | 'Completado') => {
    setOrders(orders.map(order => {
      if (order.id === id) {
        if (newStatus === 'En proceso' && order.status !== 'En proceso') {
          const estimatedDuration = order.items.reduce((total, item) => total + item.estimatedTime * 60000, 0)
          toast.success(`Orden #${id} iniciada`)
          return { ...order, status: newStatus, startTime: Date.now(), estimatedDuration }
        } else if (newStatus === 'Completado') {
          toast.success(`Orden #${id} completada`)
          return { ...order, status: newStatus, startTime: undefined, estimatedDuration: undefined }
        }
      }
      return order
    }))
  }

  const getProgressPercentage = (startTime: number, estimatedDuration: number) => {
    const elapsedTime = currentTime - startTime
    return Math.min((elapsedTime / estimatedDuration) * 100, 100)
  }

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getPriorityColor = (priority: Order['priority']) => {
    switch (priority) {
      case 'Baja': return 'bg-green-200 text-green-800'
      case 'Media': return 'bg-yellow-200 text-yellow-800'
      case 'Alta': return 'bg-red-200 text-red-800'
    }
  }

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'Pendiente': return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'En proceso': return <Clock className="h-4 w-4 text-blue-500" />
      case 'Completado': return <CheckCircle2 className="h-4 w-4 text-green-500" />
    }
  }

  const filteredOrders = orders
    .filter(order => order.status === activeTab)
    .filter(order => 
      order.items.some(item => 
        item.dish.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      order.table.includes(searchTerm) ||
      order.notes.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { 'Alta': 0, 'Media': 1, 'Baja': 2 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      } else {
        return (a.estimatedDuration || 0) - (b.estimatedDuration || 0)
      }
    })

  const pendingTasks = orders.filter(order => order.status !== 'Completado').reduce((total, order) => 
    total + order.items.reduce((sum, item) => sum + item.quantity, 0), 0
  )

  const printOrder = (order: Order) => {
    // Simulate printing order details
    toast.success(`Imprimiendo orden #${order.id}`)
  }

  const resetKitchen = () => {
    setOrders(initialOrders)
    toast.success('Cocina reiniciada')
  }

  const callWaiter = (tableNumber: string) => {
    toast.success(`Mozo llamado para la mesa ${tableNumber}`)
    // Here you would typically implement the actual call to the waiter's system
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Toaster />
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl flex items-center">
                <ChefHat className="mr-2" />
                Bienvenido, Chef {chefName}
              </CardTitle>
              <CardDescription>
                Tienes {pendingTasks} platos pendientes por preparar.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Órdenes pendientes: {orders.filter(o => o.status === 'Pendiente').length}</p>
              <p className="text-sm font-medium">Órdenes en proceso: {orders.filter(o => o.status === 'En proceso').length}</p>
            </div>
            <div className="flex space-x-2">
          
              <Button variant="outline" onClick={resetKitchen}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reiniciar cocina
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Buscar por plato, mesa o notas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
        <div className="flex items-center space-x-4">
          <Select value={sortBy} onValueChange={(value: 'priority' | 'time') => setSortBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="priority">Prioridad</SelectItem>
              <SelectItem value="time">Tiempo estimado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="Pendiente" onValueChange={(value) => setActiveTab(value as 'Pendiente' | 'En proceso' | 'Completado')}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="Pendiente">Pendientes</TabsTrigger>
          <TabsTrigger value="En proceso">En Proceso</TabsTrigger>
          <TabsTrigger value="Completado">Completadas</TabsTrigger>
        </TabsList>

        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <Card key={order.id} className="w-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Mesa {order.table}
                  </CardTitle>
                  <Badge className={getPriorityColor(order.priority)}>
                    {order.priority}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                    {getStatusIcon(order.status)}
                    <span>{order.status}</span>
                  </div>
                  <ul className="list-disc list-inside mb-4">
                    {order.items.map((item, index) => (
                      <li key={index} className="text-sm">
                        {item.quantity}x {item.dish} 
                        <span className="text-muted-foreground ml-2">
                          (Est. {item.estimatedTime} min)
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-muted-foreground mb-2">Notas: {order.notes}</p>
                  {order.status === 'En proceso' && order.startTime && order.estimatedDuration && (
                    <div>
                      <Progress value={getProgressPercentage(order.startTime, order.estimatedDuration)} className="mb-2" />
                      <p className="text-sm text-right">
                        Tiempo restante: {formatTime(Math.max(0, order.estimatedDuration - (currentTime - order.startTime)))}
                      </p>
                    </div>
                  )}
                  <div className="flex justify-end hover:text-white bg-white text-primary space-x-2 mt-4">
                    {order.status === 'Pendiente' && (
                      <Button onClick={() => updateOrderStatus(order.id, 'En proceso')} variant="outline" size="sm">
                        Iniciar
                      </Button>
                    )}
                    {order.status === 'En proceso' && (
                      <Button 
                        onClick={() => {
                          updateOrderStatus(order.id, 'Completado')
                          callWaiter(order.table)
                        }} 
                        size="sm"
                      >
                        Completar y Llamar Mozo
                      </Button>
                    )}
                    <Button onClick={() => printOrder(order)} variant="outline" size="sm">
                      <Printer className="mr-2 h-4 w-4" />
                      Imprimir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  )
}