import { Injectable } from '@angular/core';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { FormArray, FormControl, FormGroup } from 'src/Library';


@Injectable({
  providedIn: 'root'
})

export class StateManagment {
  public SetFormState(_FormGroup: FormGroup, _FormMode: FormMode, _newState: DataRowState = DataRowState.None, resetState: boolean) {
    Object.keys(_FormGroup?.controls)?.forEach((control, Index) => {
      const _control = _FormGroup.controls[control];

      //Set Row state If Form is dirty or if new state is removed.
      if (control == "RowState" && _FormGroup.dirty && _newState !== DataRowState.Removed && _control.value !== DataRowState.Removed) {
        _control.setValue(this.UpdateRowState(_control.value, _FormMode, _newState, resetState));
      }
      else if (control == "RowState" && _newState === DataRowState.Removed) {
        _control.setValue(this.UpdateRowState(_control.value, _FormMode, _newState, resetState));
      }

      //If FormGroup array iterate over all array elements making recursive calls
      if (_control.value instanceof Array) {
        (_control as FormArray)?.controls?.forEach((InnerControl, IcIndex) => {
          this.SetFormState((InnerControl as FormGroup), _FormMode, _newState, resetState);
        });
      }

      //If Control is a FormGroup element make recursive call.
      //Implemented date instance check because Date is also considered as instance of object.
      else if (_control.value instanceof Object && !(_control.value instanceof Date)) {
        this.SetFormState((_control as FormGroup), _FormMode, _newState, resetState);
      }
    });
  }

  public MarkAllDirty(_FormGroup: FormGroup) {
    Object.keys(_FormGroup?.controls)?.forEach((control, Index) => {
      const _control = _FormGroup.controls[control];

      _control.markAsDirty();

      //If FormGroup array iterate over all array elements making recursive calls
      if (_control.value instanceof Array) {
        (_control as FormArray)?.controls?.forEach((InnerControl, IcIndex) => {
          //MarkAllDirty(_FormGroup: FormGroup)
          this.MarkAllDirty((InnerControl as FormGroup));
        });
      }
    });
  }
  private UpdateRowState(CurrentState: DataRowState, _FormMode: FormMode, NewState: DataRowState, resetState: boolean): DataRowState {
    if (_FormMode === FormMode.EDIT) {
      if (this.IsRowStateValidToApply(CurrentState, NewState, resetState))
        return NewState
    }
    if (_FormMode === FormMode.NEW || _FormMode === FormMode.LOAD) {
      return DataRowState.Added;
    }
    return CurrentState;
  }

  private IsRowStateValidToApply(oldRowState: DataRowState, newRowState: DataRowState, resetState: boolean) {
    if (oldRowState == DataRowState.UnChanged && newRowState == DataRowState.None) {
      return false; // UnChangd cant be converted to None Directly. UnChanged=>Added=>None
    }
    else if (oldRowState == DataRowState.UnChanged && newRowState == DataRowState.Updated) {
      return false; // UnChangd cant be converted to Updated Directly. UnChanged=>Added=>None=>Updated
    }
    else if (oldRowState == DataRowState.UnChanged && newRowState == DataRowState.Removed) {
      return false; // UnChangd cant be converted to Updated Directly. UnChanged=>Added=>None=>Updated
    }
    else if (oldRowState == DataRowState.Added && newRowState == DataRowState.Updated) {
      return false; ///Do Nothing. Added Cant be converted to Updated Directly. Right Scenario is Added=>None=>Updated
    }
    else if (oldRowState == DataRowState.Added && newRowState == DataRowState.Removed) {
      return true;
    }
    else if (oldRowState == DataRowState.Added && newRowState == DataRowState.UnChanged) {
      return false; ///Do Nothing. Added Cant be converted to UnChanged ever
    }
    else if (oldRowState == DataRowState.None && newRowState == DataRowState.UnChanged) {
      return false;
    }
    else if (oldRowState == DataRowState.None && newRowState == DataRowState.Updated && !resetState) {
      return true;
    }
    else if (oldRowState == DataRowState.None && newRowState == DataRowState.Updated && !resetState) {
      return true;
    }
    else if (oldRowState == DataRowState.Updated && newRowState == DataRowState.Added) {
      return false;
    }
    else if (oldRowState == DataRowState.Updated && newRowState == DataRowState.UnChanged) {
      return false;
    }
    return true;
  }

  public ResetFormState(_FormGroup: FormGroup, _newState: DataRowState) {
    Object.keys(_FormGroup?.controls)?.forEach((control, Index) => {
      const _control = _FormGroup.controls[control];

      //Set Row state If Form is dirty or if new state is removed.
      if (control == "RowState" && (_newState === DataRowState.Pristine || (_control.value != DataRowState.Added && _control.value != DataRowState.Removed))) {
        _control.setValue(_newState);
      }

      //If FormGroup array iterate over all array elements making recursive calls
      if (_control.value instanceof Array) {
        (_control as FormArray)?.controls?.forEach((InnerControl, IcIndex) => {
          this.ResetFormState((InnerControl as FormGroup), _newState);
        });
      }

      //If Control is a FormGroup element make recursive call.
      //Implemented date instance check because Date is also considered as instance of object.
      else if (_control.value instanceof Object && !(_control.value instanceof Date)) {
        this.ResetFormState((_control as FormGroup), _newState);
      }
    });
  }

  public ResetFormArrayState(_formArray: any, _newState: DataRowState) {
    const formArrayCount = _formArray.length;
    for (let i = formArrayCount - 1; i >= 0; i--) {
      if (_formArray.controls[i]?.controls.RowState.value !== DataRowState.Added) {
        this.ResetFormState(_formArray.controls[i], DataRowState.Removed);
      }
      else {
        _formArray.removeAt(i);
      }
    }
  }

  public UpdateFormArrayState(_formArray: any, _newState: DataRowState) {
    const formArrayCount = _formArray.length;
    for (let i = formArrayCount - 1; i >= 0; i--) {
      if (_formArray.controls[i]?.controls.RowState.value !== DataRowState.Added) {
        this.UpdateFormState(_formArray.controls[i], _newState);
      }
    }
  }

  public UpdateFormState(_FormGroup: FormGroup, _newState: DataRowState) {
    Object.keys(_FormGroup?.controls)?.forEach((control, Index) => {
      const _control = _FormGroup.controls[control];

      //Set Row state If Form is dirty or if new state is removed.
      if (control == "RowState" && _control.value != DataRowState.Added && _control.value != DataRowState.Removed) {
        _control.setValue(_newState);
      }

      //If FormGroup array iterate over all array elements making recursive calls
      if (_control.value instanceof Array) {
        (_control as FormArray)?.controls?.forEach((InnerControl, IcIndex) => {
          this.UpdateFormState((InnerControl as FormGroup), _newState);
        });
      }

      //If Control is a FormGroup element make recursive call.
      //Implemented date instance check because Date is also considered as instance of object.
      else if (_control.value instanceof Object && !(_control.value instanceof Date)) {
        this.UpdateFormState((_control as FormGroup), _newState);
      }
    });
  }

  public ClearValidators(_FormGroup: FormGroup) {

    if (_FormGroup === undefined) {
      return;
    }

    Object.keys(_FormGroup?.controls)?.forEach((control, Index) => {
      const _control = _FormGroup.controls[control];

      //If FormGroup array iterate over all array elements making recursive calls
      if (_control.value instanceof Array) {
        (_control as FormArray)?.controls?.forEach((InnerControl, IcIndex) => {
          this.ClearValidators((InnerControl as FormGroup));
        });
      }
      //If Control is a FormGroup element make recursive call.
      //Implemented date instance check because Date is also considered as instance of object.
      else if (_control.value instanceof Object && !(_control.value instanceof Date)) {
        this.ClearValidators((_control as FormGroup));
      }
      else if (_control instanceof Object) {
        _control.clearValidators();
        _control.updateValueAndValidity();
      }
    });
  }

  public SetValueWithDirtyState(_control: FormControl, _value: any, _options: any = null) {
    _control.markAsDirty();
    if (_options === null) {
      _control.setValue(_value);
    } else {
      _control.setValue(_value, _options);
    }
  }

  public AcceptChanges(_FormGroup: FormGroup) {
    Object.keys(_FormGroup?.controls)?.forEach((control, Index) => {
      const _control = _FormGroup.controls[control];

      //If FormGroup array iterate over all array elements making recursive calls
      if (_control.value instanceof Array ) {
        this.AcceptArrayChanges((_control as FormArray));
      }

      //If Control is a FormGroup element make recursive call.
      //Implemented date instance check because Date is also considered as instance of object.
      else if (_control.value instanceof Object && !(_control.value instanceof Date)) {
        this.AcceptChanges((_control as FormGroup));
      }
    });
  }

  public AcceptArrayChanges(_formArray: any) {
    const formArrayCount = _formArray.length;
    for (let i = formArrayCount - 1; i >= 0; i--) {
      if (_formArray.controls[i]?.controls.RowState.value === DataRowState.Removed) {
        _formArray.removeAt(i);
      }
      else{
        this.AcceptChanges(_formArray.controls[i]);
      }
    }
  } 

}
