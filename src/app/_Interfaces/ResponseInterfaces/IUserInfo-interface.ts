export interface IUserInfo {
  SESSIONID: number;
  SESSIONCDE: string;
  UserId: number;
  UserName: string;
  ApplicationCode: string;
  LanguageInfo: LANGUAGECDE;
  CompanyId: number;
  userEmailID: string;
  CompanyName: string,
  ProcessingDate: string,
  IsOTO: boolean,
  MPOSMiddlewareVersion: string,
  UserGroupCode: string,
  DealerAssociationCode: string,
  userFullName: string,
  IsCAPAngular: boolean
}

export interface LANGUAGECDE {
  LANGUAGECDE: string
}
