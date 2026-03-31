import { grantParentAccess, requireFamilySession } from "@/lib/auth";
import { verifyParentPin } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/http";

export async function POST(request: Request) {
  try {
    const session = await requireFamilySession();
    const body = (await request.json()) as { pin?: string };
    const pin = body.pin?.trim() ?? "";

    if (!pin) {
      return jsonError("PIN girin.");
    }

    await verifyParentPin(session.familyId, pin);
    await grantParentAccess(session);

    return jsonOk({ success: true });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Giris yapilamadi.", 401);
  }
}
