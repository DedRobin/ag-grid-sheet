import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import {
  CellKeyDownEvent,
  ColDef,
  ColumnMovedEvent,
  ColumnResizedEvent,
  RowClickedEvent,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  convertToColDefs,
  copyToClipboard,
  isCtrlA,
  isCtrlC,
  selectAllRows,
} from './services';
import { RootState } from '../../store';
import { memoColOrder, memoColWidth } from './slices/columnSlice';
import Sidebar from './Sidebar';

export interface IResult {
  [key: string]: string;
}

interface ITableProps<T> extends PropsWithChildren {
  loader: () => Promise<T>;
}

export default function Table({ loader }: ITableProps<IResult[]>) {
  const dispatch = useDispatch();
  const columnStore = useSelector((state: RootState) => state.columns);

  const style = useMemo(() => ({ width: '100%', height: '100%' }), []);

  const [rowData, setRowData] = useState<IResult[]>([]);

  const [colDefs, setColDefs] = useState<ColDef<IResult>[]>([]);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      cellDataType: false,
      minWidth: 150,
    };
  }, []);

  const onColumnResized = (event: ColumnResizedEvent) => {
    if (event.finished) {
      const { column } = event;
      if (column) {
        const colWidth = column.getActualWidth();
        const colId = column.getColId();
        dispatch(memoColWidth([colId, colWidth]));
      }
    }
  };

  const onColumnMoved = (event: ColumnMovedEvent) => {
    if (event.finished) {
      const allColumns = event.api.getAllDisplayedColumns().slice(1);
      allColumns.forEach((column, orderIndex) => {
        const colId = column.getColId();
        dispatch(memoColOrder([colId, orderIndex]));
      });
    }
  };

  const onRowClicked = (event: RowClickedEvent) => {
    const pointerEvent = event.event;
    if (pointerEvent instanceof PointerEvent && pointerEvent.ctrlKey) {
      const isSelected = event.node.isSelected();
      event.node.setSelected(!isSelected);
    }
  };

  const onGridReady = useCallback(async () => {
    const results = await loader();
    setRowData(results);
    const colDefs = convertToColDefs(results, columnStore);
    setColDefs(colDefs);
  }, [columnStore, loader]);

  const onCellKeyDown = (event: CellKeyDownEvent) => {
    const keyboardEvent = event.event;
    if (keyboardEvent instanceof KeyboardEvent) {
      if (isCtrlA(keyboardEvent)) selectAllRows(event);
      if (isCtrlC(keyboardEvent)) copyToClipboard(event);
    }
  };

  return (
    <div
      className="grid"
      style={{ width: '100%', height: '100%', display: 'flex', gap: '20px' }}
    >
      <div className={'ag-theme-quartz-dark'} style={style}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          rowSelection={{ mode: 'multiRow' }}
          onColumnResized={onColumnResized}
          onColumnMoved={onColumnMoved}
          onRowClicked={onRowClicked}
          onCellKeyDown={onCellKeyDown}
          onGridReady={onGridReady}
        />
      </div>
      {colDefs.length ? (
        <Sidebar fields={colDefs} updateCols={setColDefs} />
      ) : null}
    </div>
  );
}
