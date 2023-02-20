import { Component, OnInit, Inject } from '@angular/core';
import { ProjectService } from 'AdminServices/project/project.service';
import { NotificationService } from 'CommonServices/notification/notification.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ProjectModel } from './project.model';
import { StateService } from 'CommonServices/state/state.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css',],
})
export class ProjectsComponent implements OnInit {
  items: Array<any> = [];
  constructor(
    public dialog: MatDialog,
    private projectService: ProjectService,
    private stateService: StateService,
    private notificationService: NotificationService,
    private router: Router,
  ) { 
    this.stateService.removeItem("project");
  }

  ngOnInit(): void {
      console.log(this.stateService);
    this.refresh();
  }

  refresh = () => {
    this.list();
  }
  list = () => {
    this.projectService.list().subscribe(data => {
      console.log('project data',data);
      this.items = data.data.projects;
      console.log(this.items);
    });
  }
  delete = (item: any) => {
    this.projectService.delete(item).subscribe((data) => {
      
      this.refresh();
      this.notificationService.showNotification('Project Deleted', 'success');
    });
  }
  add(): void {
    const dialogRef = this.dialog.open(ProjectAddComponent, {
      width: "500px",
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log("The dialog was closed", result);
        this.refresh();
        this.notificationService.showNotification('Project Created', 'success');
      }
    });
  }
  edit(item: any): void {
    const dialogRef = this.dialog.open(ProjectAddComponent, {
      width: "500px",
      data: {
        model: new ProjectModel(item.id, item.name)
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log("The dialog was closed", result);
        this.refresh();
        this.notificationService.showNotification('Project Updated', 'success');
      }
    });
  }
  setActiveProject(item: any): void {
    this.stateService.setItem({project: item});
    this.router.navigate(['admin/dashboard']);
  }
}

@Component({
  selector: "project-add",
  templateUrl: "projects-add.component.html",
  styleUrls: ["./projects.component.css"],
})
export class ProjectAddComponent {
  model = this.data.model || new ProjectModel(0, "");
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ProjectAddComponent>,
    private projectService: ProjectService,
    private notificationService: NotificationService
  ) { }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  create = () => {
    console.log("creating: ", this.model);
    const formData: FormData = new FormData();
    if (this.model.name) {
      formData.append('name', this.model.name);
    } else {
      this.notificationService.showNotification('Name is required.', 'danger');
      return;
    }
    if (this.model.id) {
      formData.append('id', this.model.id);
      this.projectService.update(formData).subscribe((data) => {
        console.log(data);
        this.dialogRef.close(data);
      });
    } else {
      this.projectService.create(formData).subscribe((data) => {
        console.log(data);
        this.dialogRef.close(data);
      });
    }

  };
}
