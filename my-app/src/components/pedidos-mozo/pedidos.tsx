"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

type TableStatus = "free" | "reserve" | "ocupied";

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

const initialTables: Table[] = [
  { id: "1", x: 1, y: 1, status: "free" },
  { id: "2", x: 3, y: 1, status: "reserve" },
  { id: "3", x: 5, y: 1, status: "ocupied" },
  { id: "4", x: 1, y: 3, status: "free" },
  { id: "5", x: 3, y: 3, status: "free" },
  { id: "6", x: 5, y: 3, status: "reserve" },
  { id: "7", x: 1, y: 5, status: "ocupied" },
  { id: "8", x: 3, y: 5, status: "free" },
  { id: "9", x: 5, y: 5, status: "free" },
];

const initialOrders: Order[] = [
  {
    id: "1",
    table: "2",
    items: [
      { dish: "Entrada 1", quantity: 2 },
      { dish: "Plato principal 1", quantity: 1 },
    ],
    notes: "Sin cebolla en la entrada",
    status: "Pendiente",
  },
  {
    id: "2",
    table: "5",
    items: [
      { dish: "Plato principal 2", quantity: 3 },
      { dish: "Postre 1", quantity: 3 },
    ],
    notes: "Un postre sin azúcar",
    status: "En proceso",
  },
  {
    id: "3",
    table: "7",
    items: [
      { dish: "Entrada 2", quantity: 1 },
      { dish: "Plato principal 3", quantity: 2 },
      { dish: "Postre 2", quantity: 2 },
    ],
    notes: "Alergias: nueces",
    status: "Completado",
  },
];

export default function WaiterOrders() {
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getTableColor = (status: TableStatus) => {
    switch (status) {
      case "free":
        return "bg-green-500 hover:bg-green-600";
      case "reserve":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "ocupied":
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
          <div className="grid grid-cols-7 gap-2 p-4 bg-amber-100 rounded-lg">
            {tables.map((table) => (
              <Button
                key={table.id}
                className={`h-12 w-12 ${getTableColor(table.status)}`}
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

        {/* Órdenes Recientes */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Órdenes Recientes</h2>
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
                onClick={() => changeTableStatus("free")}
              >
                Disponible
              </Button>
              <Button
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                onClick={() => changeTableStatus("reserve")}
              >
                Reservada
              </Button>
              <Button
                className="w-full bg-red-500 hover:bg-red-600 text-white"
                onClick={() => changeTableStatus("ocupied")}
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
