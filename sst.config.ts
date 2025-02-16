// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "projectmanagementapp",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    new sst.aws.Nextjs("site", {
      path: ".", // Path of your Next.js app
      environment: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || "",
        DATABASE_URL: process.env.DATABASE_URL || "",
        AUTH_SECRET: process.env.AUTH_SECRET || "",
        AUTH_DISCORD_ID: process.env.AUTH_DISCORD_ID || "",
        AUTH_DISCORD_SECRET: process.env.AUTH_DISCORD_SECRET || "",
        DIRECT_URL: process.env.DIRECT_URL || "",
      },
      transform: {
        cdn: (args) => {
          args.defaultBehavior = {
            ...args.defaultBehavior,
            allowedMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            cachedMethods: ["GET", "HEAD"],
            forwardedValues: {
              headers: ["*"], // Allow all headers
            },
          };
          return args;
        },
      },
    });

    return {
      api: {
        routes: {
          "GET    /getAllProjects": "server/api/routers/project.getAllProjects",
          "POST   /getProjectById": "server/api/routers/project.getProjectById",
          "POST   /createProject": "server/api/routers/project.createProject",
          "PUT    /updateProject": "server/api/routers/project.updateProject",
          "POST   /assignTeamToProject": "server/api/routers/project.assignTeamToProject",
          "DELETE /deleteProject": "server/api/routers/project.deleteProject",
        },
      },
    };
  },
});
