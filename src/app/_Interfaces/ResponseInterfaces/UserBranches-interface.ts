export interface IUserBranches{
    BPPRIMARYID: number;
    BPSECONDARYID: number;
    RELATIONSHIPCDE: string;
    CODE: string
    USERID: number;
    DEFAULTIND: boolean;
    MANUALLYASSIGNEDIND: boolean;
    COMPANYNME: string;
    BRANCHNME: string;
    COMPANYCURRENCYCODE: string;
    BRANCHCURRENCYCODE: string;
    COMPANYBRANCHNAME: string
    COMPANYSETTLEMENTMODELCDE: string
    FiscalMonthCode: string
    DATEFORMATCODE: string
    DATEFORMAT: string
    CURRENCYROUNDINGSCALE: number;
    ISOTO: boolean;
    PERCENTAGEROUNDINGSCALE: number
    RATEROUNDINGSCALE: number;
    OPERATINGTIMEZONE: number;
    BUSINESSCUTOFFTIME: Date;
    COMPANYADDRESS: string;
    COUNTRYCDE: string;
    TAXID: string;
    PHONENO: string;
    FAXNO: string;
    BRANCHHEAD: Boolean;
    DEALERASSNCODE: string;

}
