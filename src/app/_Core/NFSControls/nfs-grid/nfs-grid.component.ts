import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';

@Component({
    selector: 'nfs-grid',
    templateUrl: './nfs-grid.component.html',
    styleUrls: ['./nfs-grid.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NfsGridComponent implements OnInit {


  // @Input() fg: FormGroup = this.fb.group({idType: this.fb.array([])});
  @Input() controlName: string = "";
  @Input() columns: Array<string> = ["Col 1", "Col 2", "Col 3", "Col 4", "Col 5"];
  @Input() isRadioBtnRequired: boolean = false;
  @Input() isCheckboxRequired: boolean = false;
  @Input() radioPropertyName: string = "";
  @Input() checkboxPropertyName: string = "";
  @Input() inputArr: UntypedFormArray = this.fb.array([]);

  public fg: UntypedFormGroup = this.fb.group({ genericFormArray: this.fb.array([]) });
  public selectedElement: Object = {}
  public genders: Array<string> = ['male', 'female', 'others'];
  /*
  radio
  forma array
  table heading
  Remove controlName
  */

  constructor(
    private fb: UntypedFormBuilder
  ) {
  }

  ngOnInit(): void {
    if (this.isRadioBtnRequired) {
      this.setRadioButtonValue();
    }
    this.fg.setControl('genericFormArray', this.inputArr);
  }

  addOption(): void {
    this.genericFormArray.push(this.buildListItem());
  }

  removeOption(i: number): void {
    this.genericFormArray.removeAt(i);
  }

  private buildListItem(): UntypedFormGroup {
    return this.fb.group({
      serial: null,
      id: null,
      name: '',
      fullName: '',
      gender: 'male',
      default: false,

    });
  }

  get genericFormArray(): UntypedFormArray {
    return this.fg.get('genericFormArray') as UntypedFormArray;
  }


  checkValue(i: number) {
    this.genericFormArray.controls.forEach((obj, index) => {
      if (index === i) {
      }
      else {
        var ctrl = this.genericFormArray.controls[i] as UntypedFormGroup;
        var a = ctrl?.get(this.radioPropertyName);
        if (a != null) {
        }
      }
    });

  }

  setRadioButtonValue() {
    this.genericFormArray.controls.forEach(control => {
      if (control != null && control?.get('default')?.value) {

      }

    })
  }

  OnDefaultRecordChange(i: number) {
    this.genericFormArray.controls.forEach((control, index) => {
      if (this.genericFormArray.controls[index].get(this.radioPropertyName)) {
        this.genericFormArray.controls[index].get(this.radioPropertyName)?.setValue(false, { emitEvent: false });
      }
    });

    this.genericFormArray.controls[i].get(this.radioPropertyName)?.setValue(true);
  }

  returnZero() {
    return 0;
  }

  radioChange(event: MatRadioChange, data: any) {

  }

}


