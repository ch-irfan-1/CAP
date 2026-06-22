import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_RLST_DETLInfo extends IBaseEntity {
    PROPOSALID: number;
    ASSETID: number;
    OWNER: string;
    TOTALPRICE: number;
    LANDAREA: string;
    CRTNOOFLANDUSAGE: string;
    NATUREOFLANDUAGE: string;
    RESIDUALYEARS: number;
    COVEREDRATIO: string;
    ACQUISITIONDATE: Control<Date>;
    OTHEREXPENCES: number;
    DEVELOPERBPID: string;
    CRTNOOWNERSHIP: string;
    NOFLOORS: number;
    NOFLOORSPURCHASED: number;
    PERMNODESIGN: string;
    PERMNOPLANING: string;
    PERMNOCONSTRUCTION: string;
    REGCONSTRUCTION: string;
    NOPRESALEPERM: string;
    CONSTCOMPLDTE: Control<Date>;
    CONSTAREAPURAG: string;
    CONSTAREAPURBG: string;
    CONSTAREAAG: string;
    CONSTAREABG: string;
    PARKINGAG: string;
    PARKINGBG: string;
    REALESTATECLASS: string;
    GEOGRPHICALLOCATION: string;
    PROGESSOFBUILDING: string;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;

}