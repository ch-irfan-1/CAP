import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_APLT_MAINInfo extends IBaseEntity {
    APPLICANTID: number;
    TABID: number;
    APPLICANTTYP: string;
    APPLICANTNME: string;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    //CODE: string
    BUSINESSPARTNERID: number;
    CREDITLINEAMT: number;
    //STARTDTE: Control<Date>;
    //ENDDTE: Control<Date>;
    OUTSTANDINGAMT: number;
    ACTIVE: boolean;
    BPEXISTIND: boolean;
    MONTHONBOOK: number;
    TIMEONBOOK: number;
    INVCOPTNCDE: string| null;
    ACCTYPCDE: string | null;
    // following properties are in helper class
    SIGNATUREVERIFIED: boolean;
    DATEOFBIRTH: Control<Date> | null;
    ROLECDE: string;
    GuarantorCount: number;
    CoBorrowerCount: number;
    APPLICANTALIAS: string;
    APPLICANTTRUSTNAME: string;
    OLDAPPLICANTID: number;    
}