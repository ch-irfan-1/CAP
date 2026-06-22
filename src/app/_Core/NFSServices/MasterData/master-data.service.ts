import { Injectable } from '@angular/core';
import { IControlSecurity } from '@NFS_Interfaces/OtherInterfaces/icontrol-security';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { IBusinessPartnerInfoParm } from '@NFS_Interfaces/RequestInterfaces/BusinessPartnerInfoParm';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommunicationBaseService } from '../Communication/communication-base.service';
import { SERVICE_URL } from '../_helper/api-url';
import { mPOSMasterDataRequest } from './MasterdataHelper/mPOSMasterDataRequest';

@Injectable({
  providedIn: 'root'
})

export class MasterDataService {
  public ApplicantTypeSetup: INFSDropDownData[] = [];
  public ApplicantIdTypesSetup: INFSDropDownData[] = [];
  public AddressStatusesSetup: INFSDropDownData[] = [];
  public ResidenceTypeSetup: INFSDropDownData[] = [];
  public LocationTypeSetup: INFSDropDownData[] = [];
  public HousingOwnerShipTypeSetup: INFSDropDownData[] = [];
  public AllProvinceData: INFSDropDownData[] = [];
  public AllKotaByProvince: any = []; // not using INFSDropDownData - use array to show multitab addresses
  public AllKecamatanByKota: any = [];
  public AllKelurahanByKeca: any = [];
  public AddressTypeSetup: INFSDropDownData[] = [];
  public AllDefaultAddresses: INFSDropDownData[] = [];
  public AllBranches: INFSDropDownData[] = [];
  public AllDealerByBranch: INFSDropDownData[] = [];
  public AllFpGroups: INFSDropDownData[] = [];
  public AllFpCampigns: INFSDropDownData[] = [];
  public AllPhoneTypes: INFSDropDownData[] = [];
  public RejectionReasonSetup: INFSDropDownData[] = [];
  public AllEmergencyContactRelationTypes: INFSDropDownData[] = [];
  public DocumentTypes: INFSDropDownData[] = [];
  public LocationDetails: INFSDropDownData[] = [];
  public CancellationTypes: INFSDropDownData[] = [];
  public VOList: INFSDropDownData[] = [];
  public MVOList: INFSDropDownData[] = [];
  public List: INFSDropDownData[] = [];
  public MaritalStatusTypes: INFSDropDownData[] = [];
  public AssetConditionTypes: INFSDropDownData[] = [];
  public AssetUsageTypes: INFSDropDownData[] = [];
  public AssetMakeTypes: INFSDropDownData[] = [];
  public OccupationsTypes: INFSDropDownData[] = [];
  public CreditApprovalTypes: INFSDropDownData[] = [];
  public Relationships: INFSDropDownData[]=[];
  public AllCompanies: INFSDropDownData[] = [];
  public CurrencyType: INFSDropDownData[] = [];
  public ApplicantCodeType: INFSDropDownData[] = [];
  public ApplicantCategoryCode: INFSDropDownData[] = [];
  public MarketingOfficerByBranch: any = [];
  public TitleCode: INFSDropDownData[] = [];
  public DebtorCategoryCode: INFSDropDownData[] = [];
  public Nationality: INFSDropDownData[] = [];
  public GenderCode: INFSDropDownData[] = [];
  public EducationDegreeStatus: INFSDropDownData[] = [];
  public Religion: INFSDropDownData[] = [];
  public CreditRating: INFSDropDownData[] = [];
  public Citizenship: INFSDropDownData[] = [];
  public CountryDomicile: INFSDropDownData[] = [];
  public TitleSuffix: INFSDropDownData[] = [];
  public CrditPurpose: INFSDropDownData[] = [];
  public TransmissionType: INFSDropDownData[] = [];
  public AssetModelColour: INFSDropDownData[] = [];
  public VehicleStyle: INFSDropDownData[] = [];
  public AllKotamadya: INFSDropDownData[] = [];
  public OperatorVehicle: INFSDropDownData[] = [];
  public UsageArea: INFSDropDownData[] = [];
  public GoodsServicesFunds: INFSDropDownData[] = [];
  public ReferenceType: INFSDropDownData[] = [];
  public ReferenceBusinessType: INFSDropDownData[] = [];
  public FinancialProductGroupbyCompany: INFSDropDownData[] = [];
  public DealerByBranch: INFSDropDownData[] = [];
  public RepresentativeType: INFSDropDownData[] = [];
  public Signatory: INFSDropDownData[] = [];
  public FamilySearchCriteria: INFSDropDownData[] = [];
  public OLReceiptingBank: INFSDropDownData[] = [];
  public CashFlowIdentifier: any = [];
  public POSLocationCode:any=[];
  public InvoiceOptionOL: INFSDropDownData[] = [];
  public AccountingTypeOL: INFSDropDownData[] = [];
  public RepresentativeSetup: INFSDropDownData[] = [];
  public ControlSecurity: Array<IControlSecurity> = [];
  public ControlDisablity: Array<IControlSecurity> = [];
  public AssetBrandTypes: INFSDropDownData[] = [];
  public AssetModelTypes: INFSDropDownData[] = [];
  public MarketingOfficeSubject = new Subject();
  public ApplicationSource:INFSDropDownData[]=[];
   public SalesmanByDealer: INFSDropDownData[] = [];
  request!: mPOSMasterDataRequest;

  isDataRequested = false;
  isApplicantDataRequested = false;
  isGeneralheaderDataRequested = false;
  isAssetDataRequested = false;
  isWorkQueueDataRequested = false;

  constructor(private _ApiComm: CommunicationBaseService) { }

  GetMasterData(request: mPOSMasterDataRequest): Observable<any> {
    try {
      let RequestBody: any = request;
      return this._ApiComm.APIRequest(SERVICE_URL.masterDataUrl, RequestBody).pipe(
        map((response) => {
          if (response) {
            return response;
          }
          else {
            return null;
          }
        })
      );
    }
    catch (e) {
      console.log("Error Occured while TryLogin in Authentication service => ", e);
      return of(false);
    }
  }

  GetProposalQueueMasterData(request: IBusinessPartnerInfoParm): Observable<any> {
    try {
      let RequestBody: any = request;
      return this._ApiComm.APIRequest(SERVICE_URL.proposalQueueMasterDataUrl, RequestBody).pipe(
        map((response) => {
          if (response) {
            return response;
          }
          else {
            return null;
          }
        })
      );
    }
    catch (e) {
      console.log("Error Occured while TryLogin in Authentication service => ", e);
      return of(false);
    }
  }

  GetProposalQueueUsersMasterData(): Observable<any> {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.proposalQueueUsersMasterDataUrl, null).pipe(
        map((response) => {
          if (response) {
            return response;
          }
          else {
            return null;
          }
        })
      );
    }
    catch (e) {
      console.log("Error Occured while TryLogin in Authentication service => ", e);
      return of(false);
    }
  }

  GetAllApplicantMasterData(){
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.allApplicantMasterData, null).pipe(
        map((response) => {
          if (response) {
            return response;
          }
          else {
            return null;
          }
        })
      );
    }
    catch (e) {
      console.log("Error Occured while getting all applicant lookup => ", e);
      return of(false);
    }
  }
  InitializeMasterData(data: any) {
    //--- iOPS data mapping ---//
    this.ApplicantTypeSetup = data?.ApplicationTypeCode?.DataCollection;
    this.AddressStatusesSetup = data?.AddressStatus?.ResultSet?.DataCollection;
    this.AddressTypeSetup = data?.AddressTypeList?.ResultSet?.DataCollection;
    this.AllProvinceData = data?.AllProvincesByCountryId?.ResultSet?.DataCollection;
    //this.ApplicantTypeSetup = data?.ApplicationTypeCode?.dataCollection;
    this.AllBranches = data?.Branches?.ResultSet?.DataCollection;
    this.ApplicationSource=data?.ApplicationSource?.DataCollection;
    this.DocumentTypes = data?.DocumentListByCompanyId?.ResultSet?.DataCollection;
    this.HousingOwnerShipTypeSetup = data?.HousingOwnership?.ResultSet?.DataCollection;
    this.ApplicantIdTypesSetup = data?.IdType?.DataCollection;
    this.AllPhoneTypes = data?.PhoneTypeListByCompanyId?.ResultSet?.DataCollection;
    this.AllEmergencyContactRelationTypes = data?.RelationshipTypeListByCompanyId?.DataCollection;
    this.Relationships=data?.Relationships?.DataCollection;
    this.ResidenceTypeSetup = data?.ResidenceType?.ResultSet?.DataCollection;
    this.LocationDetails = data?.LocationDetails?.ResultSet?.DataCollection;
    this.MaritalStatusTypes = data?.MaritalStatus?.DataCollection;
    this.AssetConditionTypes = data?.AssetCondition?.DataCollection;
    this.AssetUsageTypes = data?.AssetUsage?.ResultSet?.DataCollection;
    this.AssetMakeTypes = data?.AssetMake?.ResultSet?.DataCollection;
    this.OccupationsTypes = data?.Occupations?.DataCollection;
    //this.CreditApprovalTypes = data?.CreditApprovalType?.ResultSet?.DataCollection;

    //--- General header data mapping ---//
    this.AllCompanies = data?.AllCompanies?.DataCollection;
    this.CurrencyType = data?.CurrencyType?.DataCollection;
    this.ApplicantCodeType = data?.ApplicantCodeType?.DataCollection;
    this.ApplicantCategoryCode = data?.ApplicantCategoryCode?.DataCollection;
    //this.MarketingOfficerByBranch = data?.MarketingOfficerByBranch?.ResultSet?.DataCollection;
    this.FinancialProductGroupbyCompany = data?.FinancialProductGroupbyCompany?.ResultSet?.DataCollection;
    this.DealerByBranch = data?.DealerByBranch?.ResultSet?.DataCollection;
    this.OLReceiptingBank = data?.OLReceiptingBank?.DataCollection;

    //--- Applicant data mapping ---//
    this.TitleCode = data?.TitleCode?.DataCollection;
    this.DebtorCategoryCode = data?.DebtorCategoryCode?.DataCollection;
    this.Nationality = data?.Nationality?.DataCollection;
    this.GenderCode = data?.GenderCode?.DataCollection;
    this.EducationDegreeStatus = data?.EducationDegreeStatus?.DataCollection;
    this.Religion = data?.Religion?.DataCollection;
    this.CreditRating = data?.CreditRating?.DataCollection;
    this.Citizenship = data?.Citizenship?.DataCollection;
    this.CountryDomicile = data?.CountryDomicile?.DataCollection;
    this.TitleSuffix = data?.TitleSuffix?.DataCollection;

    //--- Asset data mapping ---//
    this.CrditPurpose = data?.CrditPurpose?.ResultSet?.DataCollection;
    this.TransmissionType = data?.TransmissionType?.ResultSet?.DataCollection;
    this.AssetModelColour = data?.AssetModelColour?.ResultSet?.DataCollection;
    this.VehicleStyle = data?.VehicleStyle?.ResultSet?.DataCollection;
    this.AllKotamadya = data?.AllKotamadya?.ResultSet?.DataCollection;
    this.OperatorVehicle = data?.OperatorVehicle?.ResultSet?.DataCollection;
    this.UsageArea = data?.UsageArea?.ResultSet?.DataCollection;
    this.GoodsServicesFunds = data?.GoodsServicesFunds?.ResultSet?.DataCollection;
    this.ReferenceType = data?.ReferenceType?.DataCollection;
    this.ReferenceBusinessType = data?.ReferenceBusinessType?.DataCollection;
    this.RepresentativeType = data?.RepresentativeType?.DataCollection;
    this.Signatory = data?.Signatory?.DataCollection;
    this.FamilySearchCriteria = data?.ExtractFamilyExposureType?.DataCollection;
    this.InvoiceOptionOL = data?.InvoiceOptionOL?.DataCollection;
    this.AccountingTypeOL = data?.AccountingTypeOL?.DataCollection;
    this.POSLocationCode= data?.POSLocationCode?.DataCollection;
    this.SalesmanByDealer = data?.SalesmanByDealer?.DataCollection;
  }

}
