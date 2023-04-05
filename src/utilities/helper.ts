import * as rover from "@rover-tools/engine/dist/bin/index"
import {
  IroverInput,
  TroverCLIStackParams,
  TroverCLIcurd,
  IroverCLIparamModule,
  IstackDetails,
  IstackDetailsObject,
  IroverCLIcurdObject,
} from "../rover.types"
import * as child from "child_process"
import * as cliConfig from "../configs/cliConfig"
const exec = child.execSync
const roverHelpers = rover.helpers
import * as util from "./cliUtil"
let moreStacks
export async function roverADD() {
  const appName = await util.inputString("appName", "", false, "App Name:")
  await roverHelpers.samValidate(appName["appName"])
  await roverHelpers.checkFile(appName["appName"], "yes")
  const language = await util.languageChoice()
  const fileName = await exec(`ls ${appName["appName"]}/*.yaml `).toString()
  const CompStacks = await roverHelpers.checkNested(fileName)
  return {
    appName: appName,
    language: language,
    filename: fileName,
    compstack: CompStacks,
  }
}
async function CRUDObject(stackName: string, AppType: string) {
  const crud: TroverCLIcurd = {}
  let StackParams: TroverCLIStackParams = {}
  let paramModule: IroverCLIparamModule = <IroverCLIparamModule>{}
  const obj: TroverCLIStackParams = {}
  let tempObj = {}

  do {
    paramModule = <IroverCLIparamModule>(<unknown>await util.params(AppType))
    paramModule["res"]["resourcetype"] = "lambda"
    paramModule["res"]["methods"].push("options")
    crud[paramModule.name] = paramModule.res

    obj[stackName] = crud
    tempObj = { ...tempObj, crud }
    moreStacks = await util.choicesYorN("Do you want to add another API ?")
  } while (moreStacks !== "No")
  StackParams = { ...obj }
  return StackParams
}
async function CustomObject(i: number) {
  const customStacks: Record<string, Array<string>> = {}
  const choice = cliConfig.customizable.components
  const customstack_name = await util.inputString(
    `customStackName${i}`,
    "",
    false,
    `Stack ${i} Name: `
  )
  const CustomStacks = await util.multichoice("app_type", choice, "")
  customStacks[<string>customstack_name[`customStackName${i}`]] =
    CustomStacks.app_type
  return customStacks
}
export async function createModules(
  appName: Record<string, string>,
  language: string
) {
  const stack_names: Record<string, string> = {}
  let customStacks: Record<string, Array<string>> = {}
  const basecrud = {}
  let StackParams: TroverCLIStackParams = {}
  let moreStacks: string
  const stackDetails: IstackDetails = {}
  const stackname: Record<string, string> = {}
  let i = 1
  const obj: TroverCLIStackParams = {}
  do {
    const AppType: string = <string>await util.appType("Module Type :")
    if (AppType !== "CustomizableModule") {
      stackname[`stackName${i}`] = `${AppType}${roverHelpers.makeId(5)}`
      const stack_name = stackname
      const stackName: string = stack_name[`stackName${i}`]
      if (AppType === "CRUDModule") {
        StackParams = {
          ...StackParams,
          ...(await CRUDObject(stackName, AppType)),
        }
      } else {
        obj[stackName] = <Record<string, IroverCLIcurdObject>>basecrud
        StackParams = { ...obj, ...StackParams }
      }
      stack_names[stack_name[`stackName${i}`]] = AppType
    } else {
      customStacks = { ...customStacks, ...(await CustomObject(i)) }
    }
    moreStacks = await util.choicesYorN(
      "Do you want to add one more modules ? "
    )
    i++
  } while (moreStacks !== "No")
  if (stack_names !== null) {
    Object.keys(stack_names).forEach((element) => {
      stackDetails[element] = <IstackDetailsObject>{}
      stackDetails[element]["type"] = stack_names[element]
      stackDetails[element]["params"] = StackParams[element]
      stackDetails[element]["componentList"] = []
    })
  }
  if (customStacks !== null) {
    Object.keys(customStacks).forEach((element) => {
      stackDetails[element] = <IstackDetailsObject>{}
      stackDetails[element]["type"] = "Custom"
      stackDetails[element]["params"] = {}
      stackDetails[element]["componentList"] = customStacks[element]
    })
  }
  const template: IroverInput = {
    appName: appName["appName"],
    language,
    stackDetails: stackDetails,
  }
  return template
}
export async function listProfiles() {
  const profiles = exec("aws configure list-profiles").toString().split("\n")
  if (profiles[profiles.length - 1] == "")
    profiles.splice(profiles.length - 1, 1)
  return profiles
}
