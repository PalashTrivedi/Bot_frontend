import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportService } from "AdminServices/report/report.service";
import { BotService } from 'AdminServices/bot/bot.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { FormControl, FormBuilder } from "@angular/forms";
import * as moment from "moment";
@Component({
  selector: 'app-table-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css']
})
export class ReportListComponent implements OnInit {
  

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource: any;
  reportList: Array<any> = [];
  bots: any[] = [];
  public bot: number =0;
  displayedColumns: string[] = ['id','qid','full_name', 'email', 'query_form','created_at'];
  
  public max_date = new Date();
  public start_date = new Date(new Date().setDate(new Date().getDate() - 6));
  public end_date = new Date();
  public start_date_inital = new FormControl(this.start_date);
  public end_date_inital = new FormControl(this.end_date);

  constructor(private reportservice : ReportService,
              private botservice : BotService) { }

              
  ngOnInit() {
    this.listReport();
    // this.botList();
    window.moment = moment;
  }

  event_start_date_changed(event: MatDatepickerInputEvent<Date>): void {
    console.log(event.value);
    this.start_date = event.value;
  }
  event_end_date_changed(event: MatDatepickerInputEvent<Date>): void {
      console.log(event.value);
      this.end_date = event.value;
  }
  refresh() {
    this.listReport();
  }
  get_params(): any {
    var params = {
        start_date: moment(this.start_date).format("YYYY-MM-DD"),
        end_date: moment(this.end_date).format("YYYY-MM-DD")
    };
    return params;
  }
  listReport = () => {
    var params = this.get_params();
    this.reportservice.list(this.bot,params.start_date,params.end_date).subscribe((data) => {
      this.reportList = data;
      console.log(this.reportList);
      this.dataSource = new MatTableDataSource(this.reportList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  };

  // botList = () =>{
  //   this.botservice.list().subscribe((data) => {
  //     this.bots = data.data.bots;
  //     console.log(this.bots);
  //   })
  // }

  importReport = () =>{
    var params = this.get_params();
    this.reportservice.downloadExcelFile(this.bot,params.start_date,params.end_date).subscribe((data) => {
     console.log("hello")
    })
  }
  

}
