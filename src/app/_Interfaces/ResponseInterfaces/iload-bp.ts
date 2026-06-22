import { Control } from "src/Library";

export interface CONT {
      ETCONTRACTNBR: string;
      ENGINENO?: any;
      CHASISNO?: any;
      FINANCIALPRODUCTDSC: string;
      BPCOMYBRANCHNAME: string;
      ASSETDSC: string;
  }

  export interface BPIDDETL {
      IDTYPENBR: string;
      EXPIRYDTE: string;
      STARTDTE: Date;
      IDTYPDSC?: any;
      BUSINESSPARTNERNME: string;
      BUSINESSPARTNERID: number;
      DOBFORASCENT: string;
  }

  export interface LoadExistingBPResultSet {
      CONT: CONT[];
      BPIDDETL: BPIDDETL[];
  }
