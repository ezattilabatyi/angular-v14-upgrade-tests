import {
  BaseExportParams,
  CellClassParams,
  ColDef,
  CsvExportParams,
  GetContextMenuItemsParams,
  GridApi,
  ColumnApi,
  GridOptions,
  ITooltipParams,
  MenuItemDef,
  ProcessCellForExportParams,
  ValueFormatterParams,
  ValueGetterParams,
  ColumnState,
  CellStyle,
  GridSizeChangedEvent, RowClassParams
} from 'ag-grid-community';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { GridConfig } from '@app/shared/components/ag-grid/ag-grid-config.type';
import { FormatNumberPipe } from '@app/shared/pipes/format-number.pipe';

import * as moment from 'moment';
import * as _ from 'lodash';
import { EnumPipe } from '@app/shared/pipes/enum.pipe';
import { TimeFormatService } from '@app/shared/services/time-format.service';
import { TranslationType } from '@app/shared/types/shared.types';
import NumberFormatOptions = Intl.NumberFormatOptions;

@Injectable()
export class AgGridService {
  public defaultGridOptions: GridOptions;
  private frameworkComponents: GridConfig.FrameworkComponent = {};

  public static getCellDate(cellValue: string, format: string = 'YYYY-MM-DD'): moment.Moment {
    return moment(cellValue, format);
  }

  public static defaultFilterParams(): {} {
    return {
      newRowsAction: 'keep',
      clearButton: true,
      selectAllOnMiniFilter: true
    };
  }

  public fieldValueFormatter(params: ValueFormatterParams | ValueGetterParams, translateKey: string, interpolateParams?: any, customHeaderIdentifier?: string): string {
    const headerIdentifier: string | undefined = customHeaderIdentifier || params.colDef.field;
    if (!!interpolateParams) {
      return params && params.data && headerIdentifier && params.data[headerIdentifier] ? params.data[headerIdentifier]
      : '';
    } else {
      return params && params.data && headerIdentifier && params.data[headerIdentifier] ?
        params.data[headerIdentifier] : '';
    }
  }

  public static dateFilterParams(): {} {
    return {
      newRowsAction: 'keep',
      clearButton: true,
      comparator: (filterLocalDateAtMidnight: Date, cellValue: string): number => {
        const cellDate: moment.Moment = AgGridService.getCellDate(cellValue);
        if (cellDate.isBefore(filterLocalDateAtMidnight)) {
          return -1;
        } else if (cellDate.isAfter(filterLocalDateAtMidnight)) {
          return 1;
        } else {
          return 0;
        }
      }
    };
  }

  public static getDefaultExportParams(): CsvExportParams {
    return {
      processCellCallback: (params: ProcessCellForExportParams): string => {
        // TODO review: I guess numeric values should not be formatted, so ...
        if (typeof params.value === 'number') {
          return params.value as unknown as string;
        }

        // export with formatted text
        const colDef: ColDef = params.column.getColDef();
        if (colDef.valueFormatter) {
          // @ts-ignore
          return colDef.valueFormatter({ ...params, data: params.node && params.node.data || {}, colDef });
        }

        return params.value;
      },
      columnGroups: true,
    };
  }


  private static getColumnClass(column: GridConfig.ColumnDef): typeof column.cellClass {
    let columnClass: string;
    if (!!column.filter && typeof column.cellClass !== 'function') {
      if (column.filter === 'dateFilter' || column.filter === 'intervalFilter') {
        columnClass = 'ips-text-align--date';
      } else if (column.filter === 'containsFilter' && _.get(column, 'filterParams.type', null) === 'number') {
        columnClass = 'ips-text-align--number';
      }

      // @ts-ignore
      if (!!columnClass || !!column.cellClass) {
        // @ts-ignore
        return _.remove(_.flatten([columnClass, column.cellClass]), undefined);
      }
    }
    return column.cellClass;
  }

  constructor(private formatNumberPipe: FormatNumberPipe,
              private readonly enumPipe: EnumPipe,
              private timeFormatService: TimeFormatService,
  ) {
    this.defaultGridOptions = {
      rowSelection: 'single',
      rowHeight: 30,
      headerHeight: 30,
      paginationPageSize: 50,
      cacheBlockSize: 50,
      maxBlocksInCache: 100,
      suppressCellSelection: true,
      rowDeselection: true,
      rowData: [],
      overlayNoRowsTemplate: this.getOverlayNoRowsTemplate(),
      overlayLoadingTemplate: this.getOverlayLoadingTemplate(),
      singleClickEdit: false,
      stopEditingWhenGridLosesFocus: true,
      enterMovesDownAfterEdit: true,
      minColWidth: 50,
      suppressMovableColumns: true,
      enableBrowserTooltips: true,
      suppressContextMenu: false,
      defaultExportParams: AgGridService.getDefaultExportParams(),
      defaultColDef: {
        resizable: true,
        comparator: (a: Date | string | number, b: Date | string | number): number => {
          // todo review
          if (a === null && b !== null) {
            return -1;
          } else if (a !== null && b === null) {
            return 1;
          } else if (a === null && b === null) {
            return 0;
          }

          if (a instanceof Date && b instanceof Date) {
            return a.getTime() - b.getTime();
          } else if (typeof a === 'number' && typeof b === 'number') {
            return a - b;
          } else {
            return (`${ a }`).toLowerCase().localeCompare((`${ b }`).toLowerCase());
          }
        }
      },
      getContextMenuItems: (params: GetContextMenuItemsParams): MenuItemDef[] => this.getGridExportContextMenuItems(params.api),
    };
  }

  private doGridCreation(options: GridOptions): GridOptions {
    const result: GridOptions = _.assign({}, this.defaultGridOptions, options);
    this.frameworkComponents = _.assign({}, result.frameworkComponents);

    result.columnDefs = this.getColumnDefaults(result.columnDefs as GridConfig.ColumnDef[]);
    result.frameworkComponents = this.frameworkComponents;

    // tslint:disable:deprecation
    result.onGridSizeChanged = (event: GridSizeChangedEvent): void => {
      if (options.onGridSizeChanged && typeof options.onGridSizeChanged === 'function') {
        options.onGridSizeChanged(event);
        return;
      }
      result.api?.sizeColumnsToFit();
    };
    // tslint:enable:deprecation
    return result;
  }

  public createGrid(options: GridOptions): GridOptions {
    const result: GridOptions = this.doGridCreation(options);
    return this.setFilterDefaults(result);
  }

  public createGridForDynamicFilterChange(options: GridOptions): GridOptions {
    const result: GridOptions = this.doGridCreation(options);
    return this.setFilterDefaultsByRowDataChangedEvent(result);
  }

  public setInactiveStyle(params: CellClassParams | RowClassParams): CellStyle {
    return this.setInactiveStyleByFlag(params.data.archived) as CellStyle;
  }

  public setInactiveStyleByFlag(isInactive: boolean): CellStyle | null {
    if (isInactive) {
      return { opacity: '0.5', fontStyle: 'italic' };
    } else {
      return null;
    }
  }

  public removeEmptyValues(object: object): object {
    // @ts-ignore
    _.keys(object).forEach((key: string) => (_.isEmpty(object[key]) || object[key] === SetGridFilterComponent.BLANK_VALUE)
      // @ts-ignore
      && delete object[key]);

    return object;
  }

  public getGridPaginationParams(api: GridApi, columnApi: ColumnApi): {} {
    if (!api || !columnApi) {
      return {
        filters: [],
        itemsPerPage: 50,
        orderedBy: null,
        pageNumber: 1,
        sortOrder: 'ASC'
      };
    }

    // ---- SORT (v27: from Column State) ----
    const colState: ColumnState[] = columnApi.getColumnState() ?? [];

    // pick the first sorted column by sortIndex (or the only one)
    const sorted: ColumnState[] = colState
      .filter(s => !!s.sort)                              // keep only sorted columns
      .sort((a, b) => (a.sortIndex ?? 0) - (b.sortIndex ?? 0));

    const primarySort: ColumnState = sorted[0];
    // @ts-ignore
    const gridSort: { colId: string, sort: string } = primarySort
      ? { colId: primarySort.colId!, sort: primarySort.sort! }
      : undefined;

    // Map to your expected QueryParameters
    return {};
  }


  private getOverlayLoadingTemplate(): string {
    return `<span>${ 'AG-GRID-SERVICE.LOADING' }</span>`;
  }

  private getOverlayNoRowsTemplate(): string {
    return `<span>${ 'AG-GRID-SERVICE.NO-ROWS-DATA' }</span>`;
  }

  private getColumnDefaults(columns: GridConfig.ColumnDef[]): GridConfig.ColumnDef[] {
    _.each(columns, (column: GridConfig.ColumnDef) => {
      if (column.menuTabs === undefined) {
        column.menuTabs = ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'];
      }

      if (column.sortable === undefined) {
        column.sortable = true;
      }

      if (column.filter === undefined) {
        column.filter = 'containsFilter';
      }

      if (column.valueGetter === undefined && _.includes(column.field, '.')) {
        // @ts-ignore
        column.valueGetter = (params: ValueGetterParams): string => _.get(params.data, params.colDef.field, '');
      }

      if (column.tooltipValueGetter === undefined && _.includes(column.tooltipField, '.')) {
        // @ts-ignore
        column.tooltipValueGetter = (params: ITooltipParams): string => _.get(params.data, (params.colDef as ColDef).tooltipField, '');
      }

      column.cellClass = AgGridService.getColumnClass(column);
    });
    return columns;
  }

  private assignFrameworkComponent(componentName: GridConfig.FilterType | GridConfig.ColumnDef['cellEditor'], component: Function): void {
    // @ts-ignore
    if (!!component && !_.has(this.frameworkComponents, component)) {
      // @ts-ignore
      this.frameworkComponents = _.assign(this.frameworkComponents, { [componentName]: component });
    }
  }

  private doOnEvent(result: GridOptions): void {
    // @ts-ignore
    const setFilterDefs: GridConfig.ColumnDef[] = _.filter(result.columnDefs, (columnDef: GridConfig.ColumnDef) => {
      return columnDef.filter === 'setFilter' && _.has(columnDef, 'filterParams.defaultValues');
    });
    let filterModel: object = {};

    _.each(setFilterDefs, (setFilterDef: GridConfig.ColumnDef) => {
      // @ts-ignore
      filterModel = _.assign(filterModel, { [setFilterDef.field]: setFilterDef.filterParams.defaultValues });
    });
    if (filterModel !== {}) {
      // @ts-ignore
      result.api.setFilterModel(filterModel);
    }
  }

  private setFilterDefaultsByRowDataChangedEvent(result: GridOptions): GridOptions {
    if (_.has(result.frameworkComponents, 'setFilter')) {
      result.onRowDataChanged = (): void => {
        this.doOnEvent(result);
      };
    }
    return result;
  }


  private setFilterDefaults(result: GridOptions): GridOptions {
    if (_.has(result.frameworkComponents, 'setFilter')) {
      result.onFirstDataRendered = (): void => {
        this.doOnEvent(result);
      };
    }
    return result;
  }

  public numberLabelFunction(value: number, precision: number = 0): string {
    if (!value) {
      return '';
    }

    const options: NumberFormatOptions = {
      maximumFractionDigits: precision,
      minimumFractionDigits: precision
    };

    const result: string = this.formatNumberPipe.transform(value, options);

    return ('NaN' !== result) ? result : '';
  }

  public getGridExportContextMenuItems(gridApi: GridApi, exportParams: BaseExportParams = {}): MenuItemDef[] {
    return [
      {
        name: ('AG-GRID-SERVICE.csvExport'),
        // icon: '<i class="fa fa-file-csv"></i>',
        action: (): void => gridApi.exportDataAsCsv(exportParams),
      },
      {
        name: ('AG-GRID-SERVICE.excelExport'),
        action: (): void => gridApi.exportDataAsExcel({ exportMode: 'xlsx', ...exportParams }),
      },
      {
        name: ('AG-GRID-SERVICE.excelXmlExport'),
        // icon: '<i class="fa fa-file-code"></i>',
        action: (): void => gridApi.exportDataAsExcel({ exportMode: 'xml', ...exportParams }),
      }
    ];
  }


  public enumCol<T>(field: keyof T & string, prefix: string, override: GridConfig.TypedColumnDef<T> = {}): GridConfig.TypedColumnDef<T> {
    return {
      field: field,
      headerName: (prefix),
      valueFormatter: (params: ValueFormatterParams): string =>
        this.enumPipe.transform(params.value, prefix),
      filter: 'containsFilter',
      // headerClass: 'ips-text-align--center',
      ...override
    };
  }

  public enumColWithHeaderTooltip<T>(field: keyof T & string, prefix: string, override: GridConfig.TypedColumnDef<T> = {}): GridConfig.TypedColumnDef<T> {
    return {
      field: field,
      headerName: (prefix),
      headerTooltip: (prefix + '.Tooltip'),
      valueFormatter: (params: ValueFormatterParams): string => this.enumPipe.transform(params.value, prefix),
      filter: 'containsFilter',
      minWidth: 160,
      // headerClass: 'ips-text-align--center',
      ...override
    };
  }

  public simpleCol<T>(field: keyof T & string, prefix: string, override: GridConfig.TypedColumnDef<T> = {}): GridConfig.TypedColumnDef<T> {
    return {
      field: field,
      headerName: (prefix + '.' + field),
      ...override,
    };
  }

  public simpleColWithHeaderTooltip<T>(field: keyof T & string, prefix: string, override: GridConfig.TypedColumnDef<T> = {}): GridConfig.TypedColumnDef<T> {
    return {
      field: field,
      headerName: (prefix + '.' + field),
      headerTooltip: (prefix + '.' + field + '.Tooltip'),
      minWidth: 140,
      ...override,
    };
  }

  // tslint:disable-next-line:max-line-length
  public simpleDateCol<T>(field: keyof T & string, prefix: string, override: GridConfig.TypedColumnDef<T> = {}): GridConfig.TypedColumnDef<T> {
    return {
      field: field,
      headerName: (prefix + '.' + field),
      minWidth: 80,
      valueFormatter: (params: ValueFormatterParams): string => this.timeFormatService.formatTimeStamp(params.value),
      filter: 'agDateColumnFilter',
      cellClass: 'ips-text-align--date',
      ...override,
    };
  }

  public simpleDateColWithHeaderTooltip<T>(field: keyof T & string, prefix: string, override: GridConfig.TypedColumnDef<T> = {}): GridConfig.TypedColumnDef<T> {
    return {
      field: field,
      headerName: (prefix + '.' + field),
      headerTooltip: (prefix + '.' + field + '.Tooltip'),
      minWidth: 140,
      valueFormatter: (params: ValueFormatterParams): string => this.timeFormatService.formatTimeStamp(params.value),
      filter: 'agDateColumnFilter',
      cellClass: 'ips-text-align--date',
      ...override,
    };
  }


  // tslint:disable-next-line:max-line-length
  public simpleDateTimeCol<T>(field: keyof T & string, prefix: string, override: GridConfig.TypedColumnDef<T> = {}): GridConfig.TypedColumnDef<T> {
    return {
      field: field,
      headerName: (prefix + '.' + field),
      minWidth: 80,
      valueFormatter: (params: ValueFormatterParams): string => this.timeFormatService.dateTimeFormat(params.value),
      filter: 'agDateColumnFilter',
      cellClass: 'ips-text-align--date',
      ...override,
    };
  }

  public simpleDateSecCol<T>(field: keyof T & string, prefix: string): GridConfig.TypedColumnDef<T> {
    return {
      field: field,
      headerName: (prefix + '.' + field),
      minWidth: 120,
      valueFormatter: (params: ValueFormatterParams): string => this.timeFormatService.dateTimeSecondsFormat(params.value),
      filter: 'dateFilter',
      cellClass: 'ips-text-align--date',
    };
  }

  public simpleDateSecColWithHeaderTooltip<T>(field: keyof T & string, prefix: string): GridConfig.TypedColumnDef<T> {
    return {
      field: field,
      headerName: (prefix + '.' + field),
      headerTooltip: (prefix + '.' + field + '.Tooltip'),
      minWidth: 120,
      valueFormatter: (params: ValueFormatterParams): string => this.timeFormatService.dateTimeSecondsFormat(params.value),
      filter: 'dateFilter',
      cellClass: 'ips-text-align--date',
    };
  }

  public simpleTimeCol<T>(field: keyof T & string, prefix: string): GridConfig.TypedColumnDef<T> {
    return {
      field: field,
      headerName: (prefix + '.' + field),
      minWidth: 50,
      valueFormatter: (params: ValueFormatterParams): string => this.timeFormatService.timeFormat(params.value),
      filter: 'dateFilter',
      cellClass: 'ips-text-align--date',
    };
  }

  public simpleNumberCol<T>(field: keyof T & string, prefix: string, override: GridConfig.TypedColumnDef<T> = {}, format: NumberFormatOptions = {}): GridConfig.TypedColumnDef<T> {
    return {
      field: field,
      headerName: (prefix + '.' + field),
      minWidth: 50,
      valueFormatter: (params: ValueFormatterParams): string => this.formatNumberPipe.transform(params.value, format),
      filter: 'number',
      cellClass: 'ips-text-align--number',
      ...override
    };
  }

  public simpleNumberColWithHeaderTooltip<T>(field: keyof T & string, prefix: string, override: GridConfig.TypedColumnDef<T> = {}, format: NumberFormatOptions = {}): GridConfig.TypedColumnDef<T> {
    return {
      field: field,
      headerName: (prefix + '.' + field),
      headerTooltip: (prefix + '.' + field + '.Tooltip'),
      minWidth: 130,
      valueFormatter: (params: ValueFormatterParams): string => this.formatNumberPipe.transform(params.value, format),
      filter: 'number',
      cellClass: 'ips-text-align--number',
      ...override
    };
  }

  public headerTooltip<T>(field: keyof T & string, prefix: string): GridConfig.TypedColumnDef<T> {
    return {
      headerTooltip: (prefix + '.' + field + '.Tooltip'),
    };
  }

  public simpleSetFilter<T>(values: T, translationKey: string): GridConfig.ColumnDef {
    return {
      filter: 'setFilter',
      filterParams: {
        multiple: true,
        translation: {
          type: TranslationType.ENUM,
          key: translationKey,
        },
        values: Object.values(values)
      }
    };
  }
}
