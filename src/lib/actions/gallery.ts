"use server";

import { deleteImages } from "@/lib/cloudinary";
import { gallerySchema } from "@/lib/validations/admin";
import { Gallery } from "@/models/Gallery";
import { adminMutation, idSchema, notFound, revalidateSite } from "./guard";

export async function createGalleryItem(input: unknown) {
  return adminMutation(gallerySchema, input, async (data) => {
    // The schema guarantees an image is present.
    await Gallery.create({ ...data, image: data.image! });
    revalidateSite();
    return { ok: true, message: "Image added." };
  });
}

export async function updateGalleryItem(id: string, input: unknown) {
  return adminMutation(gallerySchema, input, async (data) => {
    const _id = idSchema.parse(id);
    const previous = await Gallery.findOneAndUpdate({ _id }, data).lean();
    if (!previous) return notFound("Image");
    const kept = [data.image?.publicId, data.afterImage?.publicId];
    await deleteImages([previous.image?.publicId, previous.afterImage?.publicId].filter((p) => !kept.includes(p)));
    revalidateSite();
    return { ok: true, message: "Image updated." };
  });
}

export async function deleteGalleryItem(id: string) {
  return adminMutation(idSchema, id, async (_id) => {
    const previous = await Gallery.findOneAndDelete({ _id }).lean();
    if (!previous) return notFound("Image");
    await deleteImages([previous.image?.publicId, previous.afterImage?.publicId]);
    revalidateSite();
    return { ok: true, message: "Image removed." };
  });
}
