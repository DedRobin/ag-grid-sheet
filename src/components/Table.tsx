import { ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { PropsWithChildren, useMemo, useState } from 'react';

interface IResults {
  [key: string]: string;
}

interface ITableProps extends PropsWithChildren {
  results: IResults[];
}

export default function Table({ results }: ITableProps) {
  const style = useMemo(() => ({ width: '100%', height: '100%' }), []);

  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState<IResults[]>(results);

  // Column Definitions: Defines & controls grid columns.
  const [colDefs, setColDefs] = useState<ColDef<IResults>[]>([
    { field: 'name' },
    { field: 'height' },
    { field: 'mass' },
    { field: 'hair_color' },
    { field: 'skin_color' },
    { field: 'eye_color' },
    { field: 'birth_year' },
    { field: 'gender' },
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
