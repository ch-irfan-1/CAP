import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { IPRPL_INSRInfo, IINSR_DPRN_PLCYInfo, IStandardInsuranceEntity } from './ProposalArticleEntity.model.index';

export interface IMainInsuranceEntity extends IBaseEntity {
    PRPLINSR: IPRPL_INSRInfo;
    INSRDPRNPLCY: Array<IINSR_DPRN_PLCYInfo>;
    STANDARDINSURANCE: Array<IStandardInsuranceEntity>;
}