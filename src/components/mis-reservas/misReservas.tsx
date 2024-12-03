"use client";

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { fetchReservationsRequest, fetchReservationsSuccess, removeReservation } from "@/redux/slices/reservationsSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

import { CalendarDays, Clock, Table } from 'lucide-react';
import { IReservation } from "@/interfaces/interfaces";
import { toast } from "../ui/use-toast";

export default function UserReservations() {
  const dispatch = useDispatch();
  const { reservations, loading, error } = useSelector((state: RootState) => state.reservations);
  const { user } = useSelector((state: RootState) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<IReservation | null>(null);

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

      const updatedData = data.map((reservation: any) => ({
        ...reservation,
        startTime: new Date(reservation.startTime).toISOString(),
      }));

      dispatch(fetchReservationsSuccess(updatedData));
    } catch {
      toast({
        title: "Error",
        description: "Hubo un error al obtener las reservas",
        variant: "destructive",
      });
    }
  }, [dispatch, user?.accessToken]);

  useEffect(() => {
    if (user?.uuid) {
      fetchUserReservations(user.uuid);
    }
  }, [user, fetchUserReservations]);

  const cancelReservation = async (reservationId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/reservation/cancel/${reservationId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      });
      if (!response.ok) throw new Error("No se pudo cancelar la reserva");
      dispatch(removeReservation(reservationId));
      toast({
        title: "Éxito",
        description: "Reserva cancelada con éxito",
      });
    } catch {
      toast({
        title: "Error",
        description: "Error al cancelar la reserva",
        variant: "destructive",
      });
    }
    closeModal();
  };

  const postponeReservation = async (reservation: IReservation) => {
    try {
      const newStartTime = new Date(reservation.startTime);
      newStartTime.setHours(newStartTime.getHours() + 1);

      const updatedReservation = {
        ...reservation,
        startTime: newStartTime.toISOString(),
      };

      dispatch(fetchReservationsSuccess([updatedReservation]));
      toast({
        title: "Éxito",
        description: "Reserva pospuesta con éxito",
      });
    } catch {
      toast({
        title: "Error",
        description: "Error al posponer la reserva",
        variant: "destructive",
      });
    }
    closeModal();
  };

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
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">Mis Reservas</h1>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="w-full">
              <CardHeader>
                <Skeleton className="h-4 w-[250px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-[200px] mt-2" />
                <Skeleton className="h-4 w-[150px] mt-2" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-[100px] mr-2" />
                <Skeleton className="h-10 w-[100px]" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : reservations.length === 0 ? (
        <p className="text-center text-gray-500">No tienes reservas actualmente.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reservations.map((reservation) => (
            <Card key={reservation.id} className="w-full"> {/* Cambié `reservation.id` a `reservation.reservIdentification` */}
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Table className="mr-2" />
                  Mesa {reservation.tableNumber}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="flex items-center text-sm text-gray-500 mb-2">
                  <CalendarDays className="mr-2" />
                  {new Date(reservation.startTime).toLocaleDateString()}
                </p>
                <p className="flex items-center text-sm text-gray-500">
                  <Clock className="mr-2" />
                  {new Date(reservation.startTime).toLocaleTimeString()}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  onClick={() => openModal(reservation)}
                  variant="destructive"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => postponeReservation(reservation)}
                  variant="secondary"
                >
                  Posponer
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar cancelación de reserva</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres cancelar esta reserva?
            </DialogDescription>
          </DialogHeader>
          {selectedReservation && (
            <div className="py-4">
              <p className="flex items-center mb-2">
                <Table className="mr-2" />
                Mesa: {selectedReservation.tableNumber}
              </p>
              <p className="flex items-center mb-2">
                <CalendarDays className="mr-2" />
                Fecha: {new Date(selectedReservation.startTime).toLocaleDateString()}
              </p>
              <p className="flex items-center">
                <Clock className="mr-2" />
                Hora: {new Date(selectedReservation.startTime).toLocaleTimeString()}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button onClick={closeModal} variant="outline">
              Cerrar
            </Button>
            <Button
              onClick={() => selectedReservation && cancelReservation(selectedReservation.id)} // Cambié `selectedReservation.id` por `selectedReservation.reservIdentification`
              variant="destructive"
            >
              Confirmar cancelación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
