var CASActive = false;
var ggbActive = false;
var modal;


/*
 * Struct:
 *     - name   : String
 *     - equ    : String
 *     - roots  : [{label - String, value - Number}]
 *     - signs  : Number[] // roots.length+1
 *     - limit  : Number[] // [interval, min, max, iMin, iMax]
 */
var functions = [];


// Used to inject LaTeX-formatted functions into the list
var template = '<div class="media-object stack-for-small"><div class="media-object-section"><h5 id="#{id}">$$#{equ}#{interval}$$</h5></div></div>';

function g(id) {
    return document.getElementById(id);
}

// Attempts to start CAS
function startCAS() {
    if (ggbActive) {
        let test = ggbApplet.evalCommandCAS("5+5");
        if (test === "?") {
            setTimeout(startCAS, 4000);
        } else {
            console.log("CAS Started!");
            CASActive = true;

            console.log("Initialization Phase...");
            init();
        }
    } else {
        setTimeout(startCAS, 500);
    }
}

function confirmGBB() {
    g("modal-text").innerHTML = "Starting Applet";
    if (typeof ggbApplet === 'undefined') {
        setTimeout(confirmGBB, 500);
    } else {
        ggbActive = true;
        g("modal-text").innerHTML = "Starting CAS";
        console.log("ggbApplet is active!");
    }
}

function preInit() {
    modal = document.getElementById('appModal');
    modal.style.display = "block";

    console.log("Waiting for ggbApplet");
    confirmGBB();

    console.log("Starting CAS!");
    setTimeout(startCAS, 4000);
}


function init() { // Both CAS and ggbApplet exists

    console.log("Post Initialization Phase...");
    postInit();
}

function postInit() {
    let canvas = g("renderTarget");
    canvas.setAttribute("id", "diagram-canvas");
    canvas.style.border = "#2199e8 solid 2px";
    modal.style.display = "none";
}

function btnPress() {
    let d = g("functionInput").value;
    let lb = g("functionMinLimit").value;
    let ub = g("functionMaxLimit").value;
    let ll = g("includeMinLimit").checked;
    let ul = g("includeMaxLimit").checked;

    let useLower = g("useMinBound").checked;
    let useUpper = g("useMaxBound").checked;

    let fName = "";
    let isGeneric = false; // Assume this function do not contain generic expression roots
    //g("functionDisplay").innerHTML = d + ", x ∈ " +
    //    (ll ? "[" : "(") + lb + "," + ub + (ul ? "]" : ")") + ".";
    lb.replace("e", "ℯ");
    ub.replace("e", "ℯ");
    d.replace("e", "ℯ");

    // If there is no function declaration
    if(d.length < 1 || d.replace(" ", "").length < 1) d = "f(x)=x^2-1";

    let intervalType = 0; // 0 -> no interval, 1 -> only min, 2 only max, 3 both
    let new_interval = "";
    // If an interval is used, format it and display it correctly
    if (useLower || useUpper) {
        // Format the interval text based on user input
        let interval = (useLower && !useUpper) ? "[#,⭢〉" : (!useLower && useUpper) ? "〈⭠,¤]" : "[#,¤]";

        intervalType = (useLower && !useUpper) ? 1 : (!useLower && useUpper) ? 2 : 3;

        // Populate the interval
        interval = interval.replace("#", ggbApplet.evalCommandCAS("Simplify(" + lb + ")"));
        interval = interval.replace("¤", ggbApplet.evalCommandCAS("Simplify(" + ub + ")"));
        if (!ll) interval = interval.replace("[", "〈");
        if (!ul) interval = interval.replace("]", "〉");

        // Simplify the expression provided
        d = ggbApplet.evalCommandCAS("Simplify(" + d + ")");

        // Add the element-of symbol and some
        new_interval = ", x∈" + interval;
        new_interval = new_interval.replace("sqrt", "√");
    }
    let template_text = template.replace("#{equ}", d/*.replace("/","\\frac")*/).replace("#{interval}", new_interval).replace("#{id}", "function" + functions.length);

    let fDec;

    if (d.includes("=")) {
        fName = d.split("=")[0];

        // Fetch right-side of function
        fDec = d.split("=")[1];
    } else {
        // There is no = sign, which means it's just an expression entered.
        fName = d;
        fDec = d;
    }


    // Create limit command
    let cmdLimit = "";
    if(intervalType === 3)
        cmdLimit = lb + (ll ? "<=" : "<") + "x" + (ul ? "<=" : "<") + ub;
    else if(intervalType === 2)
        cmdLimit = "x"+ (ul ? "<=":"<") + ub;
    else if(intervalType === 1)
        cmdLimit = lb + (ll ? "<=" : "<") + "x";

    // Create CAS command
    let casCommand = "";
    if (intervalType === 0)
        casCommand = "Solve(" + fDec + "=0" + ")";
    else
        casCommand = "Solve(" + fDec + "=0," + cmdLimit + ")";

    console.log("The limit command is: " + cmdLimit);
    console.log("The CAS command is: " + casCommand);

    // Execute CAS command
    let realRoots = ggbApplet.evalCommandCAS(casCommand);
    console.log(realRoots);
    let cRoots = parseInt(ggbApplet.evalCommandCAS("Length(" + realRoots + ")"));

    let signs = [];
    let roots = [];


    for (let i = 0; i <= cRoots; i++) {
        let test_value = "";
        let command = "Substitute(" + fDec + ", x, #)";

        // Get the value between roots
        if (i === 0) {
            // Check start
            command = command.replace("#", ggbApplet.evalCommandCAS("RightSide(" + realRoots + ",1)") + "-1");

        } else if (i === cRoots) {
            // Last Root
            command = command.replace("#", ggbApplet.evalCommandCAS("RightSide(" + realRoots + "," + cRoots + ")") + "+1");
        } else {
            // Some interval in the middle
            command = command.replace("#", ggbApplet.evalCommandCAS(
                "(RightSide(" + realRoots + "," + (i) + ") + RightSide(" + realRoots + "," + (i + 1) + "))/2"
            )); // Gets the x-value of the point in between 2 roots.
        }

        // Get the normalized value of the value( ||test_value|| )
        test_value = ggbApplet.evalCommandCAS(command + "/abs(" + command + ")");

        // The value should be very close(1e-15) to -1 or 1, so we round to get exact
        signs.push(Math.round(Number(test_value)));

        let root = {};
        // Get the numeric value of the roots
        if (i < cRoots) {
            // We replace the k in case of generic root values from trigonometric functions
            root["value"] = Number(ggbApplet.evalCommandCAS("Numeric(RightSide(" + realRoots + "," + (i + 1) + "))"));

            let rootLabel = ggbApplet.evalCommandCAS("Simplify(RightSide(" + realRoots + "," + (i + 1) + "))");
            rootLabel = rootLabel.replace("sqrt", "√").replace("(", "").replace(")", "");
            root["label"] = rootLabel;

            //console.log("Adding " + root.label + " to roots");
            roots.push(root);
        }
    }

    // At this point, all required data is evaluated and calculated.
    // We just have to push this to the functions array
    if(!realRoots.includes("k")) {
        let function_dec = {
            "name": fName,
            "equ": fDec,
            "roots": roots,
            "signs": signs,
            "limit": [intervalType, lb, ub, ll, ul]
        };
        functions.push(function_dec);

        // Create a new div for the function render.
        let newDom = document.createElement("div");
        newDom.innerHTML = template_text;

        // Add the function to panel1
        g("panel1").appendChild(newDom);

        // Add the div to the MathJax queue for rendering
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, newDom]);

        // Remove border and render the functions
        g("diagram-canvas").style.border = "none";
        render();
    } else {
        alert(
            "Generic roots created by harmonic functions are not yet supported." +
            " To use harmonic functions, please use both the lower and upper bounds."
        );
    }
}