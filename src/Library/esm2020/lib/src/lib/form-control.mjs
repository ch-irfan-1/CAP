import { UntypedFormControl as NativeFormControl } from '@angular/forms';
export class FormControl extends NativeFormControl {
    /**
     * Creates a new `FormControl` instance.
     *
     * @param formState Initializes the control with an initial value,
     * or an object that defines the initial value and disabled state.
     *
     * @param validatorOrOpts A synchronous validator function, or an array of
     * such functions, or an `AbstractControlOptions` object that contains validation functions
     * and a validation trigger.
     *
     * @param asyncValidator A single async validator or array of async validator functions
     *
     */
    constructor(formState = null, validatorOrOpts, asyncValidator) {
        super(formState, validatorOrOpts, asyncValidator);
    }
    /**
     * Sets a new value for the form control.
     *
     * @param value The new value for the control.
     * @param options Configuration options that determine how the control proopagates changes
     * and emits events when the value changes.
     * The configuration options are passed to the
     * [updateValueAndValidity](https://angular.io/api/forms/AbstractControl#updateValueAndValidity) method.
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
     * false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control value is updated.
     * When false, no events are emitted.
     * * `emitModelToViewChange`: When true or not supplied  (the default), each change triggers an
     * `onChange` event to
     * update the view.
     * * `emitViewToModelChange`: When true or not supplied (the default), each change triggers an
     * `ngModelChange`
     * event to update the model.
     *
     */
    setValue(value, options = {}) {
        return super.setValue(value, options);
    }
    /**
     * Patches the value of a control.
     *
     * This function is functionally the same as [setValue](https://angular.io/api/forms/FormControl#setValue) at this level.
     * It exists for symmetry with [patchValue](https://angular.io/api/forms/FormGroup#patchValue) on `FormGroups` and
     * `FormArrays`, where it does behave differently.
     *
     * See also: `setValue` for options
     */
    patchValue(value, options = {}) {
        return super.patchValue(value, options);
    }
    /**
     * Resets the form control, marking it `pristine` and `untouched`, and setting
     * the value to null.
     *
     * @param formState Resets the control with an initial value,
     * or an object that defines the initial value and disabled state.
     *
     * @param options Configuration options that determine how the control propagates changes
     * and emits events after the value changes.
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
     * false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is reset.
     * When false, no events are emitted.
     *
     */
    reset(formState = null, options = {}) {
        return super.reset(formState, options);
    }
    /**
     * In `FormControl`, this method always returns `null`.
     */
    get() {
        return null;
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
     * Reports error data for the current control.
     *
     * @param errorCode The code of the error to check.
     *
     * @returns error data for that particular error. If an error is not present,
     * null is returned.
     */
    getError(errorCode) {
        return super.getError(errorCode);
    }
    /**
     * Reports whether the current control has the error specified.
     *
     * @param errorCode The code of the error to check.
     *
     * @returns whether the given error is present in the current control.
     *
     * If an error is not present, false is returned.
     */
    hasError(errorCode) {
        return super.hasError(errorCode);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1jb250cm9sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbXktbGliL3NyYy9saWIvc3JjL2xpYi9mb3JtLWNvbnRyb2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGtCQUFrQixJQUFJLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFnQnpFLE1BQU0sT0FBTyxXQUF5RCxTQUFRLGlCQUFpQjtJQU83Rjs7Ozs7Ozs7Ozs7O09BWUc7SUFDSCxZQUNFLFlBQWlDLElBQUksRUFDckMsZUFBNkUsRUFDN0UsY0FBNkQ7UUFFN0QsS0FBSyxDQUFDLFNBQVMsRUFBRSxlQUFlLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09Bc0JHO0lBQ08sUUFBUSxDQUNoQixLQUE2QixFQUM3QixVQUtJLEVBQUU7UUFFTixPQUFPLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFRDs7Ozs7Ozs7T0FRRztJQUNPLFVBQVUsQ0FDbEIsS0FBNkIsRUFDN0IsVUFLSSxFQUFFO1FBRU4sT0FBTyxLQUFLLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7O09BaUJHO0lBQ08sS0FBSyxDQUNiLFlBQWlDLElBQUksRUFDckMsVUFHSSxFQUFFO1FBRU4sT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQ7O09BRUc7SUFDTyxHQUFHO1FBQ1gsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQ7OztPQUdHO0lBQ08sYUFBYSxDQUFDLFlBQWdEO1FBQ3RFLE9BQU8sS0FBSyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQ7OztPQUdHO0lBQ08sa0JBQWtCLENBQUMsWUFBMEQ7UUFDckYsT0FBTyxLQUFLLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQW9CRztJQUNPLFNBQVMsQ0FBQyxNQUErQixFQUFFLE9BQWdDLEVBQUU7UUFDckYsT0FBTyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNPLFFBQVEsQ0FBZ0MsU0FBWTtRQUM1RCxPQUFPLEtBQUssQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFnQixDQUFDO0lBQ2xELENBQUM7SUFFRDs7Ozs7Ozs7T0FRRztJQUNPLFFBQVEsQ0FBZ0MsU0FBWTtRQUM1RCxPQUFPLEtBQUssQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDbkMsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVW50eXBlZEZvcm1Db250cm9sIGFzIE5hdGl2ZUZvcm1Db250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7XG4gIFN0YXR1cyxcbiAgVmFsaWRhdGlvbkVycm9ycyxcbiAgU3RyaW5nS2V5cyxcbiAgVmFsaWRhdG9yRm4sXG4gIEFzeW5jVmFsaWRhdG9yRm4sXG4gIEFic3RyYWN0Q29udHJvbE9wdGlvbnMsXG4gIFZhbGlkYXRvcnNNb2RlbCxcbiAgRXh0cmFjdENvbnRyb2xWYWx1ZSxcbiAgRm9ybUNvbnRyb2xTdGF0ZSxcbn0gZnJvbSAnLi90eXBlcyc7XG5cbmV4cG9ydCBjbGFzcyBGb3JtQ29udHJvbDxUID0gYW55LCBWIGV4dGVuZHMgb2JqZWN0ID0gVmFsaWRhdG9yc01vZGVsPiBleHRlbmRzIE5hdGl2ZUZvcm1Db250cm9sIHtcbiAgb3ZlcnJpZGUgcmVhZG9ubHkgdmFsdWU6IEV4dHJhY3RDb250cm9sVmFsdWU8VD47XG4gIG92ZXJyaWRlIHJlYWRvbmx5IHZhbHVlQ2hhbmdlczogT2JzZXJ2YWJsZTxFeHRyYWN0Q29udHJvbFZhbHVlPFQ+PjtcbiAgb3ZlcnJpZGUgcmVhZG9ubHkgc3RhdHVzOiBTdGF0dXM7XG4gIG92ZXJyaWRlIHJlYWRvbmx5IHN0YXR1c0NoYW5nZXM6IE9ic2VydmFibGU8U3RhdHVzPjtcbiAgb3ZlcnJpZGUgcmVhZG9ubHkgZXJyb3JzOiBWYWxpZGF0aW9uRXJyb3JzPFY+IHwgbnVsbDtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBgRm9ybUNvbnRyb2xgIGluc3RhbmNlLlxuICAgKlxuICAgKiBAcGFyYW0gZm9ybVN0YXRlIEluaXRpYWxpemVzIHRoZSBjb250cm9sIHdpdGggYW4gaW5pdGlhbCB2YWx1ZSxcbiAgICogb3IgYW4gb2JqZWN0IHRoYXQgZGVmaW5lcyB0aGUgaW5pdGlhbCB2YWx1ZSBhbmQgZGlzYWJsZWQgc3RhdGUuXG4gICAqXG4gICAqIEBwYXJhbSB2YWxpZGF0b3JPck9wdHMgQSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24sIG9yIGFuIGFycmF5IG9mXG4gICAqIHN1Y2ggZnVuY3Rpb25zLCBvciBhbiBgQWJzdHJhY3RDb250cm9sT3B0aW9uc2Agb2JqZWN0IHRoYXQgY29udGFpbnMgdmFsaWRhdGlvbiBmdW5jdGlvbnNcbiAgICogYW5kIGEgdmFsaWRhdGlvbiB0cmlnZ2VyLlxuICAgKlxuICAgKiBAcGFyYW0gYXN5bmNWYWxpZGF0b3IgQSBzaW5nbGUgYXN5bmMgdmFsaWRhdG9yIG9yIGFycmF5IG9mIGFzeW5jIHZhbGlkYXRvciBmdW5jdGlvbnNcbiAgICpcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIGZvcm1TdGF0ZTogRm9ybUNvbnRyb2xTdGF0ZTxUPiA9IG51bGwsXG4gICAgdmFsaWRhdG9yT3JPcHRzPzogVmFsaWRhdG9yRm4gfCBWYWxpZGF0b3JGbltdIHwgQWJzdHJhY3RDb250cm9sT3B0aW9ucyB8IG51bGwsXG4gICAgYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZuIHwgQXN5bmNWYWxpZGF0b3JGbltdIHwgbnVsbFxuICApIHtcbiAgICBzdXBlcihmb3JtU3RhdGUsIHZhbGlkYXRvck9yT3B0cywgYXN5bmNWYWxpZGF0b3IpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYSBuZXcgdmFsdWUgZm9yIHRoZSBmb3JtIGNvbnRyb2wuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgbmV3IHZhbHVlIGZvciB0aGUgY29udHJvbC5cbiAgICogQHBhcmFtIG9wdGlvbnMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9vcGFnYXRlcyBjaGFuZ2VzXG4gICAqIGFuZCBlbWl0cyBldmVudHMgd2hlbiB0aGUgdmFsdWUgY2hhbmdlcy5cbiAgICogVGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBhcmUgcGFzc2VkIHRvIHRoZVxuICAgKiBbdXBkYXRlVmFsdWVBbmRWYWxpZGl0eV0oaHR0cHM6Ly9hbmd1bGFyLmlvL2FwaS9mb3Jtcy9BYnN0cmFjdENvbnRyb2wjdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSkgbWV0aG9kLlxuICAgKlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgZWFjaCBjaGFuZ2Ugb25seSBhZmZlY3RzIHRoaXMgY29udHJvbCwgYW5kIG5vdCBpdHMgcGFyZW50LiBEZWZhdWx0IGlzXG4gICAqIGZhbHNlLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2BcbiAgICogb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCB2YWx1ZSBpcyB1cGRhdGVkLlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqICogYGVtaXRNb2RlbFRvVmlld0NoYW5nZWA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgICh0aGUgZGVmYXVsdCksIGVhY2ggY2hhbmdlIHRyaWdnZXJzIGFuXG4gICAqIGBvbkNoYW5nZWAgZXZlbnQgdG9cbiAgICogdXBkYXRlIHRoZSB2aWV3LlxuICAgKiAqIGBlbWl0Vmlld1RvTW9kZWxDaGFuZ2VgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGVhY2ggY2hhbmdlIHRyaWdnZXJzIGFuXG4gICAqIGBuZ01vZGVsQ2hhbmdlYFxuICAgKiBldmVudCB0byB1cGRhdGUgdGhlIG1vZGVsLlxuICAgKlxuICAgKi9cbiAgIG92ZXJyaWRlIHNldFZhbHVlKFxuICAgIHZhbHVlOiBFeHRyYWN0Q29udHJvbFZhbHVlPFQ+LFxuICAgIG9wdGlvbnM6IHtcbiAgICAgIG9ubHlTZWxmPzogYm9vbGVhbjtcbiAgICAgIGVtaXRFdmVudD86IGJvb2xlYW47XG4gICAgICBlbWl0TW9kZWxUb1ZpZXdDaGFuZ2U/OiBib29sZWFuO1xuICAgICAgZW1pdFZpZXdUb01vZGVsQ2hhbmdlPzogYm9vbGVhbjtcbiAgICB9ID0ge31cbiAgKSB7XG4gICAgcmV0dXJuIHN1cGVyLnNldFZhbHVlKHZhbHVlLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXRjaGVzIHRoZSB2YWx1ZSBvZiBhIGNvbnRyb2wuXG4gICAqXG4gICAqIFRoaXMgZnVuY3Rpb24gaXMgZnVuY3Rpb25hbGx5IHRoZSBzYW1lIGFzIFtzZXRWYWx1ZV0oaHR0cHM6Ly9hbmd1bGFyLmlvL2FwaS9mb3Jtcy9Gb3JtQ29udHJvbCNzZXRWYWx1ZSkgYXQgdGhpcyBsZXZlbC5cbiAgICogSXQgZXhpc3RzIGZvciBzeW1tZXRyeSB3aXRoIFtwYXRjaFZhbHVlXShodHRwczovL2FuZ3VsYXIuaW8vYXBpL2Zvcm1zL0Zvcm1Hcm91cCNwYXRjaFZhbHVlKSBvbiBgRm9ybUdyb3Vwc2AgYW5kXG4gICAqIGBGb3JtQXJyYXlzYCwgd2hlcmUgaXQgZG9lcyBiZWhhdmUgZGlmZmVyZW50bHkuXG4gICAqXG4gICAqIFNlZSBhbHNvOiBgc2V0VmFsdWVgIGZvciBvcHRpb25zXG4gICAqL1xuICAgb3ZlcnJpZGUgcGF0Y2hWYWx1ZShcbiAgICB2YWx1ZTogRXh0cmFjdENvbnRyb2xWYWx1ZTxUPixcbiAgICBvcHRpb25zOiB7XG4gICAgICBvbmx5U2VsZj86IGJvb2xlYW47XG4gICAgICBlbWl0RXZlbnQ/OiBib29sZWFuO1xuICAgICAgZW1pdE1vZGVsVG9WaWV3Q2hhbmdlPzogYm9vbGVhbjtcbiAgICAgIGVtaXRWaWV3VG9Nb2RlbENoYW5nZT86IGJvb2xlYW47XG4gICAgfSA9IHt9XG4gICkge1xuICAgIHJldHVybiBzdXBlci5wYXRjaFZhbHVlKHZhbHVlLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIGZvcm0gY29udHJvbCwgbWFya2luZyBpdCBgcHJpc3RpbmVgIGFuZCBgdW50b3VjaGVkYCwgYW5kIHNldHRpbmdcbiAgICogdGhlIHZhbHVlIHRvIG51bGwuXG4gICAqXG4gICAqIEBwYXJhbSBmb3JtU3RhdGUgUmVzZXRzIHRoZSBjb250cm9sIHdpdGggYW4gaW5pdGlhbCB2YWx1ZSxcbiAgICogb3IgYW4gb2JqZWN0IHRoYXQgZGVmaW5lcyB0aGUgaW5pdGlhbCB2YWx1ZSBhbmQgZGlzYWJsZWQgc3RhdGUuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzXG4gICAqIGFuZCBlbWl0cyBldmVudHMgYWZ0ZXIgdGhlIHZhbHVlIGNoYW5nZXMuXG4gICAqXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBlYWNoIGNoYW5nZSBvbmx5IGFmZmVjdHMgdGhpcyBjb250cm9sLCBhbmQgbm90IGl0cyBwYXJlbnQuIERlZmF1bHQgaXNcbiAgICogZmFsc2UuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYFxuICAgKiBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIGlzIHJlc2V0LlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqXG4gICAqL1xuICAgb3ZlcnJpZGUgcmVzZXQoXG4gICAgZm9ybVN0YXRlOiBGb3JtQ29udHJvbFN0YXRlPFQ+ID0gbnVsbCxcbiAgICBvcHRpb25zOiB7XG4gICAgICBvbmx5U2VsZj86IGJvb2xlYW47XG4gICAgICBlbWl0RXZlbnQ/OiBib29sZWFuO1xuICAgIH0gPSB7fVxuICApIHtcbiAgICByZXR1cm4gc3VwZXIucmVzZXQoZm9ybVN0YXRlLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbiBgRm9ybUNvbnRyb2xgLCB0aGlzIG1ldGhvZCBhbHdheXMgcmV0dXJucyBgbnVsbGAuXG4gICAqL1xuICAgb3ZlcnJpZGUgZ2V0KCk6IG51bGwge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHN5bmNocm9ub3VzIHZhbGlkYXRvcnMgdGhhdCBhcmUgYWN0aXZlIG9uIHRoaXMgY29udHJvbC4gQ2FsbGluZ1xuICAgKiB0aGlzIG92ZXJ3cml0ZXMgYW55IGV4aXN0aW5nIHN5bmMgdmFsaWRhdG9ycy5cbiAgICovXG4gICBvdmVycmlkZSBzZXRWYWxpZGF0b3JzKG5ld1ZhbGlkYXRvcjogVmFsaWRhdG9yRm4gfCBWYWxpZGF0b3JGbltdIHwgbnVsbCkge1xuICAgIHJldHVybiBzdXBlci5zZXRWYWxpZGF0b3JzKG5ld1ZhbGlkYXRvcik7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgYXN5bmMgdmFsaWRhdG9ycyB0aGF0IGFyZSBhY3RpdmUgb24gdGhpcyBjb250cm9sLiBDYWxsaW5nIHRoaXNcbiAgICogb3ZlcndyaXRlcyBhbnkgZXhpc3RpbmcgYXN5bmMgdmFsaWRhdG9ycy5cbiAgICovXG4gICBvdmVycmlkZSBzZXRBc3luY1ZhbGlkYXRvcnMobmV3VmFsaWRhdG9yOiBBc3luY1ZhbGlkYXRvckZuIHwgQXN5bmNWYWxpZGF0b3JGbltdIHwgbnVsbCkge1xuICAgIHJldHVybiBzdXBlci5zZXRBc3luY1ZhbGlkYXRvcnMobmV3VmFsaWRhdG9yKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGVycm9ycyBvbiBhIGZvcm0gY29udHJvbCB3aGVuIHJ1bm5pbmcgdmFsaWRhdGlvbnMgbWFudWFsbHksIHJhdGhlciB0aGFuIGF1dG9tYXRpY2FsbHkuXG4gICAqXG4gICAqIENhbGxpbmcgYHNldEVycm9yc2AgYWxzbyB1cGRhdGVzIHRoZSB2YWxpZGl0eSBvZiB0aGUgcGFyZW50IGNvbnRyb2wuXG4gICAqXG4gICAqICMjIyBNYW51YWxseSBzZXQgdGhlIGVycm9ycyBmb3IgYSBjb250cm9sXG4gICAqXG4gICAqIGBgYHRzXG4gICAqIGNvbnN0IGxvZ2luID0gbmV3IEZvcm1Db250cm9sKCdzb21lTG9naW4nKTtcbiAgICogbG9naW4uc2V0RXJyb3JzKHtcbiAgICogICBub3RVbmlxdWU6IHRydWVcbiAgICogfSk7XG4gICAqXG4gICAqIGV4cGVjdChsb2dpbi52YWxpZCkudG9FcXVhbChmYWxzZSk7XG4gICAqIGV4cGVjdChsb2dpbi5lcnJvcnMpLnRvRXF1YWwoeyBub3RVbmlxdWU6IHRydWUgfSk7XG4gICAqXG4gICAqIGxvZ2luLnNldFZhbHVlKCdzb21lT3RoZXJMb2dpbicpO1xuICAgKlxuICAgKiBleHBlY3QobG9naW4udmFsaWQpLnRvRXF1YWwodHJ1ZSk7XG4gICAqIGBgYFxuICAgKi9cbiAgIG92ZXJyaWRlIHNldEVycm9ycyhlcnJvcnM6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsLCBvcHRzOiB7IGVtaXRFdmVudD86IGJvb2xlYW4gfSA9IHt9KSB7XG4gICAgcmV0dXJuIHN1cGVyLnNldEVycm9ycyhlcnJvcnMsIG9wdHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcG9ydHMgZXJyb3IgZGF0YSBmb3IgdGhlIGN1cnJlbnQgY29udHJvbC5cbiAgICpcbiAgICogQHBhcmFtIGVycm9yQ29kZSBUaGUgY29kZSBvZiB0aGUgZXJyb3IgdG8gY2hlY2suXG4gICAqXG4gICAqIEByZXR1cm5zIGVycm9yIGRhdGEgZm9yIHRoYXQgcGFydGljdWxhciBlcnJvci4gSWYgYW4gZXJyb3IgaXMgbm90IHByZXNlbnQsXG4gICAqIG51bGwgaXMgcmV0dXJuZWQuXG4gICAqL1xuICAgb3ZlcnJpZGUgZ2V0RXJyb3I8SyBleHRlbmRzIFN0cmluZ0tleXM8Vj4gPSBhbnk+KGVycm9yQ29kZTogSykge1xuICAgIHJldHVybiBzdXBlci5nZXRFcnJvcihlcnJvckNvZGUpIGFzIFZbS10gfCBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcG9ydHMgd2hldGhlciB0aGUgY3VycmVudCBjb250cm9sIGhhcyB0aGUgZXJyb3Igc3BlY2lmaWVkLlxuICAgKlxuICAgKiBAcGFyYW0gZXJyb3JDb2RlIFRoZSBjb2RlIG9mIHRoZSBlcnJvciB0byBjaGVjay5cbiAgICpcbiAgICogQHJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gZXJyb3IgaXMgcHJlc2VudCBpbiB0aGUgY3VycmVudCBjb250cm9sLlxuICAgKlxuICAgKiBJZiBhbiBlcnJvciBpcyBub3QgcHJlc2VudCwgZmFsc2UgaXMgcmV0dXJuZWQuXG4gICAqL1xuICAgb3ZlcnJpZGUgaGFzRXJyb3I8SyBleHRlbmRzIFN0cmluZ0tleXM8Vj4gPSBhbnk+KGVycm9yQ29kZTogSykge1xuICAgIHJldHVybiBzdXBlci5oYXNFcnJvcihlcnJvckNvZGUpO1xuICB9XG59XG4iXX0=