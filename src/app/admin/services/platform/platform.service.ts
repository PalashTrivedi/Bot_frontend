import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from 'app/env';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  constructor(
    private http: HttpClient
  ) { }


  list(): Observable<any> {
    return this.http.get(CONFIG.server_url + "/platforms");
  }

  appConfig(params: any): Observable<any> {
    return this.http.post(CONFIG.server_url + "/platforms/apps/config", params);
  }
}
