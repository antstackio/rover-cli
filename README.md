# ![img](https://lh5.googleusercontent.com/KTsxxY4oI66ejQrBgqLfzHK9eJY4lpZNm8XzyAiPR2WGFoL8hc9hENMT0QyQTzNaNpwgyKdRahFUeGw2HB6wEGMehP8kzY8OW9bLylcKCbxpI_Oev6qmidivhNU_ui8wLEM84-iHigas5nuEu0OxLjU)Overview

Rover is a backend automation package that generates SAM projects based on user requirements. And deploys SAM project both through CLI and Pipeline. It has a set of predefined modules and components like Auth, CRUD, etc which are commonly used by the system.

Modules are the small functional unit of the project like Email Authentication. Components combine AWS services like Lambda with S3 as Trigger.

It is designed using typescript and is a CLI-based library that supports Node and Python with a limited set of AWS Services.

To Install:

 npm install @rover-tools/cli -g

 **Note**: install the package globally

## Prerequisites

* Python 3
* AWS SAM CLI

# Features of Rover

In Rover, we have predefined modules, we can select them and create our project or we have options to create custom modules by selecting the components in that module.

### Create New SAM Projects Based on Modules

Rover is a package or CLI-based library that generates SAM projects based on user input. It takes three inputs from the user:

* App Name which is of User’s choice.
* App Language is Node and Python
* App Type is a list of predefined modules.

```sh
$ rover init
1)Create new SAM project
2)add component to existing SAM
3)add modules to existing SAMAnswer: Create a new SAM projectApp 
Name: dgb
Choose your language: Node
Type:1. Email Auth Module: Authentication module using Cognito 
     2. Customizable:Create your own module
Answer:Email Auth Module: Authentication module using CognitoStack 
Name: email
Do you want to add one or more components to module: No 
```

### Create Custom Modules based on Components

In Rover, we will be defining a module configuration template which is a standard template where the template resources are defined. It will have details of the module:

* The number of stacks.
* Resources in the stack.
* Stack configuration - Policies and Environment variables in JSON.

```sh
$ rover init
1)Create new SAM project
2)add component to existing SAM
3)add modules to existing SAM
App Name: dgb
Choose your language: Node
Type:Customizable: Create your own moduleStrack 
Name: custom
Please select your component: S3_lambda
Do you want to add one or more components to module: No 
```

### Add Components and Modules to Existing SAM

Modules are a small functional unit of the project like Email Authentication. Components combine  AWS services like Lambda with S3 as Trigger.

```sh
 $ rover init
 1)Create new SAM project
 2)add component to existing SAM
 3)add modules to existing SAMAnswer:add component to existing SAM
 App Name: dgb
 Choose your language: Node
 Select the module to which you want to add the component:emailEmailAuthModule

 Please select your components: S3_lambda
 Do you want to add one or more components to module: No 
```

### Deploy SAM projects through CLI and CI/CD Pipeline

Deploying SAM projects to AWS through CLI and CI/CD Pipeline.

```sh
$  rover deploy
1)repository and pipeline
2)cli 
```

#### Deploying SAM project through CI/CD Pipeline

```sh
Deploy through:repository and pipeline
Name:dgb
App Name:dgbRepo Type:public
Tools:git
Language:js
Framework:sam
Accesskey:[hidden}
Secretkey:[hidden]
Please enter the required number of Environments(dev,test) you want:1
Environment 1:dev
Please select your components:
build,
deploy
Stack Name —> dev:rovertest
Deployment Bucket —>devDeployment Region:ap-south-1
Deployment Parameter —> dev 
```

#### Deploying SAM project through CLI

```sh
| $ rover deploy
1)repository and pipeline
2)cli
Deploy through:cli
Stack Name —> rovertest
Deployment Bucket —>devDeployment 
Region:ap-south-1
Deployment Parameter —> dev 
```

# Keywords

Rover, Lambda, S3, CLI , CI/CD Pipeline, SAM Projects

**
