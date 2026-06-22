import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_VHCL_DETLInfo extends IBaseEntity {
    CITYOFREGISTRATIONDSC: string;
    NOOFSEATS: number;
    KILOMETERS: number;
    // above properties are from helper class
    PROPOSALID: number;
    ASSETID: number;
    VINNUMBER: string;
    TRAILERREGISTRATIONNUMBER: string;
    TRLLICPLT: string;
    RELEASEYEAR: string;
    RELEASEMONTH: string;
    ENGINENUMBER: string;
    TRANSMISSION: string;
    CYLINDER: string;
    CC: string;
    BODY: string;
    COLOR: string;
    STYLE: string;
    BUILDDATE: Control<Date>;
    SERIES: string;
    WHEELWIDTH: string;
    DEMOFLAG: string;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    //CODE: string;
    RELEASEIND: boolean;
    CRDTPURPCODEOTO: string;
    PLICCTGYCODEOTO: string;
    CITYOFREGISTRATIONOTO: number;
    VEHICLEAGE: number;
    CHASSISNBROTO: string;
    VEHICLEREGISTRATIONNBROTO: string;
    VEHICLESERIESDSCOTO: string;
    VEHICLEBODYDSCOTO: string;
    USGEAREACDE: string;
    OPRTOFVEHICLE: string;
    BUYBACKGUARANTEEIND: boolean;
    PACMASPACKAGEDESCRIPTION: string;
    GOODSSERVICESFUND: string;
    FINANCINGTYPE: string;
    GOODSSERVICESFUNDDETAILS: string;
}