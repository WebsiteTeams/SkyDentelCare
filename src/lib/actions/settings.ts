"use server";

import { contentSchema, settingsSchema } from "@/lib/validations/admin";
import { ClinicSettings } from "@/models/ClinicSettings";
import { adminMutation, revalidateSite } from "./guard";

export async function saveSettings(input: unknown) {
  return adminMutation(settingsSchema, input, async (data) => {
    await ClinicSettings.updateOne({ key: "main" }, { $set: data }, { upsert: true, runValidators: true });
    revalidateSite();
    return { ok: true, message: "Clinic settings saved." };
  });
}

export async function saveContent(input: unknown) {
  return adminMutation(contentSchema, input, async (data) => {
    await ClinicSettings.updateOne({ key: "main" }, { $set: { content: data } }, { upsert: true, runValidators: true });
    revalidateSite();
    return { ok: true, message: "Website content saved." };
  });
}
