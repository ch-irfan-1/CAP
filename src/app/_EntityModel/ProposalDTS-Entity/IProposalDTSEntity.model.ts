import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";
import { IPRPL_DTS_HEDRInfo, IPRPL_DOCTInfo,IPRPL_DTSInfo, IPRPL_DTS_DOCTInfo, IMPOS_APLT_DCMTInfo } from "@NFS_Entity/ProposalDTS-Entity/IProposalDTSEntity.model.index";

export interface IProposalDTSEntity extends IBaseEntity {

    PROPOSALDTSHEADER: IPRPL_DTS_HEDRInfo;
    PROPOSALDOCUMENTS: Array<IPRPL_DOCTInfo>;
    PROPOSALDTS: IPRPL_DTSInfo;
    PROPOSALDTSDOCUMENTS: Array<IPRPL_DTS_DOCTInfo>;
    ISBULKOPR: boolean;
    MPOSDOCUMENTS: Array<IMPOS_APLT_DCMTInfo>;
}