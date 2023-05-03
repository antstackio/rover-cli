import * as rover from "@rover-tools/engine/dist/bin/index"
const roverHelpers = rover.helpers
import {
  createSAMCLI,
  addComponentCLI,
  addModuleCLI,
  createCustomSAMCLI,
} from "../src/roverCLI/roverGenerateCLI"
import { deployCLI } from "../src/roverCLI/roverDeployCLI"
import * as cliConfig from "../src/configs/cliConfig"
import { version } from "../package.json"
import * as util from "../src/utilities/cliUtil"

async function handleInitCommand() {
  const editedSam = <string>(<unknown>await util.confirmation())
  if (editedSam === "create new SAM project") {
    await createSAMCLI()
  } else if (editedSam === "create custom SAM project") {
    await createCustomSAMCLI()
  } else if (editedSam === "add components to existing SAM") {
    await addComponentCLI()
  } else if (editedSam === "add modules to existing SAM") {
    await addModuleCLI()
  } else {
    console.log(editedSam)
    throw new Error(`Unknown option ${editedSam}`)
  }
}

async function handleDeployCommand(): Promise<void> {
  await deployCLI()
}

async function handleVersionCommand(): Promise<void> {
  console.log(version)
}

async function handleUnknownCommand(): Promise<void> {
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
    console.log("Error: ", (error as Error).message)
  }
}

run(process.argv.slice(2))
