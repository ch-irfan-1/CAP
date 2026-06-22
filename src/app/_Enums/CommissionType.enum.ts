export enum CommissionType {
  AllCommissionTypes = 0,
  MarketingCommission = 1,
  SOFCommission = 2,
  InsuranceCommission = 3,
  ProvisionFeeCommission = 4,
  AdminFeeCommission = 5,
  }
  
  export namespace CommissionType {
    export function GetStringValue(key: number): string {
      let strVal = '';
      const enumVal = key as CommissionType;
  
      switch (enumVal) {
        case CommissionType.AllCommissionTypes: {
          strVal = '00000';
          break;
        }
        case CommissionType.MarketingCommission: {
          strVal = '00001';
          break;
        }
        case CommissionType.SOFCommission: {
          strVal = '00002';
          break;
        }
        case CommissionType.InsuranceCommission: {
          strVal = '00003';
          break;
        }
        case CommissionType.ProvisionFeeCommission: {
          strVal = '00004';
          break;
        }
        case CommissionType.AdminFeeCommission: {
          strVal = '00005';
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
        const enumVal = key as CommissionType;
    
        switch (enumVal) {
          case CommissionType.AllCommissionTypes: {
            strVal = 'All Commission Types';
            break;
          }
          case CommissionType.MarketingCommission: {
            strVal = 'Commission';
            break;
          }
          case CommissionType.SOFCommission: {
            strVal = 'SOF Commission';
            break;
          }
          case CommissionType.InsuranceCommission: {
            strVal = 'Insurance Commission';
            break;
          }
          case CommissionType.ProvisionFeeCommission: {
            strVal = 'Provision Fee Commission';
            break;
          }
          case CommissionType.AdminFeeCommission: {
            strVal = 'Admin Fee Commission';
            break;
          }
          default: {
            strVal = 'All Commission Types';
            break;
          }
        }
    
        return strVal;
      }

      export function GetDescription(key: string): string {
         let strVal = '';
        // const enumVal = key as CommissionType;
    
        switch (key) {
          case '00000': {
            strVal = 'All Commission Types';
            break;
          }
          case '00001': {
            strVal = 'Commission';
            break;
          }
          case '00002': {
            strVal = 'SOF Commission';
            break;
          }
          case '00003': {
            strVal = 'Insurance Commission';
            break;
          }
          case '00004': {
            strVal = 'Provision Fee Commission';
            break;
          }
          case '00005': {
            strVal = 'Admin Fee Commission';
            break;
          }
          default: {
            strVal = 'All Commission Types';
            break;
          }
        }
    
        return strVal;
      }
  }
  