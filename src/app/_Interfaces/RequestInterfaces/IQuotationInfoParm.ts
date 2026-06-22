export interface IQuotationInfoParm {
    QuotationId: number;
    ProposalId: number;
    USERID: number;
    BasetoSourceRate: number;
    BasetoTargetRate: number;
    ToDate: Date;
    FromDate: Date;
    fromRecord: number;
    toRecord: number;
    extraQuery: String;
    StatusCode: String;
    UserGroup: string;
    CancellationReason: string;
    CancellationComments: string;
    VOID: number;
    APPLICATIONCENTERCOMMENTS: string;
    VOApprovalType: string;
    QuotationNbr: string
}