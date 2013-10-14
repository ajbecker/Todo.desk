define(["codemirror"], function (CodeMirror) {
	CodeMirror.defineMode("todo.txt", function (config, parserConfig) {
		return {
			startState: function () {
				return {
					lineStyle: "default"
				};
			},

			token: function (stream, state) {
				var sol = stream.sol(),
					ch = stream.next();
				if (sol) {
					state.lineStyle = "strong";
					if ((ch === "X" || ch === 'x') && stream.eat(/\s/)) {
						state.lineStyle = "comment em strikethrough";
					} else if (ch === "(") {
						if (stream.match("A)")) {
							state.lineStyle = "priority-a strong";
						} else if (stream.match("B)")) {
							state.lineStyle = "priority-b strong";
						} else if (stream.match("C)")) {
							state.lineStyle = "priority-c strong";
						}
					}
				} else {
					if (ch === "@") {
						stream.eatWhile(/\S/);
						return "keyword";
					} else if (ch == "+") {
						stream.eatWhile(/\S/);
						return "variable-2";
					}
				}

				return state.lineStyle;
			},

			blockCommentStart: "/*",
			blockCommentEnd: "*/",
			lineComment: "//",
			fold: "brace"
		};
	});

	return CodeMirror;
});