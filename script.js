const DOM = (() => {
  const removeError = field => {
    field.classList.remove("invalid");
    if (field.parentNode.querySelector(".field-error")) {
      field.parentNode.querySelector(".field-error").remove();
    }
  };

  const displayError = (field, message) => {
    const messageElement = document.createElement("span");
    messageElement.innerHTML = `${message}`;
    messageElement.classList.add("field-error");
    field.parentNode.appendChild(messageElement);
    field.classList.add("invalid");
  };

  return { removeError, displayError };
})();

const formController = (() => {
  const formInputs = Array.from(
    document.querySelector(".form").querySelectorAll("input")
  );

  const sanitizeNumberInput = value => {
    return [...value.toString()]
      .filter(char => {
        return char.charCodeAt(0) >= 48 && char.charCodeAt(0) <= 57;
      })
      .join("");
  };

  const validateField = field => {
    DOM.removeError(field);

    if (
      field.value.trim().length === 0 &&
      !field.getAttribute("id").includes("password")
    ) {
      DOM.displayError(field, "Field cannot be empty");
      return false;
    }

    if (field.getAttribute("id") === "email") {
      const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (emailRegExp.test(String(field.value).toLowerCase()) === false) {
        DOM.displayError(field, "Invalid email");
        return false;
      }
    } else if (field.getAttribute("id") === "zip-code") {
      field.value = sanitizeNumberInput(field.value);
      if (field.value.length !== 5) {
        DOM.displayError(
          field,
          `Please enter a 5 digit zip code. You've entered ${field.value.length} digits`
        );
        return false;
      }
    } else if (field.getAttribute("id") === "password") {
      const passwordRegExp = /^(?=.*\d).{8,}$/;

      validateField(document.getElementById("confirm-password"));

      if (passwordRegExp.test(String(field.value)) === false) {
        DOM.displayError(
          field,
          "Must be at least 8 characters long and have at least one digit"
        );
        return false;
      }
    } else if (field.getAttribute("id") === "confirm-password") {
      if (document.getElementById("password").value !== field.value) {
        DOM.displayError(field, "Passwords do not match");
        return false;
      }
    }
    return true;
  };

  formInputs.forEach(input => {
    input.addEventListener("input", () => validateField(input));
  });

  const submitFormButton = document.getElementById("submit-form");

  submitFormButton.addEventListener("click", e => {
    e.preventDefault();

    let numInputsValid = 0;
    const totalInputsToValidate = formInputs.length;

    formInputs.forEach(formInput => {
      if (validateField(formInput)) {
        numInputsValid++;
      }
    });

    if (numInputsValid === totalInputsToValidate) {
      console.log("Form successfully submitted");
    } else {
      console.log("Form not submitted - There are still errors");
    }
  });
})();
