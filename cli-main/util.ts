import * as aws from "aws-sdk";
import * as init from "../bin/index";
import * as inquirer from "inquirer";
import * as cliConfig from "./cliConfig";
import * as buildConfig from "./buildConfig";

const moduleParams = require("@rover-tools/engine").rover_modules;
const Stack = require("@rover-tools/engine").rover_modules;
import * as awsConfig from "./configaws";
let config = {};
export let s3Choice:any = [];
export let accesskey:any,secretkey:any;

export let multichoice = async function (name:string, choice:any) {
  let r = await inquirer.prompt([
    {
      type: "checkbox",
      message: "Please select your components :",
      name: name,
      choices: choice,
      validate(answer) {
        if (answer.length < 1) {
          return "You must choose at least one option.";
        }

        return true;
      },
    },
  ]);
  return r;
};

export let jsonCreation = async function (obj:any) {
  const fs = require("fs/promises");

  try {
    const content = JSON.stringify(obj, null, 2);
    return content
  } catch (err) {
    console.log(err);
  }
};

export let inputString = async function (userName: string, message = "") {
  let takeInput = await inquirer.prompt([
    {
      type: "input",
      name: userName,
      message: message,
    },
  ]);

 return ({...takeInput})

};

export let languageChoice = async function () {

  let lang = await inquirer.prompt([
    {
      type: "rawlist",
      name: "language",
      message: "Choose your language",
      choices: cliConfig.app.choices.language,
    },
  ]);
 

  if (lang.language === "Node") {
    return "node"
  } else return "python";
};

export let inputType = async function (userName: string, choices:any,message="") {
  let takeInput = await inquirer.prompt([
    {
      type: "rawlist",
      name: `${userName}`,
      message :message,
      choices:
        typeof choices === "string"
          ? cliConfig.app.choices[choices]
          : choices,
    },
  ]);

  return takeInput;
};

export let confirmation = async function () {
  let r = await inquirer.prompt([
    {
      type: "rawlist",
      name: "choice",
      message: `Hey, what do you want ?`,
      choices: ["create new SAM project" , "add components to existing SAM" ,"add modules to existing SAM"],
    },
  ]);

  return r.choice;
};

export let inputNumber = async function (userName: string,message:string) {
  let displayname=userName
  if (message!==undefined ){
    displayname=message
  }
  let takeInput = await inquirer.prompt([
    
    {
      type: "number",
      message: `Please enter the required number of ${displayname} you want ?`,
      name: `${userName}`,
      validate: function (value) {
        if (isNaN(value)) {
          return "Please  enter valid number";
        } else {
          return true;
        }
      },
    },
  ]);

  return takeInput[`${userName}`];
};

export let validates = function (
  value: any,
  type: any,
  min = "",
  max = "",
  pattern = ""
) {
  if (type === "string") {
    if (typeof value !== "string" && min >= value.length && max <= value.length)
      return "Please enter valid text";
    else true;
  } else if (type === "number") {
    if (isNaN(value) && min >= value && max <= value) {
      return "Please  enter valid number";
    } else {
      return true;
    }
  }
};

export let inputCli = async function (
  obj:any,
  subObj:any,
  choiceOption:any,
  resource = ""
) {
  let res = {};
  for (let i = 0; i < subObj.length; i++) {
    if (subObj[i].value === "object") {
      let resp = await inputCli(obj, obj[subObj[i].key], choiceOption);
      res = { ...res, [subObj[i].key]: resp };
    } else if (subObj[i].value === "choice") {
      let choice = obj.choices[subObj[i].key];
      let r = await inputType(subObj[i].key, choice,subObj[i].message);
      res[`${subObj[i].key}`] = r;
    } else if (subObj[i].value === "choiceOption") {
      let choice = obj.choiceOption[subObj[i].key];
      let p = await inputType(subObj[i].key, choice,subObj[i].message);

      if (p === "String") {
        let r = await inquirer.prompt([
          {
            type: "input",
            message: `${choiceOption === "" ? "" : choiceOption + "->"}${
              subObj[i].message
            }`,
            name: `${subObj[i].key}`,
          },
        ]);
        res = { ...res, ...r };
      } else {
        let r = await inputCli(obj, obj[p], subObj[i].key);
        let temp = {};
        temp[`${p}`] = { r };

        res[`${subObj[i].key}`] = { ...temp };
      }
    } else if (subObj[i].value === "list") {
      let r = await inputNumber(subObj[i].key,subObj[i].message );
      let codeUriArr: any = [];
      for (let j = 0; j < r; j++) {
        let r = await inquirer.prompt([
          {
            type: "input",
            message: `${choiceOption === "" ? "" : choiceOption + "->"}${
              subObj[i].message
            }`,
            name: `${subObj[i].key}`,
          },
        ]);
        codeUriArr.push(r[`${subObj[i].key}`]);
      }
      res[`${subObj[i].key}`] = codeUriArr;
    } else if (subObj[i].value === "Boolean") {
      let r = await inquirer.prompt([
        {
          type: "confirm",
          name: `${subObj[i].key}`,
          message: `DO you want ${subObj[i].message} property  to be enabled`,
        },
      ]);

      res[`${subObj[i].key}`] = r;
    } else if (subObj[i].value === "objectList") {
      let p = await inputNumber(subObj[i].key,subObj[i].message);
      let objListArr: any = [];
      while (p-- !== 0) {
        let temp = await inputCli(obj, obj[subObj[i].key], subObj[i].key);
        objListArr.push(temp);
      }

      res[`${subObj[i].key}`] = objListArr;
    } else if (subObj[i].value === "multipleChoice") {
      if (subObj[i].key === "Action") {
        let choice = init.stackNames.map(({ key, value }) => value);
        choice = choice.filter((item, pos) => choice.indexOf(item) == pos);
        let p = await inputType(subObj[i].key, choice,subObj[i].message);
        choice = obj.choices[p];

        let r = await multichoice(p, choice);

        let actionArr = r[p].map((ele) => `${p}:${ele}`);
        res = { Action: actionArr };
      } else {
        let choice = obj.choices[subObj[i].key];
        let r = await multichoice(subObj[i].key, choice,);
        res = { ...res, ...r };
      }
    } else if (subObj[i].value === "choiceReference") {
      let choice = init.stackNames.map(({ key, value }) => value);
      choice = choice.filter((item, pos) => choice.indexOf(item) == pos);
      if (
        (subObj[i].key === "resource" || subObj[i].key === "Ref") &&
        choice.length > 0
      ) {
        let p = await inputType(subObj[i].key, choice);
        let choiceNames = init.stackNames
          .filter(({ key, value }) => value === p)
          .map(({ key, value }) => key);
        let r = await inputType(p, choiceNames);
        
        res[`${subObj[i].key}`] = r;
      } else if (subObj[i].key === "role" && choice.indexOf("iamrole") !== -1) {
        let choiceNames = init.stackNames
          .filter(({ key, value }) => value === "iamrole")
          .map(({ key, value }) => key);
        res[subObj[i].key] = choiceNames[0];
      } else {
        let name = await inputString("name", `${subObj[i].message}-->Name`);
        let stack_names = await inputType("stack_resource", "resource",subObj[i].message);
        
        let temp = name;

        res[`${subObj[i].key}`] = temp.name;

       

       
      }
    } else if (subObj[i].value === "choiceList") {
      let choice = obj.choices[subObj[i].key];

      let p = await inputType(subObj[i].key, choice,subObj[i].message);

      let s = {};

      if (p) {
        let r = await inputCli(obj, obj[p], subObj[i].key);
        let temp = {};
        if (p === "GetAtt") {
          let FnGetAtt: any = [];
          FnGetAtt.push(r["Fn::GetAtt"]);
          FnGetAtt.push("Arn");
          temp = { FnGetAtt }; //"Fn::GetAtt": ["PostSignup","Arn"]
        } else if (p === "Ref") {
          temp = { ...r };
        } else {
          temp[`${p}`] = { ...r };
        }

        res[`${subObj[i].key}`] = { ...temp };
      }
    }else if(subObj[i].key==='accesskey' || subObj[i].key==='secretkey'){
      let r = await inquirer.prompt([
        {
          type: 'password',
          message: `${choiceOption === "" ? "" : choiceOption + "->"}${
            subObj[i].message
          }`,
          name: `${subObj[i].key}`,
        },
      ]);
      res = { ...res, ...r };
      accesskey = r[subObj[i].key];
    } else {  
      let r = await inquirer.prompt([
        {
          type: "input",
          message: `${choiceOption === "" ? "" : choiceOption + "->"}${
            subObj[i].message
          }`,
          name: `${subObj[i].key}`,
        },
      ]);
      res = { ...res, ...r };
     
       

      
    }
    
  }
  return res;
};
export let password = async function(userName,message:string=""){
  let r = await inquirer.prompt([{
    type:'password',
    message:message,
    name:userName,
  }])
  return r;
}

export let samBuild = async function () {
  let obj = buildConfig.samConfig;
  let subObj = buildConfig.samConfig.samBuild;
  let sam = await inputCli(obj, subObj, "");
  let accesskey = await password("accesskey","Accesskey:");
  let secretkey = await password("secretkey","Secretkey:")
  let no_of_env = await inputNumber("no_of_env","Environments(dev,test)");
  let envs: string[] = [];
  let steps: any = {};
  let stacknames: any = {};
  let deploymentregion: any = {};
  let deploymentparameters: any = {};
  let deployment_event: any = {};
  let deployementbuckets: any = {};
  let depBucketNames: any = {};
  for (let i = 1; i <= no_of_env; i++) {
    let env = await inputString(`env${i}`,`Envrionment ${i} :`);
    let envName = env[`env${i}`];
    envs.push(envName);
    let stepsChoice = buildConfig.samConfig.choices.dev;
    let step = await multichoice(`${envName}`, stepsChoice);
    let stackname = await inputString(
      `${envName}`,
      `Stack Name --> ${envName} :`
    );
    let deploymentbucket = await inputString(
      `${envName}`,
      `Deployment Bucket --> ${envName} :`
    );
    let regionChoice = buildConfig.samConfig.choices.deploymentregion;
    let deployment_region = await inputType(`${envName}`, regionChoice,"Deployment Region");
    let deployment_parameter = await inputString(
      `${envName}`,
      `Deployment Parameter--> ${envName} :`
    );
   
   

    steps = { ...steps, ...step };
    stacknames = { ...stacknames, ...stackname };
    depBucketNames = {
      ...depBucketNames,
      ...deploymentbucket,
    };
    deploymentregion[`${envName}`] = deployment_region;
    deploymentparameters = { ...deploymentparameters, ...deployment_parameter };
    
  }
  let deployment_choice = buildConfig.samConfig.choices.deployment
    let deploymentEvent = await multichoice(`deployment_event`,deployment_choice);
    
  let result: any = {};
  result = {
    ...sam,
    no_of_env,
    ...accesskey,
    ...secretkey,
    envs,
    steps,
    stackname: { ...stacknames },
    deploymentbucket: {
      ...depBucketNames,
     
    },
    deploymentregion,
    deploymentparameters,
    ...deploymentEvent,
  };

  //console.log(JSON.stringify(result, null, 2));
 
  
  return result;
};

export let appType = async function(message:string=""){
  let r = await inquirer.prompt([{
    type:'rawlist',
    name:"app_Type",
    message:message,
    choices:cliConfig.app.choices.type
  }])
  let stackModule = Stack.ModuleDescription;
  for(let i=0;i<stackModule.length;i++){
    if(stackModule[i].value===r["app_Type"]){
       return stackModule[i].key;
    ;}
  }
}
export let moreStack = async function(message:string){
  let r = await inquirer.prompt([{
    type:'list',
    name:'stack',
    message:message,
    choices:["Yes","No"]
  }])
  return r['stack'];
}

export let params = async function(module:string){
  let choice = cliConfig.app.choices;
  let params = {}
  let name ={};
  let res ={};
if(module==="CRUD"){
  let modulesParams= moduleParams.ModuleParams.CRUD.params;
  let paramslength = modulesParams.length;
  if(paramslength>0){
    
    for(let i=0;i<paramslength;i++){
     
       if(modulesParams[i].value==="choice"){
        let r = await inputType(modulesParams[i].key,choice[modulesParams[i].key],modulesParams[i].message);
        
        res = { ...res, ...r };
        
       }else if(modulesParams[i].value==="multichoice"){
        let r = await multichoice(modulesParams[i].key,choice.methods);
        res = { ...res, ...r };
       }else{
       
        if(modulesParams[i].key==="name"){
          let r = await inputString("name",modulesParams[i].message);
          name = r;

        }else{
          let r =  await inputString(modulesParams[i].key,modulesParams[i].message)
          res = { ...res, ...r };
        }
       
    }
  }
  return params ={
    res,
    name: name["name"]
  }
  
  }else{
    return
  }


 
}else{
  return {}
}
  
  
}