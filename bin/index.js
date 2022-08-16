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
exports.stackNames = exports.resource_type = void 0;
var rover_utilities = require("rover-engine").rover_utilities;
var cliConfig = require("../rover-cli-poc-main/cliConfig");
var util = require("../rover-cli-poc-main/util");
var deployment = require("rover-engine").rover_deployment;
var buildConfig = require("../rover-cli-poc-main/buildConfig");
var exec = require("child_process").execSync;
var input = {
    app_name: "dgb",
    language: "node",
    Stacks: { emailAuth: "EmailAuthModule", emailAuths: "BaseModule", basecrud: "CRUD" },
    CustomStacks: {},
    StackParams: {
        emailAuth: { names: "" },
        emailAuths: {},
        customone: {},
        basecrud: { "Book": { "resourcetype": "lambda", "path": "/book", "methods": ["put", "get", "post"] } }
    },
    repoconfig: {
        name: "SAM",
        repotype: "public",
        tool: "git",
        language: "js",
        framework: "sam",
        no_envs: 1,
        accesskey: "",
        secretkey: "",
        envs: ["dev"],
        steps: {
            dev: ["build", "deploy"]
        },
        stackname: {
            dev: "devemail",
            test: "testemail"
        },
        deploymentbucket: {
            dev: ""
        },
        deploymentregion: {
            dev: "ap-south-1"
        },
        deploymentparameters: { dev: {} },
        deployment_event: ["push"]
    }
};
var res = [];
var resources = [];
var stack_resource_Name = [];
var AppType;
var template = {};
var config;
function run(argv) {
    return __awaiter(this, void 0, void 0, function () {
        var editedSam, app_name, language, stack_names, customStacks_1, paramModule, basecrud, StackParams, moreStack_1, i_1, app_Types, AppType_1, stack_name, stackName, tempObj, obj, obj, choice, customstack_name, CustomStacks, app_name, language, file_name, CompStacks, nestedComponents, choice, choiceLength, _loop_1, state_1, r, pipeline, repoConfig, repoconfig, file_name, stack_name, bucketName, choice, deploymentregion, region;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(argv[0] === "init")) return [3 /*break*/, 35];
                    return [4 /*yield*/, util.confirmation()];
                case 1:
                    editedSam = _a.sent();
                    if (!(editedSam === "create new SAM project")) return [3 /*break*/, 23];
                    return [4 /*yield*/, util.inputString("app_name", "App Name:")];
                case 2:
                    app_name = _a.sent();
                    return [4 /*yield*/, util.languageChoice()];
                case 3:
                    language = _a.sent();
                    stack_names = {};
                    customStacks_1 = {};
                    paramModule = void 0;
                    basecrud = {};
                    StackParams = {};
                    i_1 = 1;
                    _a.label = 4;
                case 4:
                    app_Types = [];
                    return [4 /*yield*/, util.appType("Type :")];
                case 5:
                    AppType_1 = _a.sent();
                    if (!(AppType_1 !== "Customizable")) return [3 /*break*/, 15];
                    return [4 /*yield*/, util.inputString("stackName".concat(i_1), "Stack ".concat(i_1, " Name: "))];
                case 6:
                    stack_name = _a.sent();
                    stackName = stack_name["stackName".concat(i_1)];
                    if (!(AppType_1 === "CRUD")) return [3 /*break*/, 12];
                    tempObj = {};
                    _a.label = 7;
                case 7: return [4 /*yield*/, util.params(AppType_1)];
                case 8:
                    paramModule = _a.sent();
                    //console.log(paramModule);
                    basecrud[paramModule.name] = paramModule.res;
                    tempObj = __assign(__assign({}, tempObj), { basecrud: basecrud });
                    return [4 /*yield*/, util.moreStack("Do you want to add another API ?")];
                case 9:
                    moreStack_1 = _a.sent();
                    _a.label = 10;
                case 10:
                    if (moreStack_1 !== "No") return [3 /*break*/, 7];
                    _a.label = 11;
                case 11:
                    obj = {};
                    obj[stackName] = basecrud;
                    StackParams = __assign({}, obj);
                    return [3 /*break*/, 14];
                case 12: return [4 /*yield*/, util.params(AppType_1)];
                case 13:
                    paramModule = _a.sent();
                    obj = {};
                    obj[stackName] = basecrud;
                    StackParams = __assign({}, obj);
                    _a.label = 14;
                case 14:
                    stack_names[stack_name["stackName".concat(i_1)]] = AppType_1;
                    return [3 /*break*/, 18];
                case 15:
                    choice = cliConfig.customizable.choice;
                    return [4 /*yield*/, util.inputString("customStackName".concat(i_1), "Stack ".concat(i_1, " Name: "))];
                case 16:
                    customstack_name = _a.sent();
                    return [4 /*yield*/, util.multichoice("app_type", choice)];
                case 17:
                    CustomStacks = _a.sent();
                    customStacks_1[customstack_name["customStackName".concat(i_1)]] =
                        CustomStacks.app_type;
                    _a.label = 18;
                case 18: return [4 /*yield*/, util.moreStack("Do you want to add one more modules ? ")];
                case 19:
                    moreStack_1 = _a.sent();
                    i_1++;
                    _a.label = 20;
                case 20:
                    if (moreStack_1 !== 'No') return [3 /*break*/, 4];
                    _a.label = 21;
                case 21:
                    template = __assign(__assign({}, app_name), { language: language });
                    if (stack_names !== null)
                        template = __assign(__assign({}, template), { Stacks: stack_names, StackParams: StackParams });
                    if (customStacks_1 !== null)
                        template = __assign(__assign({}, template), { CustomStacks: customStacks_1 });
                    //console.log(JSON.stringify(template))
                    return [4 /*yield*/, rover_utilities.generationSAM(({ template: template })["template"])];
                case 22:
                    //console.log(JSON.stringify(template))
                    _a.sent();
                    ;
                    return [3 /*break*/, 34];
                case 23:
                    if (!(editedSam === "add components to existing SAM")) return [3 /*break*/, 33];
                    return [4 /*yield*/, util.inputString("app_name", "App Name")];
                case 24:
                    app_name = _a.sent();
                    return [4 /*yield*/, util.languageChoice()];
                case 25:
                    language = _a.sent();
                    return [4 /*yield*/, exec("ls " + app_name["app_name"] + "/" + "*.yaml ").toString()];
                case 26:
                    file_name = _a.sent();
                    return [4 /*yield*/, rover_utilities.checkNested(file_name)];
                case 27:
                    CompStacks = _a.sent();
                    nestedComponents = {};
                    choice = Object.keys(CompStacks["CompStacks"]);
                    choiceLength = 0;
                    _loop_1 = function () {
                        var nested, chooseStack_1, componentChoice, components, path, choice_1, Compnents;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    nested = CompStacks["checkNested"];
                                    choiceLength = choice.length;
                                    if (!nested) return [3 /*break*/, 3];
                                    return [4 /*yield*/, util.inputType("Select the module to which you want to add the components ", choice)];
                                case 1:
                                    chooseStack_1 = _b.sent();
                                    choice = choice.filter(function (ele) { return ele !== chooseStack_1; });
                                    componentChoice = cliConfig.customizable.choice;
                                    return [4 /*yield*/, util.multichoice("type", componentChoice)];
                                case 2:
                                    components = _b.sent();
                                    path = CompStacks["CompStacks"][chooseStack_1];
                                    nestedComponents[chooseStack_1] = __assign(__assign({}, components), { path: path });
                                    template = __assign(__assign({}, app_name), { language: language, nested: nested, file_name: file_name, nestedComponents: nestedComponents });
                                    return [3 /*break*/, 5];
                                case 3:
                                    choice_1 = cliConfig.customizable.choice;
                                    return [4 /*yield*/, util.multichoice("components", choice_1)];
                                case 4:
                                    Compnents = _b.sent();
                                    template = __assign(__assign({}, app_name), { language: language });
                                    if (customStacks !== null)
                                        template = __assign(__assign(__assign({}, template), { file_name: file_name }), Compnents);
                                    _b.label = 5;
                                case 5:
                                    if (!(choiceLength === 1 || !nested)) return [3 /*break*/, 6];
                                    return [2 /*return*/, "break"];
                                case 6: return [4 /*yield*/, util.moreStack("Do you want to add one more components to modules ?")];
                                case 7:
                                    moreStack = _b.sent();
                                    i++;
                                    _b.label = 8;
                                case 8: return [2 /*return*/];
                            }
                        });
                    };
                    _a.label = 28;
                case 28: return [5 /*yield**/, _loop_1()];
                case 29:
                    state_1 = _a.sent();
                    if (state_1 === "break")
                        return [3 /*break*/, 31];
                    _a.label = 30;
                case 30:
                    if (moreStack !== "No" || choiceLength === 0) return [3 /*break*/, 28];
                    _a.label = 31;
                case 31: 
                //console.log(JSON.stringify(template, null, 2));
                return [4 /*yield*/, rover_utilities.addComponents(template)];
                case 32:
                    //console.log(JSON.stringify(template, null, 2));
                    _a.sent();
                    return [3 /*break*/, 34];
                case 33:
                    if (editedSam === "add modules to existing SAM") {
                        console.log("Work in progress...");
                    }
                    _a.label = 34;
                case 34: return [3 /*break*/, 48];
                case 35:
                    if (!(argv[0] === "deploy")) return [3 /*break*/, 47];
                    return [4 /*yield*/, util.inputType("choice", "pipeline", "Deploy through:")];
                case 36:
                    r = _a.sent();
                    if (!(r === "repository and pipeline")) return [3 /*break*/, 41];
                    return [4 /*yield*/, util.samBuild()];
                case 37:
                    pipeline = _a.sent();
                    repoConfig = __assign({}, pipeline);
                    template = __assign(__assign({}, template), { repoConfig: repoConfig });
                    return [4 /*yield*/, Promise.resolve(util.jsonCreation(template))];
                case 38:
                    repoconfig = _a.sent();
                    if (!(repoconfig !== undefined)) return [3 /*break*/, 40];
                    return [4 /*yield*/, deployment.setupRepo(JSON.parse(repoconfig)["repoConfig"])];
                case 39:
                    _a.sent();
                    _a.label = 40;
                case 40: return [3 /*break*/, 46];
                case 41: return [4 /*yield*/, util.inputString("app_name", "File Name :")];
                case 42:
                    file_name = _a.sent();
                    return [4 /*yield*/, util.inputString("stack_name", "Stack Name :")];
                case 43:
                    stack_name = _a.sent();
                    return [4 /*yield*/, util.inputString("name", "Bucket Name :")];
                case 44:
                    bucketName = _a.sent();
                    choice = buildConfig.samConfig.choices.deploymentregion;
                    return [4 /*yield*/, util.inputType("deploymentregion", choice)];
                case 45:
                    deploymentregion = _a.sent();
                    if (bucketName["name"] == "") {
                        bucketName = " --resolve-s3 ";
                    }
                    else {
                        bucketName = " --s3-bucket " + bucketName["name"];
                    }
                    if (stack_name["stack_name"] == "") {
                        stack_name = "test";
                    }
                    else {
                        stack_name = stack_name["stack_name"];
                    }
                    region = deploymentregion["deploymentregion"];
                    console.log(typeof stack_name, stack_name);
                    exec("sh " + rover_utilities.npmroot + "/rover-prototype/utlities/exec.sh " + file_name["app_name"] + " " + stack_name + " " + region + " " + bucketName);
                    _a.label = 46;
                case 46: return [3 /*break*/, 48];
                case 47:
                    console.log("rover " +
                        argv +
                        " - not a rover command \n  rover init   - creates new SAM project \n  rover deploy - deploys SAM project");
                    _a.label = 48;
                case 48: return [2 /*return*/];
            }
        });
    });
}
exports.resource_type = (res);
exports.stackNames = stack_resource_Name;
var moreStack;
var customStacks;
var i;
run(process.argv.slice(2));
