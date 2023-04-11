import * as rover from "@rover-tools/engine/dist/bin/index"
const roverHelpers = rover.helpers
import {
  createSAMCLI,
  addComponentCLI,
  addModuleCLI,
} from "../src/roverCLI/roverGenerateCLI"
import { deployCLI } from "../src/roverCLI/roverDeployCLI"
import * as cliConfig from "../src/configs/cliConfig"
import { version } from "../package.json"
import * as util from "../src/utilities/cliUtil"

function handleInitCommand(): Promise<void> {
  return new Promise( (resolve) => {
    const editedSam = <string>(<unknown>util.confirmation())
    if ( editedSam === "create new SAM project") {
       createSAMCLI()
    } else if (editedSam === "add components to existing SAM") {
       addComponentCLI()
    } else if (editedSam === "add modules to existing SAM") {
       addModuleCLI()
    }
    resolve()
  })
}

async function handleDeployCommand(): Promise<void> {
  await deployCLI()
}

function handleVersionCommand(): void {
  console.log(version)
}

function handleUnknownCommand(): void {
  console.log(cliConfig.commandError(process.argv.slice(2)))
}

async function run(argv: Array<string>): Promise<void> {
  try {
    if (!roverHelpers.npmrootTest()) {
      throw new Error(cliConfig.globalError)
    }

    switch (argv[0]) {
      case "init":
        await handleInitCommand()
        break
      case "deploy":
        await handleDeployCommand()
        break
      case "-v":
      case "--version":
        handleVersionCommand()
        break
      default:
        handleUnknownCommand()
    }
  } catch (error) {
    console.log("Error: ", error as Error)
    //.message)
  }
}

run(process.argv.slice(2))
