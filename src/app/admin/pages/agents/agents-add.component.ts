import { Component, OnInit, Inject } from '@angular/core';
import { AgentModel, AgentConfigModel } from './agent.model';
import { StateService } from 'CommonServices/state/state.service';
import { AiProviderService } from 'AdminServices/ai-provider/ai-provider.service';
import { NotificationService } from 'CommonServices/notification/notification.service';
import { AgentService } from 'AdminServices/agent/agent.service';
import { Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import {FormControl, Validators} from '@angular/forms';


@Component({
    selector: "agent-add",
    templateUrl: "agents-add.component.html",
    styleUrls: ["./agents.component.css"],
  })
  export class AgentAddComponent implements OnInit {
    msg: string = ''
    ai_providers: Array<any> = [];
    model:any = new AgentModel(
            0,
            "",
            this.stateService.state.project.id,
            null,
            new AgentConfigModel(0, '{}', '{}', '{}')
          )

    constructor(
      private stateService:StateService,
      private aiProviderService:AiProviderService,
      private notificationService: NotificationService,
      private agentService: AgentService,
      private router:Router,
      private route: ActivatedRoute,
    ) {
      const navigation = this.router.getCurrentNavigation();
      if (navigation.extras.state){
       const item = navigation.extras.state.item
        this.model = new AgentModel(
              item.id,
              item.name,
              this.stateService.state.project.id,
              (item.ai_provider.id ? item.ai_provider.id : null),
              new AgentConfigModel(item.agent_config.id, item.agent_config.nlp_config, item.agent_config.stt_config, item.agent_config.tts_config)
            )
      }
      console.log(navigation);
    }
    ngOnInit(): void {
      this.list_ai_providers();
      console.log(this.route)
    }
    list = () => {
      this.agentService.list().subscribe(data => {
        // this.agents = data;
        // console.log(this.agents);
      });
    }
    list_ai_providers = () => {
      this.aiProviderService.list().subscribe(data => {
        this.ai_providers = data.data.ai_providers;
        console.log(this.ai_providers);
      });
    }
  
    onNoClick(): void {
      this.router.navigate(['admin/agents']);
    }
  
    create = () => {
      console.log("creating: ", this.model);
      if (!this.model.name.trim()) {
        // document.getElementById('error_msg').innerHTML = "Error occured";
        this.msg = 'Error occured!!'
        this.notificationService.showNotification('Name is required.', 'danger');
        return;
      }
      let payload: any = {
        name: this.model.name.trim(),
        project: this.model.project,
        ai_provider: this.model.ai_provider,
        agent_config: this.model.agent_config
      }
      if (this.model.id) {
        payload.id = this.model.id;
        this.agentService.update(payload).subscribe((data) => {
          console.log(data);
          this.notificationService.showNotification('Updated Successfully', 'success');
          this.router.navigate(['admin/agents']);
        });
      } else {
        this.agentService.create(payload).subscribe((data) => {
          console.log(data);
          this.notificationService.showNotification('Created Successfully', 'success');
          this.router.navigate(['admin/agents']);
        });
      }
    };
    // name = new FormControl('', [Validators.required]);
    // getErrorMessage() {
    //   if (this.name.hasError('required')) {
    //     return 'You must enter a value';
    //   }
    // }
    // ai_provide = new FormControl('', [Validators.required]);
    // getErrorMessage() {
    //   if (this.name.hasError('required')) {
    //     return 'You must enter a value';
    //   }
    // }
  }
  