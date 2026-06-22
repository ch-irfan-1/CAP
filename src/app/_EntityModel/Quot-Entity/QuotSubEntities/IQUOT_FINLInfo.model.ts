import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IQUOT_FINLInfo extends IBaseEntity{
  QUOTFINANCIALID: number;
  QUOTATIONID: number;
  ASSETCOST: number;
  CONTRACTTERMS: number;
  DOWNPAYMENTAMNT: number;
  DOWNPAYMENTPCT: number | null;
  FLATINTERESTRTE: number;
  EXECUTIONDTE: Control<Date>;
  EXECUTEDOFFEST: number;
  SESSIONID: number;
  SESSIONCODE: string;
}