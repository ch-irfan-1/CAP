import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";
import {IPRPL_CHRGInfo, IPRPL_CHRG_TAXInfo} from './ProposalArticleEntity.model.index';

export interface IProposalChargeEntity extends IBaseEntity {
    PRPLCHRG: IPRPL_CHRGInfo;
    PRPLCHRGTAX: Array<IPRPL_CHRG_TAXInfo>;
    // following properties are from helper class
    TAXINCULSIVEAMT: number;
    TAXEXCULSIVEAMT: number;
    ISENABLED: boolean;
    IsFinanceEnabled: boolean;
    IsRecieveByDealerEnabled: boolean;
}