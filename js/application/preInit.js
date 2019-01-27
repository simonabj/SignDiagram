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
    document.querySelectorAll(".versionDisplay").forEach(elem =>elem.innerText = Properties.version);

    modal = document.getElementById('appModal');
    modal.style.display = "block";

    $(document).foundation();

    checkLogin();

    console.log("Waiting for ggbApplet");

    confirmGBB();

    console.log("Starting CAS!");
    setTimeout(startCAS, 4000);
}