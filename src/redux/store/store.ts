import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';  
import reservationsReducer from '../slices/reservationsSlice';  
import employeesReducer from '../slices/rolesSlice';  
import tablesReducer from '../slices/tableSlice';  
import paypalReducer from '../slices/paypalSlice';  
import ordersReducer from '../slices/ordersSlice';  
const store = configureStore({
  reducer: {
    auth: authReducer,
    paypal: paypalReducer,
    reservations: reservationsReducer,
    orders: ordersReducer,
    employees: employeesReducer,
    tables: tablesReducer,
  },
});

// Exporta el tipo RootState
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

