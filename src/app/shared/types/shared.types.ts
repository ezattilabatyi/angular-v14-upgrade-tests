const SNACKBAR_TIMING_FAST: number = 2000;
const SNACKBAR_TIMING_NORMAL: number = 4000;

export enum SnackbarTiming {
  fast = SNACKBAR_TIMING_FAST,
  normal = SNACKBAR_TIMING_NORMAL
}

export const TEXTAREA_MIN_ROWS_NUMBER: number = 3;
export const TEXTAREA_MAX_ROWS_NUMBER: number = 6;
export const TEXT_INPUT_LENGTH: number = 100;
export const TEXT_INPUT_MAX_LENGTH: number = 255;
export const TEXTAREA_MAX_LENGTH: number = 255;
export const MEDIUM_TEXTAREA_MAX_LENGTH: number = 500;
export const LONG_TEXTAREA_MAX_LENGTH: number = 1000;
export const NUMBER_FIELD_MASK: string = '9{10}';
export const DECIMAL_FIELD_MASK: string = '0*';
export const DECIMALS_QUANTITY: number = 3;
export const DECIMALS_PRICE: number = 2;

export enum TranslationType {
  ENUM = 'ENUM',
}

export interface FieldValidationError {
  path: string;
  code: string;
  args: object;
}

export interface ServerErrors {
  fields: FieldValidationError[];
  id: string;
  messageType: string;
}


interface Evnt<T> {
  name: T;
}

export interface DtoWithExpired<T> extends Evnt<T> {
  expired?: boolean;
}

export interface TranslatedEnum {
  name: string;
  translate: string;
}

export type SnackBarType = "success" | "error" | "warning";
