import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { IPRPL_APLT_COMYInfo } from "./ProposalApplicantEntity.model.index";

export interface ICompanyApplicantEntity extends IBaseEntity {
    PROPOSALAPPLICANTCOMPANY: IPRPL_APLT_COMYInfo;

}