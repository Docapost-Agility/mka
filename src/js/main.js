import {DocumentMenu} from "./classes/DocumentMenu";
import {FolderMenu} from "./classes/FolderMenu";

let documentMenuList = [];
let folderMenuList = [];

documentMenuList.push(new DocumentMenu("Test", test() ,function(){return true;}));
documentMenuList.push(new DocumentMenu("Test 1", test() ,function(){return true;}));
documentMenuList.push(new DocumentMenu("Test 2", test() ,function(){return true;}));

folderMenuList.push(new FolderMenu("Test Folder", test() ,function(){return true;}));

var CLIPBOARD = "";

function test(){
    console.log("TEST");
}


$(function () {
    let $folder = $("#folder");
    let $document = $("#document");

    // $document.selectable();

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
        select: function(event, ui) {},
        beforeOpen: function(event, ui) {}
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