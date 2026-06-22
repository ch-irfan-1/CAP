import { IUserBranches } from './UserBranches-interface';
import { IUSER_GRUP_ASSNInfo } from './USER_GRUP_ASSNInfo-interface';
import { IBPEmailResponse } from './IBPEmailResponse-interface';

export interface ILoginResponse{
    MESSAGE_CODE: string;
    MESSAGE_DESCRIPTION: string;
    MESSAGE_TYPE: string;
    SESSIONID: number;
    SESSIONCDE: string;
    LANGUAGECDE: string;
    COMPANYID: number;
    COMPANYNAME: string;
    BRANCHID: number;
    PROCESSINGDATE: Date;
    COMPANYCURRENCYCODE: string;
    BRANCHCURRENCYCODE: string;
    DATEFORMAT: string;
    CURRENCYROUNDINGSCALE: number;
    PERCENTAGEROUNDINGSCALE: number;
    RATEROUNDINGSCALE: number;
    OPERATINGTIMEZONE: number;
    BUSINESSCUTOFFTIME: Date;
    BRANCHNAME: string;
    USERID: number;
    EXPIRYDAYS: number;
    USERSECURITY: string;
    COMPANYCODE: string;
    BUSINESSPARTNERID: number;
    PHONENO: string;
    USERBRANCHES: Array<IUserBranches>;
    USERGROUPASSOCIATION: Array<IUSER_GRUP_ASSNInfo>;
    EMAILADDRESS: Array<IBPEmailResponse>;
    UserName?: string;

}

