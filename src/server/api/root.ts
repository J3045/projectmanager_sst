
import { taskRouter } from "../api/routers/task";
import { projectRouter } from "../api/routers/project";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "../api/routers/auth";
import { userRouter } from "../api/routers/userRouter";


/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  task: taskRouter,
  project: projectRouter,
  user: userRouter, // ✅ Use only `userRouter`
});


// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.task.createTask(...);
 *       ^? Task
 */
export const createCaller = createCallerFactory(appRouter);
