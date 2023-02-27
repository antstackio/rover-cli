//import {config as configDotenv} from 'dotenv'
import * as child from "child_process"
const exec = child.execSync
require("dotenv").config()
console.log(process.env["rover_engine"], process.env["rover_cli"])
exec(
  `npm install ${process.env["rover_engine"]} && npm run build && npm install ${process.env["rover_cli"]} -g `
)
