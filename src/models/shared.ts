import { Schema } from "mongoose";

/** A stored image. `publicId` is empty for images not hosted on Cloudinary. */
export const imageSchema = new Schema(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, default: "", trim: true },
    alt: { type: String, default: "", trim: true, maxlength: 200 },
  },
  { _id: false },
);
