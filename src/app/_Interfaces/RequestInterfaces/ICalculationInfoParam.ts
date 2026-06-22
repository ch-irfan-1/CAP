import { RentalFrequency } from "@NFS_Entity/Proposal-Entity/Calculation/RentalFrequency";
import { IAssetEntity, IProposalRoundingTemplateEntity, IPRPL_TPLE_COMM_CNFGInfo, IPRPL_TPLE_RNTL_INTInfo, IProposalEntity } from "@NFS_Entity/Proposal-Entity/ProposalEntity.model.index";
import { IPRPL_APLT_ADDSInfo } from "@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IPRPL_APLT_ADDSInfo.model";
import { IProposalInfoParm } from "./IProposalInfoParm";
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';

export interface ICalculationInfoParam{
    proposalInfoParam:IProposalInfoParm,
    AssetEntity:IAssetEntity,
    ProposalEntity:IProposalEntity,
    RentalStructures:Array<any>,
    roundingEntity:IProposalRoundingTemplateEntity,
    RentalTemplateEntity:IPRPL_TPLE_RNTL_INTInfo,
    InsuranceContractIncl:number,
    applicantAddress:IPRPL_APLT_ADDSInfo,
    chartCode:string,
    ProposalTempCommCongfig:Array<IPRPL_TPLE_COMM_CNFGInfo>,
    ChargeAmount:number,
    ChargeTypeCode:string
    rentalFrequency: RentalFrequency
    BPINTRODUCERID: number;
    DIVISIONTYP: string;
    COMMISSIONTYP: string;
    FINANCETYP: string;
    CONTRACTSTARTDTE: Date;
    ROLECDE: string;
    RECEPIENTID: number;
    EffectiveDate: Date;
    AMOUNTCOMPONENT: string;
}