import { Control } from "src/Library";
export interface IBLAKLISTHTRYInfo {
    BUSINESSPARTNERID:number,
    STATUSCDE:string,
    REASONCDE:string,
    MODULECDE:string,
    MODULEID:number,
    CONTRACTID:number | null,
    BLACKLISTEDDTE:Control<Date>
}
