import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { ColDef, ColumnResizedEvent } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { PropsWithChildren, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { extractFieldsFromData } from './services';
import { RootState } from '../../store';
import { addOrUpdateColWidth } from './slices/columnSlice';

export interface IResults {
  [key: string]: string;
}

interface ITableProps extends PropsWithChildren {
  results: IResults[];
}

export default function Table({ results }: ITableProps) {
  const dispatch = useDispatch();
  const colSizes = useSelector((state: RootState) => state.columns);

  const style = useMemo(() => ({ width: '100%', height: '100%' }), []);

  const [rowData, setRowData] = useState<IResults[]>(results);

  const [colDefs, setColDefs] = useState<ColDef<IResults>[]>([
    ...extractFieldsFromData(results, colSizes),
  ]);

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

  return (
    <div className={'ag-theme-quartz-dark'} style={style}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        onColumnResized={onColumnResized}
      />
    </div>
  );
}
