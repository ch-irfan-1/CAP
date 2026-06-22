import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IControlSecurity } from '@NFS_Interfaces/OtherInterfaces/icontrol-security';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ControlsecurityService {

  constructor(private http:HttpClient) { }
  loadControlSecurity() : Observable<Array<IControlSecurity>> {
    const jsonFile = `assets/ControlSecurity/oto_ControlSecurity.json`;
    return this.http.get<Array<IControlSecurity>>(jsonFile);
  }
  loadControlEnable() : Observable<Array<IControlSecurity>> {
    const jsonFile = `assets/ControlSecurity/oto_ControlEnable.json`;
    return this.http.get<Array<IControlSecurity>>(jsonFile);
  }
}
