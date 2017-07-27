app.controller('selectCodeCtrl', [function () {

    var vm = this;

    vm.activeTab = 'HTML';

    vm.codeCss = 'selectCode.css';
    vm.codeHtml = 'selectCode.html';
    vm.codeJs = 'selectCode.js';

    vm.fileWithoutExtension = 'selectCode';

}]);
