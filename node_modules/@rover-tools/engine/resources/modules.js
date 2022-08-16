"use strict";
exports.__esModule = true;
exports.ModuleParams = exports.ModuleDescription = exports.StackType = void 0;
var config = require("../utlities/config");
var components = require("./components");
var exec = require("child_process").execSync;
var pwd = process.cwd();
var generatecrud = function (apiname, config) {
    var objects = [];
    var functions = [];
    var tables = [];
    Object.keys(config).map(function (ele) {
        var obj = JSON.parse(JSON.stringify(config[ele]));
        obj["name"] = ele;
        obj["role"] = apiname + "Roles",
            obj["resource"] = ele + "Function",
            objects.push(obj);
        var lambdafunc = components.generatelambda(ele, {});
        lambdafunc["logicpath"] = "crud";
        //console.log(lambdafunc)
        var table = components.generatetable(ele, {});
        functions.push(lambdafunc);
        tables.push(table);
    });
    var role = {
        "name": apiname + "Roles",
        "type": "iamrole",
        "config": {
            "iamservice": ["lambda.amazonaws.com", "apigateway.amazonaws.com"],
            "managedarn": ["AWSLambdaBasicExecutionRole", "AmazonAPIGatewayPushToCloudWatchLogs"],
            "Path": "/",
            "Policies": [
                { "name": "lambdainvoke",
                    "Action": "lambda:InvokeFunction",
                    "Resource": { "Fn::Sub": "arn:aws:lambda:*:${AWS::AccountId}:function:*" }
                },
                { "name": "dynamodbcrud",
                    "Action": [
                        "dynamodb:GetItem",
                        "dynamodb:DeleteItem",
                        "dynamodb:PutItem",
                        "dynamodb:Scan",
                        "dynamodb:Query",
                        "dynamodb:UpdateItem",
                        "dynamodb:BatchWriteItem",
                        "dynamodb:BatchGetItem",
                        "dynamodb:DescribeTable",
                        "dynamodb:ConditionCheckItem"
                    ],
                    "Resource": [{ "Fn::Sub": "arn:aws:dynamodb:${AWS::Region}:${AWS::AccountId}:table/UserTabel" },
                        { "Fn::Sub": "arn:aws:dynamodb:${AWS::Region}:${AWS::AccountId}:table/UserTabel/index/*" }
                    ]
                }
            ]
        },
        "logic": false
    };
    var apis = {
        "name": apiname + "APIs",
        "type": "apigateway",
        "config": {
            "StageName": "dev",
            "objects": objects
        },
        "logic": false
    };
    var res = {};
    res[apiname + "CRUDModule"] = {};
    res[apiname + "CRUDModule"] = { "resources": [] };
    var resarray = res[apiname + "CRUDModule"]["resources"];
    resarray.push(role);
    resarray.push(apis);
    resarray = resarray.concat(functions);
    resarray = resarray.concat(tables);
    res[apiname + "CRUDModule"]["resources"] = resarray;
    return res;
};
var generaterds = function (name, config) {
    // exec("npm   --prefix   "+pwd+"/"+name+"/ install prisma --save-dev")
    // exec("cd "+pwd+"/"+name+"/ && npx  prisma")
    // exec("cd "+pwd+"/"+name+"/ && npx prisma init ")
    return {
        "RDS": {
            "parameter": {
                "Environment": {
                    "Type": "String",
                    "Description": "Provides the data base url",
                    "Default": "DEV"
                },
                "DBUserName": {
                    "Type": "String",
                    "Description": "Provides the data base user name",
                    "Default": "DEVDGB"
                },
                "DBUserPassword": {
                    "Type": "String",
                    "Description": "Provides the data base password",
                    "Default": "DEVDGB1234"
                },
                "DBName": {
                    "Type": "String",
                    "Description": "Provides the data base name",
                    "Default": "DEVDGB"
                },
                "VpcCIDR": {
                    "Description": "Please enter the IP range (CIDR notation) for this VPC",
                    "Type": "String",
                    "Default": "172.20.0.0/16"
                },
                "PublicSubnet1CIDR": {
                    "Description": "Please enter the IP range (CIDR notation) for the public subnet in the first Availability Zone",
                    "Type": "String",
                    "Default": "172.20.0.0/19"
                },
                "PublicSubnet2CIDR": {
                    "Description": "Please enter the IP range (CIDR notation) for the public subnet in the second Availability Zone",
                    "Type": "String",
                    "Default": "172.20.32.0/19"
                },
                "PublicSubnet3CIDR": {
                    "Description": "Please enter the IP range (CIDR notation) for the public subnet in the second Availability Zone",
                    "Type": "String",
                    "Default": "172.20.64.0/19"
                },
                "PrivateSubnet1CIDR": {
                    "Description": "Please enter the IP range (CIDR notation) for the private subnet in the first Availability Zone",
                    "Type": "String",
                    "Default": "172.20.96.0/19"
                },
                "PrivateSubnet2CIDR": {
                    "Description": "Please enter the IP range (CIDR notation) for the private subnet in the second Availability Zone",
                    "Type": "String",
                    "Default": "172.20.128.0/19"
                },
                "PrivateSubnet3CIDR": {
                    "Description": "Please enter the IP range (CIDR notation) for the private subnet in the second Availability Zone",
                    "Type": "String",
                    "Default": "172.20.160.0/19"
                }
            },
            "resources": [
                {
                    "name": "VPC",
                    "type": "vpc",
                    "config": {
                        "CidrBlock": {
                            "Ref": "VpcCIDR"
                        },
                        "EnableDnsSupport": true,
                        "EnableDnsHostnames": true,
                        "Tags": [
                            {
                                "Key": "Name",
                                "Value": {
                                    "Fn::Sub": "HRMS-VPC-${Environment}"
                                }
                            }
                        ]
                    }
                },
                {
                    "name": "InternetGateway",
                    "type": "internetgateway",
                    "config": {
                        "Tags": [
                            {
                                "Key": "Name",
                                "Value": {
                                    "Fn::Sub": "HRMS-Gateway-${Environment}"
                                }
                            }
                        ]
                    }
                },
                {
                    "name": "InternetGatewayAttachment",
                    "type": "vpcgatewayattachment",
                    "config": {
                        "InternetGatewayId": {
                            "Ref": "InternetGateway"
                        },
                        "VpcId": {
                            "Ref": "VPC"
                        }
                    }
                },
                {
                    "name": "PublicSubnet1",
                    "type": "subnet",
                    "config": {
                        "VpcId": {
                            "Ref": "VPC"
                        },
                        "AvailabilityZone": {
                            "Fn::Select": [0, { "Fn::GetAZs": "" }]
                        },
                        "CidrBlock": {
                            "Ref": "PublicSubnet1CIDR"
                        },
                        "MapPublicIpOnLaunch": true,
                        "Tags": [
                            {
                                "Key": "Name",
                                "Value": {
                                    "Fn::Sub": "HRMS-public-subnet-1-${Environment}"
                                }
                            }
                        ]
                    }
                },
                {
                    "name": "PublicSubnet2",
                    "type": "subnet",
                    "config": {
                        "VpcId": {
                            "Ref": "VPC"
                        },
                        "AvailabilityZone": {
                            "Fn::Select": [1, { "Fn::GetAZs": "" }]
                        },
                        "CidrBlock": {
                            "Ref": "PublicSubnet2CIDR"
                        },
                        "MapPublicIpOnLaunch": true,
                        "Tags": [
                            {
                                "Key": "Name",
                                "Value": {
                                    "Fn::Sub": "HRMS-public-subnet-2-${Environment}"
                                }
                            }
                        ]
                    }
                },
                {
                    "name": "PublicSubnet3",
                    "type": "subnet",
                    "config": {
                        "VpcId": {
                            "Ref": "VPC"
                        },
                        "AvailabilityZone": {
                            "Fn::Select": [2, { "Fn::GetAZs": "" }]
                        },
                        "CidrBlock": {
                            "Ref": "PublicSubnet3CIDR"
                        },
                        "MapPublicIpOnLaunch": true,
                        "Tags": [
                            {
                                "Key": "Name",
                                "Value": {
                                    "Fn::Sub": "HRMS-public-subnet-3-${Environment}"
                                }
                            }
                        ]
                    }
                },
                {
                    "name": "PrivateSubnet1",
                    "type": "subnet",
                    "config": {
                        "VpcId": {
                            "Ref": "VPC"
                        },
                        "AvailabilityZone": {
                            "Fn::Select": [0, { "Fn::GetAZs": "" }]
                        },
                        "CidrBlock": {
                            "Ref": "PrivateSubnet1CIDR"
                        },
                        "MapPublicIpOnLaunch": false,
                        "Tags": [
                            {
                                "Key": "Name",
                                "Value": {
                                    "Fn::Sub": "HRMS-private-subnet-1-${Environment}"
                                }
                            }
                        ]
                    }
                },
                {
                    "name": "PrivateSubnet2",
                    "type": "subnet",
                    "config": {
                        "VpcId": {
                            "Ref": "VPC"
                        },
                        "AvailabilityZone": {
                            "Fn::Select": [1, { "Fn::GetAZs": "" }]
                        },
                        "CidrBlock": {
                            "Ref": "PrivateSubnet2CIDR"
                        },
                        "MapPublicIpOnLaunch": false,
                        "Tags": [
                            {
                                "Key": "Name",
                                "Value": {
                                    "Fn::Sub": "HRMS-private-subnet-2-${Environment}"
                                }
                            }
                        ]
                    }
                },
                {
                    "name": "PrivateSubnet3",
                    "type": "subnet",
                    "config": {
                        "VpcId": {
                            "Ref": "VPC"
                        },
                        "AvailabilityZone": {
                            "Fn::Select": [2, { "Fn::GetAZs": "" }]
                        },
                        "CidrBlock": {
                            "Ref": "PrivateSubnet3CIDR"
                        },
                        "MapPublicIpOnLaunch": false,
                        "Tags": [
                            {
                                "Key": "Name",
                                "Value": {
                                    "Fn::Sub": "HRMS-private-subnet-1-${Environment}"
                                }
                            }
                        ]
                    }
                },
                {
                    "name": "PublicRouteTable1",
                    "type": "routetable",
                    "config": {
                        "VpcId": {
                            "Ref": "VPC"
                        },
                        "Tags": [
                            {
                                "Key": "Name",
                                "Value": {
                                    "Fn::Sub": "HRMS-PublicRouteTable1-${Environment}"
                                }
                            }
                        ]
                    }
                },
                {
                    "name": "PublicRouteTable2",
                    "type": "routetable",
                    "config": {
                        "VpcId": {
                            "Ref": "VPC"
                        },
                        "Tags": [
                            {
                                "Key": "Name",
                                "Value": {
                                    "Fn::Sub": "HRMS-PublicRouteTable2-${Environment}"
                                }
                            }
                        ]
                    }
                },
                {
                    "name": "PublicRouteTable3",
                    "type": "routetable",
                    "config": {
                        "VpcId": {
                            "Ref": "VPC"
                        },
                        "Tags": [
                            {
                                "Key": "Name",
                                "Value": {
                                    "Fn::Sub": "HRMS-PublicRouteTable3-${Environment}"
                                }
                            }
                        ]
                    }
                },
                {
                    "name": "PublicRoute1",
                    "type": "route",
                    "config": {
                        "RouteTableId": {
                            "Ref": "PublicRouteTable1"
                        },
                        "DestinationCidrBlock": "0.0.0.0/0",
                        "GatewayId": {
                            "Ref": "InternetGateway"
                        }
                    }
                },
                {
                    "name": "PublicRoute2",
                    "type": "route",
                    "config": {
                        "RouteTableId": {
                            "Ref": "PublicRouteTable2"
                        },
                        "DestinationCidrBlock": "0.0.0.0/0",
                        "GatewayId": {
                            "Ref": "InternetGateway"
                        }
                    }
                },
                {
                    "name": "PublicRoute3",
                    "type": "route",
                    "config": {
                        "RouteTableId": {
                            "Ref": "PublicRouteTable3"
                        },
                        "DestinationCidrBlock": "0.0.0.0/0",
                        "GatewayId": {
                            "Ref": "InternetGateway"
                        }
                    }
                },
                {
                    "name": "PublicSubnet1RouteTableAssociation",
                    "type": "subnetroutetableassociation",
                    "config": {
                        "RouteTableId": {
                            "Ref": "PublicRouteTable1"
                        },
                        "SubnetId": {
                            "Ref": "PublicSubnet1"
                        }
                    }
                },
                {
                    "name": "PublicSubnet2RouteTableAssociation",
                    "type": "subnetroutetableassociation",
                    "config": {
                        "RouteTableId": {
                            "Ref": "PublicRouteTable2"
                        },
                        "SubnetId": {
                            "Ref": "PublicSubnet2"
                        }
                    }
                },
                {
                    "name": "PublicSubnet3RouteTableAssociation",
                    "type": "subnetroutetableassociation",
                    "config": {
                        "RouteTableId": {
                            "Ref": "PublicRouteTable3"
                        },
                        "SubnetId": {
                            "Ref": "PublicSubnet3"
                        }
                    }
                },
                {
                    "name": "PrivateRouteTable1",
                    "type": "routetable",
                    "config": {
                        "VpcId": {
                            "Ref": "VPC"
                        },
                        "Tags": [
                            {
                                "Key": "Name",
                                "Value": {
                                    "Fn::Sub": "HRMS-PrivateRouteTable1-${Environment}"
                                }
                            }
                        ]
                    }
                },
                {
                    "name": "PrivateRouteTable2",
                    "type": "routetable",
                    "config": {
                        "VpcId": {
                            "Ref": "VPC"
                        },
                        "Tags": [
                            {
                                "Key": "Name",
                                "Value": {
                                    "Fn::Sub": "HRMS-PrivateRouteTable2-${Environment}"
                                }
                            }
                        ]
                    }
                },
                {
                    "name": "PrivateRouteTable3",
                    "type": "routetable",
                    "config": {
                        "VpcId": {
                            "Ref": "VPC"
                        },
                        "Tags": [
                            {
                                "Key": "Name",
                                "Value": {
                                    "Fn::Sub": "HRMS-PrivateRouteTable3-${Environment}"
                                }
                            }
                        ]
                    }
                },
                {
                    "name": "PrivateSubnet1RouteTableAssociation",
                    "type": "subnetroutetableassociation",
                    "config": {
                        "RouteTableId": {
                            "Ref": "PrivateRouteTable1"
                        },
                        "SubnetId": {
                            "Ref": "PrivateSubnet1"
                        }
                    }
                },
                {
                    "name": "PrivateSubnet2RouteTableAssociation",
                    "type": "subnetroutetableassociation",
                    "config": {
                        "RouteTableId": {
                            "Ref": "PrivateRouteTable2"
                        },
                        "SubnetId": {
                            "Ref": "PrivateSubnet2"
                        }
                    }
                },
                {
                    "name": "PrivateSubnet3RouteTableAssociation",
                    "type": "subnetroutetableassociation",
                    "config": {
                        "RouteTableId": {
                            "Ref": "PrivateRouteTable3"
                        },
                        "SubnetId": {
                            "Ref": "PrivateSubnet3"
                        }
                    }
                },
                {
                    "name": "EIP1",
                    "type": "eip",
                    "config": {
                        "Domain": "vpc",
                        "Tags": [
                            {
                                "Key": "Name",
                                "Value": {
                                    "Fn::Sub": "HRMS-ElasticIP1-${Environment}"
                                }
                            }
                        ]
                    }
                },
                {
                    "name": "EIP2",
                    "type": "eip",
                    "config": {
                        "Domain": "vpc",
                        "Tags": [
                            {
                                "Key": "Name",
                                "Value": {
                                    "Fn::Sub": "HRMS-ElasticIP2-${Environment}"
                                }
                            }
                        ]
                    }
                },
                {
                    "name": "EIP3",
                    "type": "eip",
                    "config": {
                        "Domain": "vpc",
                        "Tags": [
                            {
                                "Key": "Name",
                                "Value": {
                                    "Fn::Sub": "HRMS-ElasticIP3-${Environment}"
                                }
                            }
                        ]
                    }
                },
                {
                    "name": "NatGateway1",
                    "type": "natgateway",
                    "config": {
                        "AllocationId": {
                            "Fn::GetAtt": ["EIP1", "AllocationId"]
                        },
                        "SubnetId": {
                            "Ref": "PublicSubnet1"
                        },
                        "Tags": [
                            {
                                "Key": "Name",
                                "Value": {
                                    "Fn::Sub": "HRMS-NatGateway1-${Environment}"
                                }
                            }
                        ]
                    }
                },
                {
                    "name": "NatGateway2",
                    "type": "natgateway",
                    "config": {
                        "AllocationId": {
                            "Fn::GetAtt": ["EIP2", "AllocationId"]
                        },
                        "SubnetId": {
                            "Ref": "PublicSubnet2"
                        },
                        "Tags": [
                            {
                                "Key": "Name",
                                "Value": {
                                    "Fn::Sub": "HRMS-NatGateway2-${Environment}"
                                }
                            }
                        ]
                    }
                },
                {
                    "name": "NatGateway3",
                    "type": "natgateway",
                    "config": {
                        "AllocationId": {
                            "Fn::GetAtt": ["EIP3", "AllocationId"]
                        },
                        "SubnetId": {
                            "Ref": "PublicSubnet3"
                        },
                        "Tags": [
                            {
                                "Key": "Name",
                                "Value": {
                                    "Fn::Sub": "HRMS-NatGateway3-${Environment}"
                                }
                            }
                        ]
                    }
                },
                {
                    "name": "PrivateRoute1",
                    "type": "route",
                    "config": {
                        "RouteTableId": {
                            "Ref": "PrivateRouteTable1"
                        },
                        "DestinationCidrBlock": "0.0.0.0/0",
                        "NatGatewayId": {
                            "Ref": "NatGateway1"
                        }
                    }
                },
                {
                    "name": "PrivateRoute2",
                    "type": "route",
                    "config": {
                        "RouteTableId": {
                            "Ref": "PrivateRouteTable2"
                        },
                        "DestinationCidrBlock": "0.0.0.0/0",
                        "NatGatewayId": {
                            "Ref": "NatGateway2"
                        }
                    }
                },
                {
                    "name": "PrivateRoute3",
                    "type": "route",
                    "config": {
                        "RouteTableId": {
                            "Ref": "PrivateRouteTable3"
                        },
                        "DestinationCidrBlock": "0.0.0.0/0",
                        "NatGatewayId": {
                            "Ref": "NatGateway3"
                        }
                    }
                },
                {
                    "name": "LambdaSecurityGroup",
                    "type": "securitygroup",
                    "config": {
                        "GroupDescription": "Security group for NAT Gateway Lambda",
                        "VpcId": {
                            "Ref": "VPC"
                        },
                        "Tags": [
                            {
                                "Key": "Name",
                                "Value": {
                                    "Fn::Sub": "HRMS-Lambda-Securitygroup-${Environment}"
                                }
                            }
                        ]
                    }
                },
                {
                    "name": "RDSSecurityGroup",
                    "type": "securitygroup",
                    "config": {
                        "GroupDescription": "Allow http and https to client host",
                        "VpcId": {
                            "Ref": "VPC"
                        },
                        "Tags": [
                            {
                                "Key": "Name",
                                "Value": {
                                    "Fn::Sub": "HRMS-RDS-Securitygroup-${Environment}"
                                }
                            }
                        ],
                        "SecurityGroupIngress": [
                            {
                                "IpProtocol": "tcp",
                                "FromPort": 5432,
                                "ToPort": 5432,
                                "SourceSecurityGroupId": {
                                    "Ref": "LambdaSecurityGroup"
                                }
                            }
                        ],
                        "SecurityGroupEgress": [
                            {
                                "IpProtocol": "tcp",
                                "FromPort": 5432,
                                "ToPort": 5432,
                                "CidrIp": "0.0.0.0/0"
                            }
                        ]
                    }
                },
                {
                    "name": "RDSSubnetGroup",
                    "type": "dbsubnetgroup",
                    "config": {
                        "DBSubnetGroupDescription": "Subnet group for aurora data base",
                        "SubnetIds": [
                            {
                                "Ref": "PrivateSubnet1"
                            },
                            {
                                "Ref": "PrivateSubnet2"
                            },
                            {
                                "Ref": "PrivateSubnet3"
                            }
                        ],
                        "Tags": [
                            {
                                "Key": "Name",
                                "Value": {
                                    "Fn::Sub": "HRMS-RDS-Subnetgroup-${Environment}"
                                }
                            }
                        ]
                    }
                },
                {
                    "name": "RDSCluster",
                    "type": "dbcluster",
                    "config": {
                        "DBClusterIdentifier": {
                            "Ref": "DBUserName"
                        },
                        "MasterUsername": {
                            "Ref": "DBUserName"
                        },
                        "MasterUserPassword": {
                            "Ref": "DBUserPassword"
                        },
                        "DatabaseName": {
                            "Ref": "DBName"
                        },
                        "Engine": "aurora-postgresql",
                        "EngineMode": "serverless",
                        "EngineVersion": "10",
                        "EnableHttpEndpoint": true,
                        "ScalingConfiguration": {
                            "AutoPause": false,
                            "MaxCapacity": 2,
                            "MinCapacity": 2
                        },
                        "DBSubnetGroupName": {
                            "Ref": "RDSSubnetGroup"
                        },
                        "VpcSecurityGroupIds": [
                            {
                                "Ref": "RDSSecurityGroup"
                            }
                        ]
                    }
                },
                {
                    "name": "user",
                    "type": "lambda",
                    "config": {
                        "Environment": {
                            "Variables": {
                                "Secret": { "Ref": "usersecret" },
                                "Clustername": { "Ref": "RDSCluster" },
                                "Region": { "Ref": '"AWS::Region"' },
                                "Accountid": { "Ref": "AWS::AccountId" }
                            }
                        },
                        "Policies": [
                            "AWSLambdaBasicExecutionRole",
                            {
                                "Version": "2012-10-17",
                                "Statement": [
                                    {
                                        "Sid": "RDSDataServiceAccess",
                                        "Effect": "Allow",
                                        "Action": [
                                            "rds-data:BatchExecuteStatement",
                                            "rds-data:BeginTransaction",
                                            "rds-data:CommitTransaction",
                                            "rds-data:ExecuteStatement",
                                            "rds-data:RollbackTransaction"
                                        ],
                                        "Resource": "*"
                                    },
                                    {
                                        "Sid": "SecretsManagerDbCredentialsAccess",
                                        "Effect": "Allow",
                                        "Action": [
                                            "secretsmanager:GetSecretValue"
                                        ],
                                        "Resource": "*"
                                    },
                                    {
                                        "Sid": "SecretsManagerDbCredentialsAccess2",
                                        "Effect": "Allow",
                                        "Action": [
                                            "secretsmanager:GetSecretValue"
                                        ],
                                        "Resource": "*"
                                    },
                                    {
                                        "Sid": "RDSDataServiceAccess2",
                                        "Effect": "Allow",
                                        "Action": [
                                            "rds-data:*"
                                        ],
                                        "Resource": "*"
                                    }
                                ]
                            }
                        ],
                        "VpcConfig": {
                            "SecurityGroupIds": [
                                { "Ref": "LambdaSecurityGroup" }
                            ],
                            "SubnetIds": [
                                { "Ref": "PrivateSubnet1" },
                                { "Ref": "PrivateSubnet2" },
                                { "Ref": "PrivateSubnet3" }
                            ]
                        }
                    },
                    "package": ["typeorm", "typeorm-aurora-data-api-driver"],
                    "logic": true,
                    "logicpath": "rdstable"
                },
                {
                    "name": "usersecret",
                    "type": "secret",
                    "config": {
                        "SecretString": { "Fn::Sub": "{'database':${DBName},'username':${DBUserName},'password':${DBUserPassword}}" }
                    }
                }
            ]
        }
    };
};
exports.StackType = {
    "BaseModule": {
        "lone": {
            "resources": [
                {
                    "name": "lamone",
                    "type": "lambda",
                    "config": {},
                    "policies": {},
                    "logic": false
                },
                {
                    "name": "lamtwo",
                    "type": "lambda",
                    "config": {},
                    "policies": {},
                    "logic": false
                }
            ]
        },
        "ltwo": {
            "resources": [
                {
                    "name": "lamthree",
                    "type": "lambda",
                    "config": {},
                    "policies": {},
                    "logic": false
                },
                {
                    "name": "lamfour",
                    "type": "lambda",
                    "config": {},
                    "policies": {},
                    "logic": false
                }
            ]
        }
    },
    "TestModule": {
        "no_of_stack": 1,
        "stack_names": ["test"],
        "stack_resources": {
            "test": {
                "resources": [
                    {
                        "name": "PostSignup",
                        "type": "lambda",
                        "config": {
                            "Environment": {
                                "Variables": {
                                    "userinfoTable": { "Ref": "UserTabel" }
                                }
                            },
                            "Policies": [
                                "AWSLambdaDynamoDBExecutionRole",
                                {
                                    "DynamoDBCrudPolicy": {
                                        "TableName": { "Ref": "UserTabel" }
                                    }
                                }
                            ]
                        },
                        "logic": true
                    },
                    {
                        "name": "S3Bucket",
                        "type": "s3bucket",
                        "config": {},
                        "logic": false
                    },
                    {
                        "name": "UserTabel",
                        "type": "dynamoDB",
                        "config": {
                            "BillingMode": "PAY_PER_REQUEST",
                            "AttributeDefinitions": [
                                {
                                    "AttributeName": "email",
                                    "AttributeType": "S"
                                }
                            ],
                            "KeySchema": [
                                {
                                    "AttributeName": "email",
                                    "KeyType": "HASH"
                                }
                            ]
                        },
                        "logic": false
                    },
                    {
                        "name": "emailAuthPermission",
                        "type": "lambdaPermission",
                        "config": {
                            "FunctionName": { "Fn::GetAtt": ["PostSignup", "Arn"] },
                            "Principal": "cognito-idp.amazonaws.com",
                            "SourceArn": { "Fn::GetAtt": ["AuthUserPools", "Arn"] }
                        },
                        "logic": false
                    },
                    {
                        "name": "AuthUserPools",
                        "type": "cognitoUserPool",
                        "config": {
                            "UserPoolName": "Auth-User-Pool",
                            "AutoVerifiedAttributes": [
                                config.CognitoAutoVerifiedAttributes[0]
                            ],
                            "AliasAttributes": [
                                config.CognitoAliasAttributes[0]
                            ],
                            "Policies": {
                                "PasswordPolicy": {
                                    "MinimumLength": 8,
                                    "RequireUppercase": true,
                                    "RequireLowercase": true,
                                    "RequireNumbers": true,
                                    "RequireSymbols": true
                                }
                            },
                            "Schema": [
                                {
                                    "AttributeDataType": "String",
                                    "Name": "email",
                                    "Required": true
                                }
                            ],
                            "LambdaConfig": {
                                "PostConfirmation": { "Fn::GetAtt": ["PostSignup", "Arn"] }
                            }
                        },
                        "logic": false
                    },
                    {
                        "name": "AuthUserPoolsClient",
                        "type": "userPoolClient",
                        "config": {
                            "UserPoolId": { "Ref": "AuthUserPools" },
                            "GenerateSecret": false,
                            "SupportedIdentityProviders": [
                                config.CognitoSupportedIdentityProviders[0]
                            ],
                            "AllowedOAuthFlows": [
                                config.CognitoAllowedOAuthFlows[1]
                            ],
                            "AllowedOAuthScopes": [
                                config.CognitoAllowedOAuthScopes[0],
                                config.CognitoAllowedOAuthScopes[1],
                                config.CognitoAllowedOAuthScopes[2],
                                config.CognitoAllowedOAuthScopes[3],
                                config.CognitoAllowedOAuthScopes[4]
                            ],
                            "ExplicitAuthFlows": [
                                config.CognitoExplicitAuthFlows[2],
                                config.CognitoExplicitAuthFlows[4]
                            ],
                            "AllowedOAuthFlowsUserPoolClient": true,
                            "CallbackURLs": [
                                "https://www.google.com"
                            ]
                        },
                        "logic": false
                    },
                    {
                        "name": "emailAuthRole",
                        "type": "iamrole",
                        "config": {
                            "Path": "/",
                            "Policies": [
                                {
                                    "Action": "lambda:InvokeFunction",
                                    "Resource": { "Fn::Sub": "arn:aws:lambda:*:${AWS::AccountId}:function:*" }
                                }
                            ]
                        },
                        "logic": false
                    },
                    {
                        "name": "loginapi",
                        "type": "apigateway",
                        "config": {
                            "objects": [
                                {
                                    "name": "Books",
                                    "methods": ["get", "post"],
                                    "resource": "PostSignup",
                                    "path": "/books",
                                    "resourcetype": "lambda"
                                },
                                {
                                    "name": "Authors",
                                    "methods": ["get", "post", "put", "delete"],
                                    "resource": "PostSignup",
                                    "path": "/authors",
                                    "resourcetype": "lambda"
                                }
                            ]
                        },
                        "logic": false
                    },
                ]
            }
        }
    },
    "EmailAuthModule": {
        "EmailAuthModule": {
            "resources": [
                {
                    "name": "DefineAuthChallenge",
                    "type": "lambda",
                    "config": {
                        "Environment": {
                            "Variables": {
                                "userinfoTable": { "Ref": "UserTabel" }
                            }
                        },
                        "Policies": [
                            "AWSLambdaDynamoDBExecutionRole",
                            {
                                "DynamoDBCrudPolicy": {
                                    "TableName": { "Ref": "UserTabel" }
                                }
                            }
                        ]
                    },
                    "logic": true
                },
                {
                    "name": "AuthorizerFunction",
                    "type": "lambda",
                    "config": {
                        "Environment": {
                            "Variables": {
                                "UserPoolID": { "Ref": "AuthUserPools" },
                                "UserPoolClientID": { "Ref": "AuthUserPoolsClient" }
                            }
                        },
                        "Policies": [
                            "AWSLambdaDynamoDBExecutionRole",
                            {
                                "DynamoDBCrudPolicy": {
                                    "TableName": { "Ref": "UserTabel" }
                                }
                            }
                        ]
                    },
                    "logic": true
                },
                {
                    "name": "CreateAuthChallenge",
                    "type": "lambda",
                    "config": {
                        "Environment": {
                            "Variables": {
                                "SES_FROM_ADDRESS": { "Ref": "VerifyAuthChallengeResponse" }
                            }
                        },
                        "Policies": [
                            {
                                "Version": "2012-10-17",
                                "Statement": [
                                    {
                                        "Effect": "Allow",
                                        "Action": [
                                            "ses:SendEmail"
                                        ],
                                        "Resource": "*"
                                    }
                                ]
                            }
                        ]
                    },
                    "logic": true
                },
                {
                    "name": "VerifyAuthChallengeResponse",
                    "type": "lambda",
                    "config": {
                        "Environment": {
                            "Variables": {
                                "userinfoTable": { "Ref": "UserTabel" }
                            }
                        },
                        "Policies": [
                            "AWSLambdaDynamoDBExecutionRole",
                            {
                                "DynamoDBCrudPolicy": {
                                    "TableName": { "Ref": "UserTabel" },
                                    "USERPOOLID": { "Ref": "AuthUserPools" }
                                }
                            }
                        ]
                    },
                    "logic": true
                },
                {
                    "name": "PreSignUp",
                    "type": "lambda",
                    "config": {
                        "Environment": {
                            "Variables": {
                                "userinfoTable": { "Ref": "UserTabel" }
                            }
                        },
                        "Policies": [
                            "AWSLambdaDynamoDBExecutionRole",
                            {
                                "DynamoDBCrudPolicy": {
                                    "TableName": { "Ref": "UserTabel" }
                                }
                            }
                        ]
                    },
                    "logic": true
                },
                {
                    "name": "SignUpFunctions",
                    "type": "lambda",
                    "config": {
                        "Role": { "Fn::GetAtt": ["SignUpRoles", "Arn"] },
                        "Environment": {
                            "Variables": {
                                "UserPoolID": { "Ref": "AuthUserPools" },
                                "UserPoolClientID": { "Ref": "AuthUserPoolsClient" },
                                "userinfoTable": { "Ref": "UserTabel" }
                            }
                        },
                        "Policies": [
                            "AWSLambdaDynamoDBExecutionRole",
                            {
                                "DynamoDBCrudPolicy": {
                                    "TableName": { "Ref": "UserTabel" },
                                    "USERPOOLID": { "Ref": "AuthUserPools" }
                                }
                            }
                        ]
                    },
                    "logic": true
                },
                {
                    "name": "ResendCode",
                    "type": "lambda",
                    "config": {
                        "Role": { "Fn::GetAtt": ["SignUpRoles", "Arn"] },
                        "Environment": {
                            "Variables": {
                                "UserPoolID": { "Ref": "AuthUserPools" },
                                "UserPoolClientID": { "Ref": "AuthUserPoolsClient" },
                                "userinfoTable": { "Ref": "UserTabel" }
                            }
                        },
                        "Policies": [
                            "AWSLambdaDynamoDBExecutionRole",
                            {
                                "DynamoDBCrudPolicy": {
                                    "TableName": { "Ref": "UserTabel" },
                                    "UserPoolID": { "Ref": "AuthUserPools" },
                                    "UserPoolClientID": { "Ref": "AuthUserPoolsClient" }
                                }
                            }
                        ]
                    },
                    "logic": true
                },
                {
                    "name": "ConfirmForgotPassword",
                    "type": "lambda",
                    "config": {
                        "Role": { "Fn::GetAtt": ["SignUpRoles", "Arn"] },
                        "Environment": {
                            "Variables": {
                                "UserPoolID": { "Ref": "AuthUserPools" },
                                "UserPoolClientID": { "Ref": "AuthUserPoolsClient" },
                                "userinfoTable": { "Ref": "UserTabel" }
                            }
                        },
                        "Policies": [
                            "AWSLambdaDynamoDBExecutionRole",
                            {
                                "DynamoDBCrudPolicy": {
                                    "TableName": { "Ref": "UserTabel" },
                                    "USERPOOLID": { "Ref": "AuthUserPools" }
                                }
                            }
                        ]
                    },
                    "logic": true
                },
                {
                    "name": "ForgotPassword",
                    "type": "lambda",
                    "config": {
                        "Role": { "Fn::GetAtt": ["SignUpRoles", "Arn"] },
                        "Environment": {
                            "Variables": {
                                "UserPoolID": { "Ref": "AuthUserPools" },
                                "UserPoolClientID": { "Ref": "AuthUserPoolsClient" },
                                "userinfoTable": { "Ref": "UserTabel" }
                            }
                        },
                        "Policies": [
                            "AWSLambdaDynamoDBExecutionRole",
                            {
                                "DynamoDBCrudPolicy": {
                                    "TableName": { "Ref": "UserTabel" },
                                    "USERPOOLID": { "Ref": "AuthUserPools" }
                                }
                            }
                        ]
                    },
                    "logic": true
                },
                {
                    "name": "ConfirmUser",
                    "type": "lambda",
                    "config": {
                        "Role": { "Fn::GetAtt": ["SignUpRoles", "Arn"] },
                        "Environment": {
                            "Variables": {
                                "UserPoolID": { "Ref": "AuthUserPools" },
                                "UserPoolClientID": { "Ref": "AuthUserPoolsClient" },
                                "userinfoTable": { "Ref": "UserTabel" }
                            }
                        },
                        "Policies": [
                            "AWSLambdaDynamoDBExecutionRole",
                            {
                                "DynamoDBCrudPolicy": {
                                    "TableName": { "Ref": "UserTabel" }
                                }
                            }
                        ]
                    },
                    "logic": true
                },
                {
                    "name": "Users",
                    "type": "lambda",
                    "config": {
                        "Role": { "Fn::GetAtt": ["SignUpRoles", "Arn"] },
                        "Environment": {
                            "Variables": {
                                "UserPoolID": { "Ref": "AuthUserPools" },
                                "UserPoolClientID": { "Ref": "AuthUserPoolsClient" },
                                "userinfoTable": { "Ref": "UserTabel" }
                            }
                        },
                        "Policies": [
                            "AWSLambdaDynamoDBExecutionRole",
                            {
                                "DynamoDBCrudPolicy": {
                                    "TableName": { "Ref": "UserTabel" }
                                }
                            }
                        ]
                    },
                    "logic": true
                },
                {
                    "name": "UserTabel",
                    "type": "dynamoDB",
                    "config": {
                        "BillingMode": "PAY_PER_REQUEST",
                        "AttributeDefinitions": [
                            {
                                "AttributeName": "email",
                                "AttributeType": "S"
                            }
                        ],
                        "KeySchema": [
                            {
                                "AttributeName": "email",
                                "KeyType": "HASH"
                            }
                        ]
                    },
                    "logic": false
                },
                {
                    "name": "CreateAuthChallengeInvocationPermission",
                    "type": "lambdaPermission",
                    "config": {
                        "Action": "lambda:InvokeFunction",
                        "FunctionName": { "Fn::GetAtt": ["CreateAuthChallenge", "Arn"] },
                        "Principal": "cognito-idp.amazonaws.com",
                        "SourceArn": { "Fn::GetAtt": ["AuthUserPools", "Arn"] }
                    },
                    "logic": false
                },
                {
                    "name": "DefineAuthChallengeInvocationPermission",
                    "type": "lambdaPermission",
                    "config": {
                        "Action": "lambda:InvokeFunction",
                        "FunctionName": { "Fn::GetAtt": ["DefineAuthChallenge", "Arn"] },
                        "Principal": "cognito-idp.amazonaws.com",
                        "SourceArn": { "Fn::GetAtt": ["AuthUserPools", "Arn"] }
                    },
                    "logic": false
                },
                {
                    "name": "VerifyAuthChallengeResponseInvocationPermission",
                    "type": "lambdaPermission",
                    "config": {
                        "Action": "lambda:InvokeFunction",
                        "FunctionName": { "Fn::GetAtt": ["VerifyAuthChallengeResponse", "Arn"] },
                        "Principal": "cognito-idp.amazonaws.com",
                        "SourceArn": { "Fn::GetAtt": ["AuthUserPools", "Arn"] }
                    },
                    "logic": false
                },
                {
                    "name": "SignUpInvocationPermission",
                    "type": "lambdaPermission",
                    "config": {
                        "Principal": "cognito-idp.amazonaws.com",
                        "Action": "lambda:InvokeFunction",
                        "FunctionName": { "Fn::GetAtt": ["SignUpFunctions", "Arn"] },
                        "SourceArn": { "Fn::GetAtt": ["AuthUserPools", "Arn"] }
                    },
                    "logic": false
                },
                {
                    "name": "PreSignUpInvocationPermission",
                    "type": "lambdaPermission",
                    "config": {
                        "Action": "lambda:InvokeFunction",
                        "FunctionName": { "Fn::GetAtt": ["PreSignUp", "Arn"] },
                        "Principal": "cognito-idp.amazonaws.com",
                        "SourceArn": { "Fn::GetAtt": ["AuthUserPools", "Arn"] }
                    },
                    "logic": false
                },
                {
                    "name": "AuthUserPools",
                    "type": "cognitoUserPool",
                    "config": {
                        UserPoolName: "Auth-User-Pool",
                        MfaConfiguration: "OFF",
                        AutoVerifiedAttributes: [
                            "email"
                        ],
                        EmailVerificationSubject: "Your verification code",
                        EmailVerificationMessage: "Your verification code is {####}",
                        EmailConfiguration: { EmailSendingAccount: "COGNITO_DEFAULT" },
                        UsernameAttributes: [
                            "email"
                        ],
                        Schema: [
                            {
                                "Name": "name",
                                "AttributeDataType": "String",
                                "Mutable": true,
                                "Required": true
                            },
                            {
                                "Name": "email",
                                "AttributeDataType": "String",
                                "Mutable": true,
                                "Required": true
                            }
                        ],
                        Policies: {
                            "PasswordPolicy": {
                                "MinimumLength": 8,
                                "RequireUppercase": true,
                                "RequireLowercase": true,
                                "RequireNumbers": true,
                                "RequireSymbols": true
                            }
                        },
                        LambdaConfig: {
                            "CreateAuthChallenge": { "Fn::GetAtt": ["CreateAuthChallenge", "Arn"] },
                            "DefineAuthChallenge": { "Fn::GetAtt": ["DefineAuthChallenge", "Arn"] },
                            "PreSignUp": { "Fn::GetAtt": ["PreSignUp", "Arn"] },
                            "VerifyAuthChallengeResponse": { "Fn::GetAtt": ["VerifyAuthChallengeResponse", "Arn"] }
                        }
                    },
                    "logic": false
                },
                {
                    "name": "AuthUserPoolsClient",
                    "type": "userPoolClient",
                    "config": {
                        "UserPoolId": { "Ref": "AuthUserPools" },
                        "ClientName": "email-auth-client",
                        "GenerateSecret": false,
                        "ExplicitAuthFlows": [
                            "CUSTOM_AUTH_FLOW_ONLY"
                        ]
                    },
                    "logic": false
                },
                {
                    "name": "SignUpRoles",
                    "type": "iamrole",
                    "config": {
                        "iamservice": ["lambda.amazonaws.com", "apigateway.amazonaws.com"],
                        "managedarn": ["AWSLambdaBasicExecutionRole", "AmazonAPIGatewayPushToCloudWatchLogs"],
                        "Path": "/",
                        "Policies": [
                            { "name": "lambdainvoke",
                                "Action": "lambda:InvokeFunction",
                                "Resource": { "Fn::Sub": "arn:aws:lambda:*:${AWS::AccountId}:function:*" }
                            },
                            { "name": "cognito",
                                "Action": "cognito-idp:ListUsers",
                                "Resource": { "Fn::Sub": "arn:aws:cognito-idp:*:${AWS::AccountId}:userpool/*" }
                            },
                            { "name": "dynamodbcrud",
                                "Action": [
                                    "dynamodb:GetItem",
                                    "dynamodb:DeleteItem",
                                    "dynamodb:PutItem",
                                    "dynamodb:Scan",
                                    "dynamodb:Query",
                                    "dynamodb:UpdateItem",
                                    "dynamodb:BatchWriteItem",
                                    "dynamodb:BatchGetItem",
                                    "dynamodb:DescribeTable",
                                    "dynamodb:ConditionCheckItem"
                                ],
                                "Resource": [{ "Fn::Sub": "arn:aws:dynamodb:${AWS::Region}:${AWS::AccountId}:table/UserTabel" },
                                    { "Fn::Sub": "arn:aws:dynamodb:${AWS::Region}:${AWS::AccountId}:table/UserTabel/index/*" }
                                ]
                            }
                        ]
                    },
                    "logic": false
                },
                {
                    "name": "AllowSetUserAttributes",
                    "type": "iampolicy",
                    "config": {
                        "Statement": [
                            {
                                "Action": "cognito-idp:AdminUpdateUserAttributes",
                                "Resource": { "Fn::GetAtt": ["AuthUserPools", "Arn"] },
                                "Effect": "Allow"
                            }
                        ],
                        "Roles": [{ "Ref": "SignUpRoles" }],
                        "PolicyName": "AllowSetUserAttributespolicy"
                    },
                    "logic": false
                },
                {
                    "name": "EmailAuthAPIs",
                    "type": "apigateway",
                    "config": {
                        "StageName": "dev",
                        "objects": [
                            {
                                "name": "SignUpFunctions",
                                "methods": ["post"],
                                "resource": "SignUpFunctions",
                                "role": "SignUpRoles",
                                "path": "/signup",
                                "resourcetype": "lambda"
                            },
                            {
                                "name": "SignIn",
                                "methods": ["post"],
                                "resource": "SignUpFunctions",
                                "role": "SignUpRoles",
                                "path": "/signin",
                                "resourcetype": "lambda"
                            },
                            {
                                "name": "ConfirmUser",
                                "methods": ["post"],
                                "resource": "ConfirmUser",
                                "role": "SignUpRoles",
                                "path": "/confirmuser",
                                "resourcetype": "lambda"
                            },
                            {
                                "name": "ResendCode",
                                "methods": ["post"],
                                "resource": "ResendCode",
                                "role": "SignUpRoles",
                                "path": "/resendcode",
                                "resourcetype": "lambda"
                            },
                            {
                                "name": "ConfirmForgotPassword",
                                "methods": ["post"],
                                "resource": "ConfirmForgotPassword",
                                "role": "SignUpRoles",
                                "path": "/confirmforgotPassword",
                                "resourcetype": "lambda"
                            },
                            {
                                "name": "ForgotPassword",
                                "methods": ["post"],
                                "resource": "ForgotPassword",
                                "role": "SignUpRoles",
                                "path": "/forgotpassword",
                                "resourcetype": "lambda"
                            },
                            {
                                "name": "Users",
                                "methods": ["get", "put", "delete"],
                                "resource": "Users",
                                "role": "SignUpRoles",
                                "path": "/users",
                                "resourcetype": "lambda"
                            }
                        ],
                        "security": {
                            api_key: {
                                "apikeyName": "user_apikey",
                                "type": "apiKey",
                                "name": "x-api-key",
                                "in": "header"
                            },
                            authorizer: {
                                "authorizerName": "user_authorizer",
                                "type": "oauth2",
                                "x-amazon-apigateway-authorizer": {
                                    "type": "jwt",
                                    "jwtConfiguration": {
                                        "issuer": "https://cognito-idp.region.amazonaws.com/UserPoolId",
                                        "audience": [
                                            "audience1",
                                            "audience2"
                                        ]
                                    },
                                    "identitySource": "$request.header.Authorization"
                                }
                            }
                        }
                    },
                    "logic": false
                },
                {
                    "name": "ClientApiKey",
                    "type": "apikey",
                    "config": {
                        "DependsOn": ["EmailAuthAPIs", "EmailAuthAPIsdevStage"],
                        "Enabled": true,
                        "StageKeys": [
                            {
                                "RestApiId": { "Ref": "EmailAuthAPIs" },
                                "StageName": "dev"
                            },
                        ]
                    }
                },
                {
                    "name": "ClientOrderUsagePlan",
                    "type": "usageplan",
                    "config": {
                        "DependsOn": ["ClientApiKey"],
                        "ApiStages": [
                            {
                                "ApiId": { "Ref": "EmailAuthAPIs" },
                                "Stage": "dev"
                            }
                        ],
                        "Description": "Client Orders's usage plan",
                        "Throttle": {
                            "BurstLimit": 5,
                            "RateLimit": 5
                        }
                    }
                },
                {
                    "name": "ClientOrderUsagePlanKey",
                    "type": "usageplankey",
                    "config": {
                        "DependsOn": ["ClientOrderUsagePlan"],
                        "KeyId": { "Ref": "ClientApiKey" },
                        "KeyType": "API_KEY",
                        "UsagePlanId": { "Ref": "ClientOrderUsagePlan" }
                    }
                },
                {
                    "name": "CognitoAuthorizer",
                    "type": "apiauthorizer",
                    "config": {
                        "IdentitySource": "method.request.header.authorization",
                        "Name": "CognitoAuthorizer",
                        "ProviderARNs": [
                            { "Fn::GetAtt": ["AuthUserPools", "Arn"] },
                        ],
                        "RestApiId": { "Ref": "EmailAuthAPIs" },
                        "Type": "COGNITO_USER_POOLS"
                    }
                }
            ]
        }
    },
    "CRUD": generatecrud,
    "RDS": generaterds,
    "Customizable": {}
};
exports.ModuleDescription = [
    { key: "BaseModule", value: "Base Module : It’s a module with 2 stacks and 2 lambdas in each stack " },
    { key: "TestModule", value: "Test Module : Module with all AWS services supported by rover" },
    { key: "EmailAuthModule", value: "Email Auth Module : Authentication module using Cognito" },
    { key: "CRUD", value: "CRUD : CRUD APIs" },
    { key: "RDS", value: "RDS : RDS Data base" },
    { key: "Customizable", value: "Customizable : Create your own Module" }
];
exports.ModuleParams = {
    "BaseModule": {},
    "TestModule": {},
    "EmailAuthModule": {},
    "CRUD": { params: [{ key: "name", value: "string", message: "API Name :" }, { key: "path", value: "string", message: "API Path :" }, { key: "resourcetype", value: "choice", message: "Resource for API:" }, { key: "methods", value: "multichoice", message: "Methods required for API :" }] },
    "Customizable": {}
};
