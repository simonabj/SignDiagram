function fixCanvasWidth() {
    // Make canvas visually fill the positioned parent
    let canvas = g(Properties.primary_render_target);
    canvas.style.width ='90%';
    //canvas.style.height='90%';
    // ...then set the internal size to match
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}


function init() { // Both CAS and ggbApplet exists
    console.log("Post Initialization Phase...");

    fixCanvasWidth();

    postInit();
}