import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { FieldVisitDataService } from '@NFS_Core/NFSServices/MasterData/field-visit-feedback.service';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { IProposalEntity } from '@NFS_Entity/Proposal-Entity/IProposalEntity.model';
import { IPRPL_FILD_VIST_APMTInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/ProposalApplicantEntity.model.index';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { MessageType } from '@NFS_Enums/MessageType.enum';
import { ReturnCode } from '@NFS_Enums/ReturnCode.enum';
import { RoleCode } from '@NFS_Enums/RoleCode';
import { StatusCode } from '@NFS_Enums/StatusCode.enum';
import { IPRPLQUInfo } from '@NFS_Interfaces/OtherInterfaces/IPRPLQUInfo';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { ProposalEntityMapperService } from '@NFS_Modules/CAP/CAPServices/proposal-entity-mapper.service';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { Control, FormBuilder } from 'src/Library';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
    selector: 'app-field-visit',
    templateUrl: './fieldVisit.component.html',
    styleUrls: ['./filedVisit.component.css'],
    standalone: false
})
export class FieldVisitComponent implements OnInit, OnDestroy {

  public FieldInvestigator: INFSDropDownData[] = [];
  public SocialInteraction: INFSDropDownData[] = [];
  public OfficeLocation: INFSDropDownData[] = [];
  public FiRating: INFSDropDownData[] = [];
  public MeetWith: INFSDropDownData[] = [];

  public time = [{ code: "0", TextValue: "12:00 AM" }, { code: "1", TextValue: "1:00 AM" }, { code: "2", TextValue: "2:00 AM" }, { code: "3", TextValue: "3:00 AM" },
  { code: "4", TextValue: "4:00 AM" }, { code: "5", TextValue: "5:00 AM" }, { code: "6", TextValue: "6:00 AM" }, { code: "7", TextValue: "7:00 AM" },
  { code: "8", TextValue: "8:00 AM" }, { code: "9", TextValue: "9:00 AM" }, { code: "10", TextValue: "10:00 AM" }, { code: "11", TextValue: "11:00 AM" },
  { code: "12", TextValue: "12:00 PM" }, { code: "13", TextValue: "1:00 PM" }, { code: "14", TextValue: "2:00 AM" }, { code: "15", TextValue: "3:00 AM" },
  { code: "16", TextValue: "4:00 PM" }, { code: "17", TextValue: "5:00 PM" }, { code: "18", TextValue: "6:00 PM" }, { code: "19", TextValue: "7:00 PM" },
  { code: "20", TextValue: "8:00 PM" }, { code: "21", TextValue: "9:00 PM" }, { code: "22", TextValue: "10:00 PM" }, { code: "23", TextValue: "11:00 PM" },
  ] as INFSDropDownData[];

  public ProposalFieldEntity = this._ProposalForm.ProposalFieldVisitFeedbackForm()

  ApplicantType!: String;
  public showForI: boolean = false;
  public isControlDisable: boolean = false;
  public hVisit: String = '';
  public oVisit: String = '';
  public distanceTo: string = '';
  public location: string = '';
  public saveBtnEnable: boolean = true;

  public isOtherDisabled = true;
  panelOpenState = false;
  _prplq!: IPRPLQUInfo;
  param = {} as IProposalInfoParm;


  private subscription$ = new Subject();
  constructor(
    private _masterDataService: MasterDataService,
    private _fieldVistFeedbackMasterDataService: FieldVisitDataService,
    private _prplService: ProposalService,
    private _formBuilder: FormBuilder,
    private _messageService: MessageService,
    private _proposalMapper: ProposalEntityMapperService,
    private _ProposalForm: ProposalEntityFormService,
    private storageService: ClientStoreService,
    @Inject(MAT_DIALOG_DATA) Param: any,
  ) {
    this._prplq = Param.proposa;
    this.FieldInvestigator=Param.FieldInvestigator;
  }

  ngOnInit(): void {

    if (this._prplq.STATUSCDE === StatusCode.Draft || this._prplq.STATUSCDE === StatusCode.InProcessWithDealer) {
      FormMode.EDIT;
      this.isControlDisable = false;
    }
    else {
      FormMode.VIEW;
      this.isControlDisable = true;
    }

    this.param.ProposalId = this._prplq.PROPOSALID;
    this._prplService.ReadProposal(this.param).pipe(takeUntil(this.subscription$)).subscribe(response => {
      if (response.CODE === Number(ReturnCode.Success.Code) && response.ResultSet) {
        var applicantId = response.ResultSet.PROPOSALAPPLICANT[0].PROPOSALAPPLICANTMAIN.APPLICANTID;
        var applicantname = response.ResultSet.PROPOSALAPPLICANT[0].PROPOSALAPPLICANTMAIN.APPLICANTNME;
        this.ApplicantType = response.ResultSet.PROPOSALAPPLICANT[0].PROPOSALAPPLICANTMAIN.APPLICANTTYP;

        if (this.ApplicantType) {
          if (this.ApplicantType === 'I') {
            this.showForI = true;
            this.hVisit = "Home Visit";
            this.oVisit = "Office Visit";
            this.distanceTo = "Distance to house";
            this.location = "House Location";
          }
          else if (this.ApplicantType === 'C') {
            this.showForI = false;
            this.hVisit = "Head Office";
            this.oVisit = "Branch";
            this.distanceTo = "Distance to office/factory";
            this.location = "Factory Location(if applicable)";
          }
        }

        var moId = response.ResultSet.PROPOSAL.MARKETINGOFFICERID;
        let obj = {} as IPRPL_FILD_VIST_APMTInfo;
        obj.APPLICANTNAME = applicantname;
        obj.FIELDAGENTID = moId;

        this.param.ApplicantId = applicantId;
        this.param.IsFromCap = true;

        //servicecall
        this._prplService.ReadFieldVisitbyProposalIdApplicantId(this.param).pipe(takeUntil(this.subscription$)).subscribe(res => {
          if (res.CODE === Number(ReturnCode.Success.Code) && res.ResultSet && res.ResultSet.APPOINTMENTID > 0) {
            if (res.ResultSet.FITIME !== null) {
              res.ResultSet.FITIME = String(new Date(res.ResultSet.FITIME).getUTCHours());
            }
            this.ProposalFieldEntity.patchValue(res.ResultSet);
            this.ProposalFieldEntity.controls.RowState.setValue(DataRowState.Updated);
          }
          else {
            this.ProposalFieldEntity.patchValue(obj);
          }
          this.readProposal();
        });

        // combobox binding
        // this._fieldVistFeedbackMasterDataService.getmasterDataForFieldVisit(response.ResultSet.PROPOSAL.BPCOMPANYBRANCHID).pipe(takeUntil(this.subscription$)).subscribe(a => {
        //   this._fieldVistFeedbackMasterDataService.InitializeMasterDataForFieldVisit(a);
          this.FiRating = this._fieldVistFeedbackMasterDataService.FiRating;
          // this.FieldInvestigator = this._fieldVistFeedbackMasterDataService.FieldInvestigator;
          this.MeetWith = this._fieldVistFeedbackMasterDataService.MeetWith;
          this.OfficeLocation = this._fieldVistFeedbackMasterDataService.OfficeLocation;
          this.SocialInteraction = this._fieldVistFeedbackMasterDataService.SocialInteraction;
        // })
      }
    })


  }

  SaveFieldVisitFeedback() {
    this.saveBtnEnable = false;

    let info: IPRPL_FILD_VIST_APMTInfo = this.ProposalFieldEntity.value as IPRPL_FILD_VIST_APMTInfo;
    info.APPLICANTID = this.param.ApplicantId;
    info.PROPOSALID = this.param.ProposalId;
    info.ISFROMCAP = this.param.IsFromCap;


    var dt = new Date(info.FIPLANDTE);
    dt.setUTCHours(Number(info.FITIME), 0, 0, 0);
    info.FITIME = dt as Control<Date>;

    this._prplService.SaveProposalFieldVisit(info).pipe(takeUntil(this.subscription$)).subscribe(response => {
      if (response.CODE === Number(ReturnCode.Success.Code) && response.ResultSet) {
        response.ResultSet.RowState = DataRowState.Updated;
        this._messageService.showMesssage("msgFieldVisitSubmitted", MessageType.Success);
      }
      else {
        this._messageService.showMesssage("msgFieldVisitSubmittedError", MessageType.Warning);
      }
    })

    this.saveBtnEnable = true;
  }

  ngOnDestroy() {
    this.subscription$.next(true);
    this.subscription$.complete();
  }
  isOtherVisit() {
    this.isOtherDisabled = !this.isOtherDisabled;
  }
  isCompleted() {
    if (this.ProposalFieldEntity.value.FLDVISITCMPLTD === true) {
      this.ProposalFieldEntity.controls.FICOMPLETIONDTE.setValue(this.storageService.GetUserInfo().ProcessingDate);
    }
    else {
      this.ProposalFieldEntity.controls.FICOMPLETIONDTE.setValue(new Date(''));
    }
  }
  get gethVisit():string{
    return this.hVisit.toString();
  }
  get getoVisit():string{
    return this.oVisit.toString();
  }


  readProposal() {
    let prms = {} as IPRPLQUInfo;
    prms.PROPOSALID = this.param.ProposalId;
    this._prplService.ReadProposal(prms).pipe(takeUntil(this.subscription$)).subscribe(response => {
      let prpl: IProposalEntity = response.ResultSet as IProposalEntity;
      let applicant = prpl.PROPOSALAPPLICANT.filter(x => x.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower)[0]
      if(applicant) {
        this.ProposalFieldEntity.controls.APPLICANTID.setValue(applicant.PROPOSALAPPLICANT.APPLICANTID);
        this.ProposalFieldEntity.controls.APPLICANTNAME.setValue(applicant.PROPOSALAPPLICANT.APPLICANTNME);
      }
    });
  }
  

}
