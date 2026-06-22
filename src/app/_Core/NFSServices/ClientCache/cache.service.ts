import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CacheService {
  cachedRequests = [
    '/api/Lookup/GetAllUsersbyIntroducer',
    '/api/Lookup/GetSelectedFrequencyDetail',
    '/api/IOPSProposal/ReadRentalModes',
    '/api/IOPSProposal/ReadFrequencies',
    '/api/IOPSProposal/ReadAssetModlTpleSeqID',
    '/api/Lookup/GetIncomeConfiguration',
    '/api/Proposal/ReadConfigurationTemplate',
    '/api/Proposal/ReadAllFinancialProductByIntroducer',
    '/api/Lookup/GetSubsidaryCompanyLookupByCompanyID',
    '/api/Proposal/ReadCommissionConfiguration',
    // '/api/Proposal/ReadDealerWithAddress',
    '/api/Proposal/GetSupplierSearch',
    '/api/Lookup/iOPSGetMasterData',
    // '/api/Proposal/ReadBusinessPartnerDepChart',
    '/api/Lookup/GetBusinessRulesModelsByClassSpec',
    '/api/Proposal/ReadBPInsuranceDetail',
    '/api/Proposal/ReadDepreciationChartDetail',
    //'/api/Proposal/ReadBPInsuranceDetailForInsurance',
    '/api/Lookup/GetStandardInsuranceLookups',
    '/api/Proposal/ReadProvinceofCity',
    '/api/Lookup/GetAllAssetInsuranceLookup',
    '/api/Proposal/ReadAdminFeeChartFromFC',
    '/api/Lookup/CustomReadTeamHierarchy'
  ];

  constructor() { }

  hashCode(str: string) {
    var hash = 0, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }
}
