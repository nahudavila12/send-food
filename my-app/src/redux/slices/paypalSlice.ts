
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PayPalState {
  isPaymentSuccessful: boolean;
  paymentError: string | null;
  orderId: string | null;
}

const initialState: PayPalState = {
  isPaymentSuccessful: false,
  paymentError: null,
  orderId: null,
};

const paypalSlice = createSlice({
  name: 'paypal',
  initialState,
  reducers: {
    setPaymentSuccess: (state, action: PayloadAction<string>) => {
      state.isPaymentSuccessful = true;
      state.orderId = action.payload;
    },
    setPaymentError: (state, action: PayloadAction<string>) => {
      state.paymentError = action.payload;
    },
    resetPaymentState: (state) => {
      state.isPaymentSuccessful = false;
      state.paymentError = null;
      state.orderId = null;
    },
  },
});

export const { setPaymentSuccess, setPaymentError, resetPaymentState } = paypalSlice.actions;
export default paypalSlice.reducer;
