import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Usa localStorage por defecto
import authReducer from '../slices/authSlice';
import reservationsReducer from '../slices/reservationsSlice';
import employeesReducer from '../slices/rolesSlice';
import tablesReducer from '../slices/tableSlice';
import paypalReducer from '../slices/paypalSlice';
import ordersReducer from '../slices/ordersSlice';

// Configuración de persistencia
const persistConfig = {
  key: 'root', // Nombre de la clave para el almacenamiento
  storage, // Define que usarás localStorage
};

// Combinamos todos los reducers
const rootReducer = combineReducers({
  auth: authReducer,
  paypal: paypalReducer,
  reservations: reservationsReducer,
  orders: ordersReducer,
  employees: employeesReducer,
  tables: tablesReducer, // Ahora persiste con el resto
});

// Reducer persistente
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production', // DevTools solo en desarrollo
});

// Persistor: se utiliza para gestionar la persistencia
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
