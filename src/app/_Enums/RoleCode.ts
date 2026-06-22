export enum RoleCode {

    None = "00000",
    Dealer = "00001",
    Supplier = "00002",
    Borrower = "00003",
    CoBorrower = "00004",
    Guarantor = "00005",
    RepossessionAgent = "00006",
    PoliceStation = "00007",
    InsuranceCompany = "00008",
    RemoteUsers = "00009",
    LocalUsers = "00010",
    SubsidaryCompany = "00011",
    Salesperson = "00012",
    MarketingOfficer = "00013",
    Evaluators = "00014",
    Bank = "00015",
    Branch = "00016",
    WareHouseStorageLocation = "00017",
    Lawyer = "00018",
    Court = "00019",
    Bidder = "00020",
    InactiveBorrower = "00021",
    InactiveGuarantor = "00022",
    BlockDiscountingBorrower = "00023",
    Broker = "00024",
    DealerRelationshipManager = "00025",
    AutoWorkshop = "00026",
    Others = "00027",
    SoleProprietor = "00028",
    Partnership = "00029",
    SecuritizationCompany = "00030",
    Inspector = "00031",
    Novator = "00032",
    InactiveCoBorrower = "00033",
    InactiveNovator = "00034",
    CollectionOfficer = "00035",
    InsuranceBroker = "00036",
    Manufacturer = "00037",
    RelationshipManager = "00039",
    Prospect = "00040",
    PrincipalCompany = "00060",
    Approver = "00091",
    FandI = "00092",
    FieldVisitAgent = "00093",
    ParentCompany = "00094",
    SubsidaryBranchCompany = "00095",
    MaintenanceWorkshop = "00096",
    RegistrationAuthority = "00097",
    RegistrationAgent = "00098",
    AuctionHouse = "00099",
    Introducer = "00101",
    Distributor = "00041",
    Showroom = "00102",
    Auditor = "00042",
    Group = "00040",
    ContactPerson = "00103",
    FIAgent = "00104",
    BBNAgent = "00105",
    DealershipOwner = "00106",
    Director = "00107",
    GeneralManager = "00108",
    AreaManager = "00109",
    ShopManager = "00110",
    SPV = "00111",
    Counter = "00112",
    Salesman = "00113",
    Additional = "00114",
    InsuranceCompanyBranch = "00115"
}

export namespace RoleCode {
export function GetStringValueByCode(code: string): string {
    let strVal='';
    switch(code){
      case "00003":{
        strVal="Borrower"
        break;
      }
      case "00004":{
        strVal="Co-Borrower"
        break;
      }
      case "00005":{
        strVal="Guarantor"
        break;
      }
    }
    return strVal;
}
}