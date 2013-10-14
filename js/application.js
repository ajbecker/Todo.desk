define([
    "jquery",
    "views/main"
], function (
    $,
    Main
) {
    // define the application object.
    var app = {
        initialize: function () {
            app.main = new Main({el: "body"});
        }
    };

    // Initialize the application at load time.
    $(app.initialize);

    return app;
});