"use strict";
exports.__esModule = true;
exports.customizable = exports.app = exports.LanguageSupport = void 0;
var customStack = require("rover-engine").rover_components;
var Stack = require("rover-engine").rover_modules;
exports.LanguageSupport = {
    node: {
        version: "nodejs14.x",
        dependency: "npm",
        extension: ".js"
    },
    python: {
        version: "python3.9",
        dependency: "pip3",
        extension: ".py"
    }
};
exports.app = {
    choices: {
        methods: ["put", "get", "post", "delete", "options"],
        resourcetype: ["lambda", "stepfunction", "dynamodb"],
        language: ["Node", "Python"],
        type: Object.values(Stack.ModuleDescription),
        pipeline: ["repository and pipeline", "cli"]
    }
};
exports.customizable = {
    choice: Object.keys(customStack.Components)
};
