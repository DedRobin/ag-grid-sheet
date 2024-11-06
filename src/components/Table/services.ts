import {
  CellKeyDownEvent,
  ColDef,
  ISelectCellEditorParams,
} from 'ag-grid-community';
import { IResult } from '.';
import { IColumnState } from './slices/columnSlice';
import { isNotEmptyArray } from '../../tools/array';

export function convertToColDefs(
  results: { [key: string]: string }[],
  columnStore: IColumnState
): ColDef<IResult>[] {
  const colDefs: ColDef<IResult>[] = new Array(results.length);

  const resultFields = Object.entries(results[0]);
  resultFields.forEach((entry, defaultIndex) => {
    const [field, data] = entry;
    const colProps = { ...columnStore[field] };
    delete colProps.orderIndex;

    const colDef: ColDef = {
      field,
      ...colProps,
      editable: isNotEmptyArray(data),
      cellEditor: isNotEmptyArray(data) ? 'agSelectCellEditor' : undefined,
      cellEditorParams: isNotEmptyArray(data)
        ? ({
            values: data,
          } as ISelectCellEditorParams)
        : undefined,
    };

    if (!columnStore[field]?.width) colDef.flex = 1;

    const storedIndex = columnStore[field]?.orderIndex;

    colDefs[storedIndex ?? defaultIndex] = colDef;
  });

  return colDefs;
}

export function convertToValidRowData(data: IResult[]) {
  return data.map((result) => {
    for (const field in result) {
      if (isNotEmptyArray(result[field])) {
        result[field] = result[field][0]; // 0 is temp. Index must be received from global state
      }
    }
    return result;
  });
}

export function selectAllRows(event: CellKeyDownEvent) {
  const allNodes = event.api.getRenderedNodes();
  const areSelected = allNodes.every((node) => node.isSelected());
  event.api.forEachNode((node) => node.setSelected(!areSelected));
}

export function copyToClipboard(event: CellKeyDownEvent) {
  const selectedNodes = event.api.getSelectedNodes();
  if (selectedNodes.length >= 2) {
    const rowValues: Array<unknown> = [];
    selectedNodes.forEach((node) => {
      const values = Object.values(node.data);
      rowValues.push(values.join('\t'));
    });
    navigator.clipboard.writeText(rowValues.join('\n'));
  } else {
    const rowIsSelected = event.node.isSelected();
    if (rowIsSelected) {
      const values = Object.values(event.data);
      navigator.clipboard.writeText(values.join('\t'));
    } else {
      navigator.clipboard.writeText(event.value);
    }
  }
}

export const isCtrlA = (event: KeyboardEvent) =>
  event.ctrlKey && event.code === 'KeyA';

export const isCtrlC = (event: KeyboardEvent) =>
  event.ctrlKey && event.code === 'KeyC';
