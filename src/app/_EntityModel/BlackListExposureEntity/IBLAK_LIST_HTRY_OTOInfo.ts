import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IBLAKLISTHTRYOTOInfo extends IBaseEntity {
    SEQID:number;
    COMPCODE:string;
    BADSEQNO:number;
    BRCHCDE:string;
    TRANSACTIONTYPE:string;
    CONSUMERTYPE:string;
    CUSTNAME:string;
    ADDRESS:string;
    EXCATEGORY:string;
    EXCCTGDESC:string;
    IDNUMBER:string;
    TRANSACTIONDATE:Control<Date>;
    DATEOFBIRTH:Control<Date>;
    EXECUIONDTE:Control<Date>;
}
