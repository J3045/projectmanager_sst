import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { z } from "zod";
import { compare, hash } from "bcryptjs";

export const userRouter = createTRPCRouter({
  // Get all users
  getAllUsers: protectedProcedure.query(async () => {
    try {
      const users = await db.user.findMany({
        select: {
          id: true,
          name: true,
        },
      });
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Failed to fetch users");
    }
  }),

  // Get the logged-in user's profile
  getUserProfile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }),

  // Update user profile
  updateUserProfile: protectedProcedure
  .input(
    z.object({
      name: z.string().min(1, "Name is required").optional(),
      email: z.string().email().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id;

    // Check if the username is already taken (if the user is changing it)
    if (input.name) {
      const existingUser = await db.user.findFirst({
        where: {
          name: input.name,
          NOT: { id: userId }, // Exclude the current user from the check
        },
      });

      if (existingUser) {
        throw new Error("Username is already taken. Please choose another.");
      }
    }

    // Update user profile
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        name: input.name,
        email: input.email,
      },
    });

    return { message: "Profile updated successfully", user: updatedUser };
  }),


  // Change password
  changePassword: protectedProcedure
  .input(
    z.object({
      oldPassword: z.string().min(6),
      newPassword: z.string().min(6),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id;
    const user = await db.user.findUnique({ where: { id: userId } });

    if (!user || !user.hashedPassword) {
      throw new Error("User not found");
    }

    // ✅ Check if the old password is correct
    const isOldPasswordCorrect = await compare(input.oldPassword, user.hashedPassword);
    if (!isOldPasswordCorrect) {
      throw new Error("Incorrect old password");
    }

    // ✅ Hash the new password
    const hashedPassword = await hash(input.newPassword, 10);

    // ✅ Update user password
    await db.user.update({
      where: { id: userId },
      data: { hashedPassword },
    });

    return { message: "Password changed successfully" };
  }),

  // Upload or update profile picture
  uploadProfilePicture: protectedProcedure
    .input(
      z.object({
        imageUrl: z.string().url("Invalid image URL"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const updatedUser = await db.user.update({
        where: { id: userId },
        data: {
          image: input.imageUrl,
        },
      });

      return { message: "Profile picture updated successfully", user: updatedUser };
    }),
});
