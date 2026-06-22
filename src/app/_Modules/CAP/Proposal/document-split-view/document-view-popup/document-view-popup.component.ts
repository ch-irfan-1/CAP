import { IPRPL_LCTN_HTRY } from '@NFS_Entity/ProposalDTS-Entity/IPRPL_LCTN_HTRY.model';
import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
//import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { NfsImageViewerComponent } from '@NFS_Core/NFSControls/nfs-image-viewer/nfs-image-viewer.component';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { ProposalDTSService } from '@NFS_Core/NFSServices/ProposalDTS/proposal-dts.service';
import { PDFViewerService } from '@NFS_Core/NFSServices/Viewer/PDFViewerService.service';
import { IDTSDocumentUploadParam } from '@NFS_Entity/ProposalDTS-Entity/DTSDocumentUploadParam.model';
import * as ProposalDTSEntity from '@NFS_Entity/ProposalDTS-Entity/IProposalDTSEntity.model.index';
import { MessageType } from '@NFS_Enums/MessageType.enum';
import { FormArray, FormBuilder } from 'src/Library';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { GeolocationMapComponent } from '../geolocation-map/geolocation-map.component';
import { MatDialog, MAT_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { ToastrService } from 'ngx-toastr';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FormGroup } from 'src/Library';


@Component({
    selector: 'app-document-view-popup',
    templateUrl: './document-view-popup.component.html',
    styleUrls: ['./document-view-popup.component.css'],
    standalone: false
})
export class DocumentViewPopupComponent implements OnInit, OnDestroy {

  imageSource: any = this.Param.imageSource;
  scale: number = 1;
  isRotate: any = 'deg0';
  selectedIndex: number = 0;
  totalIndex: number = 0;
  viewDocument = true;
  files: any = [];
  isPrevDisabled = false;
  isNextDisabled = false;
  ContactAddrLatLng: any;
  documentCode: string ='';
  statusCde: string = ''
  isContactAddrCoordsValid: boolean = false;
  param = {} as IProposalInfoParm;
  PRPL_LCTN_HTRY_req = {} as IPRPL_LCTN_HTRY;
  imageDocData: any;
  public historyInfoDocs = this._formBuilder.array<FormGroup>([]);


  public ProposalDTSmPosDocuments: FormArray<ImPosDocument> = this._formBuilder.array<ImPosDocument>([]);
  public ProposalDTSDocuments: FormArray<IDocCategory> = this._formBuilder.array<IDocCategory>([]);
  private subscription$ = new Subject();
  a = document.createElement('a');

  @ViewChild('imageViewer') imageViewer!: NfsImageViewerComponent;
Contact_Address: any;
Deocode_Address: any;
LatLng: any;
Timespan: any;
showgeoCode:boolean=false;

  constructor(@Inject(MAT_DIALOG_DATA) public Param: any, private matdialog: MatDialog, private _formBuilder: FormBuilder,private _storageService: ClientStoreService,
    private _msgService: MessageService, private _PDFViewerService: PDFViewerService, public sanitizer: DomSanitizer, private _proposalDTSService: ProposalDTSService, private toastr: ToastrService) {
      this.statusCde = Param.statuscde;

  }

  ngOnInit(): void {
    this.totalIndex = this.Param.totalIndex;
    this.files = this.Param.totalDocs;
    if (this.Param.contactAddressLatLng !== undefined && this.Param.contactAddressLatLng !== null && this.Param.documentCde === '00019') {
      this.ContactAddrLatLng = this.Param.contactAddressLatLng;
    }
    this._proposalDTSService.contactAddLatlng$.subscribe((data:any) =>{

      if(data){
        this.ContactAddrLatLng = data;
        this.isContactAddrCoordsValid = true;
      }
    })
    // this.ContactAddrLatLng = this.Param.contactlatitude + ',   ' + this.Param.contactlongitude;
    const contactAddLatLng = this.getLatLng(this.ContactAddrLatLng);
    if (contactAddLatLng === null) {
      this.isContactAddrCoordsValid = false;
    } else {
      this.isContactAddrCoordsValid = true;
    }

    //SHOW GEOCODE CONTROLS
    if (this.files?.value){
      let currentFile= this.files?.value?.find((a:any)=> a.DOCUMENTSEQID=== this.Param?.selectedSEQID);
      if (currentFile?.DOCUMENTTYPE=='png' || currentFile?.DOCUMENTTYPE=='jpg')
      {
      this.setGeocodeControls(currentFile);
  }
  else
  this.showgeoCode=false;
////
    }
    if (this.files.value) {
      if (this.files.value[0].ismPOS == true) {
        this.selectedIndex = this.files.value.findIndex((p: any) => p.DOCUMENTSEQID === this.Param.selectedSEQID);
      }
      else {
        this.selectedIndex = this.files.value.findIndex((p: any) => p.SEQID === this.Param.selectedSEQID);
      }
    }
    else {
      if (this.files[0].ismPOS == true) {
        this.selectedIndex = this.files.findIndex((p: any) => p.DOCUMENTSEQID === this.Param.selectedSEQID);
      }
      else {
        this.selectedIndex = this.files.findIndex((p: any) => p.SEQID === this.Param.selectedSEQID);
      }
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

  }
  zoomOutImg(value: any) {

    if (value > 1) {
      this.scale = this.scale - .1;
    }
  }
  zoomInImg(value: any) {
    if (value < 5) {
      this.scale = this.scale + .1;
    }
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

  DocumentView(selectedDoc: any) {
    this.viewDocument = true;
    if (this.viewDocument) {

      if (selectedDoc?.DOCUMENTTYPE=='png'|| selectedDoc?.DOCUMENTTYPE=='jpg'){
      this.showgeoCode= true;
     this.setGeocodeControls(selectedDoc);
      }else this.showgeoCode= false;
      var fileType = '';
      var fileName = '';
      let param = {} as IDTSDocumentUploadParam;
      if (selectedDoc.ismPOS) {
        param.FILEPATH = selectedDoc.DOCUMENTPATH + '\\' + selectedDoc.DOCUMENTNAME;
        fileType = selectedDoc.DOCUMENTTYPE;
        fileName = selectedDoc.DOCUMENTNAME;
        // this.files=this._prplDTSdata.MPOSDOCUMENTS.value;
        this.ProposalDTSmPosDocuments.controls.filter(p => {
          p.controls.mPosDocuments.value.filter(m => {
            this.files.push(m);
          })
        })
        if (this.files.value) {
          this.selectedIndex = this.files.value.findIndex((p: any) => p.DOCUMENTSEQID === selectedDoc.DOCUMENTSEQID);
          this.totalIndex = this.files.value.length;
        }
        else {
          this.selectedIndex = this.files.findIndex((p: any) => p.DOCUMENTSEQID === selectedDoc.DOCUMENTSEQID);
          this.totalIndex = this.files.length;
        }

      }
      else {
        param.FILEPATH = selectedDoc.FILENMEEXT + '\\' + selectedDoc.FILENME;
        fileType = selectedDoc.FILETYP;
        fileName = selectedDoc.FILENME;
        // this.files=this.ProposalDTSEntity.controls.PROPOSALDOCUMENTS.value;
        this.ProposalDTSDocuments.controls.filter(p => {
          p.controls.Applicants.controls.filter(m => {
            m.controls.Documents.controls.filter(n => {
              n.controls.DocumentInfo.value.filter(o => {
                this.files.push(o);
              })
            })
          })
        })

        if (this.files.value) {
          this.selectedIndex = this.files.value.findIndex((p: any) => p.SEQID === selectedDoc.SEQID);
          this.totalIndex = this.files.value.length;
        }
        else {
          this.selectedIndex = this.files.findIndex((p: any) => p.SEQID === selectedDoc.SEQID);
          this.totalIndex = this.files.length;
        }
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
            this.imageSource = "assets/Images/pdfviewer.jpg";
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

  nextDoc() {

    if (this.selectedIndex + 1 < this.totalIndex) {
      this.scale = 1;
      this.selectedIndex++;
      if (this.files.value) {
        this.DocumentView(this.files.value[this.selectedIndex]);
      }
      else {
        this.DocumentView(this.files[this.selectedIndex]);
      }
    }

  }

  prevDoc() {

    if (this.selectedIndex > 0) {
      this.scale = 1;
      this.selectedIndex--;
      if (this.files.value) {
        this.DocumentView(this.files.value[this.selectedIndex]);
      }
      else {
        this.DocumentView(this.files[this.selectedIndex]);
      }
    }

  }
setGeocodeControls(document:any)
{

  this.imageDocData = document;
  this.showgeoCode=true;
  this.Contact_Address = document.CNTCT_ADDRESS;
  this.LatLng= document.LATITUDE + ',   '  + document.LONGITUDE;
  this.documentCode = document.DOCUMENTCDE;
  let dte= new Date(document.TIMESTAMP);
  const date = moment.utc(document.TIMESTAMP);
  const formattedDate = date.format('YYYY-MM-DD HH:mm:ss');
  this.Timespan =formattedDate;
}
getLatLng(coordString: string): google.maps.LatLngLiteral | null {
  if (!coordString) return null;
  const [lat, lng] = coordString.trim().split(',').map(Number);
  return isNaN(lat) || isNaN(lng) ? null : { lat, lng };
}
isValidLatLng(value: google.maps.LatLngLiteral | null): boolean {
  return !!value && value.lat !== 0 && value.lng !== 0;
}
  CalculateHistoryInfo(onComplete?: () => void) {

    if (this.statusCde === '00001' || this.statusCde === '00094') {
      if (this.imageDocData.DOCUMENTCDE !== '00019') { return; }

      this.param.ProposalId = this.imageDocData.PROPOSALID;
      this.param.ContactAddress = this.imageDocData.CNTCT_ADDRESS;
      this.param.ImgLat = this.imageDocData.LATITUDE;
      this.param.ImgLng = this.imageDocData.LONGITUDE;

      this._proposalDTSService.CheckGeoCodeHistory(this.param).subscribe((history: any) => {

        if (history?.ResultSet?.ISMATCH && history?.ResultSet?.IMAGEMATCH) {
          this.ContactAddrLatLng = history?.ResultSet?.ADDRESSLATITUDE + ',   ' +history?.ResultSet?.ADDRESSLONGITUDE;
          onComplete?.();
          // const rawDistance = history?.ResultSet?.HAVERSINEDISTANCE;
          // const formattedDistance = rawDistance < 1
          //   ? `${Math.round(rawDistance * 1000)} m`
          //   : `${rawDistance.toFixed(2)} km`;
          // this.toastr.info("Already calculated at " + history?.ResultSet?.CREATIONDTE + " and distance is " + formattedDistance);
          return;
        }

        if (history?.ResultSet?.ISMATCH && !history?.ResultSet?.IMAGEMATCH) {
          let distance = +this._proposalDTSService
            .calculateDistance(this.imageDocData.LATITUDE, this.imageDocData.LONGITUDE, history?.ResultSet?.ADDRESSLATITUDE, history?.ResultSet?.ADDRESSLONGITUDE)
            .toFixed(4);

          if (isNaN(distance)) distance = 0;

            const addressCoordinatesValid = this.isValidLatLng({ lat: history?.ResultSet?.ADDRESSLATITUDE, lng: history?.ResultSet?.ADDRESSLONGITUDE });
            const imageCoordinatesValid = this.isValidLatLng({ lat: this.imageDocData.LATITUDE, lng: this.imageDocData.LONGITUDE });
            let api_remarks = '';

          if (!addressCoordinatesValid) {
          api_remarks = 'Address coordinates could not be retrieved';
        }
        else if (!imageCoordinatesValid) {
          api_remarks = 'mPOS coordinates not available';
        }
        else {
          api_remarks = 'Address coordinates successfully retrieved';
        }


          this.PRPL_LCTN_HTRY_req = {
            PROPOSALID: this.imageDocData.PROPOSALID,
            ADDRESSLATITUDE: history?.ResultSet?.ADDRESSLATITUDE,
            ADDRESSLONGITUDE: history?.ResultSet?.ADDRESSLONGITUDE,
            IMAGELATITUDE: this.imageDocData.LATITUDE,
            IMAGELONGITUDE: this.imageDocData.LONGITUDE,
            DOCUMENTCDE: this.imageDocData.DOCUMENTCDE,
            CONTACTADDRESS: this.Contact_Address,
            HAVERSINEDISTANCE: distance,
            RowState: DataRowState.Added,
            SESSIONCDE: this._storageService.GetUserInfo().SessionCode,
            SESSIONID: this._storageService.GetUserInfo().SessionId,
            CREATIONDTE: new Date(),
            COMMENTS: api_remarks,
            USERID: this._storageService.GetUserInfo().UserId,
            ISAUDITABLE: false
          };

          this._proposalDTSService.saveGeoCodeHistory(this.PRPL_LCTN_HTRY_req).subscribe(() => {

            this._proposalDTSService.announceApiDone();
            // this.ReadGeoLocationHistory();
          });
          return;
        }

        this._proposalDTSService.getGeoCodeCoordinates(this.Contact_Address).subscribe((coords: any) => {

          let lat = coords?.lat ?? 0;
          let lng = coords?.lng ?? 0;
          this.ContactAddrLatLng = lat + ',    ' + lng;
          this._proposalDTSService.getAndSetAddlatlng(this.ContactAddrLatLng);

          const imageLat = this.imageDocData.LATITUDE ?? 0;
          const imageLng = this.imageDocData.LONGITUDE ?? 0;

          let distance = +this._proposalDTSService
            .calculateDistance(imageLat, imageLng, lat, lng)
            .toFixed(4);

          if (isNaN(distance)) distance = 0;

          const addressCoordinatesValid = this.isValidLatLng({ lat, lng });
          const imageCoordinatesValid = this.isValidLatLng({ lat: imageLat, lng: imageLng });
          let api_remarks = '';

          if (!addressCoordinatesValid) {
            api_remarks = 'Address coordinates could not be retrieved';
          }
          else if (!imageCoordinatesValid) {
            api_remarks = 'mPOS coordinates not available';
          }
          else {
            api_remarks = 'Address coordinates successfully retrieved';
          }

          this.PRPL_LCTN_HTRY_req = {
            PROPOSALID: this.imageDocData.PROPOSALID,
            ADDRESSLATITUDE: lat,
            ADDRESSLONGITUDE: lng,
            IMAGELATITUDE: imageLat,
            IMAGELONGITUDE: imageLng,
            DOCUMENTCDE: this.documentCode,
            CONTACTADDRESS: this.Contact_Address,
            HAVERSINEDISTANCE: distance,
            RowState: DataRowState.Added,
            SESSIONCDE: this._storageService.GetUserInfo().SessionCode,
            SESSIONID: this._storageService.GetUserInfo().SessionId,
            CREATIONDTE: new Date(),
            COMMENTS: api_remarks,
            USERID: this._storageService.GetUserInfo().UserId,
            ISAUDITABLE: false
          };

          this._proposalDTSService.saveGeoCodeHistory(this.PRPL_LCTN_HTRY_req).subscribe(() => {

            this._proposalDTSService.announceApiDone();
            onComplete?.();
            // this.ReadGeoLocationHistory();
          });
        });
      });
    } else {
      this.showMapPopup(this.LatLng)
    }
  }

  onLatLngClick() {
    if(this.imageDocData.LONGITUDE !== 0 && this.imageDocData.LATITUDE !== 0){
      if(this.documentCode === '00019'){
        this.CalculateHistoryInfo(() => {
          this.showMapPopup(this.LatLng);
        });
      }
      else{
        this.showMapPopup(this.LatLng)
      }
    }else{
      this.toastr.warning("Lat/Long is not available against Foto Rumah + CMO document");
    }

  }


  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }
 showMapPopup(latlnt:any)
  {
    const dialogRef = this.matdialog?.open(GeolocationMapComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { latlng:this.LatLng, docCode: this.documentCode, destinationLngLat: this.ContactAddrLatLng},
    });

    dialogRef?.afterClosed().subscribe((result: any) => {
      if (result != undefined) {
      }
    });



  }

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


