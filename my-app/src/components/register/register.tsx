'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaGoogle } from 'react-icons/fa'
import { SignUpButton } from '@clerk/nextjs'

export default function RegisterComponent() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const form = event.target as HTMLFormElement
    const name = (form.elements.namedItem("name") as HTMLInputElement).value
    const email = (form.elements.namedItem("email") as HTMLInputElement).value
    const password = (form.elements.namedItem("password") as HTMLInputElement).value
    const confirmPassword = (form.elements.namedItem("confirmPassword") as HTMLInputElement).value
    const username = (form.elements.namedItem("username") as HTMLInputElement).value

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:3001/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password,username }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al registrarse.')
      }

      const data = await response.json()
      console.log('Usuario registrado con éxito:', data)

    } catch {
      console.error('Error al registrarse:')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4 bg-[url('/fondo.webp')] bg-cover bg-center">
      <div className="w-full max-w-4xl flex bg-white/80 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden">
        <div className="w-full lg:w-1/2 p-8">
          <h1 className="text-3xl font-bold text-amber-800 mb-6">Registrarse</h1>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input id="name" placeholder="Juan Pérez" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" placeholder="correo@ejemplo.com" required type="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Nombre de usuario</Label>
              <Input id="username"placeholder="Juansito1"  required type="username" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" required type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input id="confirmPassword" required type="password" />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white" type="submit" disabled={isLoading}>
              {isLoading ? "Registrando..." : "Registrarse"}
            </Button>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-amber-300" />
              </div>
            </div>
            <SignUpButton
  mode="modal"
  className="w-full mt-4 text-amber-800 border-amber-300 hover:bg-amber-100-br"
  type= "button"
>
  Registrarse con Google o Apple
</SignUpButton>

          </div>
        </div>
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/restaurant-interior.jpg')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-amber-900/60"></div>
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-amber-100 mb-4 drop-shadow-lg">Descubre el Sabor</h2>
              <p className="text-amber-50 text-lg drop-shadow">
                La cocina es un lenguaje mediante el cual se expresa armonía, creatividad, felicidad, belleza, poesía, complejidad, magia, humor, provocación, cultura.
              </p>
              <p className="text-amber-200 mt-2 drop-shadow">- Alain Ducasse</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
