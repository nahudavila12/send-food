"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

type TableStatus = "disponible" | "reservada" | "ocupada";

type Table = {
  id: string;
  x: number;
  y: number;
  status: TableStatus;
};

type OrderItem = {
  dish: string;
  quantity: number;
};

type Order = {
  id: string;
  table: string;
  items: OrderItem[];
  notes: string;
  status: "Pendiente" | "En proceso" | "Completado";
};

const fetchTables = async () => {
  const response = await fetch("http://localhost:3000/table/all"); // Cambiar la URL por la de tu API
  if (!response.ok) {
    throw new Error("No se pudo obtener las mesas");
  }
  return response.json();
};

const fetchOrders = async () => {
  const response = await fetch("http://localhost:3000/pedido/estado/completado"); // Cambiar la URL por la de tu API
  if (!response.ok) {
    throw new Error("No se pudo obtener las órdenes");
  }
  return response.json();
};

export default function WaiterOrders() {
  const [tables, setTables] = useState<Table[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Obtener mesas y órdenes al cargar
    fetchTables()
      .then(setTables)
      .catch((error) => console.error(error));
    
    fetchOrders()
      .then(setOrders)
      .catch((error) => console.error(error));
  }, []);

  const getTableColor = (status: TableStatus) => {
    switch (status) {
      case "disponible":
        return "bg-green-500 hover:bg-green-600";
      case "reservada":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "ocupada":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const openModal = (table: Table) => {
    setSelectedTable(table);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTable(null);
    setIsModalOpen(false);
  };

  const changeTableStatus = (newStatus: TableStatus) => {
    if (selectedTable) {
      setTables((prevTables) =>
        prevTables.map((table) =>
          table.id === selectedTable.id ? { ...table, status: newStatus } : table
        )
      );
      closeModal();
    }
  };

  if (!isClient) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        ¡Bienvenido al sistema de mesas!
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Estado de las Mesas */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Estado de las Mesas</h2>
          <div className="relative bg-amber-100 rounded-lg p-4">
            {/* Cuadrícula dinámica de mesas */}
            {tables.map((table) => (
              <Button
                key={table.id}
                className={`absolute h-12 w-12 ${getTableColor(table.status)}`}
                style={{
                  top: `${table.y * 50}px`,
                  left: `${table.x * 50}px`,
                }}
                onClick={() => openModal(table)}
              >
                {table.id}
              </Button>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span>Disponible</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
              <span>Reservada</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
              <span>Ocupada</span>
            </div>
          </div>
        </div>

        {/* Órdenes Listas */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Órdenes Listas</h2>
          <Card>
            <CardHeader>
              <CardTitle>Órdenes</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full">
                {orders.map((order) => (
                  <div key={order.id} className="mb-4 p-4 border-b">
                    <h3 className="font-semibold">Mesa {order.table}</h3>
                    <ul className="list-disc list-inside">
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.quantity}x {item.dish}
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm text-gray-600 mt-2">
                      Notas: {order.notes}
                    </p>
                    <p className="text-sm font-semibold mt-1">
                      Estado: {order.status}
                    </p>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedTable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">
              Cambiar estado de Mesa {selectedTable.id}
            </h2>
            <p className="mb-4">Estado actual: {selectedTable.status}</p>
            <div className="space-y-3">
              <Button
                className="w-full bg-green-500 hover:bg-green-600 text-white"
                onClick={() => changeTableStatus("disponible")}
              >
                Disponible
              </Button>
              <Button
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                onClick={() => changeTableStatus("reservada")}
              >
                Reservada
              </Button>
              <Button
                className="w-full bg-red-500 hover:bg-red-600 text-white"
                onClick={() => changeTableStatus("ocupada")}
              >
                Ocupada
              </Button>
            </div>
            <Button
              className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-black"
              onClick={closeModal}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
