import * as rover from "@rover-tools/engine/dist/bin/index"
const roverHelpers = rover.helpers
//const rover_addComponent = rover.addComponents
const rover_addComponent = rover.addComponent
const rover_addModules = rover.addModules
const rover_generateSAM = rover.generateSAM
const rover_addModulesToexisting = rover.addModulesToExisting
const rover_generateCustomSAM = rover.generateCustomSAM
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
let moreStacks
let customStacks: Record<string, Array<string>>

export async function createSAMCLI(): Promise<void> {
  const appName: Record<string, string> = await util.inputString(
    "appName",
    "",
    false,
    "App Name:"
  )
  await roverHelpers.checkFile(appName["appName"], "no")
  const language = await util.languageChoice()

  const template: IroverInput = await createModules(appName, language)
  await rover_generateSAM.generateSAM({ template }["template"])
}
export async function addComponentCLI() {
  const appName = await util.inputString("appName", "", false, "App Name")
  let template: IroveraddComponentInput
  await roverHelpers.checkFile(appName["appName"], "yes")
  const language = await util.languageChoice()
  const fileName = await exec(`ls ${appName["appName"]}/*.yaml `).toString()
  const CompStacks = await roverHelpers.checkNested(fileName)
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
        ...appName,
        language,
        nested,
        fileName,
        nestedComponents,
      }
    } else {
      const choice = cliConfig.customizable.components
      const Compnents = <Array<string>>(
        await util.multichoice("components", choice, "")
      )
      template = { ...appName, language }
      if (customStacks !== null)
        template = {
          ...template,
          fileName,
          ...Compnents,
        }
    }
    moreStacks = await util.choicesYorN(
      "Do you want to add one more components to modules ?"
    )
    i = i + 1
  } while (moreStacks !== "No")
  await rover_addComponent.addComponents(template)
}
export async function addModuleCLI(): Promise<void> {
  const res = await roverADD()
  let template: IroveraddModule = <IroveraddModule>{}
  const appName = res["appName"]
  const language = res["language"]
  const fileName = res["filename"]
  const addToExisting = await util.choicesYorN(
    "Do you want to Add a module to existing Module :"
  )
  if (addToExisting == "Yes") {
    const CompStacks = await roverHelpers.checkNested(fileName)
    const choice = Object.keys(CompStacks["compStacks"])
    do {
      const nested = CompStacks["checkNested"]
      if (nested) {
        template = await addModuleToStack(choice, appName, language, template)
      } else {
        const components = <Array<string>>(
          await util.multichoice(
            "components",
            cliConfig.customizable.components,
            ""
          )
        )
        template = { ...appName, language, ...components }
      }
      moreStacks = await util.choicesYorN(
        "Do you want to add one more modules to another stack ?"
      )
    } while (moreStacks !== "No")
    template["fileName"] = fileName
    await rover_addModulesToexisting.addModulesToExistingStack(template)
  } else {
    template = <IroveraddModule>await createModules(appName, language)
    template["fileName"] = fileName
    await rover_addModules.addModules(template)
  }
}

async function addModuleToStack(
  choice: string[],
  appName: Record<string, string>,
  language: string,
  template: IroveraddModule
) {
  const chooseStack = await util.inputType(
    "Select the stack to which you want to add the module:",
    choice
  )
  const selectedChoice = choice.filter((ele) =>
    Object.values(chooseStack).includes(ele)
  )
  // const samResources = roverHelpers.listSAMResources(fileName, selectedChoice[0])
  const moduleTemplate = <IroveraddModule>await createModules(appName, language)
  Object.keys(moduleTemplate.stackDetails).forEach((ele) => {
    moduleTemplate.stackDetails[ele].stackName = selectedChoice[0]
  })
  if (Object.keys(template).length == 0) {
    template = moduleTemplate
  } else {
    template.stackDetails = {
      ...template.stackDetails,
      ...moduleTemplate.stackDetails,
    }
  }
  return template
}
export async function createCustomSAMCLI() {
  const appName: Record<string, string> = await util.inputString(
    "appName",
    "",
    false,
    "App Name:"
  )
  const Description: Record<string, string> = await util.inputDescription(
    "description",
    "",
    false,
    "You want a SAM project to ?"
  )
  await roverHelpers.checkFile(appName["appName"], "no")
  await rover_generateCustomSAM.generateCustomSAM(
    appName["appName"],
    Description["description"]
  )
}
