import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from 'app/env';
import { StateService } from 'CommonServices/state/state.service';

@Injectable({
  providedIn: 'root'
})
export class WebService {

  constructor(
    private http: HttpClient,
  ) { }

  list(): Observable<any> {
    return this.http.get(CONFIG.server_url + "/web/integrations/");
  }

  create(params: any): Observable<any> {
    return this.http.post(CONFIG.server_url + "/web/integrations/", params);
  }

  update(params: any): Observable<any> {
    return this.http.put(CONFIG.server_url + "/web/integrations/" + params.id + "/", params);
  }

  delete(item: any): Observable<any> {
    return this.http.delete(CONFIG.server_url + "/web/integrations/" + item.id + "/");
  }
}
