import { Component, OnInit } from '@angular/core';
import { ApplicationTypeService } from '@NFS_Core/NFSServices/_helper/application-type.service';
import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';

@Component({
    selector: 'app-application-type',
    templateUrl: './application-type.component.html',
    styleUrls: ['./application-type.component.css'],
    standalone: false
})
export class ApplicationTypeComponent implements OnInit {

  type: any = ''
  selected: any = false;

  constructor(private _appTypeService : ApplicationTypeService,public appConfig: AppConfigService) { }

  ngOnInit(): void {

  }

  onChange(val: any) {
    this._appTypeService.setApplicationType(val);
    this.selected = true;
  }
  
  goBack(){
    window.history.back();
  }
}
