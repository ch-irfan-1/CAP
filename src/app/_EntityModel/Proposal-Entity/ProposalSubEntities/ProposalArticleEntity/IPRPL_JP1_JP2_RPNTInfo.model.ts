import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_JP1_JP2_RPNTInfo extends IBaseEntity {
    COMMISSIONTYPEDSC: string;
    // above propert from helper class
    JP1JP2RPNTSEQID: number;
    PROPOSALID: number;
    ASSETID: number;
    COMMISSIONTYPECDE: string;
    //CODE: string;
    ROLECDE: string;
    RECIPIENTID: number;
    JP1COMMISSIONAMT: number;
    JP2COMMISSIONAMT: number;
    VISIBLEIND: boolean;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    JP1COMMISSIONPCT: number;
    JP2COMMISSIONPCT: number;
    JP1ACTIVEIND: boolean;
    JP2ACTIVEIND: boolean;
    JP1DEFAULTPCT: number;
    JP2DEFAULTPCT: number;
    ROLEDSC: string;
    RECIPIENTNME: string;
    JP1TAXINCLUSIVEAMT: number;
    JP1TAXEXCLUSIVEAMT: number;
    JP2TAXINCLUSIVEAMT: number;
    JP2TAXEXCLUSIVEAMT: number;
    JP1ACCBANKID: number;
    JP2ACCBANKID: number;
    JP1ACCBANKNME: string;
    JP2ACCBANKNME: string;
    JP1ACCNBR: string;
    JP2ACCNBR: string;
    ISVATAPPLICABLE: boolean;
    ISWHTAPPLICABLE: boolean;
    PreviousBPId: number;
    filterData:string;
}