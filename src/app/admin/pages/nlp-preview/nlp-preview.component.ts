import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from 'CommonServices/notification/notification.service';


@Component({
  selector: 'app-nlp-preview',
  templateUrl: './nlp-preview.component.html',
  styleUrls: ['./nlp-preview.component.css']
})
export class NlpPreviewComponent implements OnInit {
  input_url: string = "";
  input_val: string = "";
  input_key: string = "";
  response_out: any ;
  constructor(
    private httpClient: HttpClient,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit() {
// http://localhost/demo_backend/web/nlp_preview
// https://ai-nlp-engine.herokuapp.com/nlp-text
 // https://ai-nlp-engine.herokuapp.com/nlp-text?input_key=input_value&input2=value2
}
  
  nlpout = () => {
    if (this.input_url && this.input_val){
    this.httpClient.get(this.input_url+'?'+this.input_key+'='+this.input_val)
    .subscribe(
      (data) => {
        console.log(data) ;
        this.response_out = JSON.stringify(data,null,2);
      }, 
      (error) => { 
        this.notificationService.showNotification('Something went wrong','danger')
        console.log("error!!!"); }
     );
    }
    else{
      this.notificationService.showNotification('All fields are required','danger')
    }
    console.log(this.httpClient);
  }


}
