if(document.getElementById("menu") !==null){
    document.getElementById("menu").innerHTML ="<nav class=\"navbar navbar-default\">" +
                                                    "<div class=\"container-fluid\">" +
                                                        "<div class=\"navbar-header\">" +
                                                            "<a class=\"navbar-brand\" href=\"accueil.html\">Librairie</a>" +
                                                        "</div>" +
                                                        "<div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\">" +
                                                            "<ul class=\"nav navbar-nav\">" +
                                                                "<li><a href=\"select/select.html\">SELECT</a></li>" +
                                                                "<li><a href=\"selectAll/selectAll.html\">SELECT ALL</a></li>" +
                                                                "<li><a href=\"rightClick/rightClick.html\">RIGHT CLICK</a></li>" +
                                                                "<li><a href=\"copyPaste/copyPaste.html\">COPY PASTE</a></li>" +
                                                                "<li><a href=\"dragNDrop/dragNdrop.html\">DRAG AND DROP</a></li>" +
                                                                "<li><a href=\"dbClick/dbClick.html\">DOUBLE CLICK</a></li>" +
                                                                "<li><a href=\"delete/delete.html\">DELETE</a></li>" +
                                                            "</ul>" +
                                                        "</div>" +
                                                    "</div>" +
                                                "</nav>";
}else{
    document.getElementById("menu_pages").innerHTML ="<nav class=\"navbar navbar-default\">" +
                                                    "<div class=\"container-fluid\">" +
                                                        "<div class=\"navbar-header\">" +
                                                            "<a class=\"navbar-brand\" href=\"../accueil.html\">Librairie</a>" +
                                                        "</div>" +
                                                        "<div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\">" +
                                                            "<ul class=\"nav navbar-nav\">" +
                                                                "<li><a href=\"../select/select.html\">SELECT</a></li>" +
                                                                "<li><a href=\"../selectAll/selectAll.html\">SELECT ALL</a></li>" +
                                                                "<li><a href=\"../rightClick/rightClick.html\">RIGHT CLICK</a></li>" +
                                                                "<li><a href=\"../copyPaste/copyPaste.html\">COPY PASTE</a></li>" +
                                                                "<li><a href=\"../dragNDrop/dragNdrop.html\">DRAG AND DROP</a></li>" +
                                                                "<li><a href=\"../dbClick/dbClick.html\">DOUBLE CLICK</a></li>" +
                                                                "<li><a href=\"../delete/delete.html\">DELETE</a></li>" +
                                                            "</ul>" +
                                                        "</div>" +
                                                    "</div>" +
                                                "</nav>";
}

function openCode(evt, codeName) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(codeName).style.display = "block";
    evt.currentTarget.className += " active";
}


