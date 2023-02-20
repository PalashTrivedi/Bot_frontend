import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from 'app/env';


@Injectable({
  providedIn: 'root'
})
export class AgentService {
  constructor(
    private http: HttpClient,
  ) { }


  list(): Observable<any> {
    return this.http.get(CONFIG.server_url + "/agents/");
  }

  create(params: any): Observable<any> {
    return this.http.post(CONFIG.server_url + "/agents/", params);
  }

  update(params: any): Observable<any> {
    return this.http.put(CONFIG.server_url + "/agents/" + params.id + "/", params);
  }

  delete(item: any): Observable<any> {
    return this.http.delete(CONFIG.server_url + "/agents/" + item.id + "/");
  }
}
