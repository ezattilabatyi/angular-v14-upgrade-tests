import { Injectable } from '@angular/core';
import { EnumPipe } from '@app/shared/pipes/enum.pipe';
import * as _ from 'lodash';

@Injectable()
export class SearchService {

  constructor(private enumPipe: EnumPipe) {
  }

  public filter<T, K extends keyof T>(array: T[], field: K, needle: string, enumPipePrefix?: string): T[] {
    return _.filter(array, (element: T) => {
      // let string: string = (!!field ? element[field] : element || '').toString();
      let string: string = (element[field] as unknown as string || '').toString();
      string = !!enumPipePrefix
        ? this.enumPipe.transform(string, enumPipePrefix)
        : string;

      return string.toLocaleLowerCase().indexOf(needle.toLowerCase()) >= 0;
    });
  }
}
