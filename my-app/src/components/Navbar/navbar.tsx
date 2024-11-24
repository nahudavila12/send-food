"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Utensils, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Lógica para obtener los datos del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/users/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Enviamos el token en los headers
          },
        });

        if (!response.ok) {
          throw new Error("Usuario no encontrado o no autorizado.");
        }

        const data = await response.json();
        setUser(data); // Guardamos los datos del usuario en el estado
      } catch {
        // Manejo de errores
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Mostrar contenido de la navbar según el estado de autenticación
  if (loading) return null; // Puedes mostrar un spinner si está cargando

  return (
    <nav className="bg-secondary text-amber-100 shadow-lg">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="text-xl font-bold">
          Le Gourmet Exquis
        </Link>
        <div className="flex items-center space-x-4">
          {/* Enlaces visibles para todos */}
          <Link href="/Reservations" className="hover:text-primary transition-colors">
            Reservas
          </Link>
          <Link href="/Menu" className="hover:text-primary transition-colors">
            Menú
          </Link>
          <Link href="/WaiterOrder" className="hover:text-primary transition-colors">
            Ordenar
          </Link>
          <Link href="/Chef-order" className="hover:text-primary transition-colors">
            Pedidos
          </Link>
          <Link href="/Admin-dashboard" className="hover:text-primary transition-colors">
            Estadísticas
          </Link>

          {/* Si el usuario está autenticado */}
          {user ? (
            <>
              <span className="text-amber-100">Hola, {user.username || user.fullname}</span>
              <Button
                variant="ghost"
                onClick={() => {
                  localStorage.removeItem("authToken");
                  setUser(null); // Limpiar el estado del usuario
                }}
              >
                Cerrar sesión
              </Button>
            </>
          ) : (
            // Si no está autenticado, muestra los botones para registrarse e iniciar sesión
            <>
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
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
