import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";
import { Observable } from "rxjs";
import { StateService } from "CommonServices/state/state.service";

@Injectable()
export class QueryParamProjectInterceptor implements HttpInterceptor {
    constructor(private stateService: StateService) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (this.stateService.state.project) {
            const request_clone = request.clone({
                url: request.url + (request.url.includes("?") ? "&" : "?") + "project=" + this.stateService.state.project.id,
            });
            return next.handle(request_clone);
        }
        return next.handle(request);
    }
}
