import { ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { PropsWithChildren, useMemo, useState } from 'react';
import { extractFieldNames } from './services';

interface IResults {
  [key: string]: string;
}

interface ITableProps extends PropsWithChildren {
  results: IResults[];
}

export default function Table({ results }: ITableProps) {
  const style = useMemo(() => ({ width: '100%', height: '100%' }), []);

  const [rowData, setRowData] = useState<IResults[]>(results);

  const [colDefs, setColDefs] = useState<ColDef<IResults>[]>([
    ...extractFieldNames(results),
  ]);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
    };
  }, []);

  return (
    <div className={'ag-theme-quartz-dark'} style={style}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
      />
    </div>
  );
}
