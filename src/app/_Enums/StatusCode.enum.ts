export enum StatusCode {
    All = "00000",
    Draft = "00001",
    New = "00002",
    Cancelled = "00033",
    Withdrawn = "00034",
    Declined = "00024",
    Revised = "00030",
    Rejected = "00082",
    Returned = "00093",
    InProcessWithDealer = "00094",
    Assigned = "00144",
    Resurvey = "00164"
}
export namespace StatusCode {
    export function GetDescriptionStringValue(key: string): string {
        let strVal = '';
        const enumVal = key as StatusCode;

        switch (enumVal) {
            case StatusCode.All: {
                strVal = 'All';
                break;
            }
            case StatusCode.Cancelled: {
                strVal = 'Cancelled';
                break;
            }
            case StatusCode.Rejected: {
                strVal = 'Rejected';
                break;
            }
        }
        return strVal;
    }
}