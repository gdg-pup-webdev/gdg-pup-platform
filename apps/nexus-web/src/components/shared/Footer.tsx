import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Box, Inline, Stack, Text } from "@packages/spark-ui";
import { ASSETS } from "@/lib/constants/assets";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = {
    about: [
      { href: "/about", label: "Who is GDG" },
      { href: "/about/team", label: "Our Team" },
      { href: "/about/history", label: "History" },
      { href: "/about/partnership", label: "Partnership" },
      { href: "/about/benefits", label: "Benefits" },
    ],
    network: [
      { href: "/community-showcase", label: "Community Showcase" },
      { href: "/member-showcase", label: "Member Showcase" },
    ],
    nexus: [
      { href: "/events", label: "Events" },
      { href: "/products", label: "Products" },
      { href: "/id", label: "Get ID" },
      { href: "/profile", label: "Profile" },
    ],
  };

  const socialLinks = [
    {
      href: "https://www.youtube.com/@gdgpupmnl",
      label: "YouTube",
      icon: (
        <path
          fillRule="evenodd"
          d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
          clipRule="evenodd"
        />
      ),
    },
    {
      href: "https://www.facebook.com/gdg.pupmnl",
      label: "Facebook",
      icon: (
        <path
          fillRule="evenodd"
          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
          clipRule="evenodd"
        />
      ),
    },
    {
      href: "https://www.instagram.com/gdg.pupmnl/",
      label: "Instagram",
      icon: (
        <path
          fillRule="evenodd"
          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
          clipRule="evenodd"
        />
      ),
    },
    {
      href: "https://www.linkedin.com/company/gdgpup",
      label: "LinkedIn",
      icon: (
        <path
          fillRule="evenodd"
          d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
          clipRule="evenodd"
        />
      ),
    },
    {
      href: "https://github.com/GDG-PUP-Manila",
      label: "GitHub",
      icon: (
        <path
          fillRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          clipRule="evenodd"
        />
      ),
    },
  ];

  return (
    <Box
      as="footer"
      style={{
        background:
          "linear-gradient(90deg, rgba(0, 0, 0, 0.9) 0%, rgba(65, 65, 65, 0.9) 100%)",
        boxShadow: "0px 4px 32px 0px #FFFFFF26 inset",
      }}
      className="mt-auto"
    >
      <Box className="max-w-7xl mx-auto px-8 md:px-12 lg:px-20 py-12">
        {/* Main Footer Content */}
        <Box className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-8 md:gap-10 mb-10 text-center md:text-left">
          {/* Brand Section */}
          <Box className="lg:col-span-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Link prefetch={false} href="/" className="flex items-center justify-center md:justify-start gap-3 mb-6 group">
              <Image
                src={ASSETS.BRANDING.GDG_LOGO_WEBP}
                alt="GDG Logo"
                width={40}
                height={40}
                quality={100}
                className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.15)] group-hover:scale-110 transition-transform duration-300"
              />
              <Text variant="heading-6" weight="bold" className="text-white">
                GDG PUP NEXUS
              </Text>
            </Link>
          </Box>

          {/* About */}
          <Box className="flex flex-col items-center md:items-start animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <Text variant="body" weight="semibold" gradient="blue">
              About
            </Text>
            <Stack gap="xs" className="items-center md:items-start">
              {footerSections.about.map((link) => (
                <Link prefetch={false}
                  key={link.href}
                  href={link.href}
                  className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200"
                >
                  <Text variant="body-sm" className="text-inherit">
                    {link.label}
                  </Text>
                </Link>
              ))}
            </Stack>
          </Box>

          {/* Network */}
          <Box className="flex flex-col items-center md:items-start animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <Text variant="body" weight="semibold" gradient="yellow">
              Network
            </Text>
            <Stack gap="xs" className="items-center md:items-start">
              {footerSections.network.map((link) => (
                <Link prefetch={false}
                  key={link.href}
                  href={link.href}
                  className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200"
                >
                  <Text variant="body-sm" className="text-inherit">
                    {link.label}
                  </Text>
                </Link>
              ))}
            </Stack>
          </Box>

          {/* Nexus */}
          <Box className="flex flex-col items-center md:items-start animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <Text variant="body" weight="semibold" gradient="green">
              Nexus
            </Text>
            <Stack gap="xs" className="items-center md:items-start">
              {footerSections.nexus.map((link) => (
                <Link prefetch={false}
                  key={link.href}
                  href={link.href}
                  className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200"
                >
                  <Text variant="body-sm" className="text-inherit">
                    {link.label}
                  </Text>
                </Link>
              ))}
            </Stack>
          </Box>

          {/* Address */}
          <Box className="flex flex-col items-center md:items-start animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
            <Text variant="body" weight="semibold" gradient="red">
              Address
            </Text>
            <Text variant="body-sm" className="text-gray-300 mb-4 text-center md:text-left">
              PUP A. Mabini Campus, Anonas Street, Sta. Mesa, Manila, Philippines 1016
            </Text>
            <Box className="w-full h-32 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241.31249657945932!2d121.01158757552903!3d14.599078867008277!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c9dd97a1439b%3A0x44e1b969e7f1f67a!2sPUP%20Main%20-%20A.%20Mabini%20Campus%2C%20Sta.%20Mesa%2C%20Manila!5e0!3m2!1sen!2sph!4v1776567874730!5m2!1sen!2sph"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Box>
          </Box>

          {/* Contact */}
          <Box className="flex flex-col items-center md:items-start animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
            <Text variant="body" weight="semibold" gradient="red">
              Contact
            </Text>
            <Stack gap="xs" className="items-center md:items-start text-center md:text-left">
              <Link prefetch={false}
                href="mailto:support@gdgpup.org"
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                <Text variant="body-sm" className="text-inherit">
                  support@gdgpup.org
                </Text>
              </Link>
              <Link prefetch={false}
                href="mailto:hello@gdgpup.org"
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                <Text variant="body-sm" className="text-inherit">
                  hello@gdgpup.org
                </Text>
              </Link>
            </Stack>
          </Box>
        </Box>

        {/* White divider line */}
        <div className="border-t border-white mb-8"> </div>

        {/* Bottom Section: Copyright & Social */}
        <Inline
          justify="between"
          align="center"
          className="flex-col-reverse md:flex-row gap-6 animate-in fade-in duration-500 delay-700"
        >
          <Text variant="body-sm" className="text-gray-400 text-center md:text-left">
            Google Developer Group on Campus PUP Nexus @ {currentYear}. All
            rights reserved.
          </Text>

          <Inline gap="md" align="center" className="justify-center">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white hover:scale-110 transition-all duration-200"
                aria-label={social.label}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  {social.icon}
                </svg>
              </a>
            ))}
          </Inline>
        </Inline>
      </Box>
    </Box>
  );
};
