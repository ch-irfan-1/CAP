import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { StateManagment } from '@NFS_Core/RowStateManagement/FormStateManagement';
import { IBLAKLISTHTRYOTOInfo } from '@NFS_Entity/BlackListExposureEntity/IBLAK_LIST_HTRY_OTOInfo';
import { IOJKBADCUSTInfo } from '@NFS_Entity/BlackListExposureEntity/IOJK_BAD_CUSTInfo';
import { IPRPLBLACKLISTEXPInfo } from '@NFS_Entity/BlackListExposureEntity/IPRPL_BLACKLIST_EXPInfo';
import { IFamilyExposureEntity } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IFamilyExposureEntity.model';
import { IFMLY_BLAK_LIST_EXPRInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IFMLY_BLAK_LIST_EXPRInfo.model';
import { IFMLY_CMS_EXPRInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IFMLY_CMS_EXPRInfo.model';
import { IFMLY_POS_EXPRInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IFMLY_POS_EXPRInfo.model';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { IContextMenu } from '@NFS_Interfaces/OtherInterfaces/IContextMenu.interface';
import { IWorkQueueResult } from '@NFS_Interfaces/OtherInterfaces/IWorkQueueResult';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalEntityMapperService } from '@NFS_Modules/CAP/CAPServices/proposal-entity-mapper.service';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { FormArray, FormBuilder, FormGroup } from 'src/Library';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const subject = new ReplaySubject<any>()
@Component({
    selector: 'app-family-exposure',
    templateUrl: './family-exposure.component.html',
    standalone: false
})
export class familyExposureComponent implements OnInit, OnDestroy {
  @Input() Mode: string = FormMode.NEW;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'Name', 'NFA', 'Terms', 'Relevance'];
  // dataSource = ELEMENT_DATA;
  tempData: any = ["Dealer 1", "Dealer 2", "Dealer 3"];
  panelOpenState = false;
  workQueueResultSet = [] as Array<IWorkQueueResult>;
  public ContextMenu: Array<IContextMenu> = [];
  phoneColumns: string[] = ['idType', 'idNumber', 'issDate', 'expDate', 'def', 'del'];
  addressDataSource = [
    { position: 1, addressType: 'Contact Address', weight: 1.0079, symbol: 'H' }
  ];
  FamExpEntity!: FormGroup<IFamilyExposureEntity>;
  FMLYPOSEXPR: FormArray<IFMLY_POS_EXPRInfo> = this._formBuilder.array<IFMLY_POS_EXPRInfo>([]);
  FMLYCMSEXPR: FormArray<IFMLY_CMS_EXPRInfo> = this._formBuilder.array<IFMLY_CMS_EXPRInfo>([]);
  FMLYBLAKLISTEXPR: FormArray<IFMLY_BLAK_LIST_EXPRInfo> = this._formBuilder.array<IFMLY_BLAK_LIST_EXPRInfo>([]);
  FMLYBLAKLISTEXPRINTR: FormArray<IFMLY_BLAK_LIST_EXPRInfo> = this._formBuilder.array<IFMLY_BLAK_LIST_EXPRInfo>([]);
  FMLYBLAKLISTEXPREXTR: FormArray<IFMLY_BLAK_LIST_EXPRInfo> = this._formBuilder.array<IFMLY_BLAK_LIST_EXPRInfo>([]);
  PRPLINTBLKCUSTSOLO: FormArray<IBLAKLISTHTRYOTOInfo> = this._formBuilder.array<IBLAKLISTHTRYOTOInfo>([]);
  IOJKBADCUSTInfo: FormArray<IOJKBADCUSTInfo> = this._formBuilder.array<IOJKBADCUSTInfo>([]);
  PRPLBLACKLISTEXPInfo: FormArray<IPRPLBLACKLISTEXPInfo> = this._formBuilder.array<IPRPLBLACKLISTEXPInfo>([]);
  private subscription$ = new Subject();

  public appEXColumns = ['PROPOSALNBR', 'ROLEDSC', 'IDTYPEDSC', 'IDCARDNBR', 'APPLICANTNAME', 'STATUSDSC', 'FINANCEDAMT', 'TERMS',];
  public appEXLabels = ['APPLICATION NO.', 'ROLE', 'ID TYPE', 'ID NUMBER', 'NAME', 'STATUS', 'NFA', 'TERMS'];
  public contEXColumns = ['CONTRACTNBR', 'EXPAPPLICANTROLEDSC', 'IDTYPEDSC', 'EXPAPPLICANTCARDID', 'EXPAPPLICANTNME', 'STATUSDSC', 'FINANCEDAMT', 'NOOFTERMS'];
  public contEXLabels = ['CONTRACT NO.', 'ROLE', 'ID TYPE', 'ID NUMBER', 'NAME', 'STATUS', 'NFA', 'TERMS'];
  public internalBadCustColumns = ['IDNUMBER', 'NAME', 'DATASRC', 'ADDRESS', 'CONTRACTID', 'REASON', 'BLACKLISTEDDTE'];
  public internalBadCustLabels = ['ID Number', 'Name', 'Data Source', 'Address', 'Contract No/Application No', 'Comments', 'Insert Date'];
  public internalBadCustpips = [null, null, null, null, null, null, 'formatDateTime12Format', null];
  public externalBadCustColumns = ['IDNUMBER', 'NAME', 'DATASRC', 'ADDRESS', 'BLACKLISTTYPE', 'COMMENTS', 'INSERTDTE'];
  public externalBadCustLabels = ['ID Number', 'Name', 'Data Source', 'Address', 'Internal Credit Record Type', 'Comments', 'Insert Date'];
  public externalBadCustpips = [null, null, null, null, null, null, 'formatDateTime12Format', null,];
  public applicantexposurePipe = [null, null, null, null, null, null, 'formatCurrency', null];
  public contractTermPipe = [null, null, null, null, null, null, 'formatCurrency', null];

  @Output()
  selectedIndexChange: EventEmitter<number> | undefined;
  constructor(private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<familyExposureComponent>,
    public _masterDataService: MasterDataService,
    private _proposaldataService: ProposalDataService,
    private _FormState: StateManagment,
    private _mapperService: ProposalEntityMapperService,
    private _proposalform: ProposalEntityFormService,
    @Inject(MAT_DIALOG_DATA) public data: any, private _proposalService: ProposalService
  ) { }

  ngOnInit(): void {
    let params = {} as IProposalInfoParm;
    params = this.data;

    this._proposalService.ReadFamilyExposure(params).pipe(takeUntil(this.subscription$)).subscribe(res => {
      if (res && res.ResultSet) {
        this.FMLYBLAKLISTEXPREXTR = this._formBuilder.array(res.ResultSet?.FMLYBLAKLISTEXPR?.filter((p: any) => p.DATASRC == 'External Source').map((r: any) => this._formBuilder.group(r)));
        this.FMLYBLAKLISTEXPRINTR = this._formBuilder.array(res.ResultSet?.FMLYBLAKLISTEXPR?.filter((p: any) => p.DATASRC == 'Internal Source').map((r: any) => this._formBuilder.group(r)));
        this.FMLYCMSEXPR = this._formBuilder.array(res.ResultSet?.FMLYCMSEXPR?.filter((s: any) => s.EXPAPPLICANTNME != this.data.BorrowerName).map((r: any) => this._formBuilder.group(r)));
        this.FMLYPOSEXPR = this._formBuilder.array(res.ResultSet?.FMLYPOSEXPR?.filter((s: any) => s.APPLICANTNAME != this.data.BorrowerName).map((r: any) => this._formBuilder.group(r)));
      }
    });


    // this._proposalService.ReadExistingFamilyExposure(params).pipe(takeUntil(this.subscription$)).subscribe(result => {
    //     if (result && result.ResultSet) {
    //         if (result.ResultSet.FMLYBLAKLISTEXPR.length > 0) {
    //             result.ResultSet.FMLYBLAKLISTEXPR.forEach((_element: IFMLY_BLAK_LIST_EXPRInfo) => {
    //                 let FamiliyBlkListExp = this._proposalform.FamilyBlakListerForm();
    //                 this._mapperService.FamilyblackListExposureMapper(FamiliyBlkListExp, _element)
    //                 this._proposaldataService.CurrentApplicant.controls.INDIVIDUALAPPLICANT.controls.FAMILYEXPOSURE.controls[0].controls.FMLYBLAKLISTEXPR.push(FamiliyBlkListExp);
    //             });
    //         }
    //         if (result.ResultSet.FMLYCMSEXPR.length > 0) {
    //             result.ResultSet.FMLYCMSEXPR.forEach((_element: IFMLY_CMS_EXPRInfo) => {
    //                 let FamCMSExp = this._proposalform.FMLYCMSEXPRForm();
    //                 this._mapperService.FamilyCMSExposureMapper(FamCMSExp, _element);
    //                 this._proposaldataService.CurrentApplicant.controls.INDIVIDUALAPPLICANT.controls.FAMILYEXPOSURE.controls[0].controls.FMLYCMSEXPR.push(FamCMSExp);
    //             });
    //         }
    //         if (result.ResultSet.FMLYPOSEXPR.length > 0) {
    //             result.ResultSet.FMLYPOSEXPR.forEach((_element: IFMLY_POS_EXPRInfo) => {
    //                 let FamPOSExp = this._proposalform.FMLYPOSEXPRForm();
    //                 this._mapperService.FamilyPOSExposureMapper(FamPOSExp, _element);
    //                 this._proposaldataService.CurrentApplicant.controls.INDIVIDUALAPPLICANT.controls.FAMILYEXPOSURE.controls[0].controls.FMLYPOSEXPR.push(FamPOSExp);
    //             });
    //         }
    //         if (this.Mode != FormMode.VIEW) {
    //             this._FormState.ResetFormArrayState(this._proposaldataService.CurrentApplicant.controls.INDIVIDUALAPPLICANT.controls.FAMILYEXPOSURE.controls, DataRowState.Removed);
    //         }
    //     }
    // });
  }

  // UpdateCAPCMSExposure() {
  //     let params = {} as IProposalInfoParm;
  //     this._proposalService.ReadFamilyExposure(params).pipe(takeUntil(this.subscription$)).subscribe(result => {
  //         if (result && result.ResultSet) {
  //             this._proposaldataService.CurrentApplicant.controls.INDIVIDUALAPPLICANT.controls.FAMILYEXPOSURE.controls[0].controls.FMLYPOSEXPR.controls.forEach(p => p.controls.FAMILYMEMBERID.setValue(this.data.FamilyMemberID))


  //         }
  //         if (this._proposaldataService.CurrentApplicant.controls.INDIVIDUALAPPLICANT.controls.FAMILYEXPOSURE) {
  //             let nameToCompare: string = '';
  //             let array: string[] = [];
  //             array[0] = this._proposaldataService.CurrentApplicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL.controls.FIRSTNME.value;
  //             array[1] = this._proposaldataService.CurrentApplicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL.controls.MIDDLENME.value;
  //             array[2] = this._proposaldataService.CurrentApplicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL.controls.LASTNME.value;
  //             nameToCompare = this._proposaldataService.concatenateNames(array[0], array[1], array[2]);
  //             // nameToCompare = nameToCompare.concat(array)
  //         }
  //     });
  // }

  onNoClick(): void {

    this.dialogRef.close();
  }

  childOutput(event: any) {

  }

  // IndexChange(index: number) {
  //     let params = {} as IProposalInfoParm;
  //         params.ProposalId = this.data.ProposalId;//323326;//this.data.ProposalId;
  //         params.ApplicantId = this.data.ApplicantId;//342757;//this.data.ApplicantId;
  //         params.FamilyMemberID = this.data.FamilyMemberID;//1;//this.data.FamilyMemberID;
  //         params.FamilyCardNo = this.data.FamilyCardNo;
  //         params.DateOfBirth = this.data.DateOfBirth;
  //         params.FamilySearchCriteria = this.data.FamilySearchCriteria;
  //         params.ApplicantName = this.data.ApplicantName;

  //     if (index == 1) {
  //         if (this.FMLYBLAKLISTEXPR.controls.length == 0) {
  //             this._proposalService.ReadFamilyExposure(params).pipe(takeUntil(this.subscription$)).subscribe(res => {
  //                 this.FMLYBLAKLISTEXPREXTR = this._formBuilder.array(res.ResultSet?.FMLYBLAKLISTEXPR?.filter((p: any) => p.DATASRC == 'External Source').map((r: any) => this._formBuilder.group(r)));
  //                 this.FMLYBLAKLISTEXPRINTR = this._formBuilder.array(res.ResultSet?.FMLYBLAKLISTEXPR?.filter((p: any) => p.DATASRC == 'Internal Source').map((r: any) => this._formBuilder.group(r)));
  //             });

  //         }
  //     }
  //     else if (index == 2) {
  //         if (this.FMLYCMSEXPR.controls.length == 0) {
  //             this._proposalService.ReadFamilyExposure(params).pipe(takeUntil(this.subscription$)).subscribe(res => {
  //                 this.FMLYCMSEXPR = this._formBuilder.array(res.ResultSet?.FMLYCMSEXPR?.map((r: any) => this._formBuilder.group(r)));
  //             })
  //         }
  //     }
  // }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }
}
