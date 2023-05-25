import * as rover from "@rover-tools/engine/dist/bin/index"
const roverHelpers = rover.helpers
import * as util from "../utilities/cliUtil"
const deployment = rover.deployment
import * as fs from "fs"
import * as buildConfig from "../configs/buildConfig"
import { listProfiles } from "../utilities/helper"
import { IroverDeploymentConfig, IroverDeploymentObject } from "../rover.types"
import * as child from "child_process"
const exec = child.execSync
export async function deployCLI() {
  let r = await util.inputType("choice", "pipeline", "Deploy through:")
  r = r["choice"]
  if (r === "repository and pipeline") {
    console.log("Work in progress...")
  } else if (r === "generate pipeline") {
    await roverHelpers.samValidate("")
    const lang: string = await roverHelpers.langValue()
    const pipeline = await util.samBuild(lang)
    const template = { repoConfig: pipeline }
    const repoconfig = await Promise.resolve(
      util.jsonCreation(
        <Record<string, IroverDeploymentObject>>(<unknown>template)
      )
    )
    if (repoconfig !== undefined) {
      const Configs: IroverDeploymentObject =
        JSON.parse(repoconfig)["repoConfig"]
      Configs["repoType"] = (<Record<string, string>>(
        (<unknown>Configs["repoType"])
      ))["repoType"]
      Configs["tool"] = (<Record<string, string>>(<unknown>Configs["tool"]))[
        "tool"
      ]
      await deployment.setupRepo(Configs)
      roverHelpers.generateRoverConfig(
        "",
        JSON.parse(repoconfig)["repoConfig"],
        "rover_generate_pipeline"
      )
    }
  } else {
    await roverHelpers.samValidate("")
    if (fs.existsSync("samconfig.toml")) {
      exec("rm -rf samconfig.toml")
    }
    const profiles = await listProfiles()
    const filenamearray = exec("pwd").toString().split("/")
    const fileName = filenamearray[filenamearray.length - 1].replace("\n", "")
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
    const deploymentregion = await util.inputType("Deployment region", choice)
    if (bucketName["name"] == "") {
      bucketName = " --resolve-s3 "
    } else {
      bucketName = ` --s3-bucket ${bucketName["name"]}`
    }
    if (stack_name["stack_name"] == "") {
      stack_name = `${fileName} roverTest`
    } else {
      stack_name = stack_name["stack_name"]
    }
    const region = deploymentregion["Deployment region"]

    exec(
      `sh ${roverHelpers.npmroot}/@rover-tools/cli/scripts/exec.sh ${fileName} ${stack_name} ${profile} ${region}  ${bucketName}`
    )

    const configdata: IroverDeploymentConfig = <IroverDeploymentConfig>{}
    configdata["bucket"] = bucketName
    configdata["stack_name"] = stack_name
    configdata["region"] = region
    configdata["profile"] = profile
    roverHelpers.generateRoverConfig("", configdata, "rover_deploy_cli")
  }
}
