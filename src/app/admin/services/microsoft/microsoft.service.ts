import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { CONFIG } from "app/env";

@Injectable({
    providedIn: "root",
})
export class MicrosoftService {
    constructor(private http: HttpClient) {}

    list(params: any): Observable<any> {
        return this.http.post(CONFIG.server_url + "/microsoft/integration/list", params);
    }
}
