import { CellKeyDownEvent, ColDef } from 'ag-grid-community';
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

export function selectAllRows(event: CellKeyDownEvent) {
  const allNodes = event.api.getRenderedNodes();
  const areSelected = allNodes.every((node) => node.isSelected());
  event.api.forEachNode((node) => node.setSelected(!areSelected));
}

export function copyToClipboard(event: CellKeyDownEvent) {
  const rowIsSelected = event.node.isSelected();
  if (rowIsSelected) {
    const values = Object.values(event.data);
    navigator.clipboard.writeText(values.join('\t'));
  } else {
    navigator.clipboard.writeText(event.value);
  }
}

export const isCtrlA = (event: KeyboardEvent) =>
  event.ctrlKey && event.code === 'KeyA';

export const isCtrlC = (event: KeyboardEvent) =>
  event.ctrlKey && event.code === 'KeyC';
