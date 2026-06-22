import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_LCTN_HTRY extends IBaseEntity {
  PROPOSALID: number;
  DOCUMENTCDE: string;
  ADDRESSLONGITUDE: number;
  ADDRESSLATITUDE: number;
  IMAGELONGITUDE: number;
  IMAGELATITUDE: number;
  HAVERSINEDISTANCE: number;
  CREATIONDTE: Date;
  SESSIONID: number;
  SESSIONCDE: string;
  COMMENTS: string;
  CONTACTADDRESS: string;
  USERID: number;
}
