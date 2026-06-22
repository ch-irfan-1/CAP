import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_TRCK_DETLInfo extends IBaseEntity {
    TRCKDETLID : number;
    PROPOSALID: number;
    ASSETID: number;
    BUSINESSTYPECDE: string;
    YEAROFOWNTRUCK: Control<Date>;
    HANDPHONENUMBER: string;
    NOOFLABOURS: number;
    PRIVATEWORKSHOPIND: boolean;
    BODYTYPECDE: string;
    LISCENCEPLATECOLORCDE: string;
    VEHICLEBODY: string;
    TRUCKPRICE: number;
    TRUCKBODYPRICE: number;
    TOTALPRICE: number;
    PURCHASINGOBJECTIVECDE: string;
    OPERATINGOBJECTIVECDE: string;
    OPERATINGLOCATION: string;
    DISTANCELOCATIONCDE: string;
    TOTALREVENUE: number;
    INCOMINGREVENUEMETHOD: string;
    COUNTRYID: number;
    PROVINCEID: number;
    KOTAMADYAIDOTO: number;
    KECAMATANIDOTO: number;
    KELURAHANIDOTO: number;
    RWOTO: string;
    RTOTO: string;
    ADDRESSOTO: string;
    POSTALCODE: string;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    // following property is from helper class
    TOTALNUMBEROFUNITS: number;
}