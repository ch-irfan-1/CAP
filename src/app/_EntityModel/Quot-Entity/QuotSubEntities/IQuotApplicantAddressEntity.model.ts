import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { IQUOT_APLT_ADDS_DETLInfo, IQUOT_APLT_ADDSInfo, IQUOT_APLT_PHNE_FAXInfo } from "../Quot.model.index";

export interface IQuotApplicantAddressEntity extends IBaseEntity {
  QUOTAPLTADDS: IQUOT_APLT_ADDSInfo;
  QUOTAPLTADDSDETL: Array<IQUOT_APLT_ADDS_DETLInfo>;
  QUOTAPLTPHNEFAX: Array<IQUOT_APLT_PHNE_FAXInfo>;
  }