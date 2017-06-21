import {Document} from "./classes/Document";
import {Folder} from "./classes/Folder";

let myFirstDocument = new Document("lolo", "Florent", "Leseur", 1411460479000, 14007, "image/png");
let mySecondDocument = new Document("Florent", "Florent", "Leseur", 1411460479000, 14008, "image/png");
let myThirdDocument = new Document("Rover", "Florent", "Leseur", 1411460479000, 14009, "image/png");

let myFirstFolder = new Folder("folder", "Florent", "Leseur", 12, [myFirstDocument, mySecondDocument, myThirdDocument]);


$(function () {
    let $folder = $("#folder");
    let $document = $("#document");
    let selected = $([]), offset = {top: 0, left: 0};

    // $document.selectable();

    // Les documents peuvent être "DRAG"
    $("li", $document).draggable({
        revert: "invalid",
        cursor: "move"
    });

    // On peut "DROP" dans les dossiers
    $("li", $folder).droppable({
        accept: "#document > li",
        drop: function (event, ui) {
            ui.draggable.fadeOut();
        }
    });

    $document.droppable({
        accept: "#folder li",
        drop(event, ui) {
            console.log(ui);
        }
    });
});