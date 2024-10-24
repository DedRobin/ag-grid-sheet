import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IColumnState {
  [key: string]: { width?: number; hide?: boolean; orderIndex?: number };
}

const initialState: IColumnState = {};

export const columnSlice = createSlice({
  name: 'columns',
  initialState,
  reducers: {
    memoColWidth(state, action: PayloadAction<[string, number]>) {
      const [colId, width] = action.payload;
      state[colId] = { ...state[colId], width };
    },
    memoColHiding(state, action: PayloadAction<[string, boolean]>) {
      const [colId, isHidden] = action.payload;
      state[colId] = { ...state[colId], hide: isHidden };
    },
    memoColOrder(state, action: PayloadAction<[string, number]>) {
      const [colId, orderIndex] = action.payload;
      state[colId] = { ...state[colId], orderIndex };
    },
  },
});

export const { memoColWidth, memoColHiding, memoColOrder } =
  columnSlice.actions;
export default columnSlice.reducer;
