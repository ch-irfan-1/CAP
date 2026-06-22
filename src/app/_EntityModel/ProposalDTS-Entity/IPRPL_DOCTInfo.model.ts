import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";
export interface IPRPL_DOCTInfo extends IBaseEntity {

    PROPOSALID: number;
    DOCUMENTID: number;
    SEQID: number;
    DOCUMENTNME: string;
    DOCUMENTDTE: Control<Date>; 
    REQUIREDFORCDE: string;
    FILETYP: string;
    FILENMEEXT: string;
    FILESIZE: string;
    FILECOMMENTS: string;
    FILENME: string;    
    ISREFERENCED: boolean;
    ISCOMPRESSED: boolean;
    ISENCRYPTED: boolean;
    EXECUTIONDTE: Control<Date>; 
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    APPLICANTID: number;
    USERNME: string;
    //following properties are from helper class
    DOCUMENTCDE: string;
    //FILENME: string;    
    BtnDeleteEnable: boolean;
    ismPOS:boolean;

    //helper property
    fileTypeIndex:number;

}