"use client"
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'


type SalesData = {
  name: string
  ventas: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalReservations: 0,
    totalOrders: 0,
    revenue: 0,
  })

 
  const [salesData, setSalesData] = useState<SalesData[]>([])

  useEffect(() => {
  
    setStats({
      totalReservations: 45,
      totalOrders: 120,
      revenue: 5680,
    })

    setSalesData([
      { name: 'Lun', ventas: 1000 },
      { name: 'Mar', ventas: 1200 },
      { name: 'Mié', ventas: 900 },
      { name: 'Jue', ventas: 1500 },
      { name: 'Vie', ventas: 2000 },
      { name: 'Sáb', ventas: 2200 },
      { name: 'Dom', ventas: 1800 },
    ])
  }, [])

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Panel de Estadisticas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Reservas Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalReservations}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Órdenes Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ingresos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${stats.revenue}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Ventas Semanales</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ventas" fill="#FFBF00" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
