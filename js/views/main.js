define([
    "backbone",
    "codemirror",
    "todo.txt",
    "file"
], function (Backbone, CodeMirror, _todo, File) {

    // The default settings for the editor.
    var Main, editorSettings = {
        mode: "todo.txt",
        lineWrapping: true,
        lineNumbers: true,
        showCursorWhenSelecting: true/*,
        extraKeys: {
            "Ctrl-Space": "autocomplete"
        }*/
    };

    // CodeMirror.commands.autocomplete = function (cm) {
    //     CodeMirror.showHint(cm, CodeMirror.hint.anyword);
    // };

    // Define the main view.
    Main = Backbone.View.extend({
        events: {
            "click a[data-method]": "onClickMethod"
        },

        // Initialize the view.
        initialize: function () {
            this.initializeEditor();
        },

        // initialize the editor.
        initializeEditor: function () {
            // initialize the editor.
            var cm = this.codeMirror = CodeMirror(document.getElementById("editBody"), editorSettings);
            this.setFile(new File("todo"));

            // Set the size to full screen.
            cm.setSize("100%", "100%");
            this.listenTo(cm, "change", this.onEditorChange.bind(this));
        },

        // Change the binding to use the new file.
        setFile: function (file) {
            // Stop listening to the read compleation on the previous file.
            if (this.file) {
                this.stopListening(this.file);
            }

            // Start monitoring the new file.
            this.file = file;
            this.listenTo(file, "readComplete", this.onFileRead);
            file.read();
        },

        // Archvie all the completed items.
        archiveCompleted: function () {
            var lineNumbers = [];

            // Iterate the lines.
            _.each(this.file.lines, function (line, idx) {
                if (line.text.substr(0, 2) === 'x ' || line.text.substr(0, 2) === 'X ') {
                    lineNumbers.push(idx);
                }
            });

            // remove the lines.
            this.file.removeLines(lineNumbers);

            // Re-draw the text.
            this.onFileRead(this.file.getRawText());
        },

        // Called when one of the data-method links is clicked.
        onClickMethod: function (evt) {
            var name = evt.currentTarget.getAttribute("data-method"),
                func = this[name];
            if (_.isFunction(func)) {
                func.apply(this, evt);
            }
        },

        // Called when the file has been read.
        onFileRead: function (fileContents) {
            this.ignoreChange = true;
            this.codeMirror.setValue(fileContents || "");
            delete this.ignoreChange;
        },

        // invoked when a change is detected.
        onEditorChange: function (cm, change) {
            // Check to see if we need to ignore the change.
            if (this.ignoreChange) {
                return;
            }

            // Notify the file that the contents have changed.
            while (change) {
                this.file.applyChange(change);
                change = change.next;
            }

            // Set a timeout to save the changes.
            clearTimeout(this._scheduledChangeTimeout);
            this._scheduledChangeTimeout = setTimeout(this.onScheduledChange.bind(this), 1500);
        },

        // Called after a timeout when the text has change.
        onScheduledChange: function () {
            // At this point, we should expect that the contents of the file object are up to date.
            // now we just need to trigger a save.
            if (this.file) {
                this.file.write();
            }
        }
    });

    return Main;
});