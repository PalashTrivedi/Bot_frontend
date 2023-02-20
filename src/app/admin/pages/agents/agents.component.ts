import { Component, OnInit, Inject } from '@angular/core';
import { AgentService } from 'AdminServices/agent/agent.service';
import { NotificationService } from 'CommonServices/notification/notification.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { AiProviderModel, AgentModel, AgentConfigModel } from './agent.model';
import { StateService } from 'CommonServices/state/state.service';
import { AiProviderService } from 'AdminServices/ai-provider/ai-provider.service';
import { Router,NavigationExtras } from '@angular/router'

import { from } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.css']
})
export class AgentsComponent implements OnInit {
  agents: Array<any> = [];
  ai_providers: Array<any> = [];
  constructor(
    public dialog: MatDialog,
    private agentService: AgentService,
    private aiProviderService: AiProviderService,
    private stateService: StateService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.refresh();
    this.list_ai_providers();
  }

  refresh = () => {
    this.list();
  }
  list = () => {
    this.agentService.list().subscribe(data => {
      this.agents = data.data.agents;
      console.log(this.agents);
    });
  }
  list_ai_providers = () => {
    this.aiProviderService.list().subscribe(data => {
      this.ai_providers = data.data.ai_providers;
      console.log(this.ai_providers);
    });
  }
  delete = (item: any) => {
    this.agentService.delete(item).subscribe((data) => {
      this.refresh();
      this.notificationService.showNotification('Agent Deleted', 'success');
    });
  }
  add(): void {
    // const dialogRef = this.dialog.open(AgentAddComponent, {
    //   width: "500px",
    //   data: {
    //     project: this.stateService.state.project.id,
    //     ai_providers: this.ai_providers,
    //     model: new AgentModel(
    //       0,
    //       "",
    //       this.stateService.state.project.id,
    //       null,
    //       new AgentConfigModel(0, '{}', '{}', '{}')
    //     )
    //   },
    this.router.navigate(['admin/agent/add_agent']);

    // });

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result) {
    //     console.log("The dialog was closed", result);
    //     this.refresh();
    //     this.notificationService.showNotification('Agent Created', 'success');
    //   }
    // });
  }
  
  edit(item: any): void {
    const navigationExtras: NavigationExtras = {
      state: {item:item }
    };
    // const dialogRef = this.dialog.open(AgentAddComponent, {
    //   width: "500px",
    // data: {
    //   project: this.stateService.state.project.id,
    //   ai_providers: this.ai_providers,
    //   model: new AgentModel(
    //     item.id,
    //     item.name,
    //     this.stateService.state.project.id,
    //     (item.ai_provider.id ? item.ai_provider.id : null),
    //     new AgentConfigModel(item.agent_config.id, item.agent_config.nlp_config, item.agent_config.stt_config, item.agent_config.tts_config)
    //   )
    // }
     this.router.navigate(['admin/agent/edit_agent'],navigationExtras);
    }

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       console.log("The dialog was closed", result);
  //       this.refresh();
  //       this.notificationService.showNotification('Agent Updated', 'success');
  //     }
  //   });
  // }
}

// @Component({
//   selector: "agent-add",
//   templateUrl: "agents-add.component.html",
//   styleUrls: ["./agents.component.css"],
// })
// export class AgentAddComponent implements OnInit {
//   model = this.data.model;
//   constructor(
//     @Inject(MAT_DIALOG_DATA) public data: any,
//     public dialogRef: MatDialogRef<AgentAddComponent>,
//     private agentService: AgentService,
//     private notificationService: NotificationService
//   ) { }

//   ngOnInit(): void {
//     console.log(this.data);
//   }

//   onNoClick(): void {
//     this.dialogRef.close(false);
//   }

//   create = () => {
//     console.log("creating: ", this.model);
//     if (!this.model.name.trim()) {
//       this.notificationService.showNotification('Name is required.', 'danger');
//       return;
//     }
//     let payload: any = {
//       name: this.model.name.trim(),
//       project: this.data.project,
//       ai_provider: this.model.ai_provider,
//       agent_config: this.model.agent_config
//     }
//     if (this.model.id) {
//       payload.id = this.model.id;
//       this.agentService.update(payload).subscribe((data) => {
//         console.log(data);
//         this.dialogRef.close(data);
//       });
//     } else {
//       this.agentService.create(payload).subscribe((data) => {
//         console.log(data);
//         this.dialogRef.close(data);
//       });
//     }
//   };
// }
