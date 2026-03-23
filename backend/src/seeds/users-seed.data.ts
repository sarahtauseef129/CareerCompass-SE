import * as bcrypt from 'bcrypt';

export const USERS_SEED_DATA = [
  {
    name: "John Developer",
    email: "john@example.com",
    password: "password123", // Will be hashed
  },
  {
    name: "Sarah Designer",
    email: "sarah@example.com",
    password: "password123",
  },
  {
    name: "Mike Analyst",
    email: "mike@example.com",
    password: "password123",
  },
];

export async function hashSeedPasswords() {
  return Promise.all(
    USERS_SEED_DATA.map(async (userData) => ({
      ...userData,
      password: await bcrypt.hash(userData.password, 10),
    })),
  );
}
