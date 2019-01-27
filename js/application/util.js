let lastWidth = 0;
let lastHeight = 0;

function g(id) {
    return document.getElementById(id);
}

function drawSizedImage() {
    let newModal = document.createElement("div");
    newModal.setAttribute("class","modal-content");

    let modalContent = document.createElement("div");

    let inputWidth = document.createElement("input");
    inputWidth.setAttribute("type","number");
    inputWidth.setAttribute("min",""+50);
    inputWidth.setAttribute("max",""+1920);
    inputWidth.setAttribute("value",""+(lastWidth === 0 ? 150 : lastWidth));
    inputWidth.setAttribute("id","inputWidth");

    let inputHeight = document.createElement("input");
    inputHeight.setAttribute("type","number");
    inputHeight.setAttribute("min",""+50);
    inputHeight.setAttribute("max",""+1080);
    inputHeight.setAttribute("value",""+(lastHeight === 0 ? 100 : lastHeight));
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
    };

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