import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Component, OnInit, HostListener, Inject } from "@angular/core";
import { BotService } from "AdminServices/bot/bot.service";
import { MicrosoftService } from "AdminServices/microsoft/microsoft.service";
import { NotificationService } from "CommonServices/notification/notification.service";
import { PlatformService } from "AdminServices/platform/platform.service";
import { StateService } from "CommonServices/state/state.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MicrosoftCalenderIntegrationModel } from "./microsoft-calender-integration.model";
import { MicrosoftCalenderIntegrationService } from "AdminServices/microsoft-calender-integration/microsoft-calender-integration.service";
import { MatChipInputEvent } from "@angular/material/chips";

@Component({
    selector: "app-integrations-microsoft",
    templateUrl: "./integrations-microsoft.component.html",
    styleUrls: ["./integrations-microsoft.component.css"],
})
export class IntegrationsMicrosoftComponent implements OnInit {
    integrations: any[] = [];
    bots: any[] = [];
    oauth_config: any;
    constructor(
        public dialog: MatDialog,
        private botService: BotService,
        private microsoftService: MicrosoftService,
        private microsoftCalenderIntegrationService: MicrosoftCalenderIntegrationService,
        private platformService: PlatformService,
        private stateService: StateService,
        private notificationService: NotificationService
    ) {}

    ngOnInit() {
        this.refresh();
    }

    on_oauth_dialog_close_event = () => {
        console.log(event);
        this.refresh();
    };

    initiate_oauth = () => {
        const url =
            "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?" +
            "response_type=code" +
            "&client_id=" +
            this.oauth_config.client_id +
            "&redirect_uri=" +
            this.oauth_config.redirect_uri +
            "&scope=" +
            this.oauth_config.scope +
            "&prompt=login" +
            '&state={"project":' +
            this.stateService.state.project.id +
            "," +
            '"frontend_domain":"' +
            location.origin +
            '"}';
        var oauth_window = window.open(url, "name", "height=600,width=450");
        console.log(oauth_window);
        if (window.focus) {
            oauth_window.focus();
        }
        window.addEventListener("message", this.on_oauth_dialog_close_event, false);
    };

    refresh = () => {
        this.list();
        this.getPlatformAppConfig();
    };

    list = () => {
        this.botService.list().subscribe((data) => {
            console.log(data);
            this.bots = data.data.bots;
            this.microsoftService.list({}).subscribe((data: any[]) => {
                console.log(data);
                this.integrations = data;
                console.log(this.integrations);
            });
        });
    };

    attach_bot(integration: any): void {
        console.log(integration);
        const default_users = [];
        const default_time_slot_duration = 60;
        const default_availability = {
            monday: {
                available: true,
                start_time: "10:00",
                end_time: "17:00",
            },
            tuesday: {
                available: true,
                start_time: "10:00",
                end_time: "17:00",
            },
            wednesday: {
                available: true,
                start_time: "10:00",
                end_time: "17:00",
            },
            thursday: {
                available: true,
                start_time: "10:00",
                end_time: "17:00",
            },
            friday: {
                available: true,
                start_time: "10:00",
                end_time: "17:00",
            },
            saturday: {
                available: false,
                start_time: "10:00",
                end_time: "17:00",
            },
            sunday: {
                available: false,
                start_time: "10:00",
                end_time: "17:00",
            },
        };
        const dialogRef = this.dialog.open(IntegrationsMicrosoftAttachBotComponent, {
            width: "800px",
            data: {
                project: this.stateService.state.project.id,
                bots: this.bots,
                model: new MicrosoftCalenderIntegrationModel(
                    0,
                    { id: null },
                    integration.microsoft_user,
                    default_time_slot_duration,
                    default_users,
                    default_availability
                ),
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log("The dialog was closed", result);
                this.refresh();
                this.notificationService.showNotification("Successfully Integrated", "success");
            }
        });
    }
    edit_microsoft_calender_integration(microsoft_calender_integration: MicrosoftCalenderIntegrationModel): void {
        const dialogRef = this.dialog.open(IntegrationsMicrosoftAttachBotComponent, {
            width: "800px",
            data: {
                project: this.stateService.state.project.id,
                bots: this.bots,
                model: microsoft_calender_integration,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log("The dialog was closed", result);
                this.refresh();
                this.notificationService.showNotification("Successfully Updated", "success");
            }
        });
    }
    delete_microsoft_calender_integration(microsoft_calender_integration): void {
        this.microsoftCalenderIntegrationService.delete(microsoft_calender_integration).subscribe((data) => {
            console.log(data);
            this.refresh();
            this.notificationService.showNotification("Successfully Deleted", "success");
        });
    }

    getPlatformAppConfig(): void {
        const params = {
            platform: "microsoft",
        };
        this.platformService.appConfig(params).subscribe((data) => {
            console.log(data);
            this.oauth_config = data.data.oauth_config;
            console.log(this.oauth_config);
        });
    }
}

@Component({
    selector: "app-integrations-microsoft-attach-bot",
    templateUrl: "./integrations-microsoft-attach-bot.component.html",
    styleUrls: ["./integrations-microsoft.component.css"],
})
export class IntegrationsMicrosoftAttachBotComponent implements OnInit {
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    model = this.data.model;
    days: any[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<IntegrationsMicrosoftAttachBotComponent>,
        private microsoftCalenderIntegrationService: MicrosoftCalenderIntegrationService,
        private notificationService: NotificationService
    ) {}

    ngOnInit() {}

    onNoClick(): void {
        this.dialogRef.close(false);
    }

    create = () => {
        console.log("creating: ", this.model);
        let payload: any = {
            bot: this.model.bot.id,
            microsoft_user: this.model.microsoft_user.id,
            time_slot_duration: this.model.time_slot_duration,
            users: this.model.users,
            availability: this.model.availability,
        };
        if (!payload.bot) {
            this.notificationService.showNotification("Please select a bot", "danger");
            return;
        }
        if (!payload.time_slot_duration) {
            this.notificationService.showNotification("Please provide a valid time slot duration", "danger");
            return;
        }
        if (payload.users.length == 0) {
            this.notificationService.showNotification("Please provide at least 1 username", "danger");
            return;
        }
        console.log(payload);
        if (this.model.id) {
            payload.id = this.model.id;
            this.microsoftCalenderIntegrationService.update(payload).subscribe((data) => {
                console.log(data);
                this.dialogRef.close(data);
            });
        } else {
            this.microsoftCalenderIntegrationService.create(payload).subscribe((data) => {
                console.log(data);
                this.dialogRef.close(data);
            });
        }
    };

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        // Add our user
        if ((value || "").trim()) {
            this.model.users.push({ name: value.trim() });
        }

        // Reset the input value
        if (input) {
            input.value = "";
        }
    }

    remove(user: any): void {
        const index = this.model.users.indexOf(user);

        if (index >= 0) {
            this.model.users.splice(index, 1);
        }
    }
}
