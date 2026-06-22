import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';
import { ControlsecurityService } from '@NFS_Core/NFSServices/ControlSecurity/controlsecurity.service';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { MasterDataCollection } from '@NFS_Core/NFSServices/MasterData/MasterdataHelper/MasterDataCollection';
import { mPOSMasterDataRequest } from '@NFS_Core/NFSServices/MasterData/MasterdataHelper/mPOSMasterDataRequest';
import { MasterData } from '@NFS_Enums/MasterData.enum';
import { IControlSecurity } from '@NFS_Interfaces/OtherInterfaces/icontrol-security';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { forkJoin, Observable, of, ReplaySubject } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApplicantDropdownResolver  {
  collection: MasterDataCollection = new MasterDataCollection();
  list: Array<INFSDropDownData> = [];

  subject = new ReplaySubject<Array<Array<INFSDropDownData>>>();
  
  constructor(private _masterDataService: MasterDataService, private _appConfig: AppConfigService , private _controlsecurityService: ControlsecurityService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<Array<INFSDropDownData>>> {
    if (!this._masterDataService.isApplicantDataRequested) {
      this._masterDataService.isApplicantDataRequested = true;

      forkJoin([
        this._masterDataService.GetAllApplicantMasterData(), //0
        // this._masterDataService.GetMasterData(this.getRequestObject(MasterData.AllCompanies)),
        // this._masterDataService.GetMasterData(this.getRequestObject(MasterData.CurrencyType)),
        // this._masterDataService.GetMasterData(this.getRequestObject(MasterData.ApplicantCodeType)),
        // this._masterDataService.GetMasterData(this.getRequestObject(MasterData.ApplicantCategoryCode)),
        // this._masterDataService.GetMasterData(this.getRequestObject(MasterData.ApplicationTypeCode)),
        // this._masterDataService.GetMasterData(this.getRequestObject(MasterData.IdType)),
        this._masterDataService.GetMasterData(this.getRequestObject(MasterData.Branches)), //1
        // this._masterDataService.GetMasterData(this.getRequestObject(MasterData.TitleCode)),
        // this._masterDataService.GetMasterData(this.getRequestObject(MasterData.DebtorCategoryCode)),
        // this._masterDataService.GetMasterData(this.getRequestObject(MasterData.Nationality)),
        // this._masterDataService.GetMasterData(this.getRequestObject(MasterData.GenderCode)),
        // this._masterDataService.GetMasterData(this.getRequestObject(MasterData.EducationDegreeStatus)),
        // this._masterDataService.GetMasterData(this.getRequestObject(MasterData.Religion)),
        // this._masterDataService.GetMasterData(this.getRequestObject(MasterData.CreditRating)),
        // this._masterDataService.GetMasterData(this.getRequestObject(MasterData.Citizenship)),
        // this._masterDataService.GetMasterData(this.getRequestObject(MasterData.CountryDomicile)),
        // this._masterDataService.GetMasterData(this.getRequestObject(MasterData.TitleSuffix)),
        // this._masterDataService.GetMasterData(this.getRequestObject(MasterData.MaritalStatus)),
        // this._masterDataService.GetMasterData(this.getRequestObject(MasterData.Occupations)),
        // this._masterDataService.GetMasterData(this.getRequestObject(MasterData.ReferenceType)),
        // this._masterDataService.GetMasterData(this.getRequestObject(MasterData.ReferenceBusinessType)),
        this._masterDataService.GetMasterData(this.getRequestObject(MasterData.FinancialProductGroupbyCompany)), //2
        // this._masterDataService.GetMasterData(this.getRequestObject(MasterData.RepresentativeType)),
        // this._masterDataService.GetMasterData(this.getRequestObject(MasterData.Signatory)),
        // this._masterDataService.GetMasterData(this.getRequestObject(MasterData.RelationshipTypeListByCompanyId)),
        // this._masterDataService.GetMasterData(this.getRequestObject(MasterData.ExtractFamilyExposureType)),
        // this._masterDataService.GetMasterData(this.getRequestObject(MasterData.OLReceiptingBank)),
        // this._masterDataService.GetMasterData(this.getRequestObject(MasterData.InvoiceOptionOL)),
        // this._masterDataService.GetMasterData(this.getRequestObject(MasterData.AccountingTypeOL)),
      //   this._masterDataService.GetMasterData(this.getRequestObject(MasterData.POSLocationCode)),
      //   this._masterDataService.GetMasterData(this.getRequestObject(MasterData.ApplicationSource)),
       ]).subscribe(nr => this.subject.next(nr));

      this._controlsecurityService.loadControlSecurity().subscribe(data=>{
        this._masterDataService.ControlSecurity=data;
      });
      this._controlsecurityService.loadControlEnable().subscribe(data=>{
        this._masterDataService.ControlDisablity=data;
      })
    }

    return this.subject.pipe(first(), map((response:any) => {
      return {
        AllCompanies: response[0].ResultSet?.SBDYBRCH, 
        CurrencyType: response[0].ResultSet?.CRCYTYPCDE,
        ApplicantCodeType: response[0].ResultSet?.PRPLTYPCDE,
        ApplicantCategoryCode: response[0].ResultSet?.APLTCTGYCDE,
        ApplicationTypeCode: response[0].ResultSet?.APLTTYPCDE,
        IdType: response[0].ResultSet?.IDTYPECODE ,
        Branches: response[1], 
        TitleCode: response[0].ResultSet?.TITLCODE, 
        DebtorCategoryCode: response[0].ResultSet?.DBTRCTGYCODE, 
        Nationality: response[0].ResultSet?.NATYCODE, 
        GenderCode: response[0].ResultSet?.GENRCODE,
        EducationDegreeStatus: response[0].ResultSet?.EDUNLOCNCODE, 
        Religion: response[0].ResultSet?.RLGNCODE, 
        CreditRating: response[0].ResultSet?.CRDTRTING, 
        Citizenship: response[0].ResultSet?.CITIZENSHIP, 
        CountryDomicile: response[0].ResultSet?.DOMICILE,
        TitleSuffix: response[0].ResultSet?.TITLESUFFIX, 
        MaritalStatus: response[0].ResultSet?.MRTLSTUSCODE, 
        Occupations: response[0].ResultSet?.OCPNCODE, 
        ReferenceType: response[0].ResultSet?.RFRNTYPE, 
        ReferenceBusinessType: response[0].ResultSet?.BSNSTYPECODE,
        FinancialProductGroupbyCompany: response[2], 
        RepresentativeType: response[0].ResultSet?.RPRSTYPECDE, 
        Signatory: response[0].ResultSet?.SIGNATORY, 
        RelationshipTypeListByCompanyId: response[0].ResultSet?.GRTRRLSPCODE,
        ExtractFamilyExposureType: response[0].ResultSet?.FMLYEXPRSRCHCRTA, 
        OLReceiptingBank: response[0].ResultSet?.RECEIPTINGBANK, 
        InvoiceOptionOL: response[0].ResultSet?.INVOICEOPTION,
        AccountingTypeOL: response[0].ResultSet?.ACCOUNTINGTYPE,
        POSLocationCode: response[0].ResultSet?.POSLOCATION,
        ApplicationSource: response[0].ResultSet?.APPLICATIONSOURCE,


        AssetCondition:response[0].ResultSet?.ASSETCONDITION,
        Relationships:response[0].ResultSet?.RLSPCODE,
      };
    }),
      catchError(error => of(error)));
  }

  getRequestObject(masterDataOperation: string): mPOSMasterDataRequest {
    var request = new mPOSMasterDataRequest()
    request.masterDataOperation = masterDataOperation;
    if (masterDataOperation === "getMarketingOfficerByBranch" || masterDataOperation === "getFinancialProductGroupbyCompany") {
      request.DATAS.companyId = 5;
    }
    return request;
  }

}
