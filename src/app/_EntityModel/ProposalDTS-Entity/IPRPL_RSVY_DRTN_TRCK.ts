import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_RSVY_DRTN_TRCK extends IBaseEntity {
  MVOASNDTE: Date;
  ESIGNDTE: Date;
  SBMTTOCAPDTE: Date;
  SRVYDRTN: any;
  MVOSBMTDRTN: any;
  RSVYDRTN: any;
  NOOFRSVY:  number;
  PROPOSALID: number;
}
