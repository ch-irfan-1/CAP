import { Validators as NativeValidators } from '@angular/forms';
// Next flag used because of this https://github.com/ng-packagr/ng-packagr/issues/696#issuecomment-373487183
// @dynamic
/**
 * Provides a set of built-in validators that can be used by form controls.
 *
 * A validator is a function that processes a `FormControl` or collection of
 * controls and returns an error map or null. A null map means that validation has passed.
 *
 * See also [Form Validation](https://angular.io/guide/form-validation).
 */
export class Validators extends NativeValidators {
    /**
     * Validator that requires the control's value to be greater than or equal to the provided number.
     * The validator exists only as a function and not as a directive.
     *
     * ### Validate against a minimum of 3
     *
     * ```ts
     * const control = new FormControl(2, Validators.min(3));
     *
     * console.log(control.errors); // {min: {min: 3, actual: 2}}
     * ```
     *
     * @returns A validator function that returns an error map with the
     * `min` property if the validation check fails, otherwise `null`.
     *
     */
    static min(min) {
        return super.min(min);
    }
    /**
     * Validator that requires the control's value to be less than or equal to the provided number.
     * The validator exists only as a function and not as a directive.
     *
     * ### Validate against a maximum of 15
     *
     * ```ts
     * const control = new FormControl(16, Validators.max(15));
     *
     * console.log(control.errors); // {max: {max: 15, actual: 16}}
     * ```
     *
     * @returns A validator function that returns an error map with the
     * `max` property if the validation check fails, otherwise `null`.
     *
     */
    static max(max) {
        return super.max(max);
    }
    /**
     * Validator that requires the control have a non-empty value.
     *
     * ### Validate that the field is non-empty
     *
     * ```ts
     * const control = new FormControl('', Validators.required);
     *
     * console.log(control.errors); // {required: true}
     * ```
     *
     * @returns An error map with the `required` property
     * if the validation check fails, otherwise `null`.
     *
     */
    static required(control) {
        return super.required(control);
    }
    /**
     * Validator that requires the control's value be true. This validator is commonly
     * used for required checkboxes.
     *
     * ### Validate that the field value is true
     *
     * ```typescript
     * const control = new FormControl('', Validators.requiredTrue);
     *
     * console.log(control.errors); // {required: true}
     * ```
     *
     * @returns An error map that contains the `required` property
     * set to `true` if the validation check fails, otherwise `null`.
     */
    static requiredTrue(control) {
        return super.requiredTrue(control);
    }
    /**
     * Validator that requires the control's value pass an email validation test.
     *
     * ### Validate that the field matches a valid email pattern
     *
     * ```typescript
     * const control = new FormControl('bad@', Validators.email);
     *
     * console.log(control.errors); // {email: true}
     * ```
     *
     * @returns An error map with the `email` property
     * if the validation check fails, otherwise `null`.
     *
     */
    static email(control) {
        return super.email(control);
    }
    /**
     * Validator that requires the length of the control's value to be greater than or equal
     * to the provided minimum length. This validator is also provided by default if you use the
     * the HTML5 `minlength` attribute.
     *
     * ### Validate that the field has a minimum of 3 characters
     *
     * ```typescript
     * const control = new FormControl('ng', Validators.minLength(3));
     *
     * console.log(control.errors); // {minlength: {requiredLength: 3, actualLength: 2}}
     * ```
     *
     * ```html
     * <input minlength="5">
     * ```
     *
     * @returns A validator function that returns an error map with the
     * `minlength` if the validation check fails, otherwise `null`.
     */
    static minLength(minLength) {
        return super.minLength(minLength);
    }
    /**
     * Validator that requires the length of the control's value to be less than or equal
     * to the provided maximum length. This validator is also provided by default if you use the
     * the HTML5 `maxlength` attribute.
     *
     * ### Validate that the field has maximum of 5 characters
     *
     * ```typescript
     * const control = new FormControl('Angular', Validators.maxLength(5));
     *
     * console.log(control.errors); // {maxlength: {requiredLength: 5, actualLength: 7}}
     * ```
     *
     * ```html
     * <input maxlength="5">
     * ```
     *
     * @returns A validator function that returns an error map with the
     * `maxlength` property if the validation check fails, otherwise `null`.
     */
    static maxLength(maxLength) {
        return super.maxLength(maxLength);
    }
    /**
     * Validator that requires the control's value to match a regex pattern. This validator is also
     * provided by default if you use the HTML5 `pattern` attribute.
     *
     * Note that if a Regexp is provided, the Regexp is used as is to test the values. On the other
     * hand, if a string is passed, the `^` character is prepended and the `$` character is
     * appended to the provided string (if not already present), and the resulting regular
     * expression is used to test the values.
     *
     * ### Validate that the field only contains letters or spaces
     *
     * ```typescript
     * const control = new FormControl('1', Validators.pattern('[a-zA-Z ]*'));
     *
     * console.log(control.errors); // {pattern: {requiredPattern: '^[a-zA-Z ]*$', actualValue: '1'}}
     * ```
     *
     * ```html
     * <input pattern="[a-zA-Z ]*">
     * ```
     *
     * @returns A validator function that returns an error map with the
     * `pattern` property if the validation check fails, otherwise `null`.
     */
    static pattern(pattern) {
        return super.pattern(pattern);
    }
    /**
     * Validator that performs no operation.
     */
    static nullValidator(control) {
        return null;
    }
    static compose(validators) {
        return super.compose(validators);
    }
    /**
     * Compose multiple async validators into a single function that returns the union
     * of the individual error objects for the provided control.
     *
     * @returns A validator function that returns an error map with the
     * merged error objects of the async validators if the validation check fails, otherwise `null`.
     */
    static composeAsync(validators) {
        return super.composeAsync(validators);
    }
    /**
     * At least one file should be.
     *
     * **Note**: use this validator when `formControl.value` is an instance of `FormData` only.
     */
    static fileRequired(formControl) {
        if (!(formControl.value instanceof FormData)) {
            return { fileRequired: true };
        }
        const files = [];
        formControl.value.forEach((file) => files.push(file));
        for (const file of files) {
            if (file instanceof File) {
                return null;
            }
        }
        return { fileRequired: true };
    }
    /**
     * Minimal number of files.
     *
     * **Note**: use this validator when `formControl.value` is an instance of `FormData` only.
     */
    static filesMinLength(minLength) {
        return (formControl) => {
            const value = formControl.value;
            if (minLength < 1) {
                return null;
            }
            if (!value || !(value instanceof FormData)) {
                return { filesMinLength: { requiredLength: minLength, actualLength: 0 } };
            }
            const files = [];
            value.forEach((file) => files.push(file));
            const len = files.length;
            if (len < minLength) {
                return { filesMinLength: { requiredLength: minLength, actualLength: len } };
            }
            return null;
        };
    }
    /**
     * Maximal number of files.
     *
     * **Note**: use this validator when `formControl.value` is an instance of `FormData` only.
     */
    static filesMaxLength(maxLength) {
        return (formControl) => {
            if (!(formControl.value instanceof FormData)) {
                return null;
            }
            const files = [];
            formControl.value.forEach((file) => files.push(file));
            const len = files.length;
            if (len > maxLength) {
                return { filesMaxLength: { requiredLength: maxLength, actualLength: len } };
            }
            return null;
        };
    }
    /**
     * Maximal size of a file.
     *
     * **Note**: use this validator when `formControl.value` is an instance of `FormData` only.
     */
    static fileMaxSize(maxSize) {
        return (formControl) => {
            if (!(formControl.value instanceof FormData)) {
                return null;
            }
            const files = [];
            formControl.value.forEach((file) => files.push(file));
            for (const file of files) {
                if (file instanceof File && file.size > maxSize) {
                    return { fileMaxSize: { requiredSize: maxSize, actualSize: file.size, file } };
                }
            }
            return null;
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL215LWxpYi9zcmMvbGliL3NyYy9saWIvdmFsaWRhdG9ycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxJQUFJLGdCQUFnQixFQUFtQixNQUFNLGdCQUFnQixDQUFDO0FBS2pGLDRHQUE0RztBQUM1RyxXQUFXO0FBQ1g7Ozs7Ozs7R0FPRztBQUNILE1BQU0sT0FBTyxVQUFXLFNBQVEsZ0JBQWdCO0lBQzlDOzs7Ozs7Ozs7Ozs7Ozs7T0FlRztJQUNILE1BQU0sQ0FBVSxHQUFHLENBQUMsR0FBVztRQUM3QixPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUEwRCxDQUFDO0lBQ2pGLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7O09BZUc7SUFDSCxNQUFNLENBQVUsR0FBRyxDQUFDLEdBQVc7UUFDN0IsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBMEQsQ0FBQztJQUNqRixDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7O09BY0c7SUFDSCxNQUFNLENBQVUsUUFBUSxDQUFDLE9BQXdCO1FBQy9DLE9BQU8sS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQWdELENBQUM7SUFDaEYsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7OztPQWNHO0lBQ0gsTUFBTSxDQUFVLFlBQVksQ0FBQyxPQUF3QjtRQUNuRCxPQUFPLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFnRCxDQUFDO0lBQ3BGLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7T0FjRztJQUNILE1BQU0sQ0FBVSxLQUFLLENBQUMsT0FBd0I7UUFDNUMsT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBNkMsQ0FBQztJQUMxRSxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FtQkc7SUFDSCxNQUFNLENBQVUsU0FBUyxDQUFDLFNBQWlC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dXJjZXNDb250ZW50IjpbImltcG9ydCB7IFZhbGlkYXRvcnMgYXMgTmF0aXZlVmFsaWRhdG9ycywgQWJzdHJhY3RDb250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBWYWxpZGF0b3JGbiwgVmFsaWRhdGlvbkVycm9ycywgQXN5bmNWYWxpZGF0b3JGbiB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgRm9ybUNvbnRyb2wgfSBmcm9tICcuL2Zvcm0tY29udHJvbCc7XG5cbi8vIE5leHQgZmxhZyB1c2VkIGJlY2F1c2Ugb2YgdGhpcyBodHRwczovL2dpdGh1Yi5jb20vbmctcGFja2Fnci9uZy1wYWNrYWdyL2lzc3Vlcy82OTYjaXNzdWVjb21tZW50LTM3MzQ4NzE4M1xuLy8gQGR5bmFtaWNcbi8qKlxuICogUHJvdmlkZXMgYSBzZXQgb2YgYnVpbHQtaW4gdmFsaWRhdG9ycyB0aGF0IGNhbiBiZSB1c2VkIGJ5IGZvcm0gY29udHJvbHMuXG4gKlxuICogQSB2YWxpZGF0b3IgaXMgYSBmdW5jdGlvbiB0aGF0IHByb2Nlc3NlcyBhIGBGb3JtQ29udHJvbGAgb3IgY29sbGVjdGlvbiBvZlxuICogY29udHJvbHMgYW5kIHJldHVybnMgYW4gZXJyb3IgbWFwIG9yIG51bGwuIEEgbnVsbCBtYXAgbWVhbnMgdGhhdCB2YWxpZGF0aW9uIGhhcyBwYXNzZWQuXG4gKlxuICogU2VlIGFsc28gW0Zvcm0gVmFsaWRhdGlvbl0oaHR0cHM6Ly9hbmd1bGFyLmlvL2d1aWRlL2Zvcm0tdmFsaWRhdGlvbikuXG4gKi9cbmV4cG9ydCBjbGFzcyBWYWxpZGF0b3JzIGV4dGVuZHMgTmF0aXZlVmFsaWRhdG9ycyB7XG4gIC8qKlxuICAgKiBWYWxpZGF0b3IgdGhhdCByZXF1aXJlcyB0aGUgY29udHJvbCdzIHZhbHVlIHRvIGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB0aGUgcHJvdmlkZWQgbnVtYmVyLlxuICAgKiBUaGUgdmFsaWRhdG9yIGV4aXN0cyBvbmx5IGFzIGEgZnVuY3Rpb24gYW5kIG5vdCBhcyBhIGRpcmVjdGl2ZS5cbiAgICpcbiAgICogIyMjIFZhbGlkYXRlIGFnYWluc3QgYSBtaW5pbXVtIG9mIDNcbiAgICpcbiAgICogYGBgdHNcbiAgICogY29uc3QgY29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgyLCBWYWxpZGF0b3JzLm1pbigzKSk7XG4gICAqXG4gICAqIGNvbnNvbGUubG9nKGNvbnRyb2wuZXJyb3JzKTsgLy8ge21pbjoge21pbjogMywgYWN0dWFsOiAyfX1cbiAgICogYGBgXG4gICAqXG4gICAqIEByZXR1cm5zIEEgdmFsaWRhdG9yIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBlcnJvciBtYXAgd2l0aCB0aGVcbiAgICogYG1pbmAgcHJvcGVydHkgaWYgdGhlIHZhbGlkYXRpb24gY2hlY2sgZmFpbHMsIG90aGVyd2lzZSBgbnVsbGAuXG4gICAqXG4gICAqL1xuICBzdGF0aWMgb3ZlcnJpZGUgbWluKG1pbjogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHN1cGVyLm1pbihtaW4pIGFzIFZhbGlkYXRvckZuPHsgbWluOiB7IG1pbjogbnVtYmVyOyBhY3R1YWw6IG51bWJlciB9IH0+O1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIHRoZSBjb250cm9sJ3MgdmFsdWUgdG8gYmUgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIHRoZSBwcm92aWRlZCBudW1iZXIuXG4gICAqIFRoZSB2YWxpZGF0b3IgZXhpc3RzIG9ubHkgYXMgYSBmdW5jdGlvbiBhbmQgbm90IGFzIGEgZGlyZWN0aXZlLlxuICAgKlxuICAgKiAjIyMgVmFsaWRhdGUgYWdhaW5zdCBhIG1heGltdW0gb2YgMTVcbiAgICpcbiAgICogYGBgdHNcbiAgICogY29uc3QgY29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgxNiwgVmFsaWRhdG9ycy5tYXgoMTUpKTtcbiAgICpcbiAgICogY29uc29sZS5sb2coY29udHJvbC5lcnJvcnMpOyAvLyB7bWF4OiB7bWF4OiAxNSwgYWN0dWFsOiAxNn19XG4gICAqIGBgYFxuICAgKlxuICAgKiBAcmV0dXJucyBBIHZhbGlkYXRvciBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gZXJyb3IgbWFwIHdpdGggdGhlXG4gICAqIGBtYXhgIHByb3BlcnR5IGlmIHRoZSB2YWxpZGF0aW9uIGNoZWNrIGZhaWxzLCBvdGhlcndpc2UgYG51bGxgLlxuICAgKlxuICAgKi9cbiAgc3RhdGljIG92ZXJyaWRlIG1heChtYXg6IG51bWJlcikge1xuICAgIHJldHVybiBzdXBlci5tYXgobWF4KSBhcyBWYWxpZGF0b3JGbjx7IG1heDogeyBtYXg6IG51bWJlcjsgYWN0dWFsOiBudW1iZXIgfSB9PjtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0b3IgdGhhdCByZXF1aXJlcyB0aGUgY29udHJvbCBoYXZlIGEgbm9uLWVtcHR5IHZhbHVlLlxuICAgKlxuICAgKiAjIyMgVmFsaWRhdGUgdGhhdCB0aGUgZmllbGQgaXMgbm9uLWVtcHR5XG4gICAqXG4gICAqIGBgYHRzXG4gICAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woJycsIFZhbGlkYXRvcnMucmVxdWlyZWQpO1xuICAgKlxuICAgKiBjb25zb2xlLmxvZyhjb250cm9sLmVycm9ycyk7IC8vIHtyZXF1aXJlZDogdHJ1ZX1cbiAgICogYGBgXG4gICAqXG4gICAqIEByZXR1cm5zIEFuIGVycm9yIG1hcCB3aXRoIHRoZSBgcmVxdWlyZWRgIHByb3BlcnR5XG4gICAqIGlmIHRoZSB2YWxpZGF0aW9uIGNoZWNrIGZhaWxzLCBvdGhlcndpc2UgYG51bGxgLlxuICAgKlxuICAgKi9cbiAgc3RhdGljIG92ZXJyaWRlIHJlcXVpcmVkKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkge1xuICAgIHJldHVybiBzdXBlci5yZXF1aXJlZChjb250cm9sKSBhcyBWYWxpZGF0aW9uRXJyb3JzPHsgcmVxdWlyZWQ6IHRydWUgfT4gfCBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIHRoZSBjb250cm9sJ3MgdmFsdWUgYmUgdHJ1ZS4gVGhpcyB2YWxpZGF0b3IgaXMgY29tbW9ubHlcbiAgICogdXNlZCBmb3IgcmVxdWlyZWQgY2hlY2tib3hlcy5cbiAgICpcbiAgICogIyMjIFZhbGlkYXRlIHRoYXQgdGhlIGZpZWxkIHZhbHVlIGlzIHRydWVcbiAgICpcbiAgICogYGBgdHlwZXNjcmlwdFxuICAgKiBjb25zdCBjb250cm9sID0gbmV3IEZvcm1Db250cm9sKCcnLCBWYWxpZGF0b3JzLnJlcXVpcmVkVHJ1ZSk7XG4gICAqXG4gICAqIGNvbnNvbGUubG9nKGNvbnRyb2wuZXJyb3JzKTsgLy8ge3JlcXVpcmVkOiB0cnVlfVxuICAgKiBgYGBcbiAgICpcbiAgICogQHJldHVybnMgQW4gZXJyb3IgbWFwIHRoYXQgY29udGFpbnMgdGhlIGByZXF1aXJlZGAgcHJvcGVydHlcbiAgICogc2V0IHRvIGB0cnVlYCBpZiB0aGUgdmFsaWRhdGlvbiBjaGVjayBmYWlscywgb3RoZXJ3aXNlIGBudWxsYC5cbiAgICovXG4gIHN0YXRpYyBvdmVycmlkZSByZXF1aXJlZFRydWUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSB7XG4gICAgcmV0dXJuIHN1cGVyLnJlcXVpcmVkVHJ1ZShjb250cm9sKSBhcyBWYWxpZGF0aW9uRXJyb3JzPHsgcmVxdWlyZWQ6IHRydWUgfT4gfCBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIHRoZSBjb250cm9sJ3MgdmFsdWUgcGFzcyBhbiBlbWFpbCB2YWxpZGF0aW9uIHRlc3QuXG4gICAqXG4gICAqICMjIyBWYWxpZGF0ZSB0aGF0IHRoZSBmaWVsZCBtYXRjaGVzIGEgdmFsaWQgZW1haWwgcGF0dGVyblxuICAgKlxuICAgKiBgYGB0eXBlc2NyaXB0XG4gICAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woJ2JhZEAnLCBWYWxpZGF0b3JzLmVtYWlsKTtcbiAgICpcbiAgICogY29uc29sZS5sb2coY29udHJvbC5lcnJvcnMpOyAvLyB7ZW1haWw6IHRydWV9XG4gICAqIGBgYFxuICAgKlxuICAgKiBAcmV0dXJucyBBbiBlcnJvciBtYXAgd2l0aCB0aGUgYGVtYWlsYCBwcm9wZXJ0eVxuICAgKiBpZiB0aGUgdmFsaWRhdGlvbiBjaGVjayBmYWlscywgb3RoZXJ3aXNlIGBudWxsYC5cbiAgICpcbiAgICovXG4gIHN0YXRpYyBvdmVycmlkZSBlbWFpbChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpIHtcbiAgICByZXR1cm4gc3VwZXIuZW1haWwoY29udHJvbCkgYXMgVmFsaWRhdGlvbkVycm9yczx7IGVtYWlsOiB0cnVlIH0+IHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0b3IgdGhhdCByZXF1aXJlcyB0aGUgbGVuZ3RoIG9mIHRoZSBjb250cm9sJ3MgdmFsdWUgdG8gYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsXG4gICAqIHRvIHRoZSBwcm92aWRlZCBtaW5pbXVtIGxlbmd0aC4gVGhpcyB2YWxpZGF0b3IgaXMgYWxzbyBwcm92aWRlZCBieSBkZWZhdWx0IGlmIHlvdSB1c2UgdGhlXG4gICAqIHRoZSBIVE1MNSBgbWlubGVuZ3RoYCBhdHRyaWJ1dGUuXG4gICAqXG4gICAqICMjIyBWYWxpZGF0ZSB0aGF0IHRoZSBmaWVsZCBoYXMgYSBtaW5pbXVtIG9mIDMgY2hhcmFjdGVyc1xuICAgKlxuICAgKiBgYGB0eXBlc2NyaXB0XG4gICAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woJ25nJywgVmFsaWRhdG9ycy5taW5MZW5ndGgoMykpO1xuICAgKlxuICAgKiBjb25zb2xlLmxvZyhjb250cm9sLmVycm9ycyk7IC8vIHttaW5sZW5ndGg6IHtyZXF1aXJlZExlbmd0aDogMywgYWN0dWFsTGVuZ3RoOiAyfX1cbiAgICogYGBgXG4gICAqXG4gICAqIGBgYGh0bWxcbiAgICogPGlucHV0IG1pbmxlbmd0aD1cIjVcIj5cbiAgICogYGBgXG4gICAqXG4gICAqIEByZXR1cm5zIEEgdmFsaWRhdG9yIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBlcnJvciBtYXAgd2l0aCB0aGVcbiAgICogYG1pbmxlbmd0aGAgaWYgdGhlIHZhbGlkYXRpb24gY2hlY2sgZmFpbHMsIG90aGVyd2lzZSBgbnVsbGAuXG4gICAqL1xuICBzdGF0aWMgb3ZlcnJpZGUgbWluTGVuZ3RoKG1pbkxlbmd0aDogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHN1cGVyLm1pbkxlbmd0aChtaW5MZW5ndGgpIGFzIFZhbGlkYXRvckZuPHtcbiAgICAgIG1pbmxlbmd0aDogeyByZXF1aXJlZExlbmd0aDogbnVtYmVyOyBhY3R1YWxMZW5ndGg6IG51bWJlciB9O1xuICAgIH0+O1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIHRoZSBsZW5ndGggb2YgdGhlIGNvbnRyb2wncyB2YWx1ZSB0byBiZSBsZXNzIHRoYW4gb3IgZXF1YWxcbiAgICogdG8gdGhlIHByb3ZpZGVkIG1heGltdW0gbGVuZ3RoLiBUaGlzIHZhbGlkYXRvciBpcyBhbHNvIHByb3ZpZGVkIGJ5IGRlZmF1bHQgaWYgeW91IHVzZSB0aGVcbiAgICogdGhlIEhUTUw1IGBtYXhsZW5ndGhgIGF0dHJpYnV0ZS5cbiAgICpcbiAgICogIyMjIFZhbGlkYXRlIHRoYXQgdGhlIGZpZWxkIGhhcyBtYXhpbXVtIG9mIDUgY2hhcmFjdGVyc1xuICAgKlxuICAgKiBgYGB0eXBlc2NyaXB0XG4gICAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woJ0FuZ3VsYXInLCBWYWxpZGF0b3JzLm1heExlbmd0aCg1KSk7XG4gICAqXG4gICAqIGNvbnNvbGUubG9nKGNvbnRyb2wuZXJyb3JzKTsgLy8ge21heGxlbmd0aDoge3JlcXVpcmVkTGVuZ3RoOiA1LCBhY3R1YWxMZW5ndGg6IDd9fVxuICAgKiBgYGBcbiAgICpcbiAgICogYGBgaHRtbFxuICAgKiA8aW5wdXQgbWF4bGVuZ3RoPVwiNVwiPlxuICAgKiBgYGBcbiAgICpcbiAgICogQHJldHVybnMgQSB2YWxpZGF0b3IgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGVycm9yIG1hcCB3aXRoIHRoZVxuICAgKiBgbWF4bGVuZ3RoYCBwcm9wZXJ0eSBpZiB0aGUgdmFsaWRhdGlvbiBjaGVjayBmYWlscywgb3RoZXJ3aXNlIGBudWxsYC5cbiAgICovXG4gIHN0YXRpYyBvdmVycmlkZSBtYXhMZW5ndGgobWF4TGVuZ3RoOiBudW1iZXIpIHtcbiAgICByZXR1cm4gc3VwZXIubWF4TGVuZ3RoKG1heExlbmd0aCkgYXMgVmFsaWRhdG9yRm48e1xuICAgICAgbWF4bGVuZ3RoOiB7IHJlcXVpcmVkTGVuZ3RoOiBudW1iZXI7IGFjdHVhbExlbmd0aDogbnVtYmVyIH07XG4gICAgfT47XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdG9yIHRoYXQgcmVxdWlyZXMgdGhlIGNvbnRyb2wncyB2YWx1ZSB0byBtYXRjaCBhIHJlZ2V4IHBhdHRlcm4uIFRoaXMgdmFsaWRhdG9yIGlzIGFsc29cbiAgICogcHJvdmlkZWQgYnkgZGVmYXVsdCBpZiB5b3UgdXNlIHRoZSBIVE1MNSBgcGF0dGVybmAgYXR0cmlidXRlLlxuICAgKlxuICAgKiBOb3RlIHRoYXQgaWYgYSBSZWdleHAgaXMgcHJvdmlkZWQsIHRoZSBSZWdleHAgaXMgdXNlZCBhcyBpcyB0byB0ZXN0IHRoZSB2YWx1ZXMuIE9uIHRoZSBvdGhlclxuICAgKiBoYW5kLCBpZiBhIHN0cmluZyBpcyBwYXNzZWQsIHRoZSBgXmAgY2hhcmFjdGVyIGlzIHByZXBlbmRlZCBhbmQgdGhlIGAkYCBjaGFyYWN0ZXIgaXNcbiAgICogYXBwZW5kZWQgdG8gdGhlIHByb3ZpZGVkIHN0cmluZyAoaWYgbm90IGFscmVhZHkgcHJlc2VudCksIGFuZCB0aGUgcmVzdWx0aW5nIHJlZ3VsYXJcbiAgICogZXhwcmVzc2lvbiBpcyB1c2VkIHRvIHRlc3QgdGhlIHZhbHVlcy5cbiAgICpcbiAgICogIyMjIFZhbGlkYXRlIHRoYXQgdGhlIGZpZWxkIG9ubHkgY29udGFpbnMgbGV0dGVycyBvciBzcGFjZXNcbiAgICpcbiAgICogYGBgdHlwZXNjcmlwdFxuICAgKiBjb25zdCBjb250cm9sID0gbmV3IEZvcm1Db250cm9sKCcxJywgVmFsaWRhdG9ycy5wYXR0ZXJuKCdbYS16QS1aIF0qJykpO1xuICAgKlxuICAgKiBjb25zb2xlLmxvZyhjb250cm9sLmVycm9ycyk7IC8vIHtwYXR0ZXJuOiB7cmVxdWlyZWRQYXR0ZXJuOiAnXlthLXpBLVogXSokJywgYWN0dWFsVmFsdWU6ICcxJ319XG4gICAqIGBgYFxuICAgKlxuICAgKiBgYGBodG1sXG4gICAqIDxpbnB1dCBwYXR0ZXJuPVwiW2EtekEtWiBdKlwiPlxuICAgKiBgYGBcbiAgICpcbiAgICogQHJldHVybnMgQSB2YWxpZGF0b3IgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGVycm9yIG1hcCB3aXRoIHRoZVxuICAgKiBgcGF0dGVybmAgcHJvcGVydHkgaWYgdGhlIHZhbGlkYXRpb24gY2hlY2sgZmFpbHMsIG90aGVyd2lzZSBgbnVsbGAuXG4gICAqL1xuICBzdGF0aWMgb3ZlcnJpZGUgcGF0dGVybihwYXR0ZXJuOiBzdHJpbmcgfCBSZWdFeHApIHtcbiAgICByZXR1cm4gc3VwZXIucGF0dGVybihwYXR0ZXJuKSBhcyBWYWxpZGF0b3JGbjx7XG4gICAgICBwYXR0ZXJuOiB7IHJlcXVpcmVkUGF0dGVybjogc3RyaW5nOyBhY3R1YWxWYWx1ZTogc3RyaW5nIH07XG4gICAgfT47XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdG9yIHRoYXQgcGVyZm9ybXMgbm8gb3BlcmF0aW9uLlxuICAgKi9cbiAgc3RhdGljIG92ZXJyaWRlIG51bGxWYWxpZGF0b3IoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogbnVsbCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQ29tcG9zZSBtdWx0aXBsZSB2YWxpZGF0b3JzIGludG8gYSBzaW5nbGUgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSB1bmlvblxuICAgKiBvZiB0aGUgaW5kaXZpZHVhbCBlcnJvciBtYXBzIGZvciB0aGUgcHJvdmlkZWQgY29udHJvbC5cbiAgICpcbiAgICogQHJldHVybnMgQSB2YWxpZGF0b3IgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGVycm9yIG1hcCB3aXRoIHRoZVxuICAgKiBtZXJnZWQgZXJyb3IgbWFwcyBvZiB0aGUgdmFsaWRhdG9ycyBpZiB0aGUgdmFsaWRhdGlvbiBjaGVjayBmYWlscywgb3RoZXJ3aXNlIGBudWxsYC5cbiAgICovXG4gIHN0YXRpYyBvdmVycmlkZSBjb21wb3NlKHZhbGlkYXRvcnM6IG51bGwpOiBudWxsO1xuICBzdGF0aWMgb3ZlcnJpZGUgY29tcG9zZTxUIGV4dGVuZHMgb2JqZWN0ID0gYW55Pih2YWxpZGF0b3JzOiAoVmFsaWRhdG9yRm4gfCBudWxsIHwgdW5kZWZpbmVkKVtdKTogVmFsaWRhdG9yRm48VD4gfCBudWxsO1xuICBzdGF0aWMgb3ZlcnJpZGUgY29tcG9zZTxUIGV4dGVuZHMgb2JqZWN0ID0gYW55Pih2YWxpZGF0b3JzOiAoVmFsaWRhdG9yRm4gfCBudWxsIHwgdW5kZWZpbmVkKVtdIHwgbnVsbCk6IFZhbGlkYXRvckZuPFQ+IHwgbnVsbCB7XG4gICAgcmV0dXJuIHN1cGVyLmNvbXBvc2UodmFsaWRhdG9ycyBhcyBhbnkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbXBvc2UgbXVsdGlwbGUgYXN5bmMgdmFsaWRhdG9ycyBpbnRvIGEgc2luZ2xlIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgdW5pb25cbiAgICogb2YgdGhlIGluZGl2aWR1YWwgZXJyb3Igb2JqZWN0cyBmb3IgdGhlIHByb3ZpZGVkIGNvbnRyb2wuXG4gICAqXG4gICAqIEByZXR1cm5zIEEgdmFsaWRhdG9yIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBlcnJvciBtYXAgd2l0aCB0aGVcbiAgICogbWVyZ2VkIGVycm9yIG9iamVjdHMgb2YgdGhlIGFzeW5jIHZhbGlkYXRvcnMgaWYgdGhlIHZhbGlkYXRpb24gY2hlY2sgZmFpbHMsIG90aGVyd2lzZSBgbnVsbGAuXG4gICAqL1xuICBzdGF0aWMgb3ZlcnJpZGUgY29tcG9zZUFzeW5jPFQgZXh0ZW5kcyBvYmplY3QgPSBhbnk+KHZhbGlkYXRvcnM6IChBc3luY1ZhbGlkYXRvckZuPFQ+IHwgbnVsbClbXSkge1xuICAgIHJldHVybiBzdXBlci5jb21wb3NlQXN5bmModmFsaWRhdG9ycykgYXMgQXN5bmNWYWxpZGF0b3JGbjxUPiB8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQXQgbGVhc3Qgb25lIGZpbGUgc2hvdWxkIGJlLlxuICAgKlxuICAgKiAqKk5vdGUqKjogdXNlIHRoaXMgdmFsaWRhdG9yIHdoZW4gYGZvcm1Db250cm9sLnZhbHVlYCBpcyBhbiBpbnN0YW5jZSBvZiBgRm9ybURhdGFgIG9ubHkuXG4gICAqL1xuICBzdGF0aWMgZmlsZVJlcXVpcmVkKGZvcm1Db250cm9sOiBGb3JtQ29udHJvbDxGb3JtRGF0YT4pOiBWYWxpZGF0aW9uRXJyb3JzPHsgZmlsZVJlcXVpcmVkOiB0cnVlIH0+IHwgbnVsbCB7XG4gICAgaWYgKCEoZm9ybUNvbnRyb2wudmFsdWUgaW5zdGFuY2VvZiBGb3JtRGF0YSkpIHtcbiAgICAgIHJldHVybiB7IGZpbGVSZXF1aXJlZDogdHJ1ZSB9O1xuICAgIH1cblxuICAgIGNvbnN0IGZpbGVzOiBGb3JtRGF0YUVudHJ5VmFsdWVbXSA9IFtdO1xuICAgIGZvcm1Db250cm9sLnZhbHVlLmZvckVhY2goKGZpbGUpID0+IGZpbGVzLnB1c2goZmlsZSkpO1xuXG4gICAgZm9yIChjb25zdCBmaWxlIG9mIGZpbGVzKSB7XG4gICAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIEZpbGUpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgZmlsZVJlcXVpcmVkOiB0cnVlIH07XG4gIH1cblxuICAvKipcbiAgICogTWluaW1hbCBudW1iZXIgb2YgZmlsZXMuXG4gICAqXG4gICAqICoqTm90ZSoqOiB1c2UgdGhpcyB2YWxpZGF0b3Igd2hlbiBgZm9ybUNvbnRyb2wudmFsdWVgIGlzIGFuIGluc3RhbmNlIG9mIGBGb3JtRGF0YWAgb25seS5cbiAgICovXG4gIHN0YXRpYyBmaWxlc01pbkxlbmd0aChcbiAgICBtaW5MZW5ndGg6IG51bWJlclxuICApOiBWYWxpZGF0b3JGbjx7IGZpbGVzTWluTGVuZ3RoOiB7IHJlcXVpcmVkTGVuZ3RoOiBudW1iZXI7IGFjdHVhbExlbmd0aDogbnVtYmVyIH0gfT4ge1xuICAgIHJldHVybiAoZm9ybUNvbnRyb2w6IGFueSkgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSBmb3JtQ29udHJvbC52YWx1ZSBhcyBGb3JtRGF0YTtcblxuICAgICAgaWYgKG1pbkxlbmd0aCA8IDEpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmICghdmFsdWUgfHwgISh2YWx1ZSBpbnN0YW5jZW9mIEZvcm1EYXRhKSkge1xuICAgICAgICByZXR1cm4geyBmaWxlc01pbkxlbmd0aDogeyByZXF1aXJlZExlbmd0aDogbWluTGVuZ3RoLCBhY3R1YWxMZW5ndGg6IDAgfSB9O1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmaWxlczogRm9ybURhdGFFbnRyeVZhbHVlW10gPSBbXTtcbiAgICAgIHZhbHVlLmZvckVhY2goKGZpbGUpID0+IGZpbGVzLnB1c2goZmlsZSkpO1xuICAgICAgY29uc3QgbGVuID0gZmlsZXMubGVuZ3RoO1xuICAgICAgaWYgKGxlbiA8IG1pbkxlbmd0aCkge1xuICAgICAgICByZXR1cm4geyBmaWxlc01pbkxlbmd0aDogeyByZXF1aXJlZExlbmd0aDogbWluTGVuZ3RoLCBhY3R1YWxMZW5ndGg6IGxlbiB9IH07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogTWF4aW1hbCBudW1iZXIgb2YgZmlsZXMuXG4gICAqXG4gICAqICoqTm90ZSoqOiB1c2UgdGhpcyB2YWxpZGF0b3Igd2hlbiBgZm9ybUNvbnRyb2wudmFsdWVgIGlzIGFuIGluc3RhbmNlIG9mIGBGb3JtRGF0YWAgb25seS5cbiAgICovXG4gIHN0YXRpYyBmaWxlc01heExlbmd0aChcbiAgICBtYXhMZW5ndGg6IG51bWJlclxuICApOiBWYWxpZGF0b3JGbjx7IGZpbGVzTWF4TGVuZ3RoOiB7IHJlcXVpcmVkTGVuZ3RoOiBudW1iZXI7IGFjdHVhbExlbmd0aDogbnVtYmVyIH0gfT4ge1xuICAgIHJldHVybiAoZm9ybUNvbnRyb2w6IGFueSkgPT4ge1xuICAgICAgaWYgKCEoZm9ybUNvbnRyb2wudmFsdWUgaW5zdGFuY2VvZiBGb3JtRGF0YSkpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZpbGVzOiBGb3JtRGF0YUVudHJ5VmFsdWVbXSA9IFtdO1xuICAgICAgKGZvcm1Db250cm9sLnZhbHVlIGFzIEZvcm1EYXRhKS5mb3JFYWNoKChmaWxlKSA9PiBmaWxlcy5wdXNoKGZpbGUpKTtcbiAgICAgIGNvbnN0IGxlbiA9IGZpbGVzLmxlbmd0aDtcbiAgICAgIGlmIChsZW4gPiBtYXhMZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHsgZmlsZXNNYXhMZW5ndGg6IHsgcmVxdWlyZWRMZW5ndGg6IG1heExlbmd0aCwgYWN0dWFsTGVuZ3RoOiBsZW4gfSB9O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIE1heGltYWwgc2l6ZSBvZiBhIGZpbGUuXG4gICAqXG4gICAqICoqTm90ZSoqOiB1c2UgdGhpcyB2YWxpZGF0b3Igd2hlbiBgZm9ybUNvbnRyb2wudmFsdWVgIGlzIGFuIGluc3RhbmNlIG9mIGBGb3JtRGF0YWAgb25seS5cbiAgICovXG4gIHN0YXRpYyBmaWxlTWF4U2l6ZShcbiAgICBtYXhTaXplOiBudW1iZXJcbiAgKTogVmFsaWRhdG9yRm48eyBmaWxlTWF4U2l6ZTogeyByZXF1aXJlZFNpemU6IG51bWJlcjsgYWN0dWFsU2l6ZTogbnVtYmVyOyBmaWxlOiBGaWxlIH0gfT4ge1xuICAgIHJldHVybiAoZm9ybUNvbnRyb2w6IGFueSkgPT4ge1xuICAgICAgaWYgKCEoZm9ybUNvbnRyb2wudmFsdWUgaW5zdGFuY2VvZiBGb3JtRGF0YSkpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZpbGVzOiBGb3JtRGF0YUVudHJ5VmFsdWVbXSA9IFtdO1xuICAgICAgKGZvcm1Db250cm9sLnZhbHVlIGFzIEZvcm1EYXRhKS5mb3JFYWNoKChmaWxlKSA9PiBmaWxlcy5wdXNoKGZpbGUpKTtcbiAgICAgIGZvciAoY29uc3QgZmlsZSBvZiBmaWxlcykge1xuICAgICAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIEZpbGUgJiYgZmlsZS5zaXplID4gbWF4U2l6ZSkge1xuICAgICAgICAgIHJldHVybiB7IGZpbGVNYXhTaXplOiB7IHJlcXVpcmVkU2l6ZTogbWF4U2l6ZSwgYWN0dWFsU2l6ZTogZmlsZS5zaXplLCBmaWxlIH0gfTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuICB9XG59XG4iXX0=