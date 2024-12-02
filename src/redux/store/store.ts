import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Almacenamiento local
import authReducer from "../slices/authSlice";
import reservationsReducer from "../slices/reservationsSlice";
import employeesReducer from "../slices/rolesSlice";
import tablesReducer from "../slices/tableSlice";
import paypalReducer from "../slices/paypalSlice";
import ordersReducer from "../slices/ordersSlice";
import { combineReducers } from "redux"; // Necesario para el rootReducer

// Combina los reducers
const rootReducer = combineReducers({
  auth: authReducer,
  paypal: paypalReducer,
  reservations: reservationsReducer,
  orders: ordersReducer,
  employees: employeesReducer,
  tables: tablesReducer,
});

// Configuración de Redux Persist
const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configura el store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Necesario para Redux Persist
    }),
});

// Exporta el persistor para envolver la aplicación
export const persistor = persistStore(store);

// Exporta el tipo RootState y AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
