import { AnyArray, AnyObject } from "immer/dist/internal"
import * as config  from "../utlities/config"
export const generatelambda=(name,config)=>{
  return {
    "name":name+"Function",
    "type":"lambda",
    "config":{
        
        "Environment": {
            "Variables": {
              "Table": { "Ref" : name+"Tabel"}
            }
        },
        "Policies": [
          "AWSLambdaDynamoDBExecutionRole",
          {
            "DynamoDBCrudPolicy": {
              "TableName": { "Ref" : name+"Tabel"},
              
            }
          }
        ]
      },
    "logic":true
  }

}
export const generatetable= (name,config)=>{
  return {
    "name":name+"Tabel",
    "type":"dynamoDB",
    "config":{
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
    "logic":false
  }
}

const s3_lambda = (funcname,bucketname)=>{}
export let Components={
    "s3_lambda":[
      {
        "name":"lambdas",
        "type":"lambda",
        "config":{
            "Policies": [
              "AWSLambdaDynamoDBExecutionRole"
            ]
          },
        "logic":true
    },
    {
      "name":"Bucket",
      "type":"s3bucket",
      "config":{
        "CorsConfiguration": {
          "CorsRules": [
              {
                  "AllowedHeaders": [
                      "*"
                  ],
                  "AllowedMethods": [
                      "GET",
                      "PUT",
                      "POST",
                      "DELETE"
                  ],
                  "AllowedOrigins": [
                      "*"
                  ]
              }
          ]
      }
      },
      
    }
    ],
    "crud_api":[
    {
      "name":"crudRoles",
      "type":"iamrole",
      "config":{
       "iamservice":["lambda.amazonaws.com","apigateway.amazonaws.com"],
       "managedarn":["AWSLambdaBasicExecutionRole","AmazonAPIGatewayPushToCloudWatchLogs"],
       "Path": "/",
       "Policies":[
           {  "name":"lambdainvoke",
               "Action": "lambda:InvokeFunction",
               "Resource": { "Fn::Sub":"arn:aws:lambda:*:${AWS::AccountId}:function:*"}
           },
           {  "name":"dynamodbcrud",
               "Action":  [
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
               "Resource":[ { "Fn::Sub":"arn:aws:dynamodb:${AWS::Region}:${AWS::AccountId}:table/UserTabel"},
               { "Fn::Sub":"arn:aws:dynamodb:${AWS::Region}:${AWS::AccountId}:table/UserTabel/index/*"}
]
           }
       ]
          
      },
      "logic":false
    },
    {
    "name":"EmailAuthAPIs",
    "type":"apigateway",
    "config":{
      "StageName":"dev",
      "objects":[
        {
          "name":"Users",
          "methods":["get","put","delete"],
          "resource":"Users",
          "role":"crudRoles",
          "path":"/users",
          "resourcetype":"lambda"
        }
        ]
        
       
      },
    "logic":false
    },
    {
      "name":"Users",
      "type":"lambda",
      "config":{
          "Role":  {"Fn::GetAtt": [ "crudRoles","Arn"]},
          "Environment": {
              "Variables": {
                "UserPoolID": { "Ref" : "AuthUserPools"},
                "UserPoolClientID": { "Ref" : "AuthUserPoolsClient"},
                "userinfoTable": { "Ref" : "UserTabel"}
              }
          },
          "Policies": [
            "AWSLambdaDynamoDBExecutionRole",
            {
              "DynamoDBCrudPolicy": {
                "TableName": { "Ref" : "UserTabel"},
                
              }
            }
          ]
        },
      "logic":true
    },
    {
      "name":"UserTabel",
      "type":"dynamoDB",
      "config":{
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
      "logic":false
    },
    ],
   
}
export let ModuleDescription={
  "s3_lambda":"lambda with S3 as trigger",
 
}