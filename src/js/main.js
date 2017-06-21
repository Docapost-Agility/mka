// principal elt
let mka = document.getElementById("mka");

if (!mka) throw new Error('mka id not found');

let zone = {
    downX: null,
    downY: null,
    upX: null,
    upY: null,
};

let selectItem = () => {
    // we order coordinate to simplify
    zone.x1 = zone.downX;
    zone.x2 = zone.upX;
    zone.y1 = zone.downY;
    zone.y2 = zone.upY;
    if (zone.downX > zone.upX) {
        zone.x1 = zone.upX;
        zone.x2 = zone.downX;
    }

    if (zone.downY > zone.upY) {
        zone.y1 = zone.upY;
        zone.y2 = zone.downY;
    }

    let mkaElts = document.getElementsByClassName("mka-elt");

    let selectedItems = [];

    Array.from(mkaElts).map(elt => {
        let rect = elt.getBoundingClientRect();
        let zoneElt = {
            x1: rect.left,
            x2: (rect.left + rect.width),
            y1: rect.top,
            y2: (rect.top + rect.height)
        }

        if (zone.x2 >= zoneElt.x1 && zoneElt.x2 >= zone.x1 && zone.y2 >= zoneElt.y1 && zoneElt.y2 >= zone.y1) {
            elt.classList.add("mka-elt-selected");
            selectedItems.push(elt);
        }
    });

    document.getElementById("mka-count").innerHTML = selectedItems.length;

};

mka.onmousedown = (event) => {

    let mkaElts = document.getElementsByClassName("mka-elt");
    Array.from(mkaElts).map(elt => { elt.classList.remove("mka-elt-selected") });

    zone.downX = event.pageX;
    zone.downY = event.pageY;

    // we add div
    let node = document.createElement("div");
    node.id = "j";
    node.style.position = "absolute";
    node.style.top = zone.downY + "px";
    node.style.left = zone.downX + "px";
    node.style.backgroundColor = "red";

    mka.appendChild(node);

    document.body.onmousemove = (event) => {
        zone.upX = event.pageX;
        zone.upY = event.pageY;
        node.style.width = (zone.upX - zone.downX) + "px";
        node.style.height = (zone.upY - zone.downY) + "px";
        selectItem();
    };
};

window.onmouseup = () => {
    document.body.onmousemove = () => { };
}


