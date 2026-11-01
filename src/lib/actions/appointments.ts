"use server";

import { revalidatePath } from "next/cache";
import { appointmentUpdateSchema } from "@/lib/validations/admin";
import { Appointment } from "@/models/Appointment";
import { adminMutation, idSchema, notFound } from "./guard";

export async function updateAppointment(id: string, input: unknown) {
  return adminMutation(appointmentUpdateSchema, input, async (data) => {
    const updated = await Appointment.findOneAndUpdate({ _id: idSchema.parse(id) }, data).lean();
    if (!updated) return notFound("Appointment");
    revalidatePath("/admin", "layout");
    return { ok: true, message: "Appointment updated." };
  });
}

export async function deleteAppointment(id: string) {
  return adminMutation(idSchema, id, async (_id) => {
    const removed = await Appointment.findOneAndDelete({ _id }).lean();
    if (!removed) return notFound("Appointment");
    revalidatePath("/admin", "layout");
    return { ok: true, message: "Appointment deleted." };
  });
}
