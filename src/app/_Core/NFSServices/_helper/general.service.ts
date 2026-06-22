import { Injectable } from '@angular/core';
import { FormMode } from '@NFS_Enums/FormMode.enum';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  public FormMode: FormMode = FormMode.NEW;
  public commissionFlag : Boolean = false;
  public IsMarketingCommission : Boolean = true;
  constructor() { }

  byPassedRequests = [
    '/api/Calculation/CalculateCommission',
    '/api/Calculation/CalculateNMSIR'
];

}
