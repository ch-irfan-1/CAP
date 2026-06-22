import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";
import {IPRPL_JP2_RPNTInfo, IPRPL_JP2_RPNT_TAXInfo} from './ProposalArticleEntity.model.index';

export interface IJP2RecipientEntity extends IBaseEntity {
    PRPLJP2RPNT: IPRPL_JP2_RPNTInfo;
    PRPLJP2RPNTTAX: Array<IPRPL_JP2_RPNT_TAXInfo>;
    // following properties are from helper class
    TAXINCULSIVEAMT: number;
    TAXEXCULSIVEAMT: number;
    CurrencySymbol: string;
}