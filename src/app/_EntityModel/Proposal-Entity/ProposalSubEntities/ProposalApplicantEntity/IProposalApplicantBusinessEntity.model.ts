import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";
import { IPRPL_APLT_BUSInfo, IPRPL_APLT_BUS_SUPPInfo } from "./ProposalApplicantEntity.model.index";

export interface IProposalApplicantBusinessEntity extends IBaseEntity {
    PRPLAPLTBUS: IPRPL_APLT_BUSInfo;
    PRPLAPLTBUSSUPP: Array<IPRPL_APLT_BUS_SUPPInfo>;
}