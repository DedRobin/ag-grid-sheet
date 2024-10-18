import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { ColDef, ColumnResizedEvent } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { extractFieldsFromData } from './services';
import { RootState } from '../../store';
import { addOrUpdateColWidth } from './slices/columnSlice';

export interface IResult {
  [key: string]: string;
}

interface ITableProps<T> extends PropsWithChildren {
  loader: () => Promise<T>;
}

export default function Table({ loader }: ITableProps<IResult[]>) {
  const dispatch = useDispatch();
  const colSizes = useSelector((state: RootState) => state.columns);

  const style = useMemo(() => ({ width: '100%', height: '100%' }), []);

  const [rowData, setRowData] = useState<IResult[]>([]);

  const [colDefs, setColDefs] = useState<ColDef<IResult>[]>([]);

  const defaultColDef = useMemo<ColDef>(() => {
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
        dispatch(addOrUpdateColWidth([colId, colWidth]));
      }
    }
  };

  const onGridReady = useCallback(async () => {
    const results = await loader();
    setRowData(results);
    setColDefs([...extractFieldsFromData(results, colSizes)]);
  }, [colSizes, loader]);

  return (
    <div className={'ag-theme-quartz-dark'} style={style}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        onColumnResized={onColumnResized}
        onGridReady={onGridReady}
      />
    </div>
  );
}
