import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ConfirmDialog} from './confirm-dialog.types';

@Component({
  selector: 'etrm-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {

  private static COLOR_PRIMARY: ThemePalette = 'primary';

  @Output() public confirmed: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() public canceled: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialog.Data) {
  }

  get confirmButtonColor(): ThemePalette {
    return this.data.confirmButtonColor || ConfirmDialogComponent.COLOR_PRIMARY;
  }

  get confirmButtonText(): string {
    return this.data.confirmButtonText || 'common.button.yes';
  }

  get cancelButtonText(): string {
    return this.data.cancelButtonText || 'common.button.no';
  }

  public onClick(confirmed: boolean): void {
    if (confirmed) {
      this.confirmed.emit(confirmed);
    } else {
      this.canceled.emit(!confirmed);
    }

    this.dialogRef.close(confirmed);
  }
}
