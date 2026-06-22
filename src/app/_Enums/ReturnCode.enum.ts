
interface IReturnCodeEnumMembers {
    Message: string;
    Code: string;
}

interface IReturnCodeEnumTypes {
    Success: IReturnCodeEnumMembers;
    Exception: IReturnCodeEnumMembers;
    OTPAttemptsFailed: IReturnCodeEnumMembers;
    ValidationFailed:IReturnCodeEnumMembers;
    ConflictDetected:IReturnCodeEnumMembers;
    WithdrawlRequestAlreadySubmitted:IReturnCodeEnumMembers;
    ChangeRequestAlreadySubmitted:IReturnCodeEnumMembers;
}

export const ReturnCode: IReturnCodeEnumTypes = {
    Success: { Message: "Operation Successfully completed.", Code: "1" },
    Exception: { Message: "Error.", Code: "6" },
    OTPAttemptsFailed: { Message: "You have reached invalid login attempts, please login again!", Code: "123" },
    ValidationFailed: { Message: "Validation Failed", Code: "69" },
    ConflictDetected:{ Message: "Conflict detected. Please refresh your data and try again.", Code: "71" },
    WithdrawlRequestAlreadySubmitted:{ Message: "A Withdrawl Request is already Submitted!",Code:"68"},
    ChangeRequestAlreadySubmitted:{ Message: "A Change Request is already Submitted!",Code:"67"}

}