import bcrypt from "bcrypt";
import { createHash } from "crypto";

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const hashRefreshToken = (token: string): string => {
  return createHash("sha256").update(token).digest("hex");
};

export const verifyRefreshTokenHash = (
  token: string,
  hash: string
): boolean => {
  return hashRefreshToken(token) === hash;
};
