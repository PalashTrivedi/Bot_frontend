import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from 'app/env';

@Injectable({
  providedIn: 'root'
})
export class KpiService {

  constructor(
    private http: HttpClient,
  ) { }

  index(): Observable<any> {
    return this.http.post(CONFIG.server_url + '/kpis/dashboard/index/', {});
  }
  getUserList(params:any): Observable<any> {
    return this.http.post(CONFIG.server_url + '/kpis/dashboard/userRateKpi/?project_id='+params.project_id+'&start_date='+params.start_date+'&end_date='+params.end_date+'&bot_id=0',{});
  }

  getMessageRate(params: any): Observable<any> {
    return this.http.post(CONFIG.server_url + '/kpis/dashboard/messageRateKpi/?project_id='+params.project_id+'&start_date='+params.start_date+'&end_date='+params.end_date+'&bot_id=0', {});
  }
  getmessageSentAndReceiveRate(params: any): Observable<any> {
    return this.http.post(CONFIG.server_url + '/kpis/dashboard/messageSentAndReceiveRateKpi/?project_id=' + params.project_id + '&start_date=' + params.start_date + '&end_date=' + params.end_date + '&bot_id=0', {});
  }




  /////////////////////////////
    dashboard_project_index(params: any): Observable<any> {
        return this.http.post(CONFIG.server_url + '/kpis/dashboard_project/index', params);
    }
}