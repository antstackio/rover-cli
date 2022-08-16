import yaml
from resources import *


def append_deployment_options(input,i,step):
    for el in sam_deploy_params.keys():
        print(input[el][i])
        if input[el][i] == {} or input[el][i] == "":
            if el == "stackname":
                step=step.replace("stackname",i+"-"+"stack")
            elif el== "deploymentbucket":
                step=step.replace("--s3-bucket deploymentbucket","--resolve-s3")
                
            else:
                 step=step.replace(sam_deploy_params[el],"")
                 step=step.replace(el,"")
        else:
            if el == "deploymentparameters":
                if input[el][i] !={}:
                    params=str(input[el][i])
                    for k in sam_deploy_replacements.keys():
                        params=params.replace(k,sam_deploy_replacements[k])
                    step=step.replace("deploymentparameters",params)
                else:
                    step=step.replace("--parameter-overrides deploymentparameters","")
            else:
                step=step.replace(el,input[el][i])    
    return step

def git(input):
    output=base(input["tool"])
    output["name"]=input["name"]
    output["on"]=input["deployment_event"]
    for i in input["envs"]:
        k={}
        k= env(input["tool"])
        k["environment"]=i
        output["jobs"][i]=k
        step=steps(input["framework"],input["tool"])
        k["steps"].append(step[input["language"]]["language_setup"])
        for j in input["steps"][i]:
            if j=="deploy" and input["framework"]=="sam":
                step[j]["run"]=append_deployment_options(input,i,step[j]["run"])
            k["steps"].append(step[j])
    return(yaml.safe_dump(output))

def bit(input):
    output=base(input["tool"])
    output["image"]=steps(input["framework"],input["tool"])[input["language"]]["language_setup"]
    if("push" in input["deployment_event"]):
        for b in input["branches"]:
            for i in input["envs"]:
                k={}
                k= env(input["tool"])
                k["step"]["name"]=i
                k["step"]["deployment"]=i
                step=steps(input["framework"],input["tool"])
                for j in input["steps"][i]:
                    if j=="deploy" and input["framework"]=="sam":
                        step[j]=append_deployment_options(input,i,step[j])
                    k["step"]["script"].append(step[j])
                output["pipelines"]["branches"][b].append(k)
    return (yaml.safe_dump(output))


def gitl(input):
    output=base(input["tool"])
    output["image"]=steps(input["framework"],input["tool"])[input["language"]]["language_setup"]
    for i in input["envs"]:
        output["stages"].append(i)
        output[i]=env(input["tool"])
        step=steps(input["framework"],input["tool"])
        for j in input["steps"][i]:
            if(j in after):
                if j=="deploy" and input["framework"]=="sam":
                        step[j]=append_deployment_options(input,i,step[j])
                output[i]["script"].append(step[j])
            else:
                 output[i]["before_script"].append(step[input["language"]][j])
        if len(output[i]["before_script"])<=0:
                output[i].pop("before_script")
    return (yaml.safe_dump(output))

