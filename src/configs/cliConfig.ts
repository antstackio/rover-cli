import { Iroverdescription } from "../rover.types"
import * as rover from "@rover-tools/engine/dist/bin/index"
const roverComponents = rover.components
const Stack = rover.modules
export const globalError =
  "Note: install @rover-tools/cli globally (install @rover-tools/cli -g)"
export const commandError = (argv: Array<string>) => {
  return `rover ${argv.join(
    " "
  )} -is not a rover command \n  rover init   - creates new SAM project \n  rover deploy - deploys SAM project\n rover -v or rover --version - gives installed rover version`
}
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

export const moduleDescriptions = moduleDescription.filter(function (
  ele: Iroverdescription
) {
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
  components: Object.keys(roverComponents.Components),
  modules: {
    keys: keys,
    values: values,
  },
}
