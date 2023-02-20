import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { NotificationService } from "CommonServices/notification/notification.service";
import { StateService } from "CommonServices/state/state.service";

@Injectable({
    providedIn: "root",
})
export class ProjectSelectionGuard implements CanActivate {
    constructor(private router: Router, private stateService: StateService, private notificationService: NotificationService) {}
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (!this.stateService.state.project) {
            this.notificationService.showNotification("Please choose a project first.", "danger");
            this.router.navigate(["/admin/projects"]);
            return false;
        }
        return true;
    }
}
