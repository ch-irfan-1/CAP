import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorSelectConfig, PageEvent } from '@angular/material/paginator';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { ProposalDTSService } from '@NFS_Core/NFSServices/ProposalDTS/proposal-dts.service';
import { StateManagment } from '@NFS_Core/RowStateManagement/FormStateManagement';
import * as ProposalDTSEntity from '@NFS_Entity/ProposalDTS-Entity/IProposalDTSEntity.model.index';
import { IProposalDTSEntity } from '@NFS_Entity/ProposalDTS-Entity/IProposalDTSEntity.model.index';
import { IPRPL_DTS_DOCT_GRUPInfo } from '@NFS_Entity/ProposalDTS-Entity/IPRPL_DTS_DOCT_GRUPInfo.model';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { IContextMenu } from '@NFS_Interfaces/OtherInterfaces/IContextMenu.interface';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { ProposalDTSDataService } from '@NFS_Modules/CAP/CAPServices/ProposalDTS/proposal-dts-data.service';
import { ProposalDTSMapperService } from '@NFS_Modules/CAP/CAPServices/ProposalDTS/proposal-dts-mapper.service';
import { ProposalDTSEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalDTS/ProposalDTSEntityForm.service';
import { FormArray, FormBuilder, FormGroup } from 'src/Library';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { UploadDocumentComponent } from './upload-document/upload-document.component';
import { ViewDocument } from './view-document/view-document.component';
import { IPRPL_LCTN_HTRY } from '@NFS_Entity/ProposalDTS-Entity/IPRPL_LCTN_HTRY.model';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { IPRPL_DVTN_TRCK } from '@NFS_Entity/ProposalDTS-Entity/IPRPL_DVTN_TRCK.model';

@Component({
    selector: 'app-document-tracking',
    templateUrl: './document-tracking.component.html',
    styleUrls: ['./document-tracking.component.css'],
    standalone: false
})
export class DocumentTrackingComponent implements OnInit, OnDestroy {

  private subscription$ = new Subject();
  public docdataSet: FormArray<IPRPL_DTS_DOCT_GRUPInfo> = this._formBuilder.array<IPRPL_DTS_DOCT_GRUPInfo>([]);
  proposalId: number = 0;
  ProposalDTSEntity!: FormGroup<ProposalDTSEntity.IProposalDTSEntity>;
  PROPOSALDTSHEADER!: FormGroup<ProposalDTSEntity.IPRPL_DTS_HEDRInfo>;
  PROPOSALDTS!: FormGroup<ProposalDTSEntity.IPRPL_DTSInfo>;
  mPOSdocs!: Array<IPRPL_DTS_DOCT_GRUPInfo>;
  PRPL_LCTN_HTRY_req = {} as IPRPL_LCTN_HTRY;
  subscription?: Subscription;
  statusCde: string = '';
  isCalculateDisabled: boolean = false;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator | undefined;
  resetGridPage: boolean = false;
  dataSourcelength = 0;
  selectedPageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 25, 50, 75, 100];

  public ProposalDTSDocuments: FormArray<ICategory> = this._formBuilder.array<ICategory>([]);
  public columns = ['GROUPDSC', 'DOCUMENTDSC', 'DOCUMENTSUBDSC', 'COMMENTS', 'CHECKEDBYCAA'];
  public pipes = [null, null, null, null, null, null];
  public Labels = ['Document Group', 'Document Type', 'Document Sub Type', 'Comments', 'Submitted'];

  public columnsPOS = ['GROUPDSC', 'DOCUMENTDSC', 'DOCUMENTSUBDSC'];
  public pipesPOS = [null, null, null];
  public LabelsPOS = ['Document Group', 'Document Type', 'Document Sub Type'];

  public columnsDocInfo = ['CONTACTADDRESS', 'ADDRESSLATITUDE', 'ADDRESSLONGITUDE', 'IMAGELATITUDE','IMAGELONGITUDE', 'CREATIONDTE', 'HAVERSINEDISTANCE', 'COMMENTS'];
  public LabelsDocInfo = ['Contact Address', 'Lat','Long', 'Img Lat','Img Lng', 'Date', 'Distance', 'Remarks'];
  public EnableTooltip = [true, false, false, false, false, false, false, true];


  public ContextMenu: Array<IContextMenu> = [];
  public historyInfoDocs = this._formBuilder.array<FormGroup>([]);

  object = { DGroup: '', DType: '', DSType: '', Comments: '', Submitted: true }
  group = this._formBuilder.group(this.object);
  public doctDataset: FormArray<any> = this._formBuilder.array<any>([]);
  params = {} as IProposalInfoParm;
  files: FormArray<any> = this._formBuilder.array<any>([]);
  fotoRumahDocNotAvailable: boolean = false;
  public LabelsDeviationInfo = ['Deviation Summary', 'Deviation Comments']
  public columnsDeviationInfo  = ['DeviationSummary', 'DeviationComment'];
  public DvtnTrckInformation: FormArray<IPRPL_DVTN_TRCK> = this._formBuilder.array<IPRPL_DVTN_TRCK>([]);
  constructor(private dialog: MatDialog,

    private _proposalService: ProposalService,
    private toaster: ToastrService,
    private _prplDTSdata: ProposalDTSDataService,
    private _prplDTSMapper: ProposalDTSMapperService,
    public _proposalDTSService: ProposalDTSService,
    private _formBuilder: FormBuilder,
    private _ProposalDTSForm: ProposalDTSEntityFormService,
    @Inject(MAT_DIALOG_DATA) Param: any,
    private _FormState: StateManagment,
    private toastr: ToastrService,
    private _storageService: ClientStoreService) {
    this.proposalId = Param.proposalId;
    this.statusCde = Param.statuscde;
  }

  panelOpenState = false;
  paginatorSelectConfig:MatPaginatorSelectConfig = {
    disableOptionCentering: true,
    panelClass: ["paginator-select-overlay", "doc-track-dialog"]
  }
  ngOnInit(): void {
    this._prplDTSdata.ProposalDTSEntity = this._ProposalDTSForm.ProposalDTSEntity();
    this.ProposalDTSEntity = this._prplDTSdata.ProposalDTSEntity;
    this.PROPOSALDTSHEADER = this._prplDTSdata.PROPOSALDTSHEADER;
    this.PROPOSALDTS = this._prplDTSdata.PROPOSALDTS;

    this.subscription = this._proposalDTSService.apiDone$
    .subscribe(() => this.ReadGeoLocationHistory());
    this.ReadProposalDTS(0, this.selectedPageSize);
    this.ReadmPOSDocuments(0, this.selectedPageSize);
    this._proposalService.ReadMPOSDocumentsByProposalId({ ProposalId: this.proposalId }).subscribe((res: any) => {
      const mPosDocs = res?.ResultSet.filter((x: any) => x.DOCUMENTCDE === '00019');
      if (mPosDocs.length > 0 && (this.statusCde === '00001' || this.statusCde === '00094')) {
        this.isCalculateDisabled = false;
      } else {
        this.isCalculateDisabled = true;
      }
    })
    this.ReadGeoLocationHistory();
    this.ReadDeviationTrackingByProposalId();
  }

   ReadDeviationTrackingByProposalId(): void {
    let params = {} as IProposalInfoParm;
    params.ProposalId = this.proposalId;

    this._proposalService.ReadDeviationTrackingByProposalId(params)
      .pipe(takeUntil(this.subscription$))
      .subscribe({
        next: (result) => {
          if (!result || !result.ResultSet || result.ResultSet.length === 0) {
            console.log('No Deviation record found for ProposalId:', this.proposalId);
            return;
          }
          const formattedData = result.ResultSet.map((x: any) => {
            return this._formBuilder.group({
              DeviationSummary: [x.DVTNSMRY],
              DeviationComment: [x.DVTNCMNT]
            });
          });
          this.DvtnTrckInformation.clear();
          formattedData.forEach((group: FormGroup) => this.DvtnTrckInformation.push(group));
        },
        error: (err) => {
          console.error('ReadDeviationTracking failed:', err);
        }
      });
  }
  public PageSelectionChanged(event: PageEvent) {
    //do here
    var pageIndex: number = event.pageIndex + 1;
    this.selectedPageSize = event.pageSize;
    this.ReadProposalDTS((pageIndex * this.selectedPageSize) - this.selectedPageSize, this.selectedPageSize);
  }

  ReadmPOSDocuments(from: number = 0, to: number = 10): void {

    this.params.ProposalId = this.proposalId;
    this.params.fromRecord = from;
    this.params.toRecord = to;
    let eSignatureElement: any;

    this._proposalService.ReadMPOSDocumentsByProposalId(this.params).pipe(takeUntil(this.subscription$)).subscribe((res: any) => {
      if (res && res.ResultSet) {
        this._proposalService.ReadDTSDocumentGroupByGroupCdeForMpos().pipe(takeUntil(this.subscription$)).subscribe(res1 => {
          if (res1 && res1.ResultSet) {
            this.mPOSdocs = res?.ResultSet;
            var codes = res.ResultSet.map((p: any) => p.DOCUMENTCDE);
            res1.ResultSet.filter((DTSGroup: any) => {
              if (codes.includes(DTSGroup.DOCUMENTCDE)) {
                if (!this.docdataSet.value.includes(DTSGroup.DOCUMENTCDE)) {
                  this.docdataSet.push(this._formBuilder.group<IPRPL_DTS_DOCT_GRUPInfo>(DTSGroup));
                  this._prplDTSdata.MPOSDOCUMENTS.controls.filter(p => {
                    if (p.value.DOCUMENTCDE == DTSGroup.DOCUMENTCDE) {

                      if (DTSGroup.DOCUMENTDSC == "e-Signatures") {
                        eSignatureElement = p;
                      }
                      else {
                       this.files.push(p);

                      }
                    }
                  })

                }
              }
            })
            if (eSignatureElement) {
              this.files.push(eSignatureElement)
            }
          }
        })
      }
    })
  }

  ReadProposalDTS(from: number = 0, to: number = 10): void {

    this.params.ProposalId = this.proposalId;
    this.params.fromRecord = from;
    this.params.toRecord = to;

    this._proposalDTSService.ReadProposalDTSEntity(this.params).pipe(takeUntil(this.subscription$)).subscribe(res => {
      if (res && res.ResultSet) {
        let data: IProposalDTSEntity = res.ResultSet as IProposalDTSEntity;

        this._prplDTSMapper.ProposalDTSEntityMapper(this.ProposalDTSEntity, data);
        this._prplDTSdata.PROPOSALDTSHEADER.controls.COMMENTS.setValue(this._prplDTSdata.PROPOSALDTS.controls.COMMENTS.value);

        this._FormState.ResetFormState(this.ProposalDTSEntity, DataRowState.Pristine);
        this.ProposalDTSEntity.markAsPristine();

        // if(this._prplDTSdata.PROPOSALDTSDOCUMENTS.value.filter(p=>p.VERIFIED==false).length>0){
        //   this.isVerficationCompleted=false;
        //   this.completionDate="";
        // }else{
        //   this.isVerficationCompleted=true;
        //   this.completionDate=new Date().toLocaleDateString();
        // }

        this.dataSourcelength = res.ResultSet.PROPOSALDTSDOCUMENTS[0].TOTALROWS;

        this.createProposalDocArray(res.ResultSet.PROPOSALDTSDOCUMENTS);

      }
    })
  }

  createProposalDocArray(resultSet: any) {
    this.ProposalDTSDocuments.clear();
    const applicantTypes = [...new Set(resultSet.map((item: ProposalDTSEntity.IPRPL_DTS_DOCTInfo) => item.GROUPNAME))];
    applicantTypes.forEach(type => {
      let applicants = [...new Set(resultSet.
        filter((aplt: ProposalDTSEntity.IPRPL_DTS_DOCTInfo) => aplt.GROUPNAME === type).
        map((item: ProposalDTSEntity.IPRPL_DTS_DOCTInfo) => item.APPLICANTID))];

      let apltFormArray = this._formBuilder.array<IApplicant>([]);
      applicants.forEach(aplt => {
        let documents = resultSet.filter((selectedAplt: ProposalDTSEntity.IPRPL_DTS_DOCTInfo) => selectedAplt.APPLICANTID === aplt);
        let docFormArray = this._formBuilder.array<ProposalDTSEntity.IPRPL_DTS_DOCTInfo>(documents);
        let apltFormGroup = this._formBuilder.group<IApplicant>({
          ApplicantName: documents[0].APPLICANTNME,
          Documents: docFormArray
        });

        apltFormArray.push(apltFormGroup);
      })

      let categoryFormGroup = this._formBuilder.group<ICategory>({
        ApplicantType: String(type),
        Applicants: apltFormArray
      });

      this.ProposalDTSDocuments.push(categoryFormGroup);
    });
  }

  SaveProposalDTS() {
    if (this._prplDTSdata.PROPOSALDTS.controls.COMMENTS.value !== this._prplDTSdata.PROPOSALDTSHEADER.controls.COMMENTS.value) {
      this._prplDTSdata.PROPOSALDTS.controls.COMMENTS.setValue(this._prplDTSdata.PROPOSALDTSHEADER.controls.COMMENTS.value);
      this._prplDTSdata.PROPOSALDTS.controls.RowState.setValue(DataRowState.Updated);
    }
    this._proposalDTSService.SaveProposalDTSEntity(this._prplDTSdata.ProposalDTSEntity.value).subscribe(res => {
      let data: IProposalDTSEntity = res.ResultSet as IProposalDTSEntity;
      this._prplDTSMapper.ProposalDTSEntityMapper(this.ProposalDTSEntity, data);
      this._FormState.ResetFormState(this.ProposalDTSEntity, DataRowState.Pristine);
      this.ProposalDTSEntity.markAsPristine();
      this.dataSourcelength = res.ResultSet.PROPOSALDTSDOCUMENTS[0].TOTALROWS;
      this.createProposalDocArray(res.ResultSet.PROPOSALDTSDOCUMENTS);
      this.toaster.success('Changes Saved');

    });
  }

  isValidLatLng(value: google.maps.LatLngLiteral | null): boolean {
    return !!value && value.lat !== 0 && value.lng !== 0;
  }

  CalculateHistoryInfo() {
    const sorted = this.mPOSdocs?.sort(
      (a, b) => new Date(b.CREATIONDTE).getTime() - new Date(a.CREATIONDTE).getTime()
    ).filter(x =>x.DOCUMENTCDE === '00019');

    if (sorted.length === 0) return;

    const latestMPOSDoc = sorted[0];
    const contactAddress = latestMPOSDoc.CNTCT_ADDRESS;
    const imgLat = latestMPOSDoc.LATITUDE;
    const imgLng = latestMPOSDoc.LONGITUDE;

    if (imgLat === 0 && imgLng === 0) {
      this.toaster.warning("Lat/Long is not available against Foto Rumah + CMO document");
      return;
    }


    this.params.ImgLat = imgLat;
    this.params.ImgLng = imgLng;
    this.params.ProposalId = this.proposalId;
    this.params.ContactAddress = contactAddress;

    this._proposalDTSService.CheckGeoCodeHistory(this.params).subscribe((history: any) => {

      if (history?.ResultSet?.ISMATCH && history?.ResultSet?.IMAGEMATCH) {
        const rawDistance = history?.ResultSet?.HAVERSINEDISTANCE;
        const formattedDistance = rawDistance < 1
          ? `${Math.round(rawDistance * 1000)} m`
          : `${rawDistance.toFixed(2)} km`;
          const formattedDate = history?.ResultSet?.CREATIONDTE
          ? history?.ResultSet?.CREATIONDTE.replace('T', ' ').replace('Z', '')
          : '';
        this.toastr.info("Already calculated at " + formattedDate + " and distance is " + formattedDistance);
        return;
      }

      if(history?.ResultSet?.ISMATCH && !history?.ResultSet?.IMAGEMATCH){

        let distance = +this._proposalDTSService
        .calculateDistance(imgLat, imgLng, history?.ResultSet?.ADDRESSLATITUDE, history?.ResultSet?.ADDRESSLONGITUDE)
        .toFixed(4);

      if (isNaN(distance)) distance = 0;


        const addressCoordinatesValid = this.isValidLatLng({ lat: history?.ResultSet?.ADDRESSLATITUDE, lng: history?.ResultSet?.ADDRESSLONGITUDE });
        const imageCoordinatesValid = this.isValidLatLng({ lat: imgLat, lng: imgLng });

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
          PROPOSALID: this.proposalId,
          ADDRESSLATITUDE: history?.ResultSet?.ADDRESSLATITUDE,
          ADDRESSLONGITUDE: history?.ResultSet?.ADDRESSLONGITUDE,
          IMAGELATITUDE: imgLat,
          IMAGELONGITUDE: imgLng,
          DOCUMENTCDE: latestMPOSDoc.DOCUMENTCDE,
          CONTACTADDRESS: contactAddress,
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

          this.ReadGeoLocationHistory();
          this.toastr.info("Distance Information Saved Successfully");
        });
        return;
      }

      this._proposalDTSService.getGeoCodeCoordinates(contactAddress).subscribe((coords: any) => {

        let lat = coords?.lat ?? 0;
        let lng = coords?.lng ?? 0;

        const imageLat = latestMPOSDoc.LATITUDE ?? 0;
        const imageLng = latestMPOSDoc.LONGITUDE ?? 0;

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

        //const allCoordinatesAvailable = lat && lng && imageLat && imageLng && validContactAddrCoords;

        this.PRPL_LCTN_HTRY_req = {
          PROPOSALID: this.proposalId,
          ADDRESSLATITUDE: lat,
          ADDRESSLONGITUDE: lng,
          IMAGELATITUDE: imageLat,
          IMAGELONGITUDE: imageLng,
          DOCUMENTCDE: latestMPOSDoc.DOCUMENTCDE,
          CONTACTADDRESS: contactAddress,
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

          this.ReadGeoLocationHistory();
          this.toastr.info("Distance Information Saved Successfully");
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
    this.subscription?.unsubscribe();
    this._proposalDTSService.getAndSetAddlatlng(null);
  }

  showSelectedDocument(selectedDoc: any) {
    const dialogRef = this.dialog.open(UploadDocumentComponent, {
      width: '900px',
      height: '100%',
      panelClass: 'cdk-overlay-pane-custom',
      position: { left: '20%' },

      disableClose: true,

      data: { "applicantId": selectedDoc.APPLICANTID, "proposalId": selectedDoc.PROPOSALID, "roleCde": selectedDoc.ROLECDE, "documentID": selectedDoc.DOCUMENTID },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        let len = this._prplDTSdata.PROPOSALDOCUMENTS.value.filter(d => d.DOCUMENTID === selectedDoc.DOCUMENTID).length;
        let count = this._prplDTSdata.PROPOSALDOCUMENTS.value.filter(d => d.DOCUMENTID === selectedDoc.DOCUMENTID && d.RowState === DataRowState.Removed).length;
        if (len === count) {
          let index = this._prplDTSdata.PROPOSALDTSDOCUMENTS.value.findIndex(d => d.DOCUMENTID === selectedDoc.DOCUMENTID);
          this._prplDTSdata.PROPOSALDTSDOCUMENTS.controls[index].controls.CHECKEDBYCAA?.setValue(false);
          this._prplDTSdata.PROPOSALDTSDOCUMENTS.controls[index].controls.RowState?.setValue(DataRowState.Updated);

        }

        this.createProposalDocArray(this._prplDTSdata.PROPOSALDTSDOCUMENTS.value);
      }
    });

  }

  ReadGeoLocationHistory() {
    this.params.ProposalId = this.proposalId;
    this._proposalDTSService.getGeoCodeHistoryByProposalId(this.params).subscribe((response: any) => {
      if (response.ResultSet && response.ResultSet.length) {
        const formArrayData = response.ResultSet.map((item: any) => {
          const rawDistance = item.HAVERSINEDISTANCE;
          const formattedDistance = rawDistance < 1
            ? `${Math.round(rawDistance * 1000)} m`
            : `${rawDistance.toFixed(2)} km`;
            const formattedDate = item.CREATIONDTE
            ? item.CREATIONDTE.replace('T', ' ').replace('Z', '')
            : '';

          return this._formBuilder.group({
            CONTACTADDRESS: [item.CONTACTADDRESS],
            ADDRESSLATITUDE: [item.ADDRESSLATITUDE],
            ADDRESSLONGITUDE: [item.ADDRESSLONGITUDE],
            IMAGELATITUDE: [item.IMAGELATITUDE],
            IMAGELONGITUDE: [item.IMAGELONGITUDE],
            CREATIONDTE: [formattedDate],
            HAVERSINEDISTANCE: [formattedDistance],
            COMMENTS: [item.COMMENTS]
          });
        });

        this.historyInfoDocs.clear();
        formArrayData.forEach((group: FormGroup) => this.historyInfoDocs.push(group));
      }
    });
  }

  showmPOSDocument(selectedDoc: any) {
    const dialogRef = this.dialog.open(ViewDocument, {
      width: '900px',
      height: '100%',
      position: { left: '20%' },
      panelClass: 'cdk-overlay-pane-custom',

      disableClose: true,

      data: { documentcde: selectedDoc.DOCUMENTCDE, documentsData: this.files, statuscde: this.statusCde },
    });
  }
}

export interface IApplicant {
  ApplicantName: string;
  Documents: Array<ProposalDTSEntity.IPRPL_DTS_DOCTInfo>;
}

export interface ICategory {
  ApplicantType: string;
  Applicants: Array<IApplicant>;
}

