import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PayPalState {
  isPaymentSuccessful: boolean;
  paymentError: string | null;
  orderId: string | null;
  approveLink: string | null;  // Agregar approveLink
}

const initialState: PayPalState = {
  isPaymentSuccessful: false,
  paymentError: null,
  orderId: null,
  approveLink: null,  // Inicializar approveLink como null
};

const paypalSlice = createSlice({
  name: 'paypal',
  initialState,
  reducers: {
    setPaymentSuccess: (state, action: PayloadAction<{ orderId: string; approveLink: string }>) => {
      state.isPaymentSuccessful = true;
      state.orderId = action.payload.orderId;
      state.approveLink = action.payload.approveLink;  // Almacenar el approveLink
    },
    setPaymentError: (state, action: PayloadAction<string>) => {
      state.paymentError = action.payload;
    },
    resetPaymentState: (state) => {
      state.isPaymentSuccessful = false;
      state.paymentError = null;
      state.orderId = null;
      state.approveLink = null;  // Limpiar el approveLink al reiniciar
    },
  },
});

export const { setPaymentSuccess, setPaymentError, resetPaymentState } = paypalSlice.actions;
export default paypalSlice.reducer;
