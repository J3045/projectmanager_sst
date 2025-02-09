import { expect, test } from 'vitest';
import { db } from '~/server/db';

test('Prisma should connect to the database', async () => {
  const users = await db.user.findMany();
  expect(users).toBeDefined();
});
