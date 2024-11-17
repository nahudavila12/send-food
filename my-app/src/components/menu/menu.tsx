'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X } from 'lucide-react'

type Product = {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  subcategory?: string
  duration?: string
}

type OrderItem = {
  product: Product
  quantity: number
  notes: string
}

const dishes: Product[] = [
  { id: '1', name: 'Paella', description: 'Arroz con mariscos y azafrán', price: 18.99, image: 'https://res.cloudinary.com/dcxlhj8h3/image/upload/v1731873898/pexels-nano-erdozain-120534369-28503601_rufcy8.webp', category: 'Platos Principales', subcategory: 'Mediterránea', duration: '30 min' },
  { id: '2', name: 'Sushi Variado', description: 'Selección de nigiri y maki', price: 22.99, image: 'https://res.cloudinary.com/dcxlhj8h3/image/upload/v1731875420/pexels-valeriya-1148087_qrbwsr.jpg', category: 'Platos Principales', subcategory: 'Oriental', duration: '20 min' },
  { id: '3', name: 'Hamburguesa Gourmet', description: 'Carne Angus con queso brie y cebolla caramelizada', price: 16.99, image: 'https://res.cloudinary.com/dcxlhj8h3/image/upload/v1731876111/pexels-pixabay-327158_v5kfjp.webp', category: 'Platos Principales', subcategory: 'Occidental', duration: '15 min' },
  { id: '4', name: 'Pizza Margarita', description: 'Pizza clásica con mozzarella y albahaca fresca', price: 15.99, image: 'https://res.cloudinary.com/dcxlhj8h3/image/upload/v1731876437/pexels-renestrgar-16890470_ggpcuh.jpg', category: 'Platos Principales', subcategory: 'Occidental', duration: '25 min' },
  { id: '5', name: 'Ceviche', description: 'Pescado marinado en cítricos con cebolla y cilantro', price: 14.99, image: 'https://res.cloudinary.com/dcxlhj8h3/image/upload/v1731876488/pexels-nano-erdozain-120534369-28448395_alaary.jpg', category: 'Platos Principales', subcategory: 'Latinoamericano', duration: '15 min' },
  { id: '6', name: 'Tacos al Pastor', description: 'Tortillas con carne de cerdo y piña', price: 9.99, image: 'https://res.cloudinary.com/dcxlhj8h3/image/upload/v1731876790/pexels-roman-odintsov-4955091_qji0w6.jpg', category: 'Platos Principales', subcategory: 'Latinoamericano', duration: '10 min' },
  { id: '7', name: 'Ramen', description: 'Sopa japonesa con fideos, cerdo y huevo', price: 12.99, image: 'https://res.cloudinary.com/dcxlhj8h3/image/upload/v1731878361/pexels-valeriya-28701169_rwr9ab.jpg', category: 'Platos Principales', subcategory: 'Oriental', duration: '20 min' },
  { id: '8', name: 'Pollo Tikka Masala', description: 'Pollo en salsa cremosa con especias', price: 13.99, image: 'https://res.cloudinary.com/dcxlhj8h3/image/upload/v1731876864/pexels-kanchan-prasad-239812050-27848435_zdjrsb.jpg', category: 'Platos Principales', subcategory: 'Indio', duration: '25 min' },
  { id: '9', name: 'Falafel', description: 'Croquetas de garbanzos servidas con salsa de yogur', price: 8.99, image: 'https://res.cloudinary.com/dcxlhj8h3/image/upload/v1731874244/pexels-alesiakozik-6543757_py8buy.webp', category: 'Platos Principales', subcategory: 'Mediterránea', duration: '15 min' },
  { id: '10', name: 'Asado Argentino', description: 'Carne de res a la parrilla estilo argentino', price: 25.99, image: 'https://res.cloudinary.com/dcxlhj8h3/image/upload/v1731876927/pexels-cristian-rojas-8279981_tru0c4.jpg', category: 'Platos Principales', subcategory: 'Latinoamericano', duration: '40 min' },
  { id: '11', name: 'Croissant', description: 'Hojaldre de mantequilla al estilo francés', price: 3.99, image: 'https://res.cloudinary.com/dcxlhj8h3/image/upload/v1731876933/pexels-valeriya-1510682_iv8wqn.jpg', category: 'Pastelería', subcategory: 'Occidental', duration: '15 min' },
  { id: '12', name: 'Baklava', description: 'Dulce de hojaldre con nueces y miel', price: 4.99, image: 'https://res.cloudinary.com/dcxlhj8h3/image/upload/v1731877150/pexels-valeriya-10038709_es6btf.jpg', category: 'Pastelería', subcategory: 'Mediterránea', duration: '20 min' },
  { id: '13', name: 'Pastel de Matcha', description: 'Bizcocho japonés de té verde matcha', price: 5.99, image: 'https://res.cloudinary.com/dcxlhj8h3/image/upload/v1731877155/pexels-eva-bronzini-6833864_qsmcuz.jpg', category: 'Pastelería', subcategory: 'Oriental', duration: '20 min' },
  { id: '14', name: 'Dulce de Leche', description: 'Caramelo argentino suave y cremoso', price: 4.99, image: 'https://res.cloudinary.com/dcxlhj8h3/image/upload/v1731877207/pexels-roman-odintsov-5845848_myao1e.jpg', category: 'Pastelería', subcategory: 'Latinoamericano', duration: '10 min' },
  { id: '15', name: 'Eclair', description: 'Pastel francés relleno de crema y cubierto de chocolate', price: 4.99, image: 'https://res.cloudinary.com/dcxlhj8h3/image/upload/v1731877237/pexels-valeriya-29380166_e02qwz.jpg', category: 'Pastelería', subcategory: 'Occidental', duration: '20 min' },
  { id: '16', name: 'Tiramisú', description: 'Postre italiano con café y mascarpone', price: 7.99, image: 'https://res.cloudinary.com/dcxlhj8h3/image/upload/v1731877296/pexels-rachel-claire-6126245_hllcaq.jpg', category: 'Postres', subcategory: 'Occidental', duration: '20 min' },
  { id: '17', name: 'Mochi', description: 'Pastelitos de arroz japoneses', price: 6.99, image: 'https://res.cloudinary.com/dcxlhj8h3/image/upload/v1731877320/pexels-nadin-sh-78971847-25315535_cmo8or.jpg', category: 'Postres', subcategory: 'Oriental', duration: '15 min' },
  { id: '18', name: 'Churros con Chocolate', description: 'Churros fritos con chocolate caliente', price: 5.99, image: 'https://res.cloudinary.com/dcxlhj8h3/image/upload/v1731877346/pexels-leeloothefirst-5255955_nnwl3n.jpg', category: 'Postres', subcategory: 'Latinoamericano', duration: '15 min' },
  { id: '19', name: 'Brownie', description: 'Brownie de chocolate con nueces', price: 5.99, image: 'https://res.cloudinary.com/dcxlhj8h3/image/upload/v1731877360/pexels-marta-dzedyshko-1042863-2067396_ewh2ws.jpg', category: 'Postres', subcategory: 'Occidental', duration: '20 min' },
  { id: '20', name: 'Flan', description: 'Postre de caramelo con leche', price: 4.99, image: 'https://res.cloudinary.com/dcxlhj8h3/image/upload/v1731877442/pexels-amar-19786219_olmof5.jpg', category: 'Postres', subcategory: 'Latinoamericano', duration: '25 min' },
  { id: '21', name: 'Agua', description: 'Agua mineral o natural', price: 2.50, image: 'https://res.cloudinary.com/dcxlhj8h3/image/upload/v1731877467/pexels-alexazabache-3766180_ny9rh9.jpg', category: 'Tragos', subcategory: 'Bebidas', duration: '0 min' },
  { id: '22', name: 'Limonada', description: 'Refrescante limonada', price: 3.50, image: 'https://res.cloudinary.com/dcxlhj8h3/image/upload/v1731878124/pexels-juliazolotova-1320997_qvy1oj.jpg', category: 'Tragos', subcategory: 'Bebidas', duration: '5 min' },
  { id: '23', name: 'Gaseosa', description: 'Variedad de refrescos', price: 3.00, image: 'https://res.cloudinary.com/dcxlhj8h3/image/upload/v1731877499/pexels-alleksana-4113670_xybec4.jpg', category: 'Tragos', subcategory: 'Bebidas', duration: '0 min' },
  { id: '24', name: 'Margarita', description: 'Cóctel clásico con tequila, limón y triple sec', price: 8.99, image: 'https://res.cloudinary.com/dcxlhj8h3/image/upload/v1731877549/pexels-kimvanvuuren-1590154_rcycnv.jpg', category: 'Tragos', subcategory: 'Latinoamericano', duration: '5 min' },
  { id: '25', name: 'Martini', description: 'Cóctel de ginebra o vodka con vermut', price: 9.99, image: 'https://res.cloudinary.com/dcxlhj8h3/image/upload/v1731877554/pexels-taryn-elliott-4786627_cahvfq.jpg', category: 'Tragos', subcategory: 'Occidental', duration: '5 min' },
  { id: '26', name: 'Sake', description: 'Vino de arroz japonés', price: 7.99, image: 'https://res.cloudinary.com/dcxlhj8h3/image/upload/v1731877582/pexels-muhamad-khoirul-anam-352732021-18198515_ov6nkm.jpg', category: 'Tragos', subcategory: 'Oriental', duration: '5 min' },
  { id: '27', name: 'Sangría', description: 'Bebida española con vino y frutas', price: 9.99, image: 'https://res.cloudinary.com/dcxlhj8h3/image/upload/v1731877898/pexels-lina-1459338_r4qjpe.jpg', category: 'Tragos', subcategory: 'Mediterránea', duration: '10 min' },
  { id: '28', name: 'Pisco Sour', description: 'Cóctel peruano de pisco, limón y clara de huevo', price: 8.99, image: 'https://res.cloudinary.com/dcxlhj8h3/image/upload/v1731877902/pexels-blue-16806422_wpffvn.jpg', category: 'Tragos', subcategory: 'Latinoamericano', duration: '5 min' },
  { id: '29', name: 'Caipirinha', description: 'Cóctel brasileño con cachaça, limón y azúcar', price: 7.99, image: 'https://res.cloudinary.com/dcxlhj8h3/image/upload/v1731877949/pexels-jessica-povoa-417941005-15470502_ovlhut.jpg', category: 'Tragos', subcategory: 'Latinoamericano', duration: '5 min' },
  { id: '30', name: 'Piña Colada', description: 'Cóctel tropical con ron, coco y piña', price: 8.99, image: 'https://res.cloudinary.com/dcxlhj8h3/image/upload/v1731877996/pexels-marceloverfe-28575243_pqi9qe.jpg', category: 'Tragos', subcategory: 'Tropical', duration: '5 min'},
]

const categories = ['Platos Principales', 'Pastelería', 'Postres', 'Tragos']
const subcategories = ['Mediterránea', 'Oriental', 'Occidental', 'Latinoamericano', 'Indio', 'Tropical', 'Bebidas']

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0])
  const [selectedDish, setSelectedDish] = useState<Product | null>(null)
  const [order, setOrder] = useState<OrderItem[]>([])
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')

  const openModal = (dish: Product) => {
    setSelectedDish(dish)
    setQuantity(1)
    setNotes('')
  }

  const closeModal = () => {
    setSelectedDish(null)
  }

  const addToOrder = () => {
    if (selectedDish) {
      const existingItemIndex = order.findIndex(item => item.product.id === selectedDish.id)
      if (existingItemIndex !== -1) {
        const updatedOrder = [...order]
        updatedOrder[existingItemIndex].quantity += quantity
        updatedOrder[existingItemIndex].notes += (updatedOrder[existingItemIndex].notes ? '\n' : '') + notes
        setOrder(updatedOrder)
      } else {
        setOrder([...order, { product: selectedDish, quantity, notes }])
      }
      closeModal()
    }
  }

  const removeFromOrder = (index: number) => {
    const updatedOrder = order.filter((_, i) => i !== index)
    setOrder(updatedOrder)
  }

  const submitOrder = () => {
    console.log('Orden enviada:', order)
    // Aquí puedes agregar la lógica para enviar la orden al servidor
    setOrder([])
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center text-secondary mb-6">Nuestro Menú</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Tabs defaultValue={categories[0]} className="w-full" onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            {categories.map((category) => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subcategories
                    .filter((subcategory) => dishes.some(dish => dish.category === category && dish.subcategory === subcategory))
                    .map((subcategory) => (
                      <Card key={subcategory}>
                        <CardHeader>
                          <CardTitle>{subcategory}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-[300px] w-full">
                            {dishes
                              .filter(dish => dish.category === category && dish.subcategory === subcategory)
                              .map((dish) => (
                                <div
                                  key={dish.id}
                                  onClick={() => openModal(dish)}
                                  className="flex items-center space-x-4 mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded"
                                >
                                  <Image
                                    src={dish.image}
                                    alt={dish.name}
                                    width={50}
                                    height={50}
                                    className="rounded-full"
                                  />
                                  <div>
                                    <h3 className="font-semibold">{dish.name}</h3>
                                    <p className="text-sm text-gray-500">${dish.price.toFixed(2)}</p>
                                    <p className="text-xs text-gray-400">Duración: {dish.duration}</p>
                                  </div>
                                </div>
                              ))}
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Orden Actual</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full">
                {order.map((item, index) => (
                  <div key={index} className="flex justify-between items-start mb-4 p-2 border-b">
                    <div>
                      <p className="font-semibold">{item.product.name}</p>
                      <p className="text-sm">Cantidad: {item.quantity}</p>
                      <p className="text-sm text-gray-500">${(item.product.price * item.quantity).toFixed(2)}</p>
                      {item.notes && <p className="text-xs text-gray-400">Notas: {item.notes}</p>}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFromOrder(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </ScrollArea>
              <div className="mt-4">
                <p className="font-bold text-lg">Total: ${order.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2)}</p>
                <Button className="w-full mt-2" onClick={submitOrder} disabled={order.length === 0}>
                  Enviar Orden
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedDish && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">{selectedDish.name}</h2>
            <Image
              src={selectedDish.image}
              alt={selectedDish.name}
              width={200}
              height={200}
              className="rounded-lg mx-auto my-4"
            />
            <p>{selectedDish.description}</p>
            <p className="font-bold mt-2">Precio: ${selectedDish.price.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">Duración: {selectedDish.duration}</p>
            <div className="mt-4">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Cantidad
              </label>
              <Input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                min="1"
                className="mt-1"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notas especiales
              </label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1"
                placeholder="Ej: Sin cebolla, cocción media, etc."
              />
            </div>
            <Button className="w-full mt-4" onClick={addToOrder}>
              Agregar a la Orden
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}