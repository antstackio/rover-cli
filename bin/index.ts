import * as rover from "@rover-tools/engine/dist/bin/index"
const rover_helpers = rover.helpers
const rover_generateSAM = rover.generateSAM
const rover_addComponent = rover.addComponents
const rover_addModules = rover.addModules
import * as fs from "fs"
import * as cliConfig from "../src/cliConfig"
import * as util from "../src/util"
const deployment = rover.deployment
import * as buildConfig from "../src/buildConfig"
import { createModules, roverADD, listProfiles } from "../src/helper"
import {
  IroverInput,
  IroveraddComponentInput,
  IroveraddModule,
  TnestedComponentsObject,
  IroverDeploymentConfig,
  IroverDeploymentObject,
} from "../src/rover.types"
import * as child from "child_process"
const exec = child.execSync

import { version } from "../package.json"

async function run(argv: Array<string>) {
  try {
    if (rover_helpers.npmrootTest()) {
      const commandError = `rover ${argv.join(
        " "
      )} -is not a rover command \n  rover init   - creates new SAM project \n  rover deploy - deploys SAM project\n rover -v or rover --version - gives installed rover version`
      if (argv.length === 1) {
        if (argv.length === 1 && argv[0] === "init") {
          const editedSam = await util.confirmation()
          if (editedSam === "create new SAM project") {
            const app_name: Record<string, string> = await util.inputString(
              "app_name",
              "",
              false,
              "App Name:"
            )
            await rover_helpers.checkFile(app_name["app_name"], "no")
            const language = await util.languageChoice()

            const template: IroverInput = await createModules(
              app_name,
              language
            )
            await rover_generateSAM.generateSAM(
              <IroverInput>{ template }["template"]
            )
          } else if (editedSam === "add components to existing SAM") {
            const app_name = await util.inputString(
              "app_name",
              "",
              false,
              "App Name"
            )
            let template: IroveraddComponentInput
            await rover_helpers.checkFile(app_name["app_name"], "yes")
            const language = await util.languageChoice()
            const file_name = await exec(
              `ls ${app_name["app_name"]}/*.yaml `
            ).toString()
            const CompStacks = await rover_helpers.checkNested(file_name)
            const nestedComponents: TnestedComponentsObject = <
              TnestedComponentsObject
            >{}
            const choice = Object.keys(CompStacks["compStacks"])
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
                const path = CompStacks["compStacks"][selectedchoice[0]]
                nestedComponents[selectedchoice[0]] = {
                  ...components,
                  path: path,
                }
                console.log(
                  "nestedComponents",
                  JSON.stringify(nestedComponents)
                )
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
                  await util.multichoice("components", choice)
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
            } while (moreStack !== "No" || choiceLength === 0)
            await rover_addComponent.addComponents(
              <IroveraddComponentInput>template
            )
          } else if (editedSam === "add modules to existing SAM") {
            const res = await roverADD()
            const app_name = res["appname"]
            const language = res["language"]
            const file_name = res["filename"]
            const addToExisting = await util.inputString(
              "addToExisting",
              "",
              false,
              "Add to Existing Module: "
            )
            console.log(addToExisting)
            const template = <IroveraddModule>(
              await createModules(app_name, language)
            )
            template["file_name"] = file_name
            await rover_addModules.addModules(<IroveraddModule>template)
          }
        } else if (argv[0] === "deploy") {
          let r = await util.inputType("choice", "pipeline", "Deploy through:")
          r = r["choice"]
          if (r === "repository and pipeline") {
            console.log("Work in progress...")
          } else if (r === "generate pipeline") {
            await rover_helpers.samValidate("")
            const lang: string = await rover_helpers.langValue()
            const pipeline = await util.samBuild(lang)
            const template = { repoConfig: pipeline }
            const repoconfig = await Promise.resolve(
              util.jsonCreation(
                <Record<string, IroverDeploymentObject>>template
              )
            )
            if (repoconfig !== undefined) {
              await deployment.setupRepo(JSON.parse(repoconfig)["repoConfig"])
              rover_helpers.generateRoverConfig(
                "",
                JSON.parse(repoconfig)["repoConfig"],
                "rover_generate_pipeline"
              )
            }
          } else {
            await rover_helpers.samValidate("")
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
            const samConfigchoices = <Record<string, Array<string>>>(
              buildConfig.samConfig.choices
            )
            const choice = samConfigchoices.deploymentregion
            const profile = (await util.inputType("AWS profile", profiles))[
              "AWS profile"
            ]

            const deploymentregion = await util.inputType(
              "Deployment region",
              choice
            )
            if (bucketName["name"] == "") {
              bucketName = " --resolve-s3 "
            } else {
              bucketName = ` --s3-bucket ${bucketName["name"]}`
            }
            if (stack_name["stack_name"] == "") {
              stack_name = `${file_name} roverTest`
            } else {
              stack_name = stack_name["stack_name"]
            }
            const region = deploymentregion["Deployment region"]

            exec(
              `sh ${rover_helpers.npmroot}/@rover-tools/cli/cli-main/exec.sh ${file_name} ${stack_name} ${region} ${bucketName} ${profile} `
            )

            const configdata: IroverDeploymentConfig = <
              IroverDeploymentConfig
            >{}
            configdata["bucket"] = bucketName
            configdata["stack_name"] = stack_name
            configdata["region"] = region
            configdata["profile"] = profile
            rover_helpers.generateRoverConfig(
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
let moreStack
let customStacks: Record<string, Array<string>>

run(process.argv.slice(2))
