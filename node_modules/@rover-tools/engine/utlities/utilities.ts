import * as config  from "./config"
import * as rover_resources  from "../resources/resources"
import * as logics  from "../resources/logics"
import * as modules  from "../resources/modules"
import * as components  from "../resources/components"
import { json } from "node:stream/consumers";
import { AnyArray, AnyObject } from "immer/dist/internal";
const exec = require("child_process").execSync;
const yaml = require("yaml");
var fs = require("fs");
export let  pwd =process.cwd()+"/"
let doc = new yaml.Document();
const sub  = new RegExp(/(!Sub|!Transform|!Split|!Join|!Select|!FindInMap|!GetAtt|!GetAZs|!ImportValue|!Ref)\s[a-zA-Z0-9 !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*\n/g);

let Yaml = require("js-yaml");
export let npmroot=exec(" npm root -g").toString().trim()
export  function writeFile(path, data){ 
     fs.writeFileSync(pwd+"/"+path,data);
}
export  function installDependies(path,packages,dependency){ 
    
    if (dependency=="npm") {
        packages.map(ele=>{
            exec("npm --prefix "+pwd+path+" install "+ele+" --save")
            console.log("npm --prefix "+pwd+path+" install "+ele+"")
        })
        
    }
    
}
export  function addResourceTemplate(resources, name,temp){ 
    let template
    if (temp==undefined) {
        template=rover_resources.skeleton()
    }else{
        template=temp
    }
   
        for(let  i in name){ 
            template["Resources"][name[i]]=resources[name[i]]
        }
        return template   
}
export function replaceYAML(doc){
    let yamlArray = {
        // "off": "'off'",
        // "on": "'on'",
        // "yes":"'yes'",
        // "no":"'no'",
        "OFF": "'OFF'",
        // "ON": "'ON'",
        // "YES":"'YES'",
        // "NO":"'NO'",
    }
    Object.keys(yamlArray).map((key)=> {
        doc=doc.replace(key, yamlArray[key])
    });
    return doc
}
export function initializeSAM(input){
    
    let app_name=input.app_name
    removeFolder(input.app_name)
    let language= config.LanguageSupport[input.language]["version"]
    let dependency=config.LanguageSupport[input.language]["dependency"]
    let extension=config.LanguageSupport[input.language]["extension"]
    //console.log(config.SAMInitBase+config.SAMLanguage+language+config.SAMDependency+dependency+config.SAMAppName+app_name+config.SAMAppTemplate)
    exec(config.SAMInitBase+config.SAMLanguage+language+config.SAMDependency+dependency+config.SAMAppName+app_name+config.SAMAppTemplate)
    moveFolder(pwd+input.app_name+"/hello-world ",pwd+input.app_name+"/"+"lambda_demo")
    //console.log(input)
    
}
export function copyLambdaLogic(source,desti){
    exec("cp -r "+source+desti)
}
export function moveFolder(source,desti) {
    exec("mv "+source+desti)
}
export function removeFolder (path) {
    exec(config.ForceRemove+path)
}
export function generateLambdafiles(logic,app_data,resources,stacktype,stackname,j) {
    let code
    
    if(logic){
        
        if (resources["resources"][j].hasOwnProperty("logicpath")) {
            code =logics.LambdaLogics[app_data.language][resources["resources"][j]["logicpath"]]
            
        }else{
            if(resources["type"]=="components"|| stacktype==undefined ){
                code =logics.LambdaLogics[app_data.language][resources["resources"][j]["name"]]
            }else{
                code =logics.LambdaLogics[app_data.language][stacktype+"_"+resources["resources"][j]["name"]]
            }

        }
        
        if (code!==undefined){
            let path
            if (stackname==undefined) {
                path=app_data.app_name+"/"+resources["resources"][j]["name"]+"/"
                if (resources["resources"][j].hasOwnProperty("package")) {
                    installDependies(path,resources["resources"][j]["package"],app_data.dependency)
                }
                path=path+"app"+app_data.extension
                
            }else{
                path=app_data.app_name+"/"+stackname+"_Stack"+"/"+resources["resources"][j]["name"]+"/"
                if (resources["resources"][j].hasOwnProperty("package")) {
                    installDependies(path,resources["resources"][j]["package"],app_data.dependency)
                }
                path=path+"app"+app_data.extension
            }
        writeFile(path,code)
        }
    }     
}
export function cliModuletoConfig(input){
   initializeSAM(input)
    let app_types:AnyObject={}
    if( Object.keys(input["Stacks"]).length>0){
        Object.keys(input["Stacks"]).map(ele =>{
            let stackdata:AnyObject={}
            if(input["Stacks"][ele]=="CRUD"){
                stackdata=modules.StackType[input["Stacks"][ele]](ele,input["StackParams"][ele])
                //console.log(JSON.stringify(res))
                    
            }else if(input["Stacks"][ele]=="RDS"){
                stackdata=modules.StackType[input["Stacks"][ele]](ele,{})
            }
            else{
                stackdata=JSON.parse(JSON.stringify(modules.StackType[input["Stacks"][ele]]))
            }
                Object.keys(stackdata).map(ele1=>{
                app_types[ele+ele1]=stackdata[ele1]
                app_types[ele+ele1]["type"]="module"
            })
            
            
        })
    }
    if( Object.keys(input["CustomStacks"]).length>0){
        Object.keys(input["CustomStacks"]).map(ele =>{
            let resources:AnyArray=[]
            input["CustomStacks"][ele].map(ele=>{
                JSON.parse(JSON.stringify(components.Components[ele])).map(ele=>{
                    resources.push(ele)
                })
                }
            )
            app_types[ele]={}
            app_types[ele]["resources"]=resources
            app_types[ele]["type"]="components"
        })
    }
    //console.log(JSON.stringify(app_types))
    return app_types
}
export function createStackResources(resources,app_data,StackType,stack_names,comp){
        //console.log("StackType",StackType)
        let res={}
    for(let j in  resources["resources"]){ 
        let configs=resources["resources"][j]["config"]
        let logic=resources["resources"][j]["logic"]
        
        if(config.AWSResources[resources["resources"][j]["type"]].hasOwnProperty("name")){
            let name=(resources["resources"][j]["name"]).replace(" ","")
            name=name.replace(/[^a-z0-9]/gi, '');

            configs[config.AWSResources[resources["resources"][j]["type"]]["name"]]=name
        }
        if(resources["resources"][j]["type"]=="lambda"){ 
            let path
            let path2
            if (stack_names==undefined) {
                if (comp.demo_desti!==undefined) {
                    path=pwd+comp.demo_desti+"/"+"lambda_demo"+"/ "
                path2=pwd+app_data.app_name+"/"+resources["resources"][j]["name"]+"/"
                    
                }if (comp.desti!==undefined) {
                    path=pwd+comp.demo_desti+"/"+"lambda_demo"+"/ "
                path2=pwd+comp.desti+"/"+resources["resources"][j]["name"]+"/"
                //console.log(path,path2)
                }
            }else{
                path=pwd+app_data.app_name+"/"+"lambda_demo"+"/ "
                path2=pwd+app_data.app_name+"/"+stack_names+"_Stack"+"/"+resources["resources"][j]["name"]+"/"
            }
            copyLambdaLogic(path,path2)
            generateLambdafiles(logic,app_data,resources,StackType,stack_names,j)
            configs["CodeUri"]=resources["resources"][j]["name"]+"/"
            configs["Runtime"]=app_data.language
        }else if(resources["resources"][j]["type"]=="apigateway"){
            exec("mkdir "+pwd+app_data.app_name+"/"+stack_names+"_Stack"+"/"+resources["resources"][j]["name"]+"_apigateway")
            configs["path"]=resources["resources"][j]["name"]+"_apigateway"+"/swagger.yaml"
            configs["filepath"]=app_data.app_name+"/"+stack_names+"_Stack"+"/"+resources["resources"][j]["name"]+"_apigateway"+"/swagger.yaml"
        }
        let resources1=rover_resources.resourceGeneration(resources["resources"][j]["type"],configs)
        res[resources["resources"][j]["name"]] = resources1
    }
    return res
}
export  function createStack(app_data,app_types){
    //console.log(app_data,JSON.stringify(app_data))
    let stack_names = Object.keys(app_types)
    let resource=app_types
    let StackType = app_data.StackType
    let stackes={}
    for( let i=0;i< stack_names.length;i++){ 
        let stacks= rover_resources.resourceGeneration("stack",{"TemplateURL":stack_names[i]+"_Stack"+"/template.yaml"})
        stackes[stack_names[i]]=stacks
        exec("mkdir "+pwd+app_data.app_name+"/"+stack_names[i]+"_Stack")
            let resources=resource[stack_names[i]] 
            let comp={}
            let res=createStackResources(resources,app_data,StackType[i],stack_names[i],comp)
            let template1= addResourceTemplate(res,Object.keys(res),undefined)
            if (resources.hasOwnProperty("parameter")) {

                template1["Parameters"]=resources.parameter
                //console.log(template1)
                
            }
            let doc = new yaml.Document();
            doc.contents = template1;
            let temp=replaceYAML(doc.toString())
            writeFile(app_data.app_name+"/"+stack_names[i]+"_Stack"+"/template.yaml",temp)   
    }
    let template= addResourceTemplate(stackes,stack_names,undefined)
    let doc = new yaml.Document();
    doc.contents = template;
    writeFile(app_data.app_name+"/template.yaml",doc.toString())
}
export  function getAppdata(input) { 
    let app_data={}
    app_data["app_name"]=input.app_name
    app_data["language"]= config.LanguageSupport[input.language]["version"]
    app_data["dependency"]=config.LanguageSupport[input.language]["dependency"]
    app_data["extension"]=config.LanguageSupport[input.language]["extension"]
    if (input["Stacks"]!==undefined){
        app_data["StackType"] = Object.values(input["Stacks"])
    }
    
    return app_data
}
export function  generationSAM(input){
    
    let app_data= getAppdata(input)
    let app_types=cliModuletoConfig(input)
    createStack(app_data,app_types)
    //console.log(input)
    exec(config.ForceRemove+input.app_name+config.LambdaDemo)
}
export function addComponents(input){
    //console.log(pwd)
    
    let Data = fs.readFileSync(pwd+"/"+input.file_name.trim(), { encoding: "utf-8" });
    Data=Yaml.load(replaceTempTag(Data))
    if(Data.hasOwnProperty("Resources")){

        let res={}
        let app_data=getAppdata(input)
        let input2=JSON.parse(JSON.stringify(input))
        input2.app_name=input.app_name+"_test"
        initializeSAM(input2)
        if (input.nested) {
            Object.keys(input.nestedComponents).map(ele=>{
                let comp={}
                res["resources"]=getComponents(input.nestedComponents[ele]["type"])

                Data = Yaml.load(replaceTempTag(fs.readFileSync(pwd+"/"+input.app_name+"/"+input.nestedComponents[ele]["path"].trim(), { encoding: "utf-8" })));
                let path:AnyArray =(input.app_name+"/"+input.nestedComponents[ele]["path"]).split("/")
                path.pop()
                comp["desti"]=path.join("/");

                comp["demo_desti"]=input2.app_name
                let res1=createStackResources(res,app_data,undefined,undefined,comp)
                res1= addResourceTemplate(res1,Object.keys(res1),Data)
                let doc = new yaml.Document();
                doc.contents = res1;
                let temp=replaceYAML(doc.toString())
                writeFile(input.app_name+"/"+input.nestedComponents[ele]["path"].trim(),temp)  
                //console.log(res1)
            })
            
        }else{
            let comp={}
            res["resources"]=getComponents(input.components)
            
            comp["demo_desti"]=input2.app_name
            let res1=createStackResources(res,app_data,undefined,undefined,comp)
            res1= addResourceTemplate(res1,Object.keys(res1),Data)
            let doc = new yaml.Document();
            doc.contents = res1;
            let temp=replaceYAML(doc.toString())
            writeFile(input.file_name.trim(),temp) 
        }
        removeFolder(input2.app_name)
    }else{
        console.log("wrong template structure");
    }
    
}
export function getComponents(component){
    let resources:AnyArray=[]
    let componentstype:String
    //console.log(Object.entries(components))
    Object.entries(component).map(ele=>{
        let componentstype:any=ele[1]
        JSON.parse(JSON.stringify(components.Components[componentstype])).map(ele=>{
            resources.push(ele)
        })    
    }
)
    return resources
}
export function checkNested(template) {
    let Data = Yaml.load(replaceTempTag(fs.readFileSync(pwd+"/"+template.trim(), { encoding: "utf-8" })));
    let CompStacks:AnyObject={}
    let checkNested=false
    let result={}
    let  resources=Object.keys(Data["Resources"])
    resources.map(ele=>{
        if(Data["Resources"][ele]["Type"]===config.AWSResources.stack.type){
            checkNested=true
            CompStacks[ele]=Data["Resources"][ele]["Properties"]["TemplateURL"]
        }
    })
    result["checkNested"]=checkNested
    result["CompStacks"]=CompStacks
    return result

}
//let basecrud={"Book":{"resource":"lambda","path":"/book","method":["put","get","post"],"database":"dynamodb"}}
function generateRoverAWSResource(cfjson,base){
    let result={}
    let optinal=Object.keys(cfjson["Properties"])
    if(base!==undefined){
        if (base.length>0) {
            base.map(ele=>{
                optinal = optinal.filter(e => e !== ele);
            })   
        }
    }
    let basejson={
        "name":"",
        "type":cfjson["Type"],
        "attributes":["Type","Properties","DependsOn"],
        "Properties":{
            "Base":base,
            "Optional":optinal,
        }
    }
    result[cfjson["Type"].split("::")[cfjson["Type"].split("::").length-1].toLowerCase()]=basejson
    console.log(JSON.stringify(result))

}
function updatevalue(input,data){
    let result=input.trim().split(" ")
    let val ={}
    let resvalue= (result.splice(1,result.length)).join(" ")
    let tag=result[0].replace("!","")
    if (tag!=="Ref") {
      tag="Fn::"+tag
    }
  
    val[tag]=resvalue
    data=data.replace(input.trim(),JSON.stringify(val))
    //console.log(result[0])
    return data
  
  }
function replaceTempTag(yamlinput){
      let jsondata=  yamlinput
      let result
     
      do{
        result=sub.exec(yamlinput)
        if (result!==null) {
          yamlinput=updatevalue(result[0],yamlinput)
        }
        
      }while(result!==null)
      return yamlinput
}
  
