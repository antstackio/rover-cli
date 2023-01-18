type TcrudMethods = "put" | "get" | "post" | "delete" | "options"
//type TroverLang = "node" | "python";
interface curdObject {
  path: string
  methods: Array<TcrudMethods>
  resourcetype: string
}
export interface IstackDetailsObject {
  type: string
  params: curdObject | object
  componentlist: Array<string>
}
export interface IstackDetails {
  [key: string]: IstackDetailsObject
}
export interface IroverInput {
  app_name: string
  language: string
  stack_details: IstackDetails
}

export interface IroverAppData extends Omit<IroverInput, "stack_details"> {
  dependency: string
  extension: string
  StackType: Array<string>
}

export interface IroverConfigTag {
  createdBy: string
  applicationName: string
}
export interface IroverConfigTagArrayValue {
  Key: string
  Value: string
}
export interface IroveraddComponentInputNestedType
  extends Omit<IroverInput, "stack_details"> {
  nested: boolean
  file_name: string
  nestedComponents: nestedComponentsObject
}
export interface IroveraddComponentInputType
  extends Omit<IroverInput, "stack_details"> {
  nested: boolean
  file_name: string
  components: Array<string>
}

export type IroveraddComponentInput =
  | IroveraddComponentInputType
  | IroveraddComponentInputNestedType

interface IroverComponentInputObject {
  components: Array<string>
  path: string
}

type nestedComponentsObject = Record<string, IroverComponentInputObject>

export interface IroveraddModule extends IroverInput {
  file_name: string
}

export interface IroverCLIcurdObject {
  path: string
  methods: Array<TcrudMethods>
  resourcetype: string
}

export interface IroverCLIparamModule {
  res: IroverCLIcurdObject
  name: string
}

export type TroverCLIStackParams = Record<
  string,
  Record<string, IroverCLIcurdObject>
>
export type TroverCLIcurd = Record<string, IroverCLIcurdObject>

interface IroverComponentInputObject {
  components: Array<string>
  path: string
}
export type TnestedComponentsObject = Record<string, IroverComponentInputObject>

export interface IroverDeploymentConfig {
  bucket: string
  stack_name: string
  region: string
  profile: string
}
export interface Iroverdescription {
  key: string
  value: string
}
export interface IroverDeploymentObject {
  app_name?: string
  name?: string
  repoType: string
  tool: string
  language: string
  no_of_env: number
  envs: Array<string>
  branches: Array<string>
  framework: string
  steps: Record<string, Record<string, string>>
  stackname: Record<string, string>
  deploymentbucket: Record<string, string>
  deploymentregion: Record<string, string>
  deploymentparameters: Record<string, string>
  deploymentevents: Array<string>
}
