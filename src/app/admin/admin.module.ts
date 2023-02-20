import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';

import { TagCloudModule } from 'angular-tag-cloud-module';


import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from 'AdminPages/dashboard/dashboard.component';
import { ProjectsComponent, ProjectAddComponent } from './pages/projects/projects.component';
import { AgentsComponent } from 'AdminPages/agents/agents.component';
import { AgentAddComponent } from 'AdminPages/agents/agents-add.component';
import { BotsComponent, DialogOverviewExampleDialog } from 'AdminPages/bots/bots.component';
import { IntegrationsComponent } from 'AdminPages/integrations/integrations.component';
import { IntegrationsFacebookComponent } from 'AdminPages/integrations-facebook/integrations-facebook.component';
import { IntegrationsSlackComponent } from 'AdminPages/integrations-slack/integrations-slack.component';
import {
  IntegrationsWebComponent,
  IntegrationsWebCodeComponent
} from 'AdminPages/integrations-web/integrations-web.component';
import {IntegrationsWebAddComponent} from 'AdminPages/integrations-web/intergrations-web-add.component';
import { IntegrationsMicrosoftComponent, IntegrationsMicrosoftAttachBotComponent } from 'AdminPages/integrations-microsoft/integrations-microsoft.component';
import { NlpPreviewComponent } from 'AdminPages/nlp-preview/nlp-preview.component';
import { ReportListComponent } from 'AdminPages/report/report-list.component';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ColorPickerModule } from 'ngx-color-picker';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SafePipe } from './pipes/safe.pipe';
import { ProjectMembersComponent, ProjectMemberAddComponent } from './pages/project-members/project-members.component';
import { DashboardProjectComponent } from 'AdminPages/dashboard-project/dashboard-project.component';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';


@NgModule({
  declarations: [
    DashboardComponent,
    ProjectsComponent, ProjectAddComponent,
    AgentsComponent, 
    AgentAddComponent,
    BotsComponent, DialogOverviewExampleDialog,
    IntegrationsComponent,
    IntegrationsFacebookComponent,
    IntegrationsSlackComponent,
    IntegrationsWebComponent, IntegrationsWebCodeComponent,IntegrationsWebAddComponent,
    ProjectsComponent,
    NlpPreviewComponent,
    ReportListComponent,
    SafePipe,
    ProjectMembersComponent, ProjectMemberAddComponent,
    DashboardProjectComponent,
    IntegrationsMicrosoftComponent, IntegrationsMicrosoftAttachBotComponent,
  ],
  imports: [
    AdminRoutingModule,

    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatButtonModule,
    MatInputModule,
    MatRippleModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatSelectModule,
    MatCardModule,
    MatDialogModule,
    ClipboardModule,
    ColorPickerModule,
    SweetAlert2Module,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    TagCloudModule,
    MatCheckboxModule,
    MatChipsModule,
    ],
    providers: [
      {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}
    ]
})
export class AdminModule { }
