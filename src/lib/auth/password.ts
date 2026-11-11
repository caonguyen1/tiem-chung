import "server-only";

import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback) as (password: string, salt: string, keylen: number) => Promise<Buffer>;
const KEY_LENGTH = 64;

/** "salt:hash", both hex; the same format `scripts/db/seed.ts` writes. */
export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${(await scrypt(password, salt, KEY_LENGTH)).toString("hex")}`;
}

// A fixed hash to compare against when the email is unknown, so a wrong email and a wrong
// password take the same time.
const DUMMY = `${"0".repeat(32)}:${"0".repeat(KEY_LENGTH * 2)}`;

export async function verifyPassword(password: string, stored: string | undefined) {
  const [salt, hash] = (stored ?? DUMMY).split(":");
  const expected = Buffer.from(hash ?? "", "hex");
  const actual = await scrypt(password, salt ?? "", KEY_LENGTH);
  return Boolean(stored) && expected.length === actual.length && timingSafeEqual(expected, actual);
}
