import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_APLT_SPUS_DETLInfo extends IBaseEntity {
    CURRENCYSYMBOL: string;
    // above property from helper class
    APPLICANTID: number;
    SPOUSEID: number;
    IDCARDTYP: string;
    IDCARDNBR: string;
    TITLECDE: string;
    FIRSTNME: string;
    MIDDLENME: string;
    LASTNME: string;
    NOOFSONS: number;
    NOOFDAUGHTERS: number;
    OCCUPATIONCDE: string;
    MONTHLYINCOME: number;
    NATIONALITYCDE: string;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    POSITIONCDE: string;
    PLACEOFWORK: string;
    OTOAGMTCDE: string;
    SPOUSEADDRESS: string;
    ALIASNAME: string;
    BIRTHPLACE: string;
    TOTALINCOME: number;
    EXPIRYIDDATE: Control<Date>;
    BIRTHDATE: Control<Date>;
    JOININGDATE: Control<Date>;
    BUSINESSTYPECDE: string;
    EMPLOYEESTATUSCDE: string;
}