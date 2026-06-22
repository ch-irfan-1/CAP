
interface IAuthCodeEnumMembers {
    Message: string;
    Code: string;
}

interface IAuthCodeEnumTypes {
    SystemError: IAuthCodeEnumMembers;
    SuccessfullyLogin: IAuthCodeEnumMembers;
    PasswordNotVerified: IAuthCodeEnumMembers;
    AccountIsLocked: IAuthCodeEnumMembers;
    UserDoesNotExist: IAuthCodeEnumMembers;
    CompanyNotAssigned: IAuthCodeEnumMembers;
    NoMoreAttemptsToLogin: IAuthCodeEnumMembers;
    PasswordExpired: IAuthCodeEnumMembers;
    PasswordExpiredAfterDays: IAuthCodeEnumMembers;
    PasswordLenghtLess: IAuthCodeEnumMembers;
    PasswordNotSame: IAuthCodeEnumMembers;
    ActiveDirectoryAuthenticationFailed: IAuthCodeEnumMembers;
    FirstTimeLogin: IAuthCodeEnumMembers;
    UserPasswordNotSupplied: IAuthCodeEnumMembers;
    PasswordNotEmpty: IAuthCodeEnumMembers;
    ConfirmPasswordNotSame: IAuthCodeEnumMembers;
    PasswordChangeSucess: IAuthCodeEnumMembers;
    OldPasswordWrong: IAuthCodeEnumMembers;
    Passwordalreadyexist: IAuthCodeEnumMembers;
    BPNotAssigned: IAuthCodeEnumMembers;
    ForcefullyEndSession: IAuthCodeEnumMembers;
    UserAlreadyConnected: IAuthCodeEnumMembers;
    BPCancelled: IAuthCodeEnumMembers;
    MissingConfig: IAuthCodeEnumMembers;
    AccountNotActivated: IAuthCodeEnumMembers;
    AccountExpired: IAuthCodeEnumMembers;
    ChangePassword: IAuthCodeEnumMembers;
    NotAuthorizedToLogin: IAuthCodeEnumMembers;
    ClientVersionMismatch: IAuthCodeEnumMembers;
    DBVersionMismatch: IAuthCodeEnumMembers;
    ClientVersionInfoMis: IAuthCodeEnumMembers;
    DBVersionInfoMis: IAuthCodeEnumMembers;
    DayEndInProcess: IAuthCodeEnumMembers;
    PasswordPolicyNotAssigned: IAuthCodeEnumMembers;
    ActiveDirectoryPasswordExpired: IAuthCodeEnumMembers;
    AppServerVersionMismatch: IAuthCodeEnumMembers;
    AppServerVersionInfoMis: IAuthCodeEnumMembers;
    PostDayEndInProcess: IAuthCodeEnumMembers;
    MacAddressMismatch: IAuthCodeEnumMembers;
}

export const AuthenticationCode: IAuthCodeEnumTypes = {
    SystemError: { Message: "System Error.", Code: "-1" },
    SuccessfullyLogin: { Message: "Success.", Code: "0" },
    PasswordNotVerified: { Message: "Password not verified", Code: "1" },
    AccountIsLocked: { Message: "Account Is Locked.", Code: "2" },
    UserDoesNotExist: { Message: "User Does Not Exist.", Code: "3" },
    CompanyNotAssigned: { Message: "Company Not Assigned.", Code: "4" },
    NoMoreAttemptsToLogin: { Message: "You Have No More Attempts To Login.", Code: "5" },
    PasswordExpired: { Message: "Your Password has Been Expired. Please change it now to log into application.", Code: "6" },
    PasswordExpiredAfterDays: { Message: "Your Password will Expire after {0} Day(s).", Code: "7" },
    PasswordLenghtLess: { Message: "Password lentgth cannot be less then {0} characters.", Code: "8" },
    PasswordNotSame: { Message: "Current password and new password cannot be same.", Code: "10" },
    ActiveDirectoryAuthenticationFailed: { Message: "Active Directory Authentication Failed.", Code: "11" },
    FirstTimeLogin: { Message: "Force Change Password.", Code: "12" },
    UserPasswordNotSupplied: { Message: "Please enter username/password.", Code: "13" },
    PasswordNotEmpty: { Message: "New Password cannot be empty.", Code: "14" },
    ConfirmPasswordNotSame: { Message: "New password and confirm password should be same.", Code: "15" },
    PasswordChangeSucess: { Message: "Password Changed successfully.", Code: "16" },
    OldPasswordWrong: { Message: "Old password is wrong.", Code: "17" },
    Passwordalreadyexist: { Message: "Password already exist.", Code: "18" },
    BPNotAssigned: { Message: "Business Partner not assigned.", Code: "19" },
    ForcefullyEndSession: { Message: "User is already connected with same client. Do you want to end previous session forcefully?", Code: "20" },
    UserAlreadyConnected: { Message: "User is already connected. Do you want to end previous session forcefully?", Code: "21" },
    BPCancelled: { Message: "Business Partner has been canceled.", Code: "22" },
    MissingConfig: { Message: "Configuration is missing.", Code: "23" },
    AccountNotActivated: { Message: "Your account has not been activated. Please contact your system administrator.", Code: "24" },
    AccountExpired: { Message: "Your account has expired. Please contact your system administrator.", Code: "25" },
    ChangePassword: { Message: "Change password.", Code: "26" },
    NotAuthorizedToLogin: { Message: "You are not authorized to login.", Code: "27" },
    ClientVersionMismatch: { Message: "Client version mismatch detected.", Code: "28" },
    DBVersionMismatch: { Message: "Database version mismatch detected.", Code: "29" },
    ClientVersionInfoMis: { Message: "Client version information missing.", Code: "30" },
    DBVersionInfoMis: { Message: "Database version information missing.", Code: "31" },
    DayEndInProcess: { Message: "Day End is In Process. Please Try Later", Code: "32" },
    PasswordPolicyNotAssigned: { Message: "Password policy not assigned.", Code: "33" },
    ActiveDirectoryPasswordExpired: { Message: "Your Active Directory Password has Been Expired. Please first change it to log into application.", Code: "34" },
    AppServerVersionMismatch: { Message: "App Server version mismatch detected.", Code: "35" },
    AppServerVersionInfoMis: { Message: "App Server version information missing.", Code: "36" },
    PostDayEndInProcess: { Message: "Post Day End is In Process. Please Try Later", Code: "37" },
    MacAddressMismatch: { Message: "Access not allowed on device", Code: "38" }
}