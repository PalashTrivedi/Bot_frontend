import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from 'app/admin/layout/admin-layout.component';
import { AuthLayoutComponent } from 'app/auth/auth-layout/auth-layout.component';
import { AdminAuthGuard } from 'CommonGuards/admin-auth/admin-auth.guard';
import { UnauthenticatedGuard } from 'CommonGuards/unauthenticated/unauthenticated.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin/projects',
    pathMatch: 'full',
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AdminAuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('app/admin/admin.module').then(m => m.AdminModule),
      }
    ]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [UnauthenticatedGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('app/auth/auth.module').then(m => m.AuthModule),
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {})
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
