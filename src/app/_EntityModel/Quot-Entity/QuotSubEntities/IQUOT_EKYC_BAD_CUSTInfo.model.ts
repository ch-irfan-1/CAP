import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IQUOT_EKYC_BAD_CUSTInfo extends IBaseEntity{
    Answer:string;
    CustomerStatus: string;
    SpouseStatus: string;
    evaluationDte: Control<Date>;
    requestType: string;
}