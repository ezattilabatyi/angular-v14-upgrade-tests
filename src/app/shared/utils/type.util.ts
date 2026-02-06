export class TypeUtil {

  public static toBoolean(value: string, defaultValue: boolean = false): boolean {
    if (!value) {
      return defaultValue;
    }

    return value === 'true';
  }

  public static stringToObject<T>(value: string): T {
    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  }

  public static stringToNumber(value: string, defaultValue: number = null): number {
    if (!value) {
      return defaultValue;
    }

    return Number(value);
  }

}
