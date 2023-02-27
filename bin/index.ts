import * as rover from "@rover-tools/engine/dist/bin/index"
const rover_helpers = rover.helpers
import {
  createSAMCLI,
  addComponentCLI,
  addModuleCLI,
} from "../src/roverCLI/roverGenerateCLI"
import { deployCLI } from "../src/roverCLI/roverDeployCLI"

import * as cliConfig from "../src/configs/cliConfig"
import * as util from "../src/utilities/cliUtil"
const test = {
  app_name: "dgbcom",
  language: "node",
  file_name: "dgbcom/template.yaml\n",
  components: ["S3 Lambda", "CRUD API", "S3 Bucket", "Lambda", "DynamoDB"],
}
import { version } from "../package.json"

async function run(argv: Array<string>): Promise<void> {
  try {
    if (rover_helpers.npmrootTest()) {
      const commandErrors = cliConfig.commandError(argv)
      if (argv.length === 1) {
        if (argv.length === 1 && argv[0] === "init") {
          const editedSam = await util.confirmation()
          if (editedSam === "create new SAM project") {
            await createSAMCLI()
          } else if (editedSam === "add components to existing SAM") {
            await addComponentCLI()
          } else if (editedSam === "add modules to existing SAM") {
            await addModuleCLI()
          }
        } else if (argv[0] === "deploy") {
          await deployCLI()
        } else if (argv[0] === "-v" || argv[0] === "--version") {
          // show current package version in the console
          console.log(version)
        } else {
          console.log(commandErrors)
        }
      } else {
        console.log(commandErrors)
      }
    } else {
      console.log(
        "Note: install @rover-tools/cli globally (install @rover-tools/cli -g)"
      )
    }
  } catch (error) {
    console.log("Error: ", (error as Error).message)
  }
}
run(process.argv.slice(2))
