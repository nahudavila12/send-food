import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'


type OrderItem = {
  dish: string
  quantity: number
}


type Order = {
  id: number
  table: string
  items: OrderItem[]
  status: 'Pendiente' | 'En proceso' | 'Completado'
}

export default function ChefOrders() {

  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {

    setOrders([
      { id: 1, table: '5', items: [{ dish: 'Entrada 1', quantity: 2 }, { dish: 'Plato principal 1', quantity: 1 }], status: 'Pendiente' },
      { id: 2, table: '3', items: [{ dish: 'Plato principal 1', quantity: 3 }, { dish: 'Postre 1', quantity: 3 }], status: 'En proceso' },
    ])
  }, [])

  const updateOrderStatus = (id: number, newStatus: 'Pendiente' | 'En proceso' | 'Completado') => {
    setOrders(orders.map(order =>
      order.id === id ? { ...order, status: newStatus } : order
    ))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Órdenes pendientes</h2>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-2">Mesa {order.table}</h3>
            <ul className="list-disc list-inside mb-4">
              {order.items.map((item, index) => (
                <li key={index}>{item.quantity}x {item.dish}</li>
              ))}
            </ul>
            <div className="flex justify-between items-center">
              <span className={`px-2 py-1 rounded-full text-sm ${
                order.status === 'Pendiente' ? 'bg-yellow-200 text-yellow-800' :
                order.status === 'En proceso' ? 'bg-blue-200 text-blue-800' :
                'bg-green-200 text-green-800'
              }`}>
                {order.status === 'Pendiente' ? 'Pendiente' :
                 order.status === 'En proceso' ? 'En proceso' :
                 'Completado'}
              </span>
              <div className="space-x-2">
                {order.status !== 'En proceso' && (
                  <Button onClick={() => updateOrderStatus(order.id, 'En proceso')} variant="outline">
                    Iniciar
                  </Button>
                )}
                {order.status !== 'Completado' && (
                  <Button onClick={() => updateOrderStatus(order.id, 'Completado')}>
                    Completar
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
