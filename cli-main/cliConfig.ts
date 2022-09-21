
const customStack= require("@rover-tools/engine").rover_components;
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
export let app =
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
 choice : Object.keys(customStack.Components)
}
