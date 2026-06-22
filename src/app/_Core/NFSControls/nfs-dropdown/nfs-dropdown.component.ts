import { AfterViewInit, Component, EventEmitter, forwardRef, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, ControlValueAccessor, UntypedFormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { getErrorMessage } from '../nfs-control-helper/GetErrorMessage';
import { IsRequiredField } from '../nfs-control-helper/IsRequiredControl';
import { ControlFinder } from '../nfs-control-helper/Localization';



// export const NFS_DROPDOWN_VALUE_ACCESSOR: any = {
//   provide: NG_VALUE_ACCESSOR,
//   useExisting: forwardRef(() => NFSDropdownComponent),
//   multi: true,
// };


@Component({
    selector: 'nfs-dropdown',
    templateUrl: './nfs-dropdown.component.html',
    styleUrls: ['./nfs-dropdown.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NFSDropdownComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => NFSDropdownComponent),
            multi: true,
        },
    ]
    // providers: [NFS_DROPDOWN_VALUE_ACCESSOR],
    ,
    standalone: false
})
export class NFSDropdownComponent implements OnInit, ControlValueAccessor, Validator, AfterViewInit {

  /************* START: Inputs *************/
  @Input('formControlName') controlName: string | number | null = null;

  //Main Control options
  @Input() Label: string = "";
  @Input() controlPlaceholder: string = ""
  @Input() customClass: string = ""
  @Input() Ismultiselect: boolean = false;
  @Input() Index: number = 0;

  //Drop Down Filter Options.
  @Input() EnableFilter: boolean = false;
  @Input() FilterControlPlaceholder: string = "Find...";
  @Input() noSearchEntriesFoundLabel: string = "no matching Valuse found";

  // Unselect Drop Down options.
  @Input() AllowUnSelect: boolean = true;
  @Input() TextForUnselectOpt: string = "None";
  @Input() valueForUnselectOpt: string = "";

  // Input data for Drop Down
  @Input() DataArray: Array<INFSDropDownData> = [];
  @Input() Component: string = '';
  @Input() Name: string = '';
  @Input() isControlDisable: boolean = false;
  @Input() ApplyLocalLabel: boolean = false;

  /************* END: Inputs *************/

  /************* START: Outputs *************/
  @Output() selectionChange = new EventEmitter<any>();
  /************* END: Outputs *************/

  public FilterControl: UntypedFormControl = new UntypedFormControl();
  public DropDownControl: UntypedFormControl = new UntypedFormControl();
  public FilteredData: Array<INFSDropDownData> = [];
  public ErrorMessage: string = "";
  public IsRequiredField: boolean = false;
  public LocalJson: any;
  public ctrlName!: string;


  onChange: any = () => { }
  onTouch: any = () => { }
  onValidationChange: any = () => { }
  // disabled: boolean = false;

  constructor(private _store: ClientStoreService,
    private _appConfig: AppConfigService,
    private _formModeService: FormModeService,
    private _msgService: MessageService) {
    // if (ngControl != null) {
    //   // Setting the value accessor directly (instead of using the providers) to avoid running into a circular import.
    //   ngControl.valueAccessor = this;
    // }
  }

  ngAfterViewInit(): void {

  }

  validate(control: AbstractControl): ValidationErrors | null {
    this.performLocalizationAndValidation(control);
    this.IsRequiredField = IsRequiredField(this.DropDownControl);
    if (this.IsRequiredField && (this.DropDownControl.value == "0" || this.DropDownControl.value == "" || this.DropDownControl.value == null))
      return { required: true };
    else
      return null;
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.FilteredData = this.DataArray;
  }

  /**
   * On init life cycle hook
   */
  ngOnInit() {

    if (this._formModeService.FormMode == FormMode.VIEW) {
      this.isControlDisable = true;
    }
    /*********** For Drop Down Search filter ***********/
    this.FilteredData = this.DataArray;
    this.FilterControlPlaceholder = 'Search ' + this.Label.replace('*', '').replace('Search','');

    if (this.FilteredData && this.FilteredData[0]?.id && (this.FilteredData[0].code == "" || this.FilteredData[0].code == null)) {
      this.FilteredData.forEach(item => {
        item.id = item.id.toString();
      })
    }
    this.FilterControl.valueChanges.subscribe((FilterValue) => {
      if (this.DataArray) {
        this.FilteredData = this.DataArray.filter((data) => {
          return data.TextValue.toLowerCase().includes(FilterValue.toLowerCase());
        });
      }
    });

    /********** initialize in case of edit *********/
    if (this.DropDownControl?.value) {
      this.value = String(this.DropDownControl?.value);
    }

    /********** Setting Value on drop down selection change *********/
    this.DropDownControl.valueChanges.subscribe((newValue) => {
      this.value = newValue;
    });

    // Force restart of validation
    if (this.DropDownControl) {
      this.DropDownControl.updateValueAndValidity({
        onlySelf: true
      });
    }
  }

  /**
   * Setter for drop down value
   */
  set value(val: string) {
    if (!this.Ismultiselect && val!=null)
      this.DropDownControl.setValue(String(val), { emitEvent: false });
    else
      this.DropDownControl.setValue(val, { emitEvent: false });

    this.onChange(val);
    this.onTouch(val);
    this.onValidationChange();
    //this.selectionChange.emit();
  }

  get tooltipValue() {
    return this.FilteredData?.find(c => c.code === this.DropDownControl.value)?.TextValue;
  }

  //This method is called by the forms API to write to the view when programmatic changes from model to view are requested.
  writeValue(obj: string): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled = this.isControlDisable;
    isDisabled ? this.DropDownControl.disable() : this.DropDownControl.enable();
  }

  DropDownSelectionChange(event: any) {
    this.selectionChange.emit(event);
  }

  IsFieldValid() {
    if (this._formModeService.FormMode == FormMode.VIEW) {
      this.isControlDisable = true;
    }
    let key : any;
    if(this.Index > 0){
    key = this.Component + "-" + this.Index + "-" + this.Name;
    }
    else{
    key = this.Component + "-" + this.Name;
    }

    if (hasRequiredField(this.DropDownControl)) {
      if (this.DropDownControl.value === '-1' || this.DropDownControl.value === '0') {
        this.DropDownControl.setErrors({ 'required': true });
      }
    }

    if (this.DropDownControl.errors && (this.DropDownControl.value === '-1' || this.DropDownControl.value === '0' || this.DropDownControl.value === '' || this.DropDownControl.value === null)) {
      this.ErrorMessage = getErrorMessage(this.DropDownControl, this.Label);
      if (this._msgService.ErrorMessages.get(key) == undefined) {
        this._msgService.ErrorMessages.set(key, this._msgService.CreateControlCustomMessage(this.ErrorMessage, this.Component));
      }
      return true;
    }
    this._msgService.ErrorMessages.delete(key);
    return false;
  }

  performLocalizationAndValidation(control: AbstractControl) {
    var UMSValidator = ControlFinder(this._appConfig.LocalData, this.Name, this.Component, this._store.GetModule());

    if (this._appConfig.ValidationsData != null && Object.keys(this._appConfig.ValidationsData)?.length > 0)
      var moduleValidator = ControlFinder(this._appConfig.ValidationsData, this.Name, this.Component);

    if (UMSValidator.length > 0) {
      if (UMSValidator[0]?.LocalValue && !this.ApplyLocalLabel)
        this.Label = UMSValidator[0]?.LocalValue;
      if (UMSValidator[0]?.isMandatory) {
        this.DropDownControl?.setValidators([Validators.required]);
      }
      if (this.isControlDisable != true) {
        if (!UMSValidator[0]?.isEnabled)
          this.isControlDisable = true;
        else if (moduleValidator != undefined && moduleValidator?.length > 0 && !moduleValidator[0]?.isEnabled)
          this.isControlDisable = true;
      }
    }
  }
  registerOnValidatorChange?(fn: () => void): void {
    this.onValidationChange = fn;
  }

  public onTabPress(event: any) {
    if (event?.key == 'Tab' || event?.code == 'Tab') {

    }
  }

  public SetTabIndex(): number {

    if (this.isControlDisable)
      return -1;
    else
      return 0;
  }
}

export const hasRequiredField = (abstractControl: AbstractControl): boolean => {
  if (abstractControl.validator) {
    const validator = abstractControl.validator({} as AbstractControl);
    if (validator && validator.required) {
      return true;
    }
  }

  return false;
};
