export enum CommissionDivisionType
{
    None = 0,
    JP1 = 1,
    JP2 = 2,
    JP2Scheme = 3
}

export namespace CommissionDivisionType {
    export function GetStringValue(key: number): string {
      let strVal = '';
      const enumVal = key as CommissionDivisionType;
  
      switch (enumVal) {
        case CommissionDivisionType.None: {
          strVal = '00000';
          break;
        }
        case CommissionDivisionType.JP1: {
          strVal = '00001';
          break;
        }
        case CommissionDivisionType.JP2: {
          strVal = '00002';
          break;
        }
        case CommissionDivisionType.JP2Scheme: {
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
        const enumVal = key as CommissionDivisionType;
    
        switch (enumVal) {
          case CommissionDivisionType.None: {
            strVal = 'None';
            break;
          }
          case CommissionDivisionType.JP1: {
            strVal = 'JP1';
            break;
          }
          case CommissionDivisionType.JP2: {
            strVal = 'JP2';
            break;
          }
          case CommissionDivisionType.JP2Scheme: {
            strVal = 'JP2 Scheme';
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