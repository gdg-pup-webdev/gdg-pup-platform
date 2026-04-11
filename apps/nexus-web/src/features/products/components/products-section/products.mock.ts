export type ProductStatus = "deployed" | "undeployed";

export const PRODUCT_FALLBACK_THUMBNAIL = "/placeHolders/default.webp";

export interface GdgProduct {
  id: string;
  title: string;
  image: string;
  status: ProductStatus;
  shortDescription: string;
  description: string;
  website?: string;
}

export const GDG_PRODUCTS_MOCK: GdgProduct[] = [
  {
    id: "gdg-id-platform",
    title: "GDG ID Platform",
    image: "/products/products-thumbnail-id.webp",
    status: "deployed",
    shortDescription: "Official digital membership system of GDG on Campus PUP.",
    description:
      "The GDG ID Platform is GDG on Campus PUP's official digital membership system. This is a centralized space where every member's identity, role, and belonging in the community is recognized and made real. More than just a digital ID, it's a living record of who you are within the organization: your name, your chapter, your place in something bigger. Whether you're a new member stepping in for the first time or a core team lead representing the chapter, your GDG ID is your credential.",
    website: "https://id.gdgpup.org",
  },
  {
    id: "gdg-photobooth-platform",
    title: "GDG Photobooth Platform",
    image: "/products/products-thumbnail-photobooth.webp",
    status: "deployed",
    shortDescription: "Instant, branded photo experiences for GDG PUP events.",
    description:
      "The GDG Photobooth Platform brings instant, branded photo experiences to every GDG on Campus PUP event. Designed to be fully adaptable across events, it lets attendees capture and download personalized photos layered with GDG PUP's visual identity, right from their browser, no app required. Whether it's a flagship event, a workshop, or a community hangout, the Photobooth turns every gathering into something worth remembering and worth sharing!",
    website: "https://photo.gdgpup.org",
  },
  {
    id: "gdg-dp-frame-platform",
    title: "GDG DP Frame Platform",
    image: "/products/products-thumbnail-frame.webp",
    status: "deployed",
    shortDescription: "Custom GDG PUP profile frames for members and attendees.",
    description:
      "Show up for GDG on Campus PUP literally. The DP Frame Platform lets members and event attendees dress their profile photos with custom GDG PUP frames, tailored to specific events and activities. Self-serve, browser-based, and built to be as easy as uploading a photo, it transforms a simple profile picture and an engaging caption into a statement of community pride.",
    website: "https://frame.gdgpup.org",
  },
  {
    id: "cosmos-2026",
    title: "COSMOS 2026",
    image: "/products/products-thumbnail-cosmos.webp",
    status: "deployed",
    shortDescription: "GDG on Campus PUP's flagship tech summit.",
    description:
      "COSMOS 2026 is GDG on Campus PUP's flagship tech summit. This is the event where developers, students, designers, and tech enthusiasts from across PUP and beyond come together under one roof to learn, connect, and be inspired. Built around the belief that great ideas need great communities to grow, COSMOS is more than an event. It's a convergence of disciplines, of ambitions, and of the people who are shaping what Filipino tech looks like next.",
    website: "https://cosmos.gdgpup.org",
  },
  {
    id: "nexus-capstone",
    title: "NEXUS",
    image: PRODUCT_FALLBACK_THUMBNAIL,
    status: "undeployed",
    shortDescription:
      "Mastering the Sea of Cloud: Cloud Solutions Cadet Capstone Project.",
    description:
      "NEXUS is a capstone initiative under the theme Mastering the Sea of Cloud, designed to showcase practical cloud engineering and deployment workflows for the community.",
  },
  {
    id: "discord-ctf-bot",
    title: "Discord CTF Bot",
    image: PRODUCT_FALLBACK_THUMBNAIL,
    status: "undeployed",
    shortDescription: "A Discord assistant built to support CTF workflows.",
    description:
      "Discord CTF Bot is an upcoming tool focused on helping teams run and participate in capture-the-flag activities more efficiently inside Discord.",
  },
  {
    id: "cybersecurity-learning-resource",
    title: "Cybersecurity Learning Resource",
    image: PRODUCT_FALLBACK_THUMBNAIL,
    status: "undeployed",
    shortDescription: "A curated learning space for cybersecurity growth.",
    description:
      "Cybersecurity Learning Resource is an upcoming educational product that will centralize learning materials, pathways, and references for aspiring and active cybersecurity learners.",
  },
];
