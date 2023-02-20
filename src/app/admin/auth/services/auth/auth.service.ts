import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from 'app/env';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpClient: HttpClient
  ) { }

  register(params: any): Observable<any> {
    return this.httpClient.post(CONFIG.server_url + "/auth/register", params);
  }

  login(params: any): Observable<any> {
    return this.httpClient.post(CONFIG.server_url + "/auth/login", params);
  }
}
