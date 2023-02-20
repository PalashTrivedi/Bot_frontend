import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from 'AdminPages/dashboard/dashboard.component';
import { AgentsComponent } from 'AdminPages/agents/agents.component';
import { AgentAddComponent } from 'AdminPages/agents/agents-add.component';
import { IntegrationsWebAddComponent } from 'AdminPages/integrations-web/intergrations-web-add.component';
import { BotsComponent } from 'AdminPages/bots/bots.component';
import { IntegrationsComponent } from 'AdminPages/integrations/integrations.component';
import { IntegrationsFacebookComponent } from 'AdminPages/integrations-facebook/integrations-facebook.component';
import { IntegrationsSlackComponent } from 'AdminPages/integrations-slack/integrations-slack.component';
import { IntegrationsWebComponent } from 'AdminPages/integrations-web/integrations-web.component';
import { ProjectsComponent } from 'AdminPages/projects/projects.component';
import { NlpPreviewComponent } from 'AdminPages/nlp-preview/nlp-preview.component';
import { ProjectSelectionGuard } from 'AdminGuards/project-selection/project-selection.guard';
import { ReportListComponent } from 'AdminPages/report/report-list.component';
import { ProjectMembersComponent } from 'AdminPages/project-members/project-members.component';
import { DashboardProjectComponent } from 'AdminPages/dashboard-project/dashboard-project.component';
import { IntegrationsMicrosoftComponent } from 'AdminPages/integrations-microsoft/integrations-microsoft.component';


const routes: Routes = [
  { path: 'projects', component: ProjectsComponent },
  { path: 'nlp_preview', component: NlpPreviewComponent },
  {
    path: '',
    canActivate: [ProjectSelectionGuard],
    children: [
    //   { path: 'dashboard', component: DashboardComponent },
      { path: 'dashboard', component: DashboardProjectComponent },
      { path: 'agents', component: AgentsComponent },
      { path: 'bots', component: BotsComponent },
      { path: 'integrations', component: IntegrationsComponent },
      { path: 'integrations/facebook', component: IntegrationsFacebookComponent },
      { path: 'integrations/slack', component: IntegrationsSlackComponent },
      { path: 'integrations/web', component: IntegrationsWebComponent },
      { path: 'integrations/microsoft', component: IntegrationsMicrosoftComponent },
      { path: 'agent/add_agent',component:AgentAddComponent },
      { path: 'agent/edit_agent',component:AgentAddComponent },
      { path: 'integrations/add_bot',component:IntegrationsWebAddComponent },
      { path: 'integrations/web/edit_bot',component:IntegrationsWebAddComponent },

      { path : 'report', component:ReportListComponent},
      { path : 'project_members', component: ProjectMembersComponent},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
