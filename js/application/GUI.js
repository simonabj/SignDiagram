/*
 * Defines functions, event listeners and other properties of the GUI elements.
 */

let bWritingFunction = false;

// Event listener(s) for limit control
g("functionMaxLimit").addEventListener("focusin", () => {
    bWritingFunction = true;
});
g("functionMaxLimit").addEventListener("focusout", () => {
    bWritingFunction = false;
});

g("functionMinLimit").addEventListener("focusin", () => {
    bWritingFunction = true;
});
g("functionMinLimit").addEventListener("focusout", () => {
    bWritingFunction = false;
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

$("#useMinBound").attr('checked', !$("#functionMinLimit")[0].disabled).click(function () {
    $("#functionMinLimit").attr('disabled', !this.checked);
    $("#includeMinLimit").attr('disabled', !this.checked);
}).click();

$("#useMaxBound").attr('checked', !$("#functionMaxLimit")[0].disabled).click(function () {
    $("#functionMaxLimit").attr('disabled', !this.checked);
    $("#includeMaxLimit").attr('disabled', !this.checked);
}).click();

$("#useMinBoundAdv").attr('checked', !$("#functionMinLimitAdv")[0].disabled).click(function () {
    $("#functionMinLimitAdv").attr('disabled', !this.checked);
    $("#includeMinLimitAdv").attr('disabled', !this.checked);
}).click();

$("#useMaxBoundAdv").attr('checked', !$("#functionMaxLimitAdv")[0].disabled).click(function () {
    $("#functionMaxLimitAdv").attr('disabled', !this.checked);
    $("#includeMaxLimitAdv").attr('disabled', !this.checked);
}).click();

// Global window listeners

// Global keydown
window.addEventListener("keydown", (event) => {

    if (bWritingFunction) { // Key is pressed in functionInput
        let input = g("functionInput");

        // Here we can add effects to the input

        // Auto-close braces
        if (event.which === 57) { // The '('-key
            //TODO: Complete auto-bracing
        }
        // Enter key calls add function
        if (event.which === 13) {
            addFunction();
        }
    }
});
