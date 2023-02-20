import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from 'app/env';

@Injectable({
  providedIn: 'root'
})
export class FacebookService {

  constructor(
    private http: HttpClient,
  ) { }
  list(params: any): Observable<any> {
    return this.http.post(CONFIG.server_url + "/facebook/integration/list/", params);
  }
  attach_bot_to_page(params: any): Observable<any> {
    return this.http.post(CONFIG.server_url + "/facebook/integration/attach_bot_to_page/", params);
  }
  oauth_redirect_uri(params: any): Observable<any> {
    return this.http.post(CONFIG.server_url + "/facebook/oauth/redirect_uri/", params);
  }
}
