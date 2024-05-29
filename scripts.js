document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("jewelryForm");
    const steps = form.querySelectorAll(".form-step");
    const nextBtns = form.querySelectorAll(".next-btn");
    const prevBtns = form.querySelectorAll(".prev-btn");

    let currentStep = 0;
    const maxSteps = steps.length - 1;

    nextBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (validateStep(currentStep)) {
                goToStep(currentStep + 1);
            }
        });
    });

    prevBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            goToStep(currentStep - 1);
        });
    });

    function validateStep(step) {
        const inputs = steps[step].querySelectorAll("select, input[type='radio'], input[type='file']");
        let isValid = true;

        inputs.forEach((input) => {
            if (input.hasAttribute("required")) {
                if (input.type === "radio") {
                    const radioGroup = form.querySelector(`input[name='${input.name}']:checked`);
                    if (!radioGroup) {
                        isValid = false;
                        return;
                    }
                } else if (input.type === "file") {
                    // Check if a file has been selected
                    if (!input.files.length) {
                        isValid = false;
                        return;
                    }
                } else {
                    if (!input.value.trim()) {
                        isValid = false;
                        return;
                    }
                }
            }
        });

        return isValid;
    }

    function goToStep(step) {
        if (step >= 0 && step <= maxSteps) {
            steps[currentStep].classList.remove("active");
            steps[step].classList.add("active");
            currentStep = step;
        }

        if (currentStep === 0) {
            prevBtns.forEach((btn) => btn.style.display = "none");
        } else {
            prevBtns.forEach((btn) => btn.style.display = "inline-block");
        }

        if (currentStep === maxSteps) {
            nextBtns.forEach((btn) => btn.style.display = "none");
            form.addEventListener("submit", saveFormValues);
        } else {
            nextBtns.forEach((btn) => btn.style.display = "inline-block");
        }
    }

    function saveFormValues(event) {
        event.preventDefault();
        const formData = new FormData(form);
        const formValues = {};

        formData.forEach((value, key) => {
            formValues[key] = value;
        });

        localStorage.setItem("jewelryFormData", JSON.stringify(formValues));
        alert("Form submitted successfully!");
        form.reset();
        steps.forEach((step) => step.classList.remove("active"));
        currentStep = 0;
        goToStep(currentStep);

    }
    document.addEventListener("DOMContentLoaded", function() {
        const helpIcons = document.querySelectorAll(".help-icon");
    
        helpIcons.forEach((icon) => {
            icon.addEventListener("click", function() {
                const title = this.getAttribute('title');
                if (title) {
                    alert(title);
                }
            });
        });
    });


    function loadFormValues() {
        const savedData = localStorage.getItem("jewelryFormData");
        if (savedData) {
            const formValues = JSON.parse(savedData);
            for (let key in formValues) {
                const input = form.querySelector(`[name='${key}']`);
                if (input) {
                    if (input.type === "file") {
                        // Skip file inputs, as they cannot be pre-filled
                        continue;
                    } else if (input.type === "radio") {
                        const radioInput = form.querySelector(`[name='${key}'][value='${formValues[key]}']`);
                        if (radioInput) {
                            radioInput.checked = true;
                        }
                    } else {
                        input.value = formValues[key];
                    }
                }
            }
        }
    }

    loadFormValues();
    goToStep(currentStep);
});
