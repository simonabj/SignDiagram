/*
 * Defines functions, event listeners and other properties of the GUI elements.
 */

let bWritingFunction = false;

// Event listener for Lower Limit control
g("useMinBound").addEventListener("change", (event) => {
    console.log(!event.target.checked ? "Disabled" : "Enabled");
    if (!event.target.checked) {
        g("functionMinLimit").setAttribute("disabled", "disabled");
        g("functionMinLimit").setAttribute("placeholder", " --- ");
        g("includeMinLimit").setAttribute("disabled", "disabled");
    } else {
        g("functionMinLimit").setAttribute("placeholder", "Lower bound");
        g("functionMinLimit").removeAttribute("disabled");
        g("includeMinLimit").removeAttribute("disabled");
    }
});

// Event listener for Upper Limit control
g("useMaxBound").addEventListener("change", (event) => {
    console.log(!event.target.checked ? "Disabled" : "Enabled");
    if (!event.target.checked) {
        g("functionMaxLimit").setAttribute("disabled", "disabled");
        g("functionMaxLimit").setAttribute("placeholder", " --- ");
        g("includeMaxLimit").setAttribute("disabled", "disabled");
    } else {
        g("functionMaxLimit").setAttribute("placeholder", "Lower bound");
        g("functionMaxLimit").removeAttribute("disabled");
        g("includeMaxLimit").removeAttribute("disabled");
    }
});

// Event listener(s) for Function Declaration input
g("functionInput").addEventListener("focusin", (event) => {
    event.target.placeholder = "";
    bWritingFunction = true;
});
g("functionInput").addEventListener("focusout", (event) => {
    event.target.placeholder = "f(x)=x^2-1";
    bWritingFunction = true;
});

// Global window listeners

// Global keydown
window.addEventListener("keydown", (event) => {

    if(bWritingFunction) { // Key is pressed in functionInput
        let input = g("functionInput");

        // Here we can add effects to the input

        // Auto-close braces
        if(event.which === 57) { // The '('-key
            //TODO: Complete auto-bracing
        }
    }
});

// Global load
window.addEventListener("load", e => {
    g("versionDisplay").innerText = Properties.version;
});
