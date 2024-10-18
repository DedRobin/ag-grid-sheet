import { ColDef } from 'ag-grid-community';
import { IResults } from '.';

export function extractFieldsFromData(
  results: { [key: string]: string }[],
  colSizes: { [key: string]: number }
): ColDef<IResults>[] {
  const fields: ColDef<IResults>[] = [];

  const headerNames = Object.keys(results[0]);
  headerNames.forEach((field) => {
    fields.push(
      field in colSizes ? { field, width: colSizes[field] } : { field, flex: 1 }
    );
  });

  return fields;
}
