export const RESOURCE_LIBRARY = [
  {
    header: "Technology",
    body: "IoT",
    variant: "heading-1",
    gradient: "white-red",
    href: "/products/iot",
    image: "/products/iot-logo.webp",
  },
  {
    header: "Technology",
    body: "Cybersecurity",
    variant: "heading-3",
    gradient: "white-green",
    href: "/products/cybersecurity",
    image: "/products/cybersecurity-logo.webp",
  },
  {
    header: "Technology",
    body: "Data/ML",
    variant: "heading-2",
    gradient: "white-blue",
    href: "/products/data-ml",
    image: "/products/data-ml-logo.webp",
  },
  {
    header: "Technology",
    body: "UI/UX",
    variant: "heading-1",
    gradient: "white-yellow",
    href: "/products/ui-ux",
    image: "/products/ui-ux-logo.webp",
  },
  {
    header: "Technology",
    body: "Cloud Solutions",
    variant: "heading-3",
    gradient: "white-red",
    href: "/products/cloud-solutions",
    image: "/products/cloud-solutions-logo.webp",
  },
  {
    header: "Technology",
    body: "Project Management",
    variant: "heading-3",
    gradient: "white-green",
    href: "/products/project-management ",
    image: "/products/project-management-logo.webp",
  },
  {
    header: "Technology",
    body: "Web Development",
    variant: "heading-3",
    gradient: "white-blue",
    href: "/products/web-development",
    image: "/products/web-development-logo.webp",
  },
  {
    header: "Executives",
    body: "Executives",
    variant: "heading-2",
    gradient: "white-yellow",
    href: "/products/executives",
    image: "/products/executives-logo.webp",
  },
] as const;

export interface GdgProduct {
  image: string;
  title: string;
  url: string;
}

export const GDG_PRODUCTS: GdgProduct[] = [
  {
    image: "/products/placeholders/gdg-id-platform.webp",
    title: "GDG ID Platform",
    url: "#",
  },
  {
    image: "/products/placeholders/gdg-sparky-fortune.webp",
    title: "GDG Sparky Fortune",
    url: "#",
  },
  {
    image: "/products/placeholders/gdg-photobooth.webp",
    title: "GDG Photobooth",
    url: "#",
  },
  {
    image: "/products/placeholders/product-name-1.webp",
    title: "Product Name",
    url: "#",
  },
  {
    image: "/products/placeholders/product-name-2.webp",
    title: "Product Name",
    url: "#",
  },
  {
    image: "/products/placeholders/product-name-3.webp",
    title: "Product Name",
    url: "#",
  },
];
