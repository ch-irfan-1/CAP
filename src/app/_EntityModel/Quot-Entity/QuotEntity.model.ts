import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { IQUOT_ADDL_INFOInfo, IQuotApplicantEntity, IQUOT_DOCTInfo, IQUOTInfo } from "./Quot.model.index";
import { IEGLE_SCREInfo } from "./QuotSubEntities/IEGLE_SCREInfo.model";
import { IQUOT_FINLInfo } from "./QuotSubEntities/IQUOT_FINLInfo.model";

export interface IQuotEntity extends IBaseEntity {
  QUOT: IQUOTInfo;
  QUOTADDLINFO: IQUOT_ADDL_INFOInfo;
  QUOTFINL: IQUOT_FINLInfo;
  QUOTDOCT: Array<IQUOT_DOCTInfo>;
  QUOTAPPLICANT: Array<IQuotApplicantEntity>;
  EGLESCRE: Array<IEGLE_SCREInfo>
  }