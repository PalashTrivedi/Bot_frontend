import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { Validators } from "@angular/forms";
import { AuthService } from "AuthServices/auth/auth.service";
import { NotificationService } from "CommonServices/notification/notification.service";
import { SessionService } from "CommonServices/session/session.service";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
    loginForm = this.formBuilder.group({
        email: ["", [Validators.email, Validators.required]],
        password: ["", [Validators.required]],
    });
    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private notificationService: NotificationService,
        private sessionService: SessionService,
    ) {}

    ngOnInit(): void {
    if(localStorage.getItem('error')){
        this.notificationService.showNotification(localStorage.getItem('error'),'danger');
        localStorage.removeItem('error');
    }
    }

    onSubmit(): void {
        console.log(this.loginForm.value);
        if (this.loginForm.valid) {
            let params: any = this.loginForm.value;
            console.log(params);
            this.authService.login(params).subscribe(
                (data: any): void => {
                    console.log(data);
                    this.sessionService.login(data.data.user);
                },
                (error: any): void => {
                    console.log("HTTP Error", error);
                    // if (typeof error.error == "object") {
                    //     for (const key in error.error) {
                    //         this.notificationService.showNotification("Error: " + error.error[key], "danger");
                    //     }
                    // } else if (typeof error.error == "string") {
                    //     this.notificationService.showNotification("Error: " + error.error, "danger");
                    // }
                },
            );
        } else {
            if (!this.loginForm.valid) {
                this.notificationService.showNotification("Please fill all fields correctly", "danger");
            }
        }
    }
}
