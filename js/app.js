let CASActive = false;
let ggbActive = false;
let lastWidth = 0;
let lastHeight = 0;
let modal;


/*
 * Struct:
 *     - name   : String
 *     - equ    : String
 *     - roots  : [{label - String, value - Number}]
 *     - signs  : Number[] // roots.length+1
 *     - limit  : Number[] // [interval, min, max, iMin, iMax]
 */
let functions = [];
let currentId = 0;

// Used to inject LaTeX-formatted functions into the list
const template = '\\(#{equ}#{interval}\\)';

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

function fixCanvasWidth() {
    // Make canvas visually fill the positioned parent
    let canvas = g(Properties.primary_render_target);
    canvas.style.width ='90%';
    canvas.style.height='90%';
    // ...then set the internal size to match
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

function preInit() {
    g("versionDisplay").innerText = Properties.version;

    modal = document.getElementById('appModal');
    modal.style.display = "block";

    checkLogin();

    console.log("Waiting for ggbApplet");

    confirmGBB();

    console.log("Starting CAS!");
    setTimeout(startCAS, 4000);
}


function init() { // Both CAS and ggbApplet exists
    console.log("Post Initialization Phase...");

    fixCanvasWidth();

    postInit();
}

function postInit() {
    modal.style.display = "none";
    render(Properties.primary_render_target); // First time render
}

function drawSizedImage() {
    let newModal = document.createElement("div");
    newModal.setAttribute("class","modal-content");

    let modalContent = document.createElement("div");

    let inputWidth = document.createElement("input");
    inputWidth.setAttribute("type","number");
    inputWidth.setAttribute("min",50);
    inputWidth.setAttribute("max",1920);
    inputWidth.setAttribute("value",lastWidth === 0 ? 150 : lastWidth);
    inputWidth.setAttribute("id","inputWidth");

    let inputHeight = document.createElement("input");
    inputHeight.setAttribute("type","number");
    inputHeight.setAttribute("min",50);
    inputHeight.setAttribute("max",1080);
    inputHeight.setAttribute("value",lastHeight === 0 ? 100 : lastHeight);
    inputHeight.setAttribute("id", "inputHeight");

    let labelWidth = document.createElement("label");
    labelWidth.setAttribute("for","inputWidth");
    labelWidth.innerHTML = "Image Width: ";

    let labelHeight = document.createElement("label");
    labelHeight.setAttribute("for", "inputHeight");
    labelHeight.innerHTML = "Image Height: ";

    let createButton = document.createElement("a");
    createButton.innerHTML = "Render Image";
    createButton.setAttribute("class","button medium");

    let cancelButton = document.createElement("span");
    cancelButton.setAttribute("class", "cancel");
    cancelButton.innerHTML = "×";
    cancelButton.style.color = "#aaa";
    cancelButton.style.fontSize = "28px";
    cancelButton.style.fontWeight = "bold";


    cancelButton.onclick = function () {
        modal.style.display = "none";
    }

    modalContent.appendChild(cancelButton);
    modalContent.appendChild(labelWidth);
    modalContent.appendChild(inputWidth);
    modalContent.appendChild(labelHeight);
    modalContent.appendChild(inputHeight);
    modalContent.appendChild(createButton);

    modalContent.style.display = "flex";
    modalContent.style.flexDirection = "column";
    modalContent.style.width = "400px";
    modalContent.style.justifyContent = "center";

    newModal.appendChild(modalContent);


    modal.removeChild(document.querySelector("#appModal > div"));
    modal.appendChild(newModal);
    modal.style.display = "block";


    createButton.onclick = function() {

        let newRenderTarget = document.createElement("canvas");
        newRenderTarget.setAttribute("id", "outputCanvas");

        newRenderTarget.width  = g("inputWidth").value;
        newRenderTarget.height = g("inputHeight").value;

        lastWidth  = g("inputWidth").value;
        lastHeight = g("inputHeight").value;

        modal.removeChild(document.querySelector("#appModal > div"));

        let newModal = document.createElement("div");
        newModal.setAttribute("class","modal-content");

        let content = document.createElement("div");

        content.style.display = "flex";
        content.style.justifyContent = "center";
        content.style.alignContent = "center";
        content.style.height = "auto";

        newModal.style.display = "block";
        newModal.style.padding = "0px";

        newModal.appendChild(newRenderTarget);
        content.appendChild(newModal);
        modal.appendChild(content);

        render("outputCanvas");
        alert("Right-click to save image, or left-click anywhere to return");
        setTimeout(function() {
            modal.onclick = function() {
                modal.style.display = "none";
                modal.onclick = "";
            };
        }, 2000);

    }

}

function addFunction() {
    let d = g("functionInput").value;
    let lb = g("functionMinLimit").value;
    let ub = g("functionMaxLimit").value;
    let ll = g("includeMinLimit").checked;
    let ul = g("includeMaxLimit").checked;

    let useLower = g("useMinBound").checked;
    let useUpper = g("useMaxBound").checked;

    let fName = "";
    lb.replace("e", "ℯ");
    ub.replace("e", "ℯ");
    d.replace("e", "ℯ");

    // If there is no function declaration
    if (d.length < 1 || d.replace(" ", "").length < 1) d = "f(x)=x^2-1";

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
    console.log(functions.length);
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
    if (intervalType === 3)
        cmdLimit = lb + " <= " + "x" + " <= " + ub;
    else if (intervalType === 2)
        cmdLimit = "x" + " <= " + ub;
    else if (intervalType === 1)
        cmdLimit = lb + " <= " + "x";

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

    g("panel2").innerHTML += "<span>"+ fName + ": " + casCommand.replace("=0", "=0") + " ⇒ "+ realRoots + "</span><br/>";
    g("panel2").innerHTML += "<span>"+ fName + ": " + casCommand.replace("=0",">0")  + " ⇒ " + ggbApplet.evalCommandCAS(casCommand.replace("=0",">0")) + "</span><br/>";
    g("panel2").innerHTML += "<span>"+ fName + ": " + casCommand.replace("=0","<0")  + " ⇒ " + ggbApplet.evalCommandCAS(casCommand.replace("=0",">0")) + "</span><br/>";
    g("panel2").innerHTML += "<br/>";

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

    lb = ggbApplet.evalCommandCAS(lb);
    ub = ggbApplet.evalCommandCAS(ub);
    let lb_num = Number(ggbApplet.evalCommandCAS("Numeric(" + lb + ")"));
    let ub_num = Number(ggbApplet.evalCommandCAS("Numeric(" + ub + ")"));

    // At this point, all required data is evaluated and calculated.
    // We just have to push this to the functions array
    try {

        // Error handling and security

        if (realRoots.includes("k")) throw "Generic roots created by harmonic functions are not yet supported." +
        " To use harmonic functions, please use both the lower and upper bounds.";
        if(lb_num >= ub_num) throw "Lower bound cannot be greater than upper bound";
        if((intervalType === 1 || intervalType === 3) && !isFinite(lb_num)) throw "There is a problem with your lower bound.";
        if((intervalType === 2 || intervalType === 3) && !isFinite(ub_num)) throw "There is a problem with your upper bound.";


        let function_dec = {
            id: currentId,
            name: fName,
            equ: fDec,
            roots: roots,
            signs: signs,
            limit: [
                intervalType,
                {label: lb, value: lb_num},
                {label: ub, value: ub_num}
                , ll, ul
            ]
        };
        functions.push(function_dec);

        // Create a new div for the function render.
        let newDom = document.createElement("div");
        newDom.setAttribute("class", "media-object stack-for-small");
        newDom.setAttribute("deleteID", "" + currentId);

        let mediaSection = document.createElement("div");
        mediaSection.setAttribute("class", "media-object-section");

        let closeSpan = document.createElement("span");
        closeSpan.setAttribute("deleteID", "" + currentId);
        closeSpan.setAttribute("onclick",
            'let id = 0;\n' +
            '        functions.forEach(f => {\n' +
            '            if (f.id === Number(this.getAttribute("deleteID"))) {\n' +
            '                id = f.id;\n' +
            '                let node = document.querySelector("div[deleteID=\\"" + f.id + "\\"]");\n' +
            '                node.parentNode.removeChild(node);\n' +
            '            }\n' +
            '        });\n' +
            '        functions.splice(functions.map(e => e.id).indexOf(id),1);\n' +
            '        render();'
        );
        closeSpan.setAttribute("class", "deleteFunc");
        closeSpan.innerText = "×  ";

        let equationContainer = document.createElement("h5");
        equationContainer.setAttribute("id", "function" + currentId);
        equationContainer.appendChild(closeSpan);
        equationContainer.innerHTML += template_text;

        mediaSection.appendChild(equationContainer);


        newDom.appendChild(mediaSection);
        // Add the function to panel1
        g("panel1").appendChild(newDom);
        g("panel1").scrollTop = g("panel1").scrollHeight;

        // Switch to function tab
        $("#panel1-label").click();

        // Add the div to the MathJax queue for rendering
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, newDom]);

        currentId++;
        render(Properties.primary_render_target);
    } catch(exception) {
        alert(exception);
    }
}