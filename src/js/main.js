import {Document} from './classes/Document';
import {Folder} from './classes/Folder';

let myFirstDocument = new Document("lolo", "Florent", "Leseur", 1411460479000, 14007, "image/png");
let mySecondDocument = new Document("Florent", "Florent", "Leseur", 1411460479000, 14008, "image/png");
let myThirdDocument = new Document("Rover", "Florent", "Leseur", 1411460479000, 14009, "image/png");

let myFirstFolder = new Folder("folder", "Florent", "Leseur", 12, [myFirstDocument, mySecondDocument, myThirdDocument]);

let set = new Array();
myFirstFolder.documents.forEach(function (doc) {
    set.push(doc);
})

var d1 = document.getElementById('main');
var html = '<ul>';
set.forEach(function (elem) {
    html += '<li>' + elem.logicalName + '</li>';
});
html += '</ul>';
d1.insertAdjacentHTML('beforeend', html);
