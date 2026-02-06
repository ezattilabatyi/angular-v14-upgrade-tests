import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {TranslatedEnum} from '@app/shared/types/shared.types';

@Pipe({
  name: 'enum'
})
export class EnumPipe implements PipeTransform {

  constructor() {
  }

  public transform(enumName: string, prefix: string): string {
    if (!enumName) {
      return '';
    }
    return `enum.${prefix}.${enumName}`;
  }

  public transformAll(names: string[], prefix: string): TranslatedEnum[] {
    return names.map((n: string) => {
      return {name: n, translate: this.transform(n, prefix)};
    }).sort((a: TranslatedEnum, b: TranslatedEnum) => a.name.localeCompare(b.name));
  }
}
