function deleteElementById(id) {
    g(id).parentNode.removeChild(g(id));
}

function addDeleteOnPress(dom, id) {
    dom.addEventListener("click", e=>{
        deleteElementById(id);
    });
}