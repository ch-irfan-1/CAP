export enum RVBalloonType {
    None='00000',
    ResidualValue='00001',
    Balloon='00002'
  }
  
  // export namespace RVBalloonType {
  //   export function GetStringValue(key: number): string {
  //     let strVal = '';
  //     const enumVal = key as RVBalloonType;
  
  //     switch (enumVal) {
  //       case RVBalloonType.None: {
  //         strVal = '00000';
  //         break;
  //       }
  //       case RVBalloonType.ResidualValue: {
  //         strVal = '00001';
  //         break;
  //       }
  //       case RVBalloonType.Balloon: {
  //         strVal = '00002';
  //         break;
  //       }
  //       default: {
  //         strVal = '00000';
  //         break;
  //       }
  //     }
  
  //     return strVal;
  //   }

  //   export function GetDescriptionStringValue(key: number): string {
  //       let strVal = '';
  //       const enumVal = key as RVBalloonType;
    
  //       switch (enumVal) {
  //         case RVBalloonType.None: {
  //           strVal = 'None';
  //           break;
  //         }
  //         case RVBalloonType.ResidualValue: {
  //           strVal = 'VAT/GST';
  //           break;
  //         }
  //         case RVBalloonType.Balloon: {
  //           strVal = 'WHT';
  //           break;
  //         }
  //         default: {
  //           strVal = 'None';
  //           break;
  //         }
  //       }
    
  //       return strVal;
  //     }
  // }
  