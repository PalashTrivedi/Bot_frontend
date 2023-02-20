import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from "rxjs/operators";
import { NotificationService } from 'CommonServices/notification/notification.service';
import { SessionService } from 'CommonServices/session/session.service';


@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  constructor(
    private notificationService: NotificationService,
    private sessionService: SessionService,
    private router: Router,
  ) { }

  // intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  //   return next.handle(request).pipe(
  //     tap((event: HttpEvent<any>) => {
  //       console.log("interceptor")
  //       if (event instanceof HttpResponse && event.body.status === false) {
  //         this.notificationService.showNotification(event.body.error_msg, 'danger');
  //       }
  //     })
  //   );
  // }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      // map((event) => {
      //     if (event instanceof HttpResponse) {
      //         console.log("Response received");
      //         console.log(event);
      //         let body: any = event.body;
      //         this.process_messages(body.messages);
      //         event = event.clone({ body: event.body });
      //     }
      //     return event;
      // }),
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse) {
          console.log("Error received");
          console.log(error);
          let body: any = error.error;
          if (body.error_msg) {
            this.notificationService.showNotification(body.error_msg, 'danger');
          }
          if (body.error_data) {
            for (var key in body.error_data) {
              if (body.error_data.hasOwnProperty(key)) {
                console.log(key + " -> " + body.error_data[key]);
                this.notificationService.showNotification(body.error_data[key][0], 'danger');

              }
            }
          }
          if (error.status == 401 && this.router.url != '/login') {
            // this.notificationService.showNotification('Login again ', 'danger');
            localStorage.setItem('error',"Login Again Sesssion Expired!")
            this.sessionService.logout();
          }
        }
        return new Observable<HttpEvent<any>>();
      }),
    );
  }
}
