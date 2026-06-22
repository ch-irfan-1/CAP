export enum ProposalHistoryAction{
        None = 0,
        Forward = 1,
        TakeControl = 2,
        ForwardToBM = 3,
        CreateFromCAP = 4,
        Open = 5,
        Submit = 6,
        CreateFromRevision = 7,
        EApprovalApproved = 8,
        CreateFrommPOS = 9,
        ChangeRequest = 10,
        mPOSResurvey = 11
}
export namespace ProposalHistoryAction {
    export function GetDescriptionStringValue(key: number): string {
        let strVal = '';
        const enumVal = key as ProposalHistoryAction;

        switch (enumVal) {
            case ProposalHistoryAction.None: {
                strVal = 'None';
                break;
            }
            case ProposalHistoryAction.Open: {
                strVal = 'Open';
                break;
            }
            case ProposalHistoryAction.Forward: {
                strVal = 'Forward to TM';
                break;
            }
            case ProposalHistoryAction.TakeControl: {
                strVal = 'Take Control';
                break;
            }
            case ProposalHistoryAction.ForwardToBM: {
                strVal = 'Forward to BM';
                break;
            }
        }
        return strVal;
    }
}