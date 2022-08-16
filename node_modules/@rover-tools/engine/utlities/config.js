"use strict";
exports.__esModule = true;
exports.SwaggerPathSkeleton = exports.SwaggerSkeleton = exports.APIGatewayURI = exports.AWSResources = exports.AWSResourcesTypes = exports.LanguageSupport = exports.APIGatewaySkeleton = exports.IAMRoleSkeleton = exports.CognitoAliasAttributes = exports.CognitoAutoVerifiedAttributes = exports.CognitoAllowedOAuthFlows = exports.CognitoSupportedIdentityProviders = exports.CognitoExplicitAuthFlows = exports.CognitoAllowedOAuthScopes = exports.APIAuthorizerARN = exports.PolicySkeleton = exports.StepfunctionStatesTypeSkeletons = exports.StepfunctionStates = exports.StepfunctionStateTypes = exports.LambdaDemo = exports.ForceRemove = exports.SAMAppTemplate = exports.SAMAppName = exports.SAMDependency = exports.SAMLanguage = exports.SAMInitBase = exports.SkeletonConfig = void 0;
exports.SkeletonConfig = {};
exports.SkeletonConfig["template_version"] = "2010-09-09";
exports.SkeletonConfig["sam_transform_version"] = "AWS::Serverless-2016-10-31";
exports.SAMInitBase = "sam init --no-interactive ";
exports.SAMLanguage = " -r ";
exports.SAMDependency = " -d ";
exports.SAMAppName = " -n ";
exports.SAMAppTemplate = " --app-template hello-world";
exports.ForceRemove = "rm -rf ";
exports.LambdaDemo = "/lambda_demo";
exports.StepfunctionStateTypes = ["Succeed", "Fail", "Parallel", "Map", "Pass", "Wait", "Task", "Choice"];
exports.StepfunctionStates = {
    "Type": "",
    "Resource": "",
    "Next": "",
    "Comment": ""
};
exports.StepfunctionStatesTypeSkeletons = {
    "Task": {
        "Comment": "Task State example",
        "Type": "Task",
        "Resource": "arn:aws:states:us-east-1:123456789012:task:HelloWorld",
        "Next": "NextState",
        "TimeoutSeconds": 300,
        "HeartbeatSeconds": 60
    },
    "Pass": {
        "Type": "Pass",
        "Result": {},
        "ResultPath": "$.coords",
        "Next": "End"
    },
    "Choice": {
        "Type": "Choice",
        "Choices": [],
        "Default": "RecordEvent"
    },
    "Wait": {
        "Type": "Wait",
        "Seconds": 10,
        "Timestamp": "",
        "Next": "NextState"
    },
    "SuccessState": {
        "Type": "Succeed"
    },
    "FailState": {
        "Type": "Fail",
        "Error": "ErrorA",
        "Cause": "Kaiju attack"
    },
    "Parallel": {
        "Type": "Parallel",
        "Branches": [],
        "Next": "NextState"
    },
    "Map": {
        "Type": "Map",
        "InputPath": "",
        "ItemsPath": "",
        "MaxConcurrency": 0,
        "Parameters": {
            "parcel.$": "",
            "courier.$": ""
        },
        "Iterator": {},
        "ResultPath": "",
        "End": true
    }
};
exports.PolicySkeleton = {
    "PolicyDocument": {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [],
                "Resource": []
            }
        ]
    }
};
exports.APIAuthorizerARN = {
    "lambda": "arn:aws:apigateway:${Region}:lambda:path/2015-03-31/functions/arn:aws:lambda:${AWS::Region}:${AWS::AccountId}:function:FunctionName/invocations",
    "cognito": "arn:aws:cognito-idp:{region}:{account_id}:userpool/{UserPoolID}"
};
exports.CognitoAllowedOAuthScopes = [
    "phone",
    "email",
    "openid",
    "profile",
    "aws.cognito.signin.user.admin"
];
exports.CognitoExplicitAuthFlows = [
    "ALLOW_ADMIN_USER_PASSWORD_AUTH",
    "ALLOW_CUSTOM_AUTH",
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
];
exports.CognitoSupportedIdentityProviders = [
    "COGNITO",
    "Facebook",
    "SignInWithApple",
    "Google",
    "LoginWithAmazon"
];
exports.CognitoAllowedOAuthFlows = [
    "code",
    "implicit",
    "client_credentials"
];
exports.CognitoAutoVerifiedAttributes = [
    "email",
    "phone_number"
];
exports.CognitoAliasAttributes = [
    "email",
    "phone_number",
    "preferred_username"
];
var IAMRoleSkeleton = {
    "ManagedPolicyArns": [
        "arn:aws:iam::aws:policy/service-role/"
    ],
    "AssumeRolePolicyDocument": {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {
                    "Service": [
                        "apigateway.amazonaws.com"
                    ]
                },
                "Action": [
                    "sts:AssumeRole"
                ]
            }
        ]
    },
    "Path": "/",
    "Policies": []
};
exports.IAMRoleSkeleton = IAMRoleSkeleton;
exports.APIGatewaySkeleton = {
    "Fn::Transform": {
        "Name": "AWS::Include",
        "Parameters": {
            "Location": ""
        }
    }
};
exports.LanguageSupport = {
    "node": {
        "version": "nodejs14.x",
        "dependency": "npm",
        "extension": ".js"
    },
    "python": {
        "version": "python3.9",
        "dependency": "pip3",
        "extension": ".py"
    }
};
exports.AWSResourcesTypes = {
    "stack": "AWS::CloudFormation::Stack",
    "lambda": "AWS::Serverless::Function",
    "dynamoDB": "AWS::DynamoDB::Table",
    "cognitoUserPool": "AWS::Cognito::UserPool",
    "lambdaPermission": "AWS::Lambda::Permission",
    "userPoolClient": "AWS::Cognito::UserPoolClient",
    "iamrole": "AWS::IAM::Role",
    "iampolicy": "AWS::IAM::Policy",
    "apigateway": "AWS::Serverless::Api",
    "stepfunction": "AWS::Serverless::StateMachine",
    "s3bucket": "AWS::S3::Bucket",
    "apikey": "AWS::ApiGateway::ApiKey",
    "usageplankey": "AWS::ApiGateway::UsagePlanKey",
    "usageplan": "AWS::ApiGateway::UsagePlan",
    "apiauthorizer": "AWS::ApiGateway::Authorizer"
};
exports.AWSResources = {
    "stack": {
        "attributes": ["Type", "Properties", "DependsOn"],
        "type": "AWS::CloudFormation::Stack",
        "Properties": {
            "Base": ["TemplateURL"],
            "Optional": ["NotificationARNs", "Parameters", "Tags", "TemplateURL", "TimeoutInMinutes"]
        }
    },
    "lambda": {
        "name": "FunctionName",
        "type": "AWS::Serverless::Function",
        "attributes": ["Type", "Properties", "DependsOn"],
        "Properties": {
            "Base": ["FunctionName", "CodeUri", "Runtime"],
            "Optional": ["Events", "Environment", "Policies", "Role"],
            "Default": {
                "Handler": {
                    "Key": "Handler",
                    "Value": "app.lambdaHandler"
                }
            }
        }
    },
    "dynamoDB": {
        "name": "TableName",
        "type": "AWS::DynamoDB::Table",
        "attributes": ["Type", "Properties", "DependsOn"],
        "Properties": {
            "Base": ["TableName", "KeySchema"],
            "Optional": [
                "AttributeDefinitions",
                "BillingMode",
                "ContributorInsightsSpecification",
                "GlobalSecondaryIndexes",
                "KinesisStreamSpecification",
                "LocalSecondaryIndexes",
                "PointInTimeRecoverySpecification",
                "ProvisionedThroughput",
                "SSESpecification",
                "StreamSpecification",
                "TableClass",
                "Tags",
                "TimeToLiveSpecification"
            ]
        }
    },
    "cognitoUserPool": {
        "name": "UserPoolName",
        "type": "AWS::Cognito::UserPool",
        "attributes": ["Type", "Properties", "DependsOn"],
        "Properties": {
            "Base": ["UserPoolName"],
            "Optional": [
                "AccountRecoverySetting",
                "AdminCreateUserConfig",
                "AliasAttributes",
                "AutoVerifiedAttributes",
                "DeviceConfiguration",
                "EmailConfiguration",
                "EmailVerificationMessage",
                "EmailVerificationSubject",
                "EnabledMfas",
                "LambdaConfig",
                "MfaConfiguration",
                "Policies",
                "Schema",
                "SmsAuthenticationMessage",
                "SmsConfiguration",
                "SmsVerificationMessage",
                "UsernameAttributes",
                "UsernameConfiguration",
                "UserPoolAddOns",
                "UserPoolTags",
                "VerificationMessageTemplate"
            ]
        }
    },
    "userPoolClient": {
        "name": "ClientName",
        "type": "AWS::Cognito::UserPoolClient",
        "attributes": ["Type", "Properties", "DependsOn"],
        "Properties": {
            "Base": ["UserPoolId"],
            "Optional": [
                "AccessTokenValidity",
                "AllowedOAuthFlows",
                "AllowedOAuthFlowsUserPoolClient",
                "AllowedOAuthScopes",
                "AnalyticsConfiguration",
                "CallbackURLs",
                "ClientName",
                "DefaultRedirectURI",
                "EnableTokenRevocation",
                "ExplicitAuthFlows",
                "GenerateSecret",
                "IdTokenValidity",
                "LogoutURLs",
                "PreventUserExistenceErrors",
                "ReadAttributes",
                "RefreshTokenValidity",
                "SupportedIdentityProviders",
                "TokenValidityUnits",
                "WriteAttributes"
            ]
        }
    },
    "lambdaPermission": {
        "name": "Name",
        "type": "AWS::Lambda::Permission",
        "attributes": ["Type", "Properties", "DependsOn"],
        "Properties": {
            "Base": ["FunctionName", "Principal"],
            "Optional": [
                "EventSourceToken",
                "SourceAccount",
                "SourceArn"
            ],
            "Default": {
                "Action": {
                    "Key": "Action",
                    "Value": "lambda:InvokeFunction"
                }
            }
        }
    },
    "iamrole": {
        "name": "RoleName",
        "type": "AWS::IAM::Role",
        "attributes": ["Type", "Properties", "DependsOn"],
        "Properties": {
            "Base": ["AssumeRolePolicyDocument"],
            "Optional": [
                "Description",
                "ManagedPolicyArns",
                "MaxSessionDuration",
                "Path",
                "PermissionsBoundary",
                "Policies",
                "RoleName",
                "Tags"
            ],
            "Default": {
                "AssumeRolePolicyDocument": {
                    "Key": "AssumeRolePolicyDocument",
                    "Value": IAMRoleSkeleton["AssumeRolePolicyDocument"]
                }, "ManagedPolicyArns": {
                    "Key": "ManagedPolicyArns",
                    "Value": IAMRoleSkeleton["ManagedPolicyArns"]
                }
            }
        }
    },
    "iampolicy": {
        "name": "PolicyName",
        "type": "AWS::IAM::Policy",
        "attributes": ["Type", "Properties", "DependsOn"],
        "Properties": {
            "Base": ["PolicyName"],
            "Optional": [
                "Roles",
                "Users",
                "Groups"
            ],
            "Default": {}
        }
    },
    "apigateway": {
        "name": "Name",
        "type": "AWS::Serverless::Api",
        "attributes": ["Type", "Properties", "DependsOn"],
        "Properties": {
            "Base": ["Name"],
            "Optional": [
                "StageName",
                "AccessLogSetting",
                "Auth",
                "BinaryMediaTypes",
                "CacheClusterEnabled",
                "CacheClusterSize",
                "CanarySetting",
                "Cors",
                "DefinitionBody",
                "DefinitionUri",
                "Description",
                "DisableExecuteApiEndpoint",
                "Domain",
                "EndpointConfiguration",
                "GatewayResponses",
                "MethodSettings",
                "MinimumCompressionSize",
                "Mode",
                "Models",
                "Name",
                "OpenApiVersion",
                "Tags",
                "TracingEnabled",
                "Variables"
            ],
            "Default": {}
        }
    },
    "stepfunction": {
        "name": "Name",
        "type": "AWS::Serverless::StateMachine",
        "attributes": ["Type", "Properties", "DependsOn"],
        "Properties": {
            "Base": ["Definition", "DefinitionUri"],
            "Optional": [
                "Definition",
                "DefinitionSubstitutions",
                "DefinitionUri",
                "Events",
                "Logging",
                "Name",
                "PermissionsBoundary",
                "Policies",
                "Role",
                "Tags",
                "Tracing",
                "Type"
            ],
            "Default": {}
        }
    },
    "s3bucket": {
        "name": "BucketName",
        "type": "AWS::S3::Bucket",
        "attributes": ["Type", "Properties", "DependsOn"],
        "Properties": {
            "Base": ["BucketName"],
            "Optional": [
                "AccelerateConfiguration",
                "AccessControl",
                "AnalyticsConfigurations",
                "BucketEncryption",
                "CorsConfiguration",
                "IntelligentTieringConfigurations",
                "InventoryConfigurations",
                "LifecycleConfiguration",
                "LoggingConfiguration",
                "MetricsConfigurations",
                "NotificationConfiguration",
                "ObjectLockConfiguration",
                "ObjectLockEnabled",
                "OwnershipControls",
                "PublicAccessBlockConfiguration",
                "ReplicationConfiguration",
                "Tags",
                "VersioningConfiguration",
                "WebsiteConfiguration",
            ],
            "Default": {}
        }
    },
    "apikey": {
        "name": "Name",
        "type": "AWS::ApiGateway::ApiKey",
        "attributes": ["Type", "Properties", "DependsOn"],
        "Properties": {
            "Base": ["Name"],
            "Optional": [
                "CustomerId",
                "Description",
                "Enabled",
                "GenerateDistinctId",
                "StageKeys",
                "Tags",
                "Value"
            ],
            "Default": {}
        }
    },
    "usageplan": {
        "name": "UsagePlanName",
        "type": "AWS::ApiGateway::UsagePlan",
        "attributes": ["Type", "Properties", "DependsOn"],
        "Properties": {
            "Base": ["UsagePlanName"],
            "Optional": [
                "ApiStages",
                "Description",
                "Quota",
                "Tags",
                "Throttle"
            ],
            "Default": {}
        }
    },
    "usageplankey": {
        "attributes": ["Type", "Properties", "DependsOn"],
        "type": "AWS::ApiGateway::UsagePlanKey",
        "Properties": {
            "Base": ["KeyId", "KeyType", "UsagePlanId"],
            "Optional": [],
            "Default": {}
        }
    },
    "apiauthorizer": {
        "name": "Name",
        "type": "AWS::ApiGateway::Authorizer",
        "attributes": ["Type", "Properties", "DependsOn"],
        "Properties": {
            "Base": ["Name", "RestApiId", "Type"],
            "Optional": [
                "AuthorizerCredentials",
                "AuthorizerResultTtlInSeconds",
                "AuthorizerUri",
                "AuthType",
                "IdentitySource",
                "IdentityValidationExpression",
                "ProviderARNs"
            ],
            "Default": {}
        }
    },
    "vpc": {
        "name": "",
        "type": "AWS::EC2::VPC",
        "attributes": ["Type", "Properties", "DependsOn"],
        "Properties": {
            "Base": [],
            "Optional": ["CidrBlock", "EnableDnsHostnames", "EnableDnsSupport", "InstanceTenancy", "Ipv4IpamPoolId", "Ipv4NetmaskLength", "Tags"]
        }
    },
    "internetgateway": {
        "name": "",
        "type": "AWS::EC2::InternetGateway",
        "attributes": ["Type", "Properties", "DependsOn"],
        "Properties": {
            "Base": [],
            "Optional": ["Tags"]
        }
    },
    "vpcgatewayattachment": {
        "name": "",
        "type": "AWS::EC2::VPCGatewayAttachment",
        "attributes": ["Type", "Properties", "DependsOn"],
        "Properties": {
            "Base": ["VpcId"],
            "Optional": ["InternetGatewayId", "VpnGatewayId"]
        }
    },
    "subnet": {
        "name": "",
        "type": "AWS::EC2::Subnet",
        "attributes": ["Type", "Properties", "DependsOn"],
        "Properties": {
            "Base": ["VpcId"],
            "Optional": [
                "AssignIpv6AddressOnCreation",
                "AvailabilityZone",
                "AvailabilityZoneId",
                "CidrBlock",
                "EnableDns64",
                "Ipv6CidrBlock",
                "Ipv6Native",
                "MapPublicIpOnLaunch",
                "OutpostArn",
                "PrivateDnsNameOptionsOnLaunch",
                "Tags"
            ]
        }
    },
    "routetable": {
        "name": "",
        "type": "AWS::EC2::RouteTable",
        "attributes": ["Type", "Properties", "DependsOn"],
        "Properties": {
            "Base": ["VpcId"],
            "Optional": ["Tags"]
        }
    },
    "route": {
        "name": "",
        "type": "AWS::EC2::Route",
        "attributes": [
            "Type",
            "Properties",
            "DependsOn"
        ],
        "Properties": {
            "Base": [
                "RouteTableId"
            ],
            "Optional": [
                "CarrierGatewayId",
                "DestinationCidrBlock",
                "DestinationIpv6CidrBlock",
                "EgressOnlyInternetGatewayId",
                "GatewayId",
                "InstanceId",
                "LocalGatewayId",
                "NatGatewayId",
                "NetworkInterfaceId",
                "TransitGatewayId",
                "VpcEndpointId",
                "VpcPeeringConnectionId"
            ]
        }
    },
    "subnetroutetableassociation": {
        "name": "",
        "type": "AWS::EC2::SubnetRouteTableAssociation",
        "attributes": [
            "Type",
            "Properties",
            "DependsOn"
        ],
        "Properties": {
            "Base": [
                "RouteTableId",
                "SubnetId"
            ],
            "Optional": []
        }
    },
    "eip": {
        "name": "",
        "type": "AWS::EC2::EIP",
        "attributes": [
            "Type",
            "Properties",
            "DependsOn"
        ],
        "Properties": {
            "Base": [],
            "Optional": [
                "Domain",
                "InstanceId",
                "NetworkBorderGroup",
                "PublicIpv4Pool",
                "Tags"
            ]
        }
    },
    "natgateway": {
        "name": "",
        "type": "AWS::EC2::NatGateway",
        "attributes": [
            "Type",
            "Properties",
            "DependsOn"
        ],
        "Properties": {
            "Base": [
                "SubnetId"
            ],
            "Optional": [
                "AllocationId",
                "ConnectivityType",
                "Tags"
            ]
        }
    },
    "securitygroup": {
        "name": "",
        "type": "AWS::EC2::SecurityGroup",
        "attributes": [
            "Type",
            "Properties",
            "DependsOn"
        ],
        "Properties": {
            "Base": [
                "GroupDescription"
            ],
            "Optional": [
                "GroupName",
                "SecurityGroupEgress",
                "SecurityGroupIngress",
                "Tags",
                "VpcId"
            ]
        }
    },
    "dbsubnetgroup": {
        "name": "",
        "type": "AWS::RDS::DBSubnetGroup",
        "attributes": [
            "Type",
            "Properties",
            "DependsOn"
        ],
        "Properties": {
            "Base": [
                "SubnetIds",
                "DBSubnetGroupDescription"
            ],
            "Optional": [
                "DBSubnetGroupName",
                "Tags"
            ]
        }
    },
    "dbcluster": {
        "name": "",
        "type": "AWS::RDS::DBCluster",
        "attributes": [
            "Type",
            "Properties",
            "DependsOn"
        ],
        "Properties": {
            "Base": [
                "Engine"
            ],
            "Optional": [
                "AssociatedRoles",
                "AvailabilityZones",
                "BacktrackWindow",
                "BackupRetentionPeriod",
                "CopyTagsToSnapshot",
                "DatabaseName",
                "DBClusterIdentifier",
                "DBClusterParameterGroupName",
                "DBSubnetGroupName",
                "DeletionProtection",
                "EnableCloudwatchLogsExports",
                "EnableHttpEndpoint",
                "EnableIAMDatabaseAuthentication",
                "EngineMode",
                "EngineVersion",
                "GlobalClusterIdentifier",
                "KmsKeyId",
                "MasterUsername",
                "MasterUserPassword",
                "Port",
                "PreferredBackupWindow",
                "PreferredMaintenanceWindow",
                "ReplicationSourceIdentifier",
                "RestoreType",
                "ScalingConfiguration",
                "SnapshotIdentifier",
                "SourceDBClusterIdentifier",
                "SourceRegion",
                "StorageEncrypted",
                "Tags",
                "UseLatestRestorableTime",
                "VpcSecurityGroupIds"
            ]
        }
    },
    "dbinstance": {
        "name": "DBName",
        "type": "AWS::RDS::DBInstance",
        "attributes": [
            "Type",
            "Properties",
            "DependsOn"
        ],
        "Properties": {
            "Optional": [
                "AllocatedStorage",
                "AllowMajorVersionUpgrade",
                "AssociatedRoles",
                "AutoMinorVersionUpgrade",
                "AvailabilityZone",
                "BackupRetentionPeriod",
                "CACertificateIdentifier",
                "CharacterSetName",
                "CopyTagsToSnapshot",
                "DBClusterIdentifier",
                "DBInstanceIdentifier",
                "DBName",
                "DBParameterGroupName",
                "DBSecurityGroups",
                "DBSnapshotIdentifier",
                "DBSubnetGroupName",
                "DeleteAutomatedBackups",
                "DeletionProtection",
                "Domain",
                "DomainIAMRoleName",
                "EnableCloudwatchLogsExports",
                "EnableIAMDatabaseAuthentication",
                "EnablePerformanceInsights",
                "Engine",
                "EngineVersion",
                "Iops",
                "KmsKeyId",
                "LicenseModel",
                "MasterUsername",
                "MasterUserPassword",
                "MaxAllocatedStorage",
                "MonitoringInterval",
                "MonitoringRoleArn",
                "MultiAZ",
                "OptionGroupName",
                "PerformanceInsightsKMSKeyId",
                "PerformanceInsightsRetentionPeriod",
                "Port",
                "PreferredBackupWindow",
                "PreferredMaintenanceWindow",
                "ProcessorFeatures",
                "PromotionTier",
                "PubliclyAccessible",
                "SourceDBInstanceIdentifier",
                "SourceRegion",
                "StorageEncrypted",
                "StorageType",
                "Tags",
                "Timezone",
                "UseDefaultProcessorFeatures",
                "VPCSecurityGroups"
            ],
            "Base": ["DBInstanceClass"]
        }
    },
    "secret": {
        "name": "Name",
        "type": "AWS::SecretsManager::Secret",
        "attributes": ["Type", "Properties", "DependsOn"],
        "Properties": {
            "Base": ["Name"],
            "Optional": ["Description", "GenerateSecretString", "KmsKeyId", "ReplicaRegions", "SecretString", "Tags"]
        }
    }
};
exports.APIGatewayURI = {
    "lambda": "lambda:path/2015-03-31/functions/${lambda.Arn}/invocations",
    "stepfunction": "states:action/StartSyncExecution"
};
exports.SwaggerSkeleton = {
    "openapi": "3.0.1",
    "info": {
        "title": "user-api",
        "version": "2021-11-22T07:01:12Z"
    },
    "paths": {},
    "components": {
        "schemas": {
            "Empty": {
                "title": "Empty Schema",
                "type": "object"
            }
        }
    }
};
exports.SwaggerPathSkeleton = {
    "get": {
        "parameters": [
            {
                "name": "email",
                "in": "path",
                "required": true,
                "schema": {
                    "type": "string"
                }
            }
        ],
        "responses": {
            "200": {
                "description": "200 response",
                "headers": {
                    "Access-Control-Allow-Origin": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Methods": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Headers": {
                        "schema": {
                            "type": "string"
                        }
                    }
                },
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Empty"
                        }
                    }
                }
            },
            "400": {
                "description": "200 response",
                "headers": {
                    "Access-Control-Allow-Origin": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Methods": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Headers": {
                        "schema": {
                            "type": "string"
                        }
                    }
                },
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Empty"
                        }
                    }
                }
            },
            "500": {
                "description": "200 response",
                "headers": {
                    "Access-Control-Allow-Origin": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Methods": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Headers": {
                        "schema": {
                            "type": "string"
                        }
                    }
                },
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Empty"
                        }
                    }
                }
            }
        },
        "x-amazon-apigateway-integration": {
            "httpMethod": "POST",
            "uri": { "Fn::Sub": "arn:aws:apigateway:${AWS::Region}:" },
            "responses": {
                "default": {
                    "statusCode": "200",
                    "responseParameters": {
                        "method.response.header.Access-Control-Allow-Methods": "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'",
                        "method.response.header.Access-Control-Allow-Headers": "'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'",
                        "method.response.header.Access-Control-Allow-Origin": "'*'"
                    },
                    "responseTemplates": {
                        "application/json": "{}    \n"
                    }
                }
            },
            "passthroughBehavior": "when_no_match",
            "contentHandling": "CONVERT_TO_TEXT",
            "type": "aws_proxy"
        }
    },
    "post": {
        "responses": {
            "200": {
                "description": "200 response",
                "headers": {
                    "Access-Control-Allow-Origin": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Methods": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Headers": {
                        "schema": {
                            "type": "string"
                        }
                    }
                },
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Empty"
                        }
                    }
                }
            },
            "400": {
                "description": "200 response",
                "headers": {
                    "Access-Control-Allow-Origin": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Methods": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Headers": {
                        "schema": {
                            "type": "string"
                        }
                    }
                },
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Empty"
                        }
                    }
                }
            },
            "500": {
                "description": "200 response",
                "headers": {
                    "Access-Control-Allow-Origin": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Methods": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Headers": {
                        "schema": {
                            "type": "string"
                        }
                    }
                },
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Empty"
                        }
                    }
                }
            }
        },
        "x-amazon-apigateway-integration": {
            "httpMethod": "POST",
            "uri": { "Fn::Sub": "arn:aws:apigateway:${AWS::Region}:" },
            "responses": {
                "default": {
                    "statusCode": "200",
                    "responseParameters": {
                        "method.response.header.Access-Control-Allow-Methods": "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'",
                        "method.response.header.Access-Control-Allow-Headers": "'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'",
                        "method.response.header.Access-Control-Allow-Origin": "'*'"
                    },
                    "responseTemplates": {
                        "application/json": "{}    \n"
                    }
                }
            },
            "passthroughBehavior": "when_no_match",
            "contentHandling": "CONVERT_TO_TEXT",
            "type": "aws_proxy"
        }
    },
    "delete": {
        "parameters": [
            {
                "name": "email",
                "in": "path",
                "required": true,
                "schema": {
                    "type": "string"
                }
            }
        ],
        "responses": {
            "200": {
                "description": "200 response",
                "headers": {
                    "Access-Control-Allow-Origin": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Methods": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Headers": {
                        "schema": {
                            "type": "string"
                        }
                    }
                },
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Empty"
                        }
                    }
                }
            },
            "400": {
                "description": "200 response",
                "headers": {
                    "Access-Control-Allow-Origin": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Methods": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Headers": {
                        "schema": {
                            "type": "string"
                        }
                    }
                },
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Empty"
                        }
                    }
                }
            },
            "500": {
                "description": "200 response",
                "headers": {
                    "Access-Control-Allow-Origin": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Methods": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Headers": {
                        "schema": {
                            "type": "string"
                        }
                    }
                },
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Empty"
                        }
                    }
                }
            }
        },
        "x-amazon-apigateway-integration": {
            "httpMethod": "POST",
            "uri": { "Fn::Sub": "arn:aws:apigateway:${AWS::Region}:" },
            "responses": {
                "default": {
                    "statusCode": "200",
                    "responseParameters": {
                        "method.response.header.Access-Control-Allow-Methods": "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'",
                        "method.response.header.Access-Control-Allow-Headers": "'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'",
                        "method.response.header.Access-Control-Allow-Origin": "'*'"
                    },
                    "responseTemplates": {
                        "application/json": "{}    \n"
                    }
                }
            },
            "passthroughBehavior": "when_no_match",
            "contentHandling": "CONVERT_TO_TEXT",
            "type": "aws_proxy"
        }
    },
    "put": {
        "parameters": [
            {
                "name": "email",
                "in": "path",
                "required": true,
                "schema": {
                    "type": "string"
                }
            }
        ],
        "responses": {
            "200": {
                "description": "200 response",
                "headers": {
                    "Access-Control-Allow-Origin": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Methods": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Headers": {
                        "schema": {
                            "type": "string"
                        }
                    }
                },
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Empty"
                        }
                    }
                }
            },
            "400": {
                "description": "200 response",
                "headers": {
                    "Access-Control-Allow-Origin": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Methods": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Headers": {
                        "schema": {
                            "type": "string"
                        }
                    }
                },
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Empty"
                        }
                    }
                }
            },
            "500": {
                "description": "200 response",
                "headers": {
                    "Access-Control-Allow-Origin": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Methods": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Headers": {
                        "schema": {
                            "type": "string"
                        }
                    }
                },
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Empty"
                        }
                    }
                }
            }
        },
        "x-amazon-apigateway-integration": {
            "httpMethod": "POST",
            "uri": { "Fn::Sub": "arn:aws:apigateway:${AWS::Region}:" },
            "responses": {
                "default": {
                    "statusCode": "200",
                    "responseParameters": {
                        "method.response.header.Access-Control-Allow-Methods": "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'",
                        "method.response.header.Access-Control-Allow-Headers": "'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'",
                        "method.response.header.Access-Control-Allow-Origin": "'*'"
                    },
                    "responseTemplates": {
                        "application/json": "{}    \n"
                    }
                }
            },
            "passthroughBehavior": "when_no_match",
            "contentHandling": "CONVERT_TO_TEXT",
            "type": "aws_proxy"
        }
    },
    "options": {
        "responses": {
            "200": {
                "description": "200 response",
                "headers": {
                    "Access-Control-Allow-Origin": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Methods": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Headers": {
                        "schema": {
                            "type": "string"
                        }
                    }
                },
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Empty"
                        }
                    }
                }
            },
            "400": {
                "description": "200 response",
                "headers": {
                    "Access-Control-Allow-Origin": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Methods": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Headers": {
                        "schema": {
                            "type": "string"
                        }
                    }
                },
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Empty"
                        }
                    }
                }
            },
            "500": {
                "description": "200 response",
                "headers": {
                    "Access-Control-Allow-Origin": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Methods": {
                        "schema": {
                            "type": "string"
                        }
                    },
                    "Access-Control-Allow-Headers": {
                        "schema": {
                            "type": "string"
                        }
                    }
                },
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Empty"
                        }
                    }
                }
            }
        },
        "x-amazon-apigateway-integration": {
            "responses": {
                "default": {
                    "statusCode": "200",
                    "responseParameters": {
                        "method.response.header.Access-Control-Allow-Methods": "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'",
                        "method.response.header.Access-Control-Allow-Headers": "'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'",
                        "method.response.header.Access-Control-Allow-Origin": "'*'"
                    },
                    "responseTemplates": {
                        "application/json": "{}    \n"
                    }
                }
            },
            "requestTemplates": {
                "application/json": "{\"statusCode\": 200}"
            },
            "passthroughBehavior": "when_no_match",
            "type": "mock"
        }
    }
};
