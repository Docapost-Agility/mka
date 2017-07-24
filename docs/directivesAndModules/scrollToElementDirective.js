app.directive('scrollToItem', function () {
    return {
        restrict: 'A',
        scope: {
            scrollTo: "@"
        },
        link: function (scope, $elm) {
            $elm.on('click', function () {
                $('html,body').animate({scrollTop: $(scope.scrollTo).offset().top - 30}, "slow");
            });
        }
    }
});
