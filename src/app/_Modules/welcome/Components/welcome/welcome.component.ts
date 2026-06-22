// import { Component, OnDestroy, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';
// import { AuthenticationService } from '@NFS_Core/NFSServices/Authentication/authentication.service';
// import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
// import { QuotationService } from '@NFS_Core/NFSServices/Quotation/quotation.service';
// import { IQuotationInfoParm } from '@NFS_Interfaces/RequestInterfaces/IQuotationInfoParm';
// import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
// import { Color, Label, MultiDataSet } from 'ng2-charts';
// import { Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';


// @Component({
//   selector: 'app-welcome',
//   templateUrl: './welcome.component.html',
//   styleUrls: ['./welcome.component.css']
// })
// export class WelcomeComponent implements OnInit, OnDestroy {

//   username!: string;
//   nodata!: string;
//   AssignRequest = {} as IQuotationInfoParm;
//   subscription$ = new Subject();
//   // Demo chart 1
//   public doughnutChartType: ChartType = 'doughnut';
//   public doughnutChartLabels: Label[] = [];
//   public doughnutChartData: MultiDataSet = [];
//   public colors: Color[] = [];
//   public statusColor: any[] = [{ statusDesc: 'Draft', colorCode: '#fff5e4' }, { statusDesc: 'Submitted', colorCode: '#e9fbee' }, { statusDesc: 'Assigned', colorCode: '#e9fbee' }, { statusDesc: 'Cancelled', colorCode: '#ffeeec' }, { statusDesc: 'New', colorCode: '#f2f2f2' }, { statusDesc: 'Submitted to CAP', colorCode: '#fff2cc' }];
//   public Colorlist: string[] = [];
//   public fpColorlist: string[] = [];
//   //{ backgroundColor: ['#0F9F6E', '#E2F0FF', '#FDF6B2', '#F9E8E8', '#FDEFDF'] }
//   // options = {
//   //   legend: {
//   //     display: true,
//   //     position: 'right',
//   //     labels: {
//   //       usePointStyle: true
//   //     }
//   //   }
//   // };
//   public options: any = {
//     legend: {
//       position: 'right',
//       labels: {
//         usePointStyle: true
//       }
//     }
//   }
//   // End Demo chart 1

//   // Demo chart 2

//   /**
//  * Horizontal bar chart
//  */

//   public barChartOptions: ChartOptions = {
//     legend: {
//       position: 'right',
//       align: 'center',
//       labels: {
//         fontSize: 10,
//         boxWidth: 10,

//       }
//     },
//     scales: {
//       xAxes: [
//         {
//           stacked: false,
//           gridLines: {
//             display: false
//           }
//         }
//       ],
//       yAxes: [
//         {
//           stacked: false,
//           gridLines: {
//             display: false
//           }
//         }

//       ]
//     }
//   };


//   // public barChartOptions = {
//   //   scaleShowVerticalLines: true,
//   //   responsive: true,
//   //   scales: {
//   //     xAxes: [
//   //       {
//   //         stacked: false,
//   //         gridLines: {
//   //           display: false
//   //         }
//   //       }
//   //     ],
//   //     yAxes: [
//   //       {
//   //         stacked: false,
//   //         gridLines: {
//   //           display: false
//   //         }
//   //       }

//   //     ]
//   //   }
//   // };

//   public barChartLabels: Label[] = [''];
//   public barChartType: ChartType = 'bar';
//   public barChartLegend = true;
//   public barChartcolors: Color[] = [];
//   public barChartPlugins = [];
//   // public barChartDataObj = {
//   //   data:[],
//   //   label:''
//   // }
//   public fpColors: any[] = [{ fpCamp: 'FPC FI-Effect-MCOM', colorCode: '#0F9F6E' }, { fpCamp: 'FPC IC FI-Effective', colorCode: '#DDF7EC' }, { fpCamp: 'OTO REFINANCE', colorCode: '#FDF6B2' }, { fpCamp: 'OTO REFINANCE MCOM', colorCode: '#F9E8E8' }, { fpCamp: 'Operating Lease', colorCode: '#FDEFDF' }];
//   public barChartData: ChartDataSets[] = [{ data: [], label: "None" }];

//   constructor(private authService: AuthenticationService,
//     private router: Router,
//     private _AppConfig: AppConfigService, private storageService: ClientStoreService, private _QuotationService: QuotationService) {
//   }

//   ngOnInit(): void {
//     this.username = this.storageService.GetUserInfo()?.UserName;
//     this.getLeadStatuses();
//     this.getTopFinancialProducts();
//   }

//   getLeadStatuses(): any {
//     this.AssignRequest.USERID = this.storageService.GetUserInfo()?.UserId;
//     this.AssignRequest.UserGroup = this.storageService.GetUserGroupCode();
//     let statpercent: number[] | any[] = [];
//     let maxSum = 0;

//     this._QuotationService.ReadLeadStatuses(this.AssignRequest).pipe(takeUntil(this.subscription$)).subscribe(response => {
//       if (response && response.ResultSet) {
//         for (let i = 0; i < response.ResultSet.length; i++) {
//           if (response.ResultSet[i].STATUSDSC == 'SubmittedToCAP') {
//             response.ResultSet[i].STATUSDSC = 'Submitted to CAP';
//           }
//           statpercent[i] = response.ResultSet[i]?.STATUSCOUNT;
//         }
//         for (let i = 0; i < statpercent.length - 1; i++) {
//           maxSum = statpercent[i] + maxSum;
//         }

//         if (response.ResultSet.length > 0) {
//           response.ResultSet[response.ResultSet.length - 1].STATUSCOUNT = Number((100 - maxSum).toFixed(2));
//         }

//         for (let i = 0; i < response.ResultSet.length; i++) {
//           this.doughnutChartLabels.push(response.ResultSet[i]?.STATUSCOUNT + "% (" + response.ResultSet[i]?.STATUSDSC + ")");
//           this.doughnutChartData.push(response.ResultSet[i]?.STATUSCOUNT);
//           let Color1 = this.statusColor.filter(z => z?.statusDesc == response.ResultSet[i]?.STATUSDSC)[0];
//           if (Color1)
//             this.Colorlist.push(Color1.colorCode);
//         }
//         this.colors = [{ backgroundColor: this.Colorlist }];
//       }
//       else if (response.ResultSet.length == 0) {
//         this.nodata = 'No Data Available';
//       }
//       if (response.error) {
//         return;
//       }
//     });
//   }

//   getTopFinancialProducts(): any {
//     this.AssignRequest.USERID = this.storageService.GetUserInfo()?.UserId;
//     this.AssignRequest.UserGroup = this.storageService.GetUserGroupCode();

//     this._QuotationService.ReadTopFinancialProducts(this.AssignRequest).pipe(takeUntil(this.subscription$)).subscribe(response => {
//       if (response && response.ResultSet) {

//         if (response.ResultSet.length > 0) {
//           this.barChartData = [];
//         }

//         for (let i = 0; i < response.ResultSet.length; i++) {
//           if (response.ResultSet[i]?.FINANCIALCAMPAIGN) {

//             if (response.ResultSet[i].FINCAMPCOUNT != 0 || response.ResultSet[i].FINCAMPCOUNT != null || response.ResultSet[i].FINCAMPCOUNT != undefined) {

//               this.barChartData.push({ 'data': [response.ResultSet[i]?.FINCAMPCOUNT], 'label': response.ResultSet[i]?.FINANCIALCAMPAIGN });

//               // this.barChartLabels.push(response.ResultSet[i]?.FINANCIALCAMPAIGN);
//               // this.barChartData.push(response.ResultSet[i]?.FINCAMPCOUNT);
//               let Color1 = this.fpColors.filter(z => z?.fpCamp == response.ResultSet[i]?.FINANCIALCAMPAIGN)[0];
//               if (Color1)
//                 this.fpColorlist.push(Color1.colorCode);
//             }
//           }
//         }
//         this.barChartcolors = [{ backgroundColor: this.fpColorlist }];
//       }
//       else {
//         this.nodata = 'No Data Available';
//       }
//       if (response.error) {
//         return;
//       }
//     });
//   }

//   ngOnDestroy(): void {
//     this.subscription$.next(true);
//     this.subscription$.complete();
//   }

// }

// import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
// import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
// import { BaseChartDirective } from 'ng2-charts';
// import DataLabelsPlugin from 'chartjs-plugin-datalabels';
// import { Router } from '@angular/router';
// import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';
// import { AuthenticationService } from '@NFS_Core/NFSServices/Authentication/authentication.service';
// import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
// import { QuotationService } from '@NFS_Core/NFSServices/Quotation/quotation.service';
// import { IQuotationInfoParm } from '@NFS_Interfaces/RequestInterfaces/IQuotationInfoParm';
// import { Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';

// @Component({
//   selector: 'app-welcome',
//   templateUrl: './welcome.component.html',
//   styleUrls: ['./welcome.component.css']
// })
// export class WelcomeComponent implements OnInit, OnDestroy {
//   @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
//   username!: string;
//   nodata!: string;
//   AssignRequest = {} as IQuotationInfoParm;
//   subscription$ = new Subject();
//   public doughnutChartLabels: string[] = [];
//   public doughnutChartData: ChartData<'doughnut'> = {
//     labels: this.doughnutChartLabels,
//     datasets: []
//   };
//   public doughnutChartType: ChartType = 'doughnut';

//   public barChartLabels: string[] = [''];
//   public barChartType: ChartType = 'bar';
//   public barChartLegend = true;
//   public fpColorlist: string[] = [];
//   public barChartPlugins = [
//     DataLabelsPlugin
//   ];
//   // public barChartDataObj = {
//   //   data:[],
//   //   label:''
//   // }
//   public fpColors: any[] = [{ fpCamp: 'FPC FI-Effect-MCOM', colorCode: '#0F9F6E' }, { fpCamp: 'FPC IC FI-Effective', colorCode: '#DDF7EC' }, { fpCamp: 'OTO REFINANCE', colorCode: '#FDF6B2' }, { fpCamp: 'OTO REFINANCE MCOM', colorCode: '#F9E8E8' }, { fpCamp: 'Operating Lease', colorCode: '#FDEFDF' }];

//   constructor(private authService: AuthenticationService,
//     private router: Router,
//     private _AppConfig: AppConfigService, private storageService: ClientStoreService, private _QuotationService: QuotationService) {
//   }


//     ngOnInit(): void {
//     this.username = this.storageService.GetUserInfo()?.UserName;
//     this.getLeadStatuses();
//     this.getTopFinancialProducts();
//   }

//   public barChartOptions: ChartConfiguration['options'] = {
//     responsive: true,
//     // We use these empty structures as placeholders for dynamic theming.
//     scales: {
//       x: {},
//       y: {
//         min: 10
//       }
//     },
//     plugins: {
//       legend: {
//         display: true,
//       },
//       datalabels: {
//         anchor: 'end',
//         align: 'end'
//       }
//     }
//   };



//   public barChartData: ChartData<'bar'> = {
//     labels: [ '2006', '2007', '2008', '2009', '2010', '2011', '2012' ],
//     datasets: [
//       { data: [ 65, 59, 80, 81, 56, 55, 40 ], label: 'Series A' },
//       { data: [ 28, 48, 40, 19, 86, 27, 90 ], label: 'Series B' }
//     ]
//   };

//   // events
//   public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
//     console.log(event, active);
//   }

//   public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
//     console.log(event, active);
//   }

//   public randomize(): void {
//     // Only Change 3 values
//     this.barChartData.datasets[0].data = [
//       Math.round(Math.random() * 100),
//       59,
//       80,
//       Math.round(Math.random() * 100),
//       56,
//       Math.round(Math.random() * 100),
//       40 ];

//     this.chart?.update();
//   }


//   getTopFinancialProducts(): any {
//     this.AssignRequest.USERID = this.storageService.GetUserInfo()?.UserId;
//     this.AssignRequest.UserGroup = this.storageService.GetUserGroupCode();

//     this._QuotationService.ReadTopFinancialProducts(this.AssignRequest).pipe(takeUntil(this.subscription$)).subscribe(response => {
//       if (response && response.ResultSet) {

//         if (response.ResultSet.length > 0) {
//           this.barChartData.datasets = [];
//         }

//         for (let i = 0; i < response.ResultSet.length; i++) {
//           if (response.ResultSet[i]?.FINANCIALCAMPAIGN) {

//             if (response.ResultSet[i].FINCAMPCOUNT != 0 || response.ResultSet[i].FINCAMPCOUNT != null || response.ResultSet[i].FINCAMPCOUNT != undefined) {

//               this.barChartData.datasets.push({ 'data': [response.ResultSet[i]?.FINCAMPCOUNT], 'label': response.ResultSet[i]?.FINANCIALCAMPAIGN });

//               // this.barChartLabels.push(response.ResultSet[i]?.FINANCIALCAMPAIGN);
//               // this.barChartData.push(response.ResultSet[i]?.FINCAMPCOUNT);
//               let Color1 = this.fpColors.filter(z => z?.fpCamp == response.ResultSet[i]?.FINANCIALCAMPAIGN)[0];
//               if (Color1)
//                 this.fpColorlist.push(Color1.colorCode);
//             }
//           }
//         }
//         // this.barChartcolors = [{ backgroundColor: this.fpColorlist }];
//       }
//       else {
//         this.nodata = 'No Data Available';
//       }
//       if (response.error) {
//         return;
//       }
//     });
//   }

//     getLeadStatuses(): any {
//     this.AssignRequest.USERID = this.storageService.GetUserInfo()?.UserId;
//     this.AssignRequest.UserGroup = this.storageService.GetUserGroupCode();
//     let statpercent: number[] | any[] = [];
//     let maxSum = 0;

//     this._QuotationService.ReadLeadStatuses(this.AssignRequest).pipe(takeUntil(this.subscription$)).subscribe(response => {
//       if (response && response.ResultSet) {
//         for (let i = 0; i < response.ResultSet.length; i++) {
//           if (response.ResultSet[i].STATUSDSC == 'SubmittedToCAP') {
//             response.ResultSet[i].STATUSDSC = 'Submitted to CAP';
//           }
//           statpercent[i] = response.ResultSet[i]?.STATUSCOUNT;
//         }
//         for (let i = 0; i < statpercent.length - 1; i++) {
//           maxSum = statpercent[i] + maxSum;
//         }

//         if (response.ResultSet.length > 0) {
//           response.ResultSet[response.ResultSet.length - 1].STATUSCOUNT = Number((100 - maxSum).toFixed(2));
//         }

//         for (let i = 0; i < response.ResultSet.length; i++) {
//           this.doughnutChartLabels.push(response.ResultSet[i]?.STATUSCOUNT + "% (" + response.ResultSet[i]?.STATUSDSC + ")");
//           this.doughnutChartData.datasets.push(response.ResultSet[i]?.STATUSCOUNT);

//       //     let Color1 = this.statusColor.filter(z => z?.statusDesc == response.ResultSet[i]?.STATUSDSC)[0];
//       //     if (Color1)
//       //       this.Colorlist.push(Color1.colorCode);
//       //   }
//       //   this.colors = [{ backgroundColor: this.Colorlist }];
//       // }
//       // else if (response.ResultSet.length == 0) {
//       //   this.nodata = 'No Data Available';
//       // }
//       // if (response.error) {
//       //   return;
//       // }
//         }
//       }
//     })
//   }

//     ngOnDestroy(): void {
//     this.subscription$.next(true);
//     this.subscription$.complete();
//   }
// }

import { Router } from '@angular/router';
import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';
import { AuthenticationService } from '@NFS_Core/NFSServices/Authentication/authentication.service';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { QuotationService } from '@NFS_Core/NFSServices/Quotation/quotation.service';
import { IQuotationInfoParm } from '@NFS_Interfaces/RequestInterfaces/IQuotationInfoParm';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Component, OnDestroy, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.css'],
    standalone: false
})
export class WelcomeComponent implements OnDestroy {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  username!: string;
  nodata!: string;
  public fpColorlist: string[] = [];
  AssignRequest = {} as IQuotationInfoParm;
  subscription$ = new Subject();
  public fpColors: any[] = [{ fpCamp: 'FPC IC FP-Flat', colorCode: '#0F9F8E' }, , { fpCamp: 'FPC IC FI-Flat', colorCode: '#0F8E4E' }, { fpCamp: 'FPC FI-Effect-MCOM', colorCode: '#0F9F6E' }, { fpCamp: 'FPC IC FI-Effective', colorCode: '#DDF7EC' }, { fpCamp: 'OTO REFINANCE', colorCode: '#FDF6B2' }, { fpCamp: 'OTO REFINANCE MCOM', colorCode: '#F9E2E8' }, { fpCamp: 'Operating Lease', colorCode: '#FDEFDF' }];

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 0
      }
    },
    plugins: {
      legend: {
        display: false,
      },
    }
  };
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: []
  };
  public doughnutChartType: ChartType = 'doughnut';

  public barChartType: ChartType = 'bar';

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [],
  };

  constructor(private authService: AuthenticationService,
    private router: Router,
    private _AppConfig: AppConfigService, private storageService: ClientStoreService, private _QuotationService: QuotationService, private _proposalService: ProposalService) {
  }
  // events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  ngOnInit(): void {
    this.username = this.storageService.GetUserInfo()?.UserName;
    this.getTopFinancialProducts();
    this.getTopSellingAssets();
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public randomize(): void {
    // Only Change 3 values
    this.barChartData.datasets[0].data = [
      Math.round(Math.random() * 100),
      59,
      80,
      Math.round(Math.random() * 100),
      56,
      Math.round(Math.random() * 100),
      40];

    this.chart?.update();
  }

  getTopFinancialProducts(): any {
    var params = {} as IProposalInfoParm;
    params.ToDate = new Date(Date.now());
    params.FromDate = new Date(Date.now());
    params.FromDate.setDate(params.FromDate.getDate() - 30);
    params.BranchID = this.storageService.GetUserInfo().BranchId;
    this._proposalService.ReadTopFinancialProducts(params).pipe(takeUntil(this.subscription$)).subscribe(response => {


      if (response && response.ResultSet) {

        if (response.ResultSet.length > 0) {
          this.barChartData.datasets = [];

          this.barChartData.labels = [];

        }

        var countData = [];
        for (let i = 0; i < response.ResultSet.length; i++) {
          if (response.ResultSet[i]?.FINANCIALPRODUCTNAME) {

            if (response.ResultSet[i].COUNT != 0 || response.ResultSet[i].COUNT != null || response.ResultSet[i].COUNT != undefined) {
              this.barChartData.labels?.push(response.ResultSet[i]?.FINANCIALPRODUCTNAME);
              countData.push(response.ResultSet[i]?.COUNT);
              let Color1 = this.fpColors.filter(z => z?.fpCamp == response.ResultSet[i]?.FINANCIALPRODUCTNAME)[0];
              if (Color1)
                this.fpColorlist.push(Color1.colorCode);
            }
          }
        }
        this.barChartData.datasets = [
          {
            data: countData,
            label: '',
            // backgroundColor:['#fffff','#ff6384','#ff9231','#ff6384','#ff7323','#ff6384','#ff1321'],
            backgroundColor: this.fpColorlist,
            // borderColor:[],
            // borderWidth: 1,
          }
        ]
        this.chart?.update();
      }
      else {
        this.nodata = 'No Data Available';
      }
      if (response.error) {
        return;
      }
    });
  }

  getTopSellingAssets(): any {
    var params = {} as IProposalInfoParm;
    params.ToDate = new Date(Date.now());
    params.FromDate = new Date(Date.now());
    params.FromDate.setDate(params.FromDate.getDate() - 30);
    params.BranchID = this.storageService.GetUserInfo().BranchId;
    this._proposalService.ReadTopSellingAssets(params).pipe(takeUntil(this.subscription$)).subscribe(response => {


      if (response && response.ResultSet) {

        if (response.ResultSet.length > 0) {
          this.doughnutChartData.datasets = [];

          this.doughnutChartData.labels = [];

        }
        var countData = [];
        for (let i = 0; i < response.ResultSet.length; i++) {
          if (response.ResultSet[i]?.ASSETMODELNAME) {

            if (response.ResultSet[i].COUNT != 0 || response.ResultSet[i].COUNT != null || response.ResultSet[i].COUNT != undefined) {
              this.doughnutChartData.labels?.push(response.ResultSet[i]?.ASSETMODELNAME);
              countData.push(response.ResultSet[i]?.COUNT);
            }
          }
        }
        this.doughnutChartData = {
          datasets: [
            { data: countData },
          ]
        };
        this.chart?.update();
      }
      else {
        this.nodata = 'No Data Available';
      }
      if (response.error) {
        return;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }

}
