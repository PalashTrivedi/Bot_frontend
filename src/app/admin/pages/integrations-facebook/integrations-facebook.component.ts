import { Component, OnInit } from "@angular/core";
import { FacebookService } from "AdminServices/facebook/facebook.service";
import { BotService } from "AdminServices/bot/bot.service";
import { NotificationService } from 'CommonServices/notification/notification.service';
import { PlatformService } from "AdminServices/platform/platform.service";

declare var FB: any;


@Component({
  selector: "app-integrations-facebook",
  templateUrl: "./integrations-facebook.component.html",
  styleUrls: ["./integrations-facebook.component.css"],
})
export class IntegrationsFacebookComponent implements OnInit {
  facebook_user_integrations: any[] = [];
  bots: any[] = [];
  oauth_config: any;
  constructor(
    private facebookService: FacebookService,
    private botService: BotService,
    private notificationService: NotificationService,
    private platformService: PlatformService,

  ) {
    console.log(facebookService);
    console.log(botService);
  }

  ngOnInit() {
    this.refresh();

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

  }
  submitLogin = () => {
    console.log("submit login to facebook");
    // FB.login();
    FB.login((response) => {
      console.log('submitLogin', response);
      if (response.authResponse) {
        console.log('Login successful');
        const params = { 'access_token': response.authResponse.accessToken };
        this.facebookService.oauth_redirect_uri(params).subscribe((data: any) => {
          console.log(data);
          this.refresh();

        });

        //login success
        //login success code here
        //redirect to home page
      }
      else {
        console.log('User login failed');
      }
    },
      { scope: this.oauth_config.OAUTH_SCOPES }
    );

  }


  checkLoginState = () => {
    FB.getLoginStatus(function (response) {
      console.log(response);
      console.log('user logged in');
    });
  }

  refresh = () => {
    this.list();
    this.getPlatformAppConfig();

  }


  list = () => {
    this.botService.list().subscribe(data => {
      console.log(data);
      this.bots = data.data.bots;
      this.facebookService.list({}).subscribe(data => {
        console.log(data);
        this.facebook_user_integrations = data.data.facebook_integration;
        console.log(this.facebook_user_integrations);
      });
    });
  };

  public doSomething(facebook_page, event) {
    console.log(facebook_page);
    console.log(event);
    const params = {
      facebook_page_id: facebook_page.id,
      bot_id: event.value
    };
    this.facebookService.attach_bot_to_page(params).subscribe(data => {
      console.log(data);
      this.refresh();
      this.notificationService.showNotification('Success', 'success');
    });
  }


  getPlatformAppConfig(): void {
    const params = {
      "platform": "facebook"
    }
    this.platformService.appConfig(params).subscribe(data => {
      console.log(data);
      this.oauth_config = data.data.oauth_config;
      console.log(this.oauth_config);
      (window as any).fbAsyncInit = function () {
        console.log(this.oauth_config);
        FB.init({
          appId: data.data.oauth_config.APP_ID,
          cookie: true,
          xfbml: true,
          version: data.data.oauth_config.VERSION
        });

        FB.AppEvents.logPageView();

      };
    });
  }
}