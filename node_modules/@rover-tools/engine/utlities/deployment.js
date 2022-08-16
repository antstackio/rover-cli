"use strict";
exports.__esModule = true;
exports.setupRepo = void 0;
var exec = require("child_process").execSync;
var spawn = require("child_process").spawn;
var process = require('process');
var rover_utilities = require("../utlities/utilities");
function setupRepo(repoconfig) {
    var appname = repoconfig.app_name;
    exec("gh repo create " + appname + " --" + repoconfig.repoType + " --clone");
    repoconfig = JSON.stringify(repoconfig);
    exec("mkdir " + appname + "/.github");
    exec("mkdir " + appname + "/.github/workflows");
    exec("python3 " + rover_utilities.npmroot + "/rover-engine/pipeline/pipelinegenerator.py " + appname + "/.github/workflows/main.yml " + appname + "/region.txt " + appname + "/accesskey.txt " + appname + "/secret.txt " + "'" + repoconfig + "'");
    process.chdir(appname);
    exec("gh secret set AWS_ACCESS_KEY_ID < accesskey.txt");
    exec("gh secret set AWS_SECRET_ACCESS_KEY < secret.txt");
    exec("gh secret set AWS_REGION < region.txt");
    exec("rm -rf accesskey.txt");
    exec("rm -rf secret.txt");
    exec("rm -rf  region.txt");
    exec("sh /Users/dheerajbhatt/Documents/GitHub/rover-engine/utlities/commit.sh " + appname);
}
exports.setupRepo = setupRepo;
//setupRepo("testres","public")
