import { BaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { IPRPLInfo } from "../IPRPLInfo.model";
import { IPRPL_EAPPR_INFRInfo } from "./IPRPL_EAPPR_INFRInfo.model";
import { IPRPL_HTRYInfo } from "./IPRPL_HTRYInfo.model";
import { IPRPL_DTS_HEDRInfo } from "./ProposalEApprovalEntity.model.index";
import { IPRPL_CRDT_RCMDInfo } from "../IPRPL_CRDT_RCMDInfo.model";
import { IPRPL_IOPS_USERInfo } from "../IPRPL_IOPS_USERInfo.model";
import { IPRPL_SCRE_CARD_MAINInfo } from "../ProposalApplicantEntity/IPRPL_SCRE_CARD_MAINInfo.model";
import { APPL_CNCL_DATAInfo } from "../APPL_CNCL_DATAInfo.model";
import { IPRPL_INCM_ANLS } from "@NFS_Entity/ProposalDTS-Entity/IPRPL_INCM_ANLS.model";
import { IPRPL_LCTN_HTRY } from "@NFS_Entity/ProposalDTS-Entity/IPRPL_LCTN_HTRY.model";
import { IPRPL_RSVY_DRTN_TRCK } from "@NFS_Entity/ProposalDTS-Entity/IPRPL_RSVY_DRTN_TRCK";
import { IPRPL_DVTN_TRCK } from "@NFS_Entity/ProposalDTS-Entity/IPRPL_DVTN_TRCK.model";

export interface ProposalEApprovalEntity extends BaseEntity{

    PROPOSAL:IPRPLInfo;
    PROPOSALDTSHEADER:IPRPL_DTS_HEDRInfo;
    PROPOSALEAPPROVAL:Array<IPRPL_EAPPR_INFRInfo>;
    PROPOSALHTRY:IPRPL_HTRYInfo;
    PRPLCREDITRECOMMENDATION:Array<IPRPL_CRDT_RCMDInfo>;
    PRPLSCRECARDMAIN: Array<IPRPL_SCRE_CARD_MAINInfo>
    PRPLIOPSUSER: IPRPL_IOPS_USERInfo;
    APPLCNCLDATA: Array<APPL_CNCL_DATAInfo>;
    PRPLINCMANLS: Array<IPRPL_INCM_ANLS>;
    PRPLLCTNHTRY: Array<IPRPL_LCTN_HTRY>;
    PRPLRSVYDRTNTRCK: Array<IPRPL_RSVY_DRTN_TRCK>;
    PRPLDVTNTRCK: Array<IPRPL_DVTN_TRCK>
}
