import { expect, test, beforeEach, afterEach } from "vitest";
import { db } from "~/server/db";

// Clean up the test database before and after each test
beforeEach(async () => {
    await db.task.deleteMany(); // Delete tasks first
    await db.user.deleteMany(); // Then delete users
  });
  
  afterEach(async () => {
    await db.task.deleteMany(); // Delete tasks first
    await db.user.deleteMany(); // Then delete users
  });
  
// Test: Create a User
test("Create a new user", async () => {
  const newUser = await db.user.create({
    data: {
      name: "John Doe",
      email: "johndoe@example.com",
      hashedPassword: "securepassword",
    },
  });

  expect(newUser).toBeDefined();
  expect(newUser.name).toBe("John Doe");
  expect(newUser.email).toBe("johndoe@example.com");
});

// Test: Update a User
test("Update a user's name", async () => {
  // First, create a user
  const user = await db.user.create({
    data: {
      name: "Old Name",
      email: "update@example.com",
      hashedPassword: "securepassword",
    },
  });

  // Update the user's name
  const updatedUser = await db.user.update({
    where: { email: "update@example.com" },
    data: { name: "New Name" },
  });

  expect(updatedUser).toBeDefined();
  expect(updatedUser.name).toBe("New Name");
  expect(updatedUser.email).toBe("update@example.com");
});
