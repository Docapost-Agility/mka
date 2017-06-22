import { Document } from './classes/Document';

let documentMenuList = [];
let folderMenuList = [];

let doc = new Document("Document name", "Florent", "Leseur", "14/02/2010", 12, 'application/pdf');

documentMenuList.push({title:"Ajouter", cmd:'test', disabled: false});
documentMenuList.push({title:"Modifier", cmd: 'test1', disabled: false});
documentMenuList.push({title: "----"});
documentMenuList.push({title:"Supprimer", cmd: 'test2', disabled: false});


function addDocument(){
    console.log("Ajout");
}
function editDocument(){
    console.log("Edition");
}
function deleteDocument(){
    console.log("Suppression");
}

function getAction(cmd){
    switch (cmd) {
        case "test":
            addDocument();
            break;
        case "test1":
            editDocument();
            break;
        case "test2":
            deleteDocument();
            break;
        default:
            console.log("default");
    }
}

$(function () {
    let $folder = $("#folder");
    let $document = $("#document");

    $("li", $document).data(doc);

    // Les documents peuvent être "DRAG"
    $("li", $document).draggable({
        revert: "invalid",
        cursor: "move"
    });

    $document.contextmenu({
        delegate: ".o-document",
        autoFocus: true,
        preventContextMenuForPopup: true,
        preventSelect: true,
        taphold: true,
        menu: documentMenuList,
        select: function(event, ui) {
           getAction(ui.cmd);
        },
        beforeOpen: function(event, ui) {}
    });

    // On peut "DROP" dans les dossiers
    $("li", $folder).droppable({
        accept: "#document > li",
        drop: function (event, ui) {
            console.log(event);
            console.log(ui);
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