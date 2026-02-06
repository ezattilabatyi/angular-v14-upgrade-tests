import { TranslationType } from '@app/shared/types/shared.types';
import {ColDef, Column, ColumnState} from 'ag-grid-community';

export declare namespace GridConfig {

  type DefaultEditorType = 'agTextCellEditor' | 'agPopupTextCellEditor' | 'agLargeTextCellEditor' | 'agSelectCellEditor'
    | 'agPopupSelectCellEditor' | 'agRichSelectCellEditor';

  type EditorType = 'numericEditor';
  type FilterType = 'agDateColumnFilter' | 'containsFilter' | 'setFilter' | 'dateFilter' | 'intervalFilter' | 'number';

  interface ColumnDef extends ColDef {
    filter?: FilterType | boolean;
    cellEditor?: EditorType | DefaultEditorType;
    sort?: 'asc' | 'desc';
    children?: ColumnDef[];
  }

  interface TypedColumnDef<T> extends ColumnDef {
    field?: keyof T & string;
    tooltipField?: keyof T & string;
    children?: TypedColumnDef<T>[];
  }

  type CustomComponents = {
    [p in EditorType | FilterType]: Function;
  };

  interface FrameworkComponent extends Partial<CustomComponents> {}
}

