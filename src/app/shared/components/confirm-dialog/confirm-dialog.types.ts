import { TemplateRef } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

export declare namespace ConfirmDialog {
  interface Data {
    title: string;
    content: string;
    contentParams: object;
    template: TemplateRef<object>;
    confirmButtonText?: string;
    confirmButtonColor?: ThemePalette;
    cancelButtonText?: string;
    hide?: {
      cancelButton?: boolean;
    };
  }
}
