import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { IQuotApplicantAddressEntity, IQUOT_APLT_ID_DETLInfo, IQUOT_APLTInfo } from "../Quot.model.index";
import { IQUOTAPLTSPUSDETL } from "./IQUOTAPLTSPUSDETL";

export interface IQuotApplicantEntity extends IBaseEntity {
  QUOTAPLT: IQUOT_APLTInfo;
  QUOTAPLTIDDETL: Array<IQUOT_APLT_ID_DETLInfo>;
  QUOTAPPLICANTADDRESS: Array<IQuotApplicantAddressEntity>;
  QUOTAPLTSPUSDETL: IQUOTAPLTSPUSDETL;
  }