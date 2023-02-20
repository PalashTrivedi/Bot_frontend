import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { StateService } from "CommonServices/state/state.service";
import { SessionUserModel } from "CommonModels/session-user/session-user.model";

@Injectable({
    providedIn: "root",
})
export class SessionService {
    constructor(private router: Router, private stateService: StateService) {}

    login(sessionUser: SessionUserModel): void {
        this.stateService.setItem({ sessionUser: sessionUser });
        this.redirect_to_admin();
    }

    logout(): void {
        this.stateService.clear();
        this.redirect_to_login();
    }

    redirect_to_login(): void {
        window.location.replace("/login");
    }

    redirect_to_admin(): void {
        window.location.replace("/");
    }
}
