import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';  
import reservationsReducer from '../slices/reservationsSlice';  
import employeesReducer from '../slices/rolesSlice';  
import tablesReducer from '../slices/tableSlice';  

const store = configureStore({
  reducer: {
    auth: authReducer,
    reservations: reservationsReducer,
    employees: employeesReducer,
    tables: tablesReducer,
  },
});

// Exporta el tipo RootState
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

