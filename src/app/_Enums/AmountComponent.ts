export enum AmountComponent {
  None = 0,
  Rental = 1,
  Principal = 2,
  Interest = 3,
  TAX = 4,
  Insurance = 5,
  Registration = 6,
  SundaryCharge = 7,
  Overdue = 8,
  ChargesAmort = 9,
  SecurityDeposit = 10,
  DownpaymentDeposit = 11,
  interestinRentalAmort = 12,
  VatonRental = 13,
  CommissionAmount = 14,
  SubsidyAmount = 15,
  IncomeAmort = 16,
  CommAmort = 17,
  SubsidyAmort = 18,
  RestructuringLumsum = 19,
  Maintenance = 20,
  TotalInterest = 21,
  EarlyTermination = 22,
  Litigation = 23,
  LawyerFee = 24,
  CourtFee = 25,
  JudgmentAmount = 26,
  ShortfallAmount = 27,
  WriteoffAmount = 28,
  AllCommissions = 29,
  AssetCost = 30,
  Subsidy = 31,
  EarlyTerminationReceiveable = 32,
  ProceedFromSaleOfAsset = 33,
  VATApplicable = 34,
  ITConTAX = 35,
  GSTAsITC = 36,
  DeductWHT = 37,
  ITCClaimbackPercentage = 38,
  TaxOnRental = 39,
  TaxOnTotalInterest = 40,
  WHTApplied = 41,
  TaxType = 42,
  WHTApplicable = 43,
  GSTVATC = 44,
  ITCPercentage = 45,
  CommissionPayableTax = 46,
  WHTonReceiveable = 47,
  WHTonPayable = 48,
  TaxOnReceievable = 49,
  TaxonPayable = 50,
  SellingExpTax = 51,
  WHTApplicableonSellingExpense = 52,
  ExcessIncomeTax = 53,
  TaxOnRecoverdShotfall = 54,
  TaxOnShotfall = 55,
  TradeinAmount = 56,
  Componants = 57,
  AccessoriesCost = 58,
  IntroducerSubsidy = 59,
  ManufacturerSubsidy = 60,
  CompulsoryInsurance = 61,
  VoluntaryInsurance = 62,
  FirstYearRegistration = 63,
  NextYearRegistration = 64,
  FinanceCompanyFee = 65,
  RegistrationAuthorityFee = 66,
  AgentFee = 67,
  ResidualValue = 68,
  ContractFinancedCharges = 69,
  BidAmount = 72,
  RentalDeduction = 73,
  RegisterAmount = 74,
  ContractUpfrontCharges = 78,
  IRR = 79,
  ApplicationUpfrontCharges = 80,
  Charge = 7,
  GeneralProvision = 75,
  Purchase = 81,
  Rebate = 82,
  Sales = 83,
  FlatcancellationReceivables = 84,
  FlatcancellationPenalty = 85,
  AdditionalInterest = 87,
  InterestonPrincipaloutstanding = 88,
  OnRoadCost = 89,
  ChargePayable = 90,
  ChargeReceivable = 91,
  PastDueRentalswithTaxes = 92,
  PVofRentalswithTaxes = 93,
  SchedulePOSwithTaxes = 94,
  InterestonETQuotewithTaxes = 95,
  UnpaidTaxesofFutureRentals = 96,
  MaintenanceinETQuote = 97,
  InsuranceinETQuote = 98,
  RegistrationinETQuote = 99,
  LatePaymentPenalty = 100,
  SundryChargeswithTaxes = 101,
  ETPenalty = 102,
  AdditionalCharges = 103, // Discount Amount is Changed to Down Payment Refinance
  DownPaymentRF = 104,
  ETRoundingAmount = 105,
  ETFromSOLOs = 106,
  InsuranceCommission = 107,
  DisbursementAmount = 108,
  InterestonNumberofDaysatWriteOffCalculationDate = 109,
  InterestonNumberofDaysatRedemptionExpiry = 110,
  AdditionalCoverage = 112,
  Comprehensive = 113,
  TLO = 114,
  FinancedAmount = 115,
  ApplicationCharges = 116,
  InsurancePremium = 117,
  AdminFee = 118,
  PolicyFee = 119,
  ProvisionFee = 120,
  FiduciaFee = 121,
  BBNCharge = 122,
  UpfrontAdminFee = 123,
  FinancedAdminFee = 124,
  DownpaymentSubsidy = 125,
  InstallmentSubsidy = 126,
  InterestSubsidyRateBased = 127,
  InterestSubsidyFixedAmount = 128,
  AdminFeeSubsidy = 129,
  InsuranceSubsidy = 130,
  ProvisionCommission = 131,
  JP1Commission = 133,
  Commission = 134,
  B2BFee = 135,
  DealerInsuranceCommission = 136,
  AdminFeeCommission = 137,
  UpfrontInsurancePremium = 138,
  FinancedInsurancePremium = 139,
  AROInsurancePremium = 140,
  CapitalRepayment = 141,
  FirstRental = 70,
  UpfrontProvisionFee = 142,
  FinancedProvisionFee = 143,
  BankGain = 144,
  WHTonSellingExpense = 145,
  NetBookValue = 146,
  Discount = 148,
  NetRental = 149,
  VAT = 150,
  AssetCostWithoutVAT = 151,
  InvoicedMonthlyLeaseFeewithoutVAT = 152,
  InvoicedVATamountonMonthlyLeaseFee = 153,
  VATonETPenaltyFee = 154,
  InvoicedMonthlyLeaseFeewithVAT = 155,
  
  OutStandingPrincipal=168,
TotalUnpaidInstallement=169,
OngoingInterest=170,
UnpaidPanelty=171,
AdditionalChanrges=172
}
export namespace AmountComponent {
  export function GetStringValue(key: number): string {
    let strVal = '';
    const enumVal = key as AmountComponent;

    switch (enumVal) {
      case AmountComponent.None: {
        strVal = '00000';
        break;
      }
      case AmountComponent.Rental: {
        strVal = '00001';
        break;
      }
      case AmountComponent.Principal: {
        strVal = '00002';
        break;
      }
      case AmountComponent.Interest: {
        strVal = '00003';
        break;
      }
      case AmountComponent.TAX: {
        strVal = '00004';
        break;
      }
      case AmountComponent.Insurance: {
        strVal = '00005';
        break;
      }
      case AmountComponent.Registration: {
        strVal = '00006';
        break;
      }
      case AmountComponent.SundaryCharge: {
        strVal = '00007';
        break;
      }
      case AmountComponent.Overdue: {
        strVal = '00008';
        break;
      }
      case AmountComponent.ChargesAmort: {
        strVal = '00009';
        break;
      }
      case AmountComponent.SecurityDeposit: {
        strVal = '00010';
        break;
      }
      case AmountComponent.DownpaymentDeposit: {
        strVal = '00011';
        break;
      }
      case AmountComponent.interestinRentalAmort: {
        strVal = '00012';
        break;
      }
      case AmountComponent.VatonRental: {
        strVal = '00013';
        break;
      }
      case AmountComponent.CommissionAmount: {
        strVal = '00014';
        break;
      }
      case AmountComponent.SubsidyAmount: {
        strVal = '00015';
        break;
      }
      case AmountComponent.IncomeAmort: {
        strVal = '00016';
        break;
      }
      case AmountComponent.CommAmort: {
        strVal = '00017';
        break;
      }
      case AmountComponent.SubsidyAmort: {
        strVal = '00018';
        break;
      }
      case AmountComponent.RestructuringLumsum: {
        strVal = '00019';
        break;
      }
      case AmountComponent.Maintenance: {
        strVal = '00020';
        break;
      }
      case AmountComponent.TotalInterest: {
        strVal = '00021';
        break;
      }
      case AmountComponent.EarlyTermination: {
        strVal = '00022';
        break;
      }
      case AmountComponent.Litigation: {
        strVal = '00023';
        break;
      }
      case AmountComponent.LawyerFee: {
        strVal = '00024';
        break;
      }
      case AmountComponent.CourtFee: {
        strVal = '00025';
        break;
      }
      case AmountComponent.JudgmentAmount: {
        strVal = '00026';
        break;
      }
      case AmountComponent.ShortfallAmount: {
        strVal = '00027';
        break;
      }
      case AmountComponent.WriteoffAmount: {
        strVal = '00028';
        break;
      }
      case AmountComponent.AllCommissions: {
        strVal = '00029';
        break;
      }
      case AmountComponent.AssetCost: {
        strVal = '00030';
        break;
      }
      case AmountComponent.Subsidy: {
        strVal = '00031';
        break;
      }
      case AmountComponent.EarlyTerminationReceiveable: {
        strVal = '00032';
        break;
      }
      case AmountComponent.ProceedFromSaleOfAsset: {
        strVal = '00033';
        break;
      }
      case AmountComponent.VATApplicable: {
        strVal = '00034';
        break;
      }
      case AmountComponent.ITConTAX: {
        strVal = '00035';
        break;
      }
      case AmountComponent.GSTAsITC: {
        strVal = '00036';
        break;
      }
      case AmountComponent.DeductWHT: {
        strVal = '00037';
        break;
      }
      case AmountComponent.ITCClaimbackPercentage: {
        strVal = '00038';
        break;
      }
      case AmountComponent.TaxOnRental: {
        strVal = '00039';
        break;
      }
      case AmountComponent.TaxOnTotalInterest: {
        strVal = '00040';
        break;
      }
      case AmountComponent.WHTApplied: {
        strVal = '00041';
        break;
      }
      case AmountComponent.TaxType: {
        strVal = '00042';
        break;
      }
      case AmountComponent.WHTApplicable: {
        strVal = '00043';
        break;
      }
      case AmountComponent.GSTVATC: {
        strVal = '00044';
        break;
      }
      case AmountComponent.ITCPercentage: {
        strVal = '00045';
        break;
      }
      case AmountComponent.CommissionPayableTax: {
        strVal = '00046';
        break;
      }
      case AmountComponent.WHTonReceiveable: {
        strVal = '00047';
        break;
      }
      case AmountComponent.WHTonPayable: {
        strVal = '00048';
        break;
      }
      case AmountComponent.TaxOnReceievable: {
        strVal = '00049';
        break;
      }
      case AmountComponent.TaxonPayable: {
        strVal = '00050';
        break;
      }
      case AmountComponent.SellingExpTax: {
        strVal = '00051';
        break;
      }
      case AmountComponent.WHTApplicableonSellingExpense: {
        strVal = '00052';
        break;
      }
      case AmountComponent.ExcessIncomeTax: {
        strVal = '00053';
        break;
      }
      case AmountComponent.TaxOnRecoverdShotfall: {
        strVal = '00054';
        break;
      }
      case AmountComponent.TaxOnShotfall: {
        strVal = '00055';
        break;
      }
      case AmountComponent.TradeinAmount: {
        strVal = '00056';
        break;
      }
      case AmountComponent.Componants: {
        strVal = '00057';
        break;
      }
      case AmountComponent.AccessoriesCost: {
        strVal = '00058';
        break;
      }
      case AmountComponent.IntroducerSubsidy: {
        strVal = '00059';
        break;
      }
      case AmountComponent.ManufacturerSubsidy: {
        strVal = '00060';
        break;
      }
      case AmountComponent.CompulsoryInsurance: {
        strVal = '00061';
        break;
      }
      case AmountComponent.VoluntaryInsurance: {
        strVal = '00062';
        break;
      }
      case AmountComponent.FirstYearRegistration: {
        strVal = '00063';
        break;
      }
      case AmountComponent.NextYearRegistration: {
        strVal = '00064';
        break;
      }
      case AmountComponent.FinanceCompanyFee: {
        strVal = '00065';
        break;
      }
      case AmountComponent.RegistrationAuthorityFee: {
        strVal = '00066';
        break;
      }
      case AmountComponent.AgentFee: {
        strVal = '00067';
        break;
      }
      case AmountComponent.ResidualValue: {
        strVal = '00068';
        break;
      }
      case AmountComponent.ContractFinancedCharges: {
        strVal = '00069';
        break;
      }
      case AmountComponent.BidAmount: {
        strVal = '00072';
        break;
      }
      case AmountComponent.RentalDeduction: {
        strVal = '00073';
        break;
      }
      case AmountComponent.RegisterAmount: {
        strVal = '00074';
        break;
      }
      case AmountComponent.ContractUpfrontCharges: {
        strVal = '00078';
        break;
      }
      case AmountComponent.IRR: {
        strVal = '00079';
        break;
      }
      case AmountComponent.ApplicationUpfrontCharges: {
        strVal = '00080';
        break;
      }
      case AmountComponent.Charge: {
        strVal = '00007';
        break;
      }
      case AmountComponent.GeneralProvision: {
        strVal = '00075';
        break;
      }
      case AmountComponent.Purchase: {
        strVal = '00081';
        break;
      }
      case AmountComponent.Rebate: {
        strVal = '00082';
        break;
      }
      case AmountComponent.Sales: {
        strVal = '00083';
        break;
      }
      case AmountComponent.FlatcancellationReceivables: {
        strVal = '00084';
        break;
      }
      case AmountComponent.FlatcancellationPenalty: {
        strVal = '00085';
        break;
      }
      case AmountComponent.AdditionalInterest: {
        strVal = '00087';
        break;
      }
      case AmountComponent.InterestonPrincipaloutstanding: {
        strVal = '00088';
        break;
      }
      case AmountComponent.OnRoadCost: {
        strVal = '00089';
        break;
      }
      case AmountComponent.ChargePayable: {
        strVal = '00090';
        break;
      }
      case AmountComponent.ChargeReceivable: {
        strVal = '00091';
        break;
      }
      case AmountComponent.PastDueRentalswithTaxes: {
        strVal = '00092';
        break;
      }
      case AmountComponent.PVofRentalswithTaxes: {
        strVal = '00093';
        break;
      }
      case AmountComponent.SchedulePOSwithTaxes: {
        strVal = '00094';
        break;
      }
      case AmountComponent.InterestonETQuotewithTaxes: {
        strVal = '00095';
        break;
      }
      case AmountComponent.UnpaidTaxesofFutureRentals: {
        strVal = '00096';
        break;
      }
      case AmountComponent.MaintenanceinETQuote: {
        strVal = '00097';
        break;
      }
      case AmountComponent.InsuranceinETQuote: {
        strVal = '00098';
        break;
      }
      case AmountComponent.RegistrationinETQuote: {
        strVal = '00099';
        break;
      }
      case AmountComponent.LatePaymentPenalty: {
        strVal = '00100';
        break;
      }
      case AmountComponent.SundryChargeswithTaxes: {
        strVal = '00101';
        break;
      }
      case AmountComponent.ETPenalty: {
        strVal = '00102';
        break;
      }
      case AmountComponent.AdditionalCharges: {
        strVal = '00103';
        break;
      }
      case AmountComponent.DownPaymentRF: {
        strVal = '00104';
        break;
      }
      case AmountComponent.ETRoundingAmount: {
        strVal = '00105';
        break;
      }
      case AmountComponent.ETFromSOLOs: {
        strVal = '00106';
        break;
      }
      case AmountComponent.InsuranceCommission: {
        strVal = '00107';
        break;
      }
      case AmountComponent.DisbursementAmount: {
        strVal = '00108';
        break;
      }
      case AmountComponent.InterestonNumberofDaysatWriteOffCalculationDate: {
        strVal = '00109';
        break;
      }
      case AmountComponent.InterestonNumberofDaysatRedemptionExpiry: {
        strVal = '00110';
        break;
      }
      case AmountComponent.AdditionalCoverage: {
        strVal = '00112';
        break;
      }
      case AmountComponent.Comprehensive: {
        strVal = '00113';
        break;
      }
      case AmountComponent.TLO: {
        strVal = '00114';
        break;
      }
      case AmountComponent.FinancedAmount: {
        strVal = '00115';
        break;
      }
      case AmountComponent.ApplicationCharges: {
        strVal = '00116';
        break;
      }
      case AmountComponent.InsurancePremium: {
        strVal = '00117';
        break;
      }
      case AmountComponent.AdminFee: {
        strVal = '00118';
        break;
      }
      case AmountComponent.PolicyFee: {
        strVal = '00119';
        break;
      }
      case AmountComponent.ProvisionFee: {
        strVal = '00120';
        break;
      }
      case AmountComponent.FiduciaFee: {
        strVal = '00121';
        break;
      }
      case AmountComponent.BBNCharge: {
        strVal = '00122';
        break;
      }
      case AmountComponent.UpfrontAdminFee: {
        strVal = '00123';
        break;
      }
      case AmountComponent.FinancedAdminFee: {
        strVal = '00124';
        break;
      }
      case AmountComponent.DownpaymentSubsidy: {
        strVal = '00125';
        break;
      }
      case AmountComponent.InstallmentSubsidy: {
        strVal = '00126';
        break;
      }
      case AmountComponent.InterestSubsidyRateBased: {
        strVal = '00127';
        break;
      }
      case AmountComponent.InterestSubsidyFixedAmount: {
        strVal = '00128';
        break;
      }
      case AmountComponent.AdminFeeSubsidy: {
        strVal = '00129';
        break;
      }
      case AmountComponent.InsuranceSubsidy: {
        strVal = '00130';
        break;
      }
      case AmountComponent.ProvisionCommission: {
        strVal = '00131';
        break;
      }
      case AmountComponent.JP1Commission: {
        strVal = '00133';
        break;
      }
      case AmountComponent.Commission: {
        strVal = '00134';
        break;
      }
      case AmountComponent.B2BFee: {
        strVal = '00135';
        break;
      }
      case AmountComponent.DealerInsuranceCommission: {
        strVal = '00136';
        break;
      }
      case AmountComponent.AdminFeeCommission: {
        strVal = '00137';
        break;
      }
      case AmountComponent.UpfrontInsurancePremium: {
        strVal = '00138';
        break;
      }
      case AmountComponent.FinancedInsurancePremium: {
        strVal = '00139';
        break;
      }
      case AmountComponent.AROInsurancePremium: {
        strVal = '00140';
        break;
      }
      case AmountComponent.CapitalRepayment: {
        strVal = '00141';
        break;
      }
      case AmountComponent.FirstRental: {
        strVal = '00070';
        break;
      }
      case AmountComponent.UpfrontProvisionFee: {
        strVal = '00142';
        break;
      }
      case AmountComponent.FinancedProvisionFee: {
        strVal = '00143';
        break;
      }
      case AmountComponent.BankGain: {
        strVal = '00144';
        break;
      }
      case AmountComponent.WHTonSellingExpense: {
        strVal = '00145';
        break;
      }
      case AmountComponent.NetBookValue: {
        strVal = '00146';
        break;
      }
      case AmountComponent.Discount: {
        strVal = '00148';
        break;
      }
      case AmountComponent.NetRental: {
        strVal = '00149';
        break;
      }
      case AmountComponent.VAT: {
        strVal = '00150';
        break;
      }
      case AmountComponent.AssetCostWithoutVAT: {
        strVal = '00151';
        break;
      }
      case AmountComponent.InvoicedMonthlyLeaseFeewithoutVAT: {
        strVal = '00152';
        break;
      }
      case AmountComponent.InvoicedVATamountonMonthlyLeaseFee: {
        strVal = '00153';
        break;
      }
      case AmountComponent.VATonETPenaltyFee: {
        strVal = '00154';
        break;
      }
      case AmountComponent.InvoicedMonthlyLeaseFeewithVAT: {
        strVal = '00155';
        break;
      }
     
      case AmountComponent.OutStandingPrincipal: {
        strVal = '00168';
        break;
      }
      case AmountComponent.TotalUnpaidInstallement: {
        strVal = '00169';
        break;
      }
      case AmountComponent.OngoingInterest: {
        strVal = '00170';
        break;
      }
      case AmountComponent.UnpaidPanelty: {
        strVal = '00171';
        break;
      }
      case AmountComponent.AdditionalChanrges: {
        strVal = '00172';
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
    const enumVal = key as AmountComponent;

    switch (enumVal) {
      case AmountComponent.None: {
        strVal = 'None';
        break;
      }
      case AmountComponent.Rental: {
        strVal = 'Rental';
        break;
      }
      case AmountComponent.Principal: {
        strVal = 'Principal';
        break;
      }
      case AmountComponent.Interest: {
        strVal = 'Interest';
        break;
      }
      case AmountComponent.TAX: {
        strVal = 'TAX';
        break;
      }
      case AmountComponent.Insurance: {
        strVal = 'Insurance';
        break;
      }
      case AmountComponent.Registration: {
        strVal = 'Registration';
        break;
      }
      case AmountComponent.SundaryCharge: {
        strVal = 'Sundary Charge';
        break;
      }
      case AmountComponent.Overdue: {
        strVal = 'Overdue';
        break;
      }
      case AmountComponent.ChargesAmort: {
        strVal = 'Charges Amortization';
        break;
      }
      case AmountComponent.SecurityDeposit: {
        strVal = 'Security Deposit';
        break;
      }
      case AmountComponent.DownpaymentDeposit: {
        strVal = 'Down payment';
        break;
      }
      case AmountComponent.interestinRentalAmort: {
        strVal = 'Interest in Rental Amortization';
        break;
      }
      case AmountComponent.VatonRental: {
        strVal = 'VAT on Rental (If VAT is applicable)';
        break;
      }
      case AmountComponent.CommissionAmount: {
        strVal = 'Commission Amount';
        break;
      }
      case AmountComponent.SubsidyAmount: {
        strVal = 'Subsidy Amount';
        break;
      }
      case AmountComponent.IncomeAmort: {
        strVal = 'Income Amortization';
        break;
      }
      case AmountComponent.CommAmort: {
        strVal = 'Commission Amortization';
        break;
      }
      case AmountComponent.SubsidyAmort: {
        strVal = 'Subsidy Amortization';
        break;
      }
      case AmountComponent.RestructuringLumsum: {
        strVal = 'Restructuring Lumsum Amount';
        break;
      }
      case AmountComponent.Maintenance: {
        strVal = 'Maintenance';
        break;
      }
      case AmountComponent.TotalInterest: {
        strVal = 'Total Interest';
        break;
      }
      case AmountComponent.EarlyTermination: {
        strVal = 'ET Receipt';
        break;
      }
      case AmountComponent.Litigation: {
        strVal = 'Litigation';
        break;
      }
      case AmountComponent.LawyerFee: {
        strVal = 'Lawyer Fee';
        break;
      }
      case AmountComponent.CourtFee: {
        strVal = 'Court Fee';
        break;
      }
      case AmountComponent.JudgmentAmount: {
        strVal = 'Judgment Amount';
        break;
      }
      case AmountComponent.ShortfallAmount: {
        strVal = 'Shortfall Amount';
        break;
      }
      case AmountComponent.WriteoffAmount: {
        strVal = 'Write-off Amount';
        break;
      }
      case AmountComponent.AllCommissions: {
        strVal = 'All Commissions';
        break;
      }
      case AmountComponent.AssetCost: {
        strVal = 'Asset Cost';
        break;
      }
      case AmountComponent.Subsidy: {
        strVal = 'Subsidy';
        break;
      }
      case AmountComponent.EarlyTerminationReceiveable: {
        strVal = 'Early Termination Receiveable';
        break;
      }
      case AmountComponent.ProceedFromSaleOfAsset: {
        strVal = 'Proceed From Sale Of Asset';
        break;
      }
      case AmountComponent.VATApplicable: {
        strVal = 'VAT/GST Applicable';
        break;
      }
      case AmountComponent.ITConTAX: {
        strVal = 'ITC on TAX';
        break;
      }
      case AmountComponent.GSTAsITC: {
        strVal = 'GST as ITC';
        break;
      }
      case AmountComponent.DeductWHT: {
        strVal = 'Deduct WHT';
        break;
      }
      case AmountComponent.ITCClaimbackPercentage: {
        strVal = 'ITC Claimback Percentage';
        break;
      }
      case AmountComponent.TaxOnRental: {
        strVal = 'Tax On Rental';
        break;
      }
      case AmountComponent.TaxOnTotalInterest: {
        strVal = 'Tax On Total Interest';
        break;
      }
      case AmountComponent.WHTApplied: {
        strVal = 'WHT Applied';
        break;
      }
      case AmountComponent.TaxType: {
        strVal = 'Tax Type';
        break;
      }
      case AmountComponent.WHTApplicable: {
        strVal = 'WHT Applicable';
        break;
      }
      case AmountComponent.GSTVATC: {
        strVal = 'GST/VATC';
        break;
      }
      case AmountComponent.ITCPercentage: {
        strVal = 'ITC Percentage';
        break;
      }
      case AmountComponent.CommissionPayableTax: {
        strVal = 'Commission Payable Tax';
        break;
      }
      case AmountComponent.WHTonReceiveable: {
        strVal = 'WHT on Receiveable';
        break;
      }
      case AmountComponent.WHTonPayable: {
        strVal = 'WHT on Payable';
        break;
      }
      case AmountComponent.TaxOnReceievable: {
        strVal = 'Tax on Receievable';
        break;
      }
      case AmountComponent.TaxonPayable: {
        strVal = 'Tax on Payable';
        break;
      }
      case AmountComponent.SellingExpTax: {
        strVal = 'Selling Expense Tax';
        break;
      }
      case AmountComponent.WHTApplicableonSellingExpense: {
        strVal = 'WHT Applicable on Selling Expense';
        break;
      }
      case AmountComponent.ExcessIncomeTax: {
        strVal = 'Excess Income Tax';
        break;
      }
      case AmountComponent.TaxOnRecoverdShotfall: {
        strVal = 'Tax on Recoverd Shotfall';
        break;
      }
      case AmountComponent.TaxOnShotfall: {
        strVal = 'Tax on Shotfall';
        break;
      }
      case AmountComponent.TradeinAmount: {
        strVal = 'Trade in Amount';
        break;
      }
      case AmountComponent.Componants: {
        strVal = 'Componants';
        break;
      }
      case AmountComponent.AccessoriesCost: {
        strVal = 'Accessory Cost Less ITC Amount';
        break;
      }
      case AmountComponent.IntroducerSubsidy: {
        strVal = 'Introducer Subsidy';
        break;
      }
      case AmountComponent.ManufacturerSubsidy: {
        strVal = 'Manufacturer Subsidy';
        break;
      }
      case AmountComponent.CompulsoryInsurance: {
        strVal = 'Comprehensive';
        break;
      }
      case AmountComponent.VoluntaryInsurance: {
        strVal = 'TLO (Total Loss Only)';
        break;
      }
      case AmountComponent.FirstYearRegistration: {
        strVal = 'First Year Registration';
        break;
      }
      case AmountComponent.NextYearRegistration: {
        strVal = 'Next Year Registration';
        break;
      }
      case AmountComponent.FinanceCompanyFee: {
        strVal = 'Finance Company Fee';
        break;
      }
      case AmountComponent.RegistrationAuthorityFee: {
        strVal = 'Registration Authority Fee';
        break;
      }
      case AmountComponent.AgentFee: {
        strVal = 'Agent Fee';
        break;
      }
      case AmountComponent.ResidualValue: {
        strVal = 'ResidualValue';
        break;
      }
      case AmountComponent.ContractFinancedCharges: {
        strVal = 'Contract Financed Charges';
        break;
      }
      case AmountComponent.BidAmount: {
        strVal = 'Bid Amount';
        break;
      }
      case AmountComponent.RentalDeduction: {
        strVal = 'Rental Deduction';
        break;
      }
      case AmountComponent.RegisterAmount: {
        strVal = 'Register Amount';
        break;
      }
      case AmountComponent.ContractUpfrontCharges: {
        strVal = 'Contract Upfront Charges';
        break;
      }
      case AmountComponent.IRR: {
        strVal = 'IRR';
        break;
      }
      case AmountComponent.ApplicationUpfrontCharges: {
        strVal = 'Application Upfront Charges';
        break;
      }
      case AmountComponent.Charge: {
        strVal = 'Charge';
        break;
      }
      case AmountComponent.GeneralProvision: {
        strVal = 'General Provision';
        break;
      }
      case AmountComponent.Purchase: {
        strVal = 'Purchase';
        break;
      }
      case AmountComponent.Rebate: {
        strVal = 'Rebate';
        break;
      }
      case AmountComponent.Sales: {
        strVal = 'Sales';
        break;
      }
      case AmountComponent.FlatcancellationReceivables: {
        strVal = 'Flat cancellation Receivables';
        break;
      }
      case AmountComponent.FlatcancellationPenalty: {
        strVal = 'Flat cancellation Penalty';
        break;
      }
      case AmountComponent.AdditionalInterest: {
        strVal = 'Additional Interest';
        break;
      }
      case AmountComponent.InterestonPrincipaloutstanding: {
        strVal = 'Interest on Principal outstanding ';
        break;
      }
      case AmountComponent.OnRoadCost: {
        strVal = 'On Road Cost';
        break;
      }
      case AmountComponent.ChargePayable: {
        strVal = 'Charge Payable';
        break;
      }
      case AmountComponent.ChargeReceivable: {
        strVal = 'Charge Receivable';
        break;
      }
      case AmountComponent.PastDueRentalswithTaxes: {
        strVal = '"Past Due Rentals';
        break;
      }
      case AmountComponent.PVofRentalswithTaxes: {
        strVal = 'PV of Rentals';
        break;
      }
      case AmountComponent.SchedulePOSwithTaxes: {
        strVal = 'Schedule POS';
        break;
      }
      case AmountComponent.InterestonETQuotewithTaxes: {
        strVal = 'Interest on ET Quote';
        break;
      }
      case AmountComponent.UnpaidTaxesofFutureRentals: {
        strVal = 'UnpaidTaxesofFutureRentals';
        break;
      }
      case AmountComponent.MaintenanceinETQuote: {
        strVal = 'Maintenance in ET Quote';
        break;
      }
      case AmountComponent.InsuranceinETQuote: {
        strVal = 'Insurance in ET Quote';
        break;
      }
      case AmountComponent.RegistrationinETQuote: {
        strVal = 'Registration in ET Quote';
        break;
      }
      case AmountComponent.LatePaymentPenalty: {
        strVal = 'Late Payment Penalty';
        break;
      }
      case AmountComponent.SundryChargeswithTaxes: {
        strVal = 'Sundry Charge(s)';
        break;
      }
      case AmountComponent.ETPenalty: {
        strVal = 'ET Penalty';
        break;
      }
      case AmountComponent.AdditionalCharges: {
        strVal = 'AdditionalCharge(s)';
        break;
      }
      case AmountComponent.DownPaymentRF: {
        strVal = 'Down Payment RF';
        break;
      }
      case AmountComponent.ETRoundingAmount: {
        strVal = 'ET Rounding Amount';
        break;
      }
      case AmountComponent.ETFromSOLOs: {
        strVal = 'EarlyTermination';
        break;
      }
      case AmountComponent.InsuranceCommission: {
        strVal = 'OTO Insurance Commission';
        break;
      }
      case AmountComponent.DisbursementAmount: {
        strVal = 'Disbursement Amount';
        break;
      }
      case AmountComponent.InterestonNumberofDaysatWriteOffCalculationDate: {
        strVal = 'Interest on Number of Days at Write Off Calculation Date';
        break;
      }
      case AmountComponent.InterestonNumberofDaysatRedemptionExpiry: {
        strVal = 'Interest on Number of Days at Redemption Expiry';
        break;
      }
      case AmountComponent.AdditionalCoverage: {
        strVal = 'Additional Coverage';
        break;
      }
      case AmountComponent.Comprehensive: {
        strVal = 'Comprehensive';
        break;
      }
      case AmountComponent.TLO: {
        strVal = 'TLO';
        break;
      }
      case AmountComponent.FinancedAmount: {
        strVal = 'Financed Amount';
        break;
      }
      case AmountComponent.ApplicationCharges: {
        strVal = 'Application Charges';
        break;
      }
      case AmountComponent.InsurancePremium: {
        strVal = 'Insurance Premium';
        break;
      }
      case AmountComponent.AdminFee: {
        strVal = 'Admin Fee';
        break;
      }
      case AmountComponent.PolicyFee: {
        strVal = 'Policy Fee';
        break;
      }
      case AmountComponent.ProvisionFee: {
        strVal = 'Provision Fee';
        break;
      }
      case AmountComponent.FiduciaFee: {
        strVal = 'Fiducia Fee';
        break;
      }
      case AmountComponent.BBNCharge: {
        strVal = 'BBN Charge';
        break;
      }
      case AmountComponent.UpfrontAdminFee: {
        strVal = 'Upfront Admin Fee';
        break;
      }
      case AmountComponent.FinancedAdminFee: {
        strVal = 'Financed Admin Fee';
        break;
      }
      case AmountComponent.DownpaymentSubsidy: {
        strVal = 'Downpayment Subsidy';
        break;
      }
      case AmountComponent.InstallmentSubsidy: {
        strVal = 'Installment Subsidy';
        break;
      }
      case AmountComponent.InterestSubsidyRateBased: {
        strVal = 'Interest Subsidy-Rate Based';
        break;
      }
      case AmountComponent.InterestSubsidyFixedAmount: {
        strVal = 'Interest Subsidy-Fixed Amount';
        break;
      }
      case AmountComponent.AdminFeeSubsidy: {
        strVal = 'Admin Fee Subsidy';
        break;
      }
      case AmountComponent.InsuranceSubsidy: {
        strVal = 'Insurance Subsidy';
        break;
      }
      case AmountComponent.ProvisionCommission: {
        strVal = 'Provision Commission';
        break;
      }
      case AmountComponent.JP1Commission: {
        strVal = 'Commission';
        break;
      }
      case AmountComponent.Commission: {
        strVal = 'SOF Commission';
        break;
      }
      case AmountComponent.B2BFee: {
        strVal = 'B2B Fee';
        break;
      }
      case AmountComponent.DealerInsuranceCommission: {
        strVal = 'Insurance Commission';
        break;
      }
      case AmountComponent.AdminFeeCommission: {
        strVal = 'Admin Fee Commission';
        break;
      }
      case AmountComponent.UpfrontInsurancePremium: {
        strVal = 'Insurance Premium';
        break;
      }
      case AmountComponent.FinancedInsurancePremium: {
        strVal = 'Financed Insurance Premium';
        break;
      }
      case AmountComponent.AROInsurancePremium: {
        strVal = 'ARO';
        break;
      }
      case AmountComponent.CapitalRepayment: {
        strVal = 'Capital Repayment';
        break;
      }
      case AmountComponent.FirstRental: {
        strVal = 'First Rental';
        break;
      }
      case AmountComponent.UpfrontProvisionFee: {
        strVal = 'Upfront Provision Fee';
        break;
      }
      case AmountComponent.FinancedProvisionFee: {
        strVal = 'Financed Provision Fee';
        break;
      }
      case AmountComponent.BankGain: {
        strVal = 'Bank Gain';
        break;
      }
      case AmountComponent.WHTonSellingExpense: {
        strVal = 'WHT on Selling Expense';
        break;
      }
      case AmountComponent.NetBookValue: {
        strVal = 'Net Book Value';
        break;
      }
      case AmountComponent.Discount: {
        strVal = 'Discount';
        break;
      }
      case AmountComponent.NetRental: {
        strVal = 'Net Rental';
        break;
      }
      case AmountComponent.VAT: {
        strVal = 'VAT';
        break;
      }
      case AmountComponent.AssetCostWithoutVAT: {
        strVal = 'Asset Cost Without VAT';
        break;
      }
      case AmountComponent.InvoicedMonthlyLeaseFeewithoutVAT: {
        strVal = 'Invoiced Monthly Lease Fee without VAT';
        break;
      }
      case AmountComponent.InvoicedVATamountonMonthlyLeaseFee: {
        strVal = 'Invoiced VAT amount on Monthly Lease Fee';
        break;
      }
      case AmountComponent.VATonETPenaltyFee: {
        strVal = 'VAT on ET Penalty Fee';
        break;
      }
      case AmountComponent.InvoicedMonthlyLeaseFeewithVAT: {
        strVal = 'Invoiced Monthly Lease Fee with VAT';
        break;
      }
      
      case AmountComponent.OutStandingPrincipal: {
        strVal = 'Outstanding Principal';
        break;
      }
      case AmountComponent.TotalUnpaidInstallement: {
        strVal = 'Total Unpaid Installment';
        break;
      }
      case AmountComponent.OngoingInterest: {
        strVal = 'On Going Interest';
        break;
      }
      case AmountComponent.UnpaidPanelty: {
        strVal = 'Unpaid Penalty';
        break;
      }
      case AmountComponent.AdditionalChanrges: {
        strVal = 'Additional Charges';
        break;
      }
      default: {
        strVal = 'Component not exist in Enum';
        break;
      }
    }

    return strVal;
  }
  export function GetStringValueByCode(code: string): string {
    let strVal='';
    switch(code){
      case "00030":{
        strVal="Asset Cost"
        break;
      }
      case "00058":{
        strVal="Accessories Cost"
        break;
      }
      case "00148":{
        strVal="Discount"
        break;
      }
      case "00029": {
        strVal = 'All Commissions';
        break;
      }
      case "00011":{
        strVal = 'Down Payment';
        break;
      }
      case "00138":{
        strVal = 'Insurance Premium';
        break;
      }
      case "00116":{
        strVal = 'Application Charges';
        break;
      }
      case "00123":{
        strVal = 'Upfront Admin Fee';
        break;
      }
      case "00070":{
        strVal = 'First Rental';
        break;
      }
      case "00121":{
        strVal = 'Fiducia Fee';
        break;
      }
      case "00142":{
        strVal = 'Upfront Provision Fee';
        break;
      }
      case "00119": {
        strVal = 'Policy Fee';
        break;
      }
      case "00120": {
        strVal = 'Provision Fee';
        break;
      }
      case "00118": {
        strVal = 'Admin Fee';
        break;
      }
      default: {
        strVal = 'Add description in Enum';
        break;
      }
      
    }
    return strVal;
  }
  export function GetEnumByCode(code : string) : AmountComponent{
    switch(code){
      case "00030":{
        return AmountComponent.AssetCost;
      }
      case "00107":{
        return AmountComponent.InsuranceCommission;
      }
      default: {
        return AmountComponent.None;
      }
    }    
  }

}
