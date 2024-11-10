"use client"
import Link from 'next/link'
import { Utensils } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="bg-amber-950 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Utensils className="h-8 w-8" />
            <span className="text-xl font-bold">Send Food</span>
          </Link>
          <div className="space-x-4">
            <Link href="/Reservations" className="hover:text-amber-600">Reservas</Link>
            <Link href="/menu" className="hover:text-amber-600">Menú</Link>
            <Link href="/WaiterOrder" className="hover:text-amber-600">Ordenar</Link>
            <Link href="/Chef-order" className="hover:text-amber-600">Pedidos</Link>
            <Link href="/Admin-dashboard" className="hover:text-amber-600">Admin</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
