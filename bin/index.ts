const rover_utilities=  require("@rover-tools/engine").rover_utilities;

import * as cliConfig from "../cli-main/cliConfig";
import * as util from "../cli-main/util";
const deployment= require("@rover-tools/engine").rover_deployment;
import * as buildConfig from "../cli-main/buildConfig";
const exec = require("child_process").execSync;
const input = {
  app_name: "dgb",
  language: "node",
  Stacks: { emailAuth: "EmailAuthModule", emailAuths: "BaseModule" ,basecrud:"CRUD"},
  CustomStacks: { },
  StackParams:{
    emailAuth:{names:"",},
    emailAuths:{},
    customone:{},
    basecrud:{"Book":{"resourcetype":"lambda","path":"/book","methods":["put","get","post"]}}},
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
      dev: ["build", "deploy"],
    },
    stackname: {
      dev: "devemail",
      test: "testemail",
    },
    deploymentbucket: {
      dev: "",
    },
    deploymentregion: {
      dev: "ap-south-1",
    },
    deploymentparameters: { dev: {} },
    deployment_event: ["push"],
  },
};
let res: any = [];
let resources: any = [];
let stack_resource_Name: any = [];
let AppType;
let template = {};
let config;
async function run(argv) {
  
  if (argv[0] === "init") {
    let editedSam = await util.confirmation();
    if (editedSam === "create new SAM project") {
      let app_name = await util.inputString("app_name", "App Name:");
      let language = await util.languageChoice();
      let stack_names: any = {};
      let customStacks: any = {};
      let paramModule;
      let basecrud = {};
      let StackParams: any = {};
      let moreStack: any; 
      let i = 1; 
      do{
        
        let app_Types: any = [];
        let AppType:any = await util.appType("Type :");
        if (AppType !== "Customizable") {
          let stack_name = await util.inputString(
            `stackName${i}`,
            `Stack ${i} Name: `
          );
          let stackName = stack_name[`stackName${i}`];
          if (AppType === "CRUD") {
            let tempObj = {};
            do {
              paramModule = await util.params(AppType);
              //console.log(paramModule);
              basecrud[paramModule.name] = paramModule.res;
              tempObj = { ...tempObj, basecrud };
              moreStack = await util.moreStack(
                "Do you want to add another API ?"
              );
            } while (moreStack !== "No");

            let obj = {};
            obj[stackName] = basecrud;
            StackParams = { ...obj };
          } else {
            paramModule = await util.params(AppType);
            let obj = {};
            obj[stackName] = basecrud;
            StackParams = { ...obj };
          }


          stack_names[stack_name[`stackName${i}`]] = AppType;
        } else {
          let choice = cliConfig.customizable.choice;
          let customstack_name = await util.inputString(
            `customStackName${i}`,
            `Stack ${i} Name: `
          );
          let CustomStacks = await util.multichoice("app_type", choice);
          customStacks[customstack_name[`customStackName${i}`]] =
            CustomStacks.app_type;
        }
        moreStack =await util.moreStack("Do you want to add one more modules ? ")
        i++
      }while(moreStack!=='No'){
        template = { ...app_name, language };
        if (stack_names !== null ) template = { ...template, Stacks: stack_names ,StackParams};
        if (customStacks !== null)
          template = { ...template, CustomStacks: customStacks };
          //console.log(JSON.stringify(template))
          await rover_utilities.generationSAM(({template})["template"]);
      };
      //await rover_utilities.generationSAM(input);
    } else if (editedSam === "add components to existing SAM") {
      
      let app_name = await util.inputString("app_name", "App Name");
      //console.log(app_name)
      let language = await util.languageChoice();
      let file_name = await exec("ls " + app_name["app_name"] + "/" + "*.yaml ").toString();
      let CompStacks = await rover_utilities.checkNested(file_name);
      let nestedComponents = {};
      let choice = Object.keys(CompStacks["CompStacks"]);
      let choiceLength =0
      do {
        let nested = CompStacks["checkNested"];
        choiceLength = choice.length;
        if (nested) {
          let chooseStack = await util.inputType("Select the module to which you want to add the components ", choice);
          choice = choice.filter((ele) => ele !== chooseStack);

          let componentChoice = cliConfig.customizable.choice;
          let components = await util.multichoice("type", componentChoice);
          let path = CompStacks["CompStacks"][chooseStack];
          nestedComponents[chooseStack] = { ...components, path: path };

          template = {
            ...app_name,
            language,
            nested,
            file_name,
            nestedComponents,
          };
        } else {
          let choice = cliConfig.customizable.choice
          let Compnents = await util.multichoice("components",choice);
          template = { ...app_name, language };
          if (customStacks !== null)
            template = {
              ...template,
              file_name,
              ...Compnents
            };
        }
        if(choiceLength===1 || !nested){
          break;
        }else{
          moreStack = await util.moreStack("Do you want to add one more components to modules ?")
        i++;
        }
        
      } while (moreStack !== "No"|| choiceLength===0)

      //console.log(JSON.stringify(template, null, 2));
      await rover_utilities.addComponents(template)
    }else if (editedSam === "add modules to existing SAM") {
      console.log("Work in progress...");
    }
    
    
  } else if (argv[0] === "deploy") {
    let r = await util.inputType("choice", "pipeline", "Deploy through:");
    if (r === "repository and pipeline") {
      let pipeline = await util.samBuild();
      let repoConfig = { ...pipeline };
      template = { ...template, repoConfig };
      let repoconfig = await Promise.resolve(util.jsonCreation(template));
      if (repoconfig !== undefined) {
        await deployment.setupRepo(JSON.parse(repoconfig)["repoConfig"]);
      }
    } else {
      let file_name = await util.inputString("app_name","File Name :");
      let stack_name = await util.inputString("stack_name","Stack Name :")
      let bucketName = await util.inputString("name","Bucket Name :");
      let choice = buildConfig.samConfig.choices.deploymentregion;
      let deploymentregion = await util.inputType("deploymentregion",choice);
      if (bucketName["name"]=="") {
        bucketName=" --resolve-s3 "
      }else{
        bucketName =" --s3-bucket "+ bucketName["name"]
      }
      if (stack_name["stack_name"]=="") {stack_name="test"}else{stack_name=stack_name["stack_name"]}
      let region=deploymentregion["deploymentregion"]
      console.log(typeof stack_name,stack_name)
      exec("sh " + rover_utilities.npmroot +"/rover-prototype/utlities/exec.sh "+file_name["app_name"]+" "+stack_name+" "+region+" "+bucketName);
    }
  } else {
    console.log(
      "rover " +
        argv +
        " - not a rover command \n  rover init   - creates new SAM project \n  rover deploy - deploys SAM project"
    );
  }
}
export let resource_type = ({} = res);
export let stackNames: any = stack_resource_Name;
let moreStack
let customStacks
let i
run(process.argv.slice(2));
