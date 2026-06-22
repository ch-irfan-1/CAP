export enum PayableTypeCode {
  None = 0,
  AssetCost = 1,
  AccessoryInvoice = 2,
  LoanAmount = 3,
  AllCommissions = 4,
  LawyerFee = 5,
  CourtFee = 6,
  RepossessionCost = 7,
  MiscAmountRefund = 8,
  RegistrationAgentFee = 9,
  CompulsoryInsurance = 10,
  MaintenanceAmount = 11,
  RegistrationAuthorityFee = 12,
  ExcessAmount = 13,
  VoluntaryInsurance = 14,
  WFSAssetCost = 15,
  WFSInterestIncome = 16,
  WFSDiscountIncome = 17,
  WFSRebate = 18,
  WFSLoan = 19,
  SellingExpense = 22,
  DisbursementAmount = 23,
  ETFromSOLOs = 24,
  Charges = 25,
  Insurance = 26,
  InsurancePolicyFee = 11111,
  FiduciaFee = 27,
  BBNCharge = 28,
  CommissionexpenseJP1 = 33,
  Commission = 34,
  Insurancecommissiontodealer = 35,
  Sellingexpensesatauction = 36,
  Adminfeeexpenseatauction = 37,
  AdminFeeCommissiontodealer = 38,
  ProvisionFeeCommissiontodealer = 39,
  InsurancePremium = 41,
  AROInsurancePremium = 42,
  OTOInsuranceCommission = 43,
  MarketingCommissionJP1 = 44,
  InsuranceCommissionJP1 = 45,
  AdminFeeCommissionJP1 = 46,
  ProvisionFeeCommissionJP1 = 47,
  MarketingCommissionJP2 = 48,
  InsuranceCommissionJP2 = 49,
  AdminFeeCommissionJP2 = 50,
  ProvisionFeeCommissionJP2 = 51,
  MarketingCommissionJP2Scheme = 52,
  InsuranceCommissionJP2Scheme = 53,
  AdminFeeCommissionJP2Scheme = 54,
  ProvisionFeeCommissionJP2Scheme = 55,
  SOFJP1Commission = 56,
  SOFJP2Commission = 57
}

  export namespace PayableTypeCode {
    export function GetStringValue(key: number): string {
      let strVal = '';
      const enumVal = key as PayableTypeCode;
  
      switch (enumVal) {
        case PayableTypeCode.AccessoryInvoice: {
          strVal = '00002';
          break;
        }
        case PayableTypeCode.AssetCost: {
          strVal = '00001';
          break;
        }
        default: {
          strVal = '00000';
          break;
        }
      }
  
      return strVal;
    }

    export function GetDescriptionStringValue(key: number): string {
        let strVal = '';
        const enumVal = key as PayableTypeCode;
    
        switch (enumVal) {
          case PayableTypeCode.AccessoryInvoice: {
            strVal = 'Accessory Cost';
            break;
          }
          case PayableTypeCode.AssetCost: {
            strVal = 'Asset Cost';
            break;
          }
          default: {
            strVal = 'None';
            break;
          }
        }
    
        return strVal;
      }
    }