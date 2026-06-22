export enum MarginTypeCode {
    Rate = "00001",
    Percentage= "00002"
}
export namespace MarginTypeCode {
    export function GetStringValueByCode(code: string): string{
        switch (code) {
            case "00001":
                return "Rate";
            case "00002":
                return "Percentage";
            default:
                return "";
        }
    }
}