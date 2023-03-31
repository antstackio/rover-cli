import * as rover from "@rover-tools/engine/dist/bin/index"
const rover_helpers = rover.helpers
const rover_addComponent = rover.addComponents
const rover_addModules = rover.addModules
const rover_generateSAM = rover.generateSAM
const rover_addModulesToexisting = rover.addModulesToExisting
import * as util from "../utilities/cliUtil"
import * as cliConfig from "../configs/cliConfig"
import { createModules, roverADD } from "../utilities/helper"
import {
  IroverInput,
  IroveraddComponentInput,
  IroveraddModule,
  TnestedComponentsObject,
} from "../rover.types"
import * as child from "child_process"
const exec = child.execSync
let moreStack
let customStacks: Record<string, Array<string>>

export async function createSAMCLI(): Promise<void> {
  const app_name: Record<string, string> = await util.inputString(
    "app_name",
    "",
    false,
    "App Name:"
  )
  await rover_helpers.checkFile(app_name["app_name"], "no")
  const language = await util.languageChoice()

  const template: IroverInput = await createModules(app_name, language)
  await rover_generateSAM.generateSAM({ template }["template"])
}
export async function addComponentCLI() {
  const app_name = await util.inputString("app_name", "", false, "App Name")
  let template: IroveraddComponentInput
  await rover_helpers.checkFile(app_name["app_name"], "yes")
  const language = await util.languageChoice()
  const file_name = await exec(`ls ${app_name["app_name"]}/*.yaml `).toString()
  const CompStacks = await rover_helpers.checkNested(file_name)
  const nestedComponents: TnestedComponentsObject = <TnestedComponentsObject>{}
  const choice = Object.keys(CompStacks["compStacks"])
  let i = 0
  do {
    const nested = CompStacks["checkNested"]
    if (nested) {
      const chooseStack = await util.inputType(
        "Select the module to which you want to add the components ",
        choice
      )
      const selectedChoice = choice.filter((ele) =>
        Object.values(chooseStack).includes(ele)
      )
      const componentChoice = cliConfig.customizable.components
      const components = await util.multichoice(
        "components",
        componentChoice,
        ""
      )
      const path = CompStacks["compStacks"][selectedChoice[0]]
      nestedComponents[selectedChoice[0]] = {
        ...components,
        path: path,
      }

      template = {
        ...app_name,
        language,
        nested,
        file_name,
        nestedComponents,
      }
    } else {
      const choice = cliConfig.customizable.components
      const Compnents = <Array<string>>(
        await util.multichoice("components", choice, "")
      )
      template = { ...app_name, language }
      if (customStacks !== null)
        template = {
          ...template,
          file_name,
          ...Compnents,
        }
    }
    moreStack = await util.moreStack(
      "Do you want to add one more components to modules ?"
    )
    i = i + 1
  } while (moreStack !== "No")
  await rover_addComponent.addComponents(template)
}
export async function addModuleCLI(): Promise<void> {
  const res = await roverADD()
  let template: IroveraddModule = <IroveraddModule>{}
  const app_name = res["appname"]
  const language = res["language"]
  const file_name = res["filename"]
  const addToExisting = await util.multichoice(
    "addToExisting",
    ["Yes", "No"],
    "Do you want to Add a module to existing Module :"
  )
  if (addToExisting.addToExisting[0] == "Yes") {
    const CompStacks = await rover_helpers.checkNested(file_name)
    const choice = Object.keys(CompStacks["compStacks"])
    let i = 0
    do {
      const nested = CompStacks["checkNested"]
      if (nested) {
        const chooseStack = await util.inputType(
          "Select the stack to which you want to add the module ",
          choice
        )
        const selectedChoice = choice.filter((ele) =>
          Object.values(chooseStack).includes(ele)
        )
        // const samResources = rover_helpers.listSAMResources(
        //   file_name,
        //   selectedChoice[0]
        // )
        const moduletemplate = <IroveraddModule>(
          await createModules(app_name, language)
        )
        Object.keys(moduletemplate.stackDetails).forEach((ele) => {
          moduletemplate.stackDetails[ele].stackName = selectedChoice[0]
        })
        if (Object.keys(template).length == 0) {
          template = moduletemplate
        } else {
          template.stackDetails = {
            ...template.stackDetails,
            ...moduletemplate.stackDetails,
          }
        }
      } else {
        const choice = cliConfig.customizable.components
        const Compnents = <Array<string>>(
          await util.multichoice("components", choice, "")
        )
        template = { ...app_name, language }
        if (customStacks !== null)
          template = {
            ...template,
            ...Compnents,
          }
      }
      moreStack = await util.moreStack(
        "Do you want to add one more modules to another stack ?"
      )
      i = i + 1
    } while (moreStack !== "No")
    template["file_name"] = file_name
    await rover_addModulesToexisting.addModulesToExistingStack(template)
  } else {
    template = <IroveraddModule>await createModules(app_name, language)
    await rover_addModules.addModules(template)
  }
}
