import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface ISTND_INSR_DETL_CHRTInfo extends IBaseEntity {        
    INSRTYPECDE: string;
    REGIONCDE: string;
    ASSETTYPECDE: string;
    ASSETSUBTYPECDE: string;
    SUMINSUREDAMNT: number;
    ADDITIONALCOVERAGECDE: string;
    EXTENSIONTYPECDE: string;
    TPLCOVERAGEAMNT: number;
    MININSRPREMIUMRTE: number;
    MAXINSRPREMIUMRTE: number;
    DEFAULTPREMIUMRTE: number;
    TPLRATE: number;
    COVERAGEIND: boolean;
}