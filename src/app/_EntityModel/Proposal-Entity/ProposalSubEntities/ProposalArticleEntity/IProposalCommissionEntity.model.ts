import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";
import {
    IPRPL_COMMInfo, IPRPL_COMM_SCHMInfo, IPRPL_DELR_PIC_ASSNInfo, IPRPL_MKTG_COMMInfo, IJP1JP2RecipientEntity,
    IJP2RecipientEntity
} from './ProposalArticleEntity.model.index';

export interface IProposalCommissionEntity extends IBaseEntity {
    PRPLCOMM: IPRPL_COMMInfo;
    PRPLCOMMSCHM: Array<IPRPL_COMM_SCHMInfo>;
    PRPLDELRPICASSN: Array<IPRPL_DELR_PIC_ASSNInfo>;
    PRPLMKTGCOMM: Array<IPRPL_MKTG_COMMInfo>;
    JP1JP2RECIPIENT: Array<IJP1JP2RecipientEntity>;
    JP2RECIPIENT: Array<IJP2RecipientEntity>;
}