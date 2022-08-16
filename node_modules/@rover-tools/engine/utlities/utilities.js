"use strict";
exports.__esModule = true;
exports.checkNested = exports.getComponents = exports.addComponents = exports.generationSAM = exports.getAppdata = exports.createStack = exports.createStackResources = exports.cliModuletoConfig = exports.generateLambdafiles = exports.removeFolder = exports.moveFolder = exports.copyLambdaLogic = exports.initializeSAM = exports.replaceYAML = exports.addResourceTemplate = exports.installDependies = exports.writeFile = exports.npmroot = exports.pwd = void 0;
var config = require("./config");
var rover_resources = require("../resources/resources");
var logics = require("../resources/logics");
var modules = require("../resources/modules");
var components = require("../resources/components");
var exec = require("child_process").execSync;
var yaml = require("yaml");
var fs = require("fs");
exports.pwd = process.cwd() + "/";
var doc = new yaml.Document();
var sub = new RegExp(/(!Sub|!Transform|!Split|!Join|!Select|!FindInMap|!GetAtt|!GetAZs|!ImportValue|!Ref)\s[a-zA-Z0-9 !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*\n/g);
var Yaml = require("js-yaml");
exports.npmroot = exec(" npm root -g").toString().trim();
function writeFile(path, data) {
    fs.writeFileSync(exports.pwd + "/" + path, data);
}
exports.writeFile = writeFile;
function installDependies(path, packages, dependency) {
    if (dependency == "npm") {
        packages.map(function (ele) {
            exec("npm --prefix " + exports.pwd + path + " install " + ele + " --save");
            console.log("npm --prefix " + exports.pwd + path + " install " + ele + "");
        });
    }
}
exports.installDependies = installDependies;
function addResourceTemplate(resources, name, temp) {
    var template;
    if (temp == undefined) {
        template = rover_resources.skeleton();
    }
    else {
        template = temp;
    }
    for (var i in name) {
        template["Resources"][name[i]] = resources[name[i]];
    }
    return template;
}
exports.addResourceTemplate = addResourceTemplate;
function replaceYAML(doc) {
    var yamlArray = {
        // "off": "'off'",
        // "on": "'on'",
        // "yes":"'yes'",
        // "no":"'no'",
        "OFF": "'OFF'"
    };
    Object.keys(yamlArray).map(function (key) {
        doc = doc.replace(key, yamlArray[key]);
    });
    return doc;
}
exports.replaceYAML = replaceYAML;
function initializeSAM(input) {
    var app_name = input.app_name;
    removeFolder(input.app_name);
    var language = config.LanguageSupport[input.language]["version"];
    var dependency = config.LanguageSupport[input.language]["dependency"];
    var extension = config.LanguageSupport[input.language]["extension"];
    //console.log(config.SAMInitBase+config.SAMLanguage+language+config.SAMDependency+dependency+config.SAMAppName+app_name+config.SAMAppTemplate)
    exec(config.SAMInitBase + config.SAMLanguage + language + config.SAMDependency + dependency + config.SAMAppName + app_name + config.SAMAppTemplate);
    moveFolder(exports.pwd + input.app_name + "/hello-world ", exports.pwd + input.app_name + "/" + "lambda_demo");
    //console.log(input)
}
exports.initializeSAM = initializeSAM;
function copyLambdaLogic(source, desti) {
    exec("cp -r " + source + desti);
}
exports.copyLambdaLogic = copyLambdaLogic;
function moveFolder(source, desti) {
    exec("mv " + source + desti);
}
exports.moveFolder = moveFolder;
function removeFolder(path) {
    exec(config.ForceRemove + path);
}
exports.removeFolder = removeFolder;
function generateLambdafiles(logic, app_data, resources, stacktype, stackname, j) {
    var code;
    if (logic) {
        if (resources["resources"][j].hasOwnProperty("logicpath")) {
            code = logics.LambdaLogics[app_data.language][resources["resources"][j]["logicpath"]];
        }
        else {
            if (resources["type"] == "components" || stacktype == undefined) {
                code = logics.LambdaLogics[app_data.language][resources["resources"][j]["name"]];
            }
            else {
                code = logics.LambdaLogics[app_data.language][stacktype + "_" + resources["resources"][j]["name"]];
            }
        }
        if (code !== undefined) {
            var path = void 0;
            if (stackname == undefined) {
                path = app_data.app_name + "/" + resources["resources"][j]["name"] + "/";
                if (resources["resources"][j].hasOwnProperty("package")) {
                    installDependies(path, resources["resources"][j]["package"], app_data.dependency);
                }
                path = path + "app" + app_data.extension;
            }
            else {
                path = app_data.app_name + "/" + stackname + "_Stack" + "/" + resources["resources"][j]["name"] + "/";
                if (resources["resources"][j].hasOwnProperty("package")) {
                    installDependies(path, resources["resources"][j]["package"], app_data.dependency);
                }
                path = path + "app" + app_data.extension;
            }
            writeFile(path, code);
        }
    }
}
exports.generateLambdafiles = generateLambdafiles;
function cliModuletoConfig(input) {
    initializeSAM(input);
    var app_types = {};
    if (Object.keys(input["Stacks"]).length > 0) {
        Object.keys(input["Stacks"]).map(function (ele) {
            var stackdata = {};
            if (input["Stacks"][ele] == "CRUD") {
                stackdata = modules.StackType[input["Stacks"][ele]](ele, input["StackParams"][ele]);
                //console.log(JSON.stringify(res))
            }
            else if (input["Stacks"][ele] == "RDS") {
                stackdata = modules.StackType[input["Stacks"][ele]](ele, {});
            }
            else {
                stackdata = JSON.parse(JSON.stringify(modules.StackType[input["Stacks"][ele]]));
            }
            Object.keys(stackdata).map(function (ele1) {
                app_types[ele + ele1] = stackdata[ele1];
                app_types[ele + ele1]["type"] = "module";
            });
        });
    }
    if (Object.keys(input["CustomStacks"]).length > 0) {
        Object.keys(input["CustomStacks"]).map(function (ele) {
            var resources = [];
            input["CustomStacks"][ele].map(function (ele) {
                JSON.parse(JSON.stringify(components.Components[ele])).map(function (ele) {
                    resources.push(ele);
                });
            });
            app_types[ele] = {};
            app_types[ele]["resources"] = resources;
            app_types[ele]["type"] = "components";
        });
    }
    //console.log(JSON.stringify(app_types))
    return app_types;
}
exports.cliModuletoConfig = cliModuletoConfig;
function createStackResources(resources, app_data, StackType, stack_names, comp) {
    //console.log("StackType",StackType)
    var res = {};
    for (var j in resources["resources"]) {
        var configs = resources["resources"][j]["config"];
        var logic = resources["resources"][j]["logic"];
        if (config.AWSResources[resources["resources"][j]["type"]].hasOwnProperty("name")) {
            var name_1 = (resources["resources"][j]["name"]).replace(" ", "");
            name_1 = name_1.replace(/[^a-z0-9]/gi, '');
            configs[config.AWSResources[resources["resources"][j]["type"]]["name"]] = name_1;
        }
        if (resources["resources"][j]["type"] == "lambda") {
            var path = void 0;
            var path2 = void 0;
            if (stack_names == undefined) {
                if (comp.demo_desti !== undefined) {
                    path = exports.pwd + comp.demo_desti + "/" + "lambda_demo" + "/ ";
                    path2 = exports.pwd + app_data.app_name + "/" + resources["resources"][j]["name"] + "/";
                }
                if (comp.desti !== undefined) {
                    path = exports.pwd + comp.demo_desti + "/" + "lambda_demo" + "/ ";
                    path2 = exports.pwd + comp.desti + "/" + resources["resources"][j]["name"] + "/";
                    //console.log(path,path2)
                }
            }
            else {
                path = exports.pwd + app_data.app_name + "/" + "lambda_demo" + "/ ";
                path2 = exports.pwd + app_data.app_name + "/" + stack_names + "_Stack" + "/" + resources["resources"][j]["name"] + "/";
            }
            copyLambdaLogic(path, path2);
            generateLambdafiles(logic, app_data, resources, StackType, stack_names, j);
            configs["CodeUri"] = resources["resources"][j]["name"] + "/";
            configs["Runtime"] = app_data.language;
        }
        else if (resources["resources"][j]["type"] == "apigateway") {
            exec("mkdir " + exports.pwd + app_data.app_name + "/" + stack_names + "_Stack" + "/" + resources["resources"][j]["name"] + "_apigateway");
            configs["path"] = resources["resources"][j]["name"] + "_apigateway" + "/swagger.yaml";
            configs["filepath"] = app_data.app_name + "/" + stack_names + "_Stack" + "/" + resources["resources"][j]["name"] + "_apigateway" + "/swagger.yaml";
        }
        var resources1 = rover_resources.resourceGeneration(resources["resources"][j]["type"], configs);
        res[resources["resources"][j]["name"]] = resources1;
    }
    return res;
}
exports.createStackResources = createStackResources;
function createStack(app_data, app_types) {
    //console.log(app_data,JSON.stringify(app_data))
    var stack_names = Object.keys(app_types);
    var resource = app_types;
    var StackType = app_data.StackType;
    var stackes = {};
    for (var i = 0; i < stack_names.length; i++) {
        var stacks = rover_resources.resourceGeneration("stack", { "TemplateURL": stack_names[i] + "_Stack" + "/template.yaml" });
        stackes[stack_names[i]] = stacks;
        exec("mkdir " + exports.pwd + app_data.app_name + "/" + stack_names[i] + "_Stack");
        var resources = resource[stack_names[i]];
        var comp = {};
        var res = createStackResources(resources, app_data, StackType[i], stack_names[i], comp);
        var template1 = addResourceTemplate(res, Object.keys(res), undefined);
        if (resources.hasOwnProperty("parameter")) {
            template1["Parameters"] = resources.parameter;
            //console.log(template1)
        }
        var doc_1 = new yaml.Document();
        doc_1.contents = template1;
        var temp = replaceYAML(doc_1.toString());
        writeFile(app_data.app_name + "/" + stack_names[i] + "_Stack" + "/template.yaml", temp);
    }
    var template = addResourceTemplate(stackes, stack_names, undefined);
    var doc = new yaml.Document();
    doc.contents = template;
    writeFile(app_data.app_name + "/template.yaml", doc.toString());
}
exports.createStack = createStack;
function getAppdata(input) {
    var app_data = {};
    app_data["app_name"] = input.app_name;
    app_data["language"] = config.LanguageSupport[input.language]["version"];
    app_data["dependency"] = config.LanguageSupport[input.language]["dependency"];
    app_data["extension"] = config.LanguageSupport[input.language]["extension"];
    if (input["Stacks"] !== undefined) {
        app_data["StackType"] = Object.values(input["Stacks"]);
    }
    return app_data;
}
exports.getAppdata = getAppdata;
function generationSAM(input) {
    var app_data = getAppdata(input);
    var app_types = cliModuletoConfig(input);
    createStack(app_data, app_types);
    //console.log(input)
    exec(config.ForceRemove + input.app_name + config.LambdaDemo);
}
exports.generationSAM = generationSAM;
function addComponents(input) {
    //console.log(pwd)
    var Data = fs.readFileSync(exports.pwd + "/" + input.file_name.trim(), { encoding: "utf-8" });
    Data = Yaml.load(replaceTempTag(Data));
    if (Data.hasOwnProperty("Resources")) {
        var res_1 = {};
        var app_data_1 = getAppdata(input);
        var input2_1 = JSON.parse(JSON.stringify(input));
        input2_1.app_name = input.app_name + "_test";
        initializeSAM(input2_1);
        if (input.nested) {
            Object.keys(input.nestedComponents).map(function (ele) {
                var comp = {};
                res_1["resources"] = getComponents(input.nestedComponents[ele]["type"]);
                Data = Yaml.load(replaceTempTag(fs.readFileSync(exports.pwd + "/" + input.app_name + "/" + input.nestedComponents[ele]["path"].trim(), { encoding: "utf-8" })));
                var path = (input.app_name + "/" + input.nestedComponents[ele]["path"]).split("/");
                path.pop();
                comp["desti"] = path.join("/");
                comp["demo_desti"] = input2_1.app_name;
                var res1 = createStackResources(res_1, app_data_1, undefined, undefined, comp);
                res1 = addResourceTemplate(res1, Object.keys(res1), Data);
                var doc = new yaml.Document();
                doc.contents = res1;
                var temp = replaceYAML(doc.toString());
                writeFile(input.app_name + "/" + input.nestedComponents[ele]["path"].trim(), temp);
                //console.log(res1)
            });
        }
        else {
            var comp = {};
            res_1["resources"] = getComponents(input.components);
            comp["demo_desti"] = input2_1.app_name;
            var res1 = createStackResources(res_1, app_data_1, undefined, undefined, comp);
            res1 = addResourceTemplate(res1, Object.keys(res1), Data);
            var doc_2 = new yaml.Document();
            doc_2.contents = res1;
            var temp = replaceYAML(doc_2.toString());
            writeFile(input.file_name.trim(), temp);
        }
        removeFolder(input2_1.app_name);
    }
    else {
        console.log("wrong template structure");
    }
}
exports.addComponents = addComponents;
function getComponents(component) {
    var resources = [];
    var componentstype;
    //console.log(Object.entries(components))
    Object.entries(component).map(function (ele) {
        var componentstype = ele[1];
        JSON.parse(JSON.stringify(components.Components[componentstype])).map(function (ele) {
            resources.push(ele);
        });
    });
    return resources;
}
exports.getComponents = getComponents;
function checkNested(template) {
    var Data = Yaml.load(replaceTempTag(fs.readFileSync(exports.pwd + "/" + template.trim(), { encoding: "utf-8" })));
    var CompStacks = {};
    var checkNested = false;
    var result = {};
    var resources = Object.keys(Data["Resources"]);
    resources.map(function (ele) {
        if (Data["Resources"][ele]["Type"] === config.AWSResources.stack.type) {
            checkNested = true;
            CompStacks[ele] = Data["Resources"][ele]["Properties"]["TemplateURL"];
        }
    });
    result["checkNested"] = checkNested;
    result["CompStacks"] = CompStacks;
    return result;
}
exports.checkNested = checkNested;
//let basecrud={"Book":{"resource":"lambda","path":"/book","method":["put","get","post"],"database":"dynamodb"}}
function generateRoverAWSResource(cfjson, base) {
    var result = {};
    var optinal = Object.keys(cfjson["Properties"]);
    if (base !== undefined) {
        if (base.length > 0) {
            base.map(function (ele) {
                optinal = optinal.filter(function (e) { return e !== ele; });
            });
        }
    }
    var basejson = {
        "name": "",
        "type": cfjson["Type"],
        "attributes": ["Type", "Properties", "DependsOn"],
        "Properties": {
            "Base": base,
            "Optional": optinal
        }
    };
    result[cfjson["Type"].split("::")[cfjson["Type"].split("::").length - 1].toLowerCase()] = basejson;
    console.log(JSON.stringify(result));
}
function updatevalue(input, data) {
    var result = input.trim().split(" ");
    var val = {};
    var resvalue = (result.splice(1, result.length)).join(" ");
    var tag = result[0].replace("!", "");
    if (tag !== "Ref") {
        tag = "Fn::" + tag;
    }
    val[tag] = resvalue;
    data = data.replace(input.trim(), JSON.stringify(val));
    //console.log(result[0])
    return data;
}
function replaceTempTag(yamlinput) {
    var jsondata = yamlinput;
    var result;
    do {
        result = sub.exec(yamlinput);
        if (result !== null) {
            yamlinput = updatevalue(result[0], yamlinput);
        }
    } while (result !== null);
    return yamlinput;
}
