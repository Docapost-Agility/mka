app.directive('itemsAndFolders', function () {
    return {
        scope: true,
        templateUrl: './directives/itemsAndFoldersDirective/itemsAndFoldersDirective.html',
        controller: "itemsAndFoldersCtrl",
        controllerAs: "itemsAndFoldersCtrl",
        link: function (scope, element, attrs, ctrl) {
        }
    };
});
