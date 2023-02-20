import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { TagCloudModule } from 'angular-tag-cloud-module';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';

import { AdminLayoutComponent } from 'AdminLayout/admin-layout.component';
import { AdminNavbarComponent } from 'AdminLayout/navbar/admin-navbar.component';
import { AdminSidebarComponent } from 'AdminLayout/sidebar/admin-sidebar.component';
import { AdminFooterComponent } from 'AdminLayout/footer/admin-footer.component';
import { HeaderAuthorizationInterceptor } from 'AdminInterceptors/header-authorization/header-authorization.interceptor';
import { QueryParamProjectInterceptor } from 'AdminInterceptors/query-param-project/query-param-project.interceptor';
import { ErrorHandlerInterceptor } from 'AdminInterceptors/error-handler/error-handler.interceptor';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AdminNavbarComponent,
    AdminSidebarComponent,
    AdminFooterComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpModule,
    RouterModule,
    SweetAlert2Module.forRoot(),
    TagCloudModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeaderAuthorizationInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: QueryParamProjectInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})

export class AppModule { }
