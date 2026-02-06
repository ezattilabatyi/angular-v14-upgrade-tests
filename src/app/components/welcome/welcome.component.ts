import { Component, OnInit } from '@angular/core';
import {AgGridService} from '@shared/services/ag-grid.service';
import {GridOptions} from 'ag-grid-community';
import {DatePipe} from '@angular/common';
import {FormatNumberPipe} from '@shared/pipes/format-number.pipe';

interface RowData {
  name: string;
  date: Date;
}

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  providers: [FormatNumberPipe],
})
export class WelcomeComponent implements OnInit {

  protected rowData: RowData[] = [];
  protected gridOptions!: GridOptions;

  constructor(private agGridService: AgGridService,
              private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.gridOptions = this.agGridService.createGrid({
      pagination: true,
      defaultColDef: {
        sortable: true
      },
      columnDefs: [
        {
          headerName: 'Name',
          field: 'name',
        },
        {
          headerName: 'Date',
          field: 'date',
          valueFormatter: params => this.datePipe.transform(params.value) as string,
        }
      ],
      rowSelection: 'single',
    });

    setTimeout((): void => {
      this.rowData = [
        {
          name: 'hello',
          date: new Date(),
        },
        {
          name: 'hello 2',
          date: new Date(),
        },
      ]
    });
  }

}
