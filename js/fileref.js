define([
    "underscore",
    "backbone",
    "line",
    "lineref",
    "file"
], function (_, Backbone, Line, LineRef, File) {
    var FileRef;

    // Define the file object.
    FileRef = function (file) {
        this.file = file;
        this.Line = LineRef;

        // Create a copy of the line array.
        if (file && file.lines) {
            this.lines = _.map(file.lines, function (line) {
                return new LineRef(line);
            });
        }

        // listen to the lines to be removed and added.
        this.listenTo(this, "linesRemoved", this.onLinesRemoved);
        this.listenTo(this, "linesAdded", this.onLinesAdded);
    };
    FileRef.prototype = new File();

    // Listen for lines to be removed and when they are, remove the reference lines as well.
    FileRef.prototype.onLinesRemoved = function (lines) {
        // Each of these lines refers to another line, we need to find the line number for each of these
        // lines and invoke removeLines on the child.
        var lineNumbers = [], index, lineNum;
        for (index = 0; index < lines.length; index += 1) {
            for (lineNum = 0; lineNum < this.file.lines.length; lineNum += 1) {
                // Check to see if this line number matches our reference line.
                if (lines[index].line === this.file.lines[lineNum]) {
                    // Save off this line number.
                    lineNumbers.push(lineNum);
                    break;
                }
            }
        }

        // Trigger the parent file to remove the specified lines.
        this.file.removeLines(lineNumbers);
    };

    // Listen for lines to be added.
    FileRef.prototype.onLinesAdded = function (lines, lineNum) {
        // Find the line number on the reference file.
        var newLines, refLineNum, idx, prevLine = this.lines[lineNum];
        for (idx = 0; idx < this.file.lines.length; idx += 1) {
            if (this.file.lines[idx] === prevLine.line) {
                refLineNum = idx;
                break;
            }
        }

        // Verify that we found it.
        if (refLineNum !== void 0) {
            // Create the new lines.
            newLines = _.map(lines, function (line) { return line.line; });

            // add the new lines to the parent file.
            this.file.lines.splice.apply(this.file.lines, [refLineNum + 1, 0].concat(newLines));
        } else if (lineNum === 0) {
            newLines = _.map(lines, function (line) { return line.line; });
            this.file.lines.splice.apply(this.file.lines, [0, 0].concat(newLines));
        }

    };

    return FileRef;
});