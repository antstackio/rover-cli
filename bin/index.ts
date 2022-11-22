const rover_utilities = require("@rover-tools/engine").rover_utilities;
const rover_config = require("@rover-tools/engine").rover_config;
let fs = require("fs");
import * as cliConfig from "../cli-main/cliConfig";
import * as util from "../cli-main/util";
const deployment = require("@rover-tools/engine").rover_deployment;
import * as buildConfig from "../cli-main/buildConfig";
import { AnyObject } from "immer/dist/internal";
const exec = require("child_process").execSync;

import { version } from "../package.json";

let res: any = [];
let resources: any = [];
let stack_resource_Name: any = [];
let AppType;
let template = {};
let config;
async function roverADD() { 
        let app_name = await util.inputString("app_name", "", false, "App Name");
        await rover_utilities.samValidate(app_name["app_name"]);
        await rover_utilities.checkFile(app_name["app_name"], "yes");
        let language = await util.languageChoice();
        let file_name = await exec("ls " + app_name["app_name"] + "/" + "*.yaml ").toString();
        let CompStacks = await rover_utilities.checkNested(file_name);
        return { "appname": app_name, "language": language, "filename": file_name,"compstack":CompStacks }
}
async function CRUDObject(stackName,AppType) {
    let crud: AnyObject = {};
    let StackParams: AnyObject = {};
    let paramModule: AnyObject = {};
    let obj: AnyObject = {};
    let tempObj = {};
    
    do {
      paramModule =   await util.params(AppType);
      paramModule["res"]["resourcetype"] = "lambda";
      paramModule["res"]["methods"].push("options");
      crud[paramModule.name] = paramModule.res;

      obj[stackName] = crud;
      tempObj = { ...tempObj, crud };
      moreStack =  await util.moreStack("Do you want to add another API ?");
    } while (moreStack !== "No");
    StackParams = { ...obj };
    
    return StackParams
} 
async function CustomObject(i) { 
  let customStacks: any = {};
  let choice = cliConfig.customizable.components;
  let customstack_name = await util.inputString(`customStackName${i}`,"",false,`Stack ${i} Name: `);
  let CustomStacks = await util.multichoice("app_type", choice);
  customStacks[customstack_name[`customStackName${i}`]] = CustomStacks.app_type;
  return customStacks
} 
async function createModules(app_name,language) {
            let stack_names: any = {};
            let customStacks: any = {};
            let paramModule: AnyObject = {};
            let basecrud: AnyObject = {};
            let StackParams: any = {};
            let moreStack: any;
            let stackname: object = {};
            let i = 1;
            let obj: AnyObject = {};
            do {
              let app_Types: any = [];
              let AppType: string = await util.appType("Module Type :");
              if (AppType !== "Customizable") {
                  stackname[`stackName${i}`] =rover_utilities.makeid(5)+"_";
                  let stack_name = stackname;
                  let stackName: string = stack_name[`stackName${i}`];
                  if (AppType === "CRUD") {
                    StackParams = { ...StackParams,... await CRUDObject(stackName,AppType)}; 
                  } else {
                    
                    obj[stackName] = basecrud;
                    StackParams = { ...obj ,...StackParams};
                  }
                  stack_names[stack_name[`stackName${i}`]] = AppType;
              } else {
                customStacks = {...customStacks, ... await CustomObject(i) }
              }
              moreStack = await util.moreStack(
                "Do you want to add one more modules ? "
              );
              i++;
            } while (moreStack !== "No");
            
              template = { ...app_name, language };
              if (stack_names !== null)
                template = { ...template, Stacks: stack_names, StackParams };
              if (customStacks !== null)
                template = { ...template, CustomStacks: customStacks };
              return template
  
}
async function listProfiles() {
  let profiles = (exec("aws configure list-profiles").toString()).split("\n")
  if (profiles[profiles.length - 1] == "") profiles.splice(profiles.length - 1, 1)
  return profiles
}
async function run(argv: AnyObject) {
  try {
    if (rover_utilities.npmrootTest()) {
      const commandError = `rover ${argv.join(
        " "
      )} -is not a rover command \n  rover init   - creates new SAM project \n  rover deploy - deploys SAM project\n rover -v or rover --version - gives installed rover version` ;
      if (argv.length === 1) {
        if (argv.length === 1 && argv[0] === "init") {
          let editedSam = await util.confirmation();
          if (editedSam === "create new SAM project") {
            let app_name: object = await util.inputString(
              "app_name",
              "",
              false,
              "App Name:"
            );
            await rover_utilities.checkFile(app_name["app_name"], "no");
            let language = await util.languageChoice();
            
            template = await createModules(app_name, language)
             await rover_utilities.generateSAM({ template }["template"]);
            
          } else if (editedSam === "add components to existing SAM") {

            let app_name = await util.inputString("app_name","",false,"App Name");
            await rover_utilities.checkFile(app_name["app_name"], "yes");
            let language = await util.languageChoice();
            let file_name = await exec("ls " + app_name["app_name"] + "/" + "*.yaml ").toString();
            let CompStacks = await rover_utilities.checkNested(file_name);
            let nestedComponents: AnyObject = {};
            let choice = Object.keys(CompStacks["CompStacks"]);
            let choiceLength = 0;

            do {
              let nested = CompStacks["checkNested"];
              choiceLength = choice.length;
              if (nested) {
                let chooseStack = await util.inputType("Select the module to which you want to add the components ", choice);
                let selectedchoice = choice.filter((ele) =>Object.values(chooseStack).includes(ele));
                let componentChoice = cliConfig.customizable.components;
                let components = await util.multichoice("components",componentChoice);
                let path = CompStacks["CompStacks"][selectedchoice[0]];
                nestedComponents[selectedchoice[0]] = {
                  ...components,
                  path: path
                };
                template = {
                  ...app_name,
                  language,
                  nested,
                  file_name,
                  nestedComponents
                };
              } else {
                let choice = cliConfig.customizable.components;
                let Compnents = await util.multichoice("components", choice);
                template = { ...app_name, language };
                if (customStacks !== null)
                  template = {
                    ...template,
                    file_name,
                    ...Compnents
                  };
              }
              
              moreStack = await util.moreStack(
                "Do you want to add one more components to modules ?"
              );
              
              i++;
            } while (moreStack !== "No" || choiceLength === 0);
            await rover_utilities.addComponents(template);
          } else if (editedSam === "add modules to existing SAM") {
            let res = await roverADD()
            let app_name = res["appname"]
            let language =res["language"]
            let file_name =res["filename"]
             
            template = await createModules(app_name , language)
            template["file_name"] = file_name
            await rover_utilities.addModules(template);
          }
        } else if (argv[0] === "deploy") {
          let r = await util.inputType("choice", "pipeline", "Deploy through:");
          r = r["choice"];
          if (r === "repository and pipeline") {
            console.log("Work in progress...");
          } else if (r === "generate pipeline") {
            await rover_utilities.samValidate(undefined);
            let lang: string = await rover_utilities.langValue();
            let pipeline = await util.samBuild(lang);
            let repoConfig = { ...pipeline };
            template = { ...template, repoConfig };
            let repoconfig = await Promise.resolve(util.jsonCreation(template));
            if (repoconfig !== undefined) {
              
              await deployment.setupRepo(JSON.parse(repoconfig)["repoConfig"]);
              rover_utilities.generateRoverConfig("",JSON.parse(repoconfig)["repoConfig"],"rover_generate_pipeline")
            }
          } else {
            await rover_utilities.samValidate(undefined);
            if (fs.existsSync("samconfig.toml")) {
              exec("rm -rf samconfig.toml");
            }
            let profiles=await listProfiles()
            let filenamearray = exec("pwd").toString().split("/");
            let file_name = filenamearray[filenamearray.length - 1].replace(
              "\n",
              ""
            );
            let stack_name = await util.inputString(
              "stack_name",
              "",
              true,
              "Stack Name(optional) :"
            );
            let bucketName = await util.inputString(
              "name",
              "",
              true,
              "Bucket Name(optional) :"
            );
            let choice = buildConfig.samConfig.choices.deploymentregion;
            let profile = (await util.inputType("AWS profile", profiles))["AWS profile"]
            console.log(profile)
            let deploymentregion = await util.inputType(
              "Deployment region",
              choice
            );
            if (bucketName["name"] == "") {
              bucketName = " --resolve-s3 ";
            } else {
              bucketName = " --s3-bucket " + bucketName["name"];
            }
            if (stack_name["stack_name"] == "") {
              stack_name = file_name + "roverTest";
            } else {
              stack_name = stack_name["stack_name"];
            }
            let region = deploymentregion["Deployment region"];

            exec("sh " + rover_config.npmroot + "/@rover-tools/cli/cli-main/exec.sh " + file_name + " " + stack_name + " " + region + " " + bucketName + " "+profile);
            
            let configdata = {}
            configdata["bucket"] = bucketName
            configdata["stack name"] = stack_name
            configdata["region"] = region
            configdata["profile"] = profile
            rover_utilities.generateRoverConfig("",configdata,"rover_deploy_cli")
          }
        } else if (argv[0] === "-v" || argv[0] === "--version") {
          // show current package version in the console
          console.log(version);
        } else {
          console.log(commandError);
        }
      } else {
        console.log(commandError);
      }
    } else {
      console.log(
        "Note: install @rover-tools/cli globally (install @rover-tools/cli -g)"
      );
    }
  } catch (error) {
    console.log("Error: ", error);
  }
}
export let stackNames: any = stack_resource_Name;
let moreStack;
let customStacks: AnyObject;
let i: number;

run(process.argv.slice(2));
