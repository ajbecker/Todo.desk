define([
    "views/main",
    "underscore",
    "mocks"
], function (Main, _, mocks) {
    var main;

    module("Main View Tests", {
        setup: function () {
            main = new Main();
        },
        teardown: function () {

        }
    });

    test("Main should exist", function () {
        ok(Main, "The main view should exist.");
    });

    test("Main should be a backbone view.", function () {
        ok(main instanceof Backbone.View, "The main view should be a backbone view.");
    });

    test("Main.initialize should be a function.", function () {
        ok(_.isFunction(main.initialize), "The initialize function should exist.");
    });

    test("Main.initialize should invoke initializeEditor", function () {
        // Arrange: mock the initializeEditor function.
        var initializeEditorArgs;
        main.initializeEditor = function () {
            initializeEditorArgs = arguments;
        };

        // Act: run initialize.
        main.initialize();

        // Assert: verify the function was invoked.
        ok(initializeEditorArgs, "The initializeEditor function should have been invoked.");
    });

    test("Main.initializeEditor should be a function.", function () {
        ok(_.isFunction(main.initializeEditor), "initializeEditor should be a function.");
    });

    test("Main.initializeEditor should create a CodeMirror instance", function () {
        // Arrange: clear out previous calls to codemirror.
        mocks.codemirrorargs = null;

        // Act: invoke initializeEditor.
        main.initializeEditor();

        // Assert: Verify that the codemirror function was invoked.
        ok(mocks.codemirrorargs, "The code mirror function should ave been invoked.");
    });

});