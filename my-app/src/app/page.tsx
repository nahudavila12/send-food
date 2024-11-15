"use client"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-amber-50">
      {/* Hero Section */}
      <div
        className="relative min-h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/images/fondo.webp')" }} 
      >
        {/* Capa de fondo con brillo reducido y desenfoque */}
        <div
          className="absolute inset-0 bg-cover bg-center filter brightness-80 blur-[4px]"
          style={{
            backgroundImage: "url('/images/mesa.jpg')"
          }}
        ></div>

        {/* Capa de superposición negra */}
        <div className="absolute inset-0 bg-black opacity-70"></div>

        <div className="container mx-auto px-4 flex items-center justify-between relative z-10">
          {/* Left Content */}
          <div className="max-w-xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Sabores que Cuentan Historias
            </h1>
            <p className="text-xl text-white mb-8">
              Descubre una experiencia culinaria única donde cada plato es una obra maestra creada con pasión y los mejores ingredientes.
            </p>
            <Button className="bg-amber-800 hover:bg-amber-900 text-white px-8 py-6 text-lg rounded-full">
            <Link href="/Reservations">
              Reserva Ahora
            </Link>
            </Button>
          </div>

          {/* Right Content - Rotating Dish Image */}
          <div className="hidden md:block relative">
            <div className="w-[350px] h-[350px] rounded-full bg-amber-500 shadow-2xl overflow-hidden">
              <div className="animate-spin-slow w-full h-full flex items-center justify-center">
                <Image
                  src="/images/platillo-rotativo.webp"
                  alt="Plato destacado"
                  width={600}
                  height={450}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-amber-200 rounded-full -z-10" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-amber-300 rounded-full -z-10" />
          </div>
        </div>
      </div>

      {/* Featured Dishes Section */}
      <div className="container mx-auto px-4 mb-12">
        <h2 className="text-4xl font-bold text-amber-900 text-center mb-8">
          Platos Destacados
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Image src="/placeholder.svg?height=200&width=300" alt="Plato destacado 1" width={300} height={200} className="w-full" />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-amber-900 mb-2">Plato Destacado 1</h3>
              <p className="text-gray-600">Una deliciosa creación de nuestro chef</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Image src="/placeholder.svg?height=200&width=300" alt="Plato destacado 2" width={300} height={200} className="w-full" />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-amber-900 mb-2">Plato Destacado 2</h3>
              <p className="text-gray-600">Sabores únicos que te sorprenderán</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Image src="/placeholder.svg?height=200&width=300" alt="Plato destacado 3" width={300} height={200} className="w-full" />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-amber-900 mb-2">Plato Destacado 3</h3>
              <p className="text-gray-600">Una experiencia gastronómica inolvidable</p>
            </div>
          </div>
        </div>
      </div>

        {/* Our Chefs Section */}
        <section className="py-20 bg-amber-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-amber-900 mb-12">
            Nuestros Chefs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Chef 1 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=300&width=400"
                alt="Chef María González"
                width={400}
                height={300}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-amber-900 mb-2">María González</h3>
                <p className="text-amber-700">Chef Ejecutiva</p>
                <p className="mt-4 text-amber-800">
                  Con más de 15 años de experiencia, María trae la esencia de la cocina mediterránea a cada plato.
                </p>
              </div>
            </div>

            {/* Chef 2 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=300&width=400"
                alt="Chef Carlos Rodríguez"
                width={400}
                height={300}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-amber-900 mb-2">Carlos Rodríguez</h3>
                <p className="text-amber-700">Chef de Pastelería</p>
                <p className="mt-4 text-amber-800">
                  Carlos es un maestro en el arte de los postres, creando dulces experiencias que complementan perfectamente cada comida.
                </p>
              </div>
            </div>

            {/* Chef 3 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=300&width=400"
                alt="Chef Ana Martínez"
                width={400}
                height={300}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-amber-900 mb-2">Ana Martínez</h3>
                <p className="text-amber-700">Chef de Cocina Fusión</p>
                <p className="mt-4 text-amber-800">
                  Ana se especializa en la fusión de sabores internacionales, creando platos innovadores que sorprenden el paladar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom styles for the slow spin animation */}
      <style jsx global>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  )
}
