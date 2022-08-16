"use strict";
exports.__esModule = true;
exports.samConfig = void 0;
exports.samConfig = {
    choices: {
        tool: ["git", "gitLab", "sambuild"],
        language: ["js", "python"],
        framework: ["sam", "cdk"],
        deploymentregion: [
            "us-east-2",
            "us-east-1",
            "us-west-1",
            "us-west-2",
            "af-south-1",
            "ap-east-1",
            "ap-southeast-3",
            "ap-south-1",
            "ap-northeast-3",
            "ap-northeast-2",
            "ap-southeast-1",
            "ap-southeast-2",
            "ap-northeast-1",
            "ca-central-1",
            "eu-central-1",
            "eu-west-1",
            "eu-west-2",
            "eu-south-1",
            "eu-west-3",
            "eu-north-1",
            "me-south-1",
            "sa-east-1",
            "us-gov-east-1",
            "us-gov-west-1",
        ],
        dev: ["build", "deploy"],
        repoType: ["public", "private"],
        deployment: ["push", "pull", "commit"]
    },
    samBuild: [
        //   { key: "name", value: "string" },
        //   { key: "app_name", value: "string" },
        //   { key: "repoType", value: "choice" },
        //   { key: "tool", value: "choice" },
        //   { key: "language", value: "choice" },
        //   { key: "framework", value: "choice" },
        { key: "name", value: "string", message: "Name:" },
        { key: "app_name", value: "string", message: "App Name:" },
        { key: "repoType", value: "choice", message: "Repo Type:" },
        { key: "tool", value: "choice", message: "Tools:" },
        { key: "language", value: "choice", message: "Language:" },
        { key: "framework", value: "choice", message: "Framework:" },
    ]
};
