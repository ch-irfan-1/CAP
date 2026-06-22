import { Injectable } from '@angular/core';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { from, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class WorkQueueHelperService {

  constructor(private http : HttpClient) { }
  getWorkQueueDropdownColumns() : Observable<Array<any>> {
    const jsonFile = `assets/WorkQueue/WorkQueueColumns.json`;
    return this.http.get<Array<any>>(jsonFile);
  }
}
