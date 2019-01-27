function e(id) {
    return document.getElementById(id);
}

function c(className) {
    return document.getElementsByClassName(className)[0];
}

function setParamFromURL(paramName) {
    if (getURLparam(paramName)) {
        e("ggw").setAttribute("data-param-" + paramName, getURLparam(paramName));
    }
}

function perspective(id, name) {
    if (e("ggw")) {
        e("ggw").className = "geogebraweb";
        e("ggw").setAttribute("data-param-appname", window.appID || "classic");
        e("ggw").setAttribute("data-param-marginTop", marginTop);
        if (id) {
            if ((id + "").substring(0, 4) === "exam") {
                e("ggw").setAttribute("data-param-enableGraphing", "true");
            }
            if (id === "exam-simple") {
                e("ggw").setAttribute("data-param-enableGraphing", "false");
                e("ggw").setAttribute("data-param-enableCAS", "false");
                e("ggw").setAttribute("data-param-enable3D", "false");
            }
            if (id === "exam-graphing") {
                e("ggw").setAttribute("data-param-enableCAS", "false");
                e("ggw").setAttribute("data-param-enable3D", "false");
            }
            if (id === "exam-cas") {
                e("ggw").setAttribute("data-param-enableCAS", "true");
                e("ggw").setAttribute("data-param-enable3D", "false");
            }
            if (!window.appID || window.appID === "classic") {
                e("ggw").setAttribute("data-param-perspective", id);
            }
        }
        setParamFromURL("filename");
        setParamFromURL("rounding");
        if (location.pathname.match(/lti/)) {
            e("ggw").setAttribute("data-param-showAppsPicker", "false");
            e("appsPicker") && e("appsPicker").style.setProperty("display", "none");
            c("GeoGebraHeader") && c("GeoGebraHeader").remove();
            e("ggw").setAttribute("data-param-marginTop", 0);
        }
        if (window.ggbRerun) {
            ggbRerun();
        }
    } else {
        if (id) {
            ggbApplet.setPerspective(id + "");
        }
    }
    let label = e(name);
    if (label) {
        parentTable(label).className += " perspectiveHighlighted";
    }
    if (name && window.history && window.history.pushState && name !== "picker" && location.host.indexOf("geogebra") >= 0 &&
        location.href.indexOf("?") < 0 && !location.pathname.match(/\/.*\/.+/) && !isLocalhost()) {
        let unbundled = name === "graphing" || name === "geometry" || name === "whiteboard" || name === "notes" || name === "3d" || name === "cas" || name === "scientific";
        if (name !== "classic" && (location.pathname.indexOf("classic") > 0 || !unbundled)) {
            name = "classic#" + name;
        }
        history.pushState({}, "GeoGebra", "/" + name);
    }
    return false;
}

function getURLparam(param) {
    let parts = location.href.split("?");
    if (parts.length < 2) {
        return null;
    }
    let params = parts[1].split("&");
    for (let i = 0; i < params.length; i++) {
        if (params[i].indexOf(param + "=") === 0) {
            return params[i].substring(param.length + 1);
        }
    }
    return null;
}

function insertScript() {
    let app = document.createElement("script");
    app.setAttribute("src", codebase + module + "/js/webfont.js");
    document.head.appendChild(app);
    app = document.createElement("script");
    app.setAttribute("src", codebase + module + "/" + module + ".nocache.js");
    window.setTimeout(function () {
        document.head.appendChild(app);
    }, startDelay);
}

function installWorker() {
    window.GGBT_offlineRequestHandler = (function () {
        "use strict";

        function isServiceWorkerSupported() {
            return 'serviceWorker' in navigator && location.protocol === "https:";
        }

        function registerServiceWorker() {
            if (navigator.serviceWorker.controller) {
                console.log("service worker already controlling the page");
            } else {
                navigator.serviceWorker.register('/sworker.js', {
                    scope: '/'
                });
            }
        }

        function initServiceWorker() {
            if (isServiceWorkerSupported()) {
                registerServiceWorker();
            } else {
                console.log("service workers not supported");
            }
        }

        return {
            initServiceWorker: initServiceWorker,
        };
    })();
    window.GGBT_offlineRequestHandler.initServiceWorker();
}

function checkLogin() {
    installWorker();
    let wait = false;
    wait || insertScript();
    perspective(false, "C");
}