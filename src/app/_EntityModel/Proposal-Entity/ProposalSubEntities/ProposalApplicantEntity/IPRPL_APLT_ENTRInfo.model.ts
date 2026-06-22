import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_APLT_ENTRInfo extends IBaseEntity {
    ENTERPRENUERID: number;
    APPLICANTID: number;
    BUSINESSNME: string;
    ESTABLISHMENTMONTH: string;
    MONTHLYPROFIT: number;
    TOTALEMPLOYEE: number;
    ESTABLISHMENTYEAR: string;
    BUSINESSSTATUSLOCATION: string;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
}