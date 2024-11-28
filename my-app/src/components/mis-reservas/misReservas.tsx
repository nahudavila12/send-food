"use client";

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { fetchReservationsRequest, fetchReservationsSuccess, removeReservation } from "@/redux/slices/reservationsSlice";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { IReservation } from "@/interfaces/interfaces";

export default function UserReservations() {
  const dispatch = useDispatch();
  const { reservations, loading, error } = useSelector((state: RootState) => state.reservations);
  const { user } = useSelector((state: RootState) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<IReservation | null>(null);

  // Usamos useCallback para estabilizar la referencia de la función
  const fetchUserReservations = useCallback(async (userUuid: string) => {
    dispatch(fetchReservationsRequest());
    try {
      const response = await fetch(`http://localhost:3000/reservations/reservation/${userUuid}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user?.accessToken}`,
        },
      });
  
      if (!response.ok) throw new Error("No se pudieron obtener las reservas");
      const data = await response.json();
  
      // Asegúrate de que los datos recibidos tienen el formato correcto
      const updatedData = data.map((reservation: any) => ({
        ...reservation,
        startTime: new Date(reservation.startTime).toISOString(), // Convierte startTime a ISO string
      }));
  
      dispatch(fetchReservationsSuccess(updatedData));
    } catch {
      toast.error("Hubo un error al obtener las reservas");
    }
  }, [dispatch, user?.accessToken]);  

  
  useEffect(() => {
    if (user?.uuid) {
      fetchUserReservations(user.uuid);
    }
  }, [user, fetchUserReservations]); // Ahora incluimos fetchUserReservations en las dependencias

  // Función para cancelar la reserva
  const cancelReservation = async (reservationId: string) => {
    try {
      const response = await fetch(`/api/reservation/cancel/${reservationId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      });
      if (!response.ok) throw new Error("No se pudo cancelar la reserva");
      dispatch(removeReservation(reservationId));
      toast.success("Reserva cancelada con éxito");
    } catch {
      toast.error("Error al cancelar la reserva");
    }
  };

  // Función para posponer la reserva
  const postponeReservation = async (reservation: IReservation) => {
    try {
      const newStartTime = new Date(reservation.startTime);
      newStartTime.setHours(newStartTime.getHours() + 1);

      const updatedReservation = {
        ...reservation,
        startTime: newStartTime.toISOString(),
      };

      dispatch(fetchReservationsSuccess([updatedReservation]));
      toast.success("Reserva pospuesta con éxito");
    } catch {
      toast.error("Error al posponer la reserva");
    }
  };

  // Función para abrir el modal de cancelación o posposición
  const openModal = (reservation: IReservation) => {
    setSelectedReservation(reservation);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReservation(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Mis Reservas</h1>

      {loading ? (
        <p>Cargando tus reservas...</p>
      ) : error ? (
        <p>{error}</p>
      ) : reservations.length === 0 ? (
        <p>No tienes reservas actualmente.</p>
      ) : (
        <div className="grid gap-6 font-poppins text-primary md:grid-cols-2">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="card">
              <h2>Reserva para mesa {reservation.tableNumber}</h2>
              <p>Fecha: {new Date(reservation.startTime).toLocaleDateString()}</p>
              <p>Hora: {new Date(reservation.startTime).toLocaleTimeString()}</p>
              <div className="flex justify-between">
                <Button
                  onClick={() => openModal(reservation)}
                  className="bg-red-500 hover:bg-red-700"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => postponeReservation(reservation)}
                  className="bg-yellow-500 hover:bg-yellow-700"
                >
                  Posponer
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Cancelación o Posposición */}
      {isModalOpen && selectedReservation && (
        <div className="modal">
          <div className="modal-content">
            <h2>¿Estás seguro de que quieres cancelar esta reserva?</h2>
            <p>{`Mesa: ${selectedReservation.tableNumber}`}</p>
            <p>{`Fecha: ${new Date(selectedReservation.startTime).toLocaleDateString()}`}</p>
            <p>{`Hora: ${new Date(selectedReservation.startTime).toLocaleTimeString()}`}</p>
            <div className="flex justify-between mt-4">
              <Button
                onClick={() => cancelReservation(selectedReservation.id)}
                className="bg-red-500 hover:bg-red-700"
              >
                Confirmar cancelación
              </Button>
              <Button onClick={closeModal} className="bg-gray-500 hover:bg-gray-700">
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
