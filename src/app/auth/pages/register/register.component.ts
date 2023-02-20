import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AuthService } from 'AuthServices/auth/auth.service';
import { NotificationService } from 'CommonServices/notification/notification.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm = this.formBuilder.group({
    first_name: ['', Validators.required],
    last_name: [''],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required]],
    terms: [false]
  });
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log(this.registerForm.value);
    if (this.registerForm.valid && this.registerForm.value.terms) {
      let params: any = this.registerForm.value;
      console.log(params);
      this.authService.register(params).subscribe((data: any): void => {
        console.log(data);
        this.notificationService.showNotification("Registration successful. Please login to continue", 'success');
        this.router.navigate(['/login']);
      },
        (error: any): void => {
          console.log('HTTP Error', error);
          if (typeof (error.error) == 'object') {
            for (const key in error.error) {
              this.notificationService.showNotification("Error: " + error.error[key], "danger");
            }
          }
          else if (typeof (error.error) == 'string') {
            this.notificationService.showNotification("Error: " + error.error, "danger");
          }
        }
      );
    } else {
      if (!this.registerForm.valid) {
        this.notificationService.showNotification("Please fill all fields correctly", 'danger');
      }
      else if (!this.registerForm.value.terms) {
        this.notificationService.showNotification("You must agree to terms & conditions", 'danger');
      }
    }
  }

}
