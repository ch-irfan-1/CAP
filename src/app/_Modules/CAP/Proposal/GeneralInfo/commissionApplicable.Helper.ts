import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class CommissionService {
  private commissionApplicable: boolean = false;
  
  setCommissionApplicable(value: boolean) {
 this.commissionApplicable = value;
  }

  getCommissionApplicable() {
    return this.commissionApplicable;
  }
}
