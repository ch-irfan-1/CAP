import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { IPRPL_TAX_CMPTInfo, IProposalTaxConfigDetailEntity } from "./ProposalSubEntities.index";

export interface IProposalTaxConfigEntity extends IBaseEntity {
    //PRPLTAXCMPT: IPRPL_TAX_CMPTInfo;
    PROPOSALTAXCONFIGDETAIL: Array<IProposalTaxConfigDetailEntity>;
}