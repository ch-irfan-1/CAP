import { IProposalArticleEntity, IPRPL_CHRTInfo, IPRPL_TPLE_RNTL_INTInfo } from "@NFS_Entity/Proposal-Entity/ProposalEntity.model.index";
import { IPRPL_ARTE_BASE_RATEInfo } from "@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/IPRPL_ARTE_BASE_RATEInfo.model";
import { ChartType } from "@NFS_Enums/ChartType.enum";

export interface IChartInfoPOSParm {
    //chrttype: ChartType,
    ProposalArticle: Array<IProposalArticleEntity>
    allAsset: boolean,
    FinancialProductID: number,
    ProposalRentalTemplate: IPRPL_TPLE_RNTL_INTInfo,
    BaseRateTypeCode: string,
    ProposalStartDate: Date,
    ProposalCharts: Array<IPRPL_CHRTInfo>,
    IntroducerID: number,
    ProposalCurrencyCode: string,
    ChartCode: string,
    CoverageInd: boolean,
    ChartType: string
    
}