"use strict";
exports.__esModule = true;
exports.samConfig = void 0;
exports.samConfig = {
    choices: {
        tools: ["git", "gitLab", "SamBuild"],
        language: ["js", "python"],
        framework: ["sam", "git"],
        deploymentregion: ["ap-soth-1", "east-1"],
        dev: ["build", "deploy"],
        repoType: ["public", "private"]
    },
    samBuild: [
        { key: "name", value: "string" },
        { key: "repoType", value: "choice" },
        { key: "tools", value: "choice" },
        { key: "language", value: "choice" },
        { key: "framework", value: "choice" },
        { key: "no_envs", value: "Integer" },
        { key: "accesskey", value: "string" },
        { key: "secretkey", value: "string" },
        { key: "steps", value: "object" },
        { key: "stackname", value: "object" },
        { key: "deploymentbucket", value: "object" }
        // {key:"s3Names",value:"string"},//only to get the names
    ],
    steps: [
        { key: "dev", value: "choice" },
    ],
    stackname: [{ key: "dev", value: "string" }],
    deploymentbucket: [
        { key: "dev", value: "string" },
        { key: "deploymentregion", value: "choice" },
        { key: "deploymentparameters", value: "object" },
        { key: "deployment_event", value: "string" },
    ],
    deploymentparameters: [
        { key: "dev", value: "list" }
    ]
};
