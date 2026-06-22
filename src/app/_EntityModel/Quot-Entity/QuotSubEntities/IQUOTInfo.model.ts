import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IQUOTInfo extends IBaseEntity  {
  QUOTATIONID: number;
  QUOTATIONNBR: string;
  QUOTATIONTYPECDE: string;
  //CODE: string;
  QUOTATIONDTE: Control<Date>;
  STATUSCDE: string;
  BPCOMPANYID: number;
  BPBRANCHID: number;
  BPINTRODUCERID: number;
  FPGROUPID: number;
  FINANCIALPRODUCTID: number;
  FINANCETYP: string;
  CREATEDBY: number;
  ISMCOMCAMPAIGN: boolean;
  MCOMDEALER: boolean;
  ISSEARCHED: boolean;
  APPLICATIONCENTERCOMMENTS: string;
  COMMENTS: string;
  ASSIGNEDTO: number;
  EXECUTIONDTE: Control<Date>;
  EXECUTIONOFFSET: number;
  SESSIONID: number;
  SESSIONCDE: string;
  FPGROUPNAME: string;
  FPCAMPAIGNNAME: string;
  CUSTOMERTYPE: string;
  DEALERNAME: string;
  BRANCHNAME: string;
  APCSTATUSCDE: string;
  STATUSDSC: string;
  APCSTATUSDSC: string;
  APPROVALTYPE: string,
  QSTOKEN: string,
  CANCELLATIONREASON: string,
  CANCELLATIONCOMMENTS: string,
  VOID: number;
  CREATEDBYMVOIND: boolean;
}