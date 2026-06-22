import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_ADDS_TYP_DETLInfo extends IBaseEntity {
    APPLICANTID: number;
    ADDRESSID: number;
    GEOTPLECDE: string;
    //CODE: string;
    ADDRESSTYPECDE: string;
    DEFAULTIND: boolean;
    APPLICABLEIND :boolean
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONCDE: string;
    SESSIONID: number;
    //adding extra properties
    ADDRESSTYPEDSC: string;
}