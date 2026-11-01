/**
 * DEVELOPMENT PREVIEW ONLY. Fills a local database with obviously fictional records and stock
 * photographs so the full design can be reviewed before the clinic supplies real content.
 * Refuses to run against a database whose name does not contain "demo" or "dev" or "test".
 *
 *   npm run seed:demo          add demo data
 *   npm run seed:demo:clear    remove demo data
 */
import mongoose from "mongoose";
import { connectDB } from "../src/lib/db";
import { DEFAULT_CONTENT } from "../src/lib/defaults";
import { ClinicSettings } from "../src/models/ClinicSettings";
import { Doctor } from "../src/models/Doctor";
import { Gallery } from "../src/models/Gallery";
import { Testimonial } from "../src/models/Testimonial";
import { Treatment } from "../src/models/Treatment";
import { TREATMENT_DRAFTS } from "./treatment-drafts";

const img = (name: string, alt: string) => ({ url: `/demo/${name}.jpg`, publicId: "", alt });
const DEMO_MARK = "[Demo]";
const photos = ["room-1", "room-2", "room-3", "room-4", "room-1", "room-2", "room-3", "room-4", "room-1"];

async function clear() {
  await Promise.all([
    Doctor.deleteMany({ slug: /^demo-/ }),
    Testimonial.deleteMany({ patientName: new RegExp(`^\\${DEMO_MARK}`) }),
    Gallery.deleteMany({ title: new RegExp(`^\\${DEMO_MARK}`) }),
    Treatment.updateMany({ "image.url": /^\/demo\// }, { $set: { published: false, image: null } }),
    ClinicSettings.deleteOne({ key: "main", email: "hello@example.com" }),
  ]);
  console.log("Demo data removed.");
}

async function seed() {
  await clear();

  for (const [index, draft] of TREATMENT_DRAFTS.entries()) {
    await Treatment.updateOne(
      { slug: draft.slug },
      { $set: { ...draft, image: img(photos[index], draft.name), displayOrder: index, featured: index < 6, published: true } },
      { upsert: true },
    );
  }

  await Doctor.create([
    {
      name: "Dr. Sample One",
      slug: "demo-sample-one",
      photo: img("doctor-1", "Stock portrait used for this demo"),
      qualifications: ["Demo qualification", "Replace before launch"],
      specialization: "Demo specialization",
      experience: "Placeholder experience text. Enter only verified details.",
      bio: "This is fictional placeholder text showing how a doctor biography appears on the website. Replace it with the real profile before launch.",
      displayOrder: 0,
      published: true,
    },
    {
      name: "Dr. Sample Two",
      slug: "demo-sample-two",
      photo: img("doctor-2", "Stock portrait used for this demo"),
      qualifications: ["Demo qualification"],
      specialization: "Demo specialization",
      bio: "A second fictional profile, showing how the layout alternates on the Doctors page.",
      displayOrder: 1,
      published: true,
    },
  ]);

  await Testimonial.create(
    [
      "This is sample text showing how a featured patient testimonial appears. Only genuine, consented testimonials belong here.",
      "A shorter sample testimonial used only to preview this layout.",
      "Another sample testimonial used only to preview this layout.",
    ].map((content, displayOrder) => ({
      patientName: `${DEMO_MARK} Sample patient`,
      content,
      treatmentLabel: "Sample treatment",
      consentConfirmed: true,
      displayOrder,
      published: true,
    })),
  );

  const categories = ["interiors", "treatment-rooms", "equipment", "facilities", "interiors", "treatment-rooms"] as const;
  await Gallery.create(
    categories.map((category, displayOrder) => ({
      title: `${DEMO_MARK} ${category.replace("-", " ")}`,
      category,
      image: img(`room-${(displayOrder % 4) + 1}`, "Stock photograph used for this demo"),
      displayOrder,
      published: true,
    })),
  );

  await ClinicSettings.updateOne(
    { key: "main" },
    {
      $set: {
        phone: "+00 00000 00000",
        whatsapp: "+00 00000 00000",
        email: "hello@example.com",
        streetAddress: "1 Sample Street",
        city: "Demo City",
        country: "Demo Country",
        hours: [
          { days: "Sample days", hours: "Sample hours" },
          { days: "Other days", hours: "Closed" },
        ],
        seoDescription: "Demo description. Replace it in Clinic settings before launch.",
        content: {
          ...DEFAULT_CONTENT,
          announcement: "Demo preview: every name, detail and photograph on this site is a placeholder.",
          heroImage: img("room-1", "Stock photograph used for this demo"),
          heroSecondaryImage: img("room-3", "Stock photograph used for this demo"),
          introImage: img("room-2", "Stock photograph used for this demo"),
          aboutImage: img("room-4", "Stock photograph used for this demo"),
          facilitiesImage: img("room-3", "Stock photograph used for this demo"),
          trustIndicators: [
            { title: "00 years", description: "Sample indicator" },
            { title: "00+", description: "Sample indicator" },
            { title: "Sample", description: "Verified facts only" },
          ],
          facilities: [
            { title: "Sample facility", description: "List only what the clinic actually has." },
            { title: "Another sample facility", description: "Placeholder description." },
          ],
          technology: [{ title: "Sample technology", description: "List only verified equipment." }],
        },
      },
      $setOnInsert: { key: "main" },
    },
    { upsert: true },
  );
  console.log("Demo data added. Remove it with: npm run seed:demo:clear");
}

async function main() {
  const { connection } = await connectDB();
  const name = connection.name;
  if (!/demo|dev|test/i.test(name)) {
    throw new Error(`Refusing to touch database "${name}". Its name must contain "demo", "dev" or "test".`);
  }
  await (process.argv.includes("--clear") ? clear() : seed());
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
