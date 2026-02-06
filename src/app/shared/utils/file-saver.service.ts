import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileSaverService {

  public static readonly FILENAME_REGEXP: RegExp = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  public static readonly SEARCH_VALUE: RegExp = /['"]/g;

  constructor(private http: HttpClient) {
  }

  public save(url: string,
              params: HttpParams | { [param: string]: string | string[] } = new HttpParams(),
              type: string = 'application/octet-stream',
              defaultFileName?: string): void {

    this.http.get(url, { params, observe: 'response', responseType: 'arraybuffer' })
      .subscribe((result: HttpResponse<ArrayBuffer>) => {
        this.saveFile(result, type, defaultFileName);
      });
  }

  public export<T>(url: string,
                   requestBody: T,
                   params: HttpParams | { [param: string]: string | string[] } = new HttpParams(),
                   type: string = 'application/octet-stream',
                   defaultFileName?: string): Subscription {

    return this.http.post(url, requestBody, { observe: 'response', responseType: 'arraybuffer' })
      .subscribe((result: HttpResponse<ArrayBuffer>) => {
        this.saveFile(result, type, defaultFileName);
      });
  }

  private saveFile(result: HttpResponse<ArrayBuffer>, type: string, defaultFileName: string): void {
    const blob: Blob = new Blob([new Uint8Array(result.body)], { type });
    const disposition: string = result.headers.get('Content-Disposition');

    if (disposition && disposition.indexOf('attachment') !== -1) {
      const matches: RegExpExecArray = FileSaverService.FILENAME_REGEXP.exec(disposition);
      if (matches != null && matches[1]) {
        FileSaver.saveAs(blob, matches[1].replace(FileSaverService.SEARCH_VALUE, '').split('/').pop());
      }
    } else {
      FileSaver.saveAs(blob, defaultFileName);
    }
  }
}
