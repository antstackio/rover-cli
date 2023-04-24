import * as inquirer from "inquirer"
import * as cliConfig from "../configs/cliConfig"
import * as buildConfig from "../configs/buildConfig"
import * as rover from "@rover-tools/engine/dist/bin/index"
import { IroverDeploymentObject, IroverCLIparamModule } from "../rover.types"

const moduleParams = rover.modules.Modules
const envpattern = new RegExp(/^env\d\d+$/g)
const apipathpattern = new RegExp(/^\/[a-zA-Z]*(\/[a-zA-Z]*-*)*/g)
const stringpattern = new RegExp(/^[A-Za-z]+$/g)

export const multichoice = async function (
  name: string,
  choice: Array<string>,
  message: string
) {
  let messages = ""
  if (message == "") {
    messages = `Please select your  ${name.charAt(0).toUpperCase()}${name.slice(
      1
    )}  :`
  } else {
    messages = message
  }

  const r = await inquirer.prompt([
    {
      type: "checkbox",
      message: messages,
      name: name,
      choices: choice,
      validate(answer) {
        if (answer.length < 1) {
          return "You must choose at least one option."
        }

        return true
      },
    },
  ])
  return r
}

export const jsonCreation = async function (
  obj: Record<string, IroverDeploymentObject>
) {
  try {
    const content = JSON.stringify(obj, null, 2)
    return content
  } catch (err) {
    console.log(err)
  }
}

export async function inputString(
  name: string,
  defaults: string,
  optional: boolean,
  message = ""
) {
  const takeInput = await inquirer.prompt([
    {
      type: "input",
      name,
      message,
      validate: (value) => {
        if (name === "path") {
          return apipathpattern.test(value) || "Please enter a valid path"
        } else if (envpattern.test(name)) {
          return (
            (value !== "" && value !== undefined) ||
            "Environment values cannot be empty"
          )
        } else {
          return (
            optional ||
            stringpattern.test(value) ||
            `${message} should have only alphanumeric values`
          )
        }
      },
    },
  ])

  return { ...takeInput }
}
export async function inputDescription(
  name: string,
  defaults: string,
  optional: boolean,
  message = ""
) {
  const takeInput = await inquirer.prompt([
    {
      type: "input",
      name,
      message,
    },
  ])

  return { ...takeInput }
}

export const languageChoice = async function () {
  const lang = await inquirer.prompt([
    {
      type: "rawlist",
      name: "language",
      message: "Choose your language",
      choices: cliConfig.app.choices.language,
    },
  ])

  if (lang.language === "Node") {
    return "node"
  } else return "python"
}

export const inputType = async function (
  name: string,
  choices: Array<string> | string,
  message = ""
) {
  const takeInput = await inquirer.prompt([
    {
      type: "rawlist",
      name: `${name}`,
      message: message,
      choices:
        typeof choices === "string" ? cliConfig.app.choices[choices] : choices,
    },
  ])

  return takeInput
}

export const confirmation = async function (): Promise<string> {
  const r = await inquirer.prompt([
    {
      type: "rawlist",
      name: "choice",
      message: `Hey, what do you want ?`,
      choices: [
        "create predefined SAM project",
        "create custom SAM project",
        "add components to existing SAM",
        "add modules to existing SAM",
      ],
    },
  ])

  return r.choice
}

export const inputNumber = async function (name: string, message: string) {
  let displayname = name
  if (message !== undefined) {
    displayname = message
  }
  const takeInput = await inquirer.prompt([
    {
      type: "input",
      message: `Please enter the required number of ${displayname} you want ?`,
      name: `${name}`,
      validate: function (value) {
        const pass = !isNaN(value) && value > 0
        if (pass) {
          return true
        }
        return "Please enter a valid number greater than 0"
      },
    },
  ])

  return parseInt(takeInput[`${name}`], 10)
}

export const inputCli = async function (
  obj: Record<
    string,
    Record<string, Array<string>> | Array<Record<string, string>>
  >,
  subObj: Array<Record<string, string>>,
  choiceOption: string
): Promise<Record<string, Record<string, string>>> {
  let res: Record<string, Record<string, string>> = {}
  for (const sobj of subObj) {
    if (sobj.value === "object") {
      const resp = await inputCli(
        obj,
        <Array<Record<string, string>>>(<unknown>obj[sobj.key]),
        choiceOption
      )
      res = <Record<string, Record<string, string>>>{ ...res, [sobj.key]: resp }
    } else if (sobj.value === "choice") {
      const choices = <Record<string, Array<string>>>obj["choices"]
      const choice = choices[sobj.key]
      const r = await inputType(sobj.key, choice, sobj.message)
      res[`${sobj.key}`] = r
    }
  }
  return res
}
export const password = async function (name: string, message = "") {
  const r = await inquirer.prompt([
    {
      type: "password",
      message: message,
      name: name,
    },
  ])
  return r
}

export const samBuilds = async function (lang: string) {
  try {
    const obj = buildConfig.samConfig
    const choices = <Record<string, Array<string>>>buildConfig.samConfig.choices
    const subObj = <Array<Record<string, string>>>buildConfig.samConfig.samBuild
    let sam: Record<string, Record<string, string>> = await inputCli(
      obj,
      subObj,
      ""
    )
    const temp: Record<string, Record<string, string>> = {}
    Object.values(sam).forEach((ele) => {
      Object.assign(temp, ele)
    })
    sam = temp
    const langs = { language: lang }
    const no_of_env = await inputNumber("no_of_env", "environments")
    const envs: string[] = []
    let steps: Record<string, Array<string>> = {}
    let stacknames: Record<string, string> = {}
    const deploymentregion: Record<string, string> = {}
    let deploymentparameters: Record<string, string> = {}
    let depBucketNames: Record<string, string> = {}

    const branches = { branches: ["main"] }
    for (let i = 1; i <= no_of_env; i++) {
      const env = await inputString(`env${i}`, "", false, `Envrionment ${i} :`)
      const envName = env[`env${i}`]
      envs.push(envName)

      const stepsChoice = choices.dev
      let step = await multichoice(
        `steps required for ${envName} environment `,
        stepsChoice,
        ""
      )
      const steps1: Record<string, Array<string>> = {}
      step = Object.keys(step).map((ele) => {
        let name: string = ele.replace("steps required for ", "")
        name = name.replace(" environment ", "")
        steps1[name] = step[ele]
      })

      const stackname = await inputString(
        `${envName}`,
        "",
        true,

        `Stack Name(optional) --> ${envName} :`
      )
      const deploymentbucket = await inputString(
        `${envName}`,
        "",
        true,
        `Deployment Bucket(optional) --> ${envName} :`
      )
      const regionChoice = choices.deploymentregion
      const deployment_region = await inputType(
        `${envName}`,
        regionChoice,
        "Deployment Region"
      )
      const deployment_parameter = await inputString(
        `${envName}`,
        "",
        true,
        `Deployment Parameter(optional) --> ${envName} :`
      )
      steps = { ...steps, ...steps1 }

      stacknames = { ...stacknames, ...stackname }

      depBucketNames = {
        ...depBucketNames,
        ...deploymentbucket,
      }
      deploymentregion[`${envName}`] = deployment_region[`${envName}`]
      deploymentparameters = {
        ...deploymentparameters,
        ...deployment_parameter,
      }
    }

    const deployment_choice = choices.deployment
    const deploymentEvent = await multichoice(
      `deploymentevents`,
      deployment_choice,
      ""
    )
    const framework = { framework: "sam" }

    const result: IroverDeploymentObject = {
      ...sam,
      ...langs,
      no_of_env,
      envs,
      ...branches,
      ...framework,
      steps,
      stackname: { ...stacknames },
      deploymentbucket: {
        ...depBucketNames,
      },
      deploymentregion,
      deploymentparameters,
      ...deploymentEvent,
    }
    return result
  } catch (error) {
    console.log(error)
  }
}

export const samBuild = async (lang: string) => {
  try {
    const { samConfig } = buildConfig

    const sam = await inputCli(
      samConfig,
      <Array<Record<string, string>>>samConfig.samBuild,
      ""
    )

    const { choices } = samConfig

    const language = { language: lang }

    const no_of_env = await inputNumber("no_of_env", "environments")
    const envs = []
    const steps = {}
    const stacknames = {}
    const deploymentregion = <Record<string, string>>{}
    const deploymentparameters = {}
    const depBucketNames = {}

    const branches = { branches: ["main"] }

    for (let i = 1; i <= no_of_env; i++) {
      const envName = <string>(
        (await inputString(`env${i}`, "", false, `Environment ${i}:`))[
          `env${i}`
        ]
      )
      envs.push(envName)

      const stepsChoice = (<Record<string, Array<string>>>choices).dev
      const stepData = await multichoice(
        `Steps required for ${envName} environment`,
        stepsChoice,
        ""
      )
      const step = Object.fromEntries(
        Object.entries(stepData).map(([key, value]) => {
          const name = key
            .replace("steps required for ", "")
            .replace(" environment ", "")
          return [name, value]
        })
      )
      Object.assign(steps, step)

      const stackname = (
        await inputString(
          `${envName}`,
          "",
          true,
          `Stack Name (optional) --> ${envName}:`
        )
      )[envName]
      const deploymentbucket = (
        await inputString(
          `${envName}`,
          "",
          true,
          `Deployment Bucket (optional) --> ${envName}:`
        )
      )[envName]

      const regionChoice = (<Record<string, Array<string>>>choices)
        .deploymentregion
      const deployment_region = <string>(
        (await inputType(`${envName}`, regionChoice, "Deployment Region"))[
          `${envName}`
        ]
      )
      deploymentregion[`${envName}`] = deployment_region

      const deployment_parameter = (
        await inputString(
          `${envName}`,
          "",
          true,
          `Deployment Parameter (optional) --> ${envName}:`
        )
      )[envName]

      Object.assign(stacknames, { [envName]: stackname })
      Object.assign(depBucketNames, { [envName]: deploymentbucket })
      Object.assign(deploymentparameters, { [envName]: deployment_parameter })
    }

    const deployment_choice = (<Record<string, Array<string>>>choices)
      .deployment
    const deploymentEvent = await multichoice(
      `Deployment Events`,
      deployment_choice,
      ""
    )

    return {
      ...sam,
      ...language,
      no_of_env,
      envs,
      ...branches,
      framework: "sam",
      steps,
      stackname: { ...stacknames },
      deploymentbucket: { ...depBucketNames },
      deploymentregion,
      deploymentparameters,
      ...deploymentEvent,
    }
  } catch (error) {
    console.log(error)
  }
}

export const appType = async function (message = "") {
  const r = await inquirer.prompt([
    {
      type: "rawlist",
      name: "app_Type",
      message: message,
      choices: cliConfig.app.choices.type,
    },
  ])
  const stackModule = cliConfig.moduleDescription
  for (const smodule of stackModule) {
    if (smodule.value === r["app_Type"]) {
      return smodule.key
    }
  }
}
export const choicesYorN = async function (message: string) {
  const r = await inquirer.prompt([
    {
      type: "list",
      name: "stack",
      message: message,
      choices: ["Yes", "No"],
    },
  ])
  return r["stack"]
}

export const params = async function (module: string) {
  const { choices } = cliConfig.app
  const name: Record<string, string> = {}
  const res: IroverCLIparamModule = <IroverCLIparamModule>{}
  if (module !== "CRUDModule") {
    return {}
  }

  const modulesParams = moduleParams.CRUDModule["params"].params

  if (!modulesParams.length) {
    return {}
  }

  for (const param of modulesParams) {
    if (param.value === "choice") {
      const r = await inputType(
        param.key,
        <Array<string>>choices[param.key],
        param.message
      )
      Object.assign(res, r)
    } else if (param.value === "multichoice") {
      const r = await multichoice(param.key, <Array<string>>choices.methods, "")
      Object.assign(res, r)
    } else if (param.key === "name") {
      const r = await inputString(param.key, "", false, param.message)
      name[param.key] = r[param.key]
    } else {
      const r = await inputString(param.key, "", false, param.message)
      Object.assign(res, r)
    }
  }

  return {
    res,
    name: name["name"],
  }
}
