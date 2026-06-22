import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_CRDT_CARD_DETLInfo extends IBaseEntity {
    APPLICANTID: number;
    CREDITCARDID: number;
    CARDTYPCDE: string;
    CARDNBR: string;
    BANKNME: string;
    CREDITLIMIT: number;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
}