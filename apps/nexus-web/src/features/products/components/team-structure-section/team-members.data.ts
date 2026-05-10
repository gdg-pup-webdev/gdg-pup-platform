import { ASSETS } from "@/lib/constants/assets";

export type TeamMember = {
  name: string;
  role: string;
  imageSrc: string;
  mascotSrc: string;
  row?: number;
  socials?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
};

const MASCOT_SRC = ASSETS.TEAM.MASCOT;

export const TEAM_MEMBERS_BY_SLUG: Record<string, TeamMember[]> = {
  "ui-ux": [
    {
      name: "Jedia Nicole Sagun",
      role: "UI/UX Lead",
      row: 1,
      imageSrc: ASSETS.TEAM.UI_UX.JEDIA_SAGUN,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/jnsagun/",
        twitter: "https://x.com/_jnsagun",
        instagram: "https://www.instagram.com/_jnsagun/",
        facebook: "https://www.facebook.com/jnisagun/",
      },
    },
    {
      name: "Kassandra Rychelle Balona",
      role: "UI/UX Co Lead",
      row: 1,
      imageSrc: ASSETS.TEAM.UI_UX.KASSANDRA_BALONA,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/kasrych/",
        twitter: "https://x.com/kasrych",
        instagram: "https://www.instagram.com/kasrych/",
        facebook: "https://www.facebook.com/kasrych",
      },
    },
    {
      name: "Joyrel Baladjay",
      role: "UI/UX Learning Head Committee",
      row: 2,
      imageSrc: ASSETS.TEAM.UI_UX.JOYREL_BALADJAY,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/joyrelgbaladjay/",
        instagram: "https://www.instagram.com/joyyirel/",
        facebook: "https://www.facebook.com/joyyirel",
      },
    },
    {
      name: "Kacey Michaela Solis",
      role: "UI/UX Learning Head Committee",
      row: 2,
      imageSrc: ASSETS.TEAM.UI_UX.KACEY_SOLIS,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/kacey-michaela-solis-a76577312/",
        instagram: "https://www.instagram.com/miikayella/",
        facebook: "https://www.facebook.com/kayex13/",
      },
    },
  ],
  "web-development": [
    {
      name: "Erwin Daguinotas",
      role: "Web Development Lead",
      row: 1,
      imageSrc: ASSETS.TEAM.WEB_DEVELOPMENT.ERWIN_DAGUINOTAS,
      mascotSrc: MASCOT_SRC,
      socials: {
        instagram: "https://www.instagram.com/winnnwnwnwn/",
        facebook: "https://www.facebook.com/DaguinotasErwin",
      },
    },
    {
      name: "Rhandie Sales Jr.",
      role: "Web Development Co Lead",
      row: 1,
      imageSrc: ASSETS.TEAM.WEB_DEVELOPMENT.RHANDIE_SALES,
      mascotSrc: MASCOT_SRC,
      socials: {
        instagram: "https://www.instagram.com/rhandiejrr/",
        facebook: "https://www.facebook.com/rhandie.sales.1/",
      },
    },
    {
      name: "Daniella Simara",
      role: "Web Development Learning Head Committee",
      row: 2,
      imageSrc: ASSETS.TEAM.WEB_DEVELOPMENT.DANIELLA_SIMARA,
      mascotSrc: MASCOT_SRC,
      socials: {
        instagram: "https://www.instagram.com/d.simara",
        facebook: "https://www.facebook.com/daniella.simara/",
      },
    },
    {
      name: "Gerald Berongoy",
      role: "Web Development Learning Head Committee",
      row: 2,
      imageSrc: ASSETS.TEAM.WEB_DEVELOPMENT.GERALD_BERONGOY,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/geraldberongoy",
        instagram: "https://www.instagram.com/g333rald/",
        facebook: "https://www.facebook.com/gerald.berongoy0904",
      },
    },
  ],
  cybersecurity: [
    {
      name: "Clarisse Jem Salazar",
      role: "Cybersecurity Lead",
      row: 1,
      imageSrc: ASSETS.TEAM.CYBERSECURITY.CLARISSE_SALAZAR,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/clarisse-jem-salazar/",
        instagram: "https://www.instagram.com/clarisse_jem/",
        facebook: "https://web.facebook.com/clarissejem.salazar/",
      },
    },
    {
      name: "John Victor Claudio Duatin",
      role: "Cybersecurity Co-Lead",
      row: 1,
      imageSrc: ASSETS.TEAM.CYBERSECURITY.JOHN_DUATIN,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/jvc-duatin/",
        instagram: "https://www.instagram.com/jvcd.a/",
        facebook: "https://www.facebook.com/johnvictorclaudio.duatin",
      },
    },
    {
      name: "Salvador Vincent Javier",
      role: "Cybersecurity Learning Head Committee",
      row: 2,
      imageSrc: ASSETS.TEAM.CYBERSECURITY.SALVADOR_JAVIER,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/salvadorvincentjavier",
        instagram: "https://www.instagram.com/svjr4k/",
        facebook: "https://www.facebook.com/slvdrvncntjvr/",
      },
    },
    {
      name: "Emmanuel Mutas",
      role: "Cybersecurity Learning Head Committee",
      row: 2,
      imageSrc: ASSETS.TEAM.CYBERSECURITY.EMMANUEL_MUTAS,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/manel04/",
        instagram: "https://www.instagram.com/knee_man04/",
        facebook: "https://www.facebook.com/manwill04",
      },
    },
  ],
  "cloud-solutions": [
    {
      name: "Kyla Marie Agapito",
      role: "Cloud Solutions Lead",
      row: 1,
      imageSrc: ASSETS.TEAM.CLOUD_SOLUTIONS.KYLA_AGAPITO,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/kyla-marie-agapito/",
        instagram: "https://www.instagram.com/rieeemarie/",
      },
    },
    {
      name: "James Gabriele Torzar",
      role: "Cloud Solutions Co-Lead",
      row: 1,
      imageSrc: ASSETS.TEAM.CLOUD_SOLUTIONS.JAMES_TORZAR,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/4regab",
        instagram: "https://www.instagram.com/4regab",
        facebook: "https://www.facebook.com/4rejam",
      },
    },
    {
      name: "Justin Royse Solomon",
      role: "Cloud Solutions Learning Head Committee",
      row: 2,
      imageSrc: ASSETS.TEAM.CLOUD_SOLUTIONS.JUSTIN_SOLOMON,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "http://www.linkedin.com/in/justin-royse-solomon",
        instagram: "https://www.instagram.com/tin_royse/",
        facebook: "https://www.facebook.com/JustinRoyse.Solomon",
      },
    },
    {
      name: "Raphael Johnathan Flores",
      role: "Cloud Solutions Learning Head Committee",
      row: 2,
      imageSrc: ASSETS.TEAM.CLOUD_SOLUTIONS.RAPHAEL_FLORES,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/raphael-johnathan-flores/",
        instagram: "https://www.instagram.com/nthndkid/",
        facebook: "https://www.facebook.com/raphaeljohnathanflores",
      },
    },
  ],
  "data-ml": [
    {
      name: "Kian Angelo Florendo",
      role: "Data and Machine Learning Lead",
      imageSrc: ASSETS.TEAM.DATA_ML.KIAN_FLORENDO,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "www.linkedin.com/in/kian-angelo-florendo-b8ab82378",
        instagram: "https://www.instagram.com/_kiannzzzz",
        facebook: "https://www.facebook.com/share/1FKWW46yK5/",
      },
    },
    {
      name: "Francen Venisse Red",
      role: "Data and Machine Learning Co Lead",
      imageSrc: ASSETS.TEAM.DATA_ML.FRANCEN_RED,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/francen-venisse-red-1021r2005/",
        instagram: "https://www.instagram.com/spicyredcheetos/",
        facebook: "https://www.facebook.com/francen.red/",
      },
    },
    {
      name: "Yhasmen Nogales",
      role: "Data and Machine Learning Co Lead",
      imageSrc: ASSETS.TEAM.DATA_ML.YHASMEN_NOGALES,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/yhasmennogaless",
        instagram: "https://www.instagram.com/yasmn_ngls",
        facebook: "https://www.facebook.com/yhasmen.nogales.3",
      },
    },
    {
      name: "Kurt Anthony Cruz",
      role: "Data and ML Learning Head Committee",
      imageSrc: ASSETS.TEAM.DATA_ML.KURT_CRUZ,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/kurtcruz/",
        instagram: "https://www.instagram.com/kurt.scp/",
        facebook: "https://www.facebook.com/its.kurtcruz/",
      },
    },
    {
      name: "Ram Luis Marmol",
      role: "Data and ML Learning Head Committee",
      imageSrc: ASSETS.TEAM.DATA_ML.RAM_MARMOL,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/ram-luis-marmol",
        instagram: "https://www.instagram.com/rluissss",
        facebook: "https://www.facebook.com/ramluissss",
      },
    },
  ],
  iot: [
    {
      name: "Daniel Rein Cosare",
      role: "IoT Lead",
      imageSrc: ASSETS.TEAM.INTERNET_OF_THINGS.DANIEL_COSARE,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin:
          "linkedin.com/in/daniel-rein-cosare-020a58288/?skipRedirect=true",
        instagram: "https://www.instagram.com/rein_cosare/?hl=en",
        facebook: "https://www.facebook.com/rein.cosare.7",
      },
    },
    {
      name: "Carl Melvin A. Erosa",
      role: "IoT Co-Lead",
      imageSrc: ASSETS.TEAM.INTERNET_OF_THINGS.CARL_EROSA,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/carl-melvin-erosa-4805b4304/",
        instagram: "https://www.instagram.com/carlmelvin__/",
        facebook: "https://www.facebook.com/CmDrew13",
      },
    },
    {
      name: "Shan Allen T. Rivera",
      role: "IoT Learning Head Committee",
      imageSrc: ASSETS.TEAM.INTERNET_OF_THINGS.SHAN_ALLEN_RIVERA,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/shanallenrivera/",
        instagram: "https://www.instagram.com/siomaicare/",
        facebook: "https://www.facebook.com/shanallen.rivera.3",
      },
    },
  ],
  "project-management": [
    {
      name: "Patricia Anne Panlilio",
      role: "Project Management Lead",
      row: 1,
      imageSrc: ASSETS.TEAM.PROJECT_MANAGEMENT.PATRICIA_PANLILIO,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/patriciapanlilio/",
        instagram: "https://www.instagram.com/oohcianne/",
        facebook: "https://www.facebook.com/chogiwoah",
      },
    },
    {
      name: "Lance Gabriel P. Vargas",
      role: "Project Management Co-Lead",
      row: 1,
      imageSrc: ASSETS.TEAM.PROJECT_MANAGEMENT.LANCE_VARGAS,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/lancegabrielvargas",
        instagram: "https://www.instagram.com/lncgbrlvrgs/",
        facebook: "https://www.facebook.com/lancevarg/",
      },
    },
    {
      name: "Trishia Sai Mejia",
      role: "Project Management Co-Lead",
      row: 2,
      imageSrc: ASSETS.TEAM.PROJECT_MANAGEMENT.TRISHIA_MEJIA,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/trishia-sai-mejia/",
        twitter: "https://x.com/runesaiii ",
        instagram: "https://www.instagram.com/runesaiii/ ",
        facebook: "https://www.facebook.com/saiii.sama/ ",
      },
    },
    {
      name: "Abielle Viktoria Dig",
      role: "Project Management Secretary",
      row: 2,
      imageSrc: ASSETS.TEAM.PROJECT_MANAGEMENT.ABIELLE_DIG,
      mascotSrc: MASCOT_SRC,
      socials: {
        instagram: "https://www.instagram.com/abyel___/",
        facebook: "https://www.facebook.com/abielleviktoria/",
      },
    },
  ],
  "tech-executives": [
    {
      name: "Carlos Jerico Dela Torre",
      role: "Chief Technology Officer (CTO)",
      imageSrc: ASSETS.TEAM.TECH_EXECUTIVES.CARLOS_DE_LA_TORRE,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/delatorrecj/",
        twitter: "https://x.com/delatorrecj_",
        instagram: "https://www.instagram.com/delatorrecj",
        facebook: "https://www.facebook.com/2iLiTE",
      },
    },
    {
      name: "Aurold John Sadullo",
      role: "DCTO for Infrastructure and Intelligence",
      imageSrc: ASSETS.TEAM.TECH_EXECUTIVES.AUROLD_SADULLO,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/ajsadullo/",
        instagram: "https://www.instagram.com/ajsdllo/",
        facebook: "https://www.facebook.com/ajsadullo",
      },
    },
    {
      name: "Nyzel Cayat",
      role: "DCTO for Development and Experience ",
      imageSrc: ASSETS.TEAM.TECH_EXECUTIVES.NYZEL_CAYAT,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/nyzel-cayat0/",
        twitter: "https://x.com/chi4ki1_",
        instagram: "https://www.instagram.com/chiaki.wme/",
        facebook: "https://www.facebook.com/chiaki.wme/",
      },
    },
    {
      name: "Mhyca Monterola",
      role: "Technology Communications Officer (TCO)",
      imageSrc: ASSETS.TEAM.TECH_EXECUTIVES.MHYCA_MONTEROLA,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/nyzel-cayat0/",
        instagram: "https://www.instagram.com/mhyieeeee/",
        facebook: "https://www.facebook.com/mhyca.monterola",
      },
    },
    {
      name: "Strawberry Pink Balasbas",
      role: "Technical Documentations Officer (TDO)",
      imageSrc: ASSETS.TEAM.TECH_EXECUTIVES.STRAWBERRY_BALASBAS,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/strawberrypink",
        instagram: "https://www.instagram.com/raiden.ree/",
        facebook: "https://www.facebook.com/yrrebs/",
      },
    },
  ],
  administrative: [
    {
      name: "Randy Carlo Lorenzo",
      role: "Chapter Lead and President",
      row: 1,
      imageSrc: ASSETS.TEAM.ADMINISTRATIVE.RANDY_CARLO_LORENZO,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/randycarlolorenzo/",
        twitter: "https://x.com/RanDIEEEE_",
        instagram: "https://www.instagram.com/randy_lrnz/",
        facebook: "https://www.facebook.com/randycarlo.lorenzo",
      },
    },
    {
      name: "Shunrenn Locaylocay",
      role: "Chief Executive Officer (CEO)",
      row: 1,
      imageSrc: ASSETS.TEAM.ADMINISTRATIVE.SHUNRENN_LOCAYLOCAY,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/shunrenn-locaylocay-a40134290/",
        instagram: "https://www.instagram.com/shun_locs/",
        facebook: "https://www.facebook.com/shun.locs",
      },
    },
    {
      name: "Syruz Ken Domingo",
      role: "Chief Secretariat (CSec)",
      row: 2,
      imageSrc: ASSETS.TEAM.ADMINISTRATIVE.SYRUZ_KEN_DOMINGO,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/syruzkencdomingo/",
        instagram: "https://www.instagram.com/thesnsr/",
        facebook: "https://www.facebook.com/sykecd",
      },
    },
    {
      name: "Kurt Lopez",
      role: "Deputy Chief Secretariat (DCSec)",
      row: 2,
      imageSrc: ASSETS.TEAM.ADMINISTRATIVE.KURT_LOPEZ,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/sellabsu/",
        instagram: "https://www.instagram.com/sellabsu/",
        facebook: "https://www.facebook.com/sellabsu",
      },
    },
    {
      name: "Cathyren Sacatani",
      role: "Chief Finance Officer (CFO)",
      row: 3,
      imageSrc: ASSETS.TEAM.ADMINISTRATIVE.CATHYREN_SACATANI,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/cathyren-sacatani-50361634a/",
        instagram: "https://www.instagram.com/athyyyyyyyy_/",
        facebook: "https://www.facebook.com/caren.sacatani",
      },
    },
    {
      name: "Irah Markeisha Jose",
      role: "Deputy Chief Finance Officer (DCFO)",
      row: 3,
      imageSrc: ASSETS.TEAM.ADMINISTRATIVE.IRAH_JOSE,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "www.linkedin.com/in/irahmarkeishajose",
        instagram: "https://www.instagram.com/hera.iyah/",
        facebook: "https://www.facebook.com/irahdcjose",
      },
    },
    {
      name: "Maryrose Marquez",
      role: "Treasurer",
      row: 4,
      imageSrc: ASSETS.TEAM.ADMINISTRATIVE.MARYROSE_MARQUEZ,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/maryrose-marquez-048a08388/",
        instagram: "https://www.instagram.com/rosefromthededz/",
        facebook: "https://www.facebook.com/maryrosepmarquez",
      },
    },
    {
      name: "Francis Jason Chuaunsu",
      role: "Manegerial Consultant",
      row: 4,
      imageSrc: ASSETS.TEAM.ADMINISTRATIVE.FRANCIS_CHUAUNSU,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/francischuaunsu/",
        instagram: "https://www.instagram.com/francis.json/",
        facebook: "https://www.facebook.com/francischuaunsu",
      },
    },
  ],
  marketing: [
    {
      name: "Gianne Crizzle Dasco",
      role: "Chief Marketing Officer (CMO)",
      row: 1,
      imageSrc: ASSETS.TEAM.MARKETING.GIANNE_DASCO,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/gianne-dasco/",
        instagram: "https://www.instagram.com/crizzledsc",
        facebook: "https://www.facebook.com/GigiDasco20",
      },
    },
    {
      name: "Viviene Tricia Rabano",
      role: "Deputy Chief Marketing Officer (DCMO)",
      row: 1,
      imageSrc: ASSETS.TEAM.MARKETING.VIVIENE_RABANO,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/viviene-rabano-98296931b",
        instagram:
          "https://www.instagram.com/_rvviene?igsh=MWJkYmNxYnhld3ZsNQ==",
        facebook: "https://web.facebook.com/vvnciarabano",
      },
    },
    {
      name: "Victoria Estilong Balgos",
      role: "Social Media Manager Lead",
      row: 2,
      imageSrc: ASSETS.TEAM.MARKETING.VICTORIA_BALGOS,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/victoriabalgos/",
        instagram:
          "https://www.instagram.com/tori_balgos?igsh=cTRrdDM5bTk3MDJh",
        facebook: "https://www.facebook.com/VictoriaEBalgos/",
      },
    },
    {
      name: "Charles Matthew Pacuan",
      role: "Social Media Manager Co-lead",
      row: 2,
      imageSrc: ASSETS.TEAM.MARKETING.CHARLES_PACUAN,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin:
          "https://www.linkedin.com/in/charles-pacuan-a1866a31b/?skipRedirect=true",
        instagram: "https://www.instagram.com/mattyx_03/",
        facebook: "https://www.facebook.com/matt.pacuan#",
      },
    },
    {
      name: "David Monterde Gabriel Jr.",
      role: "Social Media Manager Co-lead",
      row: 2,
      imageSrc: ASSETS.TEAM.MARKETING.DAVID_GABRIEL,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/djgab16/",
        instagram: "https://www.instagram.com/djgab16/",
        facebook: "https://www.facebook.com/djgab16",
      },
    },
    {
      name: "Jade Shana Emit Naig",
      role: "Content Writer Lead",
      row: 3,
      imageSrc: ASSETS.TEAM.MARKETING.JADE_NAIG,
      mascotSrc: MASCOT_SRC,
      socials: {
        instagram: "https://www.instagram.com/shanananae_",
        facebook: "https://www.facebook.com/share/18RkjH1Yrx/",
      },
    },
    {
      name: "Ethaniel Klymore Sales",
      role: "Content Writer Co-lead",
      row: 3,
      imageSrc: ASSETS.TEAM.MARKETING.ETHANIEL_SALES,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/ethanielklymoresales/",
        instagram: "https://www.instagram.com/ikyre4u",
        facebook: "https://www.facebook.com/Kylmorez",
      },
    },
    {
      name: "Emmanuel Andrei Basco",
      role: "Content Calendar Manager Lead",
      row: 4,
      imageSrc: ASSETS.TEAM.MARKETING.EMMANUEL_BASCO,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/drei-basco-852610386/",
        instagram:
          "https://www.instagram.com/dreeeeiiiiiiii?igsh=dDA3cm41YThsZ3gz",
        facebook: "https://www.facebook.com/share/1KPQUYtTox/",
      },
    },
    {
      name: "Clarissa Jasmine Dela Cruz",
      role: "Content Manager Co-lead",
      row: 4,
      imageSrc: ASSETS.TEAM.MARKETING.CLARISSA_DELA_CRUZ,
      mascotSrc: MASCOT_SRC,
      socials: {
        instagram:
          "https://www.instagram.com/_clarissajsmn?igsh=MXEwd3h3bjNna29kdg== ",
        facebook:
          "https://www.facebook.com/profile.php?id=61559315488905&mibextid=ZbWKwL",
      },
    },
    {
      name: "Marky Cortezo",
      role: "Content Creation Lead",
      row: 4,
      imageSrc: ASSETS.TEAM.MARKETING.MARKY_CORTEZO,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/marky-cortezo-1883a5324/",
        instagram: "https://www.instagram.com/low_cortezool/",
        facebook: "https://web.facebook.com/marky.cortezo/",
      },
    },
  ],
  operations: [
    {
      name: "Elija Cabaddu",
      role: "Chief Operations Officer (COO)",
      row: 1,
      imageSrc: ASSETS.TEAM.OPERATIONS.ELIJA_CABADDU,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "linkedin.com/in/aijel/",
        facebook: "https://www.facebook.com/elyuuue",
      },
    },
    {
      name: "Aifah Mae Maddie",
      role: "Deputy Chief Operations Officer (DCOO)",
      row: 1,
      imageSrc: ASSETS.TEAM.OPERATIONS.AIFAH_MADDIE,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/maeaifah/",
        twitter: "https://www.threads.com/@_mae.aifah",
        instagram: "https://www.instagram.com/_mae.aifah/",
        facebook: "https://www.facebook.com/maeaifah/",
      },
    },
    {
      name: "Jinrikisha Omela",
      role: "Technicals Lead",
      row: 2,
      imageSrc: ASSETS.TEAM.OPERATIONS.JINRIKISHA_OMELA,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/jinrikisha-omela/",
        instagram: "https://www.instagram.com/jinrikisha_/",
        facebook: "https://www.facebook.com/jinri.omela",
      },
    },
    {
      name: "Danielle Pauleen Labasa",
      role: "Technicals Co Lead",
      row: 2,
      imageSrc: ASSETS.TEAM.OPERATIONS.DANIELLE_LABASA,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin:
          "https://www.linkedin.com/in/danielle-pauleen-labasa-513a52338?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
        instagram:
          "https://www.instagram.com/yeneneney?igsh=MWoweGJyaXJzZXQzYg%3D%3D&utm_source=qr",
        facebook: "https://www.facebook.com/share/1CXGsGW4NH/?mibextid=wwXIfr",
      },
    },
    {
      name: "Charles Lalata",
      role: "Technicals Senior Lead",
      row: 3,
      imageSrc: ASSETS.TEAM.OPERATIONS.CHARLES_LALATA,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/akotosichrls",
        instagram: "https://www.instagram.com/akotosichrls/",
        facebook: "https://www.facebook.com/chrlsllt/",
      },
    },
    {
      name: "Eugene Gonzaga",
      role: "Technicals Junior Lead",
      row: 3,
      imageSrc: ASSETS.TEAM.OPERATIONS.EUGENE_GONZAGA,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin:
          "https://www.linkedin.com/in/eugene-anthony-gonzaga-54a8432a6/",
        twitter: "https://x.com/yujinismad",
        instagram: "https://www.instagram.com/yujin_gonzaga/",
        facebook: "https://www.facebook.com/yujin.gonzaga/",
      },
    },
    {
      name: "Maria Angeline Aguirre",
      role: "Programs Lead",
      row: 4,
      imageSrc: ASSETS.TEAM.OPERATIONS.MARIA_AGUIRRE,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://ph.linkedin.com/in/maria-angeline-aguirre-b1b446384",
        instagram:
          "https://www.instagram.com/ilunaria__?igsh=MW1odmVqcmF6Y2xyYg%3D%3D&utm_source=qr",
        facebook: "https://www.facebook.com/share/1GB7AFgYef/",
      },
    },
    {
      name: "Jade Micah Lazaro",
      role: "Programs Co-Lead",
      row: 4,
      imageSrc: ASSETS.TEAM.OPERATIONS.JADE_LAZARO,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "www.linkedin.com/in/jade-micah-lazaro-078086296",
        instagram: "https://www.instagram.com/js_arejaded/",
        facebook: "https://www.facebook.com/jadeeeeii/",
      },
    },
    {
      name: "Kishey Ibañez",
      role: "Logistics Lead",
      row: 5,
      imageSrc: ASSETS.TEAM.OPERATIONS.KISHEY_IBANEZ,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "www.linkedin.com/in/kisheyibanez",
        instagram: "https://www.instagram.com/hey.kisses/",
        facebook: "https://www.facebook.com/nonreverke/",
      },
    },
    {
      name: "Alessa Estaras",
      role: "Logistics Co-lead",
      row: 5,
      imageSrc: ASSETS.TEAM.OPERATIONS.ALESSA_ESTARAS,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin:
          "https://www.linkedin.com/in/alessa-estaras-944b25252?utm_source=share_via&utm_content=profile&utm_medium=member_android",
        instagram: "https://www.instagram.com/allezzuuh?igsh=ajM4aWZ0NXQ5NG1k",
        facebook: "https://www.facebook.com/share/1E2SZEHR1S/",
      },
    },
    {
      name: "Hans Ezekiel Naperi",
      role: "Documentations Lead",
      row: 6,
      imageSrc: ASSETS.TEAM.OPERATIONS.HANS_NAPERI,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/hansnaperi004/",
        instagram: "https://www.instagram.com/hanz.prem/",
        facebook: "https://www.facebook.com/hans.naperiii4",
      },
    },
    {
      name: "Cali Dominic Ranjo",
      role: "Documentations Co-lead",
      row: 6,
      imageSrc: ASSETS.TEAM.OPERATIONS.CALI_RANJO,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/cali-dominic-ranjo-a0a5a532b/",
        instagram: "https://www.instagram.com/_d0lvl/",
        facebook: "https://www.facebook.com/dominic.ranjo.2024",
      },
    },
  ],
  "community-relations": [
    {
      name: "Solomon Nadonga",
      role: "Chief Community Relations Officer (CCRO)",
      row: 1,
      imageSrc: ASSETS.TEAM.COMMUNITY_RELATIONS.SOLOMON_NADONGA,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/cheolomoown/",
        instagram: "https://www.instagram.com/cheolomoown/",
        facebook: "https://www.facebook.com/cheolomoown",
      },
    },
    {
      name: "Railley Nieles",
      role: "Deputy Chief Community Relations Officer (DCCRO)",
      row: 1,
      imageSrc: ASSETS.TEAM.COMMUNITY_RELATIONS.RAILLEY_NIELES,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/railley-nieles-7a164129a/",
        instagram: "https://www.instagram.com/rai.yli/",
        facebook: "https://www.facebook.com/railley.nieles",
      },
    },
    {
      name: "Raymund Jr. Dimacutac",
      role: "Student Development Lead",
      row: 2,
      imageSrc: ASSETS.TEAM.COMMUNITY_RELATIONS.RAYMUND_DIMACUTAC,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin:
          "https://www.linkedin.com/in/dimacutac-raymund-jr-b-943a1126b/",
        instagram: "https://www.instagram.com/y0_0mm?igsh=MTMya3BmeHB0aGgxNQ==",
        facebook: "https://www.facebook.com/share/1Uxq8pFYkS/",
      },
    },
    {
      name: "Gerick Eol Hernandez ",
      role: "Student Development Co-Lead",
      row: 2,
      imageSrc: ASSETS.TEAM.COMMUNITY_RELATIONS.GERICK_HERNANDEZ,
      mascotSrc: MASCOT_SRC,
      socials: {
        facebook: "https://www.facebook.com/GerickHernandez026",
      },
    },
    {
      name: "Troy Lauren Lazaro",
      role: "Talent Development Lead",
      row: 3,
      imageSrc: ASSETS.TEAM.COMMUNITY_RELATIONS.TROY_LAZARO,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/troylazaro/",
        instagram: "https://www.instagram.com/isametroy_/",
        facebook: "https://www.facebook.com/troylazaroTL",
      },
    },
    {
      name: "Erica Mae Mallari",
      role: "Talent Development Co-Lead",
      row: 3,
      imageSrc: ASSETS.TEAM.COMMUNITY_RELATIONS.ERICA_MALLARI,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/erica-mae-mallari/",
        instagram: "https://www.instagram.com/eri.chees3/",
        facebook: "https://www.facebook.com/erichu.6",
      },
    },
    {
      name: "Marianne Mae Bautista",
      role: "Community Relations Consultant",
      row: 3,
      imageSrc: ASSETS.TEAM.COMMUNITY_RELATIONS.MARIANNE_BAUTISTA,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin:
          "https://www.linkedin.com/in/marianne-mae-bautista-clssyb-b210a62b2/",
        instagram: "https://www.instagram.com/mai_devastashun/",
        facebook: "https://www.facebook.com/mai.bautista.9",
      },
    },
  ],
  partnership: [
    {
      name: "Mark Joseph Neypes",
      role: "Chief Partnership Officer (CPRO)",
      imageSrc: ASSETS.TEAM.PARTNERSHIP.MARK_NEYPES,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/jaedaaann/",
        instagram: "https://www.instagram.com/jaedonee/",
        facebook: "https://www.facebook.com/mak.jowsep",
      },
    },
    {
      name: "Honeylet Igot",
      role: "Deputy Chief Partnership Officer (DCPRO)",
      imageSrc: ASSETS.TEAM.PARTNERSHIP.HONEYLET_IGOT,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/honeyletigot/",
        instagram: "https://www.instagram.com/hanyyylet/",
        facebook: "https://www.facebook.com/honeyletigot",
      },
    },
    {
      name: "Elijah Jonathan De Guzman",
      role: "Deputy Chief Partnership Officer (DCPRO)",
      imageSrc: ASSETS.TEAM.PARTNERSHIP.ELIJAH_DE_GUZMAN,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/ejdgm",
        instagram: "https://www.instagram.com/ejdg.exe",
        facebook: "https://www.facebook.com/cs.ejdgm",
      },
    },
    {
      name: "Joewen Bragasin",
      role: "Community Partnerships Lead",
      imageSrc: ASSETS.TEAM.PARTNERSHIP.JOEWEN_BRAGASIN,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/joewenbragasin/",
        instagram: "https://www.instagram.com/br_0wen/",
        facebook: "https://www.facebook.com/joewen.br",
      },
    },
    {
      name: "Caryl Joy Atienza",
      role: "Community Partnerships Co-Lead",
      imageSrc: ASSETS.TEAM.PARTNERSHIP.CARYL_ATIENZA,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/carylatienzaa",
        instagram: "https://www.instagram.com/carylatienzaa",
        facebook: "https://facebook.com/carylatienzaa",
      },
    },
    {
      name: "Mary Ruth Relator",
      role: "Industry Partnerships Lead",
      imageSrc: ASSETS.TEAM.PARTNERSHIP.MARY_RELATOR,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/maryruthprelator/",
        instagram: "https://www.instagram.com/its_mary.py/",
        facebook: "https://www.facebook.com/y.maryruth17",
      },
    },
    {
      name: "Emmanuel Oaing",
      role: "Partnerships Coordinator",
      imageSrc: ASSETS.TEAM.PARTNERSHIP.EMMANUEL_OAING,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/emmanueloaing/",
        instagram: "https://www.instagram.com/emmanoaing_/",
        facebook: "https://www.facebook.com/emmanueloaing",
      },
    },
    {
      name: "Arjay Rosel",
      role: "Partnerships Consultant",
      imageSrc: ASSETS.TEAM.PARTNERSHIP.ARJAY_ROSEL,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/arjay-rosel-5b4a0b252/",
        facebook: "https://www.facebook.com/roselarjayyy",
      },
    },
  ],
  creatives: [
    {
      name: "Ayen Mejorada",
      role: "Chief Creatives Officer (CCO)",
      row: 1,
      imageSrc: ASSETS.TEAM.CREATIVES.AYEN_MEJORADA,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/ayen-mejorada-0172a53b3/",
        instagram: "https://www.instagram.com/mejorada_ayen/",
        facebook: "https://www.facebook.com/AyenMejorada11",
      },
    },
    {
      name: "Hesed Suñga",
      role: "Deputy Chief Creatives Officer (DCCO)",
      row: 1,
      imageSrc: ASSETS.TEAM.CREATIVES.HESED_SUNGA,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "www.linkedin.com/in/hesed-suñga-43a326287",
        twitter: "https://x.com/headsettwt_70",
        instagram: "https://www.instagram.com/sedddxd",
        facebook: "https://www.facebook.com/hesedsungaa/",
      },
    },
    {
      name: "Daniella J. Mendoza",
      role: "Graphic Design Lead",
      row: 3,
      imageSrc: ASSETS.TEAM.CREATIVES.DANIELLA_MENDOZA,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://ph.linkedin.com/in/dayne-mendoza-687349330",
        instagram: "https://www.instagram.com/gojoglazer444",
        facebook: "https://www.facebook.com/daynemndz/",
      },
    },
    {
      name: "Alecza Patrice Bonifacio",
      role: "Branding & Assets Lead",
      row: 2,
      imageSrc: ASSETS.TEAM.CREATIVES.ALECZA_BONIFACIO,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin:
          "https://www.linkedin.com/in/alecza-patrice-bonifacio-60011a227/",
        instagram: "https://www.instagram.com/print_xziace/",
        facebook: "https://www.facebook.com/bonifacio.apt",
      },
    },
    {
      name: "Cyruz Cordero Arcan",
      role: "Branding & Assets Co-Lead",
      row: 2,
      imageSrc: ASSETS.TEAM.CREATIVES.CYRUZ_ARCAN,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/cyruz-arcan-672242330/",
        instagram: "https://www.instagram.com/saiwuz/",
        facebook: "https://www.facebook.com/Cmaj7add9",
      },
    },
    {
      name: "Matthew Erivera Cucio",
      role: "Audio & Visuals Lead",
      row: 3,
      imageSrc: ASSETS.TEAM.CREATIVES.MATTHEW_CUCIO,
      mascotSrc: MASCOT_SRC,
      socials: {
        linkedin: "https://www.linkedin.com/in/matthew-cucio/",
        instagram: "https://www.instagram.com/_matthewmatician_/",
        facebook: "https://www.facebook.com/matthew.cucio.5/",
      },
    },
  ],
};

// Keep legacy slug compatibility for About Team section and older links.
TEAM_MEMBERS_BY_SLUG["internet-of-things"] = TEAM_MEMBERS_BY_SLUG.iot;
TEAM_MEMBERS_BY_SLUG.community = TEAM_MEMBERS_BY_SLUG["tech-executives"];
