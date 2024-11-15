"use client"
import Link from 'next/link'
import { Utensils, UserPlus, LogIn } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <nav className="bg-amber-950 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Utensils className="h-8 w-8" />
            <span className="text-xl font-bold">Send Food</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/Reservations" className="hover:text-amber-600 transition-colors">Reservar</Link>
            <Link href="/Menu" className="hover:text-amber-600 transition-colors">Menú</Link>
            <Link href="/WaiterOrder" className="hover:text-amber-600 transition-colors">Ordenar</Link>
            <Link href="/Chef-order" className="hover:text-amber-600 transition-colors">Pedidos</Link>
            <Link href="/Admin-dashboard" className="hover:text-amber-600 transition-colors">Estadisticas</Link>
            <Button asChild variant="ghost" className="text-white hover:text-amber-600 hover:bg-amber-900">
              <Link href="/sign-up">
                <UserPlus className="mr-2 h-4 w-4" />
                Registrarse
              </Link>
            </Button>
            <Button asChild variant="ghost" className="text-white hover:text-amber-600 hover:bg-amber-900">
              <Link href="/sign-in">
                <LogIn className="mr-2 h-4 w-4" />
                Iniciar Sesión
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}