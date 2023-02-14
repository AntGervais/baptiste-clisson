import { useState } from 'react';
import debounce from './debounce';

// Exclusive OR (XOR) for types so that only regexp or a custom validator
// is used https://stackoverflow.com/a/60617060/17703865
export type Validation = {
  required?: boolean | string;
} & (
  | {
      pattern: {
        value: RegExp;
        message: string;
      };
      validate?: never;
    }
  | {
      pattern?: never;
      /** validation function if not using a regexp */
      validate: {
        isValid: (value: string) => boolean;
        message: string;
      };
    }
);

export type Validations<T> = Partial<Record<keyof T, Validation>>;

export type ErrorRecord<T> = Partial<Record<keyof T, string>>;

export type SubmitStatus = 'submitting' | 'success' | 'failure' | 'none';

export type SubmitHandler = (data: any) => Promise<boolean>;

/**
 * @interface FormOptions
 * @member {Partial<T>} initialValues - An optional object where properties
 * are optional (can be empty) that consists of keys from the generic type
 * and string values
 * @member {Validations<T>} validations - An object that consists of the
 * Validation types onSubmit: The function to invoke with the data
 * @member {function} onSubmit - The function to invoke with the data. Must return a
 * Promise that resolves to a boolean to indicate success or failure
 * @member {function} sanitizeFn - The function used to sanitize user input
 * @member {boolean} validateBlurAfterSubmit - Validate on blur even if the
 * form has not been submitted yet
 * @member {boolean} validateChangeWithoutSubmit - Validate input on change
 * even if the form has not been submitted yet
 * @member {boolean} debounce - Debounce or throttle the handleChange function
 * @member {number} debounceTime - The time in milliseconds to debounce the
 * handleChange function
 */
export type FormOptions<T> = {
  initialValues?: Partial<T>;
  validations?: Validations<T>;
  onSubmit: SubmitHandler;
  sanitizeFn?: (value: string) => string;
  validateBlurWithoutSubmit?: boolean;
  validateChangeWithoutSubmit?: boolean;
  debounce?: boolean;
  debounceTime?: number;
};

export const useForm = <T extends Record<keyof T, any>>(options: FormOptions<T>) => {
  // Data will have the type of the object type we want from the form and
  // will set to the optional initialValues or an empty object, which we
  // will then have to assert the possible empty object to the generic type
  const [data, setData] = useState<T>((options?.initialValues ?? {}) as T);
  // Track the errors which will be a possibly empty object that will contain
  // keys from the data type passed in with string values for error messages
  const [errors, setErrors] = useState<ErrorRecord<T>>({});
  const [status, setStatus] = useState<SubmitStatus>('none');
  const [attempted, setAttempted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Set default values for options
  options.debounce = options.debounce ?? false;
  options.debounceTime = options.debounceTime ?? 0;

  const validate = (key: keyof T, value: T[typeof key] = data[key]) => {
    const { required, pattern, validate } = options?.validations?.[key] ?? {};
    let valid = true;
    let error = '';

    // If not required and no input, skip validation
    if (!required && !value) {
      return { valid, error };
    }
    // We want the first error message to be the requirement because
    // it will probably fail the regexp test if empty
    if (required && !value) {
      valid = false;
      error = typeof required === 'string' ? required : 'This field is required';
      // If it has a regexp test - validate
    } else if (pattern) {
      if (!pattern.value.test(value as string)) {
        valid = false;
        error = pattern.message;
      }
      // If it has a custom validator - validate
    } else if (validate) {
      if (!validate.isValid(value as string)) {
        valid = false;
        error = validate.message;
      }
    }

    return {
      valid,
      error,
    };
  };

  /**
   * Handles any change to the input elements by setting the data and
   * sanitizes the input, if a sanitize function is given.
   * Has a debounce function to prevent too many renders by delaying the
   * function call. It is disabled by default to allow autocomplete to work
   * properly
   *
   * @param key the key of the field to update
   */
  const handleChange = (key: keyof T) =>
    debounce((e: any) => {
      // Access previous data to prevent race conditions
      setData((prevData) => ({
        ...prevData,
        [key]: options.sanitizeFn ? options.sanitizeFn(e.target.value) : e.target.value,
      }));
      // If we can validate without a form submission or if the form has been submitted
      // then we can always validate on change
      if (options?.validateChangeWithoutSubmit || attempted) {
        setErrors({ ...errors, [key]: validate(key, e.target.value).error });
      }
    }, options.debounceTime);

  /**
   * Validates the input field when leaving focus of the element.
   *
   * Only validates if the specified field has an input value and is required.
   * Deletes the error and revalidates the input so that if there is no error,
   * it won't carry the previous error over when none exists
   *
   * @param key the key of the field to validate
   * @returns void
   */
  const handleBlur = (key: keyof T) => (e: any) => {
    // Need to set the data on blur for autocompleted values
    if (e.target.value) {
      setData({
        ...data,
        [key]: options?.sanitizeFn ? options.sanitizeFn(e.target.value) : e.target.value,
      });
    }

    // If no validations
    // OR validate on blur AND there is no input
    // OR validate on blur only after the form has attempted to submit is set
    // and hasn't attempted a submit
    if (
      !options?.validations ||
      (options?.validateBlurWithoutSubmit && !data[key]) ||
      (!options?.validateBlurWithoutSubmit && !attempted)
    ) {
      return;
    }

    // Reset the error for the key
    delete errors[key];
    // Validate the key field
    const { valid, error } = validate(key, e.target.value);
    // If the field is valid, remove the error
    if (valid) {
      setErrors({ ...errors });
      // Otherwise, set the error
    } else {
      setErrors({ ...errors, [key]: error });
    }
  };

  /**
   * Takes the key of the field to pass the error string, the onChange, and
   * onBlur handlers together for a single input element to reduce repetition.
   *
   * @param key the key of the field to validate
   * @returns the `error` for the field and the `onChange` and `onBlur` handlers
   */
  const register = (key: keyof T) => ({
    error: errors[key],
    onChange: handleChange(key),
    onBlur: handleBlur(key),
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (options?.validations) {
      if (!attempted) {
        setAttempted(true);
      }

      const { validations } = options;
      const newErrors: Partial<Record<keyof T, string>> = {};
      let isValid = true;

      for (const key in validations) {
        const { valid, error } = validate(key, data[key]);
        console.log('validating', key, data[key], valid, error);
        if (!valid) {
          isValid = false;
          newErrors[key] = error;
        }
      }

      if (!isValid) {
        setStatus('none');
        setErrors(newErrors);
        return;
      }
    }

    // Valid input, clear errors and submit data
    setErrors({});

    setStatus('submitting');

    const result = (await options.onSubmit(data)) ? 'success' : 'failure';

    setStatus(result);

    if (result === 'success') {
      setSubmitted(true);
    }
  };

  return {
    submitting: status === 'submitting',
    status,
    submitted,
    data,
    errors,
    handleChange,
    handleBlur,
    register,
    handleSubmit,
  };
};
