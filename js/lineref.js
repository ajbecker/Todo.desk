define(["line"], function (Line) {
    var LineRef;

    // Define the LineRef object.
    LineRef = function (line) {
        if (_.isString(line)) {
            this.line = new Line(line);
        } else {
            this.line = line;
        }

        if (this.line) {
            this.setText(this.line.toString());
        }
    };
    LineRef.prototype = new Line();

    // Replace the setText function with one that will update the base line.
    LineRef.prototype.setText = function (text) {
        Line.prototype.setText.apply(this, arguments);
        this.line.setText(text);
    };
    
    return LineRef;
});