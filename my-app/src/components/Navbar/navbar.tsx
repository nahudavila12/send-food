"use client"
import Link from 'next/link'
import { Utensils, UserPlus, LogIn } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <nav className="bg-secondary text-amber-100 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            
            <span className="text-xl font-bold">Le Gourmet Exquis</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/Reservations" className="hover:text-primary transition-colors">Reservas</Link>
            <Link href="/Menu" className="hover:text-primary transition-colors">Menú</Link>
            <Link href="/WaiterOrder" className="hover:text-primary transition-colors">Ordenar</Link>
            <Link href="/Chef-order" className="hover:text-primary transition-colors">Pedidos</Link>
            <Link href="/Admin-dashboard" className="hover:text-primary transition-colors">Estadisticas</Link>
            <Button asChild variant="ghost" className="text-primary hover:text-white bg-white hover:bg-primary">
              <Link href="/sign-up">
                <UserPlus className="mr-2 h-4 w-4" />
                Registrarse
              </Link>
            </Button>
            <Button asChild variant="ghost" className="text-amber-100 hover:text-white hover:bg-primary">
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