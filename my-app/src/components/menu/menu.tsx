'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

type Dish = {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  subcategory?: string
  duration?: string;
}

const dishes: Dish[] = [
    { id: '1', name: 'Paella', description: 'Arroz con mariscos y azafrán', price: 18.99, image: '/placeholder.svg?height=100&width=100', category: 'Platos Principales', subcategory: 'Mediterránea', duration: '30 min' },
    { id: '2', name: 'Sushi Variado', description: 'Selección de nigiri y maki', price: 22.99, image: '/placeholder.svg?height=100&width=100', category: 'Platos Principales', subcategory: 'Oriental', duration: '20 min' },
    { id: '3', name: 'Hamburguesa Gourmet', description: 'Carne Angus con queso brie y cebolla caramelizada', price: 16.99, image: '/placeholder.svg?height=100&width=100', category: 'Platos Principales', subcategory: 'Occidental', duration: '15 min' },
    { id: '4', name: 'Pizza Margarita', description: 'Pizza clásica con mozzarella y albahaca fresca', price: 15.99, image: '/placeholder.svg?height=100&width=100', category: 'Platos Principales', subcategory: 'Occidental', duration: '25 min' },
    { id: '5', name: 'Ceviche', description: 'Pescado marinado en cítricos con cebolla y cilantro', price: 14.99, image: '/placeholder.svg?height=100&width=100', category: 'Platos Principales', subcategory: 'Latinoamericano', duration: '15 min' },
    { id: '6', name: 'Tacos al Pastor', description: 'Tortillas con carne de cerdo y piña', price: 9.99, image: '/placeholder.svg?height=100&width=100', category: 'Platos Principales', subcategory: 'Latinoamericano', duration: '10 min' },
    { id: '7', name: 'Ramen', description: 'Sopa japonesa con fideos, cerdo y huevo', price: 12.99, image: '/placeholder.svg?height=100&width=100', category: 'Platos Principales', subcategory: 'Oriental', duration: '20 min' },
    { id: '8', name: 'Pollo Tikka Masala', description: 'Pollo en salsa cremosa con especias', price: 13.99, image: '/placeholder.svg?height=100&width=100', category: 'Platos Principales', subcategory: 'Indio', duration: '25 min' },
    { id: '9', name: 'Falafel', description: 'Croquetas de garbanzos servidas con salsa de yogur', price: 8.99, image: '/placeholder.svg?height=100&width=100', category: 'Platos Principales', subcategory: 'Mediterránea', duration: '15 min' },
    { id: '10', name: 'Asado Argentino', description: 'Carne de res a la parrilla estilo argentino', price: 25.99, image: '/placeholder.svg?height=100&width=100', category: 'Platos Principales', subcategory: 'Latinoamericano', duration: '40 min' },
  
    { id: '11', name: 'Croissant', description: 'Hojaldre de mantequilla al estilo francés', price: 3.99, image: '/placeholder.svg?height=100&width=100', category: 'Pastelería', subcategory: 'Occidental', duration: '15 min' },
    { id: '12', name: 'Baklava', description: 'Dulce de hojaldre con nueces y miel', price: 4.99, image: '/placeholder.svg?height=100&width=100', category: 'Pastelería', subcategory: 'Mediterránea', duration: '20 min' },
    { id: '13', name: 'Pastel de Matcha', description: 'Bizcocho japonés de té verde matcha', price: 5.99, image: '/placeholder.svg?height=100&width=100', category: 'Pastelería', subcategory: 'Oriental', duration: '20 min' },
    { id: '14', name: 'Dulce de Leche', description: 'Caramelo latinoamericano suave y cremoso', price: 4.99, image: '/placeholder.svg?height=100&width=100', category: 'Pastelería', subcategory: 'Latinoamericano', duration: '10 min' },
    { id: '15', name: 'Eclair', description: 'Pastel francés relleno de crema y cubierto de chocolate', price: 4.99, image: '/placeholder.svg?height=100&width=100', category: 'Pastelería', subcategory: 'Occidental', duration: '20 min' },
  
    { id: '16', name: 'Tiramisú', description: 'Postre italiano con café y mascarpone', price: 7.99, image: '/placeholder.svg?height=100&width=100', category: 'Postres', subcategory: 'Occidental', duration: '20 min' },
    { id: '17', name: 'Mochi', description: 'Pastelitos de arroz japoneses', price: 6.99, image: '/placeholder.svg?height=100&width=100', category: 'Postres', subcategory: 'Oriental', duration: '15 min' },
    { id: '18', name: 'Churros con Chocolate', description: 'Churros fritos con chocolate caliente', price: 5.99, image: '/placeholder.svg?height=100&width=100', category: 'Postres', subcategory: 'Latinoamericano', duration: '15 min' },
    { id: '19', name: 'Brownie', description: 'Brownie de chocolate con nueces', price: 5.99, image: '/placeholder.svg?height=100&width=100', category: 'Postres', subcategory: 'Occidental', duration: '20 min' },
    { id: '20', name: 'Flan', description: 'Postre de caramelo con leche', price: 4.99, image: '/placeholder.svg?height=100&width=100', category: 'Postres', subcategory: 'Latinoamericano', duration: '25 min' },
  
    { id: '21', name: 'Agua', description: 'Agua mineral o natural', price: 2.50, image: '/placeholder.svg?height=100&width=100', category: 'Tragos', subcategory: 'Bebidas', duration: '0 min' },
    { id: '22', name: 'Limonada', description: 'Refrescante limonada', price: 3.50, image: '/placeholder.svg?height=100&width=100', category: 'Tragos', subcategory: 'Bebidas', duration: '5 min' },
    { id: '23', name: 'Gaseosa', description: 'Variedad de refrescos', price: 3.00, image: '/placeholder.svg?height=100&width=100', category: 'Tragos', subcategory: 'Bebidas', duration: '0 min' },
    { id: '24', name: 'Margarita', description: 'Cóctel clásico con tequila, limón y triple sec', price: 8.99, image: '/placeholder.svg?height=100&width=100', category: 'Tragos', subcategory: 'Latinoamericano', duration: '5 min' },
    { id: '25', name: 'Martini', description: 'Cóctel de ginebra o vodka con vermut', price: 9.99, image: '/placeholder.svg?height=100&width=100', category: 'Tragos', subcategory: 'Occidental', duration: '5 min' },
    { id: '26', name: 'Sake', description: 'Vino de arroz japonés', price: 7.99, image: '/placeholder.svg?height=100&width=100', category: 'Tragos', subcategory: 'Oriental', duration: '5 min' },
    { id: '27', name: 'Sangría', description: 'Bebida española con vino y frutas', price: 9.99, image: '/placeholder.svg?height=100&width=100', category: 'Tragos', subcategory: 'Mediterránea', duration: '10 min' },
    { id: '28', name: 'Pisco Sour', description: 'Cóctel peruano de pisco, limón y clara de huevo', price: 8.99, image: '/placeholder.svg?height=100&width=100', category: 'Tragos', subcategory: 'Latinoamericano', duration: '5 min' },
    { id: '29', name: 'Caipirinha', description: 'Cóctel brasileño con cachaça, limón y azúcar', price: 7.99, image: '/placeholder.svg?height=100&width=100', category: 'Tragos', subcategory: 'Latinoamericano', duration: '5 min' },
    { id: '30', name: 'Piña Colada', description: 'Cóctel tropical con ron, coco y piña', price: 8.99, image: '/placeholder.svg?height=100&width=100', category: 'Tragos', subcategory: 'Tropical', duration: '5 min'},
  ];
  
  const categories = ['Platos Principales', 'Pastelería', 'Postres', 'Tragos'];
  const subcategories = ['Mediterránea', 'Oriental', 'Occidental', 'Latinoamericano', 'Indio', 'Tropical', 'Bebidas'];
  

  export default function Menu() {
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6">Nuestro Menú</h1>
        <Tabs defaultValue={categories[0]} className="w-full" onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subcategories
                  .filter((subcategory) => dishes.some(dish => dish.category === category && dish.subcategory === subcategory)) // Filtra solo las subcategorías con platos
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
                              <Dialog key={dish.id}>
                                <DialogTrigger asChild>
                                  <div className="flex items-center space-x-4 mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded">
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
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>{dish.name}</DialogTitle>
                                    <DialogDescription>
                                      <Image
                                        src={dish.image}
                                        alt={dish.name}
                                        width={200}
                                        height={200}
                                        className="rounded-lg mx-auto my-4"
                                      />
                                      <p>{dish.description}</p>
                                      <p className="font-bold mt-2">Precio: ${dish.price.toFixed(2)}</p>
                                      <p className="text-sm text-gray-500 mt-1">Duración: {dish.duration}</p>
                                    </DialogDescription>
                                  </DialogHeader>
                                </DialogContent>
                              </Dialog>
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
    );
  }
  