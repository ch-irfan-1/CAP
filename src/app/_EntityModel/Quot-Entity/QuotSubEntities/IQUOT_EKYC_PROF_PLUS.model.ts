import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IQUOT_EKYC_PROF_PLUS extends IBaseEntity{
    nik: string;
    Name: string;
    BirthPlace: string;
    BirthDate: string;
    evaluationDte: string;
    Address: string;
    Identity_Photo: string;
    Selfie_Photo: string;
    Phone: string;
    Mother: string;
    Mother_Name: string;
    Message: string;
}