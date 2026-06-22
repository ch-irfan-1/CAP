import { Component, EventEmitter, Input, OnInit, Optional, Output, Self } from '@angular/core';
import { ControlValueAccessor, UntypedFormControl, NgControl } from '@angular/forms';
import { getErrorMessage } from '@NFS_Core/NFSControls/nfs-control-helper/GetErrorMessage';
import { IsRequiredField } from '@NFS_Core/NFSControls/nfs-control-helper/IsRequiredControl';

@Component({
    selector: 'nfs-password',
    templateUrl: './nfs-password.component.html',
    styleUrls: ['./nfs-password.component.css'],
    standalone: false
})
export class NfsPasswordComponent implements OnInit, ControlValueAccessor {
  @Input() placeholder: string = "";
  @Input() label: string = "";
  @Input() autoComplete: string = "off";
  @Input() type: string = "password";
  @Input() AlllowedCharsForMsg: string = "";
  @Input() maxLength: number = 999;
  @Input() isControlDisable: boolean = false;
  @Output() OnKeyPress = new EventEmitter;

  public passwordControl: UntypedFormControl = new UntypedFormControl('', { updateOn: 'blur' });
  public isRequired: boolean = false;
  public errorMsg: string = "";

  onChange: any = () => { }
  onTouch: any = () => { }

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (ngControl != null)
      ngControl.valueAccessor = this;
  }

  writeValue(obj: any): void {
    this.value = obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }



  ngOnInit(): void {
    const control = this.ngControl && this.ngControl.control;
    if (control) {
      this.passwordControl.setValidators(control.validator);
      this.passwordControl.updateValueAndValidity();
      this.isRequired = IsRequiredField(control);
    }

    this.passwordControl.valueChanges.subscribe(val => {
      this.value = val;
    })
  }

  set value(val: string) {
    if (val != null && val != undefined) {
      this.passwordControl.setValue(val, { emitEvent: false });
      this.onChange(val);
      this.onTouch(val);
    }
  }

  setDisableState?(isDisabled: boolean): void {
    isDisabled ? this.passwordControl.disable() : this.passwordControl.enable();
  }

  isFieldNotValid() {
    if (this.passwordControl.errors) {
      this.errorMsg = getErrorMessage(this.passwordControl, this.label, this.AlllowedCharsForMsg);
      return true;
    }
    return false;
  }

  public onKeypressEvent(event: any) {
    var x = event?.code;
    if (x === "Enter" || x === "NumpadEnter") {
      this.value = event?.target?.value;
      this.OnKeyPress.emit();
    }
  }
}
