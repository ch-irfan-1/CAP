import { UntypedFormGroup as NativeFormGroup } from '@angular/forms';
export class FormGroup extends NativeFormGroup {
    /**
     * Creates a new `FormGroup` instance.
     *
     * @param controls A collection of child controls. The key for each child is the name
     * under which it is registered.
     *
     * @param validatorOrOpts A synchronous validator function, or an array of
     * such functions, or an `AbstractControlOptions` object that contains validation functions
     * and a validation trigger.
     *
     * @param asyncValidator A single async validator or array of async validator functions
     *
     * @todo Chechout how to respect optional and require properties modifyers for the controls.
     */
    constructor(controls, validatorOrOpts, asyncValidator) {
        super(controls, validatorOrOpts, asyncValidator);
        this.controls = controls;
    }
    /**
     * Registers a control with the group's list of controls.
     *
     * This method does not update the value or validity of the control.
     * Use [addControl](https://angular.io/api/forms/FormGroup#addControl) instead.
     *
     * @param name The control name to register in the collection
     * @param control Provides the control for the given name
     */
    registerControl(name, control) {
        return super.registerControl(name, control);
    }
    /**
     * Add a control to this group.
     *
     * This method also updates the value and validity of the control.
     *
     * @param name The control name to add to the collection
     * @param control Provides the control for the given name
     */
    addControl(name, control) {
        return super.addControl(name, control);
    }
    /**
     * Remove a control from this group.
     *
     * @param name The control name to remove from the collection
     */
    removeControl(name) {
        return super.removeControl(name);
    }
    /**
     * Replace an existing control.
     *
     * @param name The control name to replace in the collection
     * @param control Provides the control for the given name
     */
    setControl(name, control) {
        return super.setControl(name, control);
    }
    /**
     * Check whether there is an enabled control with the given name in the group.
     *
     * Reports false for disabled controls. If you'd like to check for existence in the group
     * only, use [get](https://angular.io/api/forms/AbstractControl#get) instead.
     *
     * @param name The control name to check for existence in the collection
     *
     * @returns false for disabled controls, true otherwise.
     */
    contains(name) {
        return super.contains(name);
    }
    /**
     * Sets the value of the `FormGroup`. It accepts an object that matches
     * the structure of the group, with control names as keys.
     *
     * ### Set the complete value for the form group
     *
  ```ts
  const form = new FormGroup({
    first: new FormControl(),
    last: new FormControl()
  });
  
  console.log(form.value);   // {first: null, last: null}
  
  form.setValue({first: 'Nancy', last: 'Drew'});
  console.log(form.value);   // {first: 'Nancy', last: 'Drew'}
  ```
     *
     * @throws When strict checks fail, such as setting the value of a control
     * that doesn't exist or if you excluding the value of a control.
     *
     * @param value The new value for the control that matches the structure of the group.
     * @param options Configuration options that determine how the control propagates changes
     * and emits events after the value changes.
     * The configuration options are passed to the
     * [updateValueAndValidity](https://angular.io/api/forms/AbstractControl#updateValueAndValidity) method.
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
     * false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control value is updated.
     * When false, no events are emitted.
     */
    setValue(value, options = {}) {
        return super.setValue(value, options);
    }
    /**
     * Patches the value of the `FormGroup`. It accepts an object with control
     * names as keys, and does its best to match the values to the correct controls
     * in the group.
     *
     * It accepts both super-sets and sub-sets of the group without throwing an error.
     *
     * ### Patch the value for a form group
     *
  ```ts
  const form = new FormGroup({
     first: new FormControl(),
     last: new FormControl()
  });
  console.log(form.value);   // {first: null, last: null}
  
  form.patchValue({first: 'Nancy'});
  console.log(form.value);   // {first: 'Nancy', last: null}
  ```
     *
     * @param value The object that matches the structure of the group.
     * @param options Configuration options that determine how the control propagates changes and
     * emits events after the value is patched.
     * * `onlySelf`: When true, each change only affects this control and not its parent. Default is
     * true.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control value is updated.
     * When false, no events are emitted.
     * The configuration options are passed to the
     * [updateValueAndValidity](https://angular.io/api/forms/AbstractControl#updateValueAndValidity) method.
     */
    patchValue(value, options = {}) {
        return super.patchValue(value, options);
    }
    /**
     * Resets the `FormGroup`, marks all descendants are marked `pristine` and `untouched`, and
     * the value of all descendants to null.
     *
     * You reset to a specific form state by passing in a map of states
     * that matches the structure of your form, with control names as keys. The state
     * is a standalone value or a form state object with both a value and a disabled
     * status.
     *
     * @param formState Resets the control with an initial value,
     * or an object that defines the initial value and disabled state.
     *
     * @param options Configuration options that determine how the control propagates changes
     * and emits events when the group is reset.
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
     * false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is reset.
     * When false, no events are emitted.
     * The configuration options are passed to the
     * [updateValueAndValidity](https://angular.io/api/forms/AbstractControl#updateValueAndValidity) method.
     *
     *
     * ### Reset the form group values
     *
  ```ts
  const form = new FormGroup({
    first: new FormControl('first name'),
    last: new FormControl('last name')
  });
  
  console.log(form.value);  // {first: 'first name', last: 'last name'}
  
  form.reset({ first: 'name', last: 'last name' });
  
  console.log(form.value);  // {first: 'name', last: 'last name'}
  ```
     *
     * ### Reset the form group values and disabled status
     *
  ```ts
  const form = new FormGroup({
    first: new FormControl('first name'),
    last: new FormControl('last name')
  });
  
  form.reset({
    first: {value: 'name', disabled: true},
    last: 'last'
  });
  
  console.log(this.form.value);  // {first: 'name', last: 'last name'}
  console.log(this.form.get('first').status);  // 'DISABLED'
  ```
     */
    reset(value = {}, options = {}) {
        return super.reset(value, options);
    }
    /**
     * The aggregate value of the `FormGroup`, including any disabled controls.
     *
     * Retrieves all values regardless of disabled status.
     * The `value` property is the best way to get the value of the group, because
     * it excludes disabled controls in the `FormGroup`.
     */
    getRawValue() {
        return super.getRawValue();
    }
    /**
     * Retrieves a child control given the control's name.
     *
     * ### Retrieve a nested control
     *
     * For example, to get a `name` control nested within a `person` sub-group:
  ```ts
  this.form.get('person').get('name');
  ```
     */
    get(controlName) {
        return super.get(controlName);
    }
    /**
     * Sets the synchronous validators that are active on this control. Calling
     * this overwrites any existing sync validators.
     */
    setValidators(newValidator) {
        return super.setValidators(newValidator);
    }
    /**
     * Sets the async validators that are active on this control. Calling this
     * overwrites any existing async validators.
     */
    setAsyncValidators(newValidator) {
        return super.setAsyncValidators(newValidator);
    }
    /**
     * Sets errors on a form control when running validations manually, rather than automatically.
     *
     * Calling `setErrors` also updates the validity of the parent control.
     *
     * ### Manually set the errors for a control
     *
     * ```ts
     * const login = new FormControl('someLogin');
     * login.setErrors({
     *   notUnique: true
     * });
     *
     * expect(login.valid).toEqual(false);
     * expect(login.errors).toEqual({ notUnique: true });
     *
     * login.setValue('someOtherLogin');
     *
     * expect(login.valid).toEqual(true);
     * ```
     */
    setErrors(errors, opts = {}) {
        return super.setErrors(errors, opts);
    }
    /**
     * Reports error data for the control with the given controlName.
     *
     * @param errorCode The code of the error to check
     * @param controlName A control name that designates how to move from the current control
     * to the control that should be queried for errors.
     *
     * For example, for the following `FormGroup`:
     *
  ```ts
  form = new FormGroup({
    address: new FormGroup({ street: new FormControl() })
  });
  ```
     *
     * The controlName to the 'street' control from the root form would be 'address' -> 'street'.
     *
     * It can be provided to this method in combination with `get()` method:
     *
  ```ts
  form.get('address').getError('someErrorCode', 'street');
  ```
     *
     * @returns error data for that particular error. If the control or error is not present,
     * null is returned.
     */
    getError(errorCode, controlName) {
        return super.getError(errorCode, controlName);
    }
    /**
     * Reports whether the control with the given controlName has the error specified.
     *
     * @param errorCode The code of the error to check
     * @param controlName A control name that designates how to move from the current control
     * to the control that should be queried for errors.
     *
     * For example, for the following `FormGroup`:
     *
  ```ts
  form = new FormGroup({
    address: new FormGroup({ street: new FormControl() })
  });
  ```
     *
     * The controlName to the 'street' control from the root form would be 'address' -> 'street'.
     *
     * It can be provided to this method in combination with `get()` method:
  ```ts
  form.get('address').hasError('someErrorCode', 'street');
  ```
     *
     * If no controlName is given, this method checks for the error on the current control.
     *
     * @returns whether the given error is present in the control at the given controlName.
     *
     * If the control is not present, false is returned.
     */
    hasError(errorCode, controlName) {
        return super.hasError(errorCode, controlName);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1ncm91cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL215LWxpYi9zcmMvbGliL3NyYy9saWIvZm9ybS1ncm91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsZ0JBQWdCLElBQUksZUFBZSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFnQnJFLE1BQU0sT0FBTyxTQUdYLFNBQVEsZUFBZTtJQU92Qjs7Ozs7Ozs7Ozs7OztPQWFHO0lBQ0gsWUFDa0IsUUFBa0QsRUFDbEUsZUFJUSxFQUNSLGNBQTZEO1FBRTdELEtBQUssQ0FBQyxRQUFRLEVBQUUsZUFBZSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBUmpDLGFBQVEsR0FBUixRQUFRLENBQTBDO0lBU3BFLENBQUM7SUFFRDs7Ozs7Ozs7T0FRRztJQUNNLGVBQWUsQ0FHdEIsSUFBTyxFQUFFLE9BQThCO1FBQ3ZDLE9BQU8sS0FBSyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUEwQixDQUFDO0lBQ3ZFLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ00sVUFBVSxDQUdqQixJQUFPLEVBQUUsT0FBOEI7UUFDdkMsT0FBTyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNNLGFBQWEsQ0FBMEIsSUFBTztRQUNyRCxPQUFPLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ00sVUFBVSxDQUdqQixJQUFPLEVBQUUsT0FBOEI7UUFDdkMsT0FBTyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ00sUUFBUSxDQUEwQixJQUFPO1FBQ2hELE9BQU8sS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQWlDRztJQUNNLFFBQVEsQ0FDZixLQUEyQixFQUMzQixVQUF1RCxFQUFFO1FBRXpELE9BQU8sS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BK0JHO0lBQ00sVUFBVSxDQUNqQixLQUFvQyxFQUNwQyxVQUF1RCxFQUFFO1FBRXpELE9BQU8sS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BdURHO0lBQ00sS0FBSyxDQUNaLFFBQThCLEVBQVMsRUFDdkMsVUFBdUQsRUFBRTtRQUV6RCxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDTSxXQUFXO1FBQ2xCLE9BQU8sS0FBSyxDQUFDLFdBQVcsRUFBMEIsQ0FBQztJQUNyRCxDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ00sR0FBRyxDQUNWLFdBQWM7UUFFZCxPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFpQyxDQUFDO0lBQ2hFLENBQUM7SUFFRDs7O09BR0c7SUFDTSxhQUFhLENBQUMsWUFBZ0Q7UUFDckUsT0FBTyxLQUFLLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRDs7O09BR0c7SUFDTSxrQkFBa0IsQ0FDekIsWUFBMEQ7UUFFMUQsT0FBTyxLQUFLLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQW9CRztJQUNNLFNBQVMsQ0FDaEIsTUFBK0IsRUFDL0IsT0FBZ0MsRUFBRTtRQUVsQyxPQUFPLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXlCRztJQUNNLFFBQVEsQ0FDZixTQUFZLEVBQ1osV0FBZTtRQUVmLE9BQU8sS0FBSyxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFnQixDQUFDO0lBQy9ELENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BMkJHO0lBQ00sUUFBUSxDQUNmLFNBQVksRUFDWixXQUFlO1FBRWYsT0FBTyxLQUFLLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUNoRCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBVbnR5cGVkRm9ybUdyb3VwIGFzIE5hdGl2ZUZvcm1Hcm91cCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQge1xuICBTdGF0dXMsXG4gIFN0cmluZ0tleXMsXG4gIFZhbGlkYXRvckZuLFxuICBBc3luY1ZhbGlkYXRvckZuLFxuICBWYWxpZGF0b3JzTW9kZWwsXG4gIFZhbGlkYXRpb25FcnJvcnMsXG4gIEFic3RyYWN0Q29udHJvbE9wdGlvbnMsXG4gIENvbnRyb2xUeXBlLFxuICBFeHRyYWN0R3JvdXBWYWx1ZSxcbn0gZnJvbSAnLi90eXBlcyc7XG5cbmV4cG9ydCBjbGFzcyBGb3JtR3JvdXA8XG4gIFQgZXh0ZW5kcyBvYmplY3QgPSBhbnksXG4gIFYgZXh0ZW5kcyBvYmplY3QgPSBWYWxpZGF0b3JzTW9kZWxcbj4gZXh0ZW5kcyBOYXRpdmVGb3JtR3JvdXAge1xuICBvdmVycmlkZSByZWFkb25seSB2YWx1ZTogRXh0cmFjdEdyb3VwVmFsdWU8VD47XG4gIG92ZXJyaWRlIHJlYWRvbmx5IHZhbHVlQ2hhbmdlczogT2JzZXJ2YWJsZTxFeHRyYWN0R3JvdXBWYWx1ZTxUPj47XG4gIG92ZXJyaWRlIHJlYWRvbmx5IHN0YXR1czogU3RhdHVzO1xuICBvdmVycmlkZSByZWFkb25seSBzdGF0dXNDaGFuZ2VzOiBPYnNlcnZhYmxlPFN0YXR1cz47XG4gIG92ZXJyaWRlIHJlYWRvbmx5IGVycm9yczogVmFsaWRhdGlvbkVycm9yczxWPiB8IG51bGw7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgYEZvcm1Hcm91cGAgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBwYXJhbSBjb250cm9scyBBIGNvbGxlY3Rpb24gb2YgY2hpbGQgY29udHJvbHMuIFRoZSBrZXkgZm9yIGVhY2ggY2hpbGQgaXMgdGhlIG5hbWVcbiAgICogdW5kZXIgd2hpY2ggaXQgaXMgcmVnaXN0ZXJlZC5cbiAgICpcbiAgICogQHBhcmFtIHZhbGlkYXRvck9yT3B0cyBBIHN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiwgb3IgYW4gYXJyYXkgb2ZcbiAgICogc3VjaCBmdW5jdGlvbnMsIG9yIGFuIGBBYnN0cmFjdENvbnRyb2xPcHRpb25zYCBvYmplY3QgdGhhdCBjb250YWlucyB2YWxpZGF0aW9uIGZ1bmN0aW9uc1xuICAgKiBhbmQgYSB2YWxpZGF0aW9uIHRyaWdnZXIuXG4gICAqXG4gICAqIEBwYXJhbSBhc3luY1ZhbGlkYXRvciBBIHNpbmdsZSBhc3luYyB2YWxpZGF0b3Igb3IgYXJyYXkgb2YgYXN5bmMgdmFsaWRhdG9yIGZ1bmN0aW9uc1xuICAgKlxuICAgKiBAdG9kbyBDaGVjaG91dCBob3cgdG8gcmVzcGVjdCBvcHRpb25hbCBhbmQgcmVxdWlyZSBwcm9wZXJ0aWVzIG1vZGlmeWVycyBmb3IgdGhlIGNvbnRyb2xzLlxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIG92ZXJyaWRlIGNvbnRyb2xzOiB7IFtQIGluIGtleW9mIFRdOiBDb250cm9sVHlwZTxUW1BdLCBWPiB9LFxuICAgIHZhbGlkYXRvck9yT3B0cz86XG4gICAgICB8IFZhbGlkYXRvckZuXG4gICAgICB8IFZhbGlkYXRvckZuW11cbiAgICAgIHwgQWJzdHJhY3RDb250cm9sT3B0aW9uc1xuICAgICAgfCBudWxsLFxuICAgIGFzeW5jVmFsaWRhdG9yPzogQXN5bmNWYWxpZGF0b3JGbiB8IEFzeW5jVmFsaWRhdG9yRm5bXSB8IG51bGxcbiAgKSB7XG4gICAgc3VwZXIoY29udHJvbHMsIHZhbGlkYXRvck9yT3B0cywgYXN5bmNWYWxpZGF0b3IpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNvbnRyb2wgd2l0aCB0aGUgZ3JvdXAncyBsaXN0IG9mIGNvbnRyb2xzLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBkb2VzIG5vdCB1cGRhdGUgdGhlIHZhbHVlIG9yIHZhbGlkaXR5IG9mIHRoZSBjb250cm9sLlxuICAgKiBVc2UgW2FkZENvbnRyb2xdKGh0dHBzOi8vYW5ndWxhci5pby9hcGkvZm9ybXMvRm9ybUdyb3VwI2FkZENvbnRyb2wpIGluc3RlYWQuXG4gICAqXG4gICAqIEBwYXJhbSBuYW1lIFRoZSBjb250cm9sIG5hbWUgdG8gcmVnaXN0ZXIgaW4gdGhlIGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIGNvbnRyb2wgUHJvdmlkZXMgdGhlIGNvbnRyb2wgZm9yIHRoZSBnaXZlbiBuYW1lXG4gICAqL1xuICBvdmVycmlkZSByZWdpc3RlckNvbnRyb2w8XG4gICAgSyBleHRlbmRzIFN0cmluZ0tleXM8VD4sXG4gICAgQ1YgZXh0ZW5kcyBvYmplY3QgPSBWYWxpZGF0b3JzTW9kZWxcbiAgPihuYW1lOiBLLCBjb250cm9sOiBDb250cm9sVHlwZTxUW0tdLCBDVj4pIHtcbiAgICByZXR1cm4gc3VwZXIucmVnaXN0ZXJDb250cm9sKG5hbWUsIGNvbnRyb2wpIGFzIENvbnRyb2xUeXBlPFRbS10sIENWPjtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBjb250cm9sIHRvIHRoaXMgZ3JvdXAuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGFsc28gdXBkYXRlcyB0aGUgdmFsdWUgYW5kIHZhbGlkaXR5IG9mIHRoZSBjb250cm9sLlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZSBUaGUgY29udHJvbCBuYW1lIHRvIGFkZCB0byB0aGUgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gY29udHJvbCBQcm92aWRlcyB0aGUgY29udHJvbCBmb3IgdGhlIGdpdmVuIG5hbWVcbiAgICovXG4gIG92ZXJyaWRlIGFkZENvbnRyb2w8XG4gICAgSyBleHRlbmRzIFN0cmluZ0tleXM8VD4sXG4gICAgQ1YgZXh0ZW5kcyBvYmplY3QgPSBWYWxpZGF0b3JzTW9kZWxcbiAgPihuYW1lOiBLLCBjb250cm9sOiBDb250cm9sVHlwZTxUW0tdLCBDVj4pIHtcbiAgICByZXR1cm4gc3VwZXIuYWRkQ29udHJvbChuYW1lLCBjb250cm9sKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBjb250cm9sIGZyb20gdGhpcyBncm91cC5cbiAgICpcbiAgICogQHBhcmFtIG5hbWUgVGhlIGNvbnRyb2wgbmFtZSB0byByZW1vdmUgZnJvbSB0aGUgY29sbGVjdGlvblxuICAgKi9cbiAgb3ZlcnJpZGUgcmVtb3ZlQ29udHJvbDxLIGV4dGVuZHMgU3RyaW5nS2V5czxUPj4obmFtZTogSykge1xuICAgIHJldHVybiBzdXBlci5yZW1vdmVDb250cm9sKG5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgYW4gZXhpc3RpbmcgY29udHJvbC5cbiAgICpcbiAgICogQHBhcmFtIG5hbWUgVGhlIGNvbnRyb2wgbmFtZSB0byByZXBsYWNlIGluIHRoZSBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBjb250cm9sIFByb3ZpZGVzIHRoZSBjb250cm9sIGZvciB0aGUgZ2l2ZW4gbmFtZVxuICAgKi9cbiAgb3ZlcnJpZGUgc2V0Q29udHJvbDxcbiAgICBLIGV4dGVuZHMgU3RyaW5nS2V5czxUPixcbiAgICBDViBleHRlbmRzIG9iamVjdCA9IFZhbGlkYXRvcnNNb2RlbFxuICA+KG5hbWU6IEssIGNvbnRyb2w6IENvbnRyb2xUeXBlPFRbS10sIENWPikge1xuICAgIHJldHVybiBzdXBlci5zZXRDb250cm9sKG5hbWUsIGNvbnRyb2wpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgdGhlcmUgaXMgYW4gZW5hYmxlZCBjb250cm9sIHdpdGggdGhlIGdpdmVuIG5hbWUgaW4gdGhlIGdyb3VwLlxuICAgKlxuICAgKiBSZXBvcnRzIGZhbHNlIGZvciBkaXNhYmxlZCBjb250cm9scy4gSWYgeW91J2QgbGlrZSB0byBjaGVjayBmb3IgZXhpc3RlbmNlIGluIHRoZSBncm91cFxuICAgKiBvbmx5LCB1c2UgW2dldF0oaHR0cHM6Ly9hbmd1bGFyLmlvL2FwaS9mb3Jtcy9BYnN0cmFjdENvbnRyb2wjZ2V0KSBpbnN0ZWFkLlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZSBUaGUgY29udHJvbCBuYW1lIHRvIGNoZWNrIGZvciBleGlzdGVuY2UgaW4gdGhlIGNvbGxlY3Rpb25cbiAgICpcbiAgICogQHJldHVybnMgZmFsc2UgZm9yIGRpc2FibGVkIGNvbnRyb2xzLCB0cnVlIG90aGVyd2lzZS5cbiAgICovXG4gIG92ZXJyaWRlIGNvbnRhaW5zPEsgZXh0ZW5kcyBTdHJpbmdLZXlzPFQ+PihuYW1lOiBLKSB7XG4gICAgcmV0dXJuIHN1cGVyLmNvbnRhaW5zKG5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHZhbHVlIG9mIHRoZSBgRm9ybUdyb3VwYC4gSXQgYWNjZXB0cyBhbiBvYmplY3QgdGhhdCBtYXRjaGVzXG4gICAqIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIGdyb3VwLCB3aXRoIGNvbnRyb2wgbmFtZXMgYXMga2V5cy5cbiAgICpcbiAgICogIyMjIFNldCB0aGUgY29tcGxldGUgdmFsdWUgZm9yIHRoZSBmb3JtIGdyb3VwXG4gICAqXG5gYGB0c1xuY29uc3QgZm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xuICBmaXJzdDogbmV3IEZvcm1Db250cm9sKCksXG4gIGxhc3Q6IG5ldyBGb3JtQ29udHJvbCgpXG59KTtcblxuY29uc29sZS5sb2coZm9ybS52YWx1ZSk7ICAgLy8ge2ZpcnN0OiBudWxsLCBsYXN0OiBudWxsfVxuXG5mb3JtLnNldFZhbHVlKHtmaXJzdDogJ05hbmN5JywgbGFzdDogJ0RyZXcnfSk7XG5jb25zb2xlLmxvZyhmb3JtLnZhbHVlKTsgICAvLyB7Zmlyc3Q6ICdOYW5jeScsIGxhc3Q6ICdEcmV3J31cbmBgYFxuICAgKlxuICAgKiBAdGhyb3dzIFdoZW4gc3RyaWN0IGNoZWNrcyBmYWlsLCBzdWNoIGFzIHNldHRpbmcgdGhlIHZhbHVlIG9mIGEgY29udHJvbFxuICAgKiB0aGF0IGRvZXNuJ3QgZXhpc3Qgb3IgaWYgeW91IGV4Y2x1ZGluZyB0aGUgdmFsdWUgb2YgYSBjb250cm9sLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgVGhlIG5ldyB2YWx1ZSBmb3IgdGhlIGNvbnRyb2wgdGhhdCBtYXRjaGVzIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIGdyb3VwLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlc1xuICAgKiBhbmQgZW1pdHMgZXZlbnRzIGFmdGVyIHRoZSB2YWx1ZSBjaGFuZ2VzLlxuICAgKiBUaGUgY29uZmlndXJhdGlvbiBvcHRpb25zIGFyZSBwYXNzZWQgdG8gdGhlXG4gICAqIFt1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5XShodHRwczovL2FuZ3VsYXIuaW8vYXBpL2Zvcm1zL0Fic3RyYWN0Q29udHJvbCN1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KSBtZXRob2QuXG4gICAqXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBlYWNoIGNoYW5nZSBvbmx5IGFmZmVjdHMgdGhpcyBjb250cm9sLCBhbmQgbm90IGl0cyBwYXJlbnQuIERlZmF1bHQgaXNcbiAgICogZmFsc2UuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYFxuICAgKiBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIHZhbHVlIGlzIHVwZGF0ZWQuXG4gICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICovXG4gIG92ZXJyaWRlIHNldFZhbHVlKFxuICAgIHZhbHVlOiBFeHRyYWN0R3JvdXBWYWx1ZTxUPixcbiAgICBvcHRpb25zOiB7IG9ubHlTZWxmPzogYm9vbGVhbjsgZW1pdEV2ZW50PzogYm9vbGVhbiB9ID0ge31cbiAgKSB7XG4gICAgcmV0dXJuIHN1cGVyLnNldFZhbHVlKHZhbHVlLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXRjaGVzIHRoZSB2YWx1ZSBvZiB0aGUgYEZvcm1Hcm91cGAuIEl0IGFjY2VwdHMgYW4gb2JqZWN0IHdpdGggY29udHJvbFxuICAgKiBuYW1lcyBhcyBrZXlzLCBhbmQgZG9lcyBpdHMgYmVzdCB0byBtYXRjaCB0aGUgdmFsdWVzIHRvIHRoZSBjb3JyZWN0IGNvbnRyb2xzXG4gICAqIGluIHRoZSBncm91cC5cbiAgICpcbiAgICogSXQgYWNjZXB0cyBib3RoIHN1cGVyLXNldHMgYW5kIHN1Yi1zZXRzIG9mIHRoZSBncm91cCB3aXRob3V0IHRocm93aW5nIGFuIGVycm9yLlxuICAgKlxuICAgKiAjIyMgUGF0Y2ggdGhlIHZhbHVlIGZvciBhIGZvcm0gZ3JvdXBcbiAgICpcbmBgYHRzXG5jb25zdCBmb3JtID0gbmV3IEZvcm1Hcm91cCh7XG4gICBmaXJzdDogbmV3IEZvcm1Db250cm9sKCksXG4gICBsYXN0OiBuZXcgRm9ybUNvbnRyb2woKVxufSk7XG5jb25zb2xlLmxvZyhmb3JtLnZhbHVlKTsgICAvLyB7Zmlyc3Q6IG51bGwsIGxhc3Q6IG51bGx9XG5cbmZvcm0ucGF0Y2hWYWx1ZSh7Zmlyc3Q6ICdOYW5jeSd9KTtcbmNvbnNvbGUubG9nKGZvcm0udmFsdWUpOyAgIC8vIHtmaXJzdDogJ05hbmN5JywgbGFzdDogbnVsbH1cbmBgYFxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgVGhlIG9iamVjdCB0aGF0IG1hdGNoZXMgdGhlIHN0cnVjdHVyZSBvZiB0aGUgZ3JvdXAuXG4gICAqIEBwYXJhbSBvcHRpb25zIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzIGFuZFxuICAgKiBlbWl0cyBldmVudHMgYWZ0ZXIgdGhlIHZhbHVlIGlzIHBhdGNoZWQuXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBlYWNoIGNoYW5nZSBvbmx5IGFmZmVjdHMgdGhpcyBjb250cm9sIGFuZCBub3QgaXRzIHBhcmVudC4gRGVmYXVsdCBpc1xuICAgKiB0cnVlLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2BcbiAgICogb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCB2YWx1ZSBpcyB1cGRhdGVkLlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqIFRoZSBjb25maWd1cmF0aW9uIG9wdGlvbnMgYXJlIHBhc3NlZCB0byB0aGVcbiAgICogW3VwZGF0ZVZhbHVlQW5kVmFsaWRpdHldKGh0dHBzOi8vYW5ndWxhci5pby9hcGkvZm9ybXMvQWJzdHJhY3RDb250cm9sI3VwZGF0ZVZhbHVlQW5kVmFsaWRpdHkpIG1ldGhvZC5cbiAgICovXG4gIG92ZXJyaWRlIHBhdGNoVmFsdWUoXG4gICAgdmFsdWU6IFBhcnRpYWw8RXh0cmFjdEdyb3VwVmFsdWU8VD4+LFxuICAgIG9wdGlvbnM6IHsgb25seVNlbGY/OiBib29sZWFuOyBlbWl0RXZlbnQ/OiBib29sZWFuIH0gPSB7fVxuICApIHtcbiAgICByZXR1cm4gc3VwZXIucGF0Y2hWYWx1ZSh2YWx1ZSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXRzIHRoZSBgRm9ybUdyb3VwYCwgbWFya3MgYWxsIGRlc2NlbmRhbnRzIGFyZSBtYXJrZWQgYHByaXN0aW5lYCBhbmQgYHVudG91Y2hlZGAsIGFuZFxuICAgKiB0aGUgdmFsdWUgb2YgYWxsIGRlc2NlbmRhbnRzIHRvIG51bGwuXG4gICAqXG4gICAqIFlvdSByZXNldCB0byBhIHNwZWNpZmljIGZvcm0gc3RhdGUgYnkgcGFzc2luZyBpbiBhIG1hcCBvZiBzdGF0ZXNcbiAgICogdGhhdCBtYXRjaGVzIHRoZSBzdHJ1Y3R1cmUgb2YgeW91ciBmb3JtLCB3aXRoIGNvbnRyb2wgbmFtZXMgYXMga2V5cy4gVGhlIHN0YXRlXG4gICAqIGlzIGEgc3RhbmRhbG9uZSB2YWx1ZSBvciBhIGZvcm0gc3RhdGUgb2JqZWN0IHdpdGggYm90aCBhIHZhbHVlIGFuZCBhIGRpc2FibGVkXG4gICAqIHN0YXR1cy5cbiAgICpcbiAgICogQHBhcmFtIGZvcm1TdGF0ZSBSZXNldHMgdGhlIGNvbnRyb2wgd2l0aCBhbiBpbml0aWFsIHZhbHVlLFxuICAgKiBvciBhbiBvYmplY3QgdGhhdCBkZWZpbmVzIHRoZSBpbml0aWFsIHZhbHVlIGFuZCBkaXNhYmxlZCBzdGF0ZS5cbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXNcbiAgICogYW5kIGVtaXRzIGV2ZW50cyB3aGVuIHRoZSBncm91cCBpcyByZXNldC5cbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIGVhY2ggY2hhbmdlIG9ubHkgYWZmZWN0cyB0aGlzIGNvbnRyb2wsIGFuZCBub3QgaXRzIHBhcmVudC4gRGVmYXVsdCBpc1xuICAgKiBmYWxzZS5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAqIGB2YWx1ZUNoYW5nZXNgXG4gICAqIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgaXMgcmVzZXQuXG4gICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICogVGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBhcmUgcGFzc2VkIHRvIHRoZVxuICAgKiBbdXBkYXRlVmFsdWVBbmRWYWxpZGl0eV0oaHR0cHM6Ly9hbmd1bGFyLmlvL2FwaS9mb3Jtcy9BYnN0cmFjdENvbnRyb2wjdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSkgbWV0aG9kLlxuICAgKlxuICAgKlxuICAgKiAjIyMgUmVzZXQgdGhlIGZvcm0gZ3JvdXAgdmFsdWVzXG4gICAqXG5gYGB0c1xuY29uc3QgZm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xuICBmaXJzdDogbmV3IEZvcm1Db250cm9sKCdmaXJzdCBuYW1lJyksXG4gIGxhc3Q6IG5ldyBGb3JtQ29udHJvbCgnbGFzdCBuYW1lJylcbn0pO1xuXG5jb25zb2xlLmxvZyhmb3JtLnZhbHVlKTsgIC8vIHtmaXJzdDogJ2ZpcnN0IG5hbWUnLCBsYXN0OiAnbGFzdCBuYW1lJ31cblxuZm9ybS5yZXNldCh7IGZpcnN0OiAnbmFtZScsIGxhc3Q6ICdsYXN0IG5hbWUnIH0pO1xuXG5jb25zb2xlLmxvZyhmb3JtLnZhbHVlKTsgIC8vIHtmaXJzdDogJ25hbWUnLCBsYXN0OiAnbGFzdCBuYW1lJ31cbmBgYFxuICAgKlxuICAgKiAjIyMgUmVzZXQgdGhlIGZvcm0gZ3JvdXAgdmFsdWVzIGFuZCBkaXNhYmxlZCBzdGF0dXNcbiAgICpcbmBgYHRzXG5jb25zdCBmb3JtID0gbmV3IEZvcm1Hcm91cCh7XG4gIGZpcnN0OiBuZXcgRm9ybUNvbnRyb2woJ2ZpcnN0IG5hbWUnKSxcbiAgbGFzdDogbmV3IEZvcm1Db250cm9sKCdsYXN0IG5hbWUnKVxufSk7XG5cbmZvcm0ucmVzZXQoe1xuICBmaXJzdDoge3ZhbHVlOiAnbmFtZScsIGRpc2FibGVkOiB0cnVlfSxcbiAgbGFzdDogJ2xhc3QnXG59KTtcblxuY29uc29sZS5sb2codGhpcy5mb3JtLnZhbHVlKTsgIC8vIHtmaXJzdDogJ25hbWUnLCBsYXN0OiAnbGFzdCBuYW1lJ31cbmNvbnNvbGUubG9nKHRoaXMuZm9ybS5nZXQoJ2ZpcnN0Jykuc3RhdHVzKTsgIC8vICdESVNBQkxFRCdcbmBgYFxuICAgKi9cbiAgb3ZlcnJpZGUgcmVzZXQoXG4gICAgdmFsdWU6IEV4dHJhY3RHcm91cFZhbHVlPFQ+ID0ge30gYXMgYW55LFxuICAgIG9wdGlvbnM6IHsgb25seVNlbGY/OiBib29sZWFuOyBlbWl0RXZlbnQ/OiBib29sZWFuIH0gPSB7fVxuICApIHtcbiAgICByZXR1cm4gc3VwZXIucmVzZXQodmFsdWUsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBhZ2dyZWdhdGUgdmFsdWUgb2YgdGhlIGBGb3JtR3JvdXBgLCBpbmNsdWRpbmcgYW55IGRpc2FibGVkIGNvbnRyb2xzLlxuICAgKlxuICAgKiBSZXRyaWV2ZXMgYWxsIHZhbHVlcyByZWdhcmRsZXNzIG9mIGRpc2FibGVkIHN0YXR1cy5cbiAgICogVGhlIGB2YWx1ZWAgcHJvcGVydHkgaXMgdGhlIGJlc3Qgd2F5IHRvIGdldCB0aGUgdmFsdWUgb2YgdGhlIGdyb3VwLCBiZWNhdXNlXG4gICAqIGl0IGV4Y2x1ZGVzIGRpc2FibGVkIGNvbnRyb2xzIGluIHRoZSBgRm9ybUdyb3VwYC5cbiAgICovXG4gIG92ZXJyaWRlIGdldFJhd1ZhbHVlKCkge1xuICAgIHJldHVybiBzdXBlci5nZXRSYXdWYWx1ZSgpIGFzIEV4dHJhY3RHcm91cFZhbHVlPFQ+O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlcyBhIGNoaWxkIGNvbnRyb2wgZ2l2ZW4gdGhlIGNvbnRyb2wncyBuYW1lLlxuICAgKlxuICAgKiAjIyMgUmV0cmlldmUgYSBuZXN0ZWQgY29udHJvbFxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgdG8gZ2V0IGEgYG5hbWVgIGNvbnRyb2wgbmVzdGVkIHdpdGhpbiBhIGBwZXJzb25gIHN1Yi1ncm91cDpcbmBgYHRzXG50aGlzLmZvcm0uZ2V0KCdwZXJzb24nKS5nZXQoJ25hbWUnKTtcbmBgYFxuICAgKi9cbiAgb3ZlcnJpZGUgZ2V0PEsgZXh0ZW5kcyBTdHJpbmdLZXlzPFQ+LCBDViBleHRlbmRzIG9iamVjdCA9IFZhbGlkYXRvcnNNb2RlbD4oXG4gICAgY29udHJvbE5hbWU6IEtcbiAgKTogQ29udHJvbFR5cGU8VFtLXSwgQ1Y+IHwgbnVsbCB7XG4gICAgcmV0dXJuIHN1cGVyLmdldChjb250cm9sTmFtZSkgYXMgQ29udHJvbFR5cGU8VFtLXSwgQ1Y+IHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzeW5jaHJvbm91cyB2YWxpZGF0b3JzIHRoYXQgYXJlIGFjdGl2ZSBvbiB0aGlzIGNvbnRyb2wuIENhbGxpbmdcbiAgICogdGhpcyBvdmVyd3JpdGVzIGFueSBleGlzdGluZyBzeW5jIHZhbGlkYXRvcnMuXG4gICAqL1xuICBvdmVycmlkZSBzZXRWYWxpZGF0b3JzKG5ld1ZhbGlkYXRvcjogVmFsaWRhdG9yRm4gfCBWYWxpZGF0b3JGbltdIHwgbnVsbCkge1xuICAgIHJldHVybiBzdXBlci5zZXRWYWxpZGF0b3JzKG5ld1ZhbGlkYXRvcik7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgYXN5bmMgdmFsaWRhdG9ycyB0aGF0IGFyZSBhY3RpdmUgb24gdGhpcyBjb250cm9sLiBDYWxsaW5nIHRoaXNcbiAgICogb3ZlcndyaXRlcyBhbnkgZXhpc3RpbmcgYXN5bmMgdmFsaWRhdG9ycy5cbiAgICovXG4gIG92ZXJyaWRlIHNldEFzeW5jVmFsaWRhdG9ycyhcbiAgICBuZXdWYWxpZGF0b3I6IEFzeW5jVmFsaWRhdG9yRm4gfCBBc3luY1ZhbGlkYXRvckZuW10gfCBudWxsXG4gICkge1xuICAgIHJldHVybiBzdXBlci5zZXRBc3luY1ZhbGlkYXRvcnMobmV3VmFsaWRhdG9yKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGVycm9ycyBvbiBhIGZvcm0gY29udHJvbCB3aGVuIHJ1bm5pbmcgdmFsaWRhdGlvbnMgbWFudWFsbHksIHJhdGhlciB0aGFuIGF1dG9tYXRpY2FsbHkuXG4gICAqXG4gICAqIENhbGxpbmcgYHNldEVycm9yc2AgYWxzbyB1cGRhdGVzIHRoZSB2YWxpZGl0eSBvZiB0aGUgcGFyZW50IGNvbnRyb2wuXG4gICAqXG4gICAqICMjIyBNYW51YWxseSBzZXQgdGhlIGVycm9ycyBmb3IgYSBjb250cm9sXG4gICAqXG4gICAqIGBgYHRzXG4gICAqIGNvbnN0IGxvZ2luID0gbmV3IEZvcm1Db250cm9sKCdzb21lTG9naW4nKTtcbiAgICogbG9naW4uc2V0RXJyb3JzKHtcbiAgICogICBub3RVbmlxdWU6IHRydWVcbiAgICogfSk7XG4gICAqXG4gICAqIGV4cGVjdChsb2dpbi52YWxpZCkudG9FcXVhbChmYWxzZSk7XG4gICAqIGV4cGVjdChsb2dpbi5lcnJvcnMpLnRvRXF1YWwoeyBub3RVbmlxdWU6IHRydWUgfSk7XG4gICAqXG4gICAqIGxvZ2luLnNldFZhbHVlKCdzb21lT3RoZXJMb2dpbicpO1xuICAgKlxuICAgKiBleHBlY3QobG9naW4udmFsaWQpLnRvRXF1YWwodHJ1ZSk7XG4gICAqIGBgYFxuICAgKi9cbiAgb3ZlcnJpZGUgc2V0RXJyb3JzKFxuICAgIGVycm9yczogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwsXG4gICAgb3B0czogeyBlbWl0RXZlbnQ/OiBib29sZWFuIH0gPSB7fVxuICApIHtcbiAgICByZXR1cm4gc3VwZXIuc2V0RXJyb3JzKGVycm9ycywgb3B0cyk7XG4gIH1cblxuICAvKipcbiAgICogUmVwb3J0cyBlcnJvciBkYXRhIGZvciB0aGUgY29udHJvbCB3aXRoIHRoZSBnaXZlbiBjb250cm9sTmFtZS5cbiAgICpcbiAgICogQHBhcmFtIGVycm9yQ29kZSBUaGUgY29kZSBvZiB0aGUgZXJyb3IgdG8gY2hlY2tcbiAgICogQHBhcmFtIGNvbnRyb2xOYW1lIEEgY29udHJvbCBuYW1lIHRoYXQgZGVzaWduYXRlcyBob3cgdG8gbW92ZSBmcm9tIHRoZSBjdXJyZW50IGNvbnRyb2xcbiAgICogdG8gdGhlIGNvbnRyb2wgdGhhdCBzaG91bGQgYmUgcXVlcmllZCBmb3IgZXJyb3JzLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgZm9yIHRoZSBmb2xsb3dpbmcgYEZvcm1Hcm91cGA6XG4gICAqXG5gYGB0c1xuZm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xuICBhZGRyZXNzOiBuZXcgRm9ybUdyb3VwKHsgc3RyZWV0OiBuZXcgRm9ybUNvbnRyb2woKSB9KVxufSk7XG5gYGBcbiAgICpcbiAgICogVGhlIGNvbnRyb2xOYW1lIHRvIHRoZSAnc3RyZWV0JyBjb250cm9sIGZyb20gdGhlIHJvb3QgZm9ybSB3b3VsZCBiZSAnYWRkcmVzcycgLT4gJ3N0cmVldCcuXG4gICAqXG4gICAqIEl0IGNhbiBiZSBwcm92aWRlZCB0byB0aGlzIG1ldGhvZCBpbiBjb21iaW5hdGlvbiB3aXRoIGBnZXQoKWAgbWV0aG9kOlxuICAgKlxuYGBgdHNcbmZvcm0uZ2V0KCdhZGRyZXNzJykuZ2V0RXJyb3IoJ3NvbWVFcnJvckNvZGUnLCAnc3RyZWV0Jyk7XG5gYGBcbiAgICpcbiAgICogQHJldHVybnMgZXJyb3IgZGF0YSBmb3IgdGhhdCBwYXJ0aWN1bGFyIGVycm9yLiBJZiB0aGUgY29udHJvbCBvciBlcnJvciBpcyBub3QgcHJlc2VudCxcbiAgICogbnVsbCBpcyByZXR1cm5lZC5cbiAgICovXG4gIG92ZXJyaWRlIGdldEVycm9yPFAgZXh0ZW5kcyBTdHJpbmdLZXlzPFY+LCBLIGV4dGVuZHMgU3RyaW5nS2V5czxUPj4oXG4gICAgZXJyb3JDb2RlOiBQLFxuICAgIGNvbnRyb2xOYW1lPzogS1xuICApIHtcbiAgICByZXR1cm4gc3VwZXIuZ2V0RXJyb3IoZXJyb3JDb2RlLCBjb250cm9sTmFtZSkgYXMgVltQXSB8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogUmVwb3J0cyB3aGV0aGVyIHRoZSBjb250cm9sIHdpdGggdGhlIGdpdmVuIGNvbnRyb2xOYW1lIGhhcyB0aGUgZXJyb3Igc3BlY2lmaWVkLlxuICAgKlxuICAgKiBAcGFyYW0gZXJyb3JDb2RlIFRoZSBjb2RlIG9mIHRoZSBlcnJvciB0byBjaGVja1xuICAgKiBAcGFyYW0gY29udHJvbE5hbWUgQSBjb250cm9sIG5hbWUgdGhhdCBkZXNpZ25hdGVzIGhvdyB0byBtb3ZlIGZyb20gdGhlIGN1cnJlbnQgY29udHJvbFxuICAgKiB0byB0aGUgY29udHJvbCB0aGF0IHNob3VsZCBiZSBxdWVyaWVkIGZvciBlcnJvcnMuXG4gICAqXG4gICAqIEZvciBleGFtcGxlLCBmb3IgdGhlIGZvbGxvd2luZyBgRm9ybUdyb3VwYDpcbiAgICpcbmBgYHRzXG5mb3JtID0gbmV3IEZvcm1Hcm91cCh7XG4gIGFkZHJlc3M6IG5ldyBGb3JtR3JvdXAoeyBzdHJlZXQ6IG5ldyBGb3JtQ29udHJvbCgpIH0pXG59KTtcbmBgYFxuICAgKlxuICAgKiBUaGUgY29udHJvbE5hbWUgdG8gdGhlICdzdHJlZXQnIGNvbnRyb2wgZnJvbSB0aGUgcm9vdCBmb3JtIHdvdWxkIGJlICdhZGRyZXNzJyAtPiAnc3RyZWV0Jy5cbiAgICpcbiAgICogSXQgY2FuIGJlIHByb3ZpZGVkIHRvIHRoaXMgbWV0aG9kIGluIGNvbWJpbmF0aW9uIHdpdGggYGdldCgpYCBtZXRob2Q6XG5gYGB0c1xuZm9ybS5nZXQoJ2FkZHJlc3MnKS5oYXNFcnJvcignc29tZUVycm9yQ29kZScsICdzdHJlZXQnKTtcbmBgYFxuICAgKlxuICAgKiBJZiBubyBjb250cm9sTmFtZSBpcyBnaXZlbiwgdGhpcyBtZXRob2QgY2hlY2tzIGZvciB0aGUgZXJyb3Igb24gdGhlIGN1cnJlbnQgY29udHJvbC5cbiAgICpcbiAgICogQHJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gZXJyb3IgaXMgcHJlc2VudCBpbiB0aGUgY29udHJvbCBhdCB0aGUgZ2l2ZW4gY29udHJvbE5hbWUuXG4gICAqXG4gICAqIElmIHRoZSBjb250cm9sIGlzIG5vdCBwcmVzZW50LCBmYWxzZSBpcyByZXR1cm5lZC5cbiAgICovXG4gIG92ZXJyaWRlIGhhc0Vycm9yPFAgZXh0ZW5kcyBTdHJpbmdLZXlzPFY+LCBLIGV4dGVuZHMgU3RyaW5nS2V5czxUPj4oXG4gICAgZXJyb3JDb2RlOiBQLFxuICAgIGNvbnRyb2xOYW1lPzogS1xuICApIHtcbiAgICByZXR1cm4gc3VwZXIuaGFzRXJyb3IoZXJyb3JDb2RlLCBjb250cm9sTmFtZSk7XG4gIH1cbn1cbiJdfQ==