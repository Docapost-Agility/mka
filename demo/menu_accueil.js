if(document.getElementById("menu") !==null){
    document.getElementById("menu").innerHTML ="<nav class=\"navbar navbar-default\">" +
                                                    "<div class=\"container-fluid\">" +
                                                        "<div class=\"navbar-header\">" +
                                                            "<a class=\"navbar-brand\" href=\"accueil.html\">Librairie</a>" +
                                                        "</div>" +
                                                        "<div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\">" +
                                                            "<ul class=\"nav navbar-nav\">" +
                                                                "<li><a href=\"select/HTML.html\">SELECT</a></li>" +
                                                                "<li><a href=\"selectAll/HTML.html\">SELECT ALL</a></li>" +
                                                                "<li><a href=\"rightClick/HTML.html\">RIGHT CLICK</a></li>" +
                                                                "<li><a href=\"copyPaste/HTML.html\">COPY PASTE</a></li>" +
                                                                "<li><a href=\"dragNDrop/HTML.html\">DRAG AND DROP</a></li>" +
                                                                "<li><a href=\"dbClick/HTML.html\">DOUBLE CLICK</a></li>" +
                                                                "<li><a href=\"delete/HTML.html\">DELETE</a></li>" +
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
                                                                "<li><a href=\"../select/HTML.html\">SELECT</a></li>" +
                                                                "<li><a href=\"../selectAll/HTML.html\">SELECT ALL</a></li>" +
                                                                "<li><a href=\"../rightClick/HTML.html\">RIGHT CLICK</a></li>" +
                                                                "<li><a href=\"../copyPaste/HTML.html\">COPY PASTE</a></li>" +
                                                                "<li><a href=\"../dragNDrop/HTML.html\">DRAG AND DROP</a></li>" +
                                                                "<li><a href=\"../dbClick/HTML.html\">DOUBLE CLICK</a></li>" +
                                                                "<li><a href=\"../delete/HTML.html\">DELETE</a></li>" +
                                                            "</ul>" +
                                                        "</div>" +
                                                    "</div>" +
                                                "</nav>";
}

