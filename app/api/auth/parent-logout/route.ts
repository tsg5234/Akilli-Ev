import { clearParentSession } from "@/lib/auth";
import { jsonOk } from "@/lib/http";

export async function POST() {
  await clearParentSession();
  return jsonOk({ success: true });
}
