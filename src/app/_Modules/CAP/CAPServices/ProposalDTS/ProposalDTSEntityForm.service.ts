import { Injectable } from '@angular/core';
import { IProposalDTSEntity, IPRPL_DTS_HEDRInfo, IPRPL_DOCTInfo, IPRPL_DTSInfo, IPRPL_DTS_DOCTInfo, IMPOS_APLT_DCMTInfo } from "@NFS_Entity/ProposalDTS-Entity/IProposalDTSEntity.model.index";
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FormBuilder, FormControl, FormGroup, Validators } from 'src/Library';

@Injectable({
  providedIn: 'root'
})
export class ProposalDTSEntityFormService {

  constructor(private _formBuilder: FormBuilder) { }

  public ProposalDTSEntity(): FormGroup<IProposalDTSEntity> {
    return this._formBuilder.group<IProposalDTSEntity>({

      PROPOSALDTSHEADER: this.ProposalDTSHEDRInfoForm() as FormGroup<IPRPL_DTS_HEDRInfo>,
      PROPOSALDOCUMENTS: this._formBuilder.array<IPRPL_DOCTInfo>([]),
      PROPOSALDTS: this.ProposalDTSInfoForm() as FormGroup<IPRPL_DTSInfo>,
      PROPOSALDTSDOCUMENTS: this._formBuilder.array<IPRPL_DTS_DOCTInfo>([]),
      ISBULKOPR: false,
      MPOSDOCUMENTS: this._formBuilder.array<IMPOS_APLT_DCMTInfo>([]),
      RowState: DataRowState.Added,
      ISAUDITABLE: false,
    });

  }

  public ProposalDTSHEDRInfoForm(): FormGroup<IPRPL_DTS_HEDRInfo> {
    return this._formBuilder.group<IPRPL_DTS_HEDRInfo>({
      PROPOSALID: 0,
      PROPOSALNBR: '',
      PROPOSALDTE: new Date(Date.now()),
      APPLICANTNME: '',
      APPLICANTID: 0,
      PROPOSALTYPE: '',
      PROPOSALSTATUS: '',
      OBTAINEDSCORE:0,
      RENTALMODE: '',
      INTRODUCER: '',
      BRANCH: '',
      ASSETTYPE: '',
      FPGROUP: '',
      FPTYPE: '',
      DTSMODELNME: '',
      ROLECODE: '',
      APPLICANTTYPE: '',
      PROPOSALSTATUSCODE: '',
      // following properties are from helper class,
      PROPOSALDTE_Helper:new Date(Date.now()),
      ROLEDSC: '',
      COMMENTS: '',
      QUESTIONRECMPLTD: false,
      FINANCIALTYPE: '',
      RENTALAMT:0,
      RDP:0,
      INSURER:'',
      MVOCOMMENTS:'',
      APCENTERCOMMENTS:'',
      FICOMMENTS:'',
      APPLIEDCUSTOMERRTE:0,
      ADJUSTEDFINANCEDAMT:0,
      CONTRACTTRM:0,
      ASSETMAKEDSC:'',
      ASSETBRANDDSC:'',
      ASSETMODELDSC:'',
      RowState: DataRowState.Added,
      ISAUDITABLE: false,
    });
  }

  public ProposalDTSInfoForm(): FormGroup<IPRPL_DTSInfo> {
    return this._formBuilder.group<IPRPL_DTSInfo>({
      PROPOSALID: 0,
      MODELCDE: '',
      COMPLETIONDTE: new Date(Date.now()),
      COMPLETIONIND: false,
      COMMENTS: '',
      EXECUTIONDTE: new Date(Date.now()),
      EXECUTIONOFFSET: 0,
      SESSIONID: 0,
      SESSIONCDE: '',
      RowState: DataRowState.Added,
      ISAUDITABLE: false,
    });
  }

  public ProposalDocumentsInfoForm(): FormGroup<IPRPL_DOCTInfo> {
    return this._formBuilder.group<IPRPL_DOCTInfo>({
      PROPOSALID: 0,
      DOCUMENTID: 0,
      SEQID: 0,
      DOCUMENTNME: '',
      DOCUMENTDTE: new Date(Date.now()),
      REQUIREDFORCDE: '',
      FILETYP: '',
      FILENMEEXT: '',
      FILESIZE: '',
      FILECOMMENTS: '',
      FILENME: '',
      ISREFERENCED: false,
      ISCOMPRESSED: false,
      ISENCRYPTED: false,
      EXECUTIONDTE: new Date(Date.now()),
      EXECUTIONOFFSET: 0,
      SESSIONID: 0,
      SESSIONCDE: '',
      APPLICANTID: 0,
      USERNME: '',
      //following properties are from helper class
      DOCUMENTCDE: '',
      //FILENME: '',    
      BtnDeleteEnable: false,
      RowState: DataRowState.Added,
      ISAUDITABLE: false,
      ismPOS:false,
      fileTypeIndex:0,
    });
  }

  public ProposalDTSDocumentsInfoForm(): FormGroup<IPRPL_DTS_DOCTInfo> {
    return this._formBuilder.group<IPRPL_DTS_DOCTInfo>({
      PROPOSALID: 0,
      DOCUMENTID: 0,
      GROUPCDE: '',
      DOCUMENTCDE: '',
      MANDATORYIND: false,
      REQUIREDFORCDE: '',
      CHECKEDBYCAA: false,
      CHECKEDBYCA: false,
      VERIFIED: false,
      COMMENTS: '',
      INSERTEDBY: '',
      INSERTEDDTE: new Date(Date.now()),
      WAIVEDBY: '',
      GROUPNAME:'',
      WAIVEDDTE: new Date(Date.now()),
      REQUIREDNBR: 0,
      IDENTIFICATIONCDE: 0,
      WAIVEDIND: false,
      VALIDATIONIND: false,
      DOCUMENTSUBDSC:'',
      EXECUTIONDTE: new Date(Date.now()),
      EXECUTIONOFFSET: 0,
      SESSIONID: 0,
      SESSIONCDE: '',
      //following proporties are from helper class
      GROUPDSC: '',
      DOCUMENTDSC: '',
      APPLICANTNME: '',
      APPLICANTID: 0,
      // APPLICANTS: this._formBuilder.array<Number>([this.co]),
      ROLECDE: '',
      REVISEDIND: false,
      ROLEDEC: '',
      MAXFILESIZE: '',
      ISENABLED: false,
      TOTALROWS: 0,
      RowState: DataRowState.Added,
      ISAUDITABLE: false,
    });
  }

  public MPOSDocumentsInfoForm(): FormGroup<IMPOS_APLT_DCMTInfo> {
    return this._formBuilder.group<IMPOS_APLT_DCMTInfo>({
      DOCUMENTSEQID: 0,
      PROPOSALID: 0,
      APPLICANTID: 0,
      ROLECDE: '',
      DOCUMENTCDE: '',
      CREATIONDTE: new Date(Date.now()),
      DOCUMENTTYPE: '',
      LONGITUDE: 0,
      LATITUDE: 0,
      DOCUMENTNAME: '',
      IMAGETYPE: '',
      DOCUMENTPATH: '',
      ISMANDATORY: false,
      TIMESTAMP: new Date(Date.now()),
      EXECUTIONDTE: new Date(Date.now()),
      EXECUTIONOFFSET: 0,
      SESSIONID: 0,
      SESSIONCDE: '',
      RowState: DataRowState.Added,
      ISAUDITABLE: false,
      ismPOS:true,
      CNTCT_ADDRESS:''
    });
  }
}
