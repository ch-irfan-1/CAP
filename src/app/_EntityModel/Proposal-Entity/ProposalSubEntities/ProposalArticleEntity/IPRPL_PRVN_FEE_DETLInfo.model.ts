import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_PRVN_FEE_DETLInfo extends IBaseEntity {
    MINPROVISIONFEE: number;
    MAXPROVISIONFEE: number;
    // above properties are from helper class
    PRPLPRVNFEEDETLSEQID: number;
    SESSIONID: number;
    SESSIONCDE: string;
    //CODE: string;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    PROPOSALID: number;
    ASSETID: number;
    TOTALPROVISIONFEE: number;
    PROVISIONFEEPERCENTAGE: number;
    PROVISIONFEECOMMISSION: number;
    PROVISIONFEEFINANCED: number;
    PROVISIONFEEUPFRONT: number;
    MAXCOMMISSIONPERCENTAGE: number;
    MAXPROVISIONFEEPERCENTAGE: number;
    MINPROVISIONFEEPERCENTAGE: number;
    RECEIVEDBYDEALERIND: boolean;
    ACTIVEIND: boolean;
}