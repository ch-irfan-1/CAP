export enum TaxType {
    None=0,
    VAT_GST=1,
    WHT=2
  }
  
  export namespace TaxType {
    export function GetStringValue(key: number): string {
      let strVal = '';
      const enumVal = key as TaxType;
  
      switch (enumVal) {
        case TaxType.None: {
          strVal = '00000';
          break;
        }
        case TaxType.VAT_GST: {
          strVal = '00001';
          break;
        }
        case TaxType.WHT: {
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
        const enumVal = key as TaxType;
    
        switch (enumVal) {
          case TaxType.None: {
            strVal = 'None';
            break;
          }
          case TaxType.VAT_GST: {
            strVal = 'VAT/GST';
            break;
          }
          case TaxType.WHT: {
            strVal = 'WHT';
            break;
          }
          default: {
            strVal = 'None';
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
            strVal = 'VAT/GST';
            break;
          }
          case '00002': {
            strVal = 'WHT';
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
  