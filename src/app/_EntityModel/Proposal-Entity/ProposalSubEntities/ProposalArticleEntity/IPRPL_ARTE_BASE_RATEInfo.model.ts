import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_ARTE_BASE_RATEInfo extends IBaseEntity {
    PRPLARTEBASERATEID: number;
    PROPOSALID: number;
    ASSETID: number;
    SLABFROM: number;
    SLABTO: number;    
    EFFECTIVEDATE: Control<Date>;
    BASERATE: number;
    INTERESTRTE: number;
    APPLIEDCUSTOMERRTE: number;
    OVERDUEINTERESTAMT: number;
    OVERDUEINTERESTRTE: number;
    FINANCIERMARGINRTE: number;
    CUSTOMERMARGINRTE: number;
    FINANCIERMARGINPCT: number;
    CUSTOMERMARGINPCT: number;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    RECORDVER: number;
    SESSIONID: number;
    SESSIONCDE: string;
    ACTIVEIND: boolean;
    MARGINTYP: string;
    REQTTYPECDE: string;
    STATUSCDE: string;
}
    