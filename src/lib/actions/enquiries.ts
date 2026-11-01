"use server";

import { revalidatePath } from "next/cache";
import { enquiryUpdateSchema } from "@/lib/validations/admin";
import { Enquiry } from "@/models/Enquiry";
import { adminMutation, idSchema, notFound } from "./guard";

export async function updateEnquiry(id: string, input: unknown) {
  return adminMutation(enquiryUpdateSchema, input, async (data) => {
    const updated = await Enquiry.findOneAndUpdate({ _id: idSchema.parse(id) }, data).lean();
    if (!updated) return notFound("Enquiry");
    revalidatePath("/admin", "layout");
    return { ok: true, message: "Enquiry updated." };
  });
}

export async function deleteEnquiry(id: string) {
  return adminMutation(idSchema, id, async (_id) => {
    const removed = await Enquiry.findOneAndDelete({ _id }).lean();
    if (!removed) return notFound("Enquiry");
    revalidatePath("/admin", "layout");
    return { ok: true, message: "Enquiry deleted." };
  });
}
