import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { FormMode } from '@NFS_Enums/FormMode.enum';

@Component({
    selector: 'nfs-button',
    templateUrl: './nfs-button.component.html',
    styleUrls: ['./nfs-button.component.css'],
    standalone: false
})
export class NfsButtonComponent implements OnInit {
  @Input() disabled = false;
  @Input() color: string = "";
  @Input() text = "Click";
  @Input() matButton: boolean = false;
  @Input() matRaisedButton: boolean = false;
  @Input() matRaisedButtonIcon: boolean = false;
  @Input() icon: string = "";
  @Input() iconPng: string = "";
  @Input() iconPngHover: string = "";
  @Output() onBtnClick = new EventEmitter();
  @Input() Mode: string = FormMode.NEW;
  @Input() type: string = "button";
  @Input() alwaysEnable = false;
  @Input() tooltip = '';

  public btnColor: string = "";
  public btnType: string = "";

  constructor(private _formModeService: FormModeService) { }

  ngOnInit(): void {
    if (!this.alwaysEnable && this._formModeService.FormMode == FormMode.VIEW) {
      this.disabled = true;
    }
    this.btnColor = this.color;
    
  }

  public onClick(event: Event) {
    this.onBtnClick.emit();
  }
}