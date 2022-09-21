const rover_utilities=  require("@rover-tools/engine").rover_utilities;

import * as cliConfig from "../cli-main/cliConfig";
import * as util from "../cli-main/util";
const deployment= require("@rover-tools/engine").rover_deployment;
import * as buildConfig from "../cli-main/buildConfig";
import { AnyObject } from "immer/dist/internal";
const exec = require("child_process").execSync;

let res: any = [];
let resources: any = [];
let stack_resource_Name: any = [];
let AppType;
let template = {};
let config;
async function run(argv:AnyObject) {
  try{
  if(rover_utilities.npmrootTest()){
  if (argv[0] === "init") {
    let editedSam = await util.confirmation();
    if (editedSam === "create new SAM project") {
      let app_name:object = await util.inputString("app_name", "App Name:","");
      await rover_utilities.checkFile(app_name["app_name"],"no")
      let language = await util.languageChoice();
      let stack_names: any = {};
      let customStacks: any = {};
      let paramModule:AnyObject={};
      var basecrud:AnyObject={} ;
      let StackParams: any = {};
      let moreStack: any; 
      let stackname:object= {};
      let i = 1; 
      let obj:AnyObject = {};
      do{
        
        let app_Types: any = [];
        let AppType:string = await util.appType("Module Type :");
       
       
        if (AppType !== "Customizable") {
          stackname[`stackName${i}`]=util.makeid(2)
          let stack_name = stackname
          // let stack_name = await util.inputString(
          //   `stackName${i}`,
          //   `Stack ${i} Name: `,
          //   ""
          // );
          //console.log(stack_name)
          let stackName:string = stack_name[`stackName${i}`];
          if (AppType === "CRUD") {
            let crud:AnyObject={} ;
            let tempObj = {};
            do {
              paramModule = await util.params(AppType);
              paramModule["res"]["resourcetype"]='lambda'
              paramModule["res"]["methods"].push("options")
              crud[paramModule.name] = paramModule.res;
              
              obj[stackName] = crud;
              tempObj = { ...tempObj, crud };
              moreStack = await util.moreStack(
                "Do you want to add another API ?"
              );
            } while (moreStack !== "No");

           //console.log("obj",obj)
            StackParams = { ...obj };
          } else {
            paramModule = await util.params(AppType);
            obj[stackName] = basecrud;
            StackParams = { ...obj };
          }


          stack_names[stack_name[`stackName${i}`]] = AppType;
        } else {
          let choice = cliConfig.customizable.choice;
          let customstack_name = await util.inputString(
            `customStackName${i}`,
            `Stack ${i} Name: `,
            ""
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
         // console.log(JSON.stringify(template))
          await rover_utilities.generationSAM(({template})["template"]);
      };
      //await rover_utilities.generationSAM(input);
    } else if (editedSam === "add components to existing SAM") {
      
      let app_name = await util.inputString("app_name", "App Name","");
      await rover_utilities.checkFile(app_name["app_name"],"yes")
      //console.log(app_name)
      let language = await util.languageChoice();
      let file_name = await exec("ls " + app_name["app_name"] + "/" + "*.yaml ").toString();
      let CompStacks = await rover_utilities.checkNested(file_name);
      let nestedComponents:AnyObject = {};
      let choice = Object.keys(CompStacks["CompStacks"]);
      let choiceLength =0
      do {
        let nested = CompStacks["checkNested"];
        choiceLength = choice.length;
        if (nested) {
          let chooseStack = await util.inputType("Select the module to which you want to add the components ", choice);
          let selectedchoice = choice.filter((ele) => Object.values(chooseStack).includes(ele));
          choice = choice.filter((ele) => ele !== selectedchoice[0]);
          let componentChoice = cliConfig.customizable.choice;
          let components = await util.multichoice("type", componentChoice);
          let path = CompStacks["CompStacks"][selectedchoice[0]];
          nestedComponents[selectedchoice[0]] = { ...components, path: path };

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
      r=r["choice"]
      if (r === "repository and pipeline") {
        console.log("Work in progress...");
      } else if(r === "generate pipeline"){
        await util.samValidate()
        let lang:String=await util.langValue()
        let pipeline = await util.samBuild(lang);
        let repoConfig = { ...pipeline };
        template = { ...template, repoConfig };
        let repoconfig = await Promise.resolve(util.jsonCreation(template));
        if (repoconfig !== undefined) {
          //await rover_utilities.checkFile(JSON.parse(repoconfig)["repoConfig"]["app_name"],"yes")
          await deployment.setupRepo(JSON.parse(repoconfig)["repoConfig"]);
        }
      }
      else {
        await util.samValidate()
        let filenamearray=(exec("pwd").toString()).split("/")
        let file_name = filenamearray[filenamearray.length-1].replace("\n","");
        let stack_name = await util.inputString("stack_name","Stack Name(optional) :","")
        let bucketName = await util.inputString("name","Bucket Name(optional) :","");
        let choice = buildConfig.samConfig.choices.deploymentregion;
        let deploymentregion = await util.inputType("Deployment region",choice);
        if (bucketName["name"]=="") {
          bucketName=" --resolve-s3 "
        }else{
          bucketName =" --s3-bucket "+ bucketName["name"]
        }
        if (stack_name["stack_name"]=="") {stack_name=file_name+"roverTest"}else{stack_name=stack_name["stack_name"]}
        let region=deploymentregion["Deployment region"]
        // console.log(typeof stack_name,stack_name)
        exec("sh " + rover_utilities.npmroot +"/@rover-tools/cli/cli-main/exec.sh "+file_name+" "+stack_name+" "+region+" "+bucketName);
        
      }
    } else {
      console.log(
        "rover " +
          argv +
          " - not a rover command \n  rover init   - creates new SAM project \n  rover deploy - deploys SAM project"
      );
    }
  }else{
    console.log("Note: install @rover-tools/cli globally (install @rover-tools/cli -g)")
  }
}catch (error) {
  console.log("Error: ",error)
  
}
}
export let resource_type = ({} = res);
export let stackNames: any = stack_resource_Name;
let moreStack;
let customStacks:AnyObject;
let i:number;

run(process.argv.slice(2));
