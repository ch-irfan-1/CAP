export enum RentalType {
  None = 0,
  Structured = 1,
  InterestOnly = 2,
  Balloon = 3,
  ResidualValue = 4,
  ValueDate = 5,
}

export namespace RentalType {
  export function GetStringValue(key: number): string {
    let strVal = '';
    const enumVal = key as RentalType;

    switch (enumVal) {
      case RentalType.None: {
        strVal = 'AUT';
        break;
      }
      case RentalType.Structured: {
        strVal = 'STR';
        break;
      }
      case RentalType.InterestOnly: {
        strVal = 'INT';
        break;
      }
      case RentalType.Balloon: {
        strVal = 'BLN';
        break;
      }
      case RentalType.ResidualValue: {
        strVal = 'REV';
        break;
      }
      case RentalType.ValueDate: {
        strVal = 'VDR';
        break;
      }
      default: {
        strVal = 'AUT';
        break;
      }
    }

    return strVal;
  }
  export function GetRentalType(key:string): number{
     const enumVal= key as string;
     let strVal=0;

    switch (enumVal) {
      case 'AUT': {
        strVal = RentalType.None;
        break;
      }
      case 'STR': {
        strVal = RentalType.Structured;
        break;
      }
      case 'INT': {
        strVal = RentalType.InterestOnly;
        break;
      }
      case 'BLN': {
        strVal = RentalType.Balloon;
        break;
      }
      case 'REV': {
        strVal = RentalType.ResidualValue;
        break;
      }
      case 'VDR': {
        strVal = RentalType.ValueDate;
        break;
      }
      default: {
        strVal =  RentalType.None;
        break;
      }
    }

    return strVal;
  }
  export function GetRentalTypeValue(key: number): string {
    let strVal = '';
    const enumVal = key as RentalType;

    switch (enumVal) {
      case RentalType.None: {
        strVal = 'Auto';
        break;
      }
      case RentalType.Structured: {
        strVal = 'Structured';
        break;
      }
      case RentalType.InterestOnly: {
        strVal = 'InterestOnly';
        break;
      }
      case RentalType.Balloon: {
        strVal = 'Balloon';
        break;
      }
      case RentalType.ResidualValue: {
        strVal = 'ResidualValue';
        break;
      }
      case RentalType.ValueDate: {
        strVal = 'ValueDate';
        break;
      }
      default: {
        strVal = 'Auto';
        break;
      }
    }

    return strVal;
  }
}
