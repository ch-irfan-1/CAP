import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IBP_DSGN_CODEInfo extends IBaseEntity {
    DESIGNATIONCDE: string;
    DESIGNATIONDSC: string;
    EXECUTIONDTE: Control<Date>;
    ACTIVEIND: boolean;
    SYSIND: boolean;
    LANGUAGECDE: string;
    EXECUTIONOFFSET: number;
    RECORDVER: number;
    SESSIONID: number;
    SESSIONCDE: string;
    BPDESIGNATIONSEQID: number;
    EXTERNALCODE: string;
    SINGLEBRANCHASSOCIATION: boolean;
    DCDESIGNATIONIND: boolean;
    PEPLSOFTDSGNCODE: string;
    PEPLSOFTLASTUPDATE: Control<Date>;
    SINGLEBRANCHDESIGNATION: boolean;
    SINGLETEAMLEADASSOCIATION: boolean;
    // following property is from helper class
    LASTUPDDTTM: Control<Date>;
    
    
}