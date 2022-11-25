import { AnyArray, AnyObject } from "immer/dist/internal";

const rovercomponents = require("@rover-tools/engine").rover_components;
const Stack = require("@rover-tools/engine").rover_modules;
export let LanguageSupport = {
  node: {
    version: "nodejs14.x",
    dependency: "npm",
    extension: ".js",
  },
  python: {
    version: "python3.9",
    dependency: "pip3",
    extension: ".py",
  },
};
let keys:AnyArray = []
let values:AnyArray=[]
  Stack.ModuleDescription.filter(function(ele:AnyObject) {
    keys.push(ele["key"])
     values.push(ele["value"])
   })
export let app:AnyObject =
{
  choices:{
    methods:["put","get","post","delete"],
    resourcetype:["lambda","stepfunction","dynamodb"],
    language:["Node","Python"],
    type:Object.values(Stack.ModuleDescription),
    pipeline:["generate pipeline","cli","repository and pipeline"]
  },
 
}
export let customizable ={
  components: Object.keys(rovercomponents.Components),
  modules: {
    "keys": keys,
    "values":values,
  }
}
