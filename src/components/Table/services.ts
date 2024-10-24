import { ColDef } from 'ag-grid-community';
import { IResult } from '.';
import { IColumnState } from './slices/columnSlice';

export function convertToColDefs(
  results: { [key: string]: string }[],
  columnStore: IColumnState
): ColDef<IResult>[] {
  const colDefs: ColDef<IResult>[] = new Array(results.length);

  const resultFields = Object.keys(results[0]);
  resultFields.forEach((field, defaultIndex) => {
    const colProps = { ...columnStore[field] };
    delete colProps.orderIndex;

    const colDef: ColDef = {
      field,
      ...colProps,
    };

    if (!columnStore[field]?.width) colDef.flex = 1;

    const storedIndex = columnStore[field]?.orderIndex;

    colDefs[storedIndex ?? defaultIndex] = colDef;
  });

  return colDefs;
}
