"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDispatch, useSelector } from "react-redux";
import { setTables, changeTableStatus } from "../../redux/slices/tableSlice";
import { RootState } from "@/redux/store/store";

type TableStatus = "disponible" | "reservada" | "ocupada";

type Table = {
  id: string;
  tableNumber: number;
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
  const response = await fetch("http://localhost:3000/table/all");
  if (!response.ok) {
    throw new Error("No se pudo obtener las mesas");
  }
  return response.json();
};

const fetchOrders = async () => {
  const response = await fetch("http://localhost:3000/pedido/estado/completado");
  if (!response.ok) {
    throw new Error("No se pudo obtener las órdenes");
  }
  return response.json();
};

export default function WaiterOrders() {
  const dispatch = useDispatch();
  const tables = useSelector((state: RootState) => state.tables.tables);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedTableNumber, setSelectedTableNumber] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState<TableStatus>("disponible");
  const [isClient, setIsClient] = useState(false);

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

  const assignTablePositions = (tables: Table[], containerWidth: number) => {
    const numColumns = Math.floor(containerWidth / 70);
    return tables.map((table, index) => {
      const col = index % numColumns;
      const row = Math.floor(index / numColumns);
      return {
        ...table,
        x: col * 70,
        y: row * 70,
      };
    });
  };

  const handleChangeTableStatus = () => {
    if (selectedTableNumber === null) return;

    dispatch(changeTableStatus({ tableNumber: selectedTableNumber, newStatus }));

    // Reiniciar el input y el estado seleccionado
    setSelectedTableNumber(null);
    setNewStatus("disponible");
  };

  useEffect(() => {
    setIsClient(true);

    fetchTables()
      .then((data) => {
        const tablesWithPositions = assignTablePositions(data, 500);
        dispatch(setTables(tablesWithPositions)); // Guardamos las mesas en Redux
      })
      .catch((error) => console.error("Error al cargar mesas:", error));

    fetchOrders()
      .then(setOrders)
      .catch((error) => console.error("Error al cargar órdenes:", error));
  }, [dispatch]);

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
          <div className="relative bg-amber-100 rounded-lg p-4" style={{ width: "500px", height: "500px" }}>
            {tables.map((table) => (
              <Button
                key={table.id}
                className={`absolute h-12 w-12 ${getTableColor(table.status)}`}
                style={{
                  top: `${table.y}px`,
                  left: `${table.x}px`,
                }}
              >
                {table.tableNumber}
              </Button>
            ))}
          </div>
        </div>

        {/* Cambiar estado manualmente */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Cambiar Estado de Mesas</h2>
          <Card>
            <CardHeader>
              <CardTitle>Cambiar Estado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="tableNumber" className="block text-sm font-medium mb-2">
                    Número de Mesa:
                  </label>
                  <input
                    type="number"
                    id="tableNumber"
                    value={selectedTableNumber ?? ""}
                    onChange={(e) => setSelectedTableNumber(Number(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Ingrese el número de la mesa"
                  />
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium mb-2">
                    Nuevo Estado:
                  </label>
                  <select
                    id="status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as TableStatus)}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="disponible">Disponible</option>
                    <option value="reservada">Reservada</option>
                    <option value="ocupada">Ocupada</option>
                  </select>
                </div>
                <Button
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={handleChangeTableStatus}
                >
                  Cambiar Estado
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
