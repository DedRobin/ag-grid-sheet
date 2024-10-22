import { ColDef } from 'ag-grid-community';
import { IResult } from '.';
import { IColumnState } from './slices/columnSlice';

export function extractFieldsFromData(
  results: { [key: string]: string }[],
  colProps: IColumnState
): ColDef<IResult>[] {
  const fields: ColDef<IResult>[] = [];

  const headerNames = Object.keys(results[0]);
  headerNames.forEach((field) => {
    fields.push(
      field in colProps
        ? { field, width: colProps[field].width }
        : { field, flex: 1 }
    );
  });

  return fields;
}
