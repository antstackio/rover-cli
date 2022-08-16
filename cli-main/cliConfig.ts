
const customStack= require("rover-engine").rover_components;
const Stack = require("rover-engine").rover_modules;
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
    methods:["put","get","post","delete","options"],
    resourcetype:["lambda","stepfunction","dynamodb"],
    language:["Node","Python"],
    type:Object.values(Stack.ModuleDescription),
    pipeline:["repository and pipeline","cli"]
  },
 
}
export let customizable ={
 choice : Object.keys(customStack.Components)
}
