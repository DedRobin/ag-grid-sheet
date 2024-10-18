import { ColDef } from 'ag-grid-community';
import { IResult } from '.';

export function extractFieldsFromData(
  results: { [key: string]: string }[],
  colSizes: { [key: string]: number }
): ColDef<IResult>[] {
  const fields: ColDef<IResult>[] = [];

  const headerNames = Object.keys(results[0]);
  headerNames.forEach((field) => {
    fields.push(
      field in colSizes ? { field, width: colSizes[field] } : { field, flex: 1 }
    );
  });

  return fields;
}
