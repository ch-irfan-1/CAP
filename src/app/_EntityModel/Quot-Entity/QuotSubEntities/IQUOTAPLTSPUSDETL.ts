import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";

export interface IQUOTAPLTSPUSDETL extends IBaseEntity {
    QUOTAPPLICANTSPOUSDETAILID: number,
    QUOTAPPLICANTID: number,
    FIRSTNME: string,
    MIDDLENME: string,
    LASTNME: string,
    IDTYPENBR: string,
    CODE: string

}