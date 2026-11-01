/**
 * General patient education, written as drafts for the clinic to review, edit and publish.
 * Deliberately excludes prices, success rates, durations and claims about this clinic.
 */
export const TREATMENT_DRAFTS = [
  {
    name: "General Dentistry",
    slug: "general-dentistry",
    shortDescription: "Routine examinations, cleaning and everyday care that help keep your teeth and gums healthy.",
    overview:
      "General dentistry is the foundation of a healthy mouth. Regular visits allow problems such as decay and gum disease to be found early, when they are usually simpler to treat. Your dentist will also advise you on brushing, diet and other habits that affect your oral health.",
    benefits: ["Early detection of dental problems", "Removal of plaque and tartar", "Personal advice for care at home"],
    procedure: [
      { title: "Review", description: "We discuss your medical and dental history and any concerns." },
      { title: "Examination", description: "Your teeth and gums are checked, with X-rays taken if needed." },
      { title: "Cleaning", description: "Plaque and tartar are removed where appropriate." },
      { title: "Plan", description: "We explain our findings and agree on any next steps." },
    ],
  },
  {
    name: "Root Canal Treatment",
    slug: "root-canal-treatment",
    shortDescription: "Treatment for an infected or inflamed tooth nerve, aiming to relieve pain and save the natural tooth.",
    overview:
      "When the soft tissue inside a tooth becomes infected or inflamed, root canal treatment removes the affected tissue, then cleans and seals the inside of the tooth. A crown is often recommended afterwards to protect it. Your dentist will advise whether this is suitable for your tooth.",
    benefits: ["Aims to preserve your natural tooth", "Addresses the source of infection", "Helps relieve associated pain"],
    procedure: [
      { title: "Assessment", description: "The tooth is examined and X-rays are taken." },
      { title: "Numbing", description: "Local anaesthetic is used to keep you comfortable." },
      { title: "Cleaning", description: "The affected tissue is removed and the canals are cleaned and shaped." },
      { title: "Sealing", description: "The canals are sealed and the tooth is restored." },
    ],
  },
  {
    name: "Dental Implants",
    slug: "dental-implants",
    shortDescription: "A fixed option for replacing missing teeth, using a small post placed in the jawbone.",
    overview:
      "A dental implant is a small post placed in the jawbone to support a replacement tooth, bridge or denture. Suitability depends on your general health and the condition of your bone and gums, so treatment begins with a careful assessment. Your dentist will explain the stages, alternatives and risks.",
    benefits: ["Replaces missing teeth with a fixed restoration", "Does not rely on neighbouring teeth for support", "Can help restore chewing and appearance"],
    procedure: [
      { title: "Assessment", description: "Your health, bone and gums are assessed, and options discussed." },
      { title: "Placement", description: "The implant is placed in the jawbone under anaesthetic." },
      { title: "Healing", description: "The bone is given time to heal around the implant." },
      { title: "Restoration", description: "A custom crown, bridge or denture is fitted." },
    ],
  },
  {
    name: "Teeth Whitening",
    slug: "teeth-whitening",
    shortDescription: "Professionally supervised whitening to lighten natural tooth colour after a dental check.",
    overview:
      "Teeth whitening uses a bleaching agent to lighten the colour of natural teeth. It does not change the colour of crowns or fillings, and results vary from person to person. A check-up beforehand confirms that whitening is suitable for you. Some people experience temporary sensitivity.",
    benefits: ["Lightens natural tooth colour", "Supervised by a dental professional", "Guidance on maintaining your results"],
    procedure: [
      { title: "Check-up", description: "We confirm your teeth and gums are suitable for whitening." },
      { title: "Shade", description: "Your current shade is recorded and realistic results discussed." },
      { title: "Whitening", description: "The whitening agent is applied following a planned approach." },
      { title: "Aftercare", description: "We advise how to manage sensitivity and maintain your results." },
    ],
  },
  {
    name: "Braces & Aligners",
    slug: "braces-and-aligners",
    shortDescription: "Orthodontic options that gradually move teeth to improve alignment and bite.",
    overview:
      "Orthodontic treatment uses braces or clear aligners to gradually move teeth into a better position. The right option depends on your teeth, bite and lifestyle. Retainers are usually needed afterwards to help hold teeth in their new positions.",
    benefits: ["Can improve tooth alignment and bite", "A choice of approaches to suit different needs", "Straighter teeth can be easier to clean"],
    procedure: [
      { title: "Assessment", description: "Records of your teeth and bite are taken and options discussed." },
      { title: "Planning", description: "A plan is prepared to suit your teeth and goals." },
      { title: "Treatment", description: "Braces or aligners are fitted and progress checked regularly." },
      { title: "Retention", description: "Retainers help keep your teeth in their new positions." },
    ],
  },
  {
    name: "Cosmetic Dentistry",
    slug: "cosmetic-dentistry",
    shortDescription: "Treatments that refine the appearance of your smile, planned around your oral health.",
    overview:
      "Cosmetic dentistry covers treatments that improve the look of your teeth and smile, such as bonding and veneers. A good result begins with healthy teeth and gums, so your dentist will assess your oral health and talk through what is realistic for you, including any trade-offs.",
    benefits: ["Can address chips, gaps and discolouration", "Planned around your goals", "Options discussed openly, including alternatives"],
    procedure: [
      { title: "Consultation", description: "We discuss what you would like to change." },
      { title: "Assessment", description: "Your oral health is checked and suitable options explained." },
      { title: "Treatment", description: "Your chosen treatment is carried out in one or more visits." },
      { title: "Review", description: "We check the result and advise on looking after it." },
    ],
  },
  {
    name: "Tooth Extraction",
    slug: "tooth-extraction",
    shortDescription: "Careful removal of a tooth that cannot be saved or is causing problems, with clear aftercare.",
    overview:
      "A tooth may need to be removed because of severe decay, damage, gum disease or crowding. Your dentist will first explain why extraction is advised and whether there are alternatives. The area is numbed, and you will receive clear instructions to support healing, along with options for replacing the tooth if needed.",
    benefits: ["Removes a source of pain or infection", "Local anaesthetic for comfort", "Clear aftercare instructions"],
    procedure: [
      { title: "Assessment", description: "The tooth is examined, often with an X-ray." },
      { title: "Numbing", description: "Local anaesthetic is used to numb the area." },
      { title: "Removal", description: "The tooth is carefully removed." },
      { title: "Aftercare", description: "We explain how to care for the area as it heals." },
    ],
  },
  {
    name: "Pediatric Dentistry",
    slug: "pediatric-dentistry",
    shortDescription: "Gentle dental care for children that builds healthy habits and confidence from an early age.",
    overview:
      "Early visits help children become comfortable at the dentist and allow their developing teeth to be monitored. Care can include check-ups, cleaning, preventive treatments and fillings, along with practical guidance for parents on brushing and diet.",
    benefits: ["Helps children feel at ease with dental visits", "Monitors developing teeth", "Practical guidance for parents"],
    procedure: [
      { title: "Welcome", description: "We introduce your child to the room at a comfortable pace." },
      { title: "Check-up", description: "Teeth and gums are examined gently." },
      { title: "Care", description: "Cleaning or preventive care is provided where needed." },
      { title: "Guidance", description: "We share advice on brushing, diet and next visits." },
    ],
  },
  {
    name: "Crowns & Bridges",
    slug: "crowns-and-bridges",
    shortDescription: "Custom restorations that protect damaged teeth or replace missing ones.",
    overview:
      "A crown is a custom cap that covers a damaged or weakened tooth. A bridge replaces one or more missing teeth by attaching to the teeth or implants on either side of the gap. Your dentist will explain which option suits you, along with the materials available.",
    benefits: ["Protects weakened teeth", "Can replace missing teeth", "Custom-made to fit your bite"],
    procedure: [
      { title: "Assessment", description: "The teeth are examined and options explained." },
      { title: "Preparation", description: "The tooth is shaped and an impression or scan is taken." },
      { title: "Temporary", description: "A temporary restoration may be placed while yours is made." },
      { title: "Fitting", description: "Your final crown or bridge is checked and fixed in place." },
    ],
  },
];
