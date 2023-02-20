import { Component, OnInit, HostListener } from "@angular/core";
import { BotService } from 'AdminServices/bot/bot.service';
import { SlackService } from 'AdminServices/slack/slack.service';
import { NotificationService } from 'CommonServices/notification/notification.service';
import { PlatformService } from "AdminServices/platform/platform.service";
import { StateService } from "CommonServices/state/state.service";



@Component({
  selector: "app-integrations-slack",
  templateUrl: "./integrations-slack.component.html",
  styleUrls: ["./integrations-slack.component.css"],
})
export class IntegrationsSlackComponent implements OnInit {
  slack_team_integrations: any[] = [];
  bots: any[] = [];
  oauth_config: any;
  constructor(
    private botService: BotService,
    private slackService: SlackService,
    private platformService: PlatformService,
    private stateService: StateService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.refresh();
  }

  on_oauth_dialog_close_event = () => {
    console.log(event);
    this.refresh();
  }

  initiate_slack_oauth = () => {
    const url = "https://slack.com/oauth/v2/authorize?client_id=" + this.oauth_config.CLIENT_ID
      + "&scope=" + this.oauth_config.OAUTH_SCOPES
      + "&redirect_uri=" + this.oauth_config.OAUTH_REDIRECT_URI
      + '&state={"project":' + this.stateService.state.project.id + ','
      + '"frontend_domain":"' + location.origin + '"}';
    var oauth_window = window.open(url, 'name', 'height=600,width=450');
    console.log(oauth_window);
    if (window.focus) {
      oauth_window.focus();
    }
    window.addEventListener("message", this.on_oauth_dialog_close_event, false);
  }

  refresh = () => {
    this.list();
    this.getPlatformAppConfig();
  }

  list = () => {
    this.botService.list().subscribe((data: any[]) => {
      console.log(data);
      this.bots = data;
      this.slackService.list({}).subscribe((data: any[]) => {
        console.log(data);
        this.slack_team_integrations = data;
        console.log(this.slack_team_integrations);
      });
    });
  };

  getPlatformAppConfig(): void {
    const params = {
      "platform": "slack"
    }
    this.platformService.appConfig(params).subscribe(data => {
      console.log(data);
      this.oauth_config = data;
    });
  }

  public doSomething(slack_channel, event) {
    console.log(slack_channel);
    console.log(event);
    const params = {
      slack_channel_id: slack_channel.id,
      bot_id: event.value
    };
    this.slackService.attach_bot_to_channel(params).subscribe((data: any[]) => {
      console.log(data);
      this.refresh();
      this.notificationService.showNotification('Success', 'success');
    });
  }

}
