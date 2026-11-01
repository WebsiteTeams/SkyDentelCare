"use server";

import { deleteImages } from "@/lib/cloudinary";
import { slugify } from "@/lib/utils";
import { doctorSchema } from "@/lib/validations/admin";
import { Doctor } from "@/models/Doctor";
import { adminMutation, idSchema, notFound, revalidateSite } from "./guard";

export async function createDoctor(input: unknown) {
  return adminMutation(doctorSchema, input, async (data) => {
    await Doctor.create({ ...data, slug: slugify(data.name) });
    revalidateSite();
    return { ok: true, message: "Doctor added." };
  });
}

export async function updateDoctor(id: string, input: unknown) {
  return adminMutation(doctorSchema, input, async (data) => {
    const _id = idSchema.parse(id);
    const previous = await Doctor.findOneAndUpdate({ _id }, { ...data, slug: slugify(data.name) }).lean();
    if (!previous) return notFound("Doctor");
    if (previous.photo?.publicId && previous.photo.publicId !== data.photo?.publicId) {
      await deleteImages([previous.photo.publicId]);
    }
    revalidateSite();
    return { ok: true, message: "Doctor updated." };
  });
}

export async function deleteDoctor(id: string) {
  return adminMutation(idSchema, id, async (_id) => {
    const previous = await Doctor.findOneAndDelete({ _id }).lean();
    if (!previous) return notFound("Doctor");
    await deleteImages([previous.photo?.publicId]);
    revalidateSite();
    return { ok: true, message: "Doctor removed." };
  });
}
