"use client";

import Link from "next/link";
import { useContext } from "react";
import { Utensils, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavbarContext } from "@/context/Navbar";
import { UserContext } from "@/context/User";


export default function Navbar() {
  const { user, isLogged, logOut } = useContext(UserContext);
  const { isDropdownOpen, toggleDropdown, closeDropdown } = useContext(NavbarContext);

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
          {isLogged ? (
            <>
              <div className="relative">
                <button
                  className="text-amber-100 font-medium hover:text-primary focus:outline-none"
                  onClick={toggleDropdown}
                >
                  Hola, {user?.username || user?.fullname || "Usuario"}
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-secondary shadow-lg rounded-md py-2">
                    <Button
                      variant="ghost"
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => {
                        logOut();
                        closeDropdown();
                      }}
                    >
                      Cerrar sesión
                    </Button>
                  </div>
                )}
              </div>
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
