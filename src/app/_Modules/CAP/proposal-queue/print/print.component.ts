import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { PDFViewerService } from '@NFS_Core/NFSServices/Viewer/PDFViewerService.service';
import { IStationeryInfo } from '@NFS_Interfaces/OtherInterfaces/IStationeryInfo';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { StationeryService } from '@NFS_Modules/CAP/CAPServices/stationery.service';
import { FormArray, FormBuilder } from 'src/Library';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-print',
    templateUrl: './print.component.html',
    styleUrls: ['./print.component.css'],
    standalone: false
})

export class PrintStationery implements OnInit, OnDestroy {
  proposalInfo: any;
  private subscription$ = new Subject();
  params = {} as IProposalInfoParm;
  public columns = ['STATIONARYDSC'];
  public Labels = ['Stationery Description'];
  StationeryList: FormArray<IStationeryInfo> = this._formBuilder.array<IStationeryInfo>([]);
  constructor(private _formBuilder: FormBuilder, private _PDFViewerService: PDFViewerService,
    public dialogRef: MatDialogRef<PrintStationery>,
    private _msgService: MessageService, @Inject(MAT_DIALOG_DATA) Param: any, private _stationeryService: StationeryService) {
    this.proposalInfo = Param.proposal;
  }


  ngOnInit(): void {
    this.params.FinancialProductID = this.proposalInfo.FINANCIALPRODUCTID;
    this._stationeryService.GetAssociatedStationeryWithFPId(this.params).pipe(takeUntil(this.subscription$)).subscribe(res => {
      let data = res.ResultSet;
      data.forEach((element: any) => {
        this.StationeryList.push(this._formBuilder.group(element));
      });
    })
  }
  printSelectedStationery(selectedStationery: any) {
    var stationeryParam = {} as IStationeryInfo;
    stationeryParam = selectedStationery;
    if (selectedStationery.STATIONARYTYPECDE == "ST022") {
      if (this.proposalInfo.REQUESTSTATUSDSC == "Converted") {
        this._stationeryService.ReadAlreadyConvertedContract(stationeryParam).pipe(takeUntil(this.subscription$)).subscribe(res => {
          if (res.ResultSet && res.ResultSet.length > 0 && res.ResultSet[0].CONTRACTACTIVATIONDTE.ToString()) {
            stationeryParam.ARTICLEID = res.ResultSet[0].CONTRACTID;
            stationeryParam.STATIONARYTEMPLATE = "3A52B";
            stationeryParam.STATIONARYTYPECDE = "3A52B";
            this._stationeryService.PrintStationery(stationeryParam).pipe(takeUntil(this.subscription$)).subscribe(res => {
              this._PDFViewerService.GeneratePDFDocument(res.ResultSet);
            })
          }
          else {
            this.generateStationery(stationeryParam);
          }
        })
      }
      else {
        this.generateStationery(stationeryParam);
      }
    }
    else {
      this.generateStationery(stationeryParam);
    }

  }

  generateStationery(stationeryParam: any) {
    stationeryParam.ARTICLEID = this.proposalInfo.PROPOSALID;
    this._stationeryService.PrintStationery(stationeryParam).pipe(takeUntil(this.subscription$)).subscribe(res => {
      this._PDFViewerService.GeneratePDFDocument(res.ResultSet);
    })
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }
}
