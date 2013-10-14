define([
    "lineref",
    "line",
    "underscore",
    "mocks"
], function (LineRef, Line, _, mocks) {
    var file;

    module("LineRef Tests", {
        setup: function () {
        },
        teardown: function () {
        }
    });

    test("LineRef function exists.", function () {
        ok(_.isFunction(LineRef), "The LineRef function should be defined.");
    });

    test("LineRef inherits from Line.", function () {
        // Arrange: Create a new line.
        var line = new Line("test");

        // Act: Create the line reference.
        var ref = new LineRef(line);

        // Assert: Verify that the reference is an instance of Line.
        ok(ref instanceof Line, "The LineRef instance should inherit from Line.");
    });

    test("LineRef keeps a reference to the parent line.", function () {
        // Arrange: Create a new line.
        var line = new Line("test");

        // Act: Create the line reference.
        var ref = new LineRef(line);

        // Assert: Verify that we keep a reference to the parent line.
        strictEqual(ref.line, line, "The LineRef should keep a reference to the parent Line.");
    });

    test("LineRef contains the same text as the parent line.", function () {
        // Arrange: Create a new line.
        var line = new Line("This is only a test and that is all.");

        // Act: Create the line reference.
        var ref = new LineRef(line);

        // Assert: Verify that the reference contains the same text as the parent line.
        strictEqual(ref.toString(), ref.toString(), "The line contents should be the same.");
    });

    test("LineRef changes are applied to the parent line.", function () {
        // Arrange: Create a new line.
        var newLineText = "This is a new test to check the contents of the new line.",
            line = new Line("testing."),
            ref = new LineRef(line);

        // Act: Chagne the contents of the line reference.
        ref.setText(newLineText);

        // Assert: Verify that the reference contains the same text as the parent line.
        strictEqual(ref.toString(), newLineText, "The text of the line reference should have been set.");
        strictEqual(line.toString(), newLineText, "The text of the line should have been set.");
    });
});