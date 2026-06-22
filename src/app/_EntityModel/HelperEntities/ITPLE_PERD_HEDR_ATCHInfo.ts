import { Control } from "src/Library";

export interface ITPLE_PERD_HEDR_ATCHInfo{
    TPLEPERDHEDRSEQID: number;
    TPLEPERDHEDRDSC: string;
    EXECUTIONOFFSET: number;
    EXECUTIONDTE: Control<Date>;
    SESSIONID: number;
    SESSIONCDE: string;
}