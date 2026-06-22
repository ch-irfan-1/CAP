import { Injectable } from '@angular/core';
import { PropertyFinder } from '@NFS_Core/NFSControls/nfs-control-helper/Localization';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { AppConfigService } from '../ApplicationConfig/app-config.service';
import { ControlsecurityService } from '../ControlSecurity/controlsecurity.service';
import { MasterDataService } from '../MasterData/master-data.service';

@Injectable({
  providedIn: 'root',
})
export class ApplicationTypeService {
  constructor(private _controlsecurity: ControlsecurityService,
    private _appConfig: AppConfigService,
    public _proposalDataService: ProposalDataService, private _masterDataService: MasterDataService
  ) { }

  setApplicationType(selectedType: string) {
    localStorage.setItem('appType', selectedType);
  }

  getApplicationType(): string {
    return localStorage.getItem('appType') as string;
  }

  isControlEnabled(controlName: any): boolean {
    let ret: boolean = false;

    var validator = PropertyFinder(
      this._appConfig.ValidationsData,
      controlName
    );

    if (
      validator.length > 0 &&
      this._proposalDataService.PROPOSAL.controls.FINANCETYP.value !== ''
    ) {
      ret = Object(validator[0])[
        Object(validator[0])[
        this._proposalDataService.PROPOSAL.controls.FINANCETYP.value
        ]
      ];
    }

    return ret === undefined ? false : ret;
  }

  isControlVisible(controlName: any): boolean {
    return (this._masterDataService.ControlSecurity.filter(x => x.Name == controlName)[0]?.Financetype.includes(this._proposalDataService.PROPOSAL.controls.FINANCETYP.value));
  }

  isControlDisable(controlName: any): boolean {
    let disable: boolean = false;
    let control = this._masterDataService.ControlDisablity.filter(x => x.Name == controlName)[0];

    if (control !== null && control !== undefined) {
      let index = control.Financetype.findIndex((f: any) =>
        f.FINETYPE === this._proposalDataService.PROPOSAL.controls.FINANCETYP.value &&
        Boolean(JSON.parse(f.ISMCOMM)) === this._proposalDataService.PROPOSAL.controls.ISMCOMCAMPAIGN.value);

      if (index !== -1) {
        disable = true;
      }
    }

    return disable;
  }
}
