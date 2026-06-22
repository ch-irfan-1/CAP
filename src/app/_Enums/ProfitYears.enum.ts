export enum ProfitYears {
    None = 0,
    NetProfitYear1 = 1,
    NetProfitYear2 = 2,
    NetProfitYear3 = 3,
  }
  
    export namespace ProfitYears {
      export function GetStringValue(key: number): string {
        let strVal = '';
        const enumVal = key as ProfitYears;
    
        switch (enumVal) {
          case ProfitYears.NetProfitYear1: {
            strVal = '00001';
            break;
          }
          case ProfitYears.NetProfitYear2: {
            strVal = '00002';
            break;
          }
          case ProfitYears.NetProfitYear3: {
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
          const enumVal = key as ProfitYears;
      
          switch (enumVal) {
            case ProfitYears.NetProfitYear1: {
              strVal = 'Net Profit Year 1';
              break;
            }
            case ProfitYears.NetProfitYear2: {
              strVal = 'Net Profit Year 2';
              break;
            }
            case ProfitYears.NetProfitYear3: {
                strVal = 'Net Profit Year 3';
                break;
              }
            default: {
              strVal = 'None';
              break;
            }
          }
      
          return strVal;
        }
        export function GetDescriptionStringValuebyCode(code: string): string {
            let strVal = '';
           // const enumVal = key as ProfitYears.;
        
            switch (code) {
              case "00001": {
                strVal = 'Net Profit Year 1';
                break;
              }
              case "00002": {
                strVal = 'Net Profit Year 2';
                break;
              }
              case "00003": {
                  strVal = 'Net Profit Year 3';
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