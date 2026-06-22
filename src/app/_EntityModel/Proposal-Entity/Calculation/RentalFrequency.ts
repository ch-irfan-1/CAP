import { RentalFrequencyBasis } from "@NFS_Enums/RentalFrequencyBasis.enum";

export interface RentalFrequency {
    Frequencycde: string,
    Frequencydsc: string,
    FrequencyBase: RentalFrequencyBasis,
    BaseTerms: number,
    YearlyTerms: number,
}