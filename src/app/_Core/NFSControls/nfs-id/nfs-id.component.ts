import { Component, Input, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { FormControl } from 'src/Library';
import { getErrorMessage } from '../nfs-control-helper/GetErrorMessage';
import { IsRequiredField } from '../nfs-control-helper/IsRequiredControl';

@Component({
    selector: 'nfs-id',
    templateUrl: './nfs-id.component.html',
    styleUrls: ['./nfs-id.component.css'],
    standalone: false
})
export class NfsIdComponent implements OnInit, ControlValueAccessor {
  @Input() Placeholder: string = "";
  @Input() Label: string = "";
  @Input() autocomplete: string = "off";
  @Input() AlllowedCharsForMsg: string = "" //string for allowed charcters list only for display in error message e.g "Alphanumber dot and dash"
  @Input() Type: string = "text";
  @Input() format: string = "";
  @Input() allowedSpecialCharacters: Array<string> = [];
  @Input() includeSpecialCharacters: boolean = true;

  public TextBoxControl: FormControl = new FormControl();
  public IsRequiredField: boolean = false;
  public ErrorMessage: string = "";

  constructor(@Optional() @Self() private ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  onChange: any = () => { }
  onTouch: any = () => { }

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
      this.TextBoxControl.setValidators(control.validator);
      this.TextBoxControl.updateValueAndValidity();
      this.IsRequiredField = IsRequiredField(this.TextBoxControl);
    }

    this.TextBoxControl.valueChanges.subscribe((newValue) => {
      this.value = newValue;
    });

    this.includeSpecialCharacters = !this.includeSpecialCharacters;
  }

  set value(val: string) {
    if (val !== undefined && val !== null) {
      this.TextBoxControl.setValue(val, { emitEvent: false });
      this.onChange(val);
      this.onTouch(val);
    }
  }


  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.TextBoxControl.disable() : this.TextBoxControl.enable();
  }

  IsFieldValid() {
    if (this.TextBoxControl.errors) {
      this.ErrorMessage = getErrorMessage(this.TextBoxControl, this.Label, this.AlllowedCharsForMsg);
      return true;
    }
    return false;
  }

}
