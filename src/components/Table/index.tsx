import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { ColDef, ColumnResizedEvent } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { extractFieldsFromData } from './services';
import { RootState } from '../../store';
import { memoColWidth } from './slices/columnSlice';
import Sidebar from './Sidebar';

export interface IResult {
  [key: string]: string;
}

interface ITableProps<T> extends PropsWithChildren {
  loader: () => Promise<T>;
}

export default function Table({ loader }: ITableProps<IResult[]>) {
  const dispatch = useDispatch();
  const colProps = useSelector((state: RootState) => state.columns);

  const style = useMemo(() => ({ width: '100%', height: '100%' }), []);

  const [rowData, setRowData] = useState<IResult[]>([]);

  const [colDefs, setColDefs] = useState<ColDef<IResult>[]>([]);

  const defaultTableColDef = useMemo<ColDef>(() => {
    return {
      cellDataType: false,
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

  const onGridReady = useCallback(async () => {
    const results = await loader();
    setRowData(results);
    setColDefs([...extractFieldsFromData(results, colProps)]);
  }, [colProps, loader]);

  return (
    <div
      className="grid"
      style={{ width: '100%', height: '100%', display: 'flex', gap: '20px' }}
    >
      <div className={'ag-theme-quartz-dark'} style={style}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultTableColDef}
          onColumnResized={onColumnResized}
          onGridReady={onGridReady}
        />
      </div>
      {colDefs.length ? (
        <Sidebar fields={colDefs} updateColDefs={setColDefs} />
      ) : null}
    </div>
  );
}
