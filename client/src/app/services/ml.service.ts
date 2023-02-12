import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Observable } from 'rxjs';
import { L2mRow } from '../types/types';

@Injectable({
  providedIn: 'root',
})
export class MlService {
    private mlUrl = '/api/ml?index=40&digit=9';
    private postArrUrl = '/api/postarr';

    constructor(
        private http: HttpClient) { }

  getMl(): Observable<any> {
    let headers = new HttpHeaders();
    headers.set("Content-Type", 'application/octet-stream')
    return this.http.get<any>(this.mlUrl, {headers: headers, responseType:'blob' as 'json'});
  }

  sendArr(arr:any): Observable<any> {
    return this.http.post<any>(this.postArrUrl, {content: arr});
  }
}