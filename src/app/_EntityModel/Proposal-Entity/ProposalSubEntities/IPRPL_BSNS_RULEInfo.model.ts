import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_BSNS_RULEInfo extends IBaseEntity {
    PROPOSALID: number;
    BUSINESSRULECDE: string;
    RULETYP: string;
    WAVIEDIND: boolean;
    EXECUTIONDTE: Control<Date>;    
    COMMENTSTXT: string;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    STATUSCHANGEDBY: string;
    STATUSCHANGEDDTE: Control<Date>;
    RULESTS: boolean;
    // following properties are from helper class
    CRITERIA: string;
    USERNME: string;
    USERCANWAIVERIGHTS: string;
    BUSINESSRULENME: string;

}