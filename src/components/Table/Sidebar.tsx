import {
  ColDef,
  GridOptions,
  GridReadyEvent,
  RowSelectedEvent,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { Dispatch, PropsWithChildren, useMemo } from 'react';
import { IResult } from '.';

interface ISidebar extends PropsWithChildren {
  fields: ColDef<IResult>[];
  updateColDefs: Dispatch<React.SetStateAction<ColDef<IResult>[]>>;
}

export default function Sidebar({
  updateColDefs: updateCols,
  fields: colDefs,
}: ISidebar) {
  const rowData = colDefs.map(({ field }) => ({ field }));
  const columnDefs = [
    {
      headerName: 'Column filter',
      field: 'field',
    },
  ];
  const style = useMemo(() => ({ minWidth: '200px', height: '100%' }), []);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      cellDataType: false,
      resizable: false,
      sortable: false,
      flex: 1,
    };
  }, []);

  const onRowSelected = (event: RowSelectedEvent) => {
    const isSelected = event.node.isSelected();
    const { field } = event.data;

    if (colDefs) {
      updateCols(
        colDefs.map((col) => {
          if (col.field === field) {
            col.hide = !isSelected;
          }
          return col;
        })
      );
    }
  };

  const onGridReady = (event: GridReadyEvent) => {
    event.api.forEachNode((node) => node.setSelected(true));
  };

  const gridOptions: GridOptions = {
    rowData,
    columnDefs,
    defaultColDef,
    rowSelection: {
      mode: 'multiRow',
    },
    onGridReady,
    onRowSelected,
  };

  return (
    <div className={'ag-theme-quartz-dark'} style={style}>
      <AgGridReact gridOptions={gridOptions} />
    </div>
  );
}
