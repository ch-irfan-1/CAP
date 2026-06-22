import { AmountComponent } from "@NFS_Enums/AmountComponent";

export interface ITaxChargeComponentParam {
    FinanceTypeCode: string,
    RecipientBPId: number,
    ChargeAmount: number,
    ChargeTypeCode: string,
    EffectiveDate: Date,
    amountComponent: AmountComponent
}