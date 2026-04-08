export interface TeamContent {
  /** About the Team card description (plain text). */
  description: string;
  /** Pill labels shown in the About the Team card. */
  categories: string[];

  // Member Level dropdown
  memberLevelTitle: string;
  memberLevelDescription: string;

  // Support Group dropdown
  supportGroupTitle: string;
  supportGroupDescription: string;
  supportGroupSecondaryTitle: string;
  supportGroupSecondaryDescription: string;
}

export const TEAM_CONTENT: Record<string, TeamContent> = {
  "ui-ux": {
    description:
      "The UI/UX Team focuses on creating intuitive and engaging user interfaces and experiences for digital products. Members of this team will work on designing user-centric interfaces, conducting usability testing, and creating wireframes and prototypes. Throughout the term, they will gain experience in design tools and methodologies, ensuring that the software and applications developed are not only functional but also visually appealing and easy to use.",
    categories: ["UI Design", "UX Research", "Prototyping"],

    memberLevelTitle: "Design Apprentice",
    memberLevelDescription:
      "Design Apprentices are members of the UI/UX Team who learn and contribute to crafting beautiful, user-centred digital experiences. They gain hands-on exposure to industry-standard tools such as Figma, conduct usability tests, and iterate on wireframes and prototypes. This is a space for members who are passionate about the intersection of aesthetics, psychology, and technology.",

    supportGroupTitle: "Compliance Analyst",
    supportGroupDescription:
      "Maintains design ethics and documentation integrity across all UI/UX projects. Oversees governance of design systems, ensures adherence to accessibility standards, and promotes transparency in the team's design decisions.",
    supportGroupSecondaryTitle: "Curriculum Analyst",
    supportGroupSecondaryDescription:
      "Designs the team's learning roadmap, workshops, and skill-building sessions. Curates resources on design principles, tools, and trends to ensure members grow into well-rounded designers.",
  },

  "web-development": {
    description:
      "The Web Development Team builds modern, performant, and accessible web applications for the organization. Members collaborate on full-stack projects using cutting-edge frameworks and tools, translating design mock-ups into pixel-perfect, responsive user interfaces while developing robust server-side logic. Throughout the term, members deepen their expertise in front-end and back-end technologies, version control workflows, and agile development practices.",
    categories: ["Frontend", "Backend", "Full-Stack"],

    memberLevelTitle: "Web Dev Cadet",
    memberLevelDescription:
      "Web Dev Cadets are members of the Web Development Team who learn and contribute to building full-stack web projects. They gain practical experience with frameworks such as React and Next.js, RESTful API design, and database integration. This is a space for members who love turning ideas into functional, beautiful, and accessible web experiences.",

    supportGroupTitle: "Compliance Analyst",
    supportGroupDescription:
      "Maintains code quality standards and documentation integrity across all web projects. Oversees governance of coding conventions, ensures adherence to security best practices, and promotes transparency in technical decisions.",
    supportGroupSecondaryTitle: "Curriculum Analyst",
    supportGroupSecondaryDescription:
      "Designs the team's learning roadmap, coding challenges, and mentorship sessions. Curates resources on web technologies, best practices, and career pathways to support the growth of every team member.",
  },

  cybersecurity: {
    description:
      "The Cybersecurity Team is involved in the practice of protecting systems, networks, and data from digital threats. Members will dive into topics such as ethical hacking, threat detection, and implementing security protocols to safeguard applications and infrastructure. They will work on projects related to security analysis, incident response, and developing strategies to mitigate cyber risks.",
    categories: ["Threat Detection", "Encryption & Data Protection", "Risk Assessment"],

    memberLevelTitle: "Security Cadet",
    memberLevelDescription:
      "Security Cadets are members of the Cybersecurity Team who learn and contribute to defending digital systems. They tackle CTF challenges, explore vulnerability assessment tools, and study attack-and-defense methodologies in a safe, controlled environment. This is a space for curious minds who want to understand how systems can be secured—and how attackers think.",

    supportGroupTitle: "Compliance Analyst",
    supportGroupDescription:
      "Maintains ethical standards and documentation integrity across all cybersecurity activities. Oversees governance of responsible disclosure practices, ensures compliance with legal and organizational policies, and promotes a culture of accountability.",
    supportGroupSecondaryTitle: "Curriculum Analyst",
    supportGroupSecondaryDescription:
      "Designs the team's learning roadmap, lab exercises, and skill-building sessions. Curates resources on cybersecurity frameworks, tools, and industry certifications to guide members toward professional readiness.",
  },

  "data-ml": {
    description:
      "The Data and Machine Learning Team focuses on the collection, processing, and analysis of data to extract insights and develop intelligent systems. Members of this team will work on data-driven projects, applying machine learning algorithms to solve real-world problems. They will engage in tasks such as data cleaning, model training, and evaluating the performance of machine learning models, gaining hands-on experience with tools and frameworks commonly used in the industry.",
    categories: ["Data Analysis", "Model Training", "Artificial Intelligence"],

    memberLevelTitle: "Data Cadet",
    memberLevelDescription:
      "Data Cadets are members of the Data & ML Team who learn and contribute to exploring the world of data and artificial intelligence. They work with structured and unstructured datasets, experiment with popular ML frameworks such as scikit-learn and TensorFlow, and present findings through data visualizations. This is a space for members passionate about uncovering patterns and building intelligent systems.",

    supportGroupTitle: "Compliance Analyst",
    supportGroupDescription:
      "Maintains data ethics and documentation integrity across all Data & ML projects. Oversees governance of data handling practices, ensures compliance with privacy regulations, and promotes transparency in model decisions and research outputs.",
    supportGroupSecondaryTitle: "Curriculum Analyst",
    supportGroupSecondaryDescription:
      "Designs the team's learning roadmap, tutorials, and workshops. Curates resources on statistics, ML algorithms, and data engineering to build a strong foundation for every team member.",
  },

  iot: {
    description:
      "The Internet of Things (IoT) Team dedicates the design, development, and implementation of interconnected systems that bridge the digital and physical worlds. Members of this team will engage in every stage of IoT solution development—from conceptualizing device integrations and designing smart system architectures to coding, testing, and deploying functional prototypes. They will explore topics such as sensor technologies, data communication, automation, and real-time monitoring to create innovative and efficient IoT applications that enhance everyday experiences.",
    categories: ["Embedded Systems", "Sensor & Device Integration", "Network Communication"],

    memberLevelTitle: "IoT Cadet",
    memberLevelDescription:
      "IoT Cadets are members of the Technology Department who learn and contribute to turning creative ideas into real, functional prototypes. By combining electronics, coding, and mechanical design, cadets gain hands-on experience building smart systems and automated solutions that connect the digital and physical worlds. This is a space for cadets who love to tinker, experiment, and solve problems through practical engineering.",

    supportGroupTitle: "Compliance Analyst",
    supportGroupDescription:
      "Maintains ethical standards and documentation integrity. Oversees governance, ensures compliance with policies, and promotes transparency across all projects.",
    supportGroupSecondaryTitle: "Curriculum Analyst",
    supportGroupSecondaryDescription:
      "Designs the team's learning roadmap, lessons, and progress tracking. Curates resources that build solid technical foundations and structured skill growth.",
  },

  "cloud-solutions": {
    description:
      "The Cloud Solutions Team equips members with the skills to design, deploy, and manage scalable infrastructure on leading cloud platforms. Members work on real cloud projects involving serverless computing, containerization, CI/CD pipelines, and cloud-native architectures. Throughout the term, they gain practical exposure to platforms such as Google Cloud, preparing them for industry certifications and modern DevOps roles.",
    categories: ["Cloud Infrastructure", "DevOps", "Serverless"],

    memberLevelTitle: "Cloud Cadet",
    memberLevelDescription:
      "Cloud Cadets are members of the Cloud Solutions Team who learn and contribute to deploying and managing cloud-based systems. They explore services across compute, storage, networking, and security on platforms like Google Cloud while applying DevOps practices such as CI/CD and infrastructure-as-code. This is a space for members who want to build the backbone of modern software at scale.",

    supportGroupTitle: "Compliance Analyst",
    supportGroupDescription:
      "Maintains cloud governance standards and documentation integrity across all projects. Oversees adherence to security policies, cost management best practices, and regulatory compliance, ensuring every deployment meets organizational and industry standards.",
    supportGroupSecondaryTitle: "Curriculum Analyst",
    supportGroupSecondaryDescription:
      "Designs the team's learning roadmap, labs, and certification preparation materials. Curates resources on cloud architecture, cost optimization, and platform-specific tooling to guide members toward cloud expertise.",
  },

  "project-management": {
    description:
      "The Project Management Team drives the planning, coordination, and successful delivery of the organization's initiatives. Members learn to lead cross-functional teams, manage timelines and resources, and apply agile methodologies to keep projects on track. Throughout the term, they develop essential leadership, communication, and strategic thinking skills that are critical for turning ideas into impactful outcomes.",
    categories: ["Agile", "Scrum", "Stakeholder Management"],

    memberLevelTitle: "PM Cadet",
    memberLevelDescription:
      "PM Cadets are members of the Project Management Team who learn and contribute to coordinating projects from inception to delivery. They practice sprint planning, backlog grooming, stakeholder communication, and retrospective facilitation — gaining the organizational and leadership skills needed to guide teams effectively. This is a space for members who thrive on structure, collaboration, and driving results.",

    supportGroupTitle: "Compliance Analyst",
    supportGroupDescription:
      "Maintains process standards and documentation integrity across all project management activities. Oversees governance of workflows, ensures adherence to organizational policies, and promotes accountability and transparency in every project.",
    supportGroupSecondaryTitle: "Curriculum Analyst",
    supportGroupSecondaryDescription:
      "Designs the team's learning roadmap, training sessions, and skill-building workshops. Curates resources on project management methodologies, tools, and professional development paths to prepare members for leadership roles.",
  },

  executives: {
    description:
      "The Executives drive the strategic direction and day-to-day operations of the organization. This team oversees all departments, ensures alignment with the chapter's mission and vision, and represents GDG PUP in external engagements. Executive members develop high-level leadership, communication, and decision-making skills while building a culture of excellence, inclusivity, and innovation across every team.",
    categories: ["Leadership", "Strategy", "Operations"],

    memberLevelTitle: "Executive Officer",
    memberLevelDescription:
      "Executive Officers are the core decision-makers of the organization, responsible for setting priorities, leading initiatives, and ensuring each department achieves its goals. They serve as the bridge between internal teams and external stakeholders, championing the chapter's values and fostering a collaborative, high-performance culture.",

    supportGroupTitle: "Compliance Analyst",
    supportGroupDescription:
      "Maintains organizational standards and documentation integrity at the executive level. Oversees governance of policies and bylaws, ensures compliance with institutional requirements, and promotes ethical, transparent leadership across the organization.",
    supportGroupSecondaryTitle: "Curriculum Analyst",
    supportGroupSecondaryDescription:
      "Designs leadership development programs, executive workshops, and organizational learning initiatives. Curates resources that strengthen strategic thinking, communication, and team management skills for current and aspiring leaders.",
  },
};
