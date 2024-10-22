import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IColumnState {
  [key: string]: { width?: number; isHidden?: boolean };
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
      state[colId] = { ...state[colId], isHidden };
    },
  },
});

export const { memoColWidth, memoColHiding } = columnSlice.actions;
export default columnSlice.reducer;
