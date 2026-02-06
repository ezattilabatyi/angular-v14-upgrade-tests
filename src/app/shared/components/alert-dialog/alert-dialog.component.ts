import {Component, Inject, OnInit} from '@angular/core';
import {AlertDialog} from "@app/shared/components/alert-dialog/alert-dialog.types";
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'etrm-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss'],
})
export class AlertDialogComponent implements OnInit {

  closeButtonText!: string;

  constructor(
    public dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AlertDialog.Data) {
  }


  public ngOnInit(): void {
    this.closeButtonText = this.data.closeButtonTextKey ?? 'dialog.alert.close';
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}
