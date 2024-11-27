"use client";
import { IReservation } from '@/interfaces/interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ReservationsState {
  reservations: IReservation[];
  loading: boolean;
  error: string | null;
}

const initialState: ReservationsState = {
  reservations: [],
  loading: false,
  error: null,
};

const reservationsSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {
    fetchReservationsRequest(state) {
      state.loading = true;
    },
    fetchReservationsSuccess(state, action: PayloadAction<IReservation[]>) {
      state.loading = false;
      state.reservations = action.payload;
      state.error = null;
    },
    fetchReservationsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addReservation(state, action: PayloadAction<IReservation>) {
      state.reservations.push(action.payload);
    },
    removeReservation(state, action: PayloadAction<string>) {
      state.reservations = state.reservations.filter(reservation => reservation.tableNumber !== action.payload);
    },
  },
});

export const { fetchReservationsRequest, fetchReservationsSuccess, fetchReservationsFailure, addReservation, removeReservation } = reservationsSlice.actions;

export default reservationsSlice.reducer;
