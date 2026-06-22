
export interface IProposalInfoParm {
  ProposalId: number,
  IdCardNumber: string
  ApplicantId: number,
  StatusCode: string | null,
  USERID: number,
  IdCardTyp: string
  AppointmentId: number,
  ApplicantType: string | null,
  IDTYPENBR: string
  FinancialProductID: number,
  ApplicantName: string | null,
  SessionCode: string
  SessionId: number,
  ChangeRequestId: number,
  ModuleType: string
  RoleCode: string
  ToDate: Date,
  FromDate: Date,
  fromRecord: number,
  toRecord: number,
  extraQuery: string
  FirstName: string
  LastName: string
  FinanceType: string
  CountryId: number,
  PreviousYear: boolean,
  LegalStatusCde: string
  TableCde: string
  ChasisNbr: string
  EngineNbr: string
  OTOBPKBNumber: string
  IntroducerID: number,
  ContractID: number,
  RunningNumberType: string
  RunningNumber: string
  IsFromCap: boolean,
  ApprovedBy: string
  ApprovedDate: Date,
  Message: string
  FamilyMemberID: number,
  DealerAssociationCode: string
  ApplicantAlias: string
  isRequestValid: boolean,
  AssetTypeCode: string
  AssetSubTypeCode: string
  AssetCondition: string
  FamilyCardNo: string
  DateOfBirth: Date,
  FamilySearchCriteria: string
  PhoneNo: string
  RecipientName: string
  CommisionType: string
  DevisionType: string
  RecipientRole: string
  InsurancePremium: number,
  InsuranceCompanyId: number
  OTOInsuranceCommisionPct: number,
  OTOInsuranceCommision: number,
  commentsFormPOS: string
  CMO: number,
  BranchID: number,
  mPOSApplicationNumber: string
  proposalNumber: string | null
  IsMcomCampaign: boolean,
  FPGroupID: number,
  IsFromMPOS: boolean,
  OldContNumber: string
  borrowerid: number,
  AssetID: number,
  RevisionID: number,
  AssetSelectionCode: string
  ReLeaseNumber: number,
  RegisterID: number,
  PrevAssetID: number,
  IsMigrated: boolean,
  TaxIncExcl: string
  AssnTo: number,
  LoadBalancerEnabled: boolean,
  FwrdComment: string,
  ContractStartDate: Date,
  FrequencyCode: string,
  RentalDueDateCode: string,
  CANCELLATIONCOMMENT: string,
  modelType: string
  BPCOMPANYID: number,
  EApprovalInd: boolean,
  ASSETTYPECDE: string,
  ASSETSUBTYPECDE: string,
  AssgineeUserId: number,
  Action: string,
  BorrowerName: string,
  MVOUsersList: any,
  ContactAddress: string,
  ImgLat: number,
  ImgLng: number
}

export interface DateParam {
  "DateStart": any,
  "DateEnd": any
}
