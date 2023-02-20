import { Component, OnInit } from "@angular/core";
import { PlatformService } from "AdminServices/platform/platform.service";

@Component({
  selector: "app-integrations",
  templateUrl: "./integrations.component.html",
  styleUrls: ["./integrations.component.css"],
})
export class IntegrationsComponent implements OnInit {
  platforms: Array<any> = [];
  constructor(
    private platformService: PlatformService
  ) { }

  ngOnInit() {
    this.refresh();
  }

  refresh(): void {
    this.list();
  }
  list(): void {
    this.platformService.list().subscribe(data => {
      console.log(data);
      this.platforms = data.data.platforms;
    });
  }
}
