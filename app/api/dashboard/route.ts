import { getDashboardSnapshot } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/http";

export async function GET() {
  try {
    const data = await getDashboardSnapshot();
    return jsonOk(data, {
      headers: {
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Veriler alınamadı", 500);
  }
}
