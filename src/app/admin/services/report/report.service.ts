import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from 'app/env';
import { StateService } from 'CommonServices/state/state.service';
import {RequestOptions, Request, RequestMethod} from '@angular/http';
import { saveAs } from 'file-saver'
@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(
    private http: HttpClient,
    private stateService: StateService
  ) { }

  list(bot : number,start_date : Date,end_date : Date): Observable<any> {
    return this.http.get(CONFIG.server_url + "/bot_session/formData?bot=" +bot+ "&start_date="+start_date+"&end_date="+end_date);
  }
  importReport(bot : number){
    window.open(CONFIG.server_url + "/bot_session/importData?bot=" +bot);
  }

  // downloadExcel() {

  //   const type = 'application/vnd.ms-excel';
  //   const filename = 'file.xls';
  //   const options = new RequestOptions({
  //             responseType: 'blob',
  //             headers: new Headers({ 'Accept': type })
  //         });
  
  //   this.http.get('http://10.2.2.109/Download/exportExcel', options)
  //            .catch(errorResponse => Observable.throw(errorResponse.json()))
  //            .map((response) => { 
  //                  if (response instanceof Response) {
  //                     return response.blob();
  //                  }
  //                  return response;
  //             })
  //            .subscribe(data => saveAs(data, filename),
  //                       error => console.log(error)); // implement your error handling here
  
  // }

  public downloadExcelFile(bot : number,start_date : Date,end_date : Date) {
    const url = CONFIG.server_url + "/bot_session/importData?bot="+ bot + "&start_date="+start_date+"&end_date="+end_date;
    const encodedAuth = window.localStorage.getItem('token');
    const filename = 'file.xls';
    return this.http.get(url, { headers: new HttpHeaders({
      'Authorization': 'Token ' + encodedAuth,
      'Content-Type': 'application/vnd.ms-excel',
      }), responseType: 'blob'}).pipe (
      tap (
        // Log the result or error
        data => saveAs(data, filename),
        error => console.log(error)
      )
     );
    }
} 
