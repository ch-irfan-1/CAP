import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { FormGroup } from 'src/Library';
import * as QUOTENTITY from '@NFS_Entity/Quot-Entity/Quot.model.index';
import { QuotEntityFormService } from '@NFS_Modules/IOPS/IOPSServices/QuotEntityForm.service';
import { CaptureImageComponent } from '../capture-image/capture-image.component';
import { MatDialog } from '@angular/material/dialog';
import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';
import { Subject, Subscription } from 'rxjs';
import { IQUOT_DOCTInfo } from '@NFS_Entity/Quot-Entity/Quot.model.index';
import { QuotationService } from '@NFS_Core/NFSServices/Quotation/quotation.service';
import { DOC_ORIENTATION, NgxImageCompressService } from 'ngx-image-compress';
import { mPOSMasterDataRequest } from '@NFS_Core/NFSServices/MasterData/MasterdataHelper/mPOSMasterDataRequest';
import { MasterData } from '@NFS_Enums/MasterData.enum';
import { ViewDocumentComponent } from '../view-document/view-document.component';
import { ToastrService } from 'ngx-toastr';
import { IQuotationInfoParm } from '@NFS_Interfaces/RequestInterfaces/IQuotationInfoParm';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { DialogBoxService } from '@NFS_Core/NFSServices/DialogBox/dialog-box.service';
import { takeUntil } from 'rxjs/operators';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-documents-info',
    templateUrl: './documents-info.component.html',
    styleUrls: ['./documents-info.component.css'],
    standalone: false
})
export class DocumentsInfoComponent implements OnInit, OnDestroy {
  @Input() DocumentForm = this._QuotForm.QuotDocumentForm();
  @Input() Mode: string = FormMode.NEW;
  @Input() accept = 'image/*,application/pdf';
  @Input() QUOTEntity: FormGroup<QUOTENTITY.IQuotEntity> = this._QuotForm.QuotEntityForm();

  request!: mPOSMasterDataRequest;
  files: Array<FileUploadModel> = [];
  documentTypeDropdownData!: Array<INFSDropDownData>;
  selectedValue: any;
  leadNumber: string = '';
  private obj = {} as IQUOT_DOCTInfo;
  private QuotParam = {} as IQuotationInfoParm;
  imageError: string = '';

  cardImageBase64!: string;
  isImageSaved!: boolean;
  private ArrayOfBytes!: string;
  private imgResultAfterCompress!: string;
  private documentSize!: string;
  IsEditable: boolean = true;
  private subscription$ = new Subject();

  constructor(public _masterDataService: MasterDataService, public _QuotForm: QuotEntityFormService, private dialog: MatDialog, public _appConfigService: AppConfigService,
    public _QuotationService: QuotationService, private imageCompress: NgxImageCompressService,
    private toastr: ToastrService, private _dialog: DialogBoxService, private _AppConfig: AppConfigService) {
  }

  ngOnInit(): void {
    //this.initializeQuotForm();
    this.getDocumentTypeList();
    this.setMode();

    if (this.Mode != FormMode.NEW) { // Check added against SOCD-25556
      this._QuotationService.getQuotObs().pipe(
        takeUntil(this.subscription$)
      ).subscribe(doct => {
        if (doct) {
          this.files = [];
          this.MapDocumentsData(doct)
        }
      });
    }
  }

  getDocumentTypeList() {

    this.request = new mPOSMasterDataRequest();
    this.request.masterDataOperation = MasterData.DocumentListByCompanyId;

    if (!this._masterDataService.DocumentTypes) {
      this._masterDataService.GetMasterData(this.request).pipe(takeUntil(this.subscription$)).subscribe((response) => {
        this._masterDataService.DocumentTypes = response?.ResultSet?.DataCollection;
      });
    }
    this.DocumentForm.controls.DOCUMENTCDE.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(value => {
      if (this._masterDataService.DocumentTypes) {
        let x = this._masterDataService.DocumentTypes.filter(x => x.code === value.toString())[0];
        this.selectedValue = x;
      }
    });
  }

  /**
 * on file drop handler
 */
  onFileDropped($event: any) {
    // console.log("drop called", $event);
    //this.prepareFilesList($event); // code commented against SOCD-25591
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler($event: any) {
    // console.log("select called", $event);
    // Size Filter Bytes
    const max_size = this._AppConfig.FileUploadConfig.MaxSize; //52428823;
    const allowed_types = this._AppConfig.FileUploadConfig.AllowedType; //['image/png', 'image/jpeg', 'application/pdf'];
    let isSizeValid = true;
    let isTypeValid = true;

    if (!this.DocumentForm.controls.DOCUMENTCDE.value) {
      this.toastr.warning('Please Select Document Type before proceed');
      this.resetFileUploadBrowser()
      return;
    }

    for (const item of $event.target.files) {
      if (this.files.filter(x => x.state == 'ADDED').length > 0) {
        this.toastr.warning('Please upload already selceted document before proceeding.');
        this.removeFileFromArray(item);
        this.resetFileUploadBrowser()
        return;
      }
      if (item.size > max_size) {
        this.toastr.clear();
        this.toastr.warning('File Size cannot be greater than  ' + Number((max_size / 1048576).toFixed(2)) + ' MB');
        this.removeFileFromArray(item);
        this.resetFileUploadBrowser()
        return;
      }
      if (!(allowed_types.indexOf(item.type) > -1)) {
        this.toastr.clear();
        this.toastr.warning('Only PNG , JPEG and PDF files are allowed');
        this.removeFileFromArray(item);
        this.resetFileUploadBrowser()
        return;
      }

    }


    this.prepareFilesList($event.target.files);
    this.resetFileUploadBrowser()
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(row: any, index: number) {
    this.obj.QUOTDOCTUMENTID = 0;
    if (row.docid > 0) {
      this.obj.QUOTDOCTUMENTID = row.docid;
      this.obj.DOCUMENTPATH = row.path;
      this.obj.QUOTATIONID = this.QUOTEntity.controls.QUOT.controls.QUOTATIONID.value;
      var dialog = this._dialog.openDialog("Confirmation", "Are you sure you want to delete", false, "Yes", "No");
      dialog.afterClosed().subscribe(result => {
        if (result === "ok") {
          if (this.obj.QUOTDOCTUMENTID > 0) {
            this.obj.RowState = DataRowState.Removed
            this._QuotationService.DeleteDocument(this.obj).pipe(takeUntil(this.subscription$)).subscribe((response) => {
              // console.log('delete doc resp:', response);
              if (response.CODE == 1) {
                this.files.splice(index, 1);
                this.toastr.success('File Deleted Successfully!');
              }
              else {
                this.toastr.error('Oops! Something went wrong ,Please Try Again');
                //return false;
              }
            });
          }
        }
      });
    }
    else {
      this.files.splice(index, 1);
    }
  }

  prepareFilesList(files: Array<any>) {
    // console.log(files);

    for (const item of files) {
      let fileName = this.GenerateFileName(item.name.split('.').pop());
      item.progress = 0;
      //this.files.push(item);
      this.files.push({
        data: item, state: 'ADDED',
        inProgress: false, progress: 0, canRetry: false, canCancel: true, name: fileName, size: item.size, path: '', docid: 0, documenttypdsc: this.selectedValue.TextValue,
        fileType: item.type, documentcde: this.selectedValue.code
      });
    }
    this.DocumentForm.controls.DOCUMENTCDE.setValue('');
    // this.uploadFilesSimulator(0);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
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

  formatBytesNum(bytes: number, decimals: number) {
    if (bytes === 0) {
      return 0;
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
  }

  setMode() {
    if (this.Mode === FormMode.NEW) {
      this.DocumentForm.controls.DOCUMENTCDE.enable();
      this.DocumentForm.controls.DOCUMENTNAME.enable();
      this.IsEditable = true
    }
    else if (this.Mode === FormMode.VIEW) {
      this.DocumentForm.controls.DOCUMENTCDE.disable();
      this.DocumentForm.controls.DOCUMENTNAME.disable();
      this.IsEditable = false
    }
  }

  myClickHandler($event: any) {}

  SelectAndUpaload() {
    if (this.Mode == FormMode.VIEW) {
      return;
    }
    if (this.files.filter(x=>x.state == 'ADDED').length == 0) {
      this.toastr.warning('Please Select atleast one file before proceed');
      return;
    }
    this.uploadFiles();
  }

  private uploadFiles() {
    this.files.forEach(file => {
      if (file.state == 'ADDED') {
        this.fileChangeEvent(file);
      }
    });
  }

  fileChangeEvent(fileInput: any) {
    if (fileInput) {
      const max_height = this._AppConfig.FileUploadConfig.MaxHeight; //15200;
      const max_width = this._AppConfig.FileUploadConfig.MaxWidth; //25600;

      const reader = new FileReader();

      reader.onload = (e: any) => {
        
        const image = new Image();

        image.src = e.target.result;
        if (fileInput.data.type === 'application/pdf') {

          this.obj.QUOTATIONID = this.QUOTEntity.controls.QUOT.controls.QUOTATIONID.value;
          this.obj.DOCUMENTCDE = fileInput.documentcde;
          this.obj.DOCUMENTNAME = fileInput.name.replace(/(?:\.(?![^.]+$)|[^\w.])+/g, "-"); //fileInput.data.name.replace(/(?:\.(?![^.]+$)|[^\w.])+/g, "-");
          this.obj.Applicantnme = this.QUOTEntity.controls.QUOTAPPLICANT.controls[0].controls.QUOTAPLT.controls.CUSTOMERNME.value;
          this.obj.IMAGETYPE = fileInput.data.type;
          this.obj.ARRAYOFBYTES = e.target.result.replace('data:' + this.obj.IMAGETYPE + ';base64,', "");
          this.obj.Leadnbr = this.QUOTEntity.controls.QUOT.controls.QUOTATIONNBR.value;
          this.obj.Role = '00003';
          this.obj.DOCUMENTTYPDSC = fileInput.documenttypdsc;
          this.obj.FILESIZE = fileInput?.size;

          this.addDataToCollection(this.obj);
          this.removeFileFromArray(fileInput);

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

              if (this.documentTypeDropdownData) {
                this.selectedValue = this.documentTypeDropdownData;
              }

              this.obj.QUOTATIONID = this.QUOTEntity.controls.QUOT.controls.QUOTATIONID.value;
              this.obj.DOCUMENTCDE = fileInput.documentcde;
              this.obj.DOCUMENTNAME = fileInput.name.replace(/(?:\.(?![^.]+$)|[^\w.])+/g, "-"); //fileInput.data.name.replace(/(?:\.(?![^.]+$)|[^\w.])+/g, "-");
              this.obj.Applicantnme = this.QUOTEntity.controls.QUOTAPPLICANT.controls[0].controls.QUOTAPLT.controls.CUSTOMERNME.value;
              this.obj.IMAGETYPE = fileInput.data.type;
              this.obj.ARRAYOFBYTES = e.target.result.replace('data:' + this.obj.IMAGETYPE + ';base64,', "");
              this.obj.Leadnbr = this.QUOTEntity.controls.QUOT.controls.QUOTATIONNBR.value;
              this.obj.Role = '00003';
              this.obj.DOCUMENTTYPDSC = fileInput.documenttypdsc;
              this.obj.FILESIZE = fileInput?.size

              if (fileInput.data.size > this._AppConfig.FileUploadConfig.MinSizeForComress) { /// 307200
                // await this.compressFile(this.cardImageBase64, fileInput, this.obj).then();
                //this.obj.ARRAYOFBYTES = this.obj.ARRAYOFBYTES.replace('data:image\/' + this.obj.IMAGETYPE + ';base64,', "")
                if (this.addDataToCollection(this.obj)) {
                  this.removeFileFromArray(fileInput);
                }
              } else {                
                if (this.addDataToCollection(this.obj)) {
                  this.removeFileFromArray(fileInput);
                }
              }
              return true;
            }
          }; return true;
        }
      };

      reader.readAsDataURL(fileInput.data);
      return true;
    }
    else return true;
  }

  compressFile(image: any, orientation: DOC_ORIENTATION, obj: IQUOT_DOCTInfo, dontChangeQuality?: boolean): Promise<any> {
    var imageQuality = this._AppConfig.FileUploadConfig.ImageQuality; // 30
    var imageRatio = this._AppConfig.FileUploadConfig.ImageRatio; // 70
    return this.imageCompress.compressFile(image, orientation, imageRatio, imageQuality).then(
      result => {
        this.imgResultAfterCompress = result;
        this.ArrayOfBytes = this.imgResultAfterCompress;
        this.documentSize = Math.round(this.imageCompress.byteCount(result) / 1024) + ' KB';
        this.obj.ARRAYOFBYTES = this.ArrayOfBytes.replace('data:' + this.obj.IMAGETYPE + ';base64,', "");
      });
  }

  private removeFileFromArray(file: FileUploadModel) {
    const index = this.files.indexOf(file);
    if (index > -1) {
      this.files.splice(index, 1);
    }
  }

  addDataToCollection(obj: IQUOT_DOCTInfo): boolean {
    obj.RowState = DataRowState.Added;
    this._QuotationService.UploadDocument(obj).pipe(takeUntil(this.subscription$)).subscribe((response) => {
      if (response.CODE == 1) {
        this.readAllDocuments();
        this.DocumentForm.controls.DOCUMENTCDE.setValue('');
        this.toastr.success("Uploaded Successfully")
        return true;
      }
      else {
        this.toastr.error(obj.DOCUMENTNAME + " upload failed.")
        return false;
      }
    });
    return false;
  }

  OpenCamera() {
    if (this.Mode == FormMode.VIEW) {
      return;
    }
    // SOCD-25665
    if (this.files.filter(x => x.state == 'ADDED').length > 0) {
      this.toastr.warning('Please upload already selceted document before proceeding.');
      return;
    }
    // SOCD-25597
    if (!this.DocumentForm.controls.DOCUMENTCDE.value) {
      this.toastr.warning('Please Select Document Type before proceed');
      return;
    }

    var comboValue: Array<string> = [];
    comboValue[0] = this.selectedValue.code;
    comboValue[1] = this.selectedValue.TextValue;
    comboValue[2] = 'true';
    comboValue[3] = '';

    const dialogRef = this.dialog.open(CaptureImageComponent, {
      data: { data1: comboValue, quotEnt: this.QUOTEntity.value }
    });

    dialogRef.afterClosed().subscribe(response => {
      this.readAllDocuments();
      this.DocumentForm.controls.DOCUMENTCDE.setValue('');
    })
  }

  viewDocument(row: any) {
    try {
      // console.log('selected ROW:', row);
      this.obj.DOCUMENTPATH = row.path;
      this.obj.DOCUMENTNAME = row.name;
      this.obj.IMAGETYPE = row.fileType
      if (row.state === 'VIEW') {
        this._QuotationService.ViewDocument(this.obj).pipe(takeUntil(this.subscription$)).subscribe((response) => {
          // console.log('view doc resp:', response);
          if (response.CODE == 1) {
            if (response.ResultSet.IMAGETYPE === 'pdf' || response.ResultSet.IMAGETYPE === 'application/pdf') {
              let newPdfWindow = window.open("", "Print");
              let content = encodeURIComponent(response.ResultSet.ARRAYOFBYTES);
              let iframeStart = "<\iframe width='100%' height='100%' src='data:application/pdf;base64, ";
              let iframeEnd = "'><\/iframe>";
              if (newPdfWindow != null)
                newPdfWindow.document.write(iframeStart + response.ResultSet.ARRAYOFBYTES + iframeEnd);
            } else {
              const dialogRef = this.dialog.open(ViewDocumentComponent, {
                data: response.ResultSet,
              });
            }
          }
          else {
            this.toastr.error('Error/Not found');
            //return false;
          }
        });
      }
      else {
        this.toastr.warning('Please Upload document before proceed');
      }

    }
    catch (e) {
      //Logger.error(e);
    }
  }

  readAllDocuments(): void {
    this.QuotParam.QuotationId = this.QUOTEntity.controls.QUOT.controls.QUOTATIONID.value;
    if (this.QuotParam.QuotationId > 0) {
      this._QuotationService.ReadDocumentList(this.QuotParam).pipe(takeUntil(this.subscription$)).subscribe((response) => {
        if (response) {
          this.files = [];
          this.MapDocumentsData(response.ResultSet)
        }
      });
    }
  }

  MapDocumentsData(data: any): void {
    for (var i = 0; i < data.length; i++) {
      this.files.push({
        data: undefined,
        state: 'VIEW',
        inProgress: false,
        progress: 0,
        canRetry: false,
        canCancel: true,
        name: data[i].DOCUMENTNAME,
        size: data[i].FILESIZE,
        path: data[i].DOCUMENTPATH,
        docid: data[i].QUOTDOCTUMENTID,
        documenttypdsc: data[i].DOCUMENTTYPDSC,
        fileType: data[i].IMAGETYPE,
        documentcde: data[i].DOCUMENTCDE,
      });
    }
  }

  downloadDocument(row: any) {
    try {
      this.obj.DOCUMENTPATH = row.path;
      this.obj.DOCUMENTNAME = row.name;
      this.obj.IMAGETYPE = row.fileType
      if (row.state === 'VIEW') {
        this._QuotationService.ViewDocument(this.obj).pipe(takeUntil(this.subscription$)).subscribe((response) => {
          if (response.CODE == 1) {
            var contentType = response.ResultSet.IMAGETYPE;
            var blob = this.b64toBlob(response.ResultSet.ARRAYOFBYTES, contentType);
            saveAs(blob, response.ResultSet.DOCUMENTNAME);
          }
          else {
            this.toastr.error('Error/Not found');
          }
        });
      }
      else {
        this.toastr.warning('Please Upload document before proceed');
      }

    }
    catch (e) {
      //Logger.error(e);
    }
  }

  b64toBlob = (b64Data: any, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  resetFileUploadBrowser (){
    var fileUpload = document.getElementById('fileDropRef') as HTMLInputElement;
    fileUpload.value = '';    
  }

  GenerateFileName(fileExtention: string) : string{
    return (this.selectedValue.TextValue.trim() + "-" 
            + String(Math.floor((Math.random() * 99) + 1)).padStart(2, '0') + "-" 
            + this.QUOTEntity.controls.QUOT.controls.QUOTATIONNBR.value.trim() + "."
            + fileExtention)
            .replace(/(?:\.(?![^.]+$)|[^\w.])+/g, "-");
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }
}

export class FileUploadModel {
  data: File | undefined;
  state: string | undefined;
  inProgress: boolean | undefined;
  progress: number | undefined;
  canRetry: boolean | undefined;
  canCancel: boolean | undefined;
  sub?: Subscription;
  name: string | undefined;
  size: any;
  path: string | undefined;
  docid: number | undefined;
  documenttypdsc: string | undefined;
  fileType: string | undefined;
  documentcde: string | undefined;
}

