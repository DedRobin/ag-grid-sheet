import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ColumnState {
  [key: string]: number;
}

const initialState: ColumnState = {};

export const columnSlice = createSlice({
  name: 'columns',
  initialState,
  reducers: {
    memoColWidth(state, action: PayloadAction<[string, number]>) {
      const [colId, colSize] = action.payload;
      state[colId] = colSize;
    },
  },
});

export const { memoColWidth: addOrUpdateColWidth } = columnSlice.actions;
export default columnSlice.reducer;
