import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from "@angular/router";
import { Observable } from "rxjs";
import { SessionService } from "CommonServices/session/session.service";
import { StateService } from "CommonServices/state/state.service";

@Injectable({
    providedIn: "root",
})
export class UnauthenticatedGuard implements CanActivate {
    constructor(private router: Router, private stateService: StateService, private sessionService: SessionService) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (this.stateService.state.sessionUser) {
            this.sessionService.redirect_to_admin();
            return false;
        }
        return true;
    }
}
