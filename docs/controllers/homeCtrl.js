app.controller('homeCtrl', [function () {

    var vm = this;

    vm.addCodeToHtml = function (type, file, fileWithoutExtension) {
        if (angular.element('#codeElement' + type + fileWithoutExtension + ' code').length === 0) {
            var $code = $('<code data-gist-id="b676384d5400470e84f0a6719d054368" data-gist-file="' + file + '" ' +
                'data-gist-show-spinner="true"></code>');

            $code.appendTo('#codeElement' + type + fileWithoutExtension).gist();
        }
    }

}]);
