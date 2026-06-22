export enum BaseRateSourceCode {
    DefaultBaseRate = "00001"
}
export namespace BaseRateSourceCode {
    export function GetStringValueByCode(code: string): string{
        switch (code) {
            case "00001":
                return "Default Base Rate";
            default:
                return "";
        }
    }
}