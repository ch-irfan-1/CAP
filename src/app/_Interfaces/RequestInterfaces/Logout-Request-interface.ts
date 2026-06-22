
export interface ILogoutRequest{
    mPOSLogoutRequest: LogoutInfo 
}

export interface LogoutInfo{
    USERID: number;
    APPLICATIONCDE: string;
}