import { IHttpRequest } from "@NFS_Interfaces/RequestInterfaces/Http-Request-interface";

export abstract class SERVICE_URL {

  
  static loginUrl: IHttpRequest = { Method: "POST", EndPoint: "/api/Security/Login" };
  static logoutUrl: IHttpRequest = { Method: "POST", EndPoint: "/api/Security/Logout" };
  
  static dummyAPi: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/dummyAPi" };
  static ResetPassword: IHttpRequest = { Method: "POST", EndPoint: "/api/Security/ResetPassword" };

  static ReadPasswordHistory: IHttpRequest = { Method: "POST", EndPoint: "/api/Security/ReadPasswordHistory" };
  static loginForApplicationView: IHttpRequest = { Method: "POST", EndPoint: "/api/Security/LoginForApplicationView" }
  static forcefullyLogoutUrl: IHttpRequest = { Method: "POST", EndPoint: "/api/Security/ForcefullyLogout" };
  static refreshTokenUrl: IHttpRequest = { Method: "POST", EndPoint: "/api/Security/RefreshToken" };
  static saveQuotationUrl: IHttpRequest = { Method: "POST", EndPoint: "/api/Quotation/SaveQuotation" };
  static masterDataUrl: IHttpRequest = { Method: "POST", EndPoint: "/api/Lookup/iOPSGetMasterData" };
  
  static CalculateRentalStructure: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/CalculateRentalStructure" };
  static CreateRentalStructure: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/CreateRentalStructure" };
  static CalculateRentalStructureCount: IHttpRequest = { Method: "POST", EndPoint: "/api/Calculation/CalculateRentalStructureCount" };
  
  static proposalQueueMasterDataUrl: IHttpRequest = { Method: "POST", EndPoint: "/api/Lookup/GetAllProposalQueueLookup" };
  static proposalQueueUsersMasterDataUrl: IHttpRequest = { Method: "POST", EndPoint: "/api/Lookup/GetAllUsersbyIntroducer" };

  static allApplicantMasterData: IHttpRequest = { Method: "POST", EndPoint: "/api/Lookup/GetAllApplicantLookup" };

  static recaptchaUrl: IHttpRequest = { Method: "POST", EndPoint: "/api/Security/ValidateRecaptcha" };
  static VerifyOTPTokenUrl: IHttpRequest = { Method: "POST", EndPoint: "/api/Security/VerifyOTPToken" };
  static ResendOTPTokenUrl: IHttpRequest = { Method: "POST", EndPoint: "/api/Security/GenerateOTP" };
  static readQuotationQueueByUserUrl: IHttpRequest = { Method: "POST", EndPoint: "/api/Quotation/ReadQueueByUser" };
  static readQuotation: IHttpRequest = { Method: "POST", EndPoint: "/api/Quotation/ReadQoutation" };
  static cancelQoutation: IHttpRequest = { Method: "POST", EndPoint: "/api/Quotation/CancelLead" };
  static SubmitQuotation: IHttpRequest = { Method: "POST", EndPoint: "/api/Quotation/SubmitLead" };
  static loadExistingBP: IHttpRequest = { Method: "POST", EndPoint: "/api/Quotation/ReadExistingBPForIOPS" };
  static loadContract: IHttpRequest = { Method: "POST", EndPoint: "/api/Quotation/GetContractForIops" };
  static UploadDocument: IHttpRequest = { Method: "POST", EndPoint: "/api/Quotation/UploadDocument" };
  static SaveEagleScore: IHttpRequest = { Method: "POST", EndPoint: "/api/Quotation/SaveEagleScore" };
  static ViewDocument: IHttpRequest = { Method: "POST", EndPoint: "/api/Quotation/ReadDocument" };
  static ReadDocumentList: IHttpRequest = { Method: "POST", EndPoint: "/api/Quotation/ReadDocumentList" };
  static DeleteDocument: IHttpRequest = { Method: "POST", EndPoint: "/api/Quotation/DeleteDocument" };
  static GetVOList: IHttpRequest = { Method: "POST", EndPoint: "/api/Lookup/GetVOList" };
  static GetMVOUsersList: IHttpRequest = { Method: "POST", EndPoint: "/api/Lookup/GetMVOUsersList" };
  static AssignToVO: IHttpRequest = { Method: "POST", EndPoint: "/api/Quotation/AssignLeadToVO" };
  static readQuotInfo: IHttpRequest = { Method: "POST", EndPoint: "/api/Quotation/ReadLeadInfo" };
  static ReAssignToVO: IHttpRequest = { Method: "POST", EndPoint: "/api/Quotation/ReAssignToVO" };
  static ReadLeadStatuses: IHttpRequest = { Method: "POST", EndPoint: "/api/Quotation/ReadLeadStatuses" };
  static ReadTopFinancialProducts: IHttpRequest = { Method: "POST", EndPoint: "/api/Quotation/ReadTopFinancialProducts" };
  static ReadTopSellingAssets: IHttpRequest={ Method:"POST", EndPoint:"/api/mPOSProposal/ReadTopSellingAssets"}
  static mPOSReadTopFinancialProducts: IHttpRequest={ Method:"POST", EndPoint:"/api/mPOSProposal/mPOSReadTopFinancialProducts"}


  static ReadDealerWithAddress: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadDealerWithAddress" };
  static ReadAllFinancialProductByIntroducer: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadAllFinancialProductByIntroducer" };
  static ReadConfigurationTemplate: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadConfigurationTemplate" };
  static SearchPOSExposure: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/SearchPOSExposure" };
  static SearchCMSExposure: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/SearchCMSExposure" };
  static ReadApplicantInfo: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadApplicantInfo" };
  static SearchBlacklistData: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/SearchBlacklistData" };
  static SearchInternalBlacklistData: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/SearchInternalBlacklistData" };
  static SearchInternalBlacklistDataSolo: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/SearchInternalBlacklistDataSolo" };
  static SearchOJKBadCustomers: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/SearchOJKBadCustomers" };
  static ReadExistingBPandApplicant: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadExistingBPandApplicant" };
  static ReadExistingBPCompany:IHttpRequest = { Method:"POST", EndPoint: "/api/Proposal/ReadExistingBPCompany"};

  static ReadPointScoreDetailCAPWrqus: IHttpRequest={Method:"POST", EndPoint: "/api/Proposal/ReadPointScoreDetailCAPWrqus"};
  static GetControlChangeRequest: IHttpRequest={Method:"POST", EndPoint: "/api/Proposal/GetControlChangeRequest"};
  static CheckWithdrawlAndChangeRequestStatus: IHttpRequest={Method:"POST", EndPoint: "/api/Proposal/CheckWithdrawlAndChangeRequestStatus"};
  static ReadProposalEApprovalEntity: IHttpRequest={Method:"POST", EndPoint: "/api/Proposal/ReadProposalEApprovalEntity"};
  static SaveProposalEApprovalEntity: IHttpRequest={Method:"POST", EndPoint: "/api/Proposal/SaveProposalEApprovalEntity"};
  
  static ReadCustomerExposure: IHttpRequest={Method:"POST", EndPoint: "/api/Proposal/ReadCustomerExposure"};

  static GetPointScoreCategoryCodes: IHttpRequest = { Method: "POST", EndPoint: "/api/Lookup/GetPointScoreCategoryCodes" };
  static GetSubsidryAddressType: IHttpRequest = { Method: "POST", EndPoint: "/api/Lookup/GetSubsidryAddressType" };
  static CustomReadTeamHierarchy: IHttpRequest = { Method: "POST", EndPoint: "/api/Lookup/CustomReadTeamHierarchy" };
  
  static PerformPointRescoring: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/PerformPointRescoring" };
  static SaveProposalFieldVisit: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/SaveProposalFieldVisit" };
  static ReadExistingFamilyExposure: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadExistingFamilyExposure" };
  static ReadFamilyPOSExposure: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadFamilyPOSExposure" };
  static ReadFamilyExposure: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadFamilyExposure" };
  static ReadFamilyBlaklistExposure: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadFamilyBlaklistExposure" };
  static ReadFamilyCMSExposure: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadFamilyCMSExposure" };
  static ReadCommissionConfiguration: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadCommissionConfiguration" };
  static ReadMPOSDocumentsByProposalId: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadMPOSDocumentsByProposalId" };
  static ReadGeoCodeHistoryByProposalId: IHttpRequest = { Method: "POST", EndPoint: "/api/ProposalDTS/GetGeoCodeHistoryByProposalId" };
  static SaveGeoCodeHistory: IHttpRequest = { Method: "POST", EndPoint: "/api/ProposalDTS/SaveGeoCodeHistory" };
  static GeoCode: IHttpRequest = { Method: "POST", EndPoint: "/api/ProposalDTS/GeoCode" }
  static CheckGeoCodeHistory: IHttpRequest = { Method: "POST", EndPoint: "/api/ProposalDTS/CheckGeoCodeHistory" }

  static ReadDTSDocumentGroupByGroupCdeForMpos: IHttpRequest = { Method: "GET", EndPoint: "/api/Proposal/ReadDTSDocumentGroupByGroupCdeForMpos" };
  static ReadFieldVisitbyProposalIdApplicantId:IHttpRequest={ Method:"POST", EndPoint:"/api/Proposal/ReadFieldVisitbyProposalIdApplicantId"};
  static ConvertToStream:IHttpRequest={ Method: "POST", EndPoint:"/api/ProposalDTS/ConvertToStream"};
  static UploadDocumentDTS: IHttpRequest = { Method: "POST", EndPoint: "/api/ProposalDTS/UploadDocumentDTS" };
  static SaveProposal: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/SaveProposal" };
  static SubmitProposal: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/SubmitProposal_Optim" };
  static ReadUserClaim: IHttpRequest = { Method: "POST", EndPoint: "/api/Security/ReadUserClaimByUserGroup" };
  static ReadProposalQueue: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadProposalPagedQueueByPrplInfoParam" };
  static ReadProposal: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadProposal" };
  static ReadCashFlowIdentifier: IHttpRequest = { Method: "POST", EndPoint: "/api/Lookup/GetCashFlowIdentifier" };
  static ReadRentalModesTemplates: IHttpRequest = { Method: "POST", EndPoint: "/api/IOPSProposal/ReadRentalModes" };
  static ReadFrequenciesTemplates: IHttpRequest = { Method: "POST", EndPoint: "/api/IOPSProposal/ReadFrequencies" };
  static GetAssociatedApplicationCharges: IHttpRequest = { Method: "POST", EndPoint: "/api/Lookup/GetAssociatedApplicationCharges" };
  static CalculateChargesTax: IHttpRequest = { Method: "POST", EndPoint: "/api/Calculation/CalculateChargesTax" };
  static DealerSupplierSearch: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/GetSupplierSearch" };
  static ReadAssetModlTpleSeqID: IHttpRequest = { Method: "POST", EndPoint: "/api/IOPSProposal/ReadAssetModlTpleSeqID" };
  static ReadAssetSearch: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadAssetSearch" };
  static ReadCustomAssetSearchByTemplateId: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadCustomAssetSearchByTemplateId" };
  static ReadExistingBP: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadExistingBP" };
  static ReadInventoryAssetSearch: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadCustomAssetforOL" };
  static Calculate: IHttpRequest = { Method: "POST", EndPoint: "/api/Calculation/Calculate" };
  static IncomeConfiguration: IHttpRequest = { Method: "POST", EndPoint: "/api/Lookup/GetIncomeConfiguration" };
  static GetVehicleLoadingRate: IHttpRequest = { Method: "POST", EndPoint: "/api/Lookup/GetVehicleLoadingRate" };
  static GetBPKBExpectedOverdueDays: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/GetBPKBExpectedOverdueDays" };
  static GetAssetModelColorLookup: IHttpRequest = { Method: "POST", EndPoint: "/api/Lookup/GetAssetModelColorLookup" };
  static GetReimbursmentCostInd: IHttpRequest = { Method: "POST", EndPoint: "/api/Lookup/GetReimbursmentCostInd" };
  static GetBPName: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/GetBPName" };
  static PaymentFrequency: IHttpRequest = { Method: "POST", EndPoint: "/api/Lookup/GetSelectedFrequencyDetail" };
  static UpdateBaseRateChart: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/UpdateBaseRateChart" };
  static UpdateChartConfiguration: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/UpdateChartConfiguration" };
  static ReadCustomBPKBDetailOL: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadCustomBPKBDetailOL" }
  static ReadCustomBPKBGurantorOL: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadCustomBPKBGurantorOL" }
  static ReadCustomBPKBReprDetailOL: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadCustomBPKBReprDetailOL" }
  static ReadCustomVehicleDetailOL: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadCustomVehicleDetailOL" }
  static ReadByRevisionIdAndAsetId: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadByRevisionIdAndAsetId" }
  static SaveProposalInfo: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/SaveProposalInfo" }
  static ReadProposalInfo: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadProposalInfo" }
  static ReadProposalAssets: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadProposalAssets" }
  static UpdateAssetRegisterStatus: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/UpdateAssetRegisterStatus" }
  static isBPExistForBadCustomer: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/isBPExistForBadCustomer" }
  static SaveBPBlackListHistory: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/SaveBPBlackListHistory" }
  static ReadAndSavePRPL: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadAndSavePRPL" }

  static SubmitChangeRequest: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/SubmitChangeRequest"}
  static SubmitWithdrawRequest: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/SubmitWithdrawRequest"}
  static ReadEaglePointScoreDetailCAPWrqu: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadEaglePointScoreDetailCAPWrqu"}
  static Is_Directory_Path_Exists: IHttpRequest = { Method: "POST", EndPoint: "/api/Lookup/Is_Directory_Path_Exists" }
  static SaveProposalDTSEntity: IHttpRequest = { Method: "POST", EndPoint: "/api/ProposalDTS/SaveProposalDTSEntity" }
  static ReadProposalDTSEntity: IHttpRequest = { Method: "POST", EndPoint: "/api/ProposalDTS/ReadProposalDTSEntity" }
  static SubmitValidations: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/SubmitValidations" }
  static ValidateBPKBAlreadyExists: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ValidateBPKBAlreadyExists" }
  static ReviseProposal: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReviseProposal" }
  static ReadProposalTaxConfigEntity: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadProposalTaxConfigEntity" }

  static ReadTaxChargePayableITCCompAss: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadTaxChargePayableITCCompAss" }
  static GetInsuranceCompanies: IHttpRequest = { Method: "POST", EndPoint: "/api/Lookup/GetInsuranceCompanies" };
  static GetBusinessRulesModelsByClassSpec: IHttpRequest = { Method: "POST", EndPoint: "/api/Lookup/GetBusinessRulesModelsByClassSpec" };
  static ReadBusinessPartnerDepChart: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadBusinessPartnerDepChart" };
  static ReadBPInsuranceDetailForInsurance: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadBPInsuranceDetailForInsurance" };
  static GetPOSLocationByBranch: IHttpRequest = { Method: "POST", EndPoint: "/api/Lookup/GetPOSLocationByBranch" };
  static GetOverrideByData: IHttpRequest = {Method: "POST", EndPoint: "/api/Proposal/ReadOverrideByData"}

  


  static ReadBPInsuranceDetail: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadBPInsuranceDetail" };
  static GetAllAssetInsuranceLookup: IHttpRequest = { Method: "POST", EndPoint: "/api/Lookup/GetAllAssetInsuranceLookup" }
  static ReadDepreciationPolicy: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadDepreciationPolicy" };
  static ReadDepreciationChartDetail: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadDepreciationChartDetail" };
  static ReadAdminFeeChartFromFC: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadAdminFeeChartFromFC" };
  static ReadProvinceofCity: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadProvinceofCity" };
  static GenerateStationery: IHttpRequest = { Method: "POST", EndPoint: "/api/Stationery/GenerateOVPStationery" };
  static PrintPointScore: IHttpRequest = { Method: "POST", EndPoint: "/api/Stationery/PrintPointScore" };
  static GetAssociatedStationeryWithFPId: IHttpRequest = { Method: "POST", EndPoint: "/api/Stationery/GetAssociatedStationeryWithFPId" };
  static ReadAlreadyConvertedContract: IHttpRequest = { Method: "POST", EndPoint: "/api/Stationery/ReadAlreadyConvertedContract" };
  static PrintStationery: IHttpRequest = { Method: "POST", EndPoint: "/api/Stationery/PrintStationery" };
  
  static CalculateCommissionforScheme: IHttpRequest = { Method: "POST", EndPoint: "/api/Calculation/CalculateCommissionforScheme" };
  static CalculateCommission: IHttpRequest = { Method: "POST", EndPoint: "/api/Calculation/CalculateCommission" };
  static GetSubsidaryCompanyLookupByCompanyID: IHttpRequest = { Method: "GET", EndPoint: "/api/Lookup/GetSubsidaryCompanyLookupByCompanyID" };
  static CalculateReceivableTax: IHttpRequest = { Method: "POST", EndPoint: "/api/Calculation/CalculateReceivableTax" };
  static GetCommissionMethodLookup: IHttpRequest = { Method: "GET", EndPoint: "/api/Lookup/GetCommissionMethodLookup" };
  static PopulateCalculatedData: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/PopulateCalculatedData" };
  static CalculateTaxByRecipients: IHttpRequest = { Method: "POST", EndPoint: "/api/Calculation/CalculateTaxByRecipients" };
  static GetStandardInsuranceLookups: IHttpRequest = { Method: "POST", EndPoint: "/api/Lookup/GetStandardInsuranceLookups" };
  static GetAccountByRecipientID: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/GetAccountByRecipientID" };
  static CalculateTaxByComponent: IHttpRequest = { Method: "POST", EndPoint: "/api/Calculation/CalculateTaxByComponent" };
  static CalculateTOBAndMOB: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/CalculateTOBAndMOB" };
  static CalculateNMSIR: IHttpRequest = { Method: "POST", EndPoint: "/api/Calculation/CalculateNMSIR" };
  static ReadProposalBasicInfo: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadProposalBasicInfo" };
  static ReadRejectionReasonByModule: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadRejectionReasonByModule" };
  static UpdateApplicationAssignTo: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/UpdateApplicationAssignTo" };
  static SaveProposalHistory: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/SaveProposalHistory" };
  static ReadBMUserByBranchId: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadBMUserByBranchId" };

  static GetDateDifference: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/GetDateDifference" };
  static GetInsuranceCompanyBranch: IHttpRequest = { Method: "POST", EndPoint: "/api/Lookup/GetInsuranceCompanyBranch" };
  
  static ReadCaRecommendationdropdown: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReaDCARecommendation" };
  static ReadCaRecommendation: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadProposalCARecommendation" };
  static SaveCaRecommendation : IHttpRequest = {Method : "POST", EndPoint: "/api/Proposal/SaveProposalCARecommendation" };
  static ReadEApprovalReasonByModule: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadEApprovalReasonByModule" };
  static ReadCancelledRejectecedApplications: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadCancelledRejectecedApplications" };
  static GetGoodsServiceFundsDetails: IHttpRequest = { Method: "POST", EndPoint: "/api/Lookup/GetGoodsServiceFundsDetails" };
  static ReadFinancialProductByFinancialProductId: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadFinancialProductByFinancialProductId" };
  static ReadAssetConditionAndModel: IHttpRequest = { Method: "POST", EndPoint: "/api/Proposal/ReadAssetConditionAndModel" };
  static ReadResurveyHistoryByProposalId: IHttpRequest = {Method: "POST", EndPoint: "/api/ProposalDTS/ReadResurveyHistoryByProposalId"};
  static ReadIncomeAnalysisDetailByProposalId: IHttpRequest = {Method: "POST", EndPoint: "/api/Proposal/GetIncomeAnalysisDetailByProposalId"};
  static ReadDeviationTrackingByProposalId: IHttpRequest = {Method: "POST", EndPoint: "/api/Proposal/GetDeviationTrackingByProposalId"}
}
