export enum AssetTypeCodeCF {
    None = 0,
    Car = 1,
    Bike = 2,

}
export namespace AssetTypeCodeCF {
    export function GetStringValue(key: number): string {
        let strVal = '';
        const enumVal = key as AssetTypeCodeCF;

        switch (enumVal) {
            case AssetTypeCodeCF.None: {
                strVal = '00000';
                break;
            }
            case AssetTypeCodeCF.Car: {
                strVal = '00001';
                break;
            }
            case AssetTypeCodeCF.Bike: {
                strVal = '00002';
                break;
            }

            default: {
                strVal = '00000';
                break;
            }
        }

        return strVal;
    }
    export function GetDescriptionStringValue(key: number): string {
        let strVal = '';
        const enumVal = key as AssetTypeCodeCF;

        switch (enumVal) {
            case AssetTypeCodeCF.None: {
                strVal = 'None';
                break;
            }
            case AssetTypeCodeCF.Car: {
                strVal = 'Car';
                break;
            }
            case AssetTypeCodeCF.Bike: {
                strVal = 'Bike';
                break;
            }
            default: {
                strVal = 'None';
                break;
            }
        }

        return strVal;
    }
    export function GetStringValueByCode(code: string): string {
        let strVal = '';
        switch (code) {
            case "00001": {
                strVal = "Car"
                break;
            }
            case "00002": {
                strVal = "Bike"
            }

        }
        return strVal;
    }

}

