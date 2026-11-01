"use server";

import { deleteImages } from "@/lib/cloudinary";
import { slugify } from "@/lib/utils";
import { treatmentSchema } from "@/lib/validations/admin";
import { Treatment } from "@/models/Treatment";
import { adminMutation, idSchema, notFound, revalidateSite } from "./guard";

export async function createTreatment(input: unknown) {
  return adminMutation(treatmentSchema, input, async (data) => {
    await Treatment.create({ ...data, slug: slugify(data.name) });
    revalidateSite();
    return { ok: true, message: "Treatment added." };
  });
}

export async function updateTreatment(id: string, input: unknown) {
  return adminMutation(treatmentSchema, input, async (data) => {
    const _id = idSchema.parse(id);
    const previous = await Treatment.findOneAndUpdate({ _id }, { ...data, slug: slugify(data.name) }).lean();
    if (!previous) return notFound("Treatment");
    if (previous.image?.publicId && previous.image.publicId !== data.image?.publicId) {
      await deleteImages([previous.image.publicId]);
    }
    revalidateSite();
    return { ok: true, message: "Treatment updated." };
  });
}

export async function deleteTreatment(id: string) {
  return adminMutation(idSchema, id, async (_id) => {
    const previous = await Treatment.findOneAndDelete({ _id }).lean();
    if (!previous) return notFound("Treatment");
    await deleteImages([previous.image?.publicId]);
    revalidateSite();
    return { ok: true, message: "Treatment removed." };
  });
}
