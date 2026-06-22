import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";

export interface BPCOMUSER extends IBaseEntity{
     BUSINESSPARTNERID: number;    
     COMPANYCODE: string;    
     COMPANYNME: string;    
     COMPANYNBR: string;    
     ESTABLISHEDSINCEYY: string;    
     EXECUTIONDTE: string;    
     REGISTRATIONDTE: string;    
     SESSIONID: number;    
     SESSIONCDE: string;    
     CONSENTTOSHAREOTO: Boolean;    
     CUSTOMERCDEOTO: string;    
     APLTCTGYCDE: string;    
     CUSTOMERNBR: string;    
     REGISTRATIONCDE: string;    
     INITCERTIFICATE: string;    
     INITCERTDTE: string;    
     PLACEOFCERTIFICATEISSUED: string;    
     LASTCOMYREGISTERIONNBR: string;    
     PROVIDEDBYMINISTRYOFJUSTICE: string;    
     LASTREGISTERIONDTE: string;    
     COMPANYGROUP: string;    
     IS: Boolean;    
     DOMICILENBR: string;    
     ECONOMICSECTORCDE: string;    
     CONTACTNME: string;    
     DATASTS: string;    
     ISWORKQUEREQUEST: Boolean;
}