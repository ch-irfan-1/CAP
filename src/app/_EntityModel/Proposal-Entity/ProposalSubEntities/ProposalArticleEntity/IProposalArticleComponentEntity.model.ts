import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import {IPRPL_ARTE_AMNT_TRANInfo, IPRPL_ARTE_AMNT_TRAN_TAXInfo} from './ProposalArticleEntity.model.index';

export interface IProposalArticleComponentEntity extends IBaseEntity {
    PRPLARTEAMNTTRAN: IPRPL_ARTE_AMNT_TRANInfo;
    PRPLARTEAMNTTRANTAX: Array<IPRPL_ARTE_AMNT_TRAN_TAXInfo>;
    // following properties are from helper class
    TAXINCULSIVEAMT: number;
    TAXEXCULSIVEAMT: number;
    NETPAYABLEAMT: number;
    WITHVATLESSITCAMT: number;
    TAXWITHOUTVATAMT: number;
    CurrencySymbol: string;
}