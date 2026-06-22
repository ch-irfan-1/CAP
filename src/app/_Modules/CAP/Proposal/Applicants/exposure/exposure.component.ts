import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { IBLAKLISTHTRYOTOInfo } from '@NFS_Entity/BlackListExposureEntity/IBLAK_LIST_HTRY_OTOInfo';
import { IOJKBADCUSTInfo } from '@NFS_Entity/BlackListExposureEntity/IOJK_BAD_CUSTInfo';
import { IPRPLINTERNALBLACKLISTEXPInfo } from '@NFS_Entity/BlackListExposureEntity/IPRPL-INTERNAL-BLACKLIST-EXPINFO';
import { IPRPLBLACKLISTEXPInfo } from '@NFS_Entity/BlackListExposureEntity/IPRPL_BLACKLIST_EXPInfo';
import { ICONT_EXPRInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/ICONT_EXPRInfo.model';
import { IExposureEntity } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IExposureEntity.model';
import { IPRPL_EXPRInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IPRPL_EXPRInfo.model';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalEntityMapperService } from '@NFS_Modules/CAP/CAPServices/proposal-entity-mapper.service';
import { FormArray, FormBuilder, FormGroup } from 'src/Library';
import { forkJoin, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { catchError, first, map, takeUntil } from 'rxjs/operators';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
const subject = new ReplaySubject<any>()

@Component({
    selector: 'app-exposure',
    templateUrl: './exposure.component.html',
    standalone: false
})
export class exposureComponent implements OnInit, OnDestroy {
  Mode = FormMode.NEW;
  isDataRequested = true;
  subject = new ReplaySubject<Array<Array<INFSDropDownData>>>();
  panelOpenState = false;
  badCustomerCheckBox : Boolean = false;

  ProposalExposure!: FormGroup<IExposureEntity>;
  PRPLEXPR: FormArray<IPRPL_EXPRInfo> = this._formBuilder.array<IPRPL_EXPRInfo>([]);
  CONTEXPR: FormArray<ICONT_EXPRInfo> = this._formBuilder.array<ICONT_EXPRInfo>([]);
  PRPLINTBLKCUSTEXP: FormArray<IPRPLINTERNALBLACKLISTEXPInfo> = this._formBuilder.array<IPRPLINTERNALBLACKLISTEXPInfo>([]);
  PRPLINTBLKCUSTSOLO: FormArray<IBLAKLISTHTRYOTOInfo> = this._formBuilder.array<IBLAKLISTHTRYOTOInfo>([]);
  IOJKBADCUSTInfo: FormArray<IOJKBADCUSTInfo> = this._formBuilder.array<IOJKBADCUSTInfo>([]);
  PRPLBLACKLISTEXPInfo: FormArray<IPRPLBLACKLISTEXPInfo> = this._formBuilder.array<IPRPLBLACKLISTEXPInfo>([]);
  private subscription$ = new Subject();
  public ApplicationExposurePipes = [null, null, null, null, null, null, 'formatCurrency', null]
  public Pipes = [null, null, null, null, null, 'formatCurrency', null];

  public appEXColumns = ['PROPOSALNBR', 'ROLEDSC', 'IDTYPDSC', 'IDCARDNBR', 'APPLICANTNAME', 'STATUSDSC', 'FINANCEDAMT', 'TERMS'];
  public appEXLabels = ['APPLICATION NO.', 'ROLE', 'ID TYPE', 'ID NUMBER', 'NAME', 'STATUS', 'NFA', 'TERMS'];
  public contEXColumns = ['CONTRACTNBR', 'EXPAPPLICANTROLEDSC', 'EXPAPPLICANTCARDID', 'EXPAPPLICANTNME', 'STATUSDSC', 'FINANCEDAMT', 'NOOFTERMS'];
  public contEXLabels = ['CONTRACT NO.', 'ROLE', 'ID NUMBER', 'NAME', 'STATUS', 'NFA', 'TERMS'];
  public internalBadCustColumns = ['IDNUMBER', 'NAME', 'DATASRC', 'ADDRESS', 'CONTRACTID', 'REASON', 'BLACKLISTEDDTE'];
  public internalBadCustLabels = ['ID Number', 'Name', 'Data Source', 'Address', 'Contract No/Application No', 'Comments', 'Insert Date'];
  public internalBadCustpips = [null, null, null, null, null, null, 'formatDateTime12Format'];
  public internalBadCustSoloColumns = ['TRANSACTIONTYPE', 'CONSUMERTYPE', 'CUSTNAME', 'ADDRESS', 'EXCCTGDESC', 'TRANSACTIONDATE', 'DATEOFBIRTH', 'IDNUMBER'];
  public internalBadCustSoloLabels = ['Transaction Type', 'Consumer Type', 'Customer Name', 'Address', 'Exc Category Description', 'Transaction Date', 'Date of birth', 'ID Number'];
  public internalBadCustSolopips = [null, null, null, null, null, 'formatDate', 'formatDate', null, null,];
  public externalBadCustColumns = ['IDNUMBER', 'NAME', 'DATASRC', 'ADDRESS', 'BLACKLISTTYPE', 'COMMENTS', 'INSERTDTE'];
  public externalBadCustLabels = ['ID Number', 'Name', 'Data Source', 'Address', 'Internal Credit Record Type', 'Comments', 'Insert Date'];
  public externalBadCustpips = [null, null, null, null, null, null, 'formatDateTime12Format'];
  public ojkBadCustColumns = ['OJKBADCUSTNAME', 'OJKALIAS', 'OJKIDNUMBER', 'OJKCUSTADDRESS', 'OJKEMAIL', 'OJKDOB', 'OJKDESCRIPTION', 'OJKREMARKS'];
  public ojkBadCustLabels = ['Name', 'Alias Name', 'ID Number', 'Address', 'Email', 'Date of Birth', 'Description', 'Remarks'];
  public ojkBadCustpips = [null, null, null, null, null, 'formatDate', null, null,];

  @Output() selectedIndexChange: EventEmitter<number> | undefined;
  constructor(private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<exposureComponent>,
    public _masterDataService: MasterDataService,
    private _proposaldataService: ProposalDataService,
    @Inject(MAT_DIALOG_DATA) public data: any, private _proposalService: ProposalService, private _proposalMapperService: ProposalEntityMapperService
  ) { }

  ngOnInit(): void {
    let params = {} as IProposalInfoParm;
    params.IdCardNumber = this.data.IdCardNumber;
    params.ApplicantType = this.data.ApplicantType;
    params.ApplicantName = this.data.ApplicantName;
    params.LegalStatusCde = this.data.LegalStatusCde;
    params.FromDate = this.data.FromDate;

    this._proposalService.SearchPOSExposure(params).pipe(takeUntil(this.subscription$)).subscribe(res => {
      this.PRPLEXPR = this._formBuilder.array(res.ResultSet.map((r: any) => this._formBuilder.group(r)));
      const index: number = this.PRPLEXPR.controls.findIndex(p => p.controls.PROPOSALID.value == this._proposaldataService.PROPOSAL.value.PROPOSALID);
      if (index > -1) {
        this.PRPLEXPR.removeAt(index);
      }
      this.FillGridDescriptions(2);
    })

  }
  onNoClick(): void {

    this.dialogRef.close();
  }

  childOutput(event: any) {

  }
  InvlokeBadCustomerData(): Observable<any> {
    let params = {} as IProposalInfoParm;
    params.IdCardNumber = this.data.IdCardNumber;
    params.ApplicantType = this.data.ApplicantType;
    params.ApplicantName = this.data.ApplicantName;
    params.LegalStatusCde = this.data.LegalStatusCde;
    params.FromDate = this.data.FromDate;
    if (this.isDataRequested) {
      this.isDataRequested = false;
      forkJoin([
        this._proposalService.SearchInternalBlacklistData(params),
        this._proposalService.SearchBlacklistData(params),
        this._proposalService.SearchInternalBlacklistDataSolo(params),
        this._proposalService.SearchOJKBadCustomers(params)
      ]).subscribe(nr => this.subject.next(nr));
    }

    return this.subject.pipe(first(), map((response) => {
      return {
        PRPLINTBLKCUSTEXP: response[0], PRPLBLACKLISTEXPInfo: response[1], PRPLINTBLKCUSTSOLO: response[2], IOJKBADCUSTInfo: response[3]
      };
    }),
      catchError(error => of(error)));
  }
  IndexChange(index: number) {
    if (index == 1) {
      this.InvlokeBadCustomerData().pipe(takeUntil(this.subscription$)).subscribe(res => {
        this.PRPLINTBLKCUSTEXP = this._formBuilder.array(res.PRPLINTBLKCUSTEXP.ResultSet.map((r: any) => this._formBuilder.group(r)));
        this.PRPLBLACKLISTEXPInfo = this._formBuilder.array(res.PRPLBLACKLISTEXPInfo.ResultSet.map((r: any) => this._formBuilder.group(r)));
        this.PRPLINTBLKCUSTSOLO = this._formBuilder.array(res.PRPLINTBLKCUSTSOLO.ResultSet.map((r: any) => this._formBuilder.group(r)));
        this.IOJKBADCUSTInfo = this._formBuilder.array(res.IOJKBADCUSTInfo.ResultSet.map((r: any) => this._formBuilder.group(r)));
      })
    }
    else if (index == 2) {
      if (this.CONTEXPR.controls.length == 0) {
        let params = {} as IProposalInfoParm;
        params.IdCardNumber = this.data.IdCardNumber;
        params.ApplicantType = this.data.ApplicantType;
        params.ApplicantName = this.data.ApplicantName;
        params.FromDate = this.data.FromDate;

        this._proposalService.SearchCMSExposure(params).pipe(takeUntil(this.subscription$)).subscribe(res => {
          this.CONTEXPR = this._formBuilder.array(res.ResultSet.map((r: any) => this._formBuilder.group(r)));
          this.FillGridDescriptions(1);
        })
      }
    }
  }

  LoadPOSExposureData(event: any): void {

    let params = {} as IProposalInfoParm;
    params.ApplicantId = event.APPLICANTID;
    params.ModuleType = "Application";

    this._proposalService.LoadApplicantEntity(params).pipe(takeUntil(this.subscription$)).subscribe(res => {

      if (res && res.ResultSet) {
        this.dialogRef.close(res.ResultSet[0]);
      }
    })

  }

  LoadCMSExposureData(event: any): void {

    let params = {} as IProposalInfoParm;
    params.ApplicantId = event.EXPAPPLICANTID; // Here Applicant is BP ID
    params.ModuleType = "Contract";

    this._proposalService.LoadApplicantEntity(params).pipe(takeUntil(this.subscription$)).subscribe(res => {

      if (res && res.ResultSet) {
        this.dialogRef.close(res.ResultSet[0]);
      }
    })

  }
  FillGridDescriptions(type: number) {
    if (type == 1) {
      if (this.CONTEXPR) {
        this.CONTEXPR.controls.filter(x => x.value.RowState != DataRowState.Removed).forEach((item, index) => {
          if (!item.value.IDTYPEDSC) {
            let Type = this._masterDataService.ApplicantIdTypesSetup?.find(t => t.code === item.value.IDTYPECDE);
            this.CONTEXPR.controls[index].controls.IDTYPEDSC.setValue(Type?.TextValue || '')
          }
        });
      }
    }
    // else if (type == 2) {
    //   if (this.PRPLEXPR) {
    //     this.PRPLEXPR.controls.filter(x => x.value.RowState != DataRowState.Removed).forEach((item, index) => {
    //       if (!item.value.IDTYPEDSC) {
    //         let Type = this._masterDataService.ApplicantIdTypesSetup?.find(t => t.code === item.value.IDTYPECDE);
    //         this.PRPLEXPR.controls[index].controls.IDTYPEDSC.setValue(Type?.TextValue || '')
    //       }
    //     });
    //   }
    // }
  }

  ngOnDestroy(): void {

      subject.unsubscribe();
      this.subscription$.next(true);
      this.subscription$.complete();
  }

  close(){
    var BadCustomerObj = {
      InternalBadCusomer: this.PRPLINTBLKCUSTEXP,
      ExternalBadCustomer: this.PRPLBLACKLISTEXPInfo,
      SoloBlackCustomer: this.PRPLINTBLKCUSTSOLO,
      BadCusomerInfo :  this.IOJKBADCUSTInfo
      }
      this.dialogRef.close(BadCustomerObj);
    }
  }
