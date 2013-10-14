define([], function () {
	var Line, dateReg = /\d\d\d\d-\d\d-\d\d /;

	// Define the line object.
	Line = function (text) {
		this.setText(text);
	};
	Line.prototype = {
		// Stringify the line.
		toString: function (excludeDate) {
			if (excludeDate) {
				return this.nodate;
			}
			return this.text;
		},

		// Set the text of the line.
		setText: function (text) {
			// hold on to the text.
			this.text = text;

			// parse out the date from the text.
			this.date = dateReg.exec(text);
			if (this.date !== null) {
				// Keep a hold of the date.
				this.date = this.date.toString();
				this.nodate = text.replace(this.date, "");
				this.date = new Date(Date.parse(this.date));
			} else {
				this.nodate = text;
			}
		}
	};

	return Line;
});