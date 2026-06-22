import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IQUOT_ADDL_INFOInfo extends IBaseEntity{
  QUOTADDITIONALINFOID: number;
  QUOTATIONID: number;
  CONTRACTNBR: string;
  ASSETMAKE: string;
  ASSETBRAND: string;
  ASSETMODEL: string;
  EXECUTIONDTE: Control<Date>;
  EXECUTEDOFFEST: number;
  SESSIONID: number;
  SESSIONCODE: string;
  ASSETCONDITION: string;
  ASSETUSAGECODE: string;
  ASSETDETAIL:string;
  ENGINENO:string;
  CHASSISNO:string;
  FPCAMPAIGNNAME:string;
  BRANCHNAME:string;



}