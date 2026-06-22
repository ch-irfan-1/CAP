import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IQUOT_EKYC_NPWP_TAXInfo extends IBaseEntity{
    npwp: string;
    nik: string;
    match_result: string;
    matchResult: string;
    income: string;
    evaluationDte: string;
}