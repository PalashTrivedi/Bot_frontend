import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";
import { Observable } from "rxjs";
import { StateService } from "CommonServices/state/state.service";

@Injectable()
export class HeaderAuthorizationInterceptor implements HttpInterceptor {
    constructor(private stateService: StateService) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (this.stateService.state.sessionUser) {
            const request_clone = request.clone({ setHeaders: { Authorization: "Token " + this.stateService.state.sessionUser.token } });
            return next.handle(request_clone);
        }
        return next.handle(request);
    }
}
