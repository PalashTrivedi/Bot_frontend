import { Component, OnInit, ViewChild } from "@angular/core";
import { Chart } from "chart.js";
import { KpiService } from "AdminServices/kpi/kpi.service";
import { FormControl, FormBuilder } from "@angular/forms";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import * as moment from "moment";
import { CloudData, CloudOptions, TagCloudComponent } from "angular-tag-cloud-module";
import {formatDate } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
    selector: "app-dashboard-project",
    templateUrl: "./dashboard-project.component.html",
    styleUrls: ["./dashboard-project.component.css"],
})
export class DashboardProjectComponent implements OnInit {
    @ViewChild(TagCloudComponent) tagCloudComponent: TagCloudComponent;
    public data: any = {
        counts: {},
        users_new: [],
    };
    public max_date = new Date();
    public start_date = new Date(new Date().setDate(new Date().getDate() - 6));
    public end_date = new Date();
    public start_date_inital = new FormControl(this.start_date);
    public end_date_inital = new FormControl(this.end_date);

    // charts
    userChart: any = null;
    userBouncedChart: any = null;
    messagesChart: any = null;
    formConvRatioChart: any = null;
    words_data: CloudData[] = [];
    conversationsPercentageChart: any = null;
    // conversationsTotalChart: any = null;
    peakHoursChart: any = null;
    api_inprogress: boolean = false;
    reply: string = '';
    reply_width: any = null;
    displayedColumns:any = null;
    dataSource:any = null;
    constructor(private kpiService: KpiService, private formBuilder: FormBuilder) { }
    hide_spinner:boolean = true;
    show_spinner:boolean = false;
    ngOnInit(): void {
        this.refresh();
        // window.ff = this;
        window.moment = moment;
    }

    refresh(): void {
        this.kpi_dashboard_project_index();
    }
    event_start_date_changed(event: MatDatepickerInputEvent<Date>): void {
        console.log(event.value);
        this.start_date = event.value;
    }
    event_end_date_changed(event: MatDatepickerInputEvent<Date>): void {
        console.log(event.value);
        this.end_date = event.value;
    }
    event_submit(): void {
        console.log("StartDate :", this.start_date);
        console.log("EndDate :", this.end_date);
        this.api_inprogress = true;
        this.refresh();
        // this.hide_spinner = true;
    }
    get_params(): any {
        var params = {
            start_date: moment(this.start_date).format("YYYY-MM-DD"),
            end_date: moment(this.end_date).format("YYYY-MM-DD"),
            bot_ids: [],
        };
        console.log(params);
        return params;
    }

    kpi_index(): void {
        this.kpiService.index().subscribe((data) => {
            // this.data = data;
            console.log(data);
        });
    }

    kpi_dashboard_project_index(): void {
        var params = this.get_params();
        this.kpiService.dashboard_project_index(params).subscribe((data) => {
            if (data) { 
                this.hideloader(); 
            } 

            this.data = data;
            this.users_chart();
            this.users_bounced_chart();
            this.messages_chart();
            // this.top_queries_words();
            this.form_conv_ratio_chart();
            this.conversations_percentage_chart();
            // this.conversations_total_chart();
            this.peak_hours_chart();
            console.log(data);
            this.api_inprogress = false;
            this.top_queries();
            // $("#filter_btn").attr("disabled", false);
        });
    }

    hideloader() { 
        // Setting display of spinner 
        // element to none 
        // document.getElementById("loading") 
        //     .style.display = 'none'; 
        // this.hide_spinner = "hidden";
        this.hide_spinner = false;
        this.show_spinner = true;
    } 
    users_chart(): void {
        if (this.userChart) {
            this.userChart.destroy();
        }
        var ctx = document.getElementById("userChart");
        var datasets = [];
        // datasets.push({
        //     maxBarThickness: 30,
        //     label: "Users",
        //     backgroundColor: "#008B8B",
        //     data: this.data.users_total.map((node: any) => {
        //         return { x: new Date(node.date), y: node.count };
        //     }),
        // });
        datasets.push({
            maxBarThickness: 30,
            label: "New Users",
            backgroundColor: "#F08080",
            data: this.data.users_new.map((node: any) => {
                return { x: new Date(node.date), y: node.count };
            }),
        });
        datasets.push({   
            maxBarThickness: 30,
            label: "Repeated Users",
            backgroundColor: "#008B8B",
            data: this.data.users_repeated.map((node: any) => {
                return { x: new Date(node.date), y: node.user };
            }),
        });
        var config = {
            type: "bar",
            data: {
                datasets: datasets,
            },
            options: {
                scales: {
                    xAxes: [
                        {
                            type: "time",
                            time: {
                                unit: "day",
                                round: "day",
                                displayFormats: {
                                    day: "D MMM",
                                },
                            },
                            offset: true,
                            ticks: {
                                min: this.start_date,
                                max: this.end_date,
                            },
                        },
                    ],
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: true,
                                precision: 0,
                            },
                        },
                    ],
                },
                tooltips: {
                    callbacks: {
                        title: function (t, d) {
                            // console.log(t, d);
                            return t[0].label.split(",")[0];
                        },
                    },
                },
            },
        };
        this.userChart = new Chart(ctx, config);
    }

    users_bounced_chart(): void {
        if (this.userBouncedChart) {
            this.userBouncedChart.destroy();
        }
        var ctx = document.getElementById("userBouncedChart");
        var datasets = [];
        datasets.push({
            maxBarThickness: 30,
            label: "Users",
            backgroundColor: "#528f36",
            data: this.data.users_bounced.map((node: any) => {
                return { x: new Date(node.date), y: node.count };
            }),
        });
        var config = {
            type: "bar",
            data: {
                datasets: datasets,
            },
            options: {
                scales: {
                    xAxes: [
                        {
                            type: "time",
                            time: {
                                unit: "day",
                                round: "day",
                                displayFormats: {
                                    day: "D MMM",
                                },
                            },
                            offset: true,
                            ticks: {
                                min: this.start_date,
                                max: this.end_date,
                            },
                        },
                    ],
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: true,
                                precision: 0,
                            },
                        },
                    ],
                },
                tooltips: {
                    callbacks: {
                        title: function (t, d) {
                            // console.log(t, d);
                            return t[0].label.split(",")[0];
                        },
                    },
                },
            },
        };
        this.userBouncedChart = new Chart(ctx, config);
    }

    messages_chart(): void {
        if (this.messagesChart) {
            this.messagesChart.destroy();
        }
        var ctx = document.getElementById("messagesChart");
        var datasets = [];
        datasets.push({
            maxBarThickness: 30,
            label: "Messages",
            backgroundColor: "#cd754c",
            data: this.data.messages_total.map((node: any) => {
                return { x: new Date(node.date), y: node.count };
            }),
        });
        var config = {
            type: "bar",
            data: {
                datasets: datasets,
            },
            options: {
                scales: {
                    xAxes: [
                        {
                            type: "time",
                            time: {
                                unit: "day",
                                round: "day",
                                displayFormats: {
                                    day: "D MMM",
                                },
                            },
                            offset: true,
                            ticks: {
                                min: this.start_date,
                                max: this.end_date,
                            },
                        },
                    ],
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: true,
                                precision: 0,
                            },
                        },
                    ],
                },
                tooltips: {
                    callbacks: {
                        title: function (t, d) {
                            // console.log(t, d);
                            return t[0].label.split(",")[0];
                        },
                    },
                },
            },
        };
        this.messagesChart = new Chart(ctx, config);
    }

    form_conv_ratio_chart(): void {
        if (this.formConvRatioChart) {
            this.formConvRatioChart.destroy();
        }
        var ctx = document.getElementById("formConvRatioChart");
        var datasets = [];
        datasets.push({
            maxBarThickness: 30,
            // fill: false,
            label: "Conversations",
            backgroundColor: "#003399",
            borderColor: "#003399",
            data: this.data.form_conv_ratio_conversations.map((node: any) => {
                return { x: new Date(node.date), y: node.conversation_count };
            }),
        });
        datasets.push({
            maxBarThickness: 30,
            // fill: false,
            label: "Query Forms",
            borderColor: "#009999",
            backgroundColor: "#009999",

            data: this.data.form_conv_ratio_query_form.map((node: any) => {
                return { x: new Date(node.date), y: node.query_forms };
            }),
        });

        var config = {
            type: "bar",
            data: {
                datasets: datasets,
            },
            options: {
                scales: {
                    xAxes: [
                        {
                            type: "time",
                            time: {
                                unit: "day",
                                round: "day",
                                displayFormats: {
                                    day: "D MMM",
                                },
                            },
                            offset: true,
                            ticks: {
                                min: this.start_date,
                                max: this.end_date,
                            },
                        },
                    ],
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: true,
                                precision: 0,
                            },
                        },
                    ],
                },
                tooltips: {
                    callbacks: {
                        title: function (t, d) {
                            // console.log(t, d);
                            return t[0].label.split(",")[0];
                        },
                    },
                },
            },
        };
        Chart.defaults.line.spanGaps = true;
        this.formConvRatioChart = new Chart(ctx, config);
    }

    // top_queries_words(): void {
    //     this.words_data = this.data.top_queries_words.map((x: any) => {
    //         return { text: x[0], weight: x[1], color: "#ffaaee" };
    //     });
    //     this.tagCloudComponent.reDraw();
    // }

    conversations_percentage_chart(): void {
        if (this.conversationsPercentageChart) {
            this.conversationsPercentageChart.destroy();
        }
        var ctx = document.getElementById("conversationsPercentageChart");
        var datasets = [this.data.conversations_completed_count, this.data.conversations_ongoing_count, this.data.conversations_refreshed_count];
        var config = {
            type: "doughnut",
            data: {
                labels: ["Completed", "OnGoing", "Refreshed"],
                datasets: [
                    {
                        label: "Conversations",
                        backgroundColor: ["#F08080", "#d1b202", "#075354"],
                        data: datasets,
                    },
                ],
            },
            options: {
                title: {
                    display: true,
                    text: "Conversation Completion Rate",
                },
            },
        };
        this.conversationsPercentageChart = new Chart(ctx, config);
    }

    // conversations_total_chart(): void {
    //     if (this.conversationsTotalChart) {
    //         this.conversationsTotalChart.destroy();
    //     }
    //     var ctx = document.getElementById("conversationsTotalChart");
    //     var datasets = [];
    //     datasets.push({
    //         maxBarThickness: 30,
    //         label: "Users",
    //         backgroundColor: "red",
    //         data: this.data.conversations_total.map((node: any) => {
    //             return { x: new Date(node.date), y: node.count };
    //         }),
    //     });
    //     var config = {
    //         type: "bar",
    //         data: {
    //             datasets: datasets,
    //         },
    //         options: {
    //             scales: {
    //                 xAxes: [
    //                     {
    //                         type: "time",
    //                         time: {
    //                             unit: "day",
    //                             round: "day",
    //                             displayFormats: {
    //                                 day: "D MMM",
    //                             },
    //                         },
    //                         offset: true,
    //                         ticks: {
    //                             min: this.start_date,
    //                             max: this.end_date,
    //                         },
    //                     },
    //                 ],
    //                 yAxes: [
    //                     {
    //                         ticks: {
    //                             beginAtZero: true,
    //                             precision: 0,
    //                         },
    //                     },
    //                 ],
    //             },
    //             tooltips: {
    //                 callbacks: {
    //                     title: function (t, d) {
    //                         // console.log(t, d);
    //                         return t[0].label.split(",")[0];
    //                     },
    //                 },
    //             },
    //         },
    //     };
    //     this.conversationsTotalChart = new Chart(ctx, config);
    // }

    peak_hours_chart(): void {
        if (this.peakHoursChart) {
            this.peakHoursChart.destroy();
        }
        var progress = document.getElementById('animationProgress');
        var ctx = document.getElementById("peakHoursChart");
        var datasets = [];
        var x_label=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        var chart_data = this.data.peak_hours_messages.map((node: any) => {
            x_label[parseInt(node.hours)-1] = node.messages;
        })
        datasets.push({
            // maxBarThickness: 30,
            // fill: false,
            label: "Cummulative Conversations from " +"("+ formatDate(this.start_date,'dd/MM/yy','en') +" to " +formatDate(this.end_date,'dd/MM/yy','en')+")", 
            borderColor: "#5F9EA0",
            data:x_label
        });
        var config = {
            type: "line",
            data: {
                datasets: datasets,
                labels:['1AM','2AM','3AM','4AM','5AM','6AM','7AM','8AM','9AM','10AM','11AM','12PM','1PM','2PM','3PM','4PM','5PM','6PM','7PM','8PM','9PM','10PM','11PM','12AM']
            },
            options: {  
                scales: {
                    xAxes: [
                        {
                            // type: "time",
                            // time: {
                                // unit: "hour",
                            // },
                            // distribution: 'series',
                            offset: true,
                            ticks: {
                                min: 1,
                                max: 24,
                                autoSkip : false
                            },
                        },
                    ],
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: true,
                                precision: 0,
                            },
                        },
                    ],
                },
                tooltips: {
                    callbacks: {
                        title: function (t, d) {
                            // console.log(t, d);
                            return t[0].label.split(",")[0];
                        },
                    },
                },
            },
        };
        Chart.defaults.line.spanGaps = true;
        this.peakHoursChart = new Chart(ctx, config);
    }
    top_queries():void{
        // this.reply= this.data.top_queries_words.map((node: any) => {
        //     console.log("node",node[0]);
        //     var res = node[1]*10;
        //     var replies_width =`linear-gradient(90deg,#FFC0CB,${res}%,white ${res}%)`;
        //     return {x:node[0], y:replies_width}
        // }) 
        // console.log("queries",this.reply);
        // this.reply_width = 'style="background:linear-gradient(90deg, #FFC0CB 50%, #00FFFF 50%);"'
        // document.getElementById('quick_replies').style.background = this.reply_width;
        var ELEMENT_DATA = this.data.top_queries_words.map((node: any) => {
            //     console.log("node",node[0]);   
            return {name:node[0],count:node[1]}
        }) 
        this.displayedColumns = ['name', 'count'];
        this.dataSource = ELEMENT_DATA;
    }
}
