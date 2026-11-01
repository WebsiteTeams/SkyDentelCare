import type { SettingsDTO, SiteContent } from "@/types";

/**
 * Starter copy contains brand voice only: no credentials, equipment, awards, statistics or
 * opening hours. Verified facts are entered by the clinic in the admin panel.
 */
export const DEFAULT_CONTENT: SiteContent = {
  announcement: "",
  heroHeadline: "Your Smile Deserves Exceptional Care.",
  heroText:
    "Experience personalized dental care with modern technology, compassionate professionals, and a commitment to your healthiest smile.",
  heroImage: null,
  heroSecondaryImage: null,
  trustIndicators: [],
  introHeading: "A calmer, more considered way to care for your smile.",
  introText:
    "SkyDentalClinic is built around unhurried appointments and clear conversations. We take the time to understand your concerns, explain your options, and plan care that fits your health and your life.",
  introImage: null,
  whyChooseUs: [
    { title: "Care planned around you", description: "Your concerns, comfort and goals shape every recommendation we make." },
    { title: "Clear, honest explanations", description: "You will understand your options and what to expect before any treatment begins." },
    { title: "Comfort at every step", description: "We pace each visit with care and check in with you throughout." },
    { title: "Prevention first", description: "We help you protect your natural teeth with guidance you can keep up at home." },
  ],
  mission: "To make attentive, high-quality dental care feel calm, clear and personal for every patient.",
  vision: "To be the dental clinic our patients trust for life, and gladly recommend to the people they love.",
  philosophy:
    "Good dentistry begins with listening. We believe patients make the best decisions when they are fully informed, never hurried, and treated with respect.",
  careApproach: [
    { title: "Listen", description: "We begin with your concerns, your history and what you hope to achieve." },
    { title: "Explain", description: "We walk you through what we find and the options available to you." },
    { title: "Plan", description: "Together we agree on a plan that suits your needs and priorities." },
    { title: "Care", description: "We carry out your treatment with attention and support you afterwards." },
  ],
  facilities: [],
  technology: [],
  facilitiesImage: null,
  aboutImage: null,
  faqs: [
    {
      question: "Is my appointment confirmed once I submit a request?",
      answer: "Not yet. Your request is reviewed by our team, and your appointment is confirmed only after the clinic contacts you to approve a time.",
    },
    {
      question: "What should I bring to my first visit?",
      answer: "Please bring a list of any medications you take, details of relevant medical conditions, and any recent dental records or X-rays you have.",
    },
    {
      question: "Can I choose which doctor I see?",
      answer: "You can tell us your preference when requesting an appointment, and we will do our best to arrange it.",
    },
    {
      question: "What should I do if I need to change my appointment?",
      answer: "Please contact the clinic as early as you can so that we can find another suitable time for you.",
    },
  ],
};

export const DEFAULT_SETTINGS: SettingsDTO = {
  clinicName: "SkyDentalClinic",
  phone: "",
  whatsapp: "",
  email: "",
  streetAddress: "",
  city: "",
  region: "",
  postalCode: "",
  country: "",
  mapsEmbedUrl: "",
  mapsLinkUrl: "",
  hours: [],
  instagramUrl: "",
  facebookUrl: "",
  seoDescription: "",
  content: DEFAULT_CONTENT,
};
