import { bootstrapApp } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/http";
import type { SetupPayload } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SetupPayload;

    if (!body.familyName?.trim() || !body.parentName?.trim() || !body.pin?.trim()) {
      return jsonError("Aile adı, ebeveyn adı ve PIN gerekli.");
    }

    if (body.pin.trim().length < 4) {
      return jsonError("PIN en az 4 haneli olmalı.");
    }

    const data = await bootstrapApp({
      familyName: body.familyName.trim(),
      parentName: body.parentName.trim(),
      pin: body.pin.trim(),
      includeSampleData: Boolean(body.includeSampleData)
    });

    return jsonOk(data);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Kurulum yapılamadı", 500);
  }
}
