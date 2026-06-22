import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_AIR_CRFT_DETLInfo extends IBaseEntity {
    PROPOSALID: number;
    ASSETID: number;
    AIRCRAFTSERIALNO: string;
    MANUFACTURER: string;
    MANUFACTURERDTE: Control<Date>;
    REGNO: string;
    FUSELAGELINENO: string;
    INTERIORCONFIGURATION: string;
    EXTOVERWATERCAPACITY: string;
    APPROACHCATEGORY: string;
    ODOMETER: string;
    CREWPOSITIONS: string;
    NOISECOMPILANCE: string;
    DISPLAYTYPE: string;
    WINGLETS: string;
    NOLAVATORIES: string;
    OVERHEADCOMPARTMENTS: string;
    TAXEXPENDITURE: number;
    ASSETDELIVERYDATE: Control<Date>;
    OTHEREXPENSES: number;
    BASICEMPTYWGT: string;
    FUELCAPACITY: string;
    CURRENTOPERATOR: string;
    MAXGROSSTAKEOFFWGT: string;
    ZEROFUELWGT: string;
    TOTALAIRFRAMESHOURS: string;
    MAXLANDIGWGT: string;
    MAXTAXIWGT: string;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
}