import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import {IPRPL_JP1_JP2_RPNTInfo, IPRPL_JP1_JP2_RPNT_TAXInfo, IPRPL_JP1_JP2_ROLE_RPNTInfo} from './ProposalArticleEntity.model.index';

export interface IJP1JP2RecipientEntity extends IBaseEntity {
    PRPLJP1JP2RPNT: IPRPL_JP1_JP2_RPNTInfo;
    PRPLJP1JP2RPNTTAX: Array<IPRPL_JP1_JP2_RPNT_TAXInfo>;
    PRPLJP1JP2ROLERPNT: Array<IPRPL_JP1_JP2_ROLE_RPNTInfo>;
    // following properties are from helper class
    JP1TAXINCULSIVEAMT: number;
    JP1TAXEXCULSIVEAMT: number;
    JP2TAXINCULSIVEAMT: number;
    JP2TAXEXCULSIVEAMT: number;
    CurrencySymbol: string;
}