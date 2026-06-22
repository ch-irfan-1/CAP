import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { ProposalDTSService } from '@NFS_Core/NFSServices/ProposalDTS/proposal-dts.service';
import { PDFViewerService } from '@NFS_Core/NFSServices/Viewer/PDFViewerService.service';
import { IDTSDocumentUploadParam } from '@NFS_Entity/ProposalDTS-Entity/DTSDocumentUploadParam.model';
import * as ProposalDTSEntity from '@NFS_Entity/ProposalDTS-Entity/IProposalDTSEntity.model.index';
import { MessageType } from '@NFS_Enums/MessageType.enum';
import { ProposalDTSDataService } from '@NFS_Modules/CAP/CAPServices/ProposalDTS/proposal-dts-data.service';
import { DocumentViewPopupComponent } from '@NFS_Modules/CAP/Proposal/document-split-view/document-view-popup/document-view-popup.component';
import { FormArray, FormBuilder } from 'src/Library';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
@Component({
    selector: 'app-view-document',
    templateUrl: './view-document.component.html',
    styleUrls: ['./view-document.component.css'],
    standalone: false
})
export class ViewDocument implements OnInit, OnDestroy {

  documentsData: FormArray<ProposalDTSEntity.IMPOS_APLT_DCMTInfo> = this._formBuilder1.array<ProposalDTSEntity.IMPOS_APLT_DCMTInfo>([]);
  panelOpenState = false;
  imageSource: any;
  private subscription$ = new Subject();
  statusCde: string = '';
  proposalInfoParam = {} as IProposalInfoParm;

  documentsArray: FormArray<ProposalDTSEntity.IMPOS_APLT_DCMTInfo> = this._formBuilder1.array<ProposalDTSEntity.IMPOS_APLT_DCMTInfo>([]);

  public columns = ['DOCUMENTTYPE', 'TIMESTAMP', 'DOCUMENTNAME'];
  public pipes = [null, 'formatDate', null];
  public Labels = ['File Type', 'Submitted Date', 'File Name'];
  public fileDoctDataset: FormArray<any> = this._formBuilder1.array<any>([]);
  constructor(private _formBuilder1: FormBuilder,
    public _proposalDTSDataService: ProposalDTSDataService,
    public _proposalDTSService: ProposalDTSService,
    public sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private _msgService: MessageService,
    private _PDFViewerService: PDFViewerService,
    @Inject(MAT_DIALOG_DATA) public Param: any,
  ) {
    this.statusCde = Param.statuscde;
  }

  ngOnInit(): void {

    console.log(this._proposalDTSDataService);
    this.documentsData = this.Param.documentsData;
    var m = this._proposalDTSDataService.MPOSDOCUMENTS.controls.filter(p => p.value.DOCUMENTCDE == this.Param.documentcde);
    m.forEach(element => {
      this.documentsArray.push(element);
    });

  }
  viewSelectedDocument(obj: any) {
    var selectedDoc = obj;
    let param = {} as IDTSDocumentUploadParam;
    param.FILEPATH = selectedDoc.DOCUMENTPATH + '\\' + selectedDoc.DOCUMENTNAME;

    this._proposalDTSService.ReadDocument(param).pipe(takeUntil(this.subscription$)).subscribe(res => {
      if (res != null && res != undefined && res.ResultSet) {
        if (selectedDoc.DOCUMENTTYPE == 'pdf') {
          this._PDFViewerService.GeneratePDFDocument(res.ResultSet);
        }
        else {
          var data: any = "data:image\/" + selectedDoc.FILETYPE + ";base64," + res.ResultSet;
          this.imageSource = this.sanitizer.bypassSecurityTrustResourceUrl(data);
          this.proposalInfoParam.ContactAddress = selectedDoc.CNTCT_ADDRESS;
          this.proposalInfoParam.ImgLat = selectedDoc.LATITUDE;
          this.proposalInfoParam.ImgLng = selectedDoc.LONGITUDE;
          this.proposalInfoParam.ProposalId = selectedDoc.PROPOSALID;
          this._proposalDTSService.CheckGeoCodeHistory(this.proposalInfoParam).subscribe((history:any) =>{
            const contactAddressLatLng = selectedDoc.DOCUMENTCDE === '00019' ?  history?.ResultSet?.ADDRESSLATITUDE + ',   ' +history?.ResultSet?.ADDRESSLONGITUDE : null;
            const dialogRef = this.dialog.open(DocumentViewPopupComponent, {
              width: '850px',
              height: '100%',
              position: { right: '1px', top: '1px' },
              panelClass: 'cdk-overlay-pane-custom',
              disableClose: true,
              data: { "imageSource": this.imageSource, "totalIndex": this.documentsData.length,
                "totalDocs": this.documentsData, "selectedSEQID": selectedDoc.DOCUMENTSEQID, statuscde: this.statusCde,  contactAddressLatLng: contactAddressLatLng, documentCde: selectedDoc.DOCUMENTCDE},
            });

            dialogRef.afterClosed().subscribe((result: any) => {
              if (result != undefined) {
              }
            });
          })
        }
      }
      else {
        this._msgService.showMesssage("msgNoDocumentFund", MessageType.Error);
      }
    })
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }
}
