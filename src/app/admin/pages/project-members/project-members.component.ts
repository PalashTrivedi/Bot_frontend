import { Component, OnInit, Inject } from "@angular/core";
import { ProjectMemberService } from "AdminServices/project-member/project-member.service";
import { NotificationService } from "CommonServices/notification/notification.service";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { StateService } from "CommonServices/state/state.service";

@Component({
    selector: "app-project-members",
    templateUrl: "./project-members.component.html",
    styleUrls: ["./project-members.component.css"],
})
export class ProjectMembersComponent implements OnInit {
    public project_members: any = [];
    public current_edit_project_member: any;
    public current_edit_role: number;
    public roles_choices: Array<any> = [
        {
            id: 3,
            display_name: "Reviewer",
        },
        {
            id: 4,
            display_name: "Maintainer",
        },
    ];
    constructor(public matDialog: MatDialog, private notificationService: NotificationService, private projectMemberService: ProjectMemberService) {}

    ngOnInit(): void {
        this.refresh();
    }

    refresh(): void {
        this.list();
    }

    list(): void {
        this.projectMemberService.list().subscribe((data) => {
            this.project_members = data.data.project_users;
        });
    }

    add(): void {
        const dialogRef = this.matDialog.open(ProjectMemberAddComponent, {
            width: "500px",
            data: {
                roles_choices: this.roles_choices,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.refresh();
                this.notificationService.showNotification("Project Member Added", "success");
            }
        });
    }

    edit(project_member: any): void {
        this.current_edit_project_member = project_member;
        this.current_edit_role = this.current_edit_project_member.role.id;
    }

    edit_cancel(): void {
        this.current_edit_project_member = null;
        this.current_edit_role = null;
    }

    edit_save(event: any): void {
        console.log(event);
        if (event.value == this.current_edit_project_member.role.id) {
            return;
        }
        let params: any = {
            id: this.current_edit_project_member.id,
            role: event.value,
        };
        this.projectMemberService.update(params).subscribe((data) => {
            this.edit_cancel();
            this.refresh();
            this.notificationService.showNotification("Project Member Updated", "success");
        });
    }

    delete(project_member: any): void {
        this.projectMemberService.delete(project_member).subscribe((data) => {
            this.refresh();
            this.notificationService.showNotification("Project Member Removed", "success");
        });
    }
}

@Component({
    selector: "project-members-add",
    templateUrl: "project-members-add.component.html",
    styleUrls: ["./project-members.component.css"],
})
export class ProjectMemberAddComponent {
    public model: any = {
        email: "",
        role: this.data.roles_choices[0].id,
    };
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ProjectMemberAddComponent>,
        private stateService: StateService,
        private projectMemberService: ProjectMemberService,
        private notificationService: NotificationService,
    ) {}

    onNoClick(): void {
        this.dialogRef.close(false);
    }

    create = () => {
        console.log("creating: ", this.model);
        const params = {
            project: this.stateService.state.project.id,
            user: this.model.email.trim(),
            role: this.model.role,
        };
        let form_email_element: any = document.getElementById("email");
        if (!params.user || !form_email_element.checkValidity()) {
            this.notificationService.showNotification("Please enter a valid email.", "danger");
            return;
        }
        this.projectMemberService.create(params).subscribe((data) => {
            console.log(data);
            this.dialogRef.close(data);
        });
    };
}
