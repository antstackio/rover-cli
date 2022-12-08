import * as rover from "@rover-tools/engine/dist/bin/index"
const rover_utilities = rover.rover_utilities
const rover_config = rover.rover_config
import * as fs from "fs"
import * as cliConfig from "../cli-main/cliConfig"
import * as util from "../cli-main/util"
const deployment = rover.rover_deployment
import * as buildConfig from "../cli-main/buildConfig"
import { AnyObject } from "immer/dist/internal"
import * as child from "child_process"
const exec = child.execSync

import { version } from "../package.json"
import { AnyArray } from "immer/dist/internal"
const stack_resource_Name: AnyArray = []
let template: AnyObject = {}

async function roverADD() {
  const app_name = await util.inputString("app_name", "", false, "App Name")
  await rover_utilities.samValidate(app_name["app_name"])
  await rover_utilities.checkFile(app_name["app_name"], "yes")
  const language = await util.languageChoice()
  const file_name = await exec(
    "ls " + app_name["app_name"] + "/" + "*.yaml "
  ).toString()
  const CompStacks = await rover_utilities.checkNested(file_name)
  return {
    appname: app_name,
    language: language,
    filename: file_name,
    compstack: CompStacks,
  }
}
async function CRUDObject(stackName: string, AppType: string) {
  const crud: AnyObject = {}
  let StackParams: AnyObject = {}
  let paramModule: AnyObject = {}
  const obj: AnyObject = {}
  let tempObj = {}

  do {
    paramModule = await util.params(AppType)
    paramModule["res"]["resourcetype"] = "lambda"
    paramModule["res"]["methods"].push("options")
    crud[paramModule.name] = paramModule.res

    obj[stackName] = crud
    tempObj = { ...tempObj, crud }
    moreStack = await util.moreStack("Do you want to add another API ?")
  } while (moreStack !== "No")
  StackParams = { ...obj }

  return StackParams
}
async function CustomObject(i: number) {
  const customStacks: AnyObject = {}
  const choice = cliConfig.customizable.components
  const customstack_name = await util.inputString(
    `customStackName${i}`,
    "",
    false,
    `Stack ${i} Name: `
  )
  const CustomStacks = await util.multichoice("app_type", choice)
  customStacks[customstack_name[`customStackName${i}`]] = CustomStacks.app_type
  return customStacks
}
async function createModules(app_name: AnyObject, language: string) {
  const stack_names: AnyObject = {}
  let customStacks: AnyObject = {}
  const basecrud: AnyObject = {}
  let StackParams: AnyObject = {}
  let moreStack: string
  const stackname: AnyObject = {}
  let i = 1
  const obj: AnyObject = {}
  do {
    const AppType: string = await util.appType("Module Type :")
    if (AppType !== "CustomizableModule") {
      stackname[`stackName${i}`] = AppType + rover_utilities.makeid(5)
      const stack_name = stackname
      const stackName: string = stack_name[`stackName${i}`]
      if (AppType === "CRUDModule") {
        StackParams = {
          ...StackParams,
          ...(await CRUDObject(stackName, AppType)),
        }
      } else {
        obj[stackName] = basecrud
        StackParams = { ...obj, ...StackParams }
      }
      stack_names[stack_name[`stackName${i}`]] = AppType
    } else {
      customStacks = { ...customStacks, ...(await CustomObject(i)) }
    }
    moreStack = await util.moreStack("Do you want to add one more modules ? ")
    i++
  } while (moreStack !== "No")

  template = { ...app_name, language }
  if (stack_names !== null)
    template = { ...template, Stacks: stack_names, StackParams }
  if (customStacks !== null)
    template = { ...template, CustomStacks: customStacks }
  return template
}
async function listProfiles() {
  const profiles = exec("aws configure list-profiles").toString().split("\n")
  if (profiles[profiles.length - 1] == "")
    profiles.splice(profiles.length - 1, 1)
  return profiles
}
async function run(argv: AnyObject) {
  try {
    if (rover_utilities.npmrootTest()) {
      const commandError = `rover ${argv.join(
        " "
      )} -is not a rover command \n  rover init   - creates new SAM project \n  rover deploy - deploys SAM project\n rover -v or rover --version - gives installed rover version`
      if (argv.length === 1) {
        if (argv.length === 1 && argv[0] === "init") {
          const editedSam = await util.confirmation()
          if (editedSam === "create new SAM project") {
            const app_name: AnyObject = await util.inputString(
              "app_name",
              "",
              false,
              "App Name:"
            )
            await rover_utilities.checkFile(app_name["app_name"], "no")
            const language = await util.languageChoice()

            template = await createModules(app_name, language)

            await rover_utilities.generateSAM({ template }["template"])
          } else if (editedSam === "add components to existing SAM") {
            const app_name = await util.inputString(
              "app_name",
              "",
              false,
              "App Name"
            )
            await rover_utilities.checkFile(app_name["app_name"], "yes")
            const language = await util.languageChoice()
            const file_name = await exec(
              "ls " + app_name["app_name"] + "/" + "*.yaml "
            ).toString()
            const CompStacks = await rover_utilities.checkNested(file_name)
            const nestedComponents: AnyObject = {}
            const choice = Object.keys(CompStacks["CompStacks"])
            let choiceLength = 0
            let i = 0
            do {
              const nested = CompStacks["checkNested"]
              choiceLength = choice.length
              if (nested) {
                const chooseStack = await util.inputType(
                  "Select the module to which you want to add the components ",
                  choice
                )
                const selectedchoice = choice.filter((ele) =>
                  Object.values(chooseStack).includes(ele)
                )
                const componentChoice = cliConfig.customizable.components
                const components = await util.multichoice(
                  "components",
                  componentChoice
                )
                const path = CompStacks["CompStacks"][selectedchoice[0]]
                nestedComponents[selectedchoice[0]] = {
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
                const Compnents = await util.multichoice("components", choice)
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
            } while (moreStack !== "No" || choiceLength === 0)
            await rover_utilities.addComponents(template)
          } else if (editedSam === "add modules to existing SAM") {
            const res = await roverADD()
            const app_name = res["appname"]
            const language = res["language"]
            const file_name = res["filename"]

            template = await createModules(app_name, language)
            template["file_name"] = file_name
            await rover_utilities.addModules(template)
          }
        } else if (argv[0] === "deploy") {
          let r = await util.inputType("choice", "pipeline", "Deploy through:")
          r = r["choice"]
          if (r === "repository and pipeline") {
            console.log("Work in progress...")
          } else if (r === "generate pipeline") {
            await rover_utilities.samValidate("")
            const lang: string = await rover_utilities.langValue()
            const pipeline = await util.samBuild(lang)
            const repoConfig = { ...pipeline }
            template = { ...template, repoConfig }
            const repoconfig = await Promise.resolve(
              util.jsonCreation(template)
            )
            if (repoconfig !== undefined) {
              await deployment.setupRepo(JSON.parse(repoconfig)["repoConfig"])
              rover_utilities.generateRoverConfig(
                "",
                JSON.parse(repoconfig)["repoConfig"],
                "rover_generate_pipeline"
              )
            }
          } else {
            await rover_utilities.samValidate("")
            if (fs.existsSync("samconfig.toml")) {
              exec("rm -rf samconfig.toml")
            }
            const profiles = await listProfiles()
            const filenamearray = exec("pwd").toString().split("/")
            const file_name = filenamearray[filenamearray.length - 1].replace(
              "\n",
              ""
            )
            let stack_name = await util.inputString(
              "stack_name",
              "",
              true,
              "Stack Name(optional) :"
            )
            let bucketName = await util.inputString(
              "name",
              "",
              true,
              "Bucket Name(optional) :"
            )
            const choice = buildConfig.samConfig.choices.deploymentregion
            const profile = (await util.inputType("AWS profile", profiles))[
              "AWS profile"
            ]
            console.log(profile)
            const deploymentregion = await util.inputType(
              "Deployment region",
              choice
            )
            if (bucketName["name"] == "") {
              bucketName = " --resolve-s3 "
            } else {
              bucketName = " --s3-bucket " + bucketName["name"]
            }
            if (stack_name["stack_name"] == "") {
              stack_name = file_name + "roverTest"
            } else {
              stack_name = stack_name["stack_name"]
            }
            const region = deploymentregion["Deployment region"]

            exec(
              "sh " +
                rover_config.npmroot +
                "/@rover-tools/cli/cli-main/exec.sh " +
                file_name +
                " " +
                stack_name +
                " " +
                region +
                " " +
                bucketName +
                " " +
                profile
            )

            const configdata: AnyObject = {}
            configdata["bucket"] = bucketName
            configdata["stack name"] = stack_name
            configdata["region"] = region
            configdata["profile"] = profile
            rover_utilities.generateRoverConfig(
              "",
              configdata,
              "rover_deploy_cli"
            )
          }
        } else if (argv[0] === "-v" || argv[0] === "--version") {
          // show current package version in the console
          console.log(version)
        } else {
          console.log(commandError)
        }
      } else {
        console.log(commandError)
      }
    } else {
      console.log(
        "Note: install @rover-tools/cli globally (install @rover-tools/cli -g)"
      )
    }
  } catch (error) {
    console.log("Error: ", error)
  }
}
export const stackNames: AnyArray = stack_resource_Name
let moreStack
let customStacks: AnyObject

run(process.argv.slice(2))
