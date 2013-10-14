define([
    "backbone",
    "line",
    "filehelper"
], function (Backbone, Line, fileHelper) {
    var File;

    // Define the file object.
    File = function (name) {
        this.name = name;
        this.lines = [];
        this.Line = Line;
        this.fileHelper = fileHelper;
    };
    File.prototype = _.extend({
        // Read the file.
        read: function (cb) {
            var self = this;
            this.fileHelper.readFile(this.name, function (text) {
                self.lines = _.map((text || "").split("\n"), function (text) {
                    return new self.Line(text);
                });
                self.trigger("readComplete", text);
                if (_.isFunction(cb)) {
                    cb();
                }
            });
        },

        // Write the file.
        write: function (cb) {
            var self = this,
                text = this.getRawText();
            this.fileHelper.writeFile(this.name, text, function () {
                // trigger the completion.
                self.trigger("writeComplete");

                // If we have a callback, invoke it.
                if (_.isFunction(cb)) {
                    cb();
                }
            });
        },

        // Gets the raw text of the file.
        getRawText: function () {
            return this.lines.map(function (line) { return line.toString(); }).join('\n');
        },

        // remove the specified lines from the file.
        removeLines: function (lineNumbers) {
            if (_.isArray(lineNumbers)) {
                lineNumbers.sort();
            }
            var removedLines = [], idx;

            // remove each of the lines.
            for (idx = lineNumbers.length - 1; idx >= 0; idx -= 1) {
                removedLines.unshift(this.lines.splice(lineNumbers[idx], 1)[0]);
            }

            // Trigger the event that we've removed lines.
            this.trigger("linesRemoved", removedLines);
        },

        // Apply the specified change to the file contents.
        // The change structure is as is described below:
        // The changeObj is a 
        // {from, to, text, removed} 
        // object containing information about the changes 
        // that occurred as second argument. from and to are 
        // the positions (in the pre-change coordinate system)
        // where the change started and ended (for example, it 
        // might be {ch:0, line:18} if the position is at the 
        // beginning of line #19). text is an array of strings 
        // representing the text that replaced the changed range
        // (split by line). removed is the text that used to be
        // between from and to, which is overwritten by this change. 
        applyChange: function (change) {
            // If there is anything to be removed, do so now.
            var lineStart, lineEnding, newText, idx, changedLines;

            // Verify that we have a change
            if (change && change.from && change.to) {
                // Handle the case where we have no lines and we're adding content for the first time.
                // (not entirely sure if this is a valid use case or not, but we can test for it anyway.)
                if (change.from.line === 0 && change.from.ch === 0 &&
                    change.to.line === 0 && change.to.ch === 0 && this.lines.length === 0) {
                    changedLines = change.text.slice(0);
                    for (idx = 0; idx < changedLines.length; idx += 1) {
                        changedLines[idx] = new this.Line(changedLines[idx]);
                        this.lines.push(changedLines[idx]);
                    }
                    this.trigger("linesAdded", changedLines, 0);
                } else {
                    // Get the start of the first line that we're going to keep.
                    lineStart = this.lines[change.from.line].text.substr(0, change.from.ch);

                    // grab the line ending.
                    lineEnding = this.lines[change.to.line].text.substr(change.to.ch);

                    // remove lines until we reach the to line.
                    changedLines = this.lines.splice(change.from.line + 1, change.to.line - change.from.line);
                    if (changedLines && changedLines.length > 0) {
                        this.trigger("linesRemoved", changedLines);
                    }

                    // Update with each of the lines that need changing.
                    changedLines.length = 0;
                    for (idx = 0; idx < change.text.length; idx += 1) {
                        // Prepend the start if we are on the first one.
                        newText = "";
                        if (idx === 0) {
                            newText = lineStart;
                        }

                        // Add the new text.
                        newText += change.text[idx];

                        // append the line ending for the last line.
                        if (idx === (change.text.length - 1)) {
                            newText += lineEnding;
                        }

                        // The first line should just be modified in place, otherwise, a new one is created.
                        if (idx === 0) {
                            this.lines[change.from.line].setText(newText);
                        } else {
                            changedLines.push(new this.Line(newText));
                        }
                    }

                    // if there are changed lines then add them in.
                    if (changedLines.length) {
                        this.lines.splice.apply(this.lines, [change.from.line + 1, 0].concat(changedLines));
                        this.trigger("linesAdded", changedLines, change.from.line);
                    }
                }
            }
        }
    }, Backbone.Events);

    return File;
});