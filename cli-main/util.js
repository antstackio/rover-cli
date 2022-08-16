"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.params = exports.moreStack = exports.appType = exports.samBuild = exports.password = exports.inputCli = exports.validates = exports.inputNumber = exports.confirmation = exports.inputType = exports.languageChoice = exports.inputString = exports.jsonCreation = exports.multichoice = exports.secretkey = exports.accesskey = exports.s3Choice = void 0;
var init = require("../bin/index");
var inquirer = require("inquirer");
var cliConfig = require("./cliConfig");
var buildConfig = require("./buildConfig");
var moduleParams = require("@rover-tools/engine").rover_modules;
var Stack = require("@rover-tools/engine").rover_modules;
var config = {};
exports.s3Choice = [];
var multichoice = function (name, choice) {
    return __awaiter(this, void 0, void 0, function () {
        var r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inquirer.prompt([
                        {
                            type: "checkbox",
                            message: "Please select your components :",
                            name: name,
                            choices: choice,
                            validate: function (answer) {
                                if (answer.length < 1) {
                                    return "You must choose at least one option.";
                                }
                                return true;
                            }
                        },
                    ])];
                case 1:
                    r = _a.sent();
                    return [2 /*return*/, r];
            }
        });
    });
};
exports.multichoice = multichoice;
var jsonCreation = function (obj) {
    return __awaiter(this, void 0, void 0, function () {
        var fs, content;
        return __generator(this, function (_a) {
            fs = require("fs/promises");
            try {
                content = JSON.stringify(obj, null, 2);
                return [2 /*return*/, content];
            }
            catch (err) {
                console.log(err);
            }
            return [2 /*return*/];
        });
    });
};
exports.jsonCreation = jsonCreation;
var inputString = function (userName, message) {
    if (message === void 0) { message = ""; }
    return __awaiter(this, void 0, void 0, function () {
        var takeInput;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inquirer.prompt([
                        {
                            type: "input",
                            name: userName,
                            message: message
                        },
                    ])];
                case 1:
                    takeInput = _a.sent();
                    return [2 /*return*/, (__assign({}, takeInput))];
            }
        });
    });
};
exports.inputString = inputString;
var languageChoice = function () {
    return __awaiter(this, void 0, void 0, function () {
        var lang;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inquirer.prompt([
                        {
                            type: "rawlist",
                            name: "language",
                            message: "Choose your language",
                            choices: cliConfig.app.choices.language
                        },
                    ])];
                case 1:
                    lang = _a.sent();
                    if (lang.language === "Node") {
                        return [2 /*return*/, "node"];
                    }
                    else
                        return [2 /*return*/, "python"];
                    return [2 /*return*/];
            }
        });
    });
};
exports.languageChoice = languageChoice;
var inputType = function (userName, choices, message) {
    if (message === void 0) { message = ""; }
    return __awaiter(this, void 0, void 0, function () {
        var takeInput;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inquirer.prompt([
                        {
                            type: "rawlist",
                            name: "".concat(userName),
                            message: message,
                            choices: typeof choices === "string"
                                ? cliConfig.app.choices[choices]
                                : choices
                        },
                    ])];
                case 1:
                    takeInput = _a.sent();
                    return [2 /*return*/, takeInput];
            }
        });
    });
};
exports.inputType = inputType;
var confirmation = function () {
    return __awaiter(this, void 0, void 0, function () {
        var r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inquirer.prompt([
                        {
                            type: "rawlist",
                            name: "choice",
                            message: "Hey, what do you want ?",
                            choices: ["create new SAM project", "add components to existing SAM", "add modules to existing SAM"]
                        },
                    ])];
                case 1:
                    r = _a.sent();
                    return [2 /*return*/, r.choice];
            }
        });
    });
};
exports.confirmation = confirmation;
var inputNumber = function (userName, message) {
    return __awaiter(this, void 0, void 0, function () {
        var displayname, takeInput;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    displayname = userName;
                    if (message !== undefined) {
                        displayname = message;
                    }
                    return [4 /*yield*/, inquirer.prompt([
                            {
                                type: "number",
                                message: "Please enter the required number of ".concat(displayname, " you want ?"),
                                name: "".concat(userName),
                                validate: function (value) {
                                    if (isNaN(value)) {
                                        return "Please  enter valid number";
                                    }
                                    else {
                                        return true;
                                    }
                                }
                            },
                        ])];
                case 1:
                    takeInput = _a.sent();
                    return [2 /*return*/, takeInput["".concat(userName)]];
            }
        });
    });
};
exports.inputNumber = inputNumber;
var validates = function (value, type, min, max, pattern) {
    if (min === void 0) { min = ""; }
    if (max === void 0) { max = ""; }
    if (pattern === void 0) { pattern = ""; }
    if (type === "string") {
        if (typeof value !== "string" && min >= value.length && max <= value.length)
            return "Please enter valid text";
        else
            true;
    }
    else if (type === "number") {
        if (isNaN(value) && min >= value && max <= value) {
            return "Please  enter valid number";
        }
        else {
            return true;
        }
    }
};
exports.validates = validates;
var inputCli = function (obj, subObj, choiceOption, resource) {
    if (resource === void 0) { resource = ""; }
    return __awaiter(this, void 0, void 0, function () {
        var res, _loop_1, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    res = {};
                    _loop_1 = function (i) {
                        var resp, choice, r, choice, p, r, r, temp, r, codeUriArr, j, r_1, r, p, objListArr, temp, choice_1, p_1, r, actionArr, choice, r, choice_2, p_2, choiceNames, r, choiceNames, name_1, stack_names, temp, choice, p, s, r, temp, FnGetAtt, r, r;
                        var _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (!(subObj[i].value === "object")) return [3 /*break*/, 2];
                                    return [4 /*yield*/, (0, exports.inputCli)(obj, obj[subObj[i].key], choiceOption)];
                                case 1:
                                    resp = _c.sent();
                                    res = __assign(__assign({}, res), (_b = {}, _b[subObj[i].key] = resp, _b));
                                    return [3 /*break*/, 45];
                                case 2:
                                    if (!(subObj[i].value === "choice")) return [3 /*break*/, 4];
                                    choice = obj.choices[subObj[i].key];
                                    return [4 /*yield*/, (0, exports.inputType)(subObj[i].key, choice, subObj[i].message)];
                                case 3:
                                    r = _c.sent();
                                    res["".concat(subObj[i].key)] = r;
                                    return [3 /*break*/, 45];
                                case 4:
                                    if (!(subObj[i].value === "choiceOption")) return [3 /*break*/, 10];
                                    choice = obj.choiceOption[subObj[i].key];
                                    return [4 /*yield*/, (0, exports.inputType)(subObj[i].key, choice, subObj[i].message)];
                                case 5:
                                    p = _c.sent();
                                    if (!(p === "String")) return [3 /*break*/, 7];
                                    return [4 /*yield*/, inquirer.prompt([
                                            {
                                                type: "input",
                                                message: "".concat(choiceOption === "" ? "" : choiceOption + "->").concat(subObj[i].message),
                                                name: "".concat(subObj[i].key)
                                            },
                                        ])];
                                case 6:
                                    r = _c.sent();
                                    res = __assign(__assign({}, res), r);
                                    return [3 /*break*/, 9];
                                case 7: return [4 /*yield*/, (0, exports.inputCli)(obj, obj[p], subObj[i].key)];
                                case 8:
                                    r = _c.sent();
                                    temp = {};
                                    temp["".concat(p)] = { r: r };
                                    res["".concat(subObj[i].key)] = __assign({}, temp);
                                    _c.label = 9;
                                case 9: return [3 /*break*/, 45];
                                case 10:
                                    if (!(subObj[i].value === "list")) return [3 /*break*/, 16];
                                    return [4 /*yield*/, (0, exports.inputNumber)(subObj[i].key, subObj[i].message)];
                                case 11:
                                    r = _c.sent();
                                    codeUriArr = [];
                                    j = 0;
                                    _c.label = 12;
                                case 12:
                                    if (!(j < r)) return [3 /*break*/, 15];
                                    return [4 /*yield*/, inquirer.prompt([
                                            {
                                                type: "input",
                                                message: "".concat(choiceOption === "" ? "" : choiceOption + "->").concat(subObj[i].message),
                                                name: "".concat(subObj[i].key)
                                            },
                                        ])];
                                case 13:
                                    r_1 = _c.sent();
                                    codeUriArr.push(r_1["".concat(subObj[i].key)]);
                                    _c.label = 14;
                                case 14:
                                    j++;
                                    return [3 /*break*/, 12];
                                case 15:
                                    res["".concat(subObj[i].key)] = codeUriArr;
                                    return [3 /*break*/, 45];
                                case 16:
                                    if (!(subObj[i].value === "Boolean")) return [3 /*break*/, 18];
                                    return [4 /*yield*/, inquirer.prompt([
                                            {
                                                type: "confirm",
                                                name: "".concat(subObj[i].key),
                                                message: "DO you want ".concat(subObj[i].message, " property  to be enabled")
                                            },
                                        ])];
                                case 17:
                                    r = _c.sent();
                                    res["".concat(subObj[i].key)] = r;
                                    return [3 /*break*/, 45];
                                case 18:
                                    if (!(subObj[i].value === "objectList")) return [3 /*break*/, 23];
                                    return [4 /*yield*/, (0, exports.inputNumber)(subObj[i].key, subObj[i].message)];
                                case 19:
                                    p = _c.sent();
                                    objListArr = [];
                                    _c.label = 20;
                                case 20:
                                    if (!(p-- !== 0)) return [3 /*break*/, 22];
                                    return [4 /*yield*/, (0, exports.inputCli)(obj, obj[subObj[i].key], subObj[i].key)];
                                case 21:
                                    temp = _c.sent();
                                    objListArr.push(temp);
                                    return [3 /*break*/, 20];
                                case 22:
                                    res["".concat(subObj[i].key)] = objListArr;
                                    return [3 /*break*/, 45];
                                case 23:
                                    if (!(subObj[i].value === "multipleChoice")) return [3 /*break*/, 29];
                                    if (!(subObj[i].key === "Action")) return [3 /*break*/, 26];
                                    choice_1 = init.stackNames.map(function (_a) {
                                        var key = _a.key, value = _a.value;
                                        return value;
                                    });
                                    choice_1 = choice_1.filter(function (item, pos) { return choice_1.indexOf(item) == pos; });
                                    return [4 /*yield*/, (0, exports.inputType)(subObj[i].key, choice_1, subObj[i].message)];
                                case 24:
                                    p_1 = _c.sent();
                                    choice_1 = obj.choices[p_1];
                                    return [4 /*yield*/, (0, exports.multichoice)(p_1, choice_1)];
                                case 25:
                                    r = _c.sent();
                                    actionArr = r[p_1].map(function (ele) { return "".concat(p_1, ":").concat(ele); });
                                    res = { Action: actionArr };
                                    return [3 /*break*/, 28];
                                case 26:
                                    choice = obj.choices[subObj[i].key];
                                    return [4 /*yield*/, (0, exports.multichoice)(subObj[i].key, choice)];
                                case 27:
                                    r = _c.sent();
                                    res = __assign(__assign({}, res), r);
                                    _c.label = 28;
                                case 28: return [3 /*break*/, 45];
                                case 29:
                                    if (!(subObj[i].value === "choiceReference")) return [3 /*break*/, 37];
                                    choice_2 = init.stackNames.map(function (_a) {
                                        var key = _a.key, value = _a.value;
                                        return value;
                                    });
                                    choice_2 = choice_2.filter(function (item, pos) { return choice_2.indexOf(item) == pos; });
                                    if (!((subObj[i].key === "resource" || subObj[i].key === "Ref") &&
                                        choice_2.length > 0)) return [3 /*break*/, 32];
                                    return [4 /*yield*/, (0, exports.inputType)(subObj[i].key, choice_2)];
                                case 30:
                                    p_2 = _c.sent();
                                    choiceNames = init.stackNames
                                        .filter(function (_a) {
                                        var key = _a.key, value = _a.value;
                                        return value === p_2;
                                    })
                                        .map(function (_a) {
                                        var key = _a.key, value = _a.value;
                                        return key;
                                    });
                                    return [4 /*yield*/, (0, exports.inputType)(p_2, choiceNames)];
                                case 31:
                                    r = _c.sent();
                                    res["".concat(subObj[i].key)] = r;
                                    return [3 /*break*/, 36];
                                case 32:
                                    if (!(subObj[i].key === "role" && choice_2.indexOf("iamrole") !== -1)) return [3 /*break*/, 33];
                                    choiceNames = init.stackNames
                                        .filter(function (_a) {
                                        var key = _a.key, value = _a.value;
                                        return value === "iamrole";
                                    })
                                        .map(function (_a) {
                                        var key = _a.key, value = _a.value;
                                        return key;
                                    });
                                    res[subObj[i].key] = choiceNames[0];
                                    return [3 /*break*/, 36];
                                case 33: return [4 /*yield*/, (0, exports.inputString)("name", "".concat(subObj[i].message, "-->Name"))];
                                case 34:
                                    name_1 = _c.sent();
                                    return [4 /*yield*/, (0, exports.inputType)("stack_resource", "resource", subObj[i].message)];
                                case 35:
                                    stack_names = _c.sent();
                                    temp = name_1;
                                    res["".concat(subObj[i].key)] = temp.name;
                                    _c.label = 36;
                                case 36: return [3 /*break*/, 45];
                                case 37:
                                    if (!(subObj[i].value === "choiceList")) return [3 /*break*/, 41];
                                    choice = obj.choices[subObj[i].key];
                                    return [4 /*yield*/, (0, exports.inputType)(subObj[i].key, choice, subObj[i].message)];
                                case 38:
                                    p = _c.sent();
                                    s = {};
                                    if (!p) return [3 /*break*/, 40];
                                    return [4 /*yield*/, (0, exports.inputCli)(obj, obj[p], subObj[i].key)];
                                case 39:
                                    r = _c.sent();
                                    temp = {};
                                    if (p === "GetAtt") {
                                        FnGetAtt = [];
                                        FnGetAtt.push(r["Fn::GetAtt"]);
                                        FnGetAtt.push("Arn");
                                        temp = { FnGetAtt: FnGetAtt }; //"Fn::GetAtt": ["PostSignup","Arn"]
                                    }
                                    else if (p === "Ref") {
                                        temp = __assign({}, r);
                                    }
                                    else {
                                        temp["".concat(p)] = __assign({}, r);
                                    }
                                    res["".concat(subObj[i].key)] = __assign({}, temp);
                                    _c.label = 40;
                                case 40: return [3 /*break*/, 45];
                                case 41:
                                    if (!(subObj[i].key === 'accesskey' || subObj[i].key === 'secretkey')) return [3 /*break*/, 43];
                                    return [4 /*yield*/, inquirer.prompt([
                                            {
                                                type: 'password',
                                                message: "".concat(choiceOption === "" ? "" : choiceOption + "->").concat(subObj[i].message),
                                                name: "".concat(subObj[i].key)
                                            },
                                        ])];
                                case 42:
                                    r = _c.sent();
                                    res = __assign(__assign({}, res), r);
                                    exports.accesskey = r[subObj[i].key];
                                    return [3 /*break*/, 45];
                                case 43: return [4 /*yield*/, inquirer.prompt([
                                        {
                                            type: "input",
                                            message: "".concat(choiceOption === "" ? "" : choiceOption + "->").concat(subObj[i].message),
                                            name: "".concat(subObj[i].key)
                                        },
                                    ])];
                                case 44:
                                    r = _c.sent();
                                    res = __assign(__assign({}, res), r);
                                    _c.label = 45;
                                case 45: return [2 /*return*/];
                            }
                        });
                    };
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < subObj.length)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1(i)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, res];
            }
        });
    });
};
exports.inputCli = inputCli;
var password = function (userName, message) {
    if (message === void 0) { message = ""; }
    return __awaiter(this, void 0, void 0, function () {
        var r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inquirer.prompt([{
                            type: 'password',
                            message: message,
                            name: userName
                        }])];
                case 1:
                    r = _a.sent();
                    return [2 /*return*/, r];
            }
        });
    });
};
exports.password = password;
var samBuild = function () {
    return __awaiter(this, void 0, void 0, function () {
        var obj, subObj, sam, accesskey, secretkey, no_of_env, envs, steps, stacknames, deploymentregion, deploymentparameters, deployment_event, deployementbuckets, depBucketNames, i, env, envName, stepsChoice, step, stackname, deploymentbucket, regionChoice, deployment_region, deployment_parameter, deployment_choice, deploymentEvent, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    obj = buildConfig.samConfig;
                    subObj = buildConfig.samConfig.samBuild;
                    return [4 /*yield*/, (0, exports.inputCli)(obj, subObj, "")];
                case 1:
                    sam = _a.sent();
                    return [4 /*yield*/, (0, exports.password)("accesskey", "Accesskey:")];
                case 2:
                    accesskey = _a.sent();
                    return [4 /*yield*/, (0, exports.password)("secretkey", "Secretkey:")];
                case 3:
                    secretkey = _a.sent();
                    return [4 /*yield*/, (0, exports.inputNumber)("no_of_env", "Environments(dev,test)")];
                case 4:
                    no_of_env = _a.sent();
                    envs = [];
                    steps = {};
                    stacknames = {};
                    deploymentregion = {};
                    deploymentparameters = {};
                    deployment_event = {};
                    deployementbuckets = {};
                    depBucketNames = {};
                    i = 1;
                    _a.label = 5;
                case 5:
                    if (!(i <= no_of_env)) return [3 /*break*/, 13];
                    return [4 /*yield*/, (0, exports.inputString)("env".concat(i), "Envrionment ".concat(i, " :"))];
                case 6:
                    env = _a.sent();
                    envName = env["env".concat(i)];
                    envs.push(envName);
                    stepsChoice = buildConfig.samConfig.choices.dev;
                    return [4 /*yield*/, (0, exports.multichoice)("".concat(envName), stepsChoice)];
                case 7:
                    step = _a.sent();
                    return [4 /*yield*/, (0, exports.inputString)("".concat(envName), "Stack Name --> ".concat(envName, " :"))];
                case 8:
                    stackname = _a.sent();
                    return [4 /*yield*/, (0, exports.inputString)("".concat(envName), "Deployment Bucket --> ".concat(envName, " :"))];
                case 9:
                    deploymentbucket = _a.sent();
                    regionChoice = buildConfig.samConfig.choices.deploymentregion;
                    return [4 /*yield*/, (0, exports.inputType)("".concat(envName), regionChoice, "Deployment Region")];
                case 10:
                    deployment_region = _a.sent();
                    return [4 /*yield*/, (0, exports.inputString)("".concat(envName), "Deployment Parameter--> ".concat(envName, " :"))];
                case 11:
                    deployment_parameter = _a.sent();
                    steps = __assign(__assign({}, steps), step);
                    stacknames = __assign(__assign({}, stacknames), stackname);
                    depBucketNames = __assign(__assign({}, depBucketNames), deploymentbucket);
                    deploymentregion["".concat(envName)] = deployment_region;
                    deploymentparameters = __assign(__assign({}, deploymentparameters), deployment_parameter);
                    _a.label = 12;
                case 12:
                    i++;
                    return [3 /*break*/, 5];
                case 13:
                    deployment_choice = buildConfig.samConfig.choices.deployment;
                    return [4 /*yield*/, (0, exports.multichoice)("deployment_event", deployment_choice)];
                case 14:
                    deploymentEvent = _a.sent();
                    result = {};
                    result = __assign(__assign(__assign(__assign(__assign(__assign({}, sam), { no_of_env: no_of_env }), accesskey), secretkey), { envs: envs, steps: steps, stackname: __assign({}, stacknames), deploymentbucket: __assign({}, depBucketNames), deploymentregion: deploymentregion, deploymentparameters: deploymentparameters }), deploymentEvent);
                    //console.log(JSON.stringify(result, null, 2));
                    return [2 /*return*/, result];
            }
        });
    });
};
exports.samBuild = samBuild;
var appType = function (message) {
    if (message === void 0) { message = ""; }
    return __awaiter(this, void 0, void 0, function () {
        var r, stackModule, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inquirer.prompt([{
                            type: 'rawlist',
                            name: "app_Type",
                            message: message,
                            choices: cliConfig.app.choices.type
                        }])];
                case 1:
                    r = _a.sent();
                    stackModule = Stack.ModuleDescription;
                    for (i = 0; i < stackModule.length; i++) {
                        if (stackModule[i].value === r["app_Type"]) {
                            return [2 /*return*/, stackModule[i].key];
                            ;
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
};
exports.appType = appType;
var moreStack = function (message) {
    return __awaiter(this, void 0, void 0, function () {
        var r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inquirer.prompt([{
                            type: 'list',
                            name: 'stack',
                            message: message,
                            choices: ["Yes", "No"]
                        }])];
                case 1:
                    r = _a.sent();
                    return [2 /*return*/, r['stack']];
            }
        });
    });
};
exports.moreStack = moreStack;
var params = function (module) {
    return __awaiter(this, void 0, void 0, function () {
        var choice, params, name, res, modulesParams, paramslength, i, r, r, r, r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    choice = cliConfig.app.choices;
                    params = {};
                    name = {};
                    res = {};
                    if (!(module === "CRUD")) return [3 /*break*/, 13];
                    modulesParams = moduleParams.ModuleParams.CRUD.params;
                    paramslength = modulesParams.length;
                    if (!(paramslength > 0)) return [3 /*break*/, 11];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < paramslength)) return [3 /*break*/, 10];
                    if (!(modulesParams[i].value === "choice")) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, exports.inputType)(modulesParams[i].key, choice[modulesParams[i].key], modulesParams[i].message)];
                case 2:
                    r = _a.sent();
                    res = __assign(__assign({}, res), r);
                    return [3 /*break*/, 9];
                case 3:
                    if (!(modulesParams[i].value === "multichoice")) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, exports.multichoice)(modulesParams[i].key, choice.methods)];
                case 4:
                    r = _a.sent();
                    res = __assign(__assign({}, res), r);
                    return [3 /*break*/, 9];
                case 5:
                    if (!(modulesParams[i].key === "name")) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, exports.inputString)("name", modulesParams[i].message)];
                case 6:
                    r = _a.sent();
                    name = r;
                    return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, (0, exports.inputString)(modulesParams[i].key, modulesParams[i].message)];
                case 8:
                    r = _a.sent();
                    res = __assign(__assign({}, res), r);
                    _a.label = 9;
                case 9:
                    i++;
                    return [3 /*break*/, 1];
                case 10: return [2 /*return*/, params = {
                        res: res,
                        name: name["name"]
                    }];
                case 11: return [2 /*return*/];
                case 12: return [3 /*break*/, 14];
                case 13: return [2 /*return*/, {}];
                case 14: return [2 /*return*/];
            }
        });
    });
};
exports.params = params;
