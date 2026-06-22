import { IBaseEntity } from '@NFS_Entity/Base-Entity/BaseEntity.model';
import { Control } from 'src/Library';

export interface IPRPL_DTS_DOCT_GRUPInfo extends IBaseEntity {
    GROUPCDE:string;
    DOCUMENTCDE:string;
    SYSIND:boolean;
    ACTIVATEIND:boolean;
    EXECUTIONDTE:Control<Date>;
    EXECUTIONOFFSET:number;
    SESSIONID:number;
    SESSIONCDE:string;
    GROUPDSC:string;
    DOCUMENTDSC:string;
    DOCUMENTSUBDSC:string;
    FILENAME:string;
    FILEPATH:string;
    CREATIONDTE: Control<Date>;
    CNTCT_ADDRESS: string;
    LATITUDE:number;
    LONGITUDE: number;
    DOCUMENTNAME:string;
}