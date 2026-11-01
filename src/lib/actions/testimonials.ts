"use server";

import { testimonialSchema } from "@/lib/validations/admin";
import { Testimonial } from "@/models/Testimonial";
import { adminMutation, idSchema, notFound, revalidateSite } from "./guard";

export async function createTestimonial(input: unknown) {
  return adminMutation(testimonialSchema, input, async (data) => {
    await Testimonial.create(data);
    revalidateSite();
    return { ok: true, message: "Testimonial added." };
  });
}

export async function updateTestimonial(id: string, input: unknown) {
  return adminMutation(testimonialSchema, input, async (data) => {
    const _id = idSchema.parse(id);
    const previous = await Testimonial.findOneAndUpdate({ _id }, data).lean();
    if (!previous) return notFound("Testimonial");
    revalidateSite();
    return { ok: true, message: "Testimonial updated." };
  });
}

export async function deleteTestimonial(id: string) {
  return adminMutation(idSchema, id, async (_id) => {
    const previous = await Testimonial.findOneAndDelete({ _id }).lean();
    if (!previous) return notFound("Testimonial");
    revalidateSite();
    return { ok: true, message: "Testimonial removed." };
  });
}
