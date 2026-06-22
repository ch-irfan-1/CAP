import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { IPRPL_APLT_ADDSInfo, IPRPL_APLT_ADDS_RESEInfo, IPRPL_APLT_PHNE_FAXInfo, IPRPL_ADDS_TYP_DETLInfo } from "./ProposalApplicantEntity.model.index";

export interface IAddressEntity extends IBaseEntity {
    PROPOSALAPPLICANTADDRESS: IPRPL_APLT_ADDSInfo;
    //PROPOSALAPPLICANTRESIDANCE: IPRPL_APLT_ADDS_RESEInfo;
    PROPOSALAPPLICANTPHONEFAX: Array<IPRPL_APLT_PHNE_FAXInfo>;
    PROPOSALADDRESSTYPEDETAIL: Array<IPRPL_ADDS_TYP_DETLInfo>;

}