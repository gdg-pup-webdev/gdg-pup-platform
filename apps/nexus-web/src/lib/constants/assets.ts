/**
 * Central asset path registry for nexus-web.
 *
 * All public image/asset paths are declared here.
 * Import from this file instead of using magic strings in components.
 *
 * Paths follow the flat Object-Action naming convention introduced in
 * Phase 2 of the asset migration. All raster images are now .webp.
 */

export const ASSETS = {
    // ─── Branding ────────────────────────────────────────────────────────────────
    BRANDING: {
        /** Animated/complex GDG SVG (used in the global loader) */
        GDG_LOGO_SVG: "/branding/gdg-logo-animated.svg",
        /** Raster GDG logo (used in Navbar + Footer) */
        GDG_LOGO_WEBP: "/branding/gdg-logo.webp",
    },

    // ─── Home ─────────────────────────────────────────────────────────────────────
    HOME: {
        HERO: {
            /** Sparky character — foreground layer */
            LAYER_SPARKY: "/home/home-hero-layer-sparky.webp",
            /** Full background gradient layer */
            LAYER_BG: "/home/home-hero-layer-bg.webp",
            /** Mid-ground layer B1 variant 1 */
            LAYER_B1: "/home/home-hero-layer-b1.webp",
            /** Mid-ground layer B1 variant 2 */
            LAYER_B2: "/home/home-hero-layer-b2.webp",
            /** Cloud/ambient layer */
            LAYER_CLOUDS: "/home/home-hero-layer-clouds.webp",
            /** Depth/environment layer D-E */
            LAYER_DE: "/home/home-hero-layer-de.webp",
            /** Far-background layer F1 */
            LAYER_F1: "/home/home-hero-layer-f1.webp",
            /** Far-background layer F2 */
            LAYER_F2: "/home/home-hero-layer-f2.webp",
            /** Far-background layer F3 */
            LAYER_F3: "/home/home-hero-layer-f3.webp",
            /** Far-background layer F4 */
            LAYER_F4: "/home/home-hero-layer-f4.webp",
            /** Far-background layer F5 */
            LAYER_F5: "/home/home-hero-layer-f5.webp",
        },
        WHO: {
            /** Sparky & Cirby mascot illustration */
            SPARKY_CIRBY: "/home/home-who-sparky-cirby.webp",
        },
        /** Diamond bullet-point SVG used in list sections */
        BULLET_DIAMOND: "/home/home-bullet-diamond.svg",
    },

    // ─── About ────────────────────────────────────────────────────────────────────
    ABOUT: {
        BENEFITS: {
            GOOGLE_ACCESS: "/about/about-benefits-google-access.webp",
            HANDS_ON: "/about/about-benefits-hands-on.webp",
            MENTORSHIP: "/about/about-benefits-mentorship.webp",
            GROWTH_NETWORK: "/about/about-benefits-growth-network.webp",
            LEADERSHIP: "/about/about-benefits-leadership.webp",
            COMMUNITY: "/about/about-benefits-community.webp",
            /** Left decorative SVG element in benefits section */
            DECOR_LEFT: "/about/about-benefits-decor-left.svg",
            /** Right decorative SVG element in benefits section */
            DECOR_RIGHT: "/about/about-benefits-decor-right.svg",
        },
        WHO: {
            MASCOT_1: "/about/about-who-mascot-1.webp",
            MASCOT_2: "/about/about-who-mascot-2.webp",
            SPIRAL: "/about/about-who-spiral.webp",
            CARD_BULLET: "/about/about-who-card-bullet.webp",
            DECOR_ELEMENT_1: "/about/about-who-decor-element-1.webp",
            DECOR_ELEMENT_2: "/about/about-who-decor-element-2.webp",
        },
    },

    // ─── ID card page ─────────────────────────────────────────────────────────────
    ID: {
        BG: "/id/id-bg.webp",
        CIRBY: "/id/id-cirby.webp",
        DECOR_LEFT: "/id/id-decor-left.webp",
        DECOR_RIGHT: "/id/id-decor-right.webp",
        CARD_NAME_FRAME: "/id/id-card-name-frame.webp",
        CARD_SPARKY: "/id/id-card-sparky.webp",
        CARD_TEXTURE: "/id/id-card-texture.webp",
        GETID_RECT_BLUE: "/id/id-getid-rect-blue.webp",
        GETID_RECT_GREEN: "/id/id-getid-rect-green.webp",
        GETID_RECT_RED: "/id/id-getid-rect-red.webp",
        GETID_RECT_YELLOW: "/id/id-getid-rect-yellow.webp",
        SPIRAL_CENTER: "/id/id-spiral-center.webp",
        SPIRAL_INNER: "/id/id-spiral-inner.webp",
        SPIRAL_OUTER: "/id/id-spiral-outer.webp",
    },

    // ─── Team ─────────────────────────────────────────────────────────────────────
    TEAM: {
        /** Shared mascot used on every team sub-page */
        MASCOT: "/team/team-mascot.webp",
        STAR: "/team/team-star.webp",
        HERO_ICON: "/team/team-hero-icon.webp",
        ELLIPSE_UPPER: "/team/team-ellipse-upper.webp",
        ELLIPSE_LOWER: "/team/team-ellipse-lower.webp",

        ADMINISTRATIVE: {
            CATHYREN_SACATANI: "/team/team-administrative-cathyren-sacatani.webp",
            IRAH_JOSE: "/team/team-administrative-irah-markeisha-jose.webp",
            KURT_LOPEZ: "/team/team-administrative-kurt-lopez.webp",
            MARYROSE_MARQUEZ: "/team/team-administrative-maryrose-marquez.webp",
            RANDY_CARLO_LORENZO: "/team/team-administrative-randy-carlo-lorenzo.webp",
            SHUNRENN_LOCAYLOCAY: "/team/team-administrative-shunrenn-locaylocay.webp",
            SYRUZ_KEN_DOMINGO: "/team/team-administrative-syruz-ken-domingo.webp",
        },

        CLOUD_SOLUTIONS: {
            JAMES_TORZAR: "/team/team-cloud-solutions-james-gabriele-torzar.webp",
            JUSTIN_SOLOMON: "/team/team-cloud-solutions-justin-royse-solomon.webp",
            KYLA_AGAPITO: "/team/team-cloud-solutions-kyla-marie-agapito.webp",
            RAPHAEL_FLORES: "/team/team-cloud-solutions-raphael-johnathan-flores.webp",
        },

        COMMUNITY_RELATIONS: {
            ERICA_MALLARI: "/team/team-community-relations-erica-mae-mallari.webp",
            GERICK_HERNANDEZ: "/team/team-community-relations-gerick-eol-hernandez.webp",
            MARIANNE_BAUTISTA: "/team/team-community-relations-marianne-mae-bautista.webp",
            RAILLEY_NIELES: "/team/team-community-relations-railley-nieles.webp",
            RAYMUND_DIMACUTAC: "/team/team-community-relations-raymund-jr-dimacutac.webp",
            SOLOMON_NADONGA: "/team/team-community-relations-solomon-nadonga.webp",
            TROY_LAZARO: "/team/team-community-relations-troy-lauren-lazaro.webp",
        },

        CREATIVES: {
            ALECZA_BONIFACIO: "/team/team-creatives-alecza-patrice-bonifacio.webp",
            AYEN_MEJORADA: "/team/team-creatives-ayen-mejorada.webp",
            CYRUZ_ARCAN: "/team/team-creatives-cyruz-cordero-arcan.webp",
            DANIELLA_MENDOZA: "/team/team-creatives-daniella-j-mendoza.webp",
            EMANUEL_JABON: "/team/team-creatives-emanuel-jabon.webp",
            HESED_SUNGA: "/team/team-creatives-hesed-sunga.webp",
            MATTHEW_CUCIO: "/team/team-creatives-matthew-erivera-cucio.webp",
            MICHAEL_MARQUEZ: "/team/team-creatives-michael-marquez.webp",
        },

        CYBERSECURITY: {
            CLARISSE_SALAZAR: "/team/team-cybersecurity-clarisse-jem-salazar.webp",
            EMMANUEL_MUTAS: "/team/team-cybersecurity-emmanuel-mutas.webp",
            JOHN_DUATIN: "/team/team-cybersecurity-john-victor-claudio-duatin.webp",
            SALVADOR_JAVIER: "/team/team-cybersecurity-salvador-vincent-javier.webp",
        },

        DATA_ML: {
            FRANCEN_RED: "/team/team-data-ml-francen-venisse-red.webp",
            KIAN_FLORENDO: "/team/team-data-ml-kian-angelo-florendo.webp",
            KURT_CRUZ: "/team/team-data-ml-kurt-anthony-cruz.webp",
            RAM_MARMOL: "/team/team-data-ml-ram-luis-marmol.webp",
            YHASMEN_NOGALES: "/team/team-data-ml-yhasmen-nogales.webp",
        },

        INTERNET_OF_THINGS: {
            CARL_EROSA: "/team/team-internet-of-things-carl-melvin-a-erosa.webp",
            DANIEL_COSARE: "/team/team-internet-of-things-daniel-rein-cosare.webp",
            SHAN_ALLEN_RIVERA: "/team/team-internet-of-things-shan-allen-t-rivera.webp",
        },

        MARKETING: {
            CHARLES_PACUAN: "/team/team-marketing-charles-matthew-pacuan.webp",
            CLARISSA_DELA_CRUZ: "/team/team-marketing-clarissa-jasmine-dela-cruz.webp",
            DAVID_GABRIEL: "/team/team-marketing-david-monterde-gabriel-jr.webp",
            EMMANUEL_BASCO: "/team/team-marketing-emmanuel-andrei-basco.webp",
            ETHANIEL_SALES: "/team/team-marketing-ethaniel-klymore-sales.webp",
            GIANNE_DASCO: "/team/team-marketing-gianne-crizzle-dasco.webp",
            JADE_NAIG: "/team/team-marketing-jade-shana-emit-naig.webp",
            JOSHUA_TANAWAN: "/team/team-marketing-joshua-tanawan.webp",
            MARKY_CORTEZO: "/team/team-marketing-marky-cortezo.webp",
            VICTORIA_BALGOS: "/team/team-marketing-victoria-estilong-balgos.webp",
            VIVIENE_RABANO: "/team/team-marketing-viviene-tricia-rabano.webp",
        },

        OPERATIONS: {
            AIFAH_MADDIE: "/team/team-operations-aifah-mae-maddie.webp",
            ALESSA_ESTARAS: "/team/team-operations-alessa-estaras.webp",
            CALI_RANJO: "/team/team-operations-cali-dominic-ranjo.webp",
            CHARLES_LALATA: "/team/team-operations-charles-lalata.webp",
            DANIELLE_LABASA: "/team/team-operations-danielle-pauleen-labasa.webp",
            ELIJA_CABADDU: "/team/team-operations-elija-cabaddu.webp",
            EUGENE_GONZAGA: "/team/team-operations-eugene-gonzaga.webp",
            HANS_NAPERI: "/team/team-operations-hans-ezekiel-naperi.webp",
            JADE_LAZARO: "/team/team-operations-jade-micah-lazaro.webp",
            JINRIKISHA_OMELA: "/team/team-operations-jinrikisha-omela.webp",
            KISHEY_IBANEZ: "/team/team-operations-kishey-ibanez.webp",
            MARIA_AGUIRRE: "/team/team-operations-maria-angeline-aguirre.webp",
        },

        PARTNERSHIP: {
            ANGELINE_MAGDALUYO: "/team/team-partnership-angeline-magdaluyo.webp",
            ARJAY_ROSEL: "/team/team-partnership-arjay-rosel.webp",
            CARYL_ATIENZA: "/team/team-partnership-caryl-joy-atienza.webp",
            ELIJAH_DE_GUZMAN: "/team/team-partnership-elijah-jonathan-de-guzman.webp",
            EMMANUEL_OAING: "/team/team-partnership-emmanuel-oaing.webp",
            HONEYLET_IGOT: "/team/team-partnership-honeylet-igot.webp",
            JOEWEN_BRAGASIN: "/team/team-partnership-joewen-bragasin.webp",
            MARK_NEYPES: "/team/team-partnership-mark-joseph-neypes.webp",
            MARY_RELATOR: "/team/team-partnership-mary-ruth-relator.webp",
        },

        PROJECT_MANAGEMENT: {
            ABIELLE_DIG: "/team/team-project-management-abielle-viktoria-dig.webp",
            LANCE_VARGAS: "/team/team-project-management-lance-gabriel-p-vargas.webp",
            PATRICIA_PANLILIO: "/team/team-project-management-patricia-anne-panlilio.webp",
            TRISHIA_MEJIA: "/team/team-project-management-trishia-sai-mejia.webp",
        },

        TECH_EXECUTIVES: {
            AUROLD_SADULLO: "/team/team-tech-executives-aurold-john-sadullo.webp",
            CARLOS_DE_LA_TORRE: "/team/team-tech-executives-carlos-jerico-dela-torre.webp",
            MHYCA_MONTEROLA: "/team/team-tech-executives-mhyca-monterola.webp",
            NYZEL_CAYAT: "/team/team-tech-executives-nyzel-cayat.webp",
            STRAWBERRY_BALASBAS: "/team/team-tech-executives-strawberry-pink-balasbas.webp",
        },

        UI_UX: {
            JEDIA_SAGUN: "/team/team-ui-ux-jedia-nicole-sagun.webp",
            JOYREL_BALADJAY: "/team/team-ui-ux-joyrel-baladjay.webp",
            KACEY_SOLIS: "/team/team-ui-ux-kacey-michaela-solis.webp",
            KASSANDRA_BALONA: "/team/team-ui-ux-kassandra-rychelle-balona.webp",
        },

        WEB_DEVELOPMENT: {
            DANIELLA_SIMARA: "/team/team-web-development-daniella-simara.webp",
            ERWIN_DAGUINOTAS: "/team/team-web-development-erwin-daguinotas.webp",
            GERALD_BERONGOY: "/team/team-web-development-gerald-berongoy.webp",
            RHANDIE_SALES: "/team/team-web-development-rhandie-sales-jr.webp",
        },
    },

    // ─── Partners ─────────────────────────────────────────────────────────────────
    PARTNERS: {
        ACADARENA: "/partners/partner-acadarena.webp",
        DATACAMP: "/partners/partner-datacamp.webp",
        YSPACE: "/partners/partner-yspace.webp",
        POCKY: "/partners/partner-pocky.webp",
        PLDT: "/partners/partner-pldt.webp",
        GLOBE: "/partners/partner-globe.webp",
        MOUNTAIN_DEW: "/partners/partner-mountain-dew.webp",
        WHITECLOAK: "/partners/partner-whitecloak.webp",
        FLOWERSTORE: "/partners/partner-flowerstore.webp",
        POTICO: "/partners/partner-potico.webp",
        V0: "/partners/partner-v0.webp",
        HEY_ROOMIE: "/partners/partner-hey-roomie.webp",
        HOMEROOM: "/partners/partner-homeroom.webp",
        GEN_AI_PH: "/partners/partner-gen-ai-ph.webp",
        /** Cirby sticker mascot shown in the CTA card */
        CIRBY_STICKER: "/partners/partner-cirby-sticker.webp",
    },

    // ─── Auth ─────────────────────────────────────────────────────────────────────
    AUTH: {
        SPARKY: "/auth/auth-sparky.webp",
        AVATAR_DEFAULT: "/auth/auth-avatar-default.webp",
        SIGNIN_LOGO: "/auth/auth-signin-logo.webp",
        SIGNIN_HORIZON: "/auth/auth-signin-horizon.webp",
    },
} as const;

/** Convenience type for any value in the ASSETS tree */
export type AssetPath = string;
