import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { IPRPL_APLT_INDVInfo, IPRPL_APLT_EMPTInfo, IPRPL_APLT_SPUS_DETLInfo, IOTO_PRPL_APLT_FAMInfo, IPRPL_APLT_ENTRInfo, IFamilyExposureEntity } from "./ProposalApplicantEntity.model.index";

export interface IIndividualApplicantEntity extends IBaseEntity {
    PROPOSALAPPLICANTINDIVIDUAL: IPRPL_APLT_INDVInfo;
    PROPOSALAPPLICANTEMPLOYMENT: Array<IPRPL_APLT_EMPTInfo>;
    PROPOSALAPPSPOUSEDETAIL: Array<IPRPL_APLT_SPUS_DETLInfo>;
    PROPOSALAPPFAMILY: Array<IOTO_PRPL_APLT_FAMInfo>;
    PROPOSALAPPLICANTENTERPRENUER: IPRPL_APLT_ENTRInfo;
    FAMILYEXPOSURE: Array<IFamilyExposureEntity>;
}