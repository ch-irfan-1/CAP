import { RentalFrequency } from '@NFS_Entity/Proposal-Entity/Calculation/RentalFrequency';
export interface RentalStructureCountParam{
    RentalFrequency:RentalFrequency;
    Terms:number;
    RVorBaloonIncluded:boolean;
    ResidualAmount:number;
    RentalAmount:number;
}