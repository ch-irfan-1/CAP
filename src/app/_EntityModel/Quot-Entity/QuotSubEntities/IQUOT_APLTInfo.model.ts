import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IQUOT_APLTInfo extends IBaseEntity {
  QUOTAPPLICANTID: number;
  QUOTATIONID: number;
  ROLECDE: string;
  //CODE: string;
  FIRSTNME: string;
  MIDDLENME: string;
  LASTNME: string;
  DATEOFBIRTH: Control<Date>;
  EMAILADDRESS: string;
  SALARY: number;
  MOTHERMDNNME: string;
  PLACEOFBIRTH: string;
  COMPANYNAME: string;
  CONTACTNME: string;
  EXECUTIONDTE: Control<Date>;
  EXECUTIONOFFSET: number;
  SESSIONID: number;
  SESSIONCDE: string;
  CUSTOMERNME: string;
  MARITALSTATUSCDE: string,
  MONTHLYINSTALLMENT: number,
  OCCUPATIONCDE:string

}