export enum ChargeTypes {
  None = 0,
  Commission = 3,
  AdministrationCharges = 212,
  ProvisionFee = 39,
  OtherCharges = 213,
  PolicyFee = 214,
  FiduciaFee = 217,
  BBNCharge = 219,
  AdminFee = 220
}
export namespace ChargeTypes {
  export function GetStringValue(key: number): string {
    let strVal = '';
    const enumVal = key as ChargeTypes;

    switch (enumVal) {
      case ChargeTypes.None: {
        strVal = '00000';
        break;
      }
      case ChargeTypes.AdminFee: {
        strVal = '00220';
        break;
      }
      case ChargeTypes.PolicyFee: {
        strVal = '00214';
        break;
      }
      case ChargeTypes.ProvisionFee: {
        strVal = '00039';
        break;
      }
      case ChargeTypes.FiduciaFee: {
        strVal = '00217';
        break;
      }
      case ChargeTypes.BBNCharge: {
        strVal = '00219';
        break;
      }
      case ChargeTypes.Commission: {
        strVal = '00003';
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
    const enumVal = key as ChargeTypes;

    switch (enumVal) {
      case ChargeTypes.None: {
        strVal = 'None';
        break;
      }
      case ChargeTypes.AdminFee: {
        strVal = 'Admin Fee';
        break;
      }
      case ChargeTypes.PolicyFee: {
        strVal = 'Policy Fee';
        break;
      }
      case ChargeTypes.ProvisionFee: {
        strVal = 'Provision Fee';
        break;
      }
      case ChargeTypes.FiduciaFee: {
        strVal = 'Fiducia Fee';
        break;
      }
      case ChargeTypes.BBNCharge: {
        strVal = 'BBN Charge';
        break;
      }
      case ChargeTypes.Commission: {
        strVal = 'Commission';
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
      case "00217": {
        strVal = "Fiducia Fee"
        break;
      }
      case "00058": {
        strVal = "Accessories Cost"
      }

    }
    return strVal;
  }

}
