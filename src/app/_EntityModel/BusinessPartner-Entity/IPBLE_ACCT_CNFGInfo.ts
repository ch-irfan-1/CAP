import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPBLE_ACCT_CNFGInfo extends IBaseEntity {
    PBLEACCTCNFGSEQID: number;
    BUSINESSPARTNERID: number;
    ACCOUNTSEQ: number;
    PAYABLETYPECDE: string;
    EXECUTIONDTE: Control<Date>;
    SESSIONID: number;
    SESSIONCDE: string;
    EXECUTIONOFFSET: number;
    ACCOUNTNBR: string;
    BANKBPID: number;
    BANKNME: string;
    ACCOUNTNME: string;
    REQUESTBPID: number;
    DATASTS: string;
    ISWORKQUEREQUEST: boolean;
    NEWDATAIND: boolean;
    EDITDATAIND: boolean;
    DELETEDATAIND: boolean;
    OLDACCOUNTSEQ: number;
    ISVATREGISTER: boolean;
    CLASSIFICATIONCDE: string;
}