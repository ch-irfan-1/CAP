export enum TaxInclExcl {
    None = 0,
    Inclusive = 1,
    Exclusive = 2,
  }
  
  export namespace TaxInclExcl {
    export function GetDescriptionStringValue(key: number): string {
      let strVal = '';
      const enumVal = key as TaxInclExcl;
  
      switch (enumVal) {
        case TaxInclExcl.None: {
          strVal = 'NONE';
          break;
        }
        case TaxInclExcl.Inclusive: {
          strVal = 'Inclusive';
          break;
        }
        case TaxInclExcl.Exclusive: {
          strVal = 'Exclusive';
          break;
        }
        default: {
          strVal = 'NONE';
          break;
        }
      }
  
      return strVal;
    }

    export function GetStringValue(key: number): string {
      let strVal = '';
      const enumVal = key as TaxInclExcl;
  
      switch (enumVal) {
        case TaxInclExcl.None: {
          strVal = '00000';
          break;
        }
        case TaxInclExcl.Inclusive: {
          strVal = '00001';
          break;
        }
        case TaxInclExcl.Exclusive: {
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
    export function GetDescription(key: string): string {
      let strVal = '';
  
      switch (key) {
        case '00000': {
          strVal = 'None';
          break;
        }
        case '00001': {
          strVal = 'Inclusive';
          break;
        }
        case '00002': {
          strVal = 'Exclusive';
          break;
        }
        default: {
          strVal = 'None';
          break;
        }
      }
  
      return strVal;
    }
  }
  