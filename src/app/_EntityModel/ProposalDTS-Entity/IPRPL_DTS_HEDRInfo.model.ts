import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";
export interface IPRPL_DTS_HEDRInfo extends IBaseEntity {
    
    PROPOSALID: number;
    PROPOSALNBR: string;
    PROPOSALDTE: Control<Date>;
    APPLICANTNME: string;      
    APPLICANTID: number;
    PROPOSALTYPE: string;
    PROPOSALSTATUS: string;
    RENTALMODE: string;
    INTRODUCER: string;
    BRANCH: string;
    ASSETTYPE: string;
    FPGROUP: string;
    FPTYPE: string;
    DTSMODELNME: string;
    ROLECODE: string;
    APPLICANTTYPE: string;
    PROPOSALSTATUSCODE: string;
    // following properties are from helper class
    PROPOSALDTE_Helper:Control<Date>,
    COMMENTS: string;
    ROLEDSC: string;
    OBTAINEDSCORE:number;
    RENTALAMT:number;
    RDP:number;
    INSURER:string;
    MVOCOMMENTS:string;
    APCENTERCOMMENTS:string;
    FICOMMENTS:string;
    APPLIEDCUSTOMERRTE:number;
    ADJUSTEDFINANCEDAMT:number;
    CONTRACTTRM:number;
    ASSETMAKEDSC:string;
    ASSETBRANDDSC:string;
    ASSETMODELDSC:string;
    QUESTIONRECMPLTD: boolean;
    FINANCIALTYPE: string;
     
}