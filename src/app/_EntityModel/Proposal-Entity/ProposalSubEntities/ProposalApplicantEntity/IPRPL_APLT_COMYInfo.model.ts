import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_APLT_COMYInfo extends IBaseEntity {
    APPLICANTID: number;
    BUSINESSTYPECDE: string;
    INDUSTRYTYPECDE: string;
    INDUSTRYSUBTYPECDE: string;
    NAME: string;
    CONTACTNME: string;
    FLEETSIZE: number;
    COMMENT: string;
    EMAILADDRESS: string;
    TRADINGAS: string;
    COMPANYNBR: string;
    COMPANYNMELOCAL: string;
    BLACKLISTIND: boolean;
    ESTABLISHEDSINCE: Control<Date>;
    ESTABLISHEDSINCEYY: number;
    ORGANIZATIONCDE: string;
    NETWORTHAMT: number;
    CAPITALREGISTRATIONAMT: number;
    NUMBEROFEMPLOYEES: number;
    CONTACTTYPE: string;
    ESTABLISHEDSINCEMM: number;
    REVENUE: number;
    TRUSTNME: string;
    CUSTOMERID: number;
    BUREAUREFNO: string;
    PRIVACYACTIND: string;
    NOVATOR: string;
    CONSENTTOSHARE: string;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    CREDITRATING: string;
    CUSTOMERCDE: string;
    GUARANTORRELATIONSHIPCDE: string;
    REGISTRATIONCDE: string;
    INITIALCERTIFICATE: string;
    INITIALCERTIFICATEDTE: Control<Date>;
    VIPIND: boolean;
    LASTCOMYREGISTRATIONNBR: string;
    LASTREGISTRATIONDTE: Control<Date>;
    PROVIDEDBYMINISTRYJUSTICE: string;
    COMPANYGROUP: string;
    ISPUBLIC: boolean;
    PLACEINTLCERTIFICATEISSUED: string;
    OFFICEOWN: boolean;
    FACTORYOWN: boolean;
    OFFICELEASE: boolean;
    FACTORYLEASE: boolean;
    OFFICELEASEAMOUNT: number;
    FACTORYLEASEAMOUNT: number;
    BUSINESSENTITYTYPE: string;
    APPLICANTCATEGORY: string;
    DOMICILE: string;
    ECNMSCTRCODEOTO: string;
    // following properties are in helper class
    MONTHONBOOK: number;
    TIMEONBOOK: number;
    APLICANTNAMEENABLE: boolean;
    INVCOPTNCDE: string;
    SHOWWHTOL: boolean | null;
    ACCTYPCDE: string;
    IDCARDTYP: string;
    // following properties are to handle check box data types issues
    PRIVACYACTIND_Helper: boolean;
    CONSENTTOSHARE_Helper: boolean;



}