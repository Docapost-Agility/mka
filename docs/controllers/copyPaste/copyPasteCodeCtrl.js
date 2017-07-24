app.controller('copyPasteCodeCtrl', [function () {

    var vm = this;

    vm.activeTab = 'HTML';

    vm.codeCss = 'views/copyPaste/copyPasteCssCode.html';
    vm.codeHtml = 'views/copyPaste/copyPasteHtmlCode.html';
    vm.codeJs = 'views/copyPaste/copyPasteJsCode.html';

}]);
