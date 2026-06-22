import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";

export interface COMPANYSYSUSER extends IBaseEntity {
    BPPRIMARYID: number;
    BPSECONDARYID: number;
    BRANCHCURRENCYCODE: string;
    BRANCHHEAD: boolean;
    BRANCHNME: string;
    BUSINESSCUTOFFTIME: string;
    CODE?: any;
    COMPANYADDRESS: string;
    COMPANYBRANCHNAME: string;
    COMPANYCURRENCYCODE: string;
    COMPANYNME: string;
    COMPANYSETTLEMENTMODELCDE?: any;
    COUNTRYCDE: string;
    CURRENCYROUNDINGSCALE: number;
    DATEFORMAT?: any;
    DATEFORMATCODE?: any;
    DEALERASSNCODE: string;
    DEFAULTIND: boolean;
    EXECUTIONDTE: string;
    FAXNO?: any;
    FiscalMonthCode: string;
    ISOTO: boolean;
    MANUALLYASSIGNEDIND: boolean;
    OPERATINGTIMEZONE: number;
    PERCENTAGEROUNDINGSCALE: number;
    PROCESSINGDTE: string;
    RATEROUNDINGSCALE: number;
    RELATIONSHIPCDE?: any;
    SESSIONCDE: string;
    SESSIONID: number;
    TAXID?: any;
    USERID: number;
}