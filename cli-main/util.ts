
import * as init from "../bin/index";
import * as inquirer from "inquirer";
import * as cliConfig from "./cliConfig";
import * as buildConfig from "./buildConfig";
let fs = require("fs");
let Yaml = require("js-yaml");
const exec = require("child_process").execSync;
const moduleParams = require("@rover-tools/engine").rover_modules;
const Stack = require("@rover-tools/engine").rover_modules;
import { AnyArray, AnyObject } from "immer/dist/internal";
const rover_utilities=  require("@rover-tools/engine").rover_utilities;
const TOML = require('@iarna/toml')
let pythonpattern=new RegExp(/python[1-9]*\.[1-9]*/g)
let jspattern=new RegExp(/nodejs[1-9]*\.[a-zA-Z]*/g)
let yamlpattern=new RegExp(/(\.yaml$)/g)
let apipathpattern=new RegExp(/^\/[a-zA-Z]*(\/[a-zA-Z]*-*)*/g)

export let s3Choice:any = [];
export let accesskey:any,secretkey:any;

export let multichoice = async function (name:string, choice:any) {
  let r = await inquirer.prompt([
    {
      type: "checkbox",
      message:  "Please select your "+ name.charAt(0).toUpperCase() + name.slice(1)+" :",
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

  try {
    const content = JSON.stringify(obj, null, 2);
    return content
  } catch (err) {
    console.log(err);
  }
};

export let inputString = async function (userName: string,defaults:string, message = "") {
  let takeInput = await inquirer.prompt([
    {
      type: "input",
      name: userName,
      message: message,
      validate: function (value) {
        if (userName=="path"){
        let pass = apipathpattern.test(value)
        if (pass) {
          return true
        }
        return "Please enter a valid path"
        }else{
          return true
        }
      
    },
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
      type: "input",
      message: `Please enter the required number of ${displayname} you want ?`,
      name: `${userName}`,
      validate: function (value) {
        let pass = !isNaN(value)
        if (pass) {
          return true
        }
        return 'Please enter a valid number'
       
      },
    },
  ])
 
  return parseInt(takeInput[`${userName}`],10);
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
    else return true;
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
  let res:AnyObject = {};
  for (let sobj of subObj) {
    if (sobj.value === "object") {
      let resp = await inputCli(obj, obj[sobj.key], choiceOption);
      res = { ...res, [sobj.key]: resp };
    } else if (sobj.value === "choice") {
      let choice = obj.choices[sobj.key];
      let r = await inputType(sobj.key, choice,sobj.message);
      res[`${sobj.key}`] = r;
    } else if (sobj.value === "choiceOption") {
      let choice = obj.choiceOption[sobj.key];
      let p = await inputType(sobj.key, choice,sobj.message);

      if (p === "String") {
        let r = await inquirer.prompt([
          {
            type: "input",
            message: `${choiceOption === "" ? "" : choiceOption + "->"}${
              sobj.message
            }`,
            name: `${sobj.key}`,
          },
        ]);
        res = { ...res, ...r };
      } else {
        let r = await inputCli(obj, obj[p], sobj.key);
        let temp:AnyObject = {};
        temp[`${p}`] = { r };

        res[`${sobj.key}`] = { ...temp };
      }
    } else if (sobj.value === "list") {
      let r = await inputNumber(sobj.key,sobj.message );
      let codeUriArr: any = [];
      for (let j = 0; j < r; j++) {
        let r = await inquirer.prompt([
          {
            type: "input",
            message: `${choiceOption === "" ? "" : choiceOption + "->"}${
              sobj.message
            }`,
            name: `${sobj.key}`,
          },
        ]);
        codeUriArr.push(r[`${sobj.key}`]);
      }
      res[`${sobj.key}`] = codeUriArr;
    } else if (sobj.value === "Boolean") {
      let r = await inquirer.prompt([
        {
          type: "confirm",
          name: `${sobj.key}`,
          message: `DO you want ${sobj.message} property  to be enabled`,
        },
      ]);

      res[`${sobj.key}`] = r;
    } else if (sobj.value === "objectList") {
      let p = await inputNumber(sobj.key,sobj.message);
      let objListArr: any = [];
      while (p-- !== 0) {
        let temp = await inputCli(obj, obj[sobj.key], sobj.key);
        objListArr.push(temp);
      }

      res[`${sobj.key}`] = objListArr;
    } else if (sobj.value === "multipleChoice") {
      if (sobj.key === "Action") {
        let choice = init.stackNames.map(({ key, value }) => value);
        choice = choice.filter((item, pos) => choice.indexOf(item) == pos);
        let p = await inputType(sobj.key, choice,sobj.message);
        choice = obj.choices[p];

        let r = await multichoice(p, choice);

        let actionArr = r[p].map((ele) => `${p}:${ele}`);
        res = { Action: actionArr };
      } else {
        let choice = obj.choices[sobj.key];
        let r = await multichoice(sobj.key, choice,);
        res = { ...res, ...r };
      }
    } else if (sobj.value === "choiceReference") {
      let choice = init.stackNames.map(({ key, value }) => value);
      choice = choice.filter((item, pos) => choice.indexOf(item) == pos);
      if (
        (sobj.key === "resource" || sobj.key === "Ref") &&
        choice.length > 0
      ) {
        let p = await inputType(sobj.key, choice);
        let choiceNames = init.stackNames
          .filter(({ key, value }) => value === p)
          .map(({ key, value }) => key);
        let r = await inputType(p, choiceNames);
        
        res[`${sobj.key}`] = r;
      } else if (sobj.key === "role" && choice.indexOf("iamrole") !== -1) {
        let choiceNames = init.stackNames
          .filter(({ key, value }) => value === "iamrole")
          .map(({ key, value }) => key);
        res[sobj.key] = choiceNames[0];
      } else {
        let name = await inputString("name","", `${sobj.message}-->Name`);
        
        let temp = name;

        res[`${sobj.key}`] = temp.name;       
      }
    } else if (sobj.value === "choiceList") {
      let choice = obj.choices[sobj.key];

      let p = await inputType(sobj.key, choice,sobj.message);

      let s = {};

      if (p) {
        let r = await inputCli(obj, obj[p], sobj.key);
        let temp:AnyObject = {};
        if (p === "GetAtt") {
          let FnGetAtt: any = [];
          FnGetAtt.push(r["Fn::GetAtt"]);
          FnGetAtt.push("Arn");
          temp = { FnGetAtt }; 
        } else if (p === "Ref") {
          temp = { ...r };
        } else {
          temp[`${p}`] = { ...r };
        }

        res[`${sobj.key}`] = { ...temp };
      }
    }else if(sobj.key==='accesskey' || sobj.key==='secretkey'){
      let r = await inquirer.prompt([
        {
          type: 'password',
          message: `${choiceOption === "" ? "" : choiceOption + "->"}${
            sobj.message
          }`,
          name: `${sobj.key}`,
        },
      ]);
      res = { ...res, ...r };
      accesskey = r[sobj.key];
    } else {  
      let r = await inquirer.prompt([
        {
          type: "input",
          message: `${choiceOption === "" ? "" : choiceOption + "->"}${
            sobj.message
          }`,
          name: `${sobj.key}`,
        },
      ]);
      res = { ...res, ...r };
    }
    
  }
  return res;
};
export let password = async function(userName:string,message:string=""){
  let r = await inquirer.prompt([{
    type:'password',
    message:message,
    name:userName,
  }])
  return r;
}

export let samBuild = async function (lang) {
  let obj = buildConfig.samConfig;
  let subObj = buildConfig.samConfig.samBuild;
  let sam:object = await inputCli(obj, subObj, "");
  let temp:object={}
  Object.values(sam).map(ele=>{
Object.assign(temp,ele)
  })
  sam=temp
  sam["language"]=lang
  let no_of_env = await inputNumber("no_of_env","environments/branch");
  let envs: string[] = [];
  let steps: any = {};
  let stacknames: any = {};
  let deploymentregion: any = {};
  let deploymentparameters: any = {};
  let depBucketNames: any = {};
  for (let i = 1; i <= no_of_env; i++) {
    let env = await inputString(`env${i}`,"",`Envrionment ${i} :`);
    let envName = env[`env${i}`];
    envs.push(envName);
    let stepsChoice = buildConfig.samConfig.choices.dev;
    let step = await multichoice("steps required for "+`${envName}`+" environment " , stepsChoice);
    let steps1:object={}
    step=Object.keys(step).map(ele=>{
      let name:string=ele.replace("steps required for ","")
      name=name.replace(" environment ","")
      steps1[name] =step[ele]
    })

    let stackname = await inputString(
      `${envName}`,
      "",
      `Stack Name(optional) --> ${envName} :`
    );
    let deploymentbucket = await inputString(
      `${envName}`,
      "",
      `Deployment Bucket(optional) --> ${envName} :`
    );
    let regionChoice = buildConfig.samConfig.choices.deploymentregion;
    let deployment_region = await inputType(`${envName}`, regionChoice,"Deployment Region");
    let deployment_parameter = await inputString(
      `${envName}`,
      "",
      `Deployment Parameter(optional) --> ${envName} :`
    );
    steps = { ...steps,...steps1 };
    stacknames = { ...stacknames, ...stackname };
    depBucketNames = {
      ...depBucketNames,
      ...deploymentbucket,
    };
    deploymentregion[`${envName}`] = deployment_region[`${envName}`];
    deploymentparameters = { ...deploymentparameters, ...deployment_parameter };
    
  }
  let deployment_choice = buildConfig.samConfig.choices.deployment
    let deploymentEvent = await multichoice(`deployment events`,deployment_choice);
  let framework={"framework":"sam"}
  let result: any = {};
  result = {
    ...sam,
    no_of_env,
    ...accesskey,
    ...secretkey,
    envs,
    ...framework,
    steps,
    stackname: { ...stacknames },
    deploymentbucket: {
      ...depBucketNames,
     
    },
    deploymentregion,
    deploymentparameters,
    ...deploymentEvent,
  };
  
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
  for(let smodule of stackModule){
    if(smodule.value===r["app_Type"]){
       return smodule.key;
    }
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
  let choice:AnyObject = cliConfig.app.choices;
  let name:AnyObject ={};
  let res:AnyObject ={};
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
          let r = await inputString("name","",modulesParams[i].message);
          name = r;

        }else{
          let r =  await inputString(modulesParams[i].key,"",modulesParams[i].message)
          res = { ...res, ...r };
        }
       
    }
  }
  return {
    res,
    name: name["name"]
  }
  
  }else{
    return {}
  }


 
}else{
  return {}
}
  
  
}

export let langValue=async function () {
  
  let pwd =(process.cwd()+"/").trim()
  if(!fs.existsSync(pwd+".aws-sam/build.toml"))exec("sam build")
  let data=fs.readFileSync(pwd+".aws-sam/build.toml", { encoding: "utf-8" })
  data=TOML.parse(data)
  let langarray:AnyArray=[]
  let jsresult:AnyArray=[]
  let pyresult:AnyArray=[]
  Object.keys(data).forEach(ele=>{
    Object.keys(data[ele]).forEach(obj=>{
      if(data[ele][obj].hasOwnProperty("runtime"))langarray.push(data[ele][obj]["runtime"])})
    }
    )
  langarray.forEach(ele=>{
      if (ele.match(jspattern)!==null)jsresult.push(...ele.match(jspattern))
      if (ele.match(pythonpattern)!==null)pyresult.push(...ele.match(pythonpattern))
  
  })
  if(jsresult.length>pyresult.length) return "js"
  else if(pyresult.length>jsresult.length) return "python"
  else return "js"
  
}

export let samValidate=async function(){
  try {
    let files:AnyArray=fs.readdirSync(exec("pwd").toString().replace("\n",""))
    let yamlfiles:AnyArray=[]
    let response:AnyArray=[]
    files.map(ele=>{if (ele.match(yamlpattern)!==null)yamlfiles.push(ele)})
    yamlfiles.map(ele=>{
      let data=fs.readFileSync(ele,{ encoding: "utf-8" })
      data=Yaml.load(rover_utilities.replaceTempTag(data))
      if(data.hasOwnProperty("AWSTemplateFormatVersion")
      &&data.hasOwnProperty("Transform")
      &&data.hasOwnProperty("Description")
      &&data.hasOwnProperty("Resources")){response.push(true)
    }
    })
    if (!response.includes(true)) {
      throw new Error("SAM Template error \n")
    }
  } catch (error) {
    throw new Error("Not a SAM file  or "+error.message)
  }
  
}
export let makeid =async function () {
  const crypto = require('crypto');
  return (crypto.randomBytes(1).toString("base64url").replace(/\d/g, 'd')).toLowerCase();
}
