import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import {
  ColDef,
  ColumnMovedEvent,
  ColumnResizedEvent,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { convertToColDefs } from './services';
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
      const allColumns = event.api.getAllDisplayedColumns();
      allColumns.forEach((column, orderIndex) => {
        const colId = column.getColId();
        dispatch(memoColOrder([colId, orderIndex]));
      });
    }
  };

  const onGridReady = useCallback(async () => {
    const results = await loader();
    setRowData(results);
    const colDefs = convertToColDefs(results, columnStore);
    setColDefs(colDefs);
  }, [columnStore, loader]);

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
          onColumnResized={onColumnResized}
          onColumnMoved={onColumnMoved}
          onGridReady={onGridReady}
        />
      </div>
      {colDefs.length ? (
        <Sidebar fields={colDefs} updateCols={setColDefs} />
      ) : null}
    </div>
  );
}
