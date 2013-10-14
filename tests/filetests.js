define([
    "file",
    "line",
    "underscore",
    "mocks"
], function (File, Line, _, mocks) {

    module("File Tests", {
        setup: function () {
        },
        teardown: function () {
        }
    });

    test("File exists", function () {
        ok(_.isFunction(File), "The file function should exist.");
    });
    
    test("File has event functionality", function () {
        // Arrange: Create the new file instance.
        var file = new File(), eventFired = false;

        // Arrange: Subscribe to the event.
        file.on("test123", function () {
            eventFired = true;
        });

        // Pre-Assert: verify that the event has not yet been fired.
        strictEqual(eventFired, false, "The event should not have yet been fired.");

        // Act: trigger the event.
        file.trigger("test123");

        // Assert: Verify that the event was fired properly.
        strictEqual(eventFired, true, "The event should have been triggered.");
    });

    test("File constructor initializes the name, lines, fileHelper and Line constructor.", function () {
        // Act: initialize the new file.
        var fileName = "test 1 2 3 4 ...",
            file = new File(fileName);

        // Assert: Verify taht the name, lines, Line and fileHelper were initialized on the file.
        equal(file.name, fileName, "The file name should have been set.");
        ok(_.isArray(file.lines), "The lines property should be an array.");
        strictEqual(file.lines.length, 0, "The initial lines array should be empty.");
        ok(_.isFunction(file.Line), "The Line constructor should have been initialized.");
        ok(file.fileHelper, "The fileHelper property should have been initialized.");
    });
    
    test("File has read function", function () {
        // Arrange: create the file.
        var file = new File("test");

        // Assert: verify the read function exists.
        ok(_.isFunction(file.read), "The file should have a read function.");
    });
    
    test("read function loads the data in to the lines", function () {
        // Arrange: Create the file and mock the fileHelper.
        var file = new File("test"),
            sampleData = "Line 1\nLine 2\nLine 3";
        file.fileHelper = {
            readFile: function (name, cb) {
                cb(sampleData);
            }
        };

        // Act: call read on the file.
        file.read();

        // Assert: Verify that the content was loaded in to the lines.
        ok(_.isArray(file.lines), "The lines array should exist.");
        strictEqual(file.lines.length, 3, "There should be three lines from the file.");
        equal(file.lines[0].toString(), "Line 1", "The first line should be set properly.");
        equal(file.lines[1].toString(), "Line 2", "The second line should be set properly.");
        equal(file.lines[2].toString(), "Line 3", "The third line should be set properly.");
    });
    
    test("read function triggers readComplete upon completion", function () {
        // Arrange: Create the file and mock the fileHelper.
        var file = new File("test"),
            sampleData = "Line 1\nLine 2\nLine 3",
            content = null;
        file.fileHelper = {
            readFile: function (name, cb) {
                cb(sampleData);
            }
        };

        // Arrange: subscribe to the readComplete event.
        file.on("readComplete", function (text) {
            content = text;
        });

        // Act: call read on the file.
        file.read();

        // Assert: Verify that the readComplete event was triggered with the content.
        strictEqual(content, sampleData,
            "The content of the file should have been sent to the readComplete event.");
    });
    
    test("read function invokes the callback if it is present", function () {
        // Arrange: Create the file and mock the fileHelper.
        var file = new File("test"),
            sampleData = "Line 1\nLine 2\nLine 3",
            callbackArgs;
        file.fileHelper = {
            readFile: function (name, cb) {
                cb(sampleData);
            }
        };

        // Act: call read on the file.
        file.read(function () {
            callbackArgs = arguments;
        });

        // Assert: Verify that the callback was invoked.
        ok(callbackArgs, "The callback function should have been invoked.");
    });
    
    test("File has write function", function () {
        // Act: Create the new file.
        var file = new File();

        // Assert: Verify that the write function exists.
        ok(_.isFunction(file.write), "The write function should exist.");
    });

    test("write function sends getRawText to the fileHelper", function () {
        // Arrange: Create the file and mock the fileHelper.
        var file = new File("test"),
            sampleData = "Line 1\nLine 2\nLine 3",
            content;
        file.fileHelper = {
            writeFile: function (name, text, cb) {
                content = text;
                cb();
            }
        };

        // Arrange: mock the getRawText function to return the sample data.
        file.getRawText = function () { return sampleData; };

        // Act: invoke the write function.
        file.write();

        // Assert: Verify that the file helper received the text from getRawText.
        strictEqual(content, sampleData, "The sample data should have been sent to the fileHelper.");
    });
    
    test("write function invokes writeComplete when done", function () {
        // Arrange: Create the file and mock the fileHelper.
        var file = new File("test"),
            sampleData = "Line 1\nLine 2\nLine 3",
            writeCompleteArgs;
        file.fileHelper = {
            writeFile: function (name, text, cb) {
                content = text;
                cb();
            }
        };

        // Arrange: subscribe to the writeComplete event.
        file.on("writeComplete", function () {writeCompleteArgs = arguments;});

        // Act: invoke the write function.
        file.write();

        // Assert: Verify that the writeComplete event was properly triggered.
        ok(writeCompleteArgs, "The writeComplete event should have been triggered.");
    });
    
    test("write function invokes the callback if it is present", function () {
        // Arrange: Create the file and mock the fileHelper.
        var file = new File("test"),
            sampleData = "Line 1\nLine 2\nLine 3",
            callbackArgs;
        file.fileHelper = {
            writeFile: function (name, text, cb) {
                content = text;
                cb();
            }
        };

        // Act: invoke the write function.
        file.write(function () { callbackArgs = arguments; });

        // Assert: Verify that the callback event was invoked.
        ok(callbackArgs, "The callback should have been invoked.");
    });
    
    test("File has getRawText function", function () {
        // Act: create the new file.
        var file = new File("test");

        // Assert: Verify that the getRawText function exists.
        ok(_.isFunction(file.getRawText), "The getRawText function should exist.");
    });
    
    test("getRawText function returns all the lines in the file seperated by new lines.", function () {
        // Arrange: create the file and all the lines of text.
        var file = new File("test"), rawText;
        file.lines = [
            new Line("line 1"),
            new Line("line 2"),
            new Line("line 3")
        ];

        // Act: Get the raw text.
        rawText = file.getRawText();

        // Assert: Verify that we have the correct raw text.
        strictEqual(rawText, "line 1\nline 2\nline 3", "The raw text should have been properly built.");
    });
    
    test("File has removeLines function", function () {
        // Act: create the new file.
        var file = new File("test");

        // Assert: verify that we have the removeLines function.
        ok(_.isFunction(file.removeLines), "The removeLines function should exist.");
    });

    test("removeLines removes all the lines specified in the array.", function () {
        // Arrange: Initialzie the file and the lines.
        var file = new File("test");
        file.lines = [
            new Line("line 0"),
            new Line("line 1"),
            new Line("line 2"),
            new Line("line 3"),
            new Line("line 4"),
            new Line("line 5"),
            new Line("line 6")
        ];

        // Act: remove 3 lines from the file.
        file.removeLines([5, 2, 3, 0]);

        // Assert: Verify that the lines were properly removed.
        strictEqual(file.getRawText(), "line 1\nline 4\nline 6");
    });

    test("removeLines triggers linesRemoved upon completion.", function () {
        // Arrange: Initialzie the file and the lines.
        var file = new File("test"), lineCopy, removedLines;
        file.lines = [
            new Line("line 0"),
            new Line("line 1"),
            new Line("line 2"),
            new Line("line 3"),
            new Line("line 4"),
            new Line("line 5"),
            new Line("line 6")
        ];
        lineCopy = file.lines.slice(0);

        // Arrange: listen to the linesRemoved event.
        file.on("linesRemoved", function (lines) {
            removedLines = lines;
        });

        // Act: remove 3 lines from the file.
        file.removeLines([5, 2, 3, 0]);

        // Assert: Verify that the lines removed were passed in to the linesRemoved event.
        ok(_.isArray(removedLines), "The event should have been triggered.");
        strictEqual(removedLines.length, 4, "The total lines removed should be 4.");
        strictEqual(removedLines[0], lineCopy[0], "The 0th line should have been removed.");
        strictEqual(removedLines[1], lineCopy[2], "The 2nd line should have been removed.");
        strictEqual(removedLines[2], lineCopy[3], "The 3rd line should have been removed.");
        strictEqual(removedLines[3], lineCopy[5], "The 5th line should have been removed.");
    });

    // A module just for the applyChange tests.
    module("File.applyChange tests", {
        setup: function () {
            var file = this.file = new File("FileName");
            file.lines = [
                new Line("Line1"),
                new Line("Line2"),
                new Line("Line3"),
                new Line("Line4")
            ];
            this.content = file.getRawText();
        },
        teardown: function () {}
    });

    test("File has applyChange function", function () {
        // Act: create the new file.
        var file = new File("test");

        // Assert: Verify taht the applyChange. function exists.
        ok(_.isFunction(file.applyChange), "The applyChange function should exist.");
    });

    test("applyChange does not fail if no change is provided.", function () {
        try {
            this.file.applyChange();
            ok(true, "No exception shouldhave been thrown.");
        } catch (ex) {
            ok(false, "No exception should have been thrown: " + ex);
        }
    });

    test("applyChange works when text is inserted in middle of line", function () {
        // Arrange: prepare the change
        var text, change = {
            from: { ch: 3, line: 1 },
            to: { ch: 3, line: 1 },
            text: ["Sample"],
            removed: ""
        };

        // Act: trigger the change.
        this.file.applyChange(change);

        // Assert: Verify that the file was changed properly.
        text = this.file.getRawText();
        equal(text, "Line1\nLinSamplee2\nLine3\nLine4", "The file should have been modified.");
    });

    test("applyChange works when text is removed from middle of line", function () {
        // Arrange: prepare the change
        var text, change = {
            from: { ch: 1, line: 1 },
            to: { ch: 3, line: 1 },
            text: [""],
            removed: ""
        };

        // Act: trigger the change.
        this.file.applyChange(change);

        // Assert: Verify that the file was changed properly.
        text = this.file.getRawText();
        equal(text, "Line1\nLe2\nLine3\nLine4", "The file should have been modified.");
    });

    test("applyChange works when text is replaced at middle of line", function () {
        // Arrange: prepare the change
        var text, change = {
            from: { ch: 1, line: 1 },
            to: { ch: 3, line: 1 },
            text: ["abc"],
            removed: ""
        };

        // Act: trigger the change.
        this.file.applyChange(change);

        // Assert: Verify that the file was changed properly.
        text = this.file.getRawText();
        equal(text, "Line1\nLabce2\nLine3\nLine4", "The file should have been modified.");
    });

    test("applyChange works when text is inserted at begining of line", function () {
        // Arrange: prepare the change
        var text, change = {
            from: { ch: 0, line: 1 },
            to: { ch: 0, line: 1 },
            text: ["test"],
            removed: ""
        };

        // Act: trigger the change.
        this.file.applyChange(change);

        // Assert: Verify that the file was changed properly.
        text = this.file.getRawText();
        equal(text, "Line1\ntestLine2\nLine3\nLine4", "The file should have been modified.");
    });

    test("applyChange works when text is removed from begining of line", function () {
        // Arrange: prepare the change
        var text, change = {
            from: { ch: 0, line: 1 },
            to: { ch: 3, line: 1 },
            text: [""],
            removed: ""
        };

        // Act: trigger the change.
        this.file.applyChange(change);

        // Assert: Verify that the file was changed properly.
        text = this.file.getRawText();
        equal(text, "Line1\ne2\nLine3\nLine4", "The file should have been modified.");
    });

    test("applyChange works when text is replaced at begining of line", function () {
        // Arrange: prepare the change
        var text, change = {
            from: { ch: 0, line: 1 },
            to: { ch: 3, line: 1 },
            text: ["test"],
            removed: ""
        };

        // Act: trigger the change.
        this.file.applyChange(change);

        // Assert: Verify that the file was changed properly.
        text = this.file.getRawText();
        equal(text, "Line1\nteste2\nLine3\nLine4", "The file should have been modified.");
    });

    test("applyChange works when text is inserted at end of line", function () {
        // Arrange: prepare the change
        var text, change = {
            from: { ch: 5, line: 1 },
            to: { ch: 5, line: 1 },
            text: ["test"],
            removed: ""
        };

        // Act: trigger the change.
        this.file.applyChange(change);

        // Assert: Verify that the file was changed properly.
        text = this.file.getRawText();
        equal(text, "Line1\nLine2test\nLine3\nLine4", "The file should have been modified.");
    });

    test("applyChange works when text is removed from end of line", function () {
        // Arrange: prepare the change
        var text, change = {
            from: { ch: 3, line: 1 },
            to: { ch: 5, line: 1 },
            text: [""],
            removed: ""
        };

        // Act: trigger the change.
        this.file.applyChange(change);

        // Assert: Verify that the file was changed properly.
        text = this.file.getRawText();
        equal(text, "Line1\nLin\nLine3\nLine4", "The file should have been modified.");
    });

    test("applyChange works when text is replaced at end of line", function () {
        // Arrange: prepare the change
        var text, change = {
            from: { ch: 3, line: 1 },
            to: { ch: 5, line: 1 },
            text: ["test"],
            removed: ""
        };

        // Act: trigger the change.
        this.file.applyChange(change);

        // Assert: Verify that the file was changed properly.
        text = this.file.getRawText();
        equal(text, "Line1\nLintest\nLine3\nLine4", "The file should have been modified.");
    });

    test("applyChange works when line is cleared", function () {
        // Arrange: prepare the change
        var text, change = {
            from: { ch: 0, line: 1 },
            to: { ch: 5, line: 1 },
            text: [""],
            removed: ""
        };

        // Act: trigger the change.
        this.file.applyChange(change);

        // Assert: Verify that the file was changed properly.
        text = this.file.getRawText();
        equal(text, "Line1\n\nLine3\nLine4", "The file should have been modified.");
    });

    test("applyChange works when line is removed", function () {
        // Arrange: prepare the change
        var text, change = {
            from: { ch: 0, line: 1 },
            to: { ch: 0, line: 2 },
            text: [""],
            removed: ""
        };

        // Act: trigger the change.
        this.file.applyChange(change);

        // Assert: Verify that the file was changed properly.
        text = this.file.getRawText();
        equal(text, "Line1\nLine3\nLine4", "The file should have been modified.");
    });

    test("applyChange works when line is replaced", function () {
        // Arrange: prepare the change
        var text, change = {
            from: { ch: 0, line: 1 },
            to: { ch: 5, line: 1 },
            text: ["this is a test"],
            removed: ""
        };

        // Act: trigger the change.
        this.file.applyChange(change);

        // Assert: Verify that the file was changed properly.
        text = this.file.getRawText();
        equal(text, "Line1\nthis is a test\nLine3\nLine4", "The file should have been modified.");
    });

    test("applyChange works when text is removed from middle of one line to start of another line", function () {
        // Arrange: prepare the change
        var text, change = {
            from: { ch: 3, line: 1 },
            to: { ch: 0, line: 2 },
            text: [""],
            removed: ""
        };

        // Act: trigger the change.
        this.file.applyChange(change);

        // Assert: Verify that the file was changed properly.
        text = this.file.getRawText();
        equal(text, "Line1\nLinLine3\nLine4", "The file should have been modified.");
    });

    test("applyChange works when text is removed from middle of one line to end of another line", function () {
        // Arrange: prepare the change
        var text, change = {
            from: { ch: 3, line: 1 },
            to: { ch: 5, line: 2 },
            text: [""],
            removed: ""
        };

        // Act: trigger the change.
        this.file.applyChange(change);

        // Assert: Verify that the file was changed properly.
        text = this.file.getRawText();
        equal(text, "Line1\nLin\nLine4", "The file should have been modified.");
    });

    test("applyChange works when text is removed from middle of one line to middle of another line", function () {
        // Arrange: prepare the change
        var text, change = {
            from: { ch: 3, line: 1 },
            to: { ch: 2, line: 2 },
            text: [""],
            removed: ""
        };

        // Act: trigger the change.
        this.file.applyChange(change);

        // Assert: Verify that the file was changed properly.
        text = this.file.getRawText();
        equal(text, "Line1\nLinne3\nLine4", "The file should have been modified.");
    });

    test("applyChange works when text is removed from start of one line to start of another line", function () {
        // Arrange: prepare the change
        var text, change = {
            from: { ch: 0, line: 1 },
            to: { ch: 0, line: 2 },
            text: [""],
            removed: ""
        };

        // Act: trigger the change.
        this.file.applyChange(change);

        // Assert: Verify that the file was changed properly.
        text = this.file.getRawText();
        equal(text, "Line1\nLine3\nLine4", "The file should have been modified.");
    });

    test("applyChange works when text is removed from start of one line to end of another line", function () {
        // Arrange: prepare the change
        var text, change = {
            from: { ch: 0, line: 1 },
            to: { ch: 5, line: 2 },
            text: [""],
            removed: ""
        };

        // Act: trigger the change.
        this.file.applyChange(change);

        // Assert: Verify that the file was changed properly.
        text = this.file.getRawText();
        equal(text, "Line1\n\nLine4", "The file should have been modified.");
    });

    test("applyChange works when text is removed from start of one line to middle of another line", function () {
        // Arrange: prepare the change
        var text, change = {
            from: { ch: 0, line: 1 },
            to: { ch: 3, line: 2 },
            text: [""],
            removed: ""
        };

        // Act: trigger the change.
        this.file.applyChange(change);

        // Assert: Verify that the file was changed properly.
        text = this.file.getRawText();
        equal(text, "Line1\ne3\nLine4", "The file should have been modified.");
    });

    test("applyChange works when text is removed from end of one line to start of another line", function () {
        // Arrange: prepare the change
        var text, change = {
            from: { ch: 5, line: 1 },
            to: { ch: 0, line: 2 },
            text: [""],
            removed: ""
        };

        // Act: trigger the change.
        this.file.applyChange(change);

        // Assert: Verify that the file was changed properly.
        text = this.file.getRawText();
        equal(text, "Line1\nLine2Line3\nLine4", "The file should have been modified.");
    });

    test("applyChange works when text is removed from end of one line to end of another line", function () {
        // Arrange: prepare the change
        var text, change = {
            from: { ch: 5, line: 1 },
            to: { ch: 5, line: 2 },
            text: [""],
            removed: ""
        };

        // Act: trigger the change.
        this.file.applyChange(change);

        // Assert: Verify that the file was changed properly.
        text = this.file.getRawText();
        equal(text, "Line1\nLine2\nLine4", "The file should have been modified.");
    });

    test("applyChange works when text is removed from end of one line to middle of another line", function () {
        // Arrange: prepare the change
        var text, change = {
            from: { ch: 5, line: 1 },
            to: { ch: 3, line: 2 },
            text: [""],
            removed: ""
        };

        // Act: trigger the change.
        this.file.applyChange(change);

        // Assert: Verify that the file was changed properly.
        text = this.file.getRawText();
        equal(text, "Line1\nLine2e3\nLine4", "The file should have been modified.");
    });

    test("applyChange works when text is inserted at the middle of one line to start of another line", function () {
        // Arrange: prepare the change
        var text, change = {
            from: { ch: 3, line: 1 },
            to: { ch: 0, line: 2 },
            text: ["testing"],
            removed: ""
        };

        // Act: trigger the change.
        this.file.applyChange(change);

        // Assert: Verify that the file was changed properly.
        text = this.file.getRawText();
        equal(text, "Line1\nLintestingLine3\nLine4", "The file should have been modified.");
    });

    test("applyChange works when text is inserted at the middle of one line to end of another line", function () {
        // Arrange: prepare the change
        var text, change = {
            from: { ch: 3, line: 1 },
            to: { ch: 5, line: 2 },
            text: ["testing"],
            removed: ""
        };

        // Act: trigger the change.
        this.file.applyChange(change);

        // Assert: Verify that the file was changed properly.
        text = this.file.getRawText();
        equal(text, "Line1\nLintesting\nLine4", "The file should have been modified.");
    });

    test("applyChange works when text is inserted at the middle of one line to middle of another line", function () {
        // Arrange: prepare the change
        var text, change = {
            from: { ch: 3, line: 1 },
            to: { ch: 3, line: 2 },
            text: ["testing"],
            removed: ""
        };

        // Act: trigger the change.
        this.file.applyChange(change);

        // Assert: Verify that the file was changed properly.
        text = this.file.getRawText();
        equal(text, "Line1\nLintestinge3\nLine4", "The file should have been modified.");
    });

    test("applyChange works when text is inserted at the start of one line to start of another line", function () {
        // Arrange: prepare the change
        var text, change = {
            from: { ch: 0, line: 1 },
            to: { ch: 0, line: 2 },
            text: ["test"],
            removed: ""
        };

        // Act: trigger the change.
        this.file.applyChange(change);

        // Assert: Verify that the file was changed properly.
        text = this.file.getRawText();
        equal(text, "Line1\ntestLine3\nLine4", "The file should have been modified.");
    });

    test("applyChange works when text is inserted at the start of one line to end of another line", function () {
        // Arrange: prepare the change
        var text, change = {
            from: { ch: 0, line: 1 },
            to: { ch: 5, line: 2 },
            text: ["test"],
            removed: ""
        };

        // Act: trigger the change.
        this.file.applyChange(change);

        // Assert: Verify that the file was changed properly.
        text = this.file.getRawText();
        equal(text, "Line1\ntest\nLine4", "The file should have been modified.");
    });

    test("applyChange works when text is inserted at the start of one line to middle of another line", function () {
        // Arrange: prepare the change
        var text, change = {
            from: { ch: 0, line: 1 },
            to: { ch: 3, line: 2 },
            text: ["test"],
            removed: ""
        };

        // Act: trigger the change.
        this.file.applyChange(change);

        // Assert: Verify that the file was changed properly.
        text = this.file.getRawText();
        equal(text, "Line1\nteste3\nLine4", "The file should have been modified.");
    });

    test("applyChange works when text is inserted at the end of one line to start of another line", function () {
        // Arrange: prepare the change
        var text, change = {
            from: { ch: 5, line: 1 },
            to: { ch: 0, line: 2 },
            text: ["test"],
            removed: ""
        };

        // Act: trigger the change.
        this.file.applyChange(change);

        // Assert: Verify that the file was changed properly.
        text = this.file.getRawText();
        equal(text, "Line1\nLine2testLine3\nLine4", "The file should have been modified.");
    });

    test("applyChange works when text is inserted at the end of one line to end of another line", function () {
        // Arrange: prepare the change
        var text, change = {
            from: { ch: 5, line: 1 },
            to: { ch: 5, line: 2 },
            text: ["test"],
            removed: ""
        };

        // Act: trigger the change.
        this.file.applyChange(change);

        // Assert: Verify that the file was changed properly.
        text = this.file.getRawText();
        equal(text, "Line1\nLine2test\nLine4", "The file should have been modified.");
    });

    test("applyChange works when text is inserted at the end of one line to middle of another line", function () {
        // Arrange: prepare the change
        var text, change = {
            from: { ch: 5, line: 1 },
            to: { ch: 3, line: 2 },
            text: ["test"],
            removed: ""
        };

        // Act: trigger the change.
        this.file.applyChange(change);

        // Assert: Verify that the file was changed properly.
        text = this.file.getRawText();
        equal(text, "Line1\nLine2teste3\nLine4", "The file should have been modified.");
    });

    test("applyChange works when multiple lines are inserted with no text before and after.", function () {
        // Arrange: prepare the change
        var text, change = {
            from: { ch: 3, line: 1 },
            to: { ch: 3, line: 1 },
            text: ["test", "test2", "test3"],
            removed: ""
        };

        // Act: trigger the change.
        this.file.applyChange(change);

        // Assert: Verify that the file was changed properly.
        text = this.file.getRawText();
        equal(text, "Line1\nLintest\ntest2\ntest3e2\nLine3\nLine4", "The file should have been modified.");
    });

    test("applyChange works when a new line is added to the start of an empty file.", function () {
        // Arrange: Create the new file.
        var file = new File("test"), text;

        // Act: Change the file at the begining.
        file.applyChange({
            from: { ch: 0, line: 0 },
            to: { ch: 0, line: 0 },
            text: ["Line 1", "Line 2", "Line 3"],
            removed: ""
        });

        // Assert: Verify that the file contents were set properly.
        text = file.getRawText();
        equal(text, "Line 1\nLine 2\nLine 3", "The contents of the file should have been set.");
    });
});