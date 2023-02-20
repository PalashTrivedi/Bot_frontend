import { Component, OnInit, Inject } from "@angular/core";
import { BotService } from 'AdminServices/bot/bot.service';
import { AgentService } from 'AdminServices/agent/agent.service';
import { NotificationService } from 'CommonServices/notification/notification.service';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

import { BotModel } from './bot.model';
import { StateService } from "CommonServices/state/state.service";
declare var $: any;

@Component({
  selector: "app-bots",
  templateUrl: "./bots.component.html",
  styleUrls: ["./bots.component.css"],
})
export class BotsComponent implements OnInit {
  bots: Array<any> = [];
  agents: Array<any> = [];

  constructor(
    public dialog: MatDialog,
    private botService: BotService,
    private agentService: AgentService,
    private stateService: StateService,
    private notificationService: NotificationService
  ) {
    console.log(botService);
  }

  ngOnInit() {
    this.refresh();
    this.list_agents();
  }

  refresh = () => {
    this.list();
  }

  list = () => {
    this.botService.list().subscribe((data) => {
      this.bots = data.data.bots;
      console.log(this.bots);
    });
  };

  list_agents = () => {
    this.agentService.list().subscribe((data) => {
      this.agents = data.data.agents;
      console.log(this.agents);
    });
  };

  delete = (item: any) => {
    this.botService.delete(item).subscribe((data) => {
      console.log(data);
      this.refresh();
      this.notificationService.showNotification('Bot Deleted', 'success');
    });
  }

  add(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: "500px",
      data: {
        project: this.stateService.state.project.id,
        agents: this.agents,
        model: new BotModel(
          0,
          "",
          "",
          this.stateService.state.project.id,
          null
        )
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log("The dialog was closed", result);
        this.refresh();
        this.notificationService.showNotification('Bot Created', 'success');
      }
    });
  }
  edit(item: any): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: "500px",
      data: {
        project: this.stateService.state.project.id,
        agents: this.agents,
        model: new BotModel(
          item.id,
          item.name,
          item.description,
          item.project,
          (item.agent.id ? item.agent.id : null)
        )
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log("The dialog was closed", result);
        this.refresh();
        this.notificationService.showNotification('Bot Updated', 'success');
      }
    });
  }
  close(){
    console.log("closed");
  }

}

@Component({
  selector: "dialog-overview-example-dialog",
  templateUrl: "bots-add.component.html",
  styleUrls: ["./bots.component.css"],
})
export class DialogOverviewExampleDialog implements OnInit {
  model = this.data.model;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    private botService: BotService,
    private agentService: AgentService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() { }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  create = () => {
    console.log("creating: ", this.model);
    if (!this.model.name.trim()) {
      this.notificationService.showNotification('Name is required.', 'danger');
      return;
    }
    let payload: any = {
      name: this.model.name.trim(),
      description: this.model.description,
      project: this.data.project,
      agent: this.model.agent,
    }
    if (this.model.id) {
      payload.id = this.model.id;
      this.botService.update(payload).subscribe((data) => {
        console.log(data);
        this.dialogRef.close(data);
      });
    } else {
      this.botService.create(payload).subscribe((data) => {
        console.log(data);
        this.dialogRef.close(data);
      });
    }
  }
}
