import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_COMMInfo extends IBaseEntity {
    PROPOSALID: number;
    ASSETID: number;
    BRANCHID: number;
    DEALERID: number;
    ISPROVISIONFEECOMMISSIONCAR: boolean;
    ISADMINFEECOMMISSIONCAR: boolean;
    ISMARKETINGCOMMISSIONCAR: boolean;
    ISINSURANCECOMMISSIONCAR: boolean;
    ISMARKETINGCOMMISSIONBIKE: boolean;
    ISINSURANCECOMMISSIONBIKE: boolean;
    ISPROVISIONFEECOMMISSIONBIKE: boolean;
    ISADMINFEECOMMISSIONBIKE: boolean;
    ISCOMSYSJP2COMMISSIONBIKE: boolean;
    ISCOMSYSJP2COMMISSIONCAR: boolean;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    //CODE: string;
    OJKCOMMISSIONEFFECTIVEDTE: Control<Date> | null;
    OJKMAXCOMMISSIONPCT: number;
    ISCOMMISSIONCAR: boolean;
    ISCOMMISSIONBIKE: boolean;
    UNALLOCATEDEXPENSEPCT: number;
    UNALLOCATEDEXPENSEAMT: number;
    OJKMAXCOMMISSIONPCTATFC: number;
    COMMISSIONAMOUNTTYPECDE: string;
}