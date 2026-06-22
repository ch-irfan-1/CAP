import { DataRowState } from '@NFS_Enums/DataRowState.enum'

export interface IBaseEntity{
    RowState: DataRowState;
    //isDeserializing: boolean;
    ISAUDITABLE: boolean;
}


export class BaseEntity implements IBaseEntity{
    RowState: DataRowState = DataRowState.UnChanged;
    isDeserializing: boolean = false;
    ISAUDITABLE: boolean = false;
}