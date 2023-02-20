import { StateService } from 'CommonServices/state/state.service';
import { KpiService } from './../../services/kpi/kpi.service';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { filter } from 'rxjs-compat/operator/filter';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // current = new Date();
  //   t= new Date(this.current.setDate(this.current.getDate() + 7));
  userForm: FormGroup;
  messageForm: FormGroup;
  messageSentandReceiveForm: FormGroup;
  color1old: any;
  color2old: any;
  color3old: any;
  color4old: any;

  color1new: any;
  color2new: any;
  color3new: any;
  color4new: any;
  userData: any[];
  filterLabelData: any[] = [];
  created_count: any[];
  data: any = {
    counts: {}
  };
  userchart = null;
  messagechart = null;
  messagesentandreceivechart = null;
  public start_date:any;
  public start_date_old:any;
  public end_date:any;
  start: any;
  start1: any;
  start2: any;
  end: Date;
  end1: Date;
  end2: any;
  constructor(private kpisService: KpiService,
    private formBuilder: FormBuilder,private stateService: StateService) {
    this.color1old = '#32e6c5';
    this.color2old = '#9a58ed';
    this.color3old = '#27cdf2';
    this.color4old = '#f56953';

    // this.color1new = '#3e95cd';
    this.color1new = '#3d6cb5';
    this.color2new = '#b788f2';
    this.color3new = '#0cc4ed';
    this.color4new = '#f56953';
    
    this.userRate();
    this.messageRate();
    this.messageSentandReceiveRate();
    // let m=this.formgraph.get('start_date').value;
    // console.log();
   }
   userRate () {
    this.userForm = this.formBuilder.group({
      start_date: [''],
      end_date: [''],
    })
   }

   messageRate() {
    this.messageForm = this.formBuilder.group({
      start_date: [''],
      end_date: [''],
    })
   }

   messageSentandReceiveRate () {
    this.messageSentandReceiveForm = this.formBuilder.group({
      start_date: [''],
      end_date: [''],
    })
   }
   refresh() {
    this.kpi_dashboard_index();
  }
  kpi_dashboard_index() {
    this.kpisService.index().subscribe(data => {
      this.data = data;
      console.log(this.data);
    });
  }

  ngOnInit() {
    this.refresh();
    this.User();
    this.messages();
    this.messageSentandReceive();

    this.userForm.controls['start_date'].valueChanges.subscribe(data=>{
      console.log("form change");
      if(this.userForm.controls['start_date'].value){
        this.start = this.userForm.controls['start_date'].value;
        // this.end = this.formgraph.controls['start_date'].value;

        this.end = new Date(this.start)
        this.end.setDate(this.userForm.controls['start_date'].value.getDate() + 14);
        // this.end = this.formgraph.controls['start_date'].value.getDate() + 7;
        console.log('end',this.end);
      }
    });
    this.messageForm.controls['start_date'].valueChanges.subscribe(data => {
      if(this.messageForm.controls['start_date'].value){
        this.start1 = this.messageForm.controls['start_date'].value;
        // this.end = this.formgraph.controls['start_date'].value;

        this.end1 = new Date(this.start1)
        this.end1.setDate(this.messageForm.controls['start_date'].value.getDate() + 14);
        // this.end = this.formgraph.controls['start_date'].value.getDate() + 7;
        console.log('end1',this.end1);
      }
    });
    this.messageSentandReceiveForm.controls['start_date'].valueChanges.subscribe(data => {
      if(this.messageSentandReceiveForm.controls['start_date'].value){
        this.start2 = this.messageSentandReceiveForm.controls['start_date'].value;
        // this.end = this.formgraph.controls['start_date'].value;

        this.end2 = new Date(this.start2)
        this.end2.setDate(this.messageSentandReceiveForm.controls['start_date'].value.getDate() + 14);
        // this.end = this.formgraph.controls['start_date'].value.getDate() + 7;
        console.log('end1',this.end2);
      }
    })
    // this.end = new Date(this.start.setDate(this.start.getDate() + 7));
    // console.log('end',this.end);
    

}
/*-----------------------------------------Users chart--------------------------------------*/
User() {
  let params:any = {};
  params.project_id = this.stateService.state.project.id;
  params.start_date = '1/02/2020';
  console.log(this.userForm);
  let st:any = this.userForm.controls['start_date'];
  let et:any = this.userForm.controls['end_date'];
  // console.log(st.value.getDate()+ '/'+st.value.getMonth()+1+ '/'+st.value.getFullYear());
  params.end_date = '30/07/2020';
  if(st.value && et.value){
    let month = (parseInt(st.value.getMonth())+1);
    params.start_date=st.value.getDate()+ '/'+
    (month<10 ? '0'+month : month)+
     '/'+st.value.getFullYear();

     let month1 = (parseInt(et.value.getMonth())+1);
    params.end_date=et.value.getDate()+ '/'+
    (month1<10 ? '0'+month1 : month1)+
     '/'+et.value.getFullYear();
  }
  console.log(st, et);


  this.kpisService.getUserList(params).subscribe((res) => {
    // const userData = res.user;
    console.log('res', res);
    const userData = res.user;
    console.log("userData",userData);
    
    if (userData.length!=0) {
      const m = moment();
      const mon = new Date(userData[0].date_created).getMonth();
      const year = new Date(userData[0].date_created).getFullYear();
      let labeldata = [];
      if (this.filterLabelData.length === 0) {
        for (let i = 1; i <= 15; i++) {
          labeldata.push( this.setLabelData(i, mon, year));
        }
      } else {
        labeldata = this.filterLabelData;
      }
      console.log(labeldata);
      let filterDay = [];
      let filterData = [];
      userData.map(i => {
        let obj = {
          d1: new Date(i.date_created),
          count: i.created_count
        };
        filterDay.push(obj);
      });
      console.log(filterDay);
      labeldata.map(i => {
        let obj: any = filterDay.filter(j => {
          return  j.d1.getDate() === i.getDate() &&
           j.d1.getMonth() === i.getMonth() && j.d1.getFullYear() === i.getFullYear();
        });
        // console.log(obj);
        if (obj.length === 1) {
          filterData.push(obj[0].count);
        } else {
          filterData.push(null);
        }
      });
      console.log(filterData);
      if (this.userchart !== null) {
        this.userchart.destroy();
      }
      this.userchart = new Chart('userChart', {
      type: 'bar',
      fontSize: 1,
      data: {
        labels: labeldata,
          datasets: [{
              maxBarThickness: 30,
              label: 'Counts ',
              data: filterData,
              backgroundColor: this.color1new,
              borderWidth: 1
          }]
      },
      options: {
        legend: {
          display: false,
        },
        // title: {
        //   display: true,
        //   text: 'Resources Download',
        // },
          scales: {
            xAxes: [{
              ticks: {
                callback: function(value) {
                    return new Date(value).toLocaleDateString('en', {month: 'short', day: 'numeric'});
                },
            },
              // type: 'time',
              // time: {
              //   unit: 'day',
              //   unitStepSize: 1,
              //   displayFormats: {
              //      'day': 'MMM DD'
              //   }
              // }
          }],
              yAxes: [{
                  ticks: {
                      beginAtZero: true,
                  }
              }]
          }
      }
  });
}

});

}

/*---------------------------------------Messages Rate----------------------------------*/

messages() {
  let params:any = {};
  params.project_id = this.stateService.state.project.id;
  params.start_date = '1/02/2020';
  console.log(this.userForm);
  let st:any = this.messageForm.controls['start_date'];
  let et:any = this.messageForm.controls['end_date'];
  // console.log(st.value.getDate()+ '/'+st.value.getMonth()+1+ '/'+st.value.getFullYear());
  params.end_date = '30/07/2020';
  if(st.value && et.value){
    let month = (parseInt(st.value.getMonth())+1);
    params.start_date=st.value.getDate()+ '/'+
    (month<10 ? '0'+month : month)+
     '/'+st.value.getFullYear();

     let month1 = (parseInt(et.value.getMonth())+1);
    params.end_date=et.value.getDate()+ '/'+
    (month1<10 ? '0'+month1 : month1)+
     '/'+et.value.getFullYear();
  }
  console.log(st, et);


  this.kpisService.getMessageRate(params).subscribe((res) => {
    // const userData = res.user;
    console.log('res', res);
    const messageData = res.messages;
    if (messageData.length!=0) {
      const m = moment();
      const mon = new Date(messageData[0].date_created).getMonth();
      const year = new Date(messageData[0].date_created).getFullYear();
      let labeldata = [];
      if (this.filterLabelData.length === 0) {
        for (let i = 1; i <= 15; i++) {
          labeldata.push( this.setLabelData(i, mon, year));
        }
      } else {
        labeldata = this.filterLabelData;
      }
      console.log(labeldata);
      let filterDay = [];
      let filterData = [];
      messageData.map(i => {
        let obj = {
          d1: new Date(i.date_created),
          count: i.created_count
        };
        filterDay.push(obj);
      });
      console.log(filterDay);
      labeldata.map(i => { 
        let obj: any = filterDay.filter(j => {
          return  j.d1.getDate() === i.getDate() &&
           j.d1.getMonth() === i.getMonth() && j.d1.getFullYear() === i.getFullYear();
        });
        // console.log(obj);
        if (obj.length === 1) {
          filterData.push(obj[0].count);
        } else {
          filterData.push(null);
        }
      });
      console.log(filterData);
      if (this.messagechart !== null) {
        this.messagechart.destroy();
      }
      this.messagechart = new Chart('messageChart', {
      type: 'bar',
      fontSize: 1,
      data: {
        labels: labeldata,
          datasets: [{
              maxBarThickness: 30,
              label: 'Counts',
              data: filterData,
              backgroundColor: this.color1new,
              borderWidth: 1,
          }]
      },
      options: {
        legend: {
          display: false,
        },
        // title: {
        //   display: true,
        //   text: 'Resources Download',
        // },
          scales: {
            xAxes: [{
              ticks: {
                callback: function(value) {
                    return new Date(value).toLocaleDateString('en', {month: 'short', day: 'numeric'});
                },
            },
              // type: 'time',
              // time: {
              //   unit: 'day',
              //   unitStepSize: 1,
              //   displayFormats: {
              //      'day': 'MMM DD'
              //   }
              // }
          }],
              yAxes: [{
                  ticks: {
                      beginAtZero: true,
                  }
              }]
          }
      }
  });
}

});

}

/*---------------------------------------Messages Sent and Receive----------------------------------*/

messageSentandReceive() {
  let params:any = {};
  params.project_id = this.stateService.state.project.id;
  params.start_date = '1/06/2020';
  console.log(this.userForm);
  let st:any = this.messageSentandReceiveForm.controls['start_date'];
  let et:any = this.messageSentandReceiveForm.controls['end_date'];
  // console.log(st.value.getDate()+ '/'+st.value.getMonth()+1+ '/'+st.value.getFullYear());
  params.end_date = '30/07/2020';
  if(st.value && et.value){
    let month = (parseInt(st.value.getMonth())+1);
    params.start_date=st.value.getDate()+ '/'+
    (month<10 ? '0'+month : month)+
     '/'+st.value.getFullYear();

     let month1 = (parseInt(et.value.getMonth())+1);
    params.end_date=et.value.getDate()+ '/'+
    (month1<10 ? '0'+month1 : month1)+
     '/'+et.value.getFullYear();
  }
  console.log(st, et);


  this.kpisService.getmessageSentAndReceiveRate(params).subscribe((res) => {
    // const userData = res.user;
    console.log('res', res);
    const messageReceiveData = res.receive_messages;
    const messageSentData = res.sent_messages;
    if (messageReceiveData.length!==0 && messageSentData.length!==0) {
      const m = moment();
      const mon = new Date(messageReceiveData[0] && messageSentData[0].date_created).getMonth();
      const year = new Date(messageReceiveData[0] && messageSentData[0].date_created).getFullYear();
      let labeldata = [];
      if (this.filterLabelData.length === 0) {
        for (let i = 1; i <= 15; i++) {
          labeldata.push( this.setLabelData(i, mon, year));
        }
      } else {
        labeldata = this.filterLabelData;
      }
      console.log(labeldata);
      let filterDay = [];
      let filterData = [];
      messageReceiveData.map(i => {
        let obj = {
          d1: new Date(i.date_created),
          count: i.created_count
        };
        filterDay.push(obj);
      });
      console.log(filterDay);
      labeldata.map(i => { 
        let obj: any = filterDay.filter(j => {
          return  j.d1.getDate() === i.getDate() &&
           j.d1.getMonth() === i.getMonth() && j.d1.getFullYear() === i.getFullYear();
        });
        // console.log(obj);
        if (obj.length === 1) {
          filterData.push(obj[0].count);
        } else {
          filterData.push(null);
        }
      });
      let filterDay1 = [];
      let filterData1 = [];
      messageSentData.map(i => {
        let obj = {
          d1: new Date(i.date_created),
          count: i.created_count
        };
        filterDay1.push(obj);
      });
      console.log(filterDay1);
      labeldata.map(i => { 
        let obj: any = filterDay1.filter(j => {
          return  j.d1.getDate() === i.getDate() &&
           j.d1.getMonth() === i.getMonth() && j.d1.getFullYear() === i.getFullYear();
        });
        // console.log(obj);
        if (obj.length === 1) {
          filterData1.push(obj[0].count);
        } else {
          filterData1.push(null);
        }
      });
      console.log(filterData);
      if (this.messagesentandreceivechart !== null) {
        this.messagesentandreceivechart.destroy();
      }
      this.messagesentandreceivechart = new Chart('messageSentandReceiveChart', {
      type: 'bar',
      fontSize: 1,
      data: {
        labels: labeldata,
          datasets: [{
              maxBarThickness: 30,
              label: 'Counts',
              data: filterData,
              backgroundColor: this.color1new,
              borderWidth: 1,
          },
          {
            maxBarThickness: 30,
            label: 'Counts',
            data: filterData1,
            backgroundColor: 'red',
            borderWidth: 1,
        }]
      },
      options: {
        legend: {
          display: false,
        },
        // title: {
        //   display: true,
        //   text: 'Resources Download',
        // },
          scales: {
            xAxes: [{
              ticks: {
                callback: function(value) {
                    return new Date(value).toLocaleDateString('en', {month: 'short', day: 'numeric'});
                },
            },
              // type: 'time',
              // time: {
              //   unit: 'day',
              //   unitStepSize: 1,
              //   displayFormats: {
              //      'day': 'MMM DD'
              //   }
              // }
          }],
              yAxes: [{
                  ticks: {
                      beginAtZero: true,
                  }
              }]
          }
      }
  });
}

});

}


UserFilter(){  
  this.filterLabelData = this.getDateArray(this.userForm.controls['start_date'].value,this.userForm.controls['end_date'].value);  
  this.User();
  console.log("UserFilter")
  // console.log('start',this.start);
  // this.end = new Date(this.start.setDate(this.start.getDate() + 7));
  //   console.log('end',this.end);
}

MessageFilter(){  
  this.filterLabelData = this.getDateArray(this.messageForm.controls['start_date'].value,this.messageForm.controls['end_date'].value);  
  this.messages();
  console.log("MessageFilter")
  // console.log('start',this.start);
  // this.end = new Date(this.start.setDate(this.start.getDate() + 7));
  //   console.log('end',this.end);
}

MessageSentandReceiveFilter() {
  this.filterLabelData = this.getDateArray(this.messageSentandReceiveForm.controls['start_date'].value,this.messageSentandReceiveForm.controls['end_date'].value);  
  this.messageSentandReceive();
  console.log("MessageFilter")
  // console.log('start',this.start);
  // this.end = new Date(this.start.setDate(this.start.getDate() + 7));
  //   console.log('end',this.end);
}

setLabelData(i:any,mon,year){
  let d = new Date();
  d.setMonth(mon);
  d.setFullYear(year);
  d.setDate(i);
  d.setHours(0);
  d.setMinutes(0);
  d.setSeconds(0);
  return d;
}

getDateArray(start,end){
  let arr = [];
  let dt = new Date(start);
  while (dt <= end) {
      arr.push(new Date(dt));
      dt.setDate(dt.getDate() + 1);
  }
  return arr;
}
}
