export interface IUserSecurityInfoParm {
    workflowUserName: string;
    workflowPassword: string;
    applicationcde: string;
    EnableTwoFactorAuth: boolean;
    VerInfo: string;
    IPADDRESS: string;
    DNSNAME: string;
    applicationid: number;
    captchaToken: string|null;
    USERID: number
}