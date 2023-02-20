import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from 'app/env';

@Injectable({
  providedIn: 'root'
})
export class AiProviderService {

  constructor(
    private http: HttpClient
  ) { }

  list(): Observable<any> {
    return this.http.get(CONFIG.server_url + "/ai_providers");
  }
}
