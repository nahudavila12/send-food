"use client";
import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet'; 
import 'leaflet/dist/leaflet.css';


const center: LatLngExpression = [-34.61315,  -58.37723]; 


function CenterMap({ center }: { center: LatLngExpression }) {
  const map = useMap();
  map.setView(center); 
  return null;
}

export default function Footer() {
  return (
    <footer className="bg-amber-800 text-amber-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         
          <div>
            <h3 className="text-2xl font-bold mb-4">Contáctanos</h3>
            <p>Calle del Restaurante, 123</p>
            <p>Buenos Aires, CP 1000</p>
            <p>Teléfono: (54) 383422954</p>
            <p>Email: sendfood@gmail.com</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><Link href="/Menu" className="hover:text-amber-300">Menú</Link></li>
              <li><Link href="/reservations" className="hover:text-amber-300">Reservas</Link></li>
              <li><Link href="/about" className="hover:text-amber-300">Sobre Nosotros</Link></li>
              <li><Link href="/contact" className="hover:text-amber-300">Contacto</Link></li>
            </ul>
          </div>


          <div>
            <h3 className="text-2xl font-bold mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300">
                <Facebook size={24} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300">
                <Instagram size={24} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300">
                <Twitter size={24} />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>
        </div>

      
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4">Nuestra Ubicación</h3>
          <div className="h-80 w-full rounded-lg overflow-hidden">
            <MapContainer
              center={center} 
              zoom={15} 
              style={{ height: '100%', width: '100%' }}
            >

              <CenterMap center={center} />

              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={center}>
                <Popup>¡Estamos aquí!</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

     
        <div className="mt-8 text-center">
          <p>&copy; {new Date().getFullYear()} SendFood .</p>
        </div>
      </div>
    </footer>
  );
}
