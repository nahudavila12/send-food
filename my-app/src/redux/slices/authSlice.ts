// redux/slices/authSlice.ts
"use client"
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '@/interfaces/interfaces'; // Importamos la interfaz IUser

interface AuthState {
  isAuthenticated: boolean;
  user: IUser | null;
  token: string | null; // Asegúrate de tener el token en el estado
  error: string | null;
  loading: boolean,
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null, // Inicializa el token como null
  error: null,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest(state) {
      state.loading = true;
      state.error = null;
      console.log('Login request iniciado');
    },
    loginSuccess(state, action: PayloadAction<{ user: IUser; token: string }>) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('accessToken', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user)); // Guardar el usuario
      console.log('Login exitoso, token y usuario guardados en localStorage');
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.isAuthenticated = false;
      state.error = action.payload;
      state.loading = false;
      console.log('Error en el login:', action.payload);  // Log para error de login
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null; // Ahora es válido asignar null
      state.error = null;
      state.loading = false;
      localStorage.removeItem('accesToken');
      localStorage.removeItem('user'); // Elimina el usuario de localStorage
      console.log('Usuario cerrado sesión y eliminado del estado');
    },
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout } = authSlice.actions;

export default authSlice.reducer;
