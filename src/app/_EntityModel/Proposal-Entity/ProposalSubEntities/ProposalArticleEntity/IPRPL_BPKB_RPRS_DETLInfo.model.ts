import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";
import { IBP_DSGN_CODEInfo } from "./ProposalArticleEntity.model.index";

export interface IPRPL_BPKB_RPRS_DETLInfo extends IBaseEntity {
    PRPLBPKBRPRSSEQID: number;
    PROPOSALID: number;
    ASSETID: number;
    REPRESENTATIVEKTPID: string;
    REPRESENTATIVENME: string;
    REPRESENTATIVEDESIGNATION: string;
    REPRESENTATIVEADDRESS: string;
    EXECUTIONDTE: Control<Date> | null;
    EXECUTIONOFFSET: number;
    ACTIVEIND: boolean;
    SESSIONID: number;
    SESSIONCDE: string;
    // following properties are from helper class
    //BPDSGNCODE: Array<IBP_DSGN_CODEInfo>;
    REPRESENTATIVEDESIGNATIONDSC: string;
}