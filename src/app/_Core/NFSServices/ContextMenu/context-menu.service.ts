import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IContextMenu } from '@NFS_Interfaces/OtherInterfaces/IContextMenu.interface';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContextMenuService {

  constructor(private http: HttpClient) { }

  getMOTMOContextMenu() : Observable<Array<IContextMenu>> {
    const jsonFile = `assets/ContextMenu/mo-tmo-contextmenu.json`;
    return this.http.get<Array<IContextMenu>>(jsonFile);
  }

  getAPCContextMenu() : Observable<Array<IContextMenu>> {
    const jsonFile = `assets/ContextMenu/apc-contextmenu.json`;
    return this.http.get<Array<IContextMenu>>(jsonFile);
  }

  getCAPContextMenu() : Observable<Array<IContextMenu>> {
    const jsonFile = `assets/ContextMenu/cap-contextmenu.json`;
    return this.http.get<Array<IContextMenu>>(jsonFile);
  }
}
