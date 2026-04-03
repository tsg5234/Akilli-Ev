import { createAccountSession } from "@/lib/auth";
import { loginAccount } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/http";
import type { AccountAuthPayload } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AccountAuthPayload;
    const account = await loginAccount(body);

    await createAccountSession({
      accountId: account.accountId,
      username: account.username,
      familyId: account.familyId,
      accessToken: account.accessToken,
      refreshToken: account.refreshToken
    });

    return jsonOk({ success: true });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Giriş yapılamadı.", 401);
  }
}
