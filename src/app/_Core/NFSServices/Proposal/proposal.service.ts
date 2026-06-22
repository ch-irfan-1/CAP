import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAssetInfoParams } from '@NFS_Interfaces/RequestInterfaces/asset-search-info-params';
import { IBusinessPartnerInfoParm } from '@NFS_Interfaces/RequestInterfaces/BusinessPartnerInfoParm'; import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { ITAXParam } from '@NFS_Interfaces/RequestInterfaces/ITaxParam';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommunicationBaseService } from '../Communication/communication-base.service';
import { SERVICE_URL } from '../_helper/api-url';

@Injectable({
  providedIn: 'root'
})
export class ProposalService {
  private assetValidationDataSource = new BehaviorSubject<any>(null);
  assetValidationData$ = this.assetValidationDataSource.asObservable();

  constructor(private _ApiComm: CommunicationBaseService) { }

  getAndsetassetValidationData(data: any) {
    if(data == null)
      this.assetValidationDataSource.next(null);
    else
      this.assetValidationDataSource.next(!data);
  }

  SearchDealer(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadDealerWithAddress, request).pipe(
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
      console.log("Error Occured while loading existing applicant data=> ", e);
      return of(false);
    }
  }

  FPCampaign(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadAllFinancialProductByIntroducer, request).pipe(
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
      console.log("Error Occured while loading existing applicant data=> ", e);
      return of(false);
    }
  }

  ReadResurveyHistoryByProposalId(request: any){
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadResurveyHistoryByProposalId, request).pipe(
        map((response) => {
          if (response) {
            return response
          } else {
            return null
          }
        }))
    }
    catch (e) {
      console.log("An Error Occured while retreiving Resurvey history =>", e);
      return of(false);
    }
  }

  SearchPOSExposure(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.SearchPOSExposure, request).pipe(
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
      console.log("Error Occured while loading Applicant Exposure=> ", e);
      return of(false);
    }
  }

  SearchCMSExposure(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.SearchCMSExposure, request).pipe(
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
      console.log("Error Occured while loading Applicant Exposure=> ", e);
      return of(false);
    }
  }

  LoadApplicantEntity(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadApplicantInfo, request).pipe(
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
      console.log("Error Occured while loading Applicant Exposure=> ", e);
      return of(false);
    }
  }
  SearchInternalBlacklistData(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.SearchInternalBlacklistData, request).pipe(
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
      console.log("Error Occured while loading Applicant Exposure=> ", e);
      return of(false);
    }
  }


  ReadConfigurationTemplate(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadConfigurationTemplate, request).pipe(
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
      console.log("Error Occured while loading existing applicant data=> ", e);
      return of(false);
    }
  }

  SaveProposal(request: any): Observable<any> {
    try {

      let RequestBody: any = {
        "proposal": request
      };
      return this._ApiComm.APIRequest(SERVICE_URL.SaveProposal, request).pipe(
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
      console.log("Error Occured while saving Lead => ", e);
      return of(false);
    }

  }

  SubmitProposal(request: any): Observable<any> {
    try {

      let RequestBody: any = {
        "proposal": request
      };
      return this._ApiComm.APIRequest(SERVICE_URL.SubmitProposal, request).pipe(
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
      console.log("Error Occured while saving Lead => ", e);
      return of(false);
    }

  }

  SearchBlacklistData(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.SearchBlacklistData, request).pipe(
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
      console.log("Error Occured while loading Applicant Exposure=> ", e);
      return of(false);
    }
  }

  SearchInternalBlacklistDataSolo(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.SearchInternalBlacklistDataSolo, request).pipe(
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
      console.log("Error Occured while loading Applicant Exposure=> ", e);
      return of(false);
    }
  }

  SearchOJKBadCustomers(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.SearchOJKBadCustomers, request).pipe(
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
      console.log("Error Occured while loading Applicant Exposure=> ", e);
      return of(false);
    }
  }
  ReadExistingBPandApplicant(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadExistingBPandApplicant, request).pipe(
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
      console.log("Error Occured while loading Applicant Exposure=> ", e);
      return of(false);
    }
  }

  ReadExistingBPCompany(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadExistingBPCompany, request).pipe(
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
      console.log("Error Occured while loading Applicant Exposure=> ", e);
      return of(false);
    }
  }

  ReadExistingFamilyExposure(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadExistingFamilyExposure, request).pipe(
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
      console.log("Error Occured while loading Family Exposure=> ", e);
      return of(false);
    }
  }

    ReadIncomeAnalysisDetailByProposalId(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadIncomeAnalysisDetailByProposalId, request).pipe(
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
      console.log("Error Occured while loading Income Analysis=> ", e);
      return of(false);
    }
  }

  ReadFamilyPOSExposure(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadFamilyPOSExposure, request).pipe(
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
      console.log("Error Occured while loading Family Exposure=> ", e);
      return of(false);
    }
  }

  ReadFamilyExposure(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadFamilyExposure, request).pipe(
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
      console.log("Error Occured while loading Family Exposure=> ", e);
      return of(false);
    }
  }

  ReadFamilyBlaklistExposure(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadFamilyBlaklistExposure, request).pipe(
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
      console.log("Error Occured while loading Family Exposure=> ", e);
      return of(false);
    }
  }

  ReadFamilyCMSExposure(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadFamilyCMSExposure, request).pipe(
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
      console.log("Error Occured while loading Family Exposure=> ", e);
      return of(false);
    }
  }




  ReadCommissionConfiguration(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadCommissionConfiguration, request).pipe(
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
      console.log("Error Occured while loading existing applicant data=> ", e);
      return of(false);
    }
  }
  LoadExistingApplicantInfo(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadExistingBPandApplicant, request).pipe(
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
      console.log("Error Occured while loading Applicant Exposure=> ", e);
      return of(false);
    }
  }

  ReadDTSDocumentGroupByGroupCdeForMpos(){
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadDTSDocumentGroupByGroupCdeForMpos).pipe(
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
      console.log("Error Occured while Reading MPOS Documents=> ", e);
      return of(false);
    }
  }

  ReadMPOSDocumentsByProposalId(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadMPOSDocumentsByProposalId, request).pipe(
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
      console.log("Error Occured while Reading MPOS Documents=> ", e);
      return of(false);
    }
  }

  ReadProposalQueue(request: any): Observable<any> {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadProposalQueue, request).pipe(
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
      console.log("Error Occured while reading Proposal Queue => ", e);
      return of(false);
    }
  }

  ReadProposal(request: any): Observable<any> {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadProposal, request).pipe(
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
      console.log("Error Occured while reading Proposal => ", e);
      return of(false);
    }
  }


  ReadCashFlowIdentifier(request: any): Observable<any> {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadCashFlowIdentifier, request).pipe(
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
      console.log("Error Occured while reading Proposal => ", e);
      return of(false);
    }
  }

  ReadRentalModesFromTemplate(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadRentalModesTemplates, request).pipe(
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
      console.log("Error Occured while Reading Rental modes => ", e);
      return of(false);
    }
  }

  ReadFrequenciesFromTemplate(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadFrequenciesTemplates, request).pipe(
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
      console.log("Error Occured while Reading Frequencies => ", e);
      return of(false);
    }
  }

  GetAssociatedApplicationCharges(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.GetAssociatedApplicationCharges, request).pipe(
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
      console.log("Error Occured while Reading Frequencies => ", e);
      return of(false);
    }
  }

  SearchDealerSupplierSearch(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.DealerSupplierSearch, request).pipe(
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
      console.log("Error Occured while loading existing applicant data=> ", e);
      return of(false);
    }
  }

  ReadAssetModlTpleSeqID(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadAssetModlTpleSeqID, request).pipe(
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
      console.log("Error Occured while Reading Frequencies => ", e);
      return of(false);
    }
  }

  ReadAssetSearch(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadAssetSearch, request).pipe(
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
      console.log("Error Occured while Reading Asset Search => ", e);
      return of(false);
    }
  }

  ReadCustomAssetSearchByTemplateId(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadCustomAssetSearchByTemplateId, request).pipe(
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
      console.log("Error Occured while Reading Asset Search => ", e);
      return of(false);
    }
  }

  ReadExistingBP(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadExistingBP, request).pipe(
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
      console.log("Error Occured while Reading Existing BP => ", e);
      return of(false);
    }
  }

  ReadInventoryAssetSearch(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadInventoryAssetSearch, request).pipe(
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
      console.log("Error Occured while Reading Asset Search => ", e);
      return of(false);
    }
  }

  CalculateChargesTax(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.CalculateChargesTax, request).pipe(
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
      console.log("Error Occured while Calculating Charges Tax => ", e);
      return of(false);
    }
  }

  Calculate(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.Calculate, request).pipe(
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
      console.log("Error Occured while loading existing applicant data=> ", e);
      return of(false);
    }
  }

  GetIncomeConfiguration(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.IncomeConfiguration, request).pipe(
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
      console.log("Error Occured while Reading Frequencies => ", e);
      return of(false);
    }
  }
  GetVehicleLoadingRate(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.GetVehicleLoadingRate, request).pipe(
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
      console.log("Error Occured while Reading Vehicle Loading Rate => ", e);
      return of(false);
    }
  }

  GetBPKBExpectedOverdueDays(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.GetBPKBExpectedOverdueDays, request).pipe(
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
      console.log("Error Occured while Reading BPKBExpectedOverdueDays => ", e);
      return of(false);
    }
  }

  GetAssetModelColorLookup(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.GetAssetModelColorLookup, request).pipe(
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
      console.log("Error Occured while Reading AssetModel Color => ", e);
      return of(false);
    }
  }

  GetReimbursmentCostInd(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.GetReimbursmentCostInd, request).pipe(
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
      console.log("Error Occured while Reading ReImbursmentCostInd => ", e);
      return of(false);
    }
  }

  GetBPName(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.GetBPName, request).pipe(
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
      console.log("Error Occured while fetching BusinessPartner Name => ", e);
      return of(false);
    }
  }

  GetPaymentFrequency(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.PaymentFrequency, request).pipe(
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
      console.log("Error Occured while Reading Existing BP => ", e);
      return of(false);
    }
  }

  UpdateBaseRateChart(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.UpdateBaseRateChart, request).pipe(
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
      console.log("Error Occured while Reading Existing BP => ", e);
      return of(false);
    }
  }

  UpdateChartConfiguration(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.UpdateChartConfiguration, request).pipe(
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
      console.log("Error Occured while Reading Chart Configuration => ", e);
      return of(false);
    }
  }

  ReadCustomBPKBDetailOL(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadCustomBPKBDetailOL, request).pipe(
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
      console.log("Error Occured while Reading custom BPKB detail OL => ", e);
      return of(false);
    }
  }
  ReadCustomBPKBGurantorOL(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadCustomBPKBDetailOL, request).pipe(
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
      console.log("Error Occured while Reading custom BPKB gurantor OL => ", e);
      return of(false);
    }
  }
  ReadCustomBPKBReprDetailOL(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadCustomBPKBReprDetailOL, request).pipe(
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
      console.log("Error Occured while Reading custom BPKB representative OL => ", e);
      return of(false);
    }
  }
  ReadCustomVehicleDetailOL(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadCustomVehicleDetailOL, request).pipe(
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
      console.log("Error Occured while Reading custom BPKB representative OL => ", e);
      return of(false);
    }
  }
  ReadByRevisionIdAndAsetId(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadByRevisionIdAndAsetId, request).pipe(
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
      console.log("Error Occured while Reading custom BPKB representative OL => ", e);
      return of(false);
    }
  }
  SaveProposalInfo(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.SaveProposalInfo, request).pipe(
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
      console.log("Error Occured while saving proposal info => ", e);
      return of(false);
    }
  }
  ReadProposalInfo(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadProposalInfo, request).pipe(
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
      console.log("Error Occured while read proposal info => ", e);
      return of(false);
    }
  }

  ReadOverrideByUser() {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.GetOverrideByData).pipe(
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
      console.log("Error Occured while reading override By Users => ", e);
      return of(false);
    }
  }
  ReadProposalAssets(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadProposalAssets, request).pipe(
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
      console.log("Error Occured while read proposal asset => ", e);
      return of(false);
    }
  }
  UpdateAssetRegisterStatus(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.UpdateAssetRegisterStatus, request).pipe(
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
      console.log("Error Occured while Updating Asset Register Status => ", e);
      return of(false);
    }
  }
  isBPExistForBadCustomer(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.isBPExistForBadCustomer, request).pipe(
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
      console.log("Error Occured while getting bad customer => ", e);
      return of(false);
    }
  }
  SaveBPBlackListHistory(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.SaveBPBlackListHistory, request).pipe(
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
      console.log("Error Occured while getting bad customer => ", e);
      return of(false);
    }
  }
  ReadAndSavePRPL(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadAndSavePRPL, request).pipe(
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
      console.log("Error Occured while reading or saving proposal => ", e);
      return of(false);
    }
  }

  DealerSupplierSearch(request: any): Observable<any> {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.DealerSupplierSearch, request).pipe(
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
      console.log("Error Occured while Searching Supplier => ", e);
      return of(false);
    }
  }
  SubmitValidations(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.SubmitValidations, request).pipe(
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
      console.log("Error Occured while getting Submit Validation => ", e);
      return of(false);
    }
  }
  ValidateBPKBAlreadyExists(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ValidateBPKBAlreadyExists, request).pipe(
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
      console.log("Error Occured while validating BPKB Details => ", e);
      return of(false);
    }
  }

  ReviseProposal(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReviseProposal, request).pipe(
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
      console.log("Error Occured while Revising Proposal => ", e);
      return of(false);
    }
  }

  ReadProposalTaxConfigEntity(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadProposalTaxConfigEntity, request).pipe(
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
      console.log("Error Occured while Reading Proposal Tax Config Entity => ", e);
      return of(false);
    }
  }

  ReadTaxChargePayableITCCompAss(request: ITAXParam) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadTaxChargePayableITCCompAss, request).pipe(
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
      console.log("Error Occured while validating BPKB Details => ", e);
      return of(false);
    }
  }

  GetInsuranceCompanies() {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.GetInsuranceCompanies).pipe(
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
      console.log("Error Occured while Reading Existing BP => ", e);
      return of(false);
    }
  }

  GetBusinessRulesModelsByClassSpec(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.GetBusinessRulesModelsByClassSpec, request).pipe(
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
      console.log("Error Occured while Reading Existing BP => ", e);
      return of(false);
    }
  }

  ReadBusinessPartnerDepChart(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadBusinessPartnerDepChart, request).pipe(
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
      console.log("Error Occured while Reading Existing BP => ", e);
      return of(false);
    }
  }

  ReadBPInsuranceDetailForInsurance(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadBPInsuranceDetailForInsurance, request).pipe(
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
      console.log("Error Occured while Reading Existing BP => ", e);
      return of(false);
    }
  }


  GetPOSLocationByBranch(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.GetPOSLocationByBranch, request).pipe(
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
      console.log("Error Occured while Reading Existing BP => ", e);
      return of(false);
    }
  }


  ReadBPInsuranceDetail(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadBPInsuranceDetail, request).pipe(
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
      console.log("Error Occured while Reading Existing BP => ", e);
      return of(false);
    }
  }
  ReadDepreciationPolicy(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadDepreciationPolicy, request).pipe(
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
      console.log("Error Occured while Reading Existing BP => ", e);
      return of(false);
    }
  }
  ReadDepreciationChartDetail(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadDepreciationChartDetail, request).pipe(
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
      console.log("Error Occured while Reading Existing BP => ", e);
      return of(false);
    }
  }

  ReadAdminFeeChartFromFC(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadAdminFeeChartFromFC, request).pipe(
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
      console.log("Error Occured while Reading Admin Fee Chart Association => ", e);
      return of(false);
    }
  }


  ReadProvinceofCity(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadProvinceofCity, request).pipe(
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
      console.log("Error Occured while getting Insurance Region => ", e);
      return of(false);
    }
  }

  CalculateCommissionforScheme(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.CalculateCommissionforScheme, request).pipe(
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
      console.log("Error Occured while Reading Existing BP => ", e);
      return of(false);
    }
  }

  CalculateCommission(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.CalculateCommission, request).pipe(
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
      console.log("Error Occured while Reading Existing BP => ", e);
      return of(false);
    }
  }

  PerformPointScoring(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.PerformPointRescoring, request).pipe(
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
      console.log("Error Occured while Performing Point Scoring => ", e);
      return of(false);
    }
  }

  ReadFieldVisitbyProposalIdApplicantId(request: any){
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadFieldVisitbyProposalIdApplicantId,request).pipe(
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
      console.log("Error Occured while Performing Point Scoring => ", e);
      return of(false);
    }
  }

  SaveProposalFieldVisit(request: any){
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.SaveProposalFieldVisit,request).pipe(
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
      console.log("Error Occured whileSaving proposal Field Visit Feedback => ", e);
      return of(false);
    }
  }

  GetPointScoreCategoryCodes(){
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.GetPointScoreCategoryCodes).pipe(
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
      console.log("Error Occured while point scoring => ", e);
      return of(false);
    }
  }

  ReadPointScoreDetailCAPWrqus(request:any){
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadPointScoreDetailCAPWrqus,request).pipe(
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
      console.log("Error Occured while reading point scoring => ", e);
      return of(false);
    }
  }

  GetSubsidaryCompanyLookupByCompanyID() {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.GetSubsidaryCompanyLookupByCompanyID, {}).pipe(
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
      console.log("Error Occured while Getting Lookup Subsidiary Company => ", e);
      return of(false);
    }
  }

  GetCommissionMethodLookup() {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.GetCommissionMethodLookup, {}).pipe(
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
      console.log("Error Occured while Getting Lookup Commission Method => ", e);
      return of(false);
    }
  }

  PopulateCalculatedData(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.PopulateCalculatedData, request).pipe(
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
      console.log("Error Occured while Populating Calculated Data for Insurance Detail => ", e);
      return of(false);
    }
  }

  CalculateReceivableTax(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.CalculateReceivableTax, request).pipe(
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
      console.log("Error Occured while Calculating Receiveable Tax by Charge => ", e);
      return of(false);
    }
  }

  CalculateTaxByRecipients(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.CalculateTaxByRecipients, request).pipe(
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
      console.log("Error Occured while Calculating Tax by Recepients => ", e);
      return of(false);
    }
  }

  ReadEaglePointScoreDetailCAPWrqu(request:any){
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadEaglePointScoreDetailCAPWrqu, request).pipe(
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
      console.log("Error Occured while Calculating Tax by Recepients => ", e);
      return of(false);
    }
  }

  SubmitChangeRequest(request:any){
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.SubmitChangeRequest, request).pipe(
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
      console.log("Error Occured while Submitting Change Request ", e);
      return of(false);
    }
  }

  SubmitWithdrawRequest(request:any){
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.SubmitWithdrawRequest, request).pipe(
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
      console.log("Error Occured while Submitting Withdraw Request ", e);
      return of(false);
    }
  }
  CheckWithdrawlAndChangeRequestStatus(request:any){
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.CheckWithdrawlAndChangeRequestStatus, request).pipe(
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
      console.log("Error Occured while Checking withdrawal and change Request status", e);
      return of(false);
    }
  }

  GetAccountByRecipientID(request:any){
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.GetAccountByRecipientID, request).pipe(
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
      console.log("Error Occured while retreiving recepient account information => ", e);
      return of(false);
    }
  }
  dummyAPi(){
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.dummyAPi).pipe(
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
      console.log("Error Occured while retreiving recepient account information => ", e);
      return of(false);
    }
  }

  GetControlChangeRequest(request:any){
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.GetControlChangeRequest, request).pipe(
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
      console.log("Error Occured while Control change request => ", e);
      return of(false);
    }
  }

  CalculateTaxByComponent(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.CalculateTaxByComponent, request).pipe(
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
      console.log("Error Occured while Reading BPKBExpectedOverdueDays => ", e);
      return of(false);
    }
  }

  ReadProposalEApprovalEntity(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadProposalEApprovalEntity, request).pipe(
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
      console.log("Error Occured while Reading Proposal E-Approval Entity => ", e);
      return of(false);
    }
  }
  SaveProposalEApprovalEntity(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.SaveProposalEApprovalEntity, request).pipe(
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
      console.log("Error Occured while Saving Proposal E-Approval Entity => ", e);
      return of(false);
    }
  }
  ReadCustomerExposure(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadCustomerExposure, request).pipe(
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
      console.log("Error Occured while Reading customer exposure => ", e);
      return of(false);
    }
  }

  CalculateTOBAndMOB(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.CalculateTOBAndMOB, request).pipe(
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
      console.log("Error Occured while calculating TOB and MOB => ", e);
      return of(false);
    }
  }
  CalculateNMSIR(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.CalculateNMSIR, request).pipe(
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
      console.log("Error Occured while loading existing applicant data=> ", e);
      return of(false);
    }
  }

  ReadProposalBasicInfo(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadProposalBasicInfo, request).pipe(
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
      console.log("Error Occured while reading proposal basic info ", e);
      return of(false);
    }
  }
  ReadRejectionReasonByModule(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadRejectionReasonByModule, request).pipe(
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
      console.log("Error Occured while Read Rejection Reason By Module ", e);
      return of(false);
    }
  }
  
  UpdateApplicationAssignTo(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.UpdateApplicationAssignTo, request).pipe(
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
      console.log("Error Occured while Read Rejection Reason By Module ", e);
      return of(false);
    }
  }

  SaveProposalHistory(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.SaveProposalHistory, request).pipe(
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
      console.log("Error Occured while Save Proposal History", e);
      return of(false);
    }
  }

  ReadBMUserByBranchId(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadBMUserByBranchId, request).pipe(
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
      console.log("Error Occured while Read BM User By Branch Id", e);
      return of(false);
    }
  }
  
  GetDateDifference(request: any): Observable<any> {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.GetDateDifference, request).pipe(
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
      console.log("Error Occured while fetching Date Difference => ", e);
      return of(false);
    }
  }
  
  GetInsuranceCompanyBranch(request: any): Observable<any> {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.GetInsuranceCompanyBranch, request).pipe(
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
      console.log("Error Occured while fetching Insurance Company Branch => ", e);
      return of(false);
    }
  }

  ReadTopFinancialProducts(request: any){
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.mPOSReadTopFinancialProducts, request).pipe(
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
      console.log("Error Occured while Read BM User By Branch Id", e);
      return of(false);
    }
  }

  ReadTopSellingAssets(request: any){
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadTopSellingAssets, request).pipe(
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
      console.log("Error Occured while Read BM User By Branch Id", e);
      return of(false);
    }
  }

  CustomReadTeamHierarchy() {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.CustomReadTeamHierarchy).pipe(
        map((response) => {
          if (response) {
            return response.ResultSet;
          }
          else {
            return null;
          }

        })
      );

    }
    catch (e) {
      console.log("Error Occured while getting BP Subsidy data=> ", e);
      return of(false);
    }
  }
  
  CalculateRentalStructureCount(request: any){
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.CalculateRentalStructureCount, request).pipe(
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
      console.log("Error Occured while Read BM User By Branch Id", e);
      return of(false);
    }
  }
  
  CreateRentalStructure(request:any){
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.CreateRentalStructure,request).pipe(
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
      console.log("Error Occured while Creating Rental Structure", e);
      return of(false);
    }
  }

  CalculateRentalStructure(request:any){
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.CalculateRentalStructure,request).pipe(
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
      console.log("Error Occured while Creating Rental Structure", e);
      return of(false);
    }
  }

  ReadRecommendationHistory(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadCaRecommendation, request).pipe(
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
      console.log("Error Occured while Reading Proposal E-Approval Entity => ", e);
      return of(false);
    }
  }

  ReadRecommendation() {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadCaRecommendationdropdown).pipe(
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
      console.log("Error Occured while Reading Proposal CA_Recommendation  => ", e);
      return of(false);
    }
  }

  
  SaveCARecommendationProposal(request: any): Observable<any> {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.SaveCaRecommendation, request).pipe(
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
      console.log("Error Occured while saving Lead => ", e);
      return of(false);
    }

  }

  ReadEApprovalReasonByModule(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadEApprovalReasonByModule, request).pipe(
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
      console.log("Error Occured while Read Rejection Reason By Module ", e);
      return of(false);
    }
  }

  ReadCancelledRejectecedApplications(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadCancelledRejectecedApplications, request).pipe(
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
      console.log("Error Occured while Reading Proposal E-Approval Entity => ", e);
      return of(false);
    }
  }
  GetGoodsServiceFundsDetails(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.GetGoodsServiceFundsDetails, request).pipe(
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
      console.log("Error Occured while Reading Goods and Services => ", e);
      return of(false);
    }
  }
  FPCampainByFPId(request: any) {
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadFinancialProductByFinancialProductId, request).pipe(
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
      console.log("Error Occured while loading existing campaign data=> ", e);
      return of(false);
    }
  }

  ReadAssetConditionAndModel(request: any){
    try {
      return this._ApiComm.APIRequest(SERVICE_URL.ReadAssetConditionAndModel, request).pipe(
        map((response) => {
          if (response) {
            return response
          } else {
            return null
          }
        }))
    }
    catch (e) {
      console.log("An Error Occured while reading asset condition and model =>", e);
      return of(false);
    }
  }
  ReadDeviationTrackingByProposalId(request: any) {
    try {
        return this._ApiComm.APIRequest(SERVICE_URL.ReadDeviationTrackingByProposalId, request).pipe(
        map((response) => {
          if (response) {
            return response
          } else {
            return null
          }
        }))
    }
    catch (e) {
      console.log("An Error Occured while reading Deviation Tracking data =>", e);
      return of(false);
    }
  }
  
}

