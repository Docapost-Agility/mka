app.controller('selectCodeCtrl', ['$sce', function ($sce) {

    var vm = this;

    vm.activeTab = 'HTML';

    var codeHtml = "<code class=\"language-html\">&lt;div class=\"container\"></code>";
    vm.codeHTML = $sce.trustAsHtml(codeHtml);
    // "&lt;button type=\"button\" class=\"btn btn-secondary" onclick="switchMode()">Switch mode&lt;/button>" +
    // "&lt;h2>Folders (&lt;span id="mka-count-folders">0&lt;/span>)</h2>" +
    // "&lt;div class="row folders-container">" +
    // "&lt;div class="col-xs-6 col-sm-4 col-lg-3">";
    //     &lt;div class="folder">
    //     &lt;div class="thumbnail">
    //     &lt;div class="caption">
    //     &lt;h3>Folder&lt;/h3>
    //     &lt;/div>
    //     &lt;/div>
    //     &lt;/div>
    //     &lt;/div>
    //     &lt;/div>
    //
    //     &lt;h2>Items (&lt;span id="mka-count-items">0&lt;/span>)&lt;/h2>
    // &lt;ul id="itemsList" class="list-group">
    //     &lt;li class="list-group-item" item-id="1">
    //     &lt;div class="card">
    //     &lt;div class="card-block">
    //     &lt;h4 class="card-title">Item 1</h4>
    // &lt;/div>
    // &lt;/div>
    // &lt;/li>
    // &lt;/ul>
    // &lt;/div>
    // &lt;!-- Link your mka.min.js -->
    // &lt;script src="../dist/mka.min.js">&lt;/script>";

}]);
