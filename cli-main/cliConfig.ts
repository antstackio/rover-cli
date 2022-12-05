import { AnyArray, AnyObject } from "immer/dist/internal"
import * as rover from   '@rover-tools/engine/dist/bin/index';
const rovercomponents = rover.rover_components
const Stack = rover.rover_modules
export const LanguageSupport = {
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
}
const keys: AnyArray = []
const values: AnyArray = []
Stack.ModuleDescription.filter(function (ele: AnyObject) {
  keys.push(ele["key"])
  values.push(ele["value"])
})
export const app: AnyObject = {
  choices: {
    methods: ["put", "get", "post", "delete"],
    resourcetype: ["lambda", "stepfunction", "dynamodb"],
    language: ["Node", "Python"],
    type: Object.values(Stack.ModuleDescription),
    pipeline: ["generate pipeline", "cli", "repository and pipeline"],
  },
}
export const customizable = {
  components: Object.keys(rovercomponents.Components),
  modules: {
    keys: keys,
    values: values,
  },
}
