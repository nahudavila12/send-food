"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Clock, CheckCircle2, ChefHat, Printer, RotateCcw, Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast, Toaster } from 'react-hot-toast'

type OrderItem = {
  dish: string
  quantity: number
  estimatedTime: number // Tiempo estimado en minutos
}

type Order = {
  id: number
  table: string
  items: OrderItem[]
  notes: string
  status: 'pendiente' | 'en_proceso' | 'completado'
  priority: 'Baja' | 'Media' | 'Alta'
  startTime?: number
  estimatedDuration?: number // Tiempo estimado total para la orden
}

const chefName = "María"

export default function ChefOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [currentTime, setCurrentTime] = useState(Date.now())
  const [activeTab, setActiveTab] = useState<'pendiente' | 'en_proceso' | 'completado'>('pendiente')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'priority' | 'time'>('priority')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:3000/pedidos/estado/${activeTab.toLowerCase()}`);
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          toast.error("Error al obtener los pedidos, no hay pedidos pendientes");
        }
      } catch {
        toast.error("Error al conectar con el servidor");
      }
    };

    fetchOrders(); // Fetch orders whenever activeTab changes
  }, [activeTab]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now())
      // Cambiar la prioridad si el pedido lleva más de 3 minutos en 'Pendiente' o 'En proceso'
      setOrders(prevOrders => prevOrders.map(order => {
        if (order.status !== 'completado' && order.priority !== 'Alta') {
          const timeElapsed = (Date.now() - (order.startTime || Date.now())) / 1000 / 60 // Tiempo en minutos
          if (timeElapsed >= 3 && order.priority !== 'Alta') {
            return { ...order, priority: 'Alta' }
          }
        }
        return order
      }))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const updateOrderStatus = (id: number, newStatus: 'pendiente' | 'en_proceso' | 'completado') => {
    setOrders(orders.map(order => {
      if (order.id === id) {
        if (newStatus === 'en_proceso' && order.status !== 'en_proceso') {
          const estimatedDuration = order.items.reduce((total, item) => total + item.estimatedTime * 60000, 0)
          toast.success(`Orden #${id} iniciada`)
          return { ...order, status: newStatus, startTime: Date.now(), estimatedDuration }
        } else if (newStatus === 'completado') {
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

  const printOrder = (order: Order) => {
    toast.success(`Imprimiendo orden #${order.id}`)
  }

  const resetKitchen = () => {
    setOrders([]) // Aquí se reinician los pedidos o se pueden obtener nuevamente desde el backend
    toast.success('Cocina reiniciada')
  }

  const callWaiter = (tableNumber: string) => {
    toast.success(`Mozo llamado para la mesa ${tableNumber}`)
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
                Tienes {orders.filter(o => o.status !== 'completado').length} platos pendientes por preparar.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Órdenes pendientes: {orders.filter(o => o.status === 'pendiente').length}</p>
              <p className="text-sm font-medium">Órdenes en proceso: {orders.filter(o => o.status === 'en_proceso').length}</p>
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

      <Tabs defaultValue="pendiente" onValueChange={(value) => setActiveTab(value as 'pendiente' | 'en_proceso' | 'completado')}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="pendiente">Pendientes</TabsTrigger>
          <TabsTrigger value="en_proceso">En Proceso</TabsTrigger>
          <TabsTrigger value="completado">Completadas</TabsTrigger>
        </TabsList>

        <TabsContent value="pendiente">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {filteredOrders.map(order => (
                <Card key={order.id} className="w-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Mesa {order.table}
                    </CardTitle>
                    <Badge variant="outline" color={order.priority === 'Alta' ? 'red' : order.priority === 'Media' ? 'yellow' : 'green'}>
                      {order.priority}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm font-medium">Platos:</div>
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <div>{item.dish}</div>
                        <div className="text-gray-500">{item.quantity} x</div>
                      </div>
                    ))}
                    <div className="mt-2 flex justify-between items-center">
                      <Progress value={getProgressPercentage(order.startTime || 0, order.estimatedDuration || 0)} />
                      <Button variant="link" onClick={() => printOrder(order)}><Printer className="h-4 w-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="en_proceso">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {filteredOrders.map(order => (
                <Card key={order.id} className="w-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Mesa {order.table}
                    </CardTitle>
                    <Badge variant="outline" color={order.priority === 'Alta' ? 'red' : order.priority === 'Media' ? 'yellow' : 'green'}>
                      {order.priority}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm font-medium">Platos:</div>
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <div>{item.dish}</div>
                        <div className="text-gray-500">{item.quantity} x</div>
                      </div>
                    ))}
                    <div className="mt-2 flex justify-between items-center">
                      <Progress value={getProgressPercentage(order.startTime || 0, order.estimatedDuration || 0)} />
                      <Button variant="link" onClick={() => callWaiter(order.table)}><CheckCircle2 className="h-4 w-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
