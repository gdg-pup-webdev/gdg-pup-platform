import Image from "next/image";
import Link from "next/link";
import { Container, Stack, Text, Button, TeamCard } from "@packages/spark-ui";
import { ASSETS } from "@/lib/constants/assets";
import { AboutTheTeam } from "./AboutTheTeam";
import { TeamDropdowns } from "./TeamDropdowns";

interface TeamStructureSectionProps {
  teamName: string;
  teamSlug: string;
}

const MASCOT_SRC = ASSETS.TEAM.MASCOT;

type TeamMember = {
  name: string;
  role: string;
  imageSrc: string;
  mascotSrc: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
};

const SOCIALS = { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" };

const TEAM_MEMBERS_BY_SLUG: Record<string, TeamMember[]> = {
  "ui-ux": [
    {
      name: "Jedia Nicole Sagun",
      role: "UI/UX Lead",
      imageSrc: ASSETS.TEAM.UI_UX.JEDIA_SAGUN,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Kassandra Rychelle Balona",
      role: "UI/UX Co-Lead",
      imageSrc: ASSETS.TEAM.UI_UX.KASSANDRA_BALONA,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Joyrel Baladjay",
      role: "UI/UX Learning Head Committee",
      imageSrc: ASSETS.TEAM.UI_UX.JOYREL_BALADJAY,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Kacey Michaela Solis",
      role: "UI/UX Learning Head Committee",
      imageSrc: ASSETS.TEAM.UI_UX.KACEY_SOLIS,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
  ],
  "web-development": [
    {
      name: "Erwin Daguinotas",
      role: "Web Development Lead",
      imageSrc: ASSETS.TEAM.WEB_DEVELOPMENT.ERWIN_DAGUINOTAS,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Rhandie Sales Jr.",
      role: "Web Development Co-Lead",
      imageSrc: ASSETS.TEAM.WEB_DEVELOPMENT.RHANDIE_SALES,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Daniella Simara",
      role: "Web Development Learning Head Committee",
      imageSrc: ASSETS.TEAM.WEB_DEVELOPMENT.DANIELLA_SIMARA,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Gerald Berongoy",
      role: "Web Development Learning Head Committee",
      imageSrc: ASSETS.TEAM.WEB_DEVELOPMENT.GERALD_BERONGOY,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
  ],
  cybersecurity: [
    {
      name: "Clarisse Jem Salazar",
      role: "Cybersecurity Lead",
      imageSrc: ASSETS.TEAM.CYBERSECURITY.CLARISSE_SALAZAR,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "John Victor Claudio Duatin",
      role: "Cybersecurity Co-Lead",
      imageSrc: ASSETS.TEAM.CYBERSECURITY.JOHN_DUATIN,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Salvador Vincent Javier",
      role: "Cybersecurity Learning Head Committee",
      imageSrc: ASSETS.TEAM.CYBERSECURITY.SALVADOR_JAVIER,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Emmanuel Mutas",
      role: "Cybersecurity Learning Head Committee",
      imageSrc: ASSETS.TEAM.CYBERSECURITY.EMMANUEL_MUTAS,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
  ],
  "cloud-solutions": [
    {
      name: "Kyla Marie Agapito",
      role: "Cloud Solutions Lead",
      imageSrc: ASSETS.TEAM.CLOUD_SOLUTIONS.KYLA_AGAPITO,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "James Gabriele Torzar",
      role: "Cloud Solutions Co-Lead",
      imageSrc: ASSETS.TEAM.CLOUD_SOLUTIONS.JAMES_TORZAR,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Justin Royse Solomon",
      role: "Cloud Solutions Learning Head Committee",
      imageSrc: ASSETS.TEAM.CLOUD_SOLUTIONS.JUSTIN_SOLOMON,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Raphael Johnathan Flores",
      role: "Cloud Solutions Learning Head Committee",
      imageSrc: ASSETS.TEAM.CLOUD_SOLUTIONS.RAPHAEL_FLORES,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
  ],
  "data-ml": [
    {
      name: "Kian Angelo Florendo",
      role: "Data and Machine Learning Lead",
      imageSrc: ASSETS.TEAM.DATA_ML.KIAN_FLORENDO,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Francen Venisse Red",
      role: "Data and Machine Learning Co-Lead",
      imageSrc: ASSETS.TEAM.DATA_ML.FRANCEN_RED,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Yhasmen Nogales",
      role: "Data and Machine Learning Co-Lead",
      imageSrc: ASSETS.TEAM.DATA_ML.YHASMEN_NOGALES,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Kurt Anthony Cruz",
      role: "Data and ML Learning Head Committee",
      imageSrc: ASSETS.TEAM.DATA_ML.KURT_CRUZ,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Ram Luis Marmol",
      role: "Data and ML Learning Head Committee",
      imageSrc: ASSETS.TEAM.DATA_ML.RAM_MARMOL,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
  ],
  "internet-of-things": [
    {
      name: "Daniel Rein Cosare",
      role: "IoT Lead",
      imageSrc: ASSETS.TEAM.INTERNET_OF_THINGS.DANIEL_COSARE,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Carl Melvin A. Erosa",
      role: "IoT Co-Lead",
      imageSrc: ASSETS.TEAM.INTERNET_OF_THINGS.CARL_EROSA,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Shan Allen T. Rivera",
      role: "IoT Learning Head Committee",
      imageSrc: ASSETS.TEAM.INTERNET_OF_THINGS.SHAN_ALLEN_RIVERA,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
  ],
  "project-management": [
    {
      name: "Patricia Anne Panlilio",
      role: "Project Management Lead",
      imageSrc: ASSETS.TEAM.PROJECT_MANAGEMENT.PATRICIA_PANLILIO,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Lance Gabriel P. Vargas",
      role: "Project Management Co-Lead",
      imageSrc: ASSETS.TEAM.PROJECT_MANAGEMENT.LANCE_VARGAS,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Trishia Sai Mejia",
      role: "Project Management Co-Lead",
      imageSrc: ASSETS.TEAM.PROJECT_MANAGEMENT.TRISHIA_MEJIA,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Abielle Viktoria Dig",
      role: "Project Management Secretary",
      imageSrc: ASSETS.TEAM.PROJECT_MANAGEMENT.ABIELLE_DIG,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
  ],
  "tech-executives": [
    {
      name: "Carlos Jerico Dela Torre",
      role: "Chief Technology Officer (CTO)",
      imageSrc: ASSETS.TEAM.TECH_EXECUTIVES.CARLOS_DE_LA_TORRE,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Aurold John Sadullo",
      role: "DCTO for Infrastructure and Intelligence",
      imageSrc: ASSETS.TEAM.TECH_EXECUTIVES.AUROLD_SADULLO,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Nyzel Cayat",
      role: "DCTO for Development and Experience",
      imageSrc: ASSETS.TEAM.TECH_EXECUTIVES.NYZEL_CAYAT,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Mhyca Monterola",
      role: "Technology Communications Officer (TCO)",
      imageSrc: ASSETS.TEAM.TECH_EXECUTIVES.MHYCA_MONTEROLA,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Strawberry Pink Balasbas",
      role: "Technical Documentations Officer (TDO)",
      imageSrc: ASSETS.TEAM.TECH_EXECUTIVES.STRAWBERRY_BALASBAS,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
  ],
  administrative: [
    {
      name: "Randy Carlo Lorenzo",
      role: "Chapter Lead and President",
      imageSrc: ASSETS.TEAM.ADMINISTRATIVE.RANDY_CARLO_LORENZO,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Shunrenn Locaylocay",
      role: "Chief Executive Officer (CEO)",
      imageSrc: ASSETS.TEAM.ADMINISTRATIVE.SHUNRENN_LOCAYLOCAY,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Syruz Ken Domingo",
      role: "Placeholder",
      imageSrc: ASSETS.TEAM.ADMINISTRATIVE.SYRUZ_KEN_DOMINGO,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Kurt Lopez",
      role: "Deputy Chief Secretariat (DCSec)",
      imageSrc: ASSETS.TEAM.ADMINISTRATIVE.KURT_LOPEZ,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Cathyren Sacatani",
      role: "Chief Finance Officer (CFO)",
      imageSrc: ASSETS.TEAM.ADMINISTRATIVE.CATHYREN_SACATANI,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Irah Markeisha Jose",
      role: "Deputy Chief Finance Officer (DCFO)",
      imageSrc: ASSETS.TEAM.ADMINISTRATIVE.IRAH_JOSE,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Maryrose Marquez",
      role: "Treasurer",
      imageSrc: ASSETS.TEAM.ADMINISTRATIVE.MARYROSE_MARQUEZ,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
  ],
  marketing: [
    {
      name: "Gianne Crizzle Dasco",
      role: "Chief Marketing Officer (CMO)",
      imageSrc: ASSETS.TEAM.MARKETING.GIANNE_DASCO,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Viviene Tricia Rabano",
      role: "Deputy Chief Marketing Officer (DCMO)",
      imageSrc: ASSETS.TEAM.MARKETING.VIVIENE_RABANO,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Victoria Estilong Balgos",
      role: "Social Media Manager Lead",
      imageSrc: ASSETS.TEAM.MARKETING.VICTORIA_BALGOS,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Charles Matthew Pacuan",
      role: "Social Media Manager Co-Lead",
      imageSrc: ASSETS.TEAM.MARKETING.CHARLES_PACUAN,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "David Monterde Gabriel Jr.",
      role: "Social Media Manager Co-Lead",
      imageSrc: ASSETS.TEAM.MARKETING.DAVID_GABRIEL,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Jade Shana Emit Naig",
      role: "Content Writer Lead",
      imageSrc: ASSETS.TEAM.MARKETING.JADE_NAIG,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Ethaniel Klymore Sales",
      role: "Content Writer Co-Lead",
      imageSrc: ASSETS.TEAM.MARKETING.ETHANIEL_SALES,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Emmanuel Andrei Basco",
      role: "Content Calendar Manager Lead",
      imageSrc: ASSETS.TEAM.MARKETING.EMMANUEL_BASCO,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Clarissa Jasmine Dela Cruz",
      role: "Content Manager Co-Lead",
      imageSrc: ASSETS.TEAM.MARKETING.CLARISSA_DELA_CRUZ,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Joshua Tanawan",
      role: "Content Creation Lead",
      imageSrc: ASSETS.TEAM.MARKETING.JOSHUA_TANAWAN,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Marky Cortezo",
      role: "Content Creation Co-Lead",
      imageSrc: ASSETS.TEAM.MARKETING.MARKY_CORTEZO,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
  ],
  operations: [
    {
      name: "Elija Cabaddu",
      role: "Chief Operations Officer (COO)",
      imageSrc: ASSETS.TEAM.OPERATIONS.ELIJA_CABADDU,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Aifah Mae Maddie",
      role: "Deputy Chief Operations Officer (DCOO)",
      imageSrc: ASSETS.TEAM.OPERATIONS.AIFAH_MADDIE,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Jinrikisha Omela",
      role: "Technicals Lead",
      imageSrc: ASSETS.TEAM.OPERATIONS.JINRIKISHA_OMELA,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Danielle Pauleen Labasa",
      role: "Technicals Co-Lead",
      imageSrc: ASSETS.TEAM.OPERATIONS.DANIELLE_LABASA,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Charles Lalata",
      role: "Technicals Senior Lead",
      imageSrc: ASSETS.TEAM.OPERATIONS.CHARLES_LALATA,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Eugene Gonzaga",
      role: "Technicals Junior Lead",
      imageSrc: ASSETS.TEAM.OPERATIONS.EUGENE_GONZAGA,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Maria Angeline Aguirre",
      role: "Programs Lead",
      imageSrc: ASSETS.TEAM.OPERATIONS.MARIA_AGUIRRE,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Jade Micah Lazaro",
      role: "Programs Co-Lead",
      imageSrc: ASSETS.TEAM.OPERATIONS.JADE_LAZARO,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Kishey Ibañez",
      role: "Logistics Lead",
      imageSrc: ASSETS.TEAM.OPERATIONS.KISHEY_IBANEZ,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Alessa Estaras",
      role: "Logistics Co-Lead",
      imageSrc: ASSETS.TEAM.OPERATIONS.ALESSA_ESTARAS,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Hans Ezekiel Naperi",
      role: "Documentations Lead",
      imageSrc: ASSETS.TEAM.OPERATIONS.HANS_NAPERI,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Cali Dominic Ranjo",
      role: "Documentations Co-Lead",
      imageSrc: ASSETS.TEAM.OPERATIONS.CALI_RANJO,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
  ],
  "community-relations": [
    {
      name: "Solomon Nadonga",
      role: "Chief Community Relations Officer (CCRO)",
      imageSrc: ASSETS.TEAM.COMMUNITY_RELATIONS.SOLOMON_NADONGA,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Railley Nieles",
      role: "Deputy Chief Community Relations Officer (DCCRO)",
      imageSrc: ASSETS.TEAM.COMMUNITY_RELATIONS.RAILLEY_NIELES,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Raymund Jr. Dimacutac",
      role: "Student Development Lead",
      imageSrc: ASSETS.TEAM.COMMUNITY_RELATIONS.RAYMUND_DIMACUTAC,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Gerick Eol Hernandez",
      role: "Student Development Co-Lead",
      imageSrc: ASSETS.TEAM.COMMUNITY_RELATIONS.GERICK_HERNANDEZ,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Troy Lauren Lazaro",
      role: "Talent Development Lead",
      imageSrc: ASSETS.TEAM.COMMUNITY_RELATIONS.TROY_LAZARO,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Erica Mae Mallari",
      role: "Talent Development Co-Lead",
      imageSrc: ASSETS.TEAM.COMMUNITY_RELATIONS.ERICA_MALLARI,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Marianne Mae Bautista",
      role: "Community Relations Consultant",
      imageSrc: ASSETS.TEAM.COMMUNITY_RELATIONS.MARIANNE_BAUTISTA,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
  ],
  partnership: [
    {
      name: "Mark Joseph Neypes",
      role: "Chief Partnership Relations Officer (CPRO)",
      imageSrc: ASSETS.TEAM.PARTNERSHIP.MARK_NEYPES,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Honeylet Igot",
      role: "Deputy Chief Partnership Relations Officer (DCPRO)",
      imageSrc: ASSETS.TEAM.PARTNERSHIP.HONEYLET_IGOT,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Elijah Jonathan De Guzman",
      role: "Deputy Chief Partnership Relations Officer (DCPRO)",
      imageSrc: ASSETS.TEAM.PARTNERSHIP.ELIJAH_DE_GUZMAN,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Joewen Bragasin",
      role: "Community Partnerships Lead",
      imageSrc: ASSETS.TEAM.PARTNERSHIP.JOEWEN_BRAGASIN,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Caryl Joy Atienza",
      role: "Community Partnerships Co-Lead",
      imageSrc: ASSETS.TEAM.PARTNERSHIP.CARYL_ATIENZA,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Angeline Magdaluyo",
      role: "Industry Partnerships Lead",
      imageSrc: ASSETS.TEAM.PARTNERSHIP.ANGELINE_MAGDALUYO,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Mary Ruth Relator",
      role: "Industry Partnerships Co-Lead",
      imageSrc: ASSETS.TEAM.PARTNERSHIP.MARY_RELATOR,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Arjay Rosel",
      role: "Partnership Consultant",
      imageSrc: ASSETS.TEAM.PARTNERSHIP.ARJAY_ROSEL,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Emmanuel Oaing",
      role: "Partnerships Coordinator",
      imageSrc: ASSETS.TEAM.PARTNERSHIP.EMMANUEL_OAING,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
  ],
  creatives: [
    {
      name: "Ayen Mejorada",
      role: "Chief Creatives Officer (CCO)",
      imageSrc: ASSETS.TEAM.CREATIVES.AYEN_MEJORADA,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Hesed Suñga",
      role: "Deputy Chief Creatives Officer (DCCO)",
      imageSrc: ASSETS.TEAM.CREATIVES.HESED_SUNGA,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Daniella J. Mendoza",
      role: "Graphic Design Lead",
      imageSrc: ASSETS.TEAM.CREATIVES.DANIELLA_MENDOZA,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Michael Marquez",
      role: "Social Media Manager Co-Lead",
      imageSrc: ASSETS.TEAM.CREATIVES.MICHAEL_MARQUEZ,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Alecza Patrice Bonifacio",
      role: "Branding & Assets Lead",
      imageSrc: ASSETS.TEAM.CREATIVES.ALECZA_BONIFACIO,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Cyruz Cordero Arcan",
      role: "Branding & Assets Co-Lead",
      imageSrc: ASSETS.TEAM.CREATIVES.CYRUZ_ARCAN,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Matthew Erivera Cucio",
      role: "Audio & Visuals Lead",
      imageSrc: ASSETS.TEAM.CREATIVES.MATTHEW_CUCIO,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
    {
      name: "Emanuel Jabon",
      role: "Audio & Visuals Co-Lead",
      imageSrc: ASSETS.TEAM.CREATIVES.EMANUEL_JABON,
      mascotSrc: MASCOT_SRC,
      socials: SOCIALS,
    },
  ],
};

export function TeamStructureSection({
  teamName,
  teamSlug,
}: TeamStructureSectionProps) {
  return (
    <div className="relative overflow-x-hidden overflow-y-hidden pt-60 pb-48 px-4 md:px-8 lg:px-16">
      {/* Bottom layer */}
      <img
        src="/products/RL-SPACE_BG_3_3.png"
        alt=""
        className="absolute top-280 left-1/2 -translate-x-1/2 w-full h-auto pointer-events-none"
      />
      {/* Middle layer (partially under top) */}
      <img
        src="/products/RL-SPACE_BG_3_2.png"
        alt=""
        className="absolute top-165 left-1/2 -translate-x-1/2 w-full h-auto pointer-events-none"
      />
      {/* Top layer */}
      <img
        src="/products/RL-SPACE_BG_3_1.png"
        alt=""
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-auto pointer-events-none"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, black 70%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
        }}
      />
      <img
        className="w-165 h-auto absolute bottom-180 -right-10 opacity-25 translate-x-1/3 rotate-[-16deg] z-10"
        src="/products/cogwheel-asset.png"
        alt=""
      />
      <img
        className="w-500 h-auto absolute bottom-0 right-150 translate-x-1/3"
        src="/products/RL-gold-2.png"
        alt=""
      />

      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "min(900px, 65vw)",
          height: "min(800px, 70vh)",
          top: "calc(4rem - 300px)",
          left: "max(calc((100vw - 80rem) / 2), 0px)",
          background: "#4285F433",
          filter: "blur(579px)",
          zIndex: 0,
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "min(800px, 60vw)",
          height: "min(900px, 75vh)",
          top: "calc(4rem + 300px)",
          right: "max(calc((100vw - 80rem) / 2 - 300px), -150px)",
          background: "#34A85333",
          filter: "blur(579px)",
          zIndex: 0,
        }}
      />

      <Container maxWidth="full">
        <Stack gap="2xl" className="relative z-10">
          <Stack gap="lg" className="items-center">
            <Text
              variant="heading-1"
              gradient="white-blue"
              align="center"
              weight="bold"
            >
              ABOUT THE TEAM
            </Text>
            <Text
              variant="heading-1"
              gradient="white-yellow"
              align="center"
              weight="bold"
              className="mt-10"
            >
              {teamName}
            </Text>

            <div className="w-full mt-20 flex flex-col items-center">
              <div className="w-full flex justify-center">
                <Image
                  src="/products/ui-ux-logo.png"
                  alt={`${teamName} team`}
                  width={900}
                  height={500}
                  className="w-full max-w-[600px] rounded-2xl object-cover relative z-20"
                />
              </div>

              <div className="absolute left-1/2 -translate-x-1/2 top-10 w-[1900px] pointer-events-none z-10">
                <Image
                  src="/products/gold-4.png"
                  alt=""
                  width={1200}
                  height={600}
                  className="w-full h-auto mix-blend-screen opacity-67 blur-[50px]"
                />
              </div>
              <div className="relative w-full max-w-3xl h-[140px] mt-[-10px] pointer-events-none">
                <div className="absolute left-1/2 -translate-x-1/2 -top-25 w-570 aspect-[1204/188] opacity-70">
                  <Image
                    src={ASSETS.ID.SPIRAL_OUTER}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 -top-30 w-480 aspect-[1204/188] opacity-70">
                  <Image
                    src={ASSETS.ID.SPIRAL_OUTER}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 -top-24 w-410 aspect-[1018/125] opacity-80">
                  <Image
                    src={ASSETS.ID.SPIRAL_CENTER}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 -top-25 w-450 aspect-[697/66] opacity-100">
                  <Image
                    src={ASSETS.ID.SPIRAL_INNER}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="w-full max-w-[1600px] mx-auto my-6 z-10 mt-30">
              <AboutTheTeam
                description={
                  <div className="text-lg md:text-3xl leading-12 font-medium">
                    <>
                      The <span className="text-yellow-400">UI/UX Team</span>{" "}
                      focuses on creating intuitive and engaging user interfaces
                      and experiences for digital products. Members of this team
                      will work on designing user-centric interfaces, conducting
                      usability testing, and creating wireframes and prototypes.
                      Throughout the term, they will gain experience in design
                      tools and methodologies, ensuring that the software and
                      applications developed are not only functional but also
                      visually appealing and easy to use.
                    </>
                  </div>
                }
                categories={
                  <>
                    <span className="inline-flex items-center rounded-full border border-white/15 bg-[#1B2745]/65 px-3 py-1 text-sm font-normal leading-5 text-white">
                      UI Design
                    </span>
                    <span className="inline-flex items-center rounded-full border border-white/15 bg-[#1B2745]/65 px-3 py-1 text-sm font-normal leading-5 text-white">
                      UX Research
                    </span>
                    <span className="inline-flex items-center rounded-full border border-white/15 bg-[#1B2745]/65 px-3 py-1 text-sm font-normal leading-5 text-white">
                      Prototyping
                    </span>
                  </>
                }
              />
            </div>
          </Stack>

          <Stack gap="xl" className="mt-16">
            <Text
              variant="heading-1"
              gradient="white-blue"
              align="center"
              weight="bold"
            >
              CURRENT TEAM LEADS
            </Text>

            <div className="flex flex-wrap justify-center gap-6 mt-15">
              {(TEAM_MEMBERS_BY_SLUG[teamSlug] ?? []).map((member) => (
                <TeamCard
                  key={member.name}
                  name={member.name}
                  role={member.role}
                  imageSrc={member.imageSrc}
                  mascotSrc={member.mascotSrc}
                  socials={member.socials}
                  className="w-100 max-w-[14.8rem]"
                />
              ))}
            </div>
          </Stack>

          <Stack gap="xl" className="mt-16 items-center">
            <Text
              variant="heading-1"
              gradient="white-blue"
              align="center"
              weight="bold"
            >
              TEAM STRUCTURE
            </Text>

            <div className="w-full max-w-[1600px] mt-15">
              <TeamDropdowns />
            </div>

            <Link href={`/products`}>
              <Button size="lg">Back to Resources</Button>
            </Link>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
