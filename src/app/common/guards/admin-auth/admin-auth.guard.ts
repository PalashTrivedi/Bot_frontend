import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from "@angular/router";
import { Observable } from "rxjs";
import { NotificationService } from "CommonServices/notification/notification.service";
import { StateService } from "CommonServices/state/state.service";
import { SessionService } from "CommonServices/session/session.service";

@Injectable({
    providedIn: "root",
})
export class AdminAuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private stateService: StateService,
        private sessionService: SessionService,
        private notificationService: NotificationService,
    ) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (!this.stateService.state.sessionUser) {
            // this.notificationService.showNotification("Please login to continue", "danger");
            this.sessionService.redirect_to_login();
            return false;
        }
        return true;
    }
}
