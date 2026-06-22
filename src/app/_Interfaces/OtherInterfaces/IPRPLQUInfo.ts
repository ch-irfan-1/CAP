import { Control } from "src/Library";

export interface IPRPLQUInfo {
    RowState: number,
    ISAUDITABLE: boolean,
    PROPOSALID: number,
    PROPOSALNBR: string,
    STATUSCDE: string,
    FINANCIALPRODUCTNME: string,
    PROPOSALDTE: string,
    REQUESTSTATUSDSC: string,
    BUSINESSPARTNERNME: string,
    BUSINESSPARTNERTYP: string,
    ASSETMAKEDSC: string,
    ASSETMODELDSC: string,
    FINANCEDAMT: number,
    BPINTRODUCERNME: string,
    BPCOMPANYBRANCHNME: string,
    USERID: number,
    FINANCETYP: string,
    FINANCETYPDSC: string,
    PROPOSALDATE: string,
    APPLICANTTYP: string,
    BPCOMPANYID: number,
    CHANGEREQUESTSCDE: string,
    LASTAPPROVERCOMMENTS: string,
    CHANGREQUESTSTATUS: string,
    CHANGEREQUESTAPPROVALDTE: string,
    TOTALROWS: number,
    WITHDRAWREQUESTSTATUS: string,
    WITHDRAWREQUESTSCDE: string,
    CONTREFNO: string,
    BPCOMPANYBRANCHID: number,
    FINANCIALPRODUCTID: number,
    ISUREAPPLICATIONNBR: string,
    MPOSAPPLICATIONNBR: string,
    ISFROMMPOS: boolean,
    LEADNUMBER: string,
    ASSNTO: number,
    ASSNTONAME: string,
    FWRDCOMMENT: string,
    READIND:boolean,
    COLOR: string,
    MCOMTOPUPIND: string,
    //Helper Property
    FORMMODE:string,
    CONTREVISIONINDDESC:string,
    EAPPROVALTIME:Control<Date>,
    SUBMITATCAP:Control<Date>,
    isBold:boolean,
    CRDTRCMDIND?: boolean;
    CRDTRCMDINDDESC:string;
    CRDTRCMDTYPCDE: string;
    CRDTRCMDTYPEDSC: string;
    POSLOCATION:string;
    CUSTOMERTYPE:string;
    FPGROUPNME:string;
    ASSETCONDITION:string;    
    ASSETBRANDDSC:string;
    MAKEDSC:string;    
    MVOSURVEY:string;    
}