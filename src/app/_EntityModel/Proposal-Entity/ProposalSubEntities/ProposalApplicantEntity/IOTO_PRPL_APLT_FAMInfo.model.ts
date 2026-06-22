import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IOTO_PRPL_APLT_FAMInfo extends IBaseEntity {
    APPLICANTID: number;
    FAMCDE: number;
    //CODE: number;
    NAME: string;
    FAMCRDNUM: string;
    RELATIONSHIPCDE: string;
    OCCUPATIONCDE: string;
    DATEOFBIRTH: Control<Date>;
    GENDER: string;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    NEWDATAIND: boolean;
    BPFAMSEQID: number;
    ISSPOUSEIND: boolean;
    FAMLIYSEARCHCRITERIA: string;
    //Helper Properties
    INDEX: number;
    VLDMSGIND: number;
}