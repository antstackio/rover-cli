import { Iroverdescription } from "../bin/rover.types"
import * as rover from "@rover-tools/engine/dist/bin/index"
const rovercomponents = rover.components
const Stack = rover.modules

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
const keys: Array<string> = []
const values: Array<string> = []
export const moduleDescription: Array<Iroverdescription> = []
Object.keys(Stack.Modules).forEach((element) => {
  moduleDescription.push(Stack.Modules[element]["description"])
})

moduleDescription.filter(function (ele: Iroverdescription) {
  keys.push(ele["key"])
  values.push(ele["value"])
})

export const app: Record<
  string,
  Record<string, Array<string> | Array<Iroverdescription>>
> = {
  choices: {
    methods: ["put", "get", "post", "delete"],
    resourcetype: ["lambda", "stepfunction", "dynamodb"],
    language: ["Node", "Python"],
    type: Object.values(moduleDescription),
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
