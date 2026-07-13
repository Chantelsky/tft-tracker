import { describe, it, expect, vi, beforeEach } from "vitest";
import { signup, login } from "./auth.js";
import { prisma } from "../db.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

vi.mock("../db.js", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashedpassword"),
    compare: vi
      .fn<(data: string, encrypted: string) => Promise<boolean>>()
      .mockResolvedValue(true),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

it("should create a new user when the email is not already taken", async () => {
  vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
  vi.mocked(prisma.user.create).mockResolvedValue({
    id: "b6a28f1a-6cf6-4794-91f2-f00ea869b725",
    email: "test@example.com",
    password: "hashedpassword",
    createdAt: new Date(),
  });
  const result = await signup("test@example.com", "password123");
  expect(result.user).toEqual({
    id: "b6a28f1a-6cf6-4794-91f2-f00ea869b725",
    email: "test@example.com",
  });
  expect(result.token).toEqual(expect.any(String));
});

it("should throw an error when the email is already taken", async () => {
  vi.mocked(prisma.user.findUnique).mockResolvedValue({
    id: "b6a28f1a-6cf6-4794-91f2-f00ea869b725",
    email: "test@example.com",
    password: "hashedpassword",
    createdAt: new Date(),
  });
  await expect(signup("test@example.com", "password123")).rejects.toThrow(
    "Email is already in use",
  );
});

it("should throw an error when login fails due to non-existent email", async () => {
  vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
  await expect(login("test@example.com", "password123")).rejects.toThrow(
    "Invalid credentials",
  );
});

it("should throw an error when login fails due to incorrect password", async () => {
  vi.mocked(prisma.user.findUnique).mockResolvedValue({
    id: "b6a28f1a-6cf6-4794-91f2-f00ea869b725",
    email: "test@example.com",
    password: "hashedpassword",
    createdAt: new Date(),
  });
  vi.mocked(bcrypt.compare).mockResolvedValue(false as never);
  await expect(login("test@example.com", "password123")).rejects.toThrow(
    "Invalid credentials",
  );
});

it("should login successfully with correct credentials", async () => {
  vi.mocked(prisma.user.findUnique).mockResolvedValue({
    id: "b6a28f1a-6cf6-4794-91f2-f00ea869b725",
    email: "test@example.com",
    password: "hashedpassword",
    createdAt: new Date(),
  });
  vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

  const result = await login("test@example.com", "password123");
  expect(result.user).toEqual({
    id: "b6a28f1a-6cf6-4794-91f2-f00ea869b725",
    email: "test@example.com",
  });
  expect(result.token).toEqual(expect.any(String));
});
