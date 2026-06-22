import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_TPLE_ROND_DETLInfo extends IBaseEntity {
    RONDSEQID: number;
    RONDTYPECDE: string;
    RONDPRESLVL: number;
    AMNTCMPTCDE: string;
    AMNTSUBCMPTCDE: string;
    MODULECDE: string;
    TPLEID: number;
    ACTIVEIND: boolean;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    PRPLTPLERONDSEQID: number;

}