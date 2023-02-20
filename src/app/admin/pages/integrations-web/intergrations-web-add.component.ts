import { Component, OnInit, Inject } from '@angular/core';
import { WebService } from 'AdminServices/web/web.service';
import { NotificationService } from 'CommonServices/notification/notification.service';
import { IntegrationWebModel } from 'AdminPages/integrations-web/integrations-web.model';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { BotService } from 'AdminServices/bot/bot.service';
import { BotTypeService } from 'AdminServices/bot-type/bot-type.service';
import { FormControl, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { CONFIG } from 'app/env';

@Component({
    selector: "integrations-web-add",
    templateUrl: "integrations-web-add.component.html",
    styleUrls: ["./integrations-web.component.css"],
})
export class IntegrationsWebAddComponent implements OnInit {
    msg: string = ''    
    bots: any[] = [];
    bot_types: any[] = [];
    ff : string = 'qqqq'
    model: any = new IntegrationWebModel(
        0,
        {
            "display_name": "",
            "color_code_theme": "#5A5EB9",
            "color_code_text": "#FFFFFF",
            "bot_icon": null,
            "bot": null,
            "bot_type": null
        }
    )

    bot_icon: any = this.model.web_bot.bot_icon;
    bot_icon_reader = new FileReader();
    bot_url: string;
    constructor(
        private webService: WebService,
        private botService: BotService,
        private botTypeService: BotTypeService,
        private notificationService: NotificationService,
        private router: Router,
    ) {
        const navigation = this.router.getCurrentNavigation();
        if (navigation.extras.state){
         const item = navigation.extras.state.item
         this.model= new IntegrationWebModel(
                  item.id,
                  {
                    "web_uid": item.web_bot.web_uid,
                    "display_name": item.web_bot.display_name,
                    "color_code_theme": item.web_bot.color_code_theme,
                    "color_code_text": item.web_bot.color_code_text,
                    "bot_icon": item.web_bot.bot_icon,
                    "bot": (item.web_bot.bot ? item.web_bot.bot.id : null),
                    "bot_type": (item.web_bot.bot_type ? item.web_bot.bot_type.id : null)
                  }
                  
         )
         this.bot_icon= this.model.web_bot.bot_icon;
         this.bot_url = CONFIG.webbot_url +"/index.html?"+
            "web_uid="+this.model.web_bot.web_uid+
            "&host_parent="+window.location.origin+
            "&host_backend="+CONFIG.chat_server_url;
         console.log(this.bot_url);
        }
        console.log(navigation);
      }


    ngOnInit(): void {
        this.list_bots();
        this.list_bot_types();
    }

    list_bots = () => {
        this.botService.list().subscribe((data) => {
            this.bots = data.data.bots;
            console.log(this.bots);
        });
    };
    list_bot_types = () => {
        this.botTypeService.list().subscribe((data) => {
            this.bot_types = data.data.bot_types;
            console.log(this.bot_types);
        });
    };

    onNoClick(): void {
        this.router.navigate(['admin/integrations/web']);
      }

    handleBotIconInput(files) {
        console.log(files);
        if (files[0]) {
            this.bot_icon_reader.readAsDataURL(files[0]);
            this.bot_icon_reader.addEventListener('load', (event) => {
                this.bot_icon = event.target.result;
            });
        } else {
            this.bot_icon = this.model.web_bot.bot_icon;
        }
    }

    create = () => {
        console.log("creating: ", this.model);
        if (!this.model.web_bot.display_name.trim()) {
            this.msg = 'Error occured!!'
            this.notificationService.showNotification('Display Name is required.', 'danger');
            return;
        }
        let payload: any = {
            "web_bot": {
                display_name: this.model.web_bot.display_name.trim(),
                color_code_theme: this.model.web_bot.color_code_theme.trim(),
                color_code_text: this.model.web_bot.color_code_text.trim(),
                bot_icon: (this.bot_icon_reader.result || this.model.bot_icon || null),
                bot: this.model.web_bot.bot || null,
                bot_type: this.model.web_bot.bot_type || null
            }
        }
        if (this.model.id) {
            payload.id = this.model.id;
            this.webService.update(payload).subscribe((data) => {
                console.log(data);
                // this.router.navigate(['admin/integrations/web']);
                // let iframe_element: any = document.getElementById('chatbot-chat-frame');
                // let iframe_src : string = CONFIG.webbot_url +"/index.html?web_uid="+this.model.web_bot.web_uid+"&theme_color="+this.model.web_bot.color_code_theme;
                // iframe_element.src = iframe_element.src;
            });
        } else {
            this.webService.create(payload).subscribe((data) => {
                console.log(data);
                this.router.navigate(['admin/integrations/web']);

            });
        }
    };
    preview = () =>{
        let iframe_element: any = document.getElementById('chatbot-chat-frame');
        let iframe_src : string = CONFIG.webbot_url +"/index.html?"+
            "web_uid="+this.model.web_bot.web_uid+
            "&host_parent="+window.location.origin+
            "&host_backend="+CONFIG.chat_server_url+
            "&theme_color="+this.model.web_bot.color_code_theme.replace("#","")+
            "&text_color="+this.model.web_bot.color_code_text.replace("#","")+
            "&display_name="+this.model.web_bot.display_name+
            // (this.bot_icon ? ("&bot_icon="+btoa(this.bot_icon)) : '')+
            (this.model.web_bot.bot_type ? ("&bot_type="+this.bot_types.find(x=>x.id==this.model.web_bot.bot_type).slug) : '');
        console.log("NEW IFRAME SRC: ", iframe_src);
        iframe_element.src = iframe_src;
    }
    // display_name = new FormControl('', [Validators.required]);
    // getErrorMessage() {
    //   if (this.display_name.hasError('required')) {
    //     return 'You must enter a value';
    //   }
    // }
    // bot_url = this.sanitizer.bypassSecurityTrustUrl("http://localhost/demo_backend/web/index_test2?web_uid="+this.model.web_bot.web_uid+"&amp;host_parent=file://")
   
}
