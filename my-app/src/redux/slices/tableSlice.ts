"use client"
import { ITable, ITableState } from '@/interfaces/interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface TablesState {
  tables: ITable[];
  loading: boolean;
  error: string | null;
}

const initialState: TablesState = {
  tables: [],
  loading: false,
  error: null,
};

const tablesSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {
    fetchTablesRequest(state) {
      state.loading = true;
    },
    fetchTablesSuccess(state, action: PayloadAction<ITable[]>) {
      state.loading = false;
      state.tables = action.payload;
      state.error = null;
    },
    fetchTablesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    updateTableStatus(state, action: PayloadAction<{ tableNumber: number; status: ITableState }>) {
      const { tableNumber, status } = action.payload;
      const table = state.tables.find(t => t.tableNumber === tableNumber);
      if (table) {
        table.status = status;
      }
    },
  },
});

export const { fetchTablesRequest, fetchTablesSuccess, fetchTablesFailure, updateTableStatus } = tablesSlice.actions;

export default tablesSlice.reducer;
