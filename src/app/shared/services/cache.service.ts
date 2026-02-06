import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class CacheService<T> {

  private cache: { [key: string]: T } = {};

  constructor() { }

  public add(key: string, value: T): void {
    _.set(this.cache, key, value);
  }

  public get(key: string): T {
    return _.get(this.cache, key, null);
  }

  public remove(key: string): void {
    _.unset(this.cache, key);
  }

  public clear(): void {
    this.cache = {};
  }
}
