# ![Create a sample project](./assets/roverForBright.png)Overview

Rover is a npm package or CLI-based  that generates or updates  SAM projects based on predefined modules and components. it also helps in deployment by generating CI/CD pipeline or deploy through CLI in few clicks.

Modules are the small functional unit of the project like Email Authentication. Components are combination of  AWS services like Lambda with S3 as Trigger.

It is a CLI-based library that supports Node and Python with a some AWS Services.

#### To Install:

 npm install @rover-tools/cli -g

 **Note**: install the package globally

## Prerequisites

* Python 3
* AWS SAM CLI



In Rover, we have predefined modules, we can select them and create our project or we have options to create custom modules by selecting the components in that module.

# Usage

#### Create or Update

```sh
$ rover init
  1) create new SAM project
  2) add components to existing SAM
  3) add modules to existing SAM
```
#### Deploy
```sh
$ rover deploy           
  1) generate pipeline
  2) cli
  3) repository and pipeline
  
```
**Note**: update and deploy should be done within the SAM project 


# Features of Rover
###### Creates new SAM project with predefined Modules and Components

###### Adds Components and Modules to Existing SAM


###### Generates CI/CD Pipeline in SAM projects 


###### Deploys SAM project through CLI


# Keywords

Rover, Lambda, S3, CLI , CI/CD Pipeline, SAM Projects

**
