import { RentalType } from '@NFS_Enums/RentalType.enum';

export interface IRentalStructure {
    StartTermText:string;
    EndTermText:string;
    StartTerm:number;
    EndTerm:number;
    RentalAmount:number;
    RentalType:RentalType;
    RentalTypeValue:string;
    PrincipalAmount:number;
    RentalTypValue:string;
    VATAMT:number;
    TAXAPPAMT:number;
    WITHTAXAMT:number;
    WITHOUTTAXAMT:number;
    APPCHRGAMT:number;
    WITHHOLDTAXAMT:number;
    WITHHOLDTAXIND:string;
    WITHOLDTAXRATE:number;
    TAXAPPSTUS:string;
    TAXINCLEXCL:string;
    VATRATE:number;
    ISENABLE:boolean;
    IsGPRental:boolean;
    TAXEXCLAMT:number;
}