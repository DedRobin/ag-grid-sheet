import { ColDef } from 'ag-grid-community';
import { IResult } from '.';
import { IColumnState } from './slices/columnSlice';

export function extractFieldsFromData(
  results: { [key: string]: string }[],
  colProps: IColumnState
): ColDef<IResult>[] {
  const colDefs: ColDef<IResult>[] = [];

  const resultFields = Object.keys(results[0]);
  resultFields.forEach((field) => {
    const colDef: ColDef = {
      field,
      ...colProps[field],
    };

    if (!colProps[field]?.width) colDef.flex = 1;

    colDefs.push(colDef);
  });

  return colDefs;
}
