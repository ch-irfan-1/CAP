import { DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { ProposalDTSService } from '@NFS_Core/NFSServices/ProposalDTS/proposal-dts.service';
import { PDFViewerService } from '@NFS_Core/NFSServices/Viewer/PDFViewerService.service';
import { IDTSDocumentUploadParam } from '@NFS_Entity/ProposalDTS-Entity/DTSDocumentUploadParam.model';
import * as ProposalDTSEntity from '@NFS_Entity/ProposalDTS-Entity/IProposalDTSEntity.model.index';
import { IPRPL_DOCTInfo, IPRPL_DTS_DOCTInfo } from '@NFS_Entity/ProposalDTS-Entity/IProposalDTSEntity.model.index';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { MessageType } from '@NFS_Enums/MessageType.enum';
import { IActionList } from '@NFS_Interfaces/OtherInterfaces/IActionList.interface';
import { ProposalDTSDataService } from '@NFS_Modules/CAP/CAPServices/ProposalDTS/proposal-dts-data.service';
import { DocumentViewPopupComponent } from '@NFS_Modules/CAP/Proposal/document-split-view/document-view-popup/document-view-popup.component';
import { FormArray, FormBuilder, FormGroup } from 'src/Library';
import { DOC_ORIENTATION, NgxImageCompressService } from 'ngx-image-compress';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AddCommentComponent } from '../add-comment/add-comment.component';


@Component({
    selector: 'app-upload-document',
    templateUrl: './upload-document.component.html',
    styleUrls: ['./upload-document.component.css'],
    standalone: false
})
export class UploadDocumentComponent implements OnInit, OnDestroy {
  imageSource: any;
  private subscription$ = new Subject();
  files: any = [];

  public columns = ['FILETYP', 'DOCUMENTDTE', 'FILENME', 'FILESIZE', 'USERNME', 'FILECOMMENTS'];
  public pipes = [null, 'formatDate', null, null, null, null];
  public Labels = ['File Type', 'Submitted Date', 'File Name', 'File Size', 'User Name', 'Comments'];
  public EnableTooltip = [false, false, true, false, false, false];
  public ActionList: Array<IActionList> = [{ 'icon': 'remove_red_eye', 'label': 'View', 'action': 'view' }, { 'icon': 'edit', 'label': 'Add/Update Comment', 'action': 'update' }];
  imageError: string = '';
  cardImageBase64!: string;
  isImageSaved!: boolean;


  PropDTSDoc!: FormGroup<IPRPL_DTS_DOCTInfo>;
  ProposalDocEntity!: FormArray<ProposalDTSEntity.IPRPL_DOCTInfo>;

  dts_path: string = "";
  public fileColumns = ['FILENME', 'FILESIZEFORMATTED'];
  public filePipes = [null, null];
  public fileLabels = ['File Name', 'Size'];
  public doctDataset: FormArray<IPRPL_DOCTInfo> = this._formBuilder.array<IPRPL_DOCTInfo>([]);
  public fileDoctDataset: FormArray<any> = this._formBuilder1.array<any>([]);

  uploadDisabled: boolean = true;
  isCancelUpload: boolean = false;
  viewEnabled: boolean = false;

  constructor(public sanitizer: DomSanitizer, private storageService: ClientStoreService, private toastr: ToastrService, private _prplDTSdata: ProposalDTSDataService,
    public _proposalDTSService: ProposalDTSService, @Inject(MAT_DIALOG_DATA) public Param: any, private _formBuilder: FormBuilder,
    public _AppConfig: AppConfigService,
    private _PDFViewerService: PDFViewerService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private _msgService: MessageService,
    private imageCompress: NgxImageCompressService,
    private _formBuilder1: FormBuilder) {
  }

  panelOpenState = false;
  isVerficationCompleted = false;


  ngOnInit(): void {
    this._proposalDTSService.GetSubsidryAddressTypeLookup().subscribe(res => {
      this.dts_path = res + "\\" + this.datePipe.transform(new Date(), 'yyyy') + "\\" + this.datePipe.transform(new Date(), 'MMMM')
        + "\\" + this._prplDTSdata.PROPOSALDTSHEADER.controls.PROPOSALNBR.value + "\\" + this.PropDTSDoc.controls.GROUPNAME.value + '\\' + this._prplDTSdata.PROPOSALDTSHEADER.controls.APPLICANTNME.value + "\\" + this.datePipe.transform(new Date(), 'yyyymmdd');

    })
    let index = this._prplDTSdata.PROPOSALDTSDOCUMENTS.value.findIndex(d => d.DOCUMENTID === this.Param.documentID);
    this.PropDTSDoc = (this._prplDTSdata.PROPOSALDTSDOCUMENTS.controls[index]);
    this.ProposalDocEntity = this._formBuilder.array(this._prplDTSdata.PROPOSALDOCUMENTS.value.filter(d => d.DOCUMENTID === this.Param.documentID).map((r: any) => this._formBuilder.group(r)));
    // var proposalStatuses=["Approved","Converted","Declined","Cancelled","Withdrawn"];
    var proposalStatuses = ["Draft", "New", "mPOS Resurvey", "Change in process"];
    if (proposalStatuses.includes(this._prplDTSdata.PROPOSALDTSHEADER.value.PROPOSALSTATUS) && !this._prplDTSdata.PROPOSALDTS.value.COMPLETIONIND) {
      this.uploadDisabled = false;
      this.viewEnabled = true;
    }
  }


  GenerateFileName(fileExtention: string): string {
    return (this.Param.documentType.replace('', '-') + "-"
      + String(Math.floor((Math.random() * 99) + 1)).padStart(2, '0') + "-"
      + this.Param.proposalId + "."
      + fileExtention)
      .replace(/(?:\.(?![^.]+$)|[^\w.])+/g, "-");
  }

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      let fileName = item.name;
      let size = item.size;

      this.fileDoctDataset.push(this._formBuilder.group<any>({
        FILENME: fileName,
        FILESIZE: size,
        FILESIZEFORMATTED: this.formatBytes(size, 2),
        data: item
      }));
    }
  }

  fileBrowseHandler($event: any) {
    const max_size = 1024 * 1024;
    // const max_size=100000;
    const allowed_types = this._AppConfig.FileUploadConfig.AllowedType; //['image/png', 'image/jpeg', 'application/pdf'];
    let isSizeValid = true;
    let isTypeValid = true;

    for (const item of $event.target.files) {
      if (item.size > max_size) {
        this.toastr.clear();
        this.toastr.warning('File ' + item.name + ' size should be less than or equal to ' + Number((max_size / 1048576).toFixed(2)) + ' MB');
        return;
      }
      if (!(allowed_types.indexOf(item.type) > -1)) {
        this.toastr.clear();
        this.toastr.warning('Only PNG , JPEG and PDF files are allowed');
        return;
      }
    }

    //cancel+uplaod button enable

    this.isCancelUpload = true;
    this.prepareFilesList($event.target.files);
  }

  CancelFileUpload() {
    this.fileDoctDataset.clear();
    this.isCancelUpload = false;
  }

  UploadFiles() {
    if (this.fileDoctDataset.length === 0) {
      this.toastr.warning("Browse files to proceed further");
      return;
    }
    this._proposalDTSService.Is_Directory_Path_Exists().pipe(takeUntil(this.subscription$)).subscribe(res => {
      if (res.ResultSet == false) {
        this.toastr.error("Document Uploading Directory Does Not Exist.");
        return;
      }
      else {
        this.fileDoctDataset.controls.forEach(element => {
          this.FileChangeEvent(element);
        });

        this.ProposalDocEntity = this._formBuilder.array(this._prplDTSdata.PROPOSALDOCUMENTS.value.filter(d => d.DOCUMENTID === this.Param.documentID).map((r: any) => this._formBuilder.group(r)));
        let index = this._prplDTSdata.PROPOSALDTSDOCUMENTS.value.findIndex(d => d.DOCUMENTID === this.Param.documentID);
        this._prplDTSdata.PROPOSALDTSDOCUMENTS.controls[index].controls.CHECKEDBYCAA?.setValue(true);
        this._prplDTSdata.PROPOSALDTSDOCUMENTS.controls[index].controls.RowState?.setValue(DataRowState.Updated);
        this.isCancelUpload = false;
        this.CancelFileUpload();
      }
    });
  }

  FileChangeEvent(element: any) {
    let paramObj = {} as IDTSDocumentUploadParam;
    if (element) {
      const max_height = this._AppConfig.FileUploadConfig.MaxHeight; //15200;
      const max_width = this._AppConfig.FileUploadConfig.MaxWidth; //25600;

      const reader: FileReader = new FileReader();
      reader.readAsDataURL(element.get("data")?.value);
      reader.onload = (e: any) => {
        const image = new Image();

        image.src = e.target.result;
        let type = (element.get("FILENME")?.value).split('.').pop();
        if (type === 'pdf') {
          //DO HERE
          paramObj.FILEPATH = this.dts_path + '\\' + this.getNewName(element.get("FILENME")?.value);
          paramObj.ARRAYOFBYTESSTR = e.target.result.replace('data:' + (element.get("data")?.value).type + ';base64,', "");
          paramObj.FILENAMEEXTENTION = '.' + type;
          paramObj.MESSAGE = "";
          paramObj.FILENAME = this.getNewName(element.get("FILENME")?.value);
          paramObj.OFFSET = 0;
          paramObj.BOFFERSIZE = 0;

          this.addDataToCollection(paramObj, element.get("FILESIZE")?.value, element.get("FILENME")?.value);
          return true;
        }
        else {
          image.onload = async rs => {
            const img_height = 500;//rs.currentTarget["height"];
            const img_width = 500;//rs.currentTarget['width'];
            if (img_height > max_height && img_width > max_width) {
              this.imageError =
                'Maximum dimensions allowed ' +
                max_height +
                '*' +
                max_width +
                'px';
              return false;
            } else {
              const imgBase64Path = e.target.result;

              this.cardImageBase64 = imgBase64Path;
              this.isImageSaved = true;

              paramObj.FILEPATH = this.dts_path + '\\' + this.getNewName(element.get("FILENME")?.value);
              paramObj.ARRAYOFBYTESSTR = e.target.result.replace('data:' + (element.get("data")?.value).type + ';base64,', "");
              paramObj.FILENAMEEXTENTION = type;
              paramObj.MESSAGE = "";
              paramObj.FILENAME = this.getNewName(element.get("FILENME")?.value);
              paramObj.OFFSET = 0;
              paramObj.BOFFERSIZE = 0;

              if (element.FILESIZE > this._AppConfig.FileUploadConfig.MinSizeForComress) { /// 307200
                await this.compressFile(this.cardImageBase64, element, paramObj).then();
                if (this.addDataToCollection(paramObj, element.get("FILESIZE")?.value, element.get("FILENME")?.value)) {
                }
              }
              else {
                if (this.addDataToCollection(paramObj, element.get("FILESIZE")?.value, element.get("FILENME")?.value)) {
                }
              }
              return true;
            }
          }; return true;
        }
      }
    }
  }

  compressFile(image: any, orientation: DOC_ORIENTATION, obj: IDTSDocumentUploadParam, dontChangeQuality?: boolean): Promise<any> {
    var imageQuality = this._AppConfig.FileUploadConfig.ImageQuality; // 30
    var imageRatio = this._AppConfig.FileUploadConfig.ImageRatio; // 70
    return this.imageCompress.compressFile(image, orientation, imageRatio, imageQuality).then(
      result => {
        // this.imgResultAfterCompress = result;
        // this.ArrayOfBytes = this.imgResultAfterCompress;
        // this.documentSize = Math.round(this.imageCompress.byteCount(result) / 1024) + ' KB';
        // this.obj.ARRAYOFBYTES = this.ArrayOfBytes.replace('data:' + this.obj.IMAGETYPE + ';base64,', "");
      });
  }

  addDataToCollection(element: any, size: any, name: any) {

    this._proposalDTSService.UploadDocument(element).pipe(takeUntil(this.subscription$)).subscribe((response) => {
      if (response.CODE == 1) {

        //add to proposalDTS

        var seqId = 1;
        if (this._prplDTSdata.PROPOSALDOCUMENTS.value.sort((a, b) => b.SEQID - a.SEQID)[0]) {
          seqId = this._prplDTSdata.PROPOSALDOCUMENTS.value.sort((a, b) => b.SEQID - a.SEQID)[0].SEQID + 1;
        }
        this._prplDTSdata.PROPOSALDOCUMENTS.push(this._formBuilder.group<ProposalDTSEntity.IPRPL_DOCTInfo>({
          PROPOSALID: this.Param.proposalId,
          DOCUMENTID: this.Param.documentID,
          //SEQID: this.ProposalDocEntity.length + 1,
          SEQID: seqId,
          DOCUMENTNME: response.ResultSet.FileName,
          DOCUMENTDTE: new Date(Date.now()),
          REQUIREDFORCDE: '00001',
          FILETYP: response.ResultSet.FileName?.split('.').pop(),
          FILENMEEXT: this.dts_path,
          FILESIZE: this.formatBytes(size, 2),
          FILECOMMENTS: this.PropDTSDoc.controls.COMMENTS.value,
          FILENME: name,
          ISREFERENCED: false,
          ISCOMPRESSED: false,
          ISENCRYPTED: false,
          EXECUTIONDTE: response.DATE,
          EXECUTIONOFFSET: 0,
          SESSIONCDE: null,
          SESSIONID: null,
          APPLICANTID: this.Param.applicantId,
          USERNME: this.storageService.GetUserInfo()?.UserName,
          DOCUMENTCDE: this._prplDTSdata.PROPOSALDTSDOCUMENTS.get("DOCUMENTCDE"),
          BtnDeleteEnable: false,
          RowState: DataRowState.Added,
          ISAUDITABLE: false,
          ismPOS: false,
          fileTypeIndex: 0
        }));
        this.ProposalDocEntity = this._formBuilder.array(this._prplDTSdata.PROPOSALDOCUMENTS.value.filter(d => d.DOCUMENTID === this.Param.documentID).map((r: any) => this._formBuilder.group(r)));
        this.toastr.success("Uploaded Successfully")
        return true;
      }
      else {
        this.toastr.error(element.FILENAME + " upload failed.")
        return false;
      }
    });
    return false;
  }

  getNewName(name: string): string {

    if (this._prplDTSdata.PROPOSALDOCUMENTS.value.filter(x => x.FILENME === name && x.DOCUMENTID === this.Param.documentID).length === 1) {

      var nameArray = name.split('.');
      let ext = nameArray.pop();
      name = nameArray.join('.');
      let newName;
      const nameArr = name.split('_');
      if (nameArr.length > 1) {

        newName = nameArr[0] + "_" + (Number(nameArr[1]) + 1) + '.' + ext;
      }
      else {
        newName = nameArr[0] + "_" + 1 + '.' + ext;
      }
      newName = this.getNewName(newName);
      return newName;
    }
    else {
      return name;
    }
  }

  formatBytes(bytes: number, decimals: number) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  delSelectedDocument(selectedDoc: any) {
    let index = this._prplDTSdata.PROPOSALDOCUMENTS.value.findIndex(d => d.SEQID === selectedDoc.SEQID);
    if (this._prplDTSdata.PROPOSALDOCUMENTS.controls[index].controls.RowState.value === DataRowState.Added) {
      this._prplDTSdata.PROPOSALDOCUMENTS.removeAt(index);
    }
    else {
      this._prplDTSdata.PROPOSALDOCUMENTS.controls[index].controls.RowState?.setValue(DataRowState.Removed);
    }
    this.toastr.success("Documents deleted successfully");
  }

  viewUpdateSelectedDocument(obj: any) {

    if (obj.Action == 'view') {

      let index = this._prplDTSdata.PROPOSALDTSDOCUMENTS.value.findIndex(d => d.DOCUMENTID === this.Param.documentID);
      this.PropDTSDoc = (this._prplDTSdata.PROPOSALDTSDOCUMENTS.controls[index]);
      this.ProposalDocEntity = this._formBuilder.array(this._prplDTSdata.PROPOSALDOCUMENTS.value.filter(d => d.DOCUMENTID === this.Param.documentID).map((r: any) => this._formBuilder.group(r)));

      this.files = [];

      this._prplDTSdata.PROPOSALDTSDOCUMENTS.value.filter(docType => {
        this._prplDTSdata.PROPOSALDOCUMENTS.value.filter(d => {
          if (d.DOCUMENTID === docType.DOCUMENTID) {
            this.files.push(d);
          }
        })
      })



      var selectedDoc = obj.Data;
      let param = {} as IDTSDocumentUploadParam;

      param.FILEPATH = selectedDoc.FILENMEEXT + '\\' + selectedDoc.FILENME;

      this._proposalDTSService.ReadDocument(param).pipe(takeUntil(this.subscription$)).subscribe(res => {
        if (res != null && res != undefined && res.ResultSet) {
          if (selectedDoc.FILETYP == 'pdf') {
            this._PDFViewerService.GeneratePDFDocument(res.ResultSet);
          } else {
            var data: any = "data:image\/" + selectedDoc.FILETYPE + ";base64," + res.ResultSet;
            this.imageSource = this.sanitizer.bypassSecurityTrustResourceUrl(data);
            const dialogRef = this.dialog.open(DocumentViewPopupComponent, {
              width: '850px',
              height: '100%',
              position: { right: '1px', top: '1px' },
              panelClass: 'cdk-overlay-pane-custom',
              disableClose: true,
              data: { "imageSource": this.imageSource, "totalIndex": this.files.length, "totalDocs": this.files, "selectedSEQID": selectedDoc.SEQID },
            });

            dialogRef.afterClosed().subscribe(result => {
              if (result != undefined) {
              }
            });
          }
        }
        else {
          this._msgService.showMesssage("msgNoDocumentFund", MessageType.Error);
        }
      })

    }
    else if (obj.Action == 'update') {
      let index = this._prplDTSdata.PROPOSALDOCUMENTS.value.findIndex(d => d.SEQID === obj.Data.SEQID);
      const dialogRef = this.dialog.open(AddCommentComponent, {
        width: '900px',
        height: '45%',
        panelClass: 'cdk-overlay-pane-custom',
        position: { left: '20%' },
        data: { Comment: this._prplDTSdata.PROPOSALDOCUMENTS.controls[index].controls.FILECOMMENTS.value }

      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {

          this._prplDTSdata.PROPOSALDOCUMENTS.controls[index].controls.FILECOMMENTS?.setValue(result.comment);
          if (this._prplDTSdata.PROPOSALDOCUMENTS.controls[index].controls.RowState.value != DataRowState.Added) {
            this._prplDTSdata.PROPOSALDOCUMENTS.controls[index].controls.RowState?.setValue(DataRowState.Updated);
          }
          this.ProposalDocEntity = this._formBuilder.array(this._prplDTSdata.PROPOSALDOCUMENTS.value.filter(d => d.DOCUMENTID === this.Param.documentID).map((r: any) => this._formBuilder.group(r)));

        }
      });

    }

  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }
}


