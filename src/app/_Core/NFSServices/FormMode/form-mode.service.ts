import { Injectable } from '@angular/core';
import { FormMode } from '@NFS_Enums/FormMode.enum';

@Injectable({
  providedIn: 'root'
})
export class FormModeService {

  public FormMode: FormMode = FormMode.NEW;
  constructor() { }
}
