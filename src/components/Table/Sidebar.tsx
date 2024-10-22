import {
  ColDef,
  GridOptions,
  GridReadyEvent,
  RowSelectedEvent,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { Dispatch, PropsWithChildren, useMemo } from 'react';
import { IResult } from '.';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { memoColHiding } from './slices/columnSlice';

interface ISidebar extends PropsWithChildren {
  fields: ColDef<IResult>[];
  updateCols: Dispatch<React.SetStateAction<ColDef<IResult>[]>>;
}

export default function Sidebar({ fields, updateCols }: ISidebar) {
  const dispatch = useDispatch();
  const colProps = useSelector((state: RootState) => state.columns);
  const rowData = fields.map(({ field }) => ({ field }));
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
    // Memo hiding state when row is selected
    const isHidden = !event.node.isSelected();
    const { field } = event.data;

    updateCols(
      fields.map((col) => {
        if (col.field === field) {
          col.hide = isHidden;
          dispatch(memoColHiding([field, isHidden]));
        }
        return col;
      })
    );
  };

  const onGridReady = (event: GridReadyEvent) => {
    const hiddenCols: string[] = [];

    // Restore column selection from Redux
    event.api.forEachNode((node) => {
      const { field } = node.data;
      const isSelected = !colProps[field]?.isHidden;
      node.setSelected(isSelected);
      if (!isSelected) hiddenCols.push(field);
    });

    // Update parent table by changing its state (using the 'set' function)
    updateCols(
      fields.map((col) => {
        if (col.field && hiddenCols.includes(col.field)) {
          col.hide = true;
        }
        return col;
      })
    );
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
