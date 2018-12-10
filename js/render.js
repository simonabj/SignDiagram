function render() {
    let canvas = g("diagram-canvas");

    // G is the graphics of the HTML5 Canvas 2D render engine
    let G = canvas.getContext("2d");

    // Width and height of canvas.
    let width = canvas.width;
    let height = canvas.height;


    //let x_offset = 3;
    let longest_name = 0;
    let cFunctions = functions.length;

    /// Rendering starts here! ///

    // Save state of graphics and clear it
    G.save();
    G.clearRect(0, 0, width, height);


    let cRoots = 0; // Amount of roots in functions. Duplicates count as one
    let root_values = []; // The numeric value of each root
    let roots = []; // The label of each root

    let x_values = []; // All x-values to be rendered
    let x_real = []; // All real values of x_values

    // Reset the longest name
    longest_name = 0;

    // Iterate over each function
    functions.forEach(el => {

        // Measure the functions name in pixels
        let name_width = G.measureText(el.name).width;

        // Set the longest_name value to the name_width if name_width is greater
        if (name_width > longest_name) longest_name = name_width;

        // Iterate over each of the functions roots
        el.roots.forEach(root => {
            // Check if root value is NaN
            // Set it to 0 by default
            if (isNaN(root.value)) {
                root.value = 0;
                root.label = "0";
            }

            x_real = x_values.map(e => e.value);

            // If the root value is not registered
            if (!x_real.includes(root.value)) {

                // Add the root properties to the dedicated arrays
                console.log("The root " + root.value + " is not registered!");
                cRoots++;
                root_values.push(root.value);
                roots.push(root);

                x_values.push(root); // Root has structure {label-String, value-Number}
            }
        });


        if (
            (el.limit[0] === 1 || el.limit[0] === 3) && // 1 or 3
            !x_real.includes(el.limit[1].value)    // Unique value

        ) { // Only min or both
            x_values.push(el.limit[1]);
        }

        if (
            (el.limit[0] === 2 || el.limit[0] === 3) && // 2 or 3
            !x_real.includes(el.limit[2].value)    // Unique value

        ) { // Only max or both
            x_values.push(el.limit[2]);
        }
    });

    // Sort the roots by their value in ascending order
    roots.sort((a, b) => (a.value - b.value));

    x_values.sort((a, b) => (a.value - b.value));

    console.log(roots);
    console.log(x_values);

    // Increase the length of the longest name for smooth lines
    longest_name *= 1.7;

    // Number of x_values to display
    let cValues = x_values.length;

    // Struct [{label-String, pos-Number}]
    let x_value_pos = []; // Array to store x-locations
    let x_labels = x_values.map(e => e.label);


    // Min x-value for vertical lines (Root values)
    let start = longest_name + Math.floor(20);
    // Max x-value for vertical lines (Root values)
    let stop = width - 10;

    // Set the spacing equal to the number of roots minus 1, if there are more than 2
    // else set the spacing equal to the distance between the start and stop divided by 2
    let spacing = (stop - start) / (cValues + 1);

    console.log("Start: " + start);
    console.log("Stop: " + stop);
    console.log("Spacing: " + spacing);


    /// DRAWING STARTS HERE ///

    G.beginPath();
    G.strokeStyle = "black";
    G.font = "16px Cambria";
    G.fillStyle = "black";
    G.textAlign = "center";

    // Iterate over each root
    for (let i = 0; i < cValues; i++) {
        // Set the x-position of the root render
        let x = start + (i + 1) * spacing;

        // Move to the specified x-location and draw a line from y=20 to y=height
        G.moveTo(x, 20);
        G.lineTo(x, height);

        // Write the value-label, centered over the line
        G.fillText(x_labels[i], x, 14);
        x_value_pos.push({label: x_values[i].label, value: x});
    }

    // Draw the x-axis with x-label
    G.moveTo(25, 25);
    G.lineTo(width, 25);
    G.textAlign = "left";

    // TODO: Make the axis label user-customizable
    G.fillText("x", 2, 28);

    // Render the commands given onto the canvas, finishing the beginPath();
    G.stroke();


    //// Here starts the function-signs rendering ////

    // Define som start, stop and spacing values for the positions of the functions
    let yStart = 30;
    let yStop = height - 0;
    let ySpace = (yStop - yStart) / (cFunctions + 1);

    // Measure the size of a 0
    let w0 = G.measureText("0").width;
    let h0 = parseInt("16px Cambria", 10);


    // Iterate over each function defined.
    functions.forEach((f, i) => {

        let collapseLowerLimit = false;
        let collapseUpperLimit = false;

        // Define the y-position of the function
        let y = yStart + (i + 1) * ySpace;

        // YT is the y-positions translation value,
        // used to offset in the y direction
        let yt = h0 / 4;

        // Start drawing the function
        G.beginPath();

        // Align left and draw the function name
        G.textAlign = "left";
        G.fillText(f.name, 2, y + yt);
        G.textAlign = "center";

        // If lower limit is not used, start at function name.

        if (f.limit[0] === 1 || f.limit[0] === 3) {
            G.moveTo(x_value_pos[x_labels.indexOf(f.limit[1].label)].value + 3, y);
        } else {
            // Move drawing point to start of function
            G.moveTo(G.measureText(f.name).width + 4, y);
        }

        // Loop through the roots of the function
        f.roots.forEach((root, j) => {

            // The root's x-position is the (location of the root in the array)*spacing
            let index = x_values.map(e => {
                return e.label;
            }).indexOf(root.label);

            let rootX = start + (index + 1) * spacing;

            console.log("The root's position in x_values is: " + x_values.map(e => {
                return e.label;
            }).indexOf(root.label));
            console.log("RootX is: " + rootX);


            // Check if root is negative
            if (f.signs[j] === -1) {
                // Make dashed lines if sign is negative
                G.setLineDash([5, 3]);
            } else {
                // Make solid lines if sign is positive
                G.setLineDash([1, 0]);
            }
            // Make a line from previous point to the next root
            console.log("We draw a root!");
            G.lineTo(rootX, y);
            G.stroke();

            // Start drawing from the next root
            G.beginPath();
            G.moveTo(rootX, y);
        });

        // Since the |signs| is |roots| + 1, we need to check the last sign
        // outside of a loop ...
        if (f.signs[f.signs.length - 1] === -1) G.setLineDash([5, 3]);
        else G.setLineDash([1, 0]);

        // ... and draw it to end of interval.
        if (f.limit[0] === 2 || f.limit[0] === 3) {
            // Draw to limit
            let tx = x_value_pos[x_labels.indexOf(f.limit[2].label)].value;
            G.lineTo(tx - 3, y);

        } else {
            G.lineTo(width, y);
        }
        G.stroke();


        // Loop through the roots again to draw the '0's
        f.roots.forEach(root => {
            // Same function to calculate root center as last time
            let index = x_values.map(e => {
                return e.label;
            }).indexOf(root.label);
            let rootX = start + (index + 1) * spacing;

            G.clearRect(rootX - w0 / 2, y - h0 / 2, w0, h0);
            G.fillText("0", rootX, y + yt);

            if(root.value === f.limit[1].value) collapseLowerLimit = true;
            if(root.value === f.limit[2].value) collapseUpperLimit = true;
        });


        // Draw lower limit
        if (f.limit[0] === 1 || f.limit[0] === 3) {
            G.textAlign = "left";
            G.fillText(f.limit[3] ? "[" : "〈"
                , x_value_pos[x_labels.indexOf(f.limit[1].label)].value +
                    (collapseLowerLimit ? 3:0)
                , y + yt);
            G.textAlign = "center";
        }

        // Draw upper limit
        if (f.limit[0] === 2 || f.limit[0] === 3) {
            // Draw the limit
            let tx = x_value_pos[x_labels.indexOf(f.limit[2].label)].value -
                    (collapseUpperLimit ? 3:0);
            G.textAlign = "right";
            G.fillText(f.limit[4] ? "]" : "〉",
                tx, y + yt
            );
            G.textAlign = "center";
        }
    });

    // When done drawing each function, restore the graphics state
    G.restore();
}