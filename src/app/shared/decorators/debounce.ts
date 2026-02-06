const DEBOUNCE_DELAY_DEFAULT: number = 100;
const DEBOUNCE_DELAY_NORMAL: number = 300;
const DEBOUNCE_DELAY_SLOW: number = 600;

export enum DebounceDelay {
  default = DEBOUNCE_DELAY_DEFAULT,
  normal = DEBOUNCE_DELAY_NORMAL,
  slow = DEBOUNCE_DELAY_SLOW,
}

export function Debounce(delay: DebounceDelay = DebounceDelay.default): MethodDecorator {
  return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const original: Function = descriptor.value;
    const key: string = `__timeout__${propertyKey}`;

    descriptor.value = function (...args: unknown[]): void {
      clearTimeout(this[key]);
      this[key] = setTimeout(() => original.apply(this, args), delay);
    };

    return descriptor;
  };
}
