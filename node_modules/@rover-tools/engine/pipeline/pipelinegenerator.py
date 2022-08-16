

from pipeline_utilities import *
import yaml
import sys
import json

inputs=json.loads(sys.argv[5])

def pipelinegenerator(inputs):
    if(inputs["tool"]=="bit"):
        return (bit(inputs))
    elif (inputs["tool"]=="git"):
        return (git(inputs))
    elif (inputs["tool"]=="gitl"):
        return (gitl(inputs))
    else:
        return "wrong deployment tool"

file1=open(sys.argv[1], 'w')
file2=open(sys.argv[2], 'w')
file3=open(sys.argv[3], 'w')
file4=open(sys.argv[4], 'w')
file1.write(pipelinegenerator(inputs))
file2.write(inputs["deploymentregion"]["dev"])
file3.write(inputs["accesskey"])
file4.write(inputs["secretkey"])
file1.close()
file2.close()
file3.close()
file4.close()
