(function () {
    var file, files = [], paths = {}, tmp, prevTests = window.__karma__.prevTests;

    if (prevTests === void 0) {
        window.__karma__.prevTests = prevTests = {};
    }

    // Build up paths for all the files that we care about.
    for (file in window.__karma__.files) {
        // Check to see if this is a tests file.
        if (file.indexOf("/base/tests/") === 0) {
            tmp = file.substring(12, file.length - 3);
            paths[tmp] = file.substr(0, file.length - 3);
            if (tmp !== "test-main"/* &&
                prevTests[file] !== window.__karma__.files[file]*/) {
                prevTests[file] = window.__karma__.files[file];
                files.push(tmp);
            }
        } else if (file.indexOf("/base/js/") === 0) {
            tmp = file.substring(9, file.length - 3);
            paths[tmp] = file.substr(0, file.length - 3);
        }
    }

    // Set the configuration for require js.
    require({
        paths: paths,
        shim: {
            'backbone': {
                deps: ['underscore', 'jquery'],
                exports: 'Backbone'
            },
            'underscore': {
                exports: '_'
            },
            'codemirror': {
                exports: 'CodeMirror'
            },
            'todo-hint': {
                deps: ['show-hint'],
                exports: 'CodeMirror'
            },
            'todo.txt': {
                exports: 'CodeMirror'
            }
        },
        waitSeconds: 1
    });

    // Define the mock codemirror
    var mocks = {}, m;
    define("mocks", [], mocks);

    // Define the CodeMirror mocks.
    mocks.codemirror = function () {
        mocks.codemirrorargs = arguments;
        return {
            setValue: function () {},
            setSize: function () {},
            on: function () {}
        };
    };
    mocks["todo.txt"] = mocks.codemirror;

    // Define the mock file helper.
    mocks.filehelper = {
        readFile: function (name, cb) {
            setTimeout(cb, 0);
        },
        writeFile: function (name, text, cb) {
            setTimeout(cb, 0);
        }
    };

    // Define all the mocks.
    tmp = function (mockVal) { return function () { return mockVal; }; };
    for (m in mocks) {
        define(m, [], tmp(mocks[m]));
    }

    // Require the files we care about.
    require(files, window.__karma__.start);
}());