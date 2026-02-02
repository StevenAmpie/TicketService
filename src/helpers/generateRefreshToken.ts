import { randomUUID } from "crypto";
import { hashPassword } from "./hashPassword";

export async function generateRefreshToken() {
  const refreshToken = randomUUID();
  const refreshTokenHashed = await hashPassword(refreshToken);
  const refreshTime = 24 * 60 * 60 * 1000;
  const refreshExpiresIn = Date.now() + refreshTime;

  return { refreshToken, refreshTokenHashed, refreshExpiresIn };
}
