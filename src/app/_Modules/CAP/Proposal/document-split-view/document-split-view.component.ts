import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { DomSanitizer } from '@angular/platform-browser';
import { NfsImageViewerComponent } from '@NFS_Core/NFSControls/nfs-image-viewer/nfs-image-viewer.component';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { ProposalDTSService } from '@NFS_Core/NFSServices/ProposalDTS/proposal-dts.service';
import { PDFViewerService } from '@NFS_Core/NFSServices/Viewer/PDFViewerService.service';
import { StateManagment } from '@NFS_Core/RowStateManagement/FormStateManagement';
import { IDTSDocumentUploadParam } from '@NFS_Entity/ProposalDTS-Entity/DTSDocumentUploadParam.model';
import * as ProposalDTSEntity from '@NFS_Entity/ProposalDTS-Entity/IProposalDTSEntity.model.index';
import { IPRPL_DTS_DOCT_GRUPInfo } from '@NFS_Entity/ProposalDTS-Entity/IPRPL_DTS_DOCT_GRUPInfo.model';
import { MessageType } from '@NFS_Enums/MessageType.enum';
import { IContextMenu } from '@NFS_Interfaces/OtherInterfaces/IContextMenu.interface';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalDTSDataService } from '@NFS_Modules/CAP/CAPServices/ProposalDTS/proposal-dts-data.service';
import { ProposalDTSMapperService } from '@NFS_Modules/CAP/CAPServices/ProposalDTS/proposal-dts-mapper.service';
import { ProposalDTSEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalDTS/ProposalDTSEntityForm.service';
import { FormArray, FormBuilder, FormGroup } from 'src/Library';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DocumentViewPopupComponent } from './document-view-popup/document-view-popup.component';

@Component({
    selector: 'app-document-split-view',
    templateUrl: './document-split-view.component.html',
    styleUrls: ['./document-split-view.component.css'],
    standalone: false
})
export class DocumentSplitViewComponent implements OnInit, OnDestroy {

  private subscription$ = new Subject();
  dataSourcelength = 10;
  selectedPageSize: number = 25;
  pageSizeOptions: number[] = [25, 50, 75, 100];

  isPrevDisabled = false;
  isNextDisabled = false;
  selectedIndex: number = 0;
  totalIndex: number = 0;
  selectedSEQID: number = 0;
  isRotate: any = 'deg0';
  files: any;
  title = 'angular-img-hover';
  public docdataSet: FormArray<IPRPL_DTS_DOCT_GRUPInfo> = this._formBuilder.array<IPRPL_DTS_DOCT_GRUPInfo>([]);

  public columns = ['FILENME'];
  public pipes = [null];
  public Labels = ['File Name'];
  public ContextMenu: Array<IContextMenu> = [];

  public columnsPOS = ['DOCUMENTNAME'];

  a = document.createElement('a');
  imageSource: any | undefined = '';
  //MPOSAPLTDOCT!: FormArray<IMPOS_APLT_DCMTInfo>;
  object = { DGroup: 'Default Documents' } as testing
  group = this._formBuilder.group(this.object);
  public doctDataset: FormArray<testing> = this._formBuilder.array<testing>([this.group]);
  public ProposalDTSmPosDocuments: FormArray<ImPosDocument> = this._formBuilder.array<ImPosDocument>([]);
  public ProposalDTSDocuments: FormArray<IDocCategory> = this._formBuilder.array<IDocCategory>([]);

  @ViewChild('imgViewer') imageViewer!: NfsImageViewerComponent;

  params = {} as IProposalInfoParm;
  ProposalDTSEntity!: FormGroup<ProposalDTSEntity.IProposalDTSEntity>;
  scale: number = 1;

  constructor(private _msgService: MessageService, private _PDFViewerService: PDFViewerService, public sanitizer: DomSanitizer, private _ProposalDTSForm: ProposalDTSEntityFormService, private _prplDTSdata: ProposalDTSDataService, private _prplDTSMapper: ProposalDTSMapperService, private _FormState: StateManagment, private _proposalDTSService: ProposalDTSService, private dialog: MatDialog, private _proposalDataService: ProposalDataService, public _proposalService: ProposalService, private _formBuilder: FormBuilder) {

  }

  panelOpenState = false;
  viewDocument = true;


  ngOnInit(): void {
    //if (this._prplDTSdata.ProposalDTSEntity === undefined || this._proposalDataService.PROPOSAL.value.PROPOSALID !== this._prplDTSdata.ProposalDTSEntity.value.PROPOSALDTSHEADER.PROPOSALID) {
    this._prplDTSdata.ProposalDTSEntity = this._ProposalDTSForm.ProposalDTSEntity();
    this.ProposalDTSEntity = this._prplDTSdata.ProposalDTSEntity;
    this.ReadmPOSDocuments();
    this.ReadProposalDTS();
    // }
    // else {
    //   this.ReadmPOSDocuments();
    //   this.createProposalDocArray(this._prplDTSdata.ProposalDTSEntity.value);
    // }
  }

  ReadmPOSDocuments(from: number = 0, to: number = 10): void {
    this.params.ProposalId = this._proposalDataService.PROPOSAL.value.PROPOSALID;
    this.params.fromRecord = from;
    this.params.toRecord = to;
    let eSignatureElement: any;

    this._proposalService.ReadMPOSDocumentsByProposalId(this.params).pipe(takeUntil(this.subscription$)).subscribe((res: any) => {
      if (res && res.ResultSet) {
        this._proposalService.ReadDTSDocumentGroupByGroupCdeForMpos().pipe(takeUntil(this.subscription$)).subscribe(res1 => {
          if (res1 && res1.ResultSet) {
            var codes = res.ResultSet.map((p: any) => p.DOCUMENTCDE);
            res1.ResultSet.filter((DTSGroup: any) => {
              if (codes.includes(DTSGroup.DOCUMENTCDE)) {
                if (!this.docdataSet.value.includes(DTSGroup.DOCUMENTCDE)) {

                  let documentsArray = this._prplDTSdata.MPOSDOCUMENTS.controls.filter(p => p.value.DOCUMENTCDE == DTSGroup.DOCUMENTCDE);

                  this.docdataSet.push(this._formBuilder.group<IPRPL_DTS_DOCT_GRUPInfo>(DTSGroup));

                  let mPosDoc = this._formBuilder.group<ImPosDocument>({
                    mPosDocumentType: DTSGroup.DOCUMENTDSC,
                    mPosDocuments: this._formBuilder.array<ProposalDTSEntity.IMPOS_APLT_DCMTInfo>(documentsArray)
                  })
                  if (mPosDoc.value.mPosDocumentType == "e-Signatures") {
                    eSignatureElement = mPosDoc;
                  }
                  else {
                    this.ProposalDTSmPosDocuments.push(mPosDoc)
                  }
                }
              }
            });
            if (eSignatureElement) {
              this.ProposalDTSmPosDocuments.push(eSignatureElement)
            }
          }
        })
      }
    })
  }

  ReadProposalDTS(): void {

    this.params.ProposalId = this._proposalDataService.PROPOSAL.value.PROPOSALID;
    this.params.fromRecord = 0;
    this.params.toRecord = 100;


    this._proposalDTSService.ReadProposalDTSEntity(this.params).pipe(takeUntil(this.subscription$)).subscribe(res => {
      if (res && res.ResultSet) {
        let data: ProposalDTSEntity.IProposalDTSEntity = res.ResultSet as ProposalDTSEntity.IProposalDTSEntity;
        this._prplDTSMapper.ProposalDTSEntityMapper(this.ProposalDTSEntity, data);

        this.createProposalDocArray(res.ResultSet);

      }
    })
  }
  rotateImage(val: any) {

    if (val == 'reverse') {

      switch (this.isRotate) {
        case 'deg0':
          this.isRotate = 'deg90';
          break;
        case 'deg90':
          this.isRotate = 'deg180';
          break;
        case 'deg180':
          this.isRotate = 'deg-90';
          break;
        case 'deg-90':
          this.isRotate = 'deg0';
          break;
        default:
          this.isRotate = 'deg0';
      }
    }
    else if (val == 'forward') {
      switch (this.isRotate) {
        case 'deg0':
          this.isRotate = 'deg-90';
          break;
        case 'deg-90':
          this.isRotate = 'deg180';
          break;
        case 'deg180':
          this.isRotate = 'deg90';
          break;
        case 'deg90':
          this.isRotate = 'deg0';
          break;
        default:
          this.isRotate = 'deg0';
      }
    }

  }
  createProposalDocArray(res: any) {
    res.PROPOSALDOCUMENTS.map((selectedDOC: ProposalDTSEntity.IPRPL_DOCTInfo) => {
      if (selectedDOC.FILETYP == 'pdf') {
        selectedDOC.fileTypeIndex = 1;
      }
      else {
        selectedDOC.fileTypeIndex = 0;
      }
    })
    let resultSet = res.PROPOSALDTSDOCUMENTS;
    this.ProposalDTSDocuments.clear();
    const applicantTypes = [...new Set(resultSet.map((item: ProposalDTSEntity.IPRPL_DTS_DOCTInfo) => item.GROUPNAME))].sort();
    applicantTypes.forEach(type => {
      let applicants = [...new Set(resultSet.
        filter((aplt: ProposalDTSEntity.IPRPL_DTS_DOCTInfo) => aplt.GROUPNAME === type).
        map((item: ProposalDTSEntity.IPRPL_DTS_DOCTInfo) => item.APPLICANTID))];

      let apltFormArray = this._formBuilder.array<IDocApplicant>([]);
      applicants.forEach(aplt => {
        let documents = resultSet.filter((selectedAplt: ProposalDTSEntity.IPRPL_DTS_DOCTInfo) => selectedAplt.APPLICANTID === aplt && selectedAplt.CHECKEDBYCAA === true);
        let docFormArray = this._formBuilder.array<any>([]);



        documents.forEach((docType: ProposalDTSEntity.IPRPL_DTS_DOCTInfo) => {
          let docInfo = res.PROPOSALDOCUMENTS.filter((selectedDOC: ProposalDTSEntity.IPRPL_DOCTInfo) => selectedDOC.DOCUMENTID === docType.DOCUMENTID);
          docInfo.sort((a: ProposalDTSEntity.IPRPL_DOCTInfo, b: ProposalDTSEntity.IPRPL_DOCTInfo) => 0 - (a.fileTypeIndex > b.fileTypeIndex ? -1 : 1)); //sort ascending
          let documentType = this._formBuilder.group<IDocument>({
            DocumentType: docType.DOCUMENTDSC,
            DocumentInfo: this._formBuilder.array<ProposalDTSEntity.IPRPL_DOCTInfo>(docInfo)
          })
          docFormArray.push(documentType);

        });


        if (documents.length > 0) {
          let apltFormGroup = this._formBuilder.group<IDocApplicant>({
            ApplicantName: documents[0].APPLICANTNME,
            Documents: docFormArray
          });

          apltFormArray.push(apltFormGroup);
        }
      })

      if (apltFormArray.length > 0) {
        let categoryFormGroup = this._formBuilder.group<IDocCategory>({
          ApplicantType: String(type),
          Applicants: apltFormArray
        });

        this.ProposalDTSDocuments.push(categoryFormGroup);
      }

    });
  }

  public PageSelectionChanged(event: PageEvent) {
  }

  DocumentView(selectedDoc: any) {
    this.viewDocument = true;
    if (this.viewDocument) {
      var fileType = '';
      var fileName = '';
      let param = {} as IDTSDocumentUploadParam;
      if (selectedDoc.ismPOS) {
        param.FILEPATH = selectedDoc.DOCUMENTPATH + '\\' + selectedDoc.DOCUMENTNAME;
        fileType = selectedDoc.DOCUMENTTYPE;
        fileName = selectedDoc.DOCUMENTNAME;
        this.selectedSEQID = selectedDoc.DOCUMENTSEQID;
        // this.files=this._prplDTSdata.MPOSDOCUMENTS.value;
        this.files = [];
        this.ProposalDTSmPosDocuments.controls.filter(p => {
          p.controls.mPosDocuments.value.filter(m => {
            this.files.push(m);
          })
        })
        this.selectedIndex = this.files.findIndex((p: any) => p.DOCUMENTSEQID === selectedDoc.DOCUMENTSEQID);
        this.totalIndex = this.files.length;
      }
      else {
        param.FILEPATH = selectedDoc.FILENMEEXT + '\\' + selectedDoc.FILENME;
        fileType = selectedDoc.FILETYP;
        fileName = selectedDoc.FILENME;
        this.selectedSEQID = selectedDoc.SEQID;
        // this.files=this.ProposalDTSEntity.controls.PROPOSALDOCUMENTS.value;
        this.files = [];
        this.ProposalDTSDocuments.controls.filter(p => {
          p.controls.Applicants.controls.filter(m => {
            m.controls.Documents.controls.filter(n => {
              n.controls.DocumentInfo.value.filter(o => {
                this.files.push(o);
              })
            })
          })
        })
        this.selectedIndex = this.files.findIndex((p: any) => p.SEQID === selectedDoc.SEQID);
        this.totalIndex = this.files.length;
      }

      if (this.selectedIndex + 1 == this.totalIndex) {
        this.isNextDisabled = true;
      }
      else {
        this.isNextDisabled = false;
      }
      if (this.selectedIndex == 0) {
        this.isPrevDisabled = true;
      }
      else {
        this.isPrevDisabled = false;
      }


      this._proposalDTSService.ReadDocument(param).pipe(takeUntil(this.subscription$)).subscribe(res => {
        if (res && res.ResultSet) {
          var filetyp = '';
          if (fileType == 'pdf') {
            this._PDFViewerService.GeneratePDFDocument(res.ResultSet);
            filetyp = 'application/pdf';
          } else {
            var data: any = "data:image\/" + fileType + ";base64," + res.ResultSet;
            this.imageSource = this.sanitizer.bypassSecurityTrustResourceUrl(data);
            this.viewDocument = !this.viewDocument;
            filetyp = 'image/' + fileType;
          }
          //for download
          const byteArray = new Uint8Array(atob(res.ResultSet).split('').map(char => char.charCodeAt(0)));
          var file = new Blob([byteArray], { type: filetyp });
          this.a.href = URL.createObjectURL(file);
          this.a.download = fileName;
        }
        else {
          this._msgService.showMesssage("msgNoDocumentFund", MessageType.Error);
        }
      })
    }
    // else{
    //   this.viewDocument = !this.viewDocument;
    // }
  }
  back() {
    this.scale = 1;
    this.viewDocument = !this.viewDocument;
  }
  zoomOutImg(value: any) {

    if (value > 1) {
      this.imageViewer.cropper.zoom(this.scale - .1);
    }
  }
  zoomInImg(value: any) {
    if (value < 5) {
      this.imageViewer.cropper.zoom(this.scale + .1);
    }
  }
  nextDoc() {

    if (this.selectedIndex + 1 < this.totalIndex) {
      this.scale = 1;
      this.selectedIndex++;
      this.DocumentView(this.files[this.selectedIndex]);
    }


  }

  prevDoc() {

    if (this.selectedIndex > 0) {
      this.scale = 1;
      this.selectedIndex--;
      this.DocumentView(this.files[this.selectedIndex]);
    }

  }

  downloadImage() {
    this.a.click();
  }
  openFullImage() {
    const dialogRef = this.dialog.open(DocumentViewPopupComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      // data: { "imageSource": this.imageSource },
      data: { "imageSource": this.imageSource, "totalIndex": this.totalIndex, "totalDocs": this.files, "selectedSEQID": this.selectedSEQID },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }
  mouseZoom() {
    // $(".img_producto_container")
    // // tile mouse actions
    // .on("mouseover", function () {
    //   $(this)
    //     .children(".img_producto")
    //     .css({ transform: "scale(" + $(this).attr("data-scale") + ")" });
    // })
    // .on("mouseout", function () {
    //   $(this).children(".img_producto").css({ transform: "scale(1)" });
    // })
    // .on("mousemove", function (e) {
    //   $(this)
    //     .children(".img_producto")
    //     .css({
    //       "transform-origin":
    //         ((e.pageX - $(this).offset().left) / $(this).width()) * 100 +
    //         "% " +
    //         ((e.pageY - $(this).offset().top) / $(this).height()) * 100 +
    //         "%"
    //     });
    // });
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }
}

export class testing {
  DGroup: string = '';
}
export interface IDocument {
  DocumentType: string;
  DocumentInfo: Array<ProposalDTSEntity.IPRPL_DOCTInfo>;
}
export interface IDocApplicant {
  ApplicantName: string;
  Documents: Array<IDocument>;
}
export interface IDocCategory {
  ApplicantType: string;
  Applicants: Array<IDocApplicant>;
}
export interface ImPosDocument {
  mPosDocumentType: string;
  mPosDocuments: Array<ProposalDTSEntity.IMPOS_APLT_DCMTInfo>;
}
