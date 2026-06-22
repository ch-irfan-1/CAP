import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";
import {IPRPL_RPMT_PLANInfo, IPRPL_RPMT_PLAN_TAXInfo} from './ProposalArticleEntity.model.index';

export interface IProposalRepaymentPlanEntity extends IBaseEntity {
    PRPLRPMTPLAN: IPRPL_RPMT_PLANInfo;
    PRPLRPMTPLANTAX: Array<IPRPL_RPMT_PLAN_TAXInfo>;
}