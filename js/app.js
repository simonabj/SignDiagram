var CASActive = false;
var ggbActive = false;
var modal;


/*
 * Struct:
 *     - name   : String
 *     - equ    : String
 *     - roots  : [{label - String, value - Number}]
 *     - signs  : Number[] // |roots|+1
 */
var functions = [];

var template = '<div class="media-object stack-for-small"><div class="media-object-section"><h5 id="#{id}">$$#{equ}#{interval}$$</h5></div></div>';

function g(id) {
    return document.getElementById(id);
}

function startCAS() {
    if(ggbActive) {
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
    if(typeof ggbApplet === 'undefined') {
        setTimeout(confirmGBB, 500);
    } else {
        ggbActive = true;
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
    canvas.setAttribute("id","diagram-canvas");
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
    //g("functionDisplay").innerHTML = d + ", x ∈ " +
    //    (ll ? "[" : "(") + lb + "," + ub + (ul ? "]" : ")") + ".";
    lb.replace("e", "ℯ");
    ub.replace("e", "ℯ");
    d.replace("e", "ℯ");

    let interval = (useLower && !useUpper) ? "[#,⭢〉" : (!useLower && useUpper) ? "〈⭠,¤]" : "[#,¤]";
    interval = interval.replace("#",ggbApplet.evalCommandCAS("Simplify("+lb+")"));
    interval = interval.replace("¤",ggbApplet.evalCommandCAS("Simplify(" + ub + ")"));
    if(!ll) interval = interval.replace("[", "〈");
    if(!ul) interval = interval.replace("]", "〉");

    // Simplify the expression provided
    d = ggbApplet.evalCommandCAS("Simplify("+d+")");

    let new_interval = ", x∈" + interval;
    if(!useLower && !useUpper) new_interval="";
    new_interval = new_interval.replace("sqrt", "√");
    let template_text = template.replace("#{equ}", d/*.replace("/","\\frac")*/).replace("#{interval}", new_interval).replace("#{id}","function"+functions.length);

    if(d.includes("=")){
        fName = d.split("=")[0];

        // Fetch right-side of function
        d = d.split("=")[1];
    } else {
        // There is no = sign, which means it's just an expression entered.
        fName = d;
    }

    let cmdLimit = lb+(ll?"<=":"<")+"x"+(ul?"<=":"<")+ub;
    let casCommand = "Solve("+d+"=0,"+cmdLimit+")";
    let realRoots         = ggbApplet.evalCommandCAS(casCommand);
    let cRoots = parseInt(ggbApplet.evalCommandCAS("Length(" + realRoots + ")"));

    let signs = [];
    let roots = [];


    for(let i = 0; i <= cRoots; i++) {
        let test_value = "";
        let command = "Substitute(" + d + ", x, #)";

        // Get the value between roots
        if(i === 0) {
            // Check start
            command = command.replace("#", ggbApplet.evalCommandCAS("RightSide("+ realRoots +",1)") +"-1");

        } else if (i === cRoots) {
            // Last Root
            command = command.replace("#", ggbApplet.evalCommandCAS("RightSide(" + realRoots + "," + cRoots + ")") + "+1");
        } else {
            // Some interval in the middle
            command = command.replace("#", ggbApplet.evalCommandCAS(
                "(RightSide(" + realRoots + "," + (i) + ") + RightSide(" + realRoots + "," + (i+1) + "))/2"
            )); // Gets the x-value of the point in between 2 roots.
        }

        // Get the normalized value of the value( ||test_value|| )
        test_value = ggbApplet.evalCommandCAS(command + "/abs("+ command +")");

        // The value should be very close(1e-15) to -1 or 1, so we round to get exact
        signs.push(Math.round(Number(test_value)));

        let root = {};
        // Get the numeric value of the roots
        if(i < cRoots) {
            root["value"] = Number(ggbApplet.evalCommandCAS("Numeric(RightSide(" + realRoots + "," + (i + 1) + "))"));

            let rootLabel = ggbApplet.evalCommandCAS("RightSide(" + realRoots + "," + (i+1) + ")");
            rootLabel = rootLabel.replace("sqrt","√").replace("(","").replace(")","");
            root["label"] = rootLabel;

            //console.log("Adding " + root.label + " to roots");
            roots.push(root);
        }
    }
    // At this point, all required data is evaluated and calculated.
    // We just have to push this to the functions array

    let function_dec = {
        "name"  : fName,
        "equ"   : d,
        "roots" : roots,
        "signs" : signs
    };
    functions.push(function_dec);

    let newDom = document.createElement("div");
    newDom.innerHTML = template_text;
    g("panel1").appendChild(newDom);
    MathJax.Hub.Queue(["Typeset",MathJax.Hub, newDom]);

    g("diagram-canvas").style.border = "none";
    render();
}