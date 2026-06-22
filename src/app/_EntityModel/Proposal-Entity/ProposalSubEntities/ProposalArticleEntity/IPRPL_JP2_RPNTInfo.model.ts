import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_JP2_RPNTInfo extends IBaseEntity {
    COMMISSIONTYPEDSC: string;
    ROLEDSC: string;
    RECIPIENTNME: string;
    // above properties are from helper class
    JP2RPNTSEQID: number;
    PROPOSALID: number;
    ASSETID: number;
    COMMISSIONTYPECDE: string;
    //CODE: string;
    ROLECDE: string;
    RECIPIENTID: number;
    JP2SCHEMECOMMISSIONPCT: number;
    JP2SCHEMECOMMISSIONAMT: number;
    VISIBLEIND: boolean;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    TAXINCLUSIVEAMT: number;
    TAXEXCLUSIVEAMT: number;
    JP2SCHMEACCBANKID: number;
    JP2SCHMEACCBANKNME: string;
    JP2SCHMEACCNBR: string;

}