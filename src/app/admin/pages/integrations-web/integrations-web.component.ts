import { Component, OnInit, Inject } from '@angular/core';
import { CONFIG } from 'app/env';
import { WebService } from 'AdminServices/web/web.service';
import { NotificationService } from 'CommonServices/notification/notification.service';
import { StateService } from 'CommonServices/state/state.service';
import { IntegrationWebModel } from 'AdminPages/integrations-web/integrations-web.model';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Clipboard } from '@angular/cdk/clipboard';
import { Router,NavigationExtras } from '@angular/router'



@Component({
  selector: 'app-integrations-web',
  templateUrl: './integrations-web.component.html',
  styleUrls: ['./integrations-web.component.css']
})
export class IntegrationsWebComponent implements OnInit {
  integrations: any[] = [];
  config: any = CONFIG;

  constructor(
    private webService: WebService,
    private notificationService: NotificationService,
    private stateService: StateService,
    public dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.refresh();
  }

  refresh = () => {
    this.list();
  }

  list(): void {
    this.webService.list().subscribe((data: any[]) => {
      console.log(data);
      this.integrations = data;
    })
  }

  delete(item: any): void {
    this.webService.delete(item).subscribe((data) => {
      console.log(data);
      this.refresh();
      this.notificationService.showNotification('Web Integration Deleted', 'success');
    });
  }

  add(): void {
    this.router.navigate(['admin/integrations/add_bot']);
  }

  edit(item: any): void {   
    const navigationExtras: NavigationExtras = {
        state: {item:item }
    };
    this.router.navigate(['admin/integrations/web/edit_bot'],navigationExtras);
  }

  code(item: any): void {
    const dialogRef = this.dialog.open(IntegrationsWebCodeComponent, {
      width: "726px",
      data: {
        web_uid: item.web_bot.web_uid
      },
    });
  }
}



@Component({
  selector: "integrations-web-code",
  templateUrl: "integrations-web-code.component.html",
  styleUrls: ["./integrations-web.component.css"],
})
export class IntegrationsWebCodeComponent implements OnInit {
  host_backend: string = CONFIG.chat_server_url;
  host_webbot: string = CONFIG.webbot_url;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<IntegrationsWebCodeComponent>,
    private clipboard: Clipboard
  ) { }

  ngOnInit(): void {
    console.log(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  copy_snippet(): void {
    console.log("copying");
    let element_code_snippet: any = document.getElementById("code_snippet");
    this.clipboard.copy(element_code_snippet.value.trim());
  }
}
