import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Bienvenido a RestaurantePro</h1>
        <p className="text-xl text-gray-600 mb-8">Descubre una experiencia culinaria única</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Image src="/placeholder.svg?height=200&width=300" alt="Plato destacado 1" width={300} height={200} className="w-full" />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">Plato Destacado 1</h3>
              <p className="text-gray-600">Una deliciosa creación de nuestro chef</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Image src="/placeholder.svg?height=200&width=300" alt="Plato destacado 2" width={300} height={200} className="w-full" />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">Plato Destacado 2</h3>
              <p className="text-gray-600">Sabores únicos que te sorprenderán</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Image src="/placeholder.svg?height=200&width=300" alt="Plato destacado 3" width={300} height={200} className="w-full" />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">Plato Destacado 3</h3>
              <p className="text-gray-600">Una experiencia gastronómica inolvidable</p>
            </div>
          </div>
        </div>
        <Link href="/reservations" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          Reserva ahora
        </Link>
      </div>

  )
}