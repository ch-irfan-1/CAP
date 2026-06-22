import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";

export interface IDTSDocumentUploadParam extends IBaseEntity {
  FILEPATH: string;
  FILENAMEEXTENTION: string;
  MESSAGE: string;
  FILENAME: string;
  OFFSET: number;
  BOFFERSIZE: number;
  ARRAYOFBYTESSTR: string;
}
