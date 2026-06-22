import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WorkQueueService {

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    )
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          if (event.url != '/ProposalQueue') {
            this.resetServiceProperties();
          }
        }
      });
  }
  resetServiceProperties() { }

  CheckContextMenu(datarow: any, menu: any): boolean {
    let CanRender: boolean = false;
    if (menu.status.includes(datarow.REQUESTSTATUSDSC) && menu.showbyCampaign.includes(datarow.FINANCETYP)) {
      CanRender = true;
    }
    return CanRender;
  }

  DisableContextMenu(datarow: any, menu: any): boolean {
    let isDisable: boolean = false;
    if (menu.disablebyStatus.includes(datarow.REQUESTSTATUSDSC))
      isDisable = true;
    return isDisable;
  }
}
