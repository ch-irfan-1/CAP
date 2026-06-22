import { RentalFrequency } from "@NFS_Entity/Proposal-Entity/Calculation/RentalFrequency";
import { IProposalArticleEntity, IPRPL_CMPT_CNFGInfo, IPRPL_TPLE_RNTL_INTInfo } from "@NFS_Entity/Proposal-Entity/ProposalEntity.model.index";

export class CommissionCalculationParam {
    PROPOSALARTICLE!: IProposalArticleEntity;
    CHKEMPLOYEE: boolean = false;
    COMMISSIONCALCIND: boolean = false;
    BPINTRODUCERID: number = 0;
    COMMISSIONTYPE: string = '';
    COMMISSIONAMNT: number = 0;
    PRPLCMPTCNFG!: Array<IPRPL_CMPT_CNFGInfo>;
    PROPOSALTEMPLATERENTALINT!: IPRPL_TPLE_RNTL_INTInfo;
    rentalFrequency?: RentalFrequency;
}