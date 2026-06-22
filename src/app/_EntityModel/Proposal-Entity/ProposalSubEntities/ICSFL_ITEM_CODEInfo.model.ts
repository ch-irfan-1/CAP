import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";

export interface CSFL_ITEM_CODEInfo extends IBaseEntity {
    ISAUDITABLE	:boolean,
    RATIOGRUPDSC	:string,
    Year1	:number,
    Year2	:number,
    Year3	:number,
    CSFLITEMCDE	:string,
    CODE	:string,
    RATOGRUPCDE	:string,
    IDENTIFIER	:string,
    CSFLDSC	:string,
    DESCRIPTION	:string,
    PRIORITY	:number,
    ACTIVEIND	:boolean,
    SYSIND	:boolean,
    EXECUTIONDTE :string,
    EXECUTIONOFFSET	:number,
    SESSIONID	:number,
    SESSIONCDE	:string,
    APPLICANTTYP	:string,
    CSFLTYP	:string,
    Value:string
  }