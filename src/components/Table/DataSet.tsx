import { AgGridReact } from 'ag-grid-react';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IResult } from '.';
import { RootState } from '../../store';
import { ColDef, ColumnResizedEvent } from 'ag-grid-community';
import { memoColWidth } from './slices/columnSlice';
import { extractFieldsFromData } from './services';

interface IDataSet {
  rowData: IResult[];
  colDefs: ColDef<IResult>[];
}

export default function DataSet({ rowData, colDefs }: IDataSet) {
  const dispatch = useDispatch();
  const colProps = useSelector((state: RootState) => state.columns);
  const style = useMemo(() => ({ width: '100%', height: '100%' }), []);
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
