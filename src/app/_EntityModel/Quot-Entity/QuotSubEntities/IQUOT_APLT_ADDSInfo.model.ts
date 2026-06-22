import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IQUOT_APLT_ADDSInfo extends IBaseEntity {
  QUOTAPPLICANTID: number;
  ADDRESSID: number;
  RESIDENCETYPECDE: string;
  // CODE: string;
  ADDRESSTYPECDE:any;
  ADDRESSSTATUSCDE: string;
  POSTALCODE: string;
  TIMEINYEAR: number;
  TIMEINMONTH: number;
  COUNTRYID: number;
  PROVINCEID: number;
  KOTAMADYAID: number;
  KECAMATANID: number;
  KELURAHANID: number;
  RWNBR: string;
  RTNBR: string;
  AREACDE: string;
  ADDRESSDETAIL: string;
  HOUSINGOWNERSHIPCDE: string;
  PROPERTYLOCATIONCDE: string;
  CONTACTPERSON: string;
  RLSPWITHCONTACTPERSON: string;
  EXECUTIONDTE: Control<Date>;
  EXECUTIONOFFSET: number;
  SESSIONID: number;
  SESSIONCDE: string;
  ADDRESSTYPE : Control<any> | undefined; // Only use for frontend
  DEFAULTADDRESS : string | undefined // Only use for frontend
}