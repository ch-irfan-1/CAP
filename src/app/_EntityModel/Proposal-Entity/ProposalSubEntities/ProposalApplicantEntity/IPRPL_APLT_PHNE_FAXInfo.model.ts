import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_APLT_PHNE_FAXInfo extends IBaseEntity {
    DEFAULTPHNEFAX: boolean;
    PHNEFAX: boolean;
    VISIBLE: boolean;
    INVISIBLE: boolean;
    PHONETYPEDSC: string;
    COUNTRYDSC: string;
    // above properties are in helper class
    PHONESEQID: number;
    APPLICANTID: number;
    ADDRESSID: number;
    COUNTRYCODE: string;
    PHONETYPECDE: string;
    AREACODE: string;
    FAXPHONEIND: string;
    NUMBER: string;
    BUSINESSTELEPHONEIND: string;
    EXTENSIONNBR: string;
    VERIFIEDIND: string;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    BPPHNESEQID: number;
    NEWDATAIND: boolean;
    DEFAULTIND: boolean;
    USEFORSMSIND: boolean;
    PRPLIDSEQ: number;
    ISFROMISURE: boolean;
}