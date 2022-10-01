// Validator Component
function Validator(options) {
  const formElement = document.querySelector(options.form);

  // Get the right formGroup element with class='form-group' of input element
  function getParent(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
  }

  // validate function
  function validate(inputElement, rule) {
    let errorMessage;
    const formGroup = getParent(inputElement, options.formGroupSelector);

    switch (inputElement.type) {
      case 'checkbox':
      case 'radio':
        const isCheck = formElement.querySelector(
          `[name="${inputElement.name}"]:checked`,
        );

        errorMessage = rule.test(isCheck);
        break;

      default:
        errorMessage = rule.test(inputElement.value);
    }

    if (errorMessage) {
      const errorElement = formGroup.querySelector(options.formMessageSelector);

      formGroup.classList.add('invalid');
      errorElement.innerText = errorMessage;
    }

    return errorMessage;
  }

  if (formElement) {
    options.rules.forEach((rule) => {
      const inputElements = formElement.querySelectorAll(rule.selector);

      inputElements.forEach((inputElement) => {
        // Handle blur event on input
        inputElement.addEventListener('blur', () => {
          validate(inputElement, rule);
        });

        // Handle input event on input
        inputElement.addEventListener('input', () => {
          const formGroup = getParent(inputElement, options.formGroupSelector);

          if (formGroup.classList.contains('invalid')) {
            const errorElement = formGroup.querySelector(
              options.formMessageSelector,
            );

            formGroup.classList.remove('invalid');
            errorElement.innerText = '';
          }
        });
      });
    });

    // Handle submit form
    formElement.onsubmit = (e) => {
      let formValid = true;
      e.preventDefault();

      options.rules.forEach((rule) => {
        const inputElements = formElement.querySelectorAll(rule.selector);

        inputElements.forEach((inputElement) => {
          const inValid = validate(inputElement, rule);
          if (inValid) {
            formValid = false;
          }
        });
      });

      if (formValid) {
        // Handle values of inputs with Javascript when submit form
        if (typeof options.onSubmit === 'function') {
          const enableInputs = formElement.querySelectorAll('[name]');

          const formValues = Array.from(enableInputs).reduce(
            (values, input) => {
              switch (input.type) {
                case 'checkbox':
                  const isCheck = formElement.querySelector(
                    `[name="${input.name}"]:checked`,
                  );

                  if (!isCheck) {
                    values[input.name] = '';
                    break;
                  }

                  if (input.checked) {
                    if (!Array.isArray(values[input.name])) {
                      values[input.name] = [];
                    }
                    values[input.name].push(input.value);
                  }
                  break;
                case 'radio':
                  if (input.checked) {
                    values[input.name] = input.value;
                  }
                  break;
                case 'file':
                  values[input.name] = input.files;
                  break;
                default:
                  values[input.name] = input.value;
              }

              return values;
            },
            {},
          );

          options.onSubmit(formValues);
        }

        // Handle with default behavior of browswer
        else {
          formElement.submit();
        }
      }
    };
  }
}

// Validator rules
Validator.isRequired = (selector, message = 'This field is required.') => {
  return {
    selector,
    test(value) {
      if (typeof value === 'object') {
        return value ? undefined : message;
      }

      return value.trim() ? undefined : message;
    },
  };
};

Validator.isEmail = (selector, message = 'This field must be email.') => {
  const regexEmailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return {
    selector,
    test(value) {
      return regexEmailPattern.test(value) ? undefined : message;
    },
  };
};

Validator.minLength = (
  selector,
  min,
  message = `This field must be at least ${min} characters.`,
) => {
  return {
    selector,
    test(value) {
      return value.length >= min ? undefined : message;
    },
  };
};

Validator.isConfirmed = (
  selector,
  confirmValue,
  message = 'Password does not match.',
) => {
  return {
    selector,
    test(value) {
      return value === confirmValue() ? undefined : message;
    },
  };
};
