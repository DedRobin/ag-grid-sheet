import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ColumnState {
  [key: string]: number;
}

const initialState: ColumnState = {};

export const columWidthSlice = createSlice({
  name: 'columns',
  initialState,
  reducers: {
    addOrUpdateColWidth(state, action: PayloadAction<[string, number]>) {
      const [colId, colSize] = action.payload;
      state[colId] = colSize;
    },
  },
});

export const { addOrUpdateColWidth } = columWidthSlice.actions;
export default columWidthSlice.reducer;
