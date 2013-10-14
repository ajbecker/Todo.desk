define([
    "fileref",
    "file",
    "line",
    "underscore",
    "mocks"
], function (FileRef, File, Line, _, mocks) {
    var file;

    module("FileRef Tests", {
        setup: function () {
            file = new File("test");
        },
        teardown: function () {
        }
    });

    test("FileRef function exists.", function () {
        ok(_.isFunction(FileRef), "FileRef should be a function.");
    });
    
    test("FileRef inherits from File", function () {
        // Act: Create a new instance.
        var fileRef = new FileRef(null);

        // Assert: Verify that we are an instance of File.
        ok(fileRef instanceof File, "The instance should be an instance of File.");
    });
    
    test("FileRef keeps reference to file", function () {
        // Act: Create a new file reference.
        var fileRef = new FileRef(file);

        // Assert: Verify that the fileRef keeps track of the file it references.
        strictEqual(fileRef.file, file, "The file reference should keep a reference to the file.");
    });

    test("FileRef has all lines from file.", function () {
        // Arrange: Add lines to the file.
        file.lines = [
            new Line("line1"),
            new Line("line2"),
            new Line("line3"),
            new Line("line4")
        ];

        // Act: Create the file reference.
        var ref = new FileRef(file);

        // Assert: Verify that the lines are visible in the file reference.
        ok(_.isArray(ref.lines), "The file reference should have a lines array.");
        equal(ref.lines.length, file.lines.length, "The line could should be the same.");
        ok(ref.lines !== file.lines, "The line arrays should be independent arrays.");
        ok(ref.lines[0] !== file.lines[0], "The first line should be independent instances.");
        ok(ref.lines[1] !== file.lines[1], "The second line should be independent instances.");
        ok(ref.lines[2] !== file.lines[2], "The third line should be independent instances.");
        ok(ref.lines[3] !== file.lines[3], "The fourth line should be independent instances.");
        equal(ref.lines[0].toString(), file.lines[0].toString(), "The first line should have the same content.");
        equal(ref.lines[1].toString(), file.lines[1].toString(), "The second line should have the same content.");
        equal(ref.lines[2].toString(), file.lines[2].toString(), "The third line should have the same content.");
        equal(ref.lines[3].toString(), file.lines[3].toString(), "The fourth line should have the same content.");
        strictEqual(file.getRawText(), ref.getRawText(), "The files should contain the same content.");
    });
    
    // test("FileRef line order can be changed.", function () {

    // });
        
    test("A line changed in FileRef effects the base file.", function () {
        // Arrange: Add lines to the file and create the reference.
        file.lines = [
            new Line("line1"),
            new Line("line2"),
            new Line("line3"),
            new Line("line4"),
        ];
        var ref = new FileRef(file);

        // Act: Change one of the lines in the ref.
        ref.lines[2].setText("something different");

        // Assert: Verify that the lines are visible in the file reference.
        ok(_.isArray(ref.lines), "The file reference should have a lines array.");
        equal(ref.lines[2].toString(), "something different", "The 3rd line should have been changed.");
        equal(ref.lines.length, file.lines.length, "The line could should be the same.");
        ok(ref.lines !== file.lines, "The line arrays should be independent arrays.");
        ok(ref.lines[0] !== file.lines[0], "The first line should be independent instances.");
        ok(ref.lines[1] !== file.lines[1], "The second line should be independent instances.");
        ok(ref.lines[2] !== file.lines[2], "The third line should be independent instances.");
        ok(ref.lines[3] !== file.lines[3], "The fourth line should be independent instances.");
        equal(ref.lines[0].toString(), file.lines[0].toString(), "The first line should have the same content.");
        equal(ref.lines[1].toString(), file.lines[1].toString(), "The second line should have the same content.");
        equal(ref.lines[2].toString(), file.lines[2].toString(), "The third line should have the same content.");
        equal(ref.lines[3].toString(), file.lines[3].toString(), "The fourth line should have the same content.");
        strictEqual(file.getRawText(), ref.getRawText(), "The files should contain the same content.");
    });
    
    test("A line removed in FileRef is removed from the base file.", function () {
        // Arrange: Add lines to the file and create the reference.
        file.lines = [
            new Line("line1"),
            new Line("line2"),
            new Line("line3"),
            new Line("line4"),
        ];
        var ref = new FileRef(file);

        // Act: Remove one of the lines from the file.
        ref.applyChange({
            from: { ch: 0, line: 2 },
            to: { ch: 0, line: 3 },
            text: [""],
            removed: ""
        });

        // Assert: Verify that the line was removed as expected.
        equal(ref.lines.length, 3, "There should be 3 lines left in the reference file.");
        equal(file.lines.length, 3, "There should be 3 lines left in the parent file.");
        equal(file.getRawText(), ref.getRawText(), "The two files should contain the exact same content.");
    });
    
    test("A line added to FileRef is added to the base file.", function () {
        // Arrange: Add lines to the file and create the reference.
        file.lines = [
            new Line("line1"),
            new Line("line2"),
            new Line("line3"),
            new Line("line4"),
        ];
        var ref = new FileRef(file);

        // Act: Remove one of the lines from the file.
        ref.applyChange({
            from: { ch: 0, line: 2 },
            to: { ch: 0, line: 2 },
            text: ["this is the new line", ""],
            removed: ""
        });

        // Assert: Verify that the line was removed as expected.
        equal(ref.lines.length, 5, "There should be 5 lines left in the reference file.");
        equal(file.lines.length, 5, "There should be 5 lines left in the parent file.");
        equal(file.getRawText(), ref.getRawText(), "The two files should contain the exact same content.");
    });
    
    test("A line added to FileRef at the begninning is added to the base file at the begninning.", function () {
        // Arrange: Add lines to the file and create the reference.
        var ref = new FileRef(file);

        // Act: Remove one of the lines from the file.
        ref.applyChange({
            from: { ch: 0, line: 0 },
            to: { ch: 0, line: 0 },
            text: ["this is the new line", "this is the second line.", "this is the thrid line."],
            removed: ""
        });

        // Assert: Verify that the line was removed as expected.
        equal(ref.lines.length, 3, "There should be 3 lines left in the reference file.");
        equal(file.lines.length, 3, "There should be 3 lines left in the parent file.");
        equal(file.getRawText(), ref.getRawText(), "The two files should contain the exact same content.");
    });
});