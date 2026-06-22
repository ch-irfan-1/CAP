import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";
import { IPRPL_STND_INSRInfo, IPRPL_ADDL_INSRInfo, IStandardInsuranceDetailEntity } from './ProposalArticleEntity.model.index';

export interface IStandardInsuranceEntity extends IBaseEntity {
    PRPLSTNDINSR: IPRPL_STND_INSRInfo;
    PRPLADDLINSR: Array<IPRPL_ADDL_INSRInfo>;
    STANDARDINSURANCEDETAIL: Array<IStandardInsuranceDetailEntity>;
    //Helper Property
    PRPLSTNDINSRPARENTINDEX: number;
    isExpanded: boolean;
}