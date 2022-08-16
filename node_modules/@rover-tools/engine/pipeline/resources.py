after=["synth","build","deploy"]
sam_deploy_replacements={
    "}":"",
    "{":"",
    " ":"",
    ":":"=",
    ",":" "
    }
sam_deploy_params={
    "stackname":"",
    "deploymentbucket":"--s3-bucket",
    "deploymentregion":"--region",
    "deploymentparameters":"--parameter-overrides"
    }
def steps(framework,tool):
    steps={
        "git":{
            "cdk":{
                "python":{
                    "install":{
                        "run": "python -m pip3 install --upgrade pip3\npip3 install flake8 pytest\nif [ -f requirements.txt ]; then pip3 install -r requirements.txt; fi\n"
                    },
                    "language_setup":{
                                    "uses": "actions/setup-python@v2",             
                    }
                },
                "js":{
                    "install":{
                                "run": "npm i"
                    },
                    "language_setup":{
                                    "uses": "actions/setup-node@v2",
                                    "with": {
                                        "node-version": "14"
                                    }
                    }
                },
                "synth":{
                    "name": "Synth stack",
                    "run": "cdk synth"
                    },
                "deploy":{
                    "name": "Deploy stack",
                    "run": "cdk deploy  --require-approval never"
                    }
            },
            "sam":{
                "python":{
                    "install":{
                        "run": "python -m pip install --upgrade pip\npip install flake8 pytest\nif [ -f requirements.txt ]; then pip install -r requirements.txt; fi\n"
                    },
                    "language_setup":{
                                    "uses": "actions/setup-python@v2",
                                    
                    }
                },
                "js":{
                    "install":{
                                "run": "npm i"
                    },
                    "language_setup":{
                                    "uses": "actions/setup-node@v2",
                                    "with": {
                                        "node-version": "14"
                                    }
                    }
                },
                "build":{
                    "name": "build deployment file",
                    "run": "sam build --use-container"
                    },
                "deploy":{
                    "name": "Deploy stack",
                    "run": "sam deploy --no-confirm-changeset --no-fail-on-empty-changeset --stack-name stackname --s3-bucket deploymentbucket --capabilities CAPABILITY_NAMED_IAM CAPABILITY_IAM CAPABILITY_AUTO_EXPAND --region deploymentregion --parameter-overrides deploymentparameters"
                    }
            }
        },
        "bit":{
            "cdk":{
                "python":{
                    "install": "python -m pip3 install --upgrade pip3\npip install flake8 pytest\nif [ -f requirements.txt ]; then pip3 install -r requirements.txt; fi\n",
                    "language_setup":"node:12"
                },
                "js":{
                    "install":"npm i",
                    "language_setup":"python:3.8"
                },
                "synth":"cdk synth",
                "deploy":"cdk deploy stackname --require-approval never"        
            },
            "sam":{
                "python":{
                    "install": "python -m pip install --upgrade pip\npip install flake8 pytest\nif [ -f requirements.txt ]; then pip install -r requirements.txt; fi\n",
                    "language_setup":"python:3.8"

                },
                "js":{
                    "install":"npm i",
                     "language_setup":"node:12"
                    
                },
                "build":"sam build",
                "deploy": "sam deploy --no-confirm-changeset --no-fail-on-empty-changeset --stack-name stackname --s3-bucket deploymentbucket --capabilities CAPABILITY_IAM --region deploymentregion --parameter-overrides deploymentparameters"                
            }
        },
        "gitl":{
            "sam":{
                "python":{
                    "install": "python -m pip3 install --upgrade pip\npip3 install flake8 pytest\n pip3 install awscli --upgrade\n pip3 install aws-sam-cli --upgrade \n if [ -f requirements.txt ]; then pip install -r requirements.txt; fi\n",
                     "language_setup":"python:3.8"
                    

                },
                "js":{
                    "install":"npm i",
                    "language_setup":"node:12"

                    
                },
                "build":"sam build",
                "deploy": "sam deploy --no-confirm-changeset --no-fail-on-empty-changeset --stack-name stackname --s3-bucket deploymentbucket --capabilities CAPABILITY_IAM --region deploymentregion --parameter-overrides deploymentparameters"

            },
            "cdk":{
                "python":{
                    "install": "python -m pip3 install --upgrade pip3\npip install flake8 pytest\nif [ -f requirements.txt ]; then pip3 install -r requirements.txt; fi\n",
                     "language_setup":"python:3.8"
                },
                "js":{
                    "install":"npm i",
                    "language_setup":"node:12"
                   
                },
                "synth":"cdk synth",
                "deploy":"cdk deploy stackname --require-approval never"  

            }
        }
    }
    return steps[tool][framework]

def env(inputs):
    env={
    "git": {
        "runs-on": "ubuntu-latest",
        "environment": "dev",
        "steps": [
            {
            "name": "Git clone the repository",
            "uses": "actions/checkout@v1"
            },
            {
            "name": "Configure aws credentials",
            "uses": "aws-actions/configure-aws-credentials@master",
            "with": {
                "aws-access-key-id": "${{ secrets.AWS_ACCESS_KEY_ID }}",
                "aws-secret-access-key": "${{ secrets.AWS_SECRET_ACCESS_KEY }}",
                "aws-region": "${{ secrets.AWS_REGION }}"
            }
            }  
        ]
    },
    "bit":{
          "step": {
            "name": "Build and Package",
            "deployment": "PROD",
            "script": []
          }
    },
    "gitl":{
            "stage": "deploy",
            "before_script": [
     
            ],
            "script": [],
            "environment": "production"
    }
    }
    
    return env[inputs]

def base(tool):
    base={
    "git":{
            "name": "AWS CDK Pipeline",
            "on": {
                    "push": {"branches": ["main"]}
            },
            "jobs": {
    
            }
    },
    "bit":{
            "image": "node:12",
            "pipelines": {
            "branches": {
                    "main": []
            }
            }
    },
    "gitl":{
            "image": "python:3.8",
            "stages": [],
    }
    }
    
    return base[tool]
