import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorSelectConfig, PageEvent } from '@angular/material/paginator';
import { DomSanitizer } from '@angular/platform-browser';
import { QuotationService } from '@NFS_Core/NFSServices/Quotation/quotation.service';
import * as QUOTENTITY from '@NFS_Entity/Quot-Entity/Quot.model.index';
import { IQUOT_DOCTInfo } from '@NFS_Entity/Quot-Entity/Quot.model.index';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { IContextMenu } from '@NFS_Interfaces/OtherInterfaces/IContextMenu.interface';
import { DocumentViewPopupComponent } from '@NFS_Modules/CAP/Proposal/document-split-view/document-view-popup/document-view-popup.component';
import { QuotEntityFormService } from '@NFS_Modules/IOPS/IOPSServices/QuotEntityForm.service';
import { FormArray, FormBuilder } from 'src/Library';
import { FormGroup } from 'src/Library/lib/src/lib/form-group';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ViewDocumentComponent } from '../view-document/view-document.component';


@Component({
    selector: 'app-documents-view',
    templateUrl: './documents-view.component.html',
    styleUrls: ['./documents-view.component.css'],
    standalone: false
})
export class DocumentsViewComponent implements OnInit, OnChanges, OnDestroy {

  // DEMO CODE
  panelOpenState = false;
  showDocument = true;
  dataSourcelength = 10;
  selectedPageSize: number = 25;
  pageSizeOptions: number[] = [25, 50, 75, 100];

  public columns = ['DGroup'];
  public pipes = [null];
  public Labels = ['Document Group'];
  public ContextMenu: Array<IContextMenu> = [];

  //MPOSAPLTDOCT!: FormArray<IMPOS_APLT_DCMTInfo>;
  object = { DGroup: 'Default Documents' } as testing
  group = this._formBuilder.group(this.object);
  public doctDataset: FormArray<testing> = this._formBuilder.array<testing>([this.group]);

  DocumentView() {
    this.showDocument = !this.showDocument;
  }

  openFullImage() {
    const dialogRef = this.dialog.open(DocumentViewPopupComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 1235 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }
  // END DEMO CODE

  @Input() Mode: string = FormMode.NEW;
  @Input() QUOTEntity: FormGroup<QUOTENTITY.IQuotEntity> = this._QuotForm.QuotEntityForm();
  @Output() cancleButtonClick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
  files: Array<FileUploadModel> = [];
  imageSource: any | undefined = '';
  private obj = {} as IQUOT_DOCTInfo;
  scale: number = 1;
  isShown: boolean = false;
  selectedIndex: number = 0;
  // currentIndex: number = 1;
  totalIndex: number = 0;
  selectedDocument = 0;
  maxDocument: any;
  private subscription$ = new Subject();

  constructor(public _QuotForm: QuotEntityFormService, public _QuotationService: QuotationService,
    private toastr: ToastrService, public sanitizer: DomSanitizer, private dialog: MatDialog, private _formBuilder: FormBuilder) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.QUOTEntity.controls.QUOTDOCT != null) {
      this.totalIndex = this.QUOTEntity.controls.QUOTDOCT.value.length;
      this.selectedDocument = 0
      for (const item of this.QUOTEntity.controls.QUOTDOCT.value) {
        this.files.push({
          data: undefined,
          state: 'VIEW',
          inProgress: false,
          progress: 0,
          canRetry: false,
          canCancel: true,
          name: item.DOCUMENTNAME,
          size: item.FILESIZE,
          path: item.DOCUMENTPATH,
          docid: item.QUOTDOCTUMENTID,
          documenttypdsc: item.DOCUMENTTYPDSC,
          fileType: item.IMAGETYPE,
          docSeqNumber: this.selectedDocument
        });
        this.selectedDocument++;
      }
    }
  }

  paginatorSelectConfig:MatPaginatorSelectConfig = {
    panelClass: "paginator-select-overlay"
  }
  ngOnInit(): void {
  }
  zoomOutImg(value: any) {

    if (value > 0.7) {
      this.scale = this.scale - .1;
    }
  }
  viewZoomImage() {
    this.isShown = !this.isShown;
  }

  nextDoc() {
    if (this.selectedIndex + 1 < this.totalIndex) {
      this.scale = 1;
      this.selectedIndex++;
      this.viewDocument(this.files[this.selectedIndex]);
    }
  }

  prevDoc() {
    if (this.selectedIndex > 0) {
      this.scale = 1;
      this.selectedIndex--;
      this.viewDocument(this.files[this.selectedIndex]);
    }
  }

  viewDocument(row: any) {
    try {
      this.maxDocument = row;
      this.imageSource = ''
      this.selectedIndex = row.docSeqNumber;
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
              var data = response.ResultSet
              data.ARRAYOFBYTES = "data:image\/" + data.DOCUMENTCDE + ";base64," + data.ARRAYOFBYTES;
              this.imageSource = this.sanitizer.bypassSecurityTrustResourceUrl(data.ARRAYOFBYTES);
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

  viewMaxDocument() {
    try {
      let row: any = this.maxDocument;
      this.selectedIndex = row.docSeqNumber;
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

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }

  public PageSelectionChanged(event: PageEvent) {
  }

}
export class FileUploadModel {
  data: File | undefined;
  state: string | undefined;
  inProgress: boolean | undefined;
  progress: number | undefined;
  canRetry: boolean | undefined;
  canCancel: boolean | undefined;
  name: string | undefined;
  size: any;
  path: string | undefined;
  docid: number | undefined;
  documenttypdsc: string | undefined;
  fileType: string | undefined;
  docSeqNumber: number = 0;
}

export class testing {
  DGroup: string = '';
}