import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { IPRPL_ARTEInfo, IAssetEntity } from "./ProposalArticleEntity.model.index";

export interface IProposalArticleEntity extends IBaseEntity {
    PROPOSALARTICLE: IPRPL_ARTEInfo;
    ASSETENTITY: IAssetEntity;

}