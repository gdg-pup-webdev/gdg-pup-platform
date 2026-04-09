export interface TeamContentEntry {
  title: string;
  description: string;
}

export interface TeamContent {
  /** About the Team card description (plain text). */
  description: string;
  /** Optional bullet points appended after the description paragraph. */
  descriptionBullets?: string[];
  /** Tailwind text-color class for the highlighted team name in the description. */
  nameColor: string;
  /** Optional full display name for the team name highlight (e.g. "Internet of Things (IoT) Team"). Defaults to "{teamName} Team". */
  displayName?: string;
  /** Pill labels shown in the About the Team card. */
  categories: string[];

  // Member Level dropdown
  /** Preferred flexible shape for one or more member-level entries. */
  memberLevels?: TeamContentEntry[];
  memberLevelTitle?: string;
  memberLevelDescription?: string;
  memberLevelSecondaryTitle?: string;
  memberLevelSecondaryDescription?: string;
  memberLevelTertiaryTitle?: string;
  memberLevelTertiaryDescription?: string;
  memberLevelQuaternaryTitle?: string;
  memberLevelQuaternaryDescription?: string;
  memberLevelQuinaryTitle?: string;
  memberLevelQuinaryDescription?: string;
  memberLevelSenaryTitle?: string;
  memberLevelSenaryDescription?: string;

  // Support Group dropdown
  /** Preferred flexible shape for one or more support-group entries. */
  supportGroups?: TeamContentEntry[];
  supportGroupTitle?: string;
  supportGroupDescription?: string;
  supportGroupSecondaryTitle?: string;
  supportGroupSecondaryDescription?: string;
  supportGroupTertiaryTitle?: string;
  supportGroupTertiaryDescription?: string;
  supportGroupQuaternaryTitle?: string;
  supportGroupQuaternaryDescription?: string;
}

export const TEAM_CONTENT: Record<string, TeamContent> = {
  "ui-ux": {
    description:
      "The UI/UX Team focuses on creating intuitive and engaging user interfaces and experiences for digital products. Members of this team will work on designing user-centric interfaces, conducting usability testing, and creating wireframes and prototypes. Throughout the term, they will gain experience in design tools and methodologies, ensuring that the software and applications developed are not only functional but also visually appealing and easy to use.",
    nameColor: "text-yellow-400",
    categories: ["UI Design", "UX Research", "Prototyping"],

    memberLevelTitle: "Senior UI/UX Designer",
    memberLevelDescription:
      "A leadership role that demonstrates skills not just in UI/UX expertise, but also in team management. It involves having direct access to early stages of project planning and contributing to key decisions within the team. Also, responsible for providing decisive feedback and design critique to Junior Designers and Cadets to ensure deliverables meet professional standards and brand guidelines during peer-to-peer revalidation within the team.",
    memberLevelSecondaryTitle: "Junior UI/UX Designer",
    memberLevelSecondaryDescription:
      "An intermediate role that can lead to mini design tasks and mentor cadet designers. Possesses solid UI/UX knowledge and proficiency in design tools. Leads mini-design tasks and mentors the UI/UX Cadets.",
    memberLevelTertiaryTitle: "UI/UX Cadet",
    memberLevelTertiaryDescription:
      "The UI/UX Cadets are members of the Technology Department who learn and contribute to creating user-friendly and visually appealing designs. Cadets gain hands-on experience in making wireframes, digital assets, and planning designs, collaborating with the Software Development cadets to support software projects.",
    supportGroupTitle: "Program Analyst",
    supportGroupDescription:
      "Leads workshop facilitation through hosting, interactive activities, and engaging discussions, while also handling media and design by creating visuals for presentations, announcements, and overall workshop experiences.",
    supportGroupSecondaryTitle: "Compliance Analyst",
    supportGroupSecondaryDescription:
      "Manages attendance, documentation, and platform resources, while also overseeing operational needs such as tracking systems, and creating and handling pre- and post-surveys to ensure smooth program delivery.",
    supportGroupTertiaryTitle: "Curriculum Analyst",
    supportGroupTertiaryDescription:
      "Oversees research, content creation, and resource gathering, ensuring learning materials are clear, accurate, and accessible, while also preparing contingency plans, evaluating content, and compiling feedback to drive continuous improvement.",
  },

  "web-development": {
    description:
      "The Web Development Team focuses on building and maintaining high-quality, responsive, and functional web applications that align with organizational objectives. Members of this team will be involved in backend, frontend, or full-stack development, working with modern frameworks and tools to implement features and ensure seamless performance. Throughout the term, they will gain hands-on experience in coding, debugging, testing, and deploying web-based solutions that meet real-world needs.",
    nameColor: "text-sky-400",
    categories: ["Frontend Development", "Backend Development", "Full-Stack Integration"],

    memberLevelTitle: "Web Development Cadet",
    memberLevelDescription:
      "The Web Development Cadets are members of the Technology Department who learn and contribute to building high-quality software solutions. Cadets gain hands-on experience in backend, frontend, or full-stack development for web and mobile platforms while collaborating with other cadets on real projects.",
    supportGroupTitle: "Program Analyst",
    supportGroupDescription:
      "Organizes workshops, study jams, and hackathons to enhance both technical and soft skills. Ensures an active, engaging, and growth-oriented team environment.",
    supportGroupSecondaryTitle: "Compliance Analyst",
    supportGroupSecondaryDescription:
      "Maintains ethical standards and documentation integrity. Oversees governance, ensures compliance with policies, and promotes transparency across all projects.",
    supportGroupTertiaryTitle: "Curriculum Analyst",
    supportGroupTertiaryDescription:
      "Designs the team’s learning roadmap, lessons, and progress tracking. Curates resources that build solid technical foundations and structured skill growth.",
    supportGroupQuaternaryTitle: "Backend/Frontend Head",
    supportGroupQuaternaryDescription:
      "Leads the web development team in creating and maintaining websites. Guides members in coding, project workflows, and problem-solving while mentoring them to improve their skills and deliver quality, secure outputs.",
  },

  cybersecurity: {
    description:
      "The Cybersecurity Team is involved in the practice of protecting systems, networks, and data from digital threats. Members will dive into topics such as ethical hacking, threat detection, and implementing security protocols to safeguard applications and infrastructure. They will work on projects related to security analysis, incident response, and developing strategies to mitigate cyber risks.",
    nameColor: "text-green-400",
    categories: ["Threat Detection", "Encryption & Data Protection", "Risk Assessment"],

    memberLevelTitle: "Cybersecurity Cadet",
    memberLevelDescription:
      "The Cybersecurity Cadets are members of the Technology Department who learn and contribute to protecting digital assets and infrastructure. Cadets gain hands-on experience in security practices and may collaborate with Software Development, Game Development, and Cloud Engineering cadets to support organizational projects.",
    supportGroupTitle: "Compliance Analyst",
    supportGroupDescription:
      "Ensures active participation in sessions and workshops by tracking attendance, following up with non-participating members, and regularly requesting updates to foster engagement. They manage and oversee the distribution of class materials, set up assignments, organize resources, and enforce guidelines to ensure alignment with project goals.",
    supportGroupSecondaryTitle: "Curriculum Analyst",
    supportGroupSecondaryDescription:
      "Develops educational content, including roadmaps and training materials, to provide structured and effective skill-building for team members. They outline key session topics, assess content depth, and may also serve as session speakers. After each session, they provide comprehensive notes, distribute educational content to team members, and work closely with the Program Analyst on presentation materials.",
  },

  "data-ml": {
    description:
      "The Data and Machine Learning Team focuses on the collection, processing, and analysis of data to extract insights and develop intelligent systems. Members of this team will work on data-driven projects, applying machine learning algorithms to solve real-world problems. They will engage in tasks such as data cleaning, model training, and evaluating the performance of machine learning models, gaining hands-on experience with tools and frameworks commonly used in the industry.",
    nameColor: "text-sky-400",
    categories: ["Data Analysis", "Model Training", "Artificial Intelligence"],

    memberLevelTitle: "Data & ML Cadet",
    memberLevelDescription:
      "The Data & ML Cadets are members of the Technology Department who learn and contribute to building data-driven solutions that support organizational goals. Cadets gain hands-on experience and collaborate in the fields of data science, artificial intelligence, and machine learning, developing skills through practical projects and teamwork.",
    memberLevelSecondaryTitle: "Data & ML Lead",
    
    memberLevelTertiaryTitle: "Data Engineering Team",
    memberLevelTertiaryDescription: "Members will focus on building robust data pipelines, including web scraping, data collection, and the development of ETL (Extract, Transform, Load) and ELT (Extract, Load, Transform) pipelines using tools such as SQL and workflow orchestrators like Apache Airflow to ensure data is reliable and ready for analysis and model training.",
    memberLevelQuaternaryTitle: "Data Analytics Team",
    memberLevelQuaternaryDescription: "Members will focus on data storytelling, modeling (star/snowflake schemas), and craft interactive dashboards using SQL, Python (pandas, seaborn), and visualization platforms like Power BI and Tableau to support informed decision-making.",
    memberLevelQuinaryTitle: "Data Science Team",
    memberLevelQuinaryDescription: "Members will apply statistical models and advanced analytics to extract insights from complex data. They design experiments, perform regression and feature engineering, and build prescriptive models using Python (scikit-learn) in Jupyter or Colab environments to produce actionable recommendations.",
    memberLevelSenaryTitle: "Machine Learning Team",
    memberLevelSenaryDescription: "Members will design, train, and deploy machine learning models for intelligent automation, prediction, and classification. They explore advanced areas such as natural language processing and image recognition, and practice MLOps and model deployment using TensorFlow, PyTorch, FastAPI/Flask, and containerization tools like Docker.",

    supportGroupTitle: "Program Analyst",
    supportGroupDescription:
      "Organizes workshops, study jams, and hackathons to enhance both technical and soft skills. Ensures an active, engaging, and growth-oriented team environment.",
    supportGroupSecondaryTitle: "Compliance Analyst",
    supportGroupSecondaryDescription:
      "Maintains ethical standards and documentation integrity. Oversees governance, ensures compliance with policies, and promotes transparency across all projects.",
    supportGroupTertiaryTitle: "Curriculum Analyst",
    supportGroupTertiaryDescription:
      "Designs the team’s learning roadmap, lessons, and progress tracking. Curates resources that build solid technical foundations and structured skill growth.",
    supportGroupQuaternaryTitle: "Product Analyst",
    supportGroupQuaternaryDescription: "Transforms ideas into impactful projects—developing dashboards, ML tools, and data applications that align with organizational goals and showcase team innovation.",
    },

  iot: {
    description:
      "The Internet of Things (IoT) Team dedicates the design, development, and implementation of interconnected systems that bridge the digital and physical worlds. Members of this team will engage in every stage of IoT solution development—from conceptualizing device integrations and designing smart system architectures to coding, testing, and deploying functional prototypes. They will explore topics such as sensor technologies, data communication, automation, and real-time monitoring to create innovative and efficient IoT applications that enhance everyday experiences.",
    nameColor: "text-red-500",
    displayName: "Internet of Things (IoT) Team",
    categories: ["Embedded Systems", "Sensor & Device Integration", "Network Communication"],

    memberLevelTitle: "IoT Cadet",
    memberLevelDescription:
      "The IoT Cadets are members of the Technology Department who learn and contribute to turning creative ideas into real, functional prototypes. By combining electronics, coding, and mechanical design, cadets gain hands-on experience building smart systems and automated solutions that connect the digital and physical worlds. This is a space for cadets who love to tinker, experiment, and solve problems through practical engineering.",
    supportGroupTitle: "Compliance Analyst",
    supportGroupDescription:
      "Maintains ethical standards and documentation integrity. Oversees governance, ensures compliance with policies, and promotes transparency across all projects.",
    supportGroupSecondaryTitle: "Curriculum Analyst",
    supportGroupSecondaryDescription:
      "Designs the team’s learning roadmap, lessons, and progress tracking. Curates resources that build solid technical foundations and structured skill growth.",
  },

  "cloud-solutions": {
    description:
      "The Cloud Solutions Team is involved with the process of managing and provisioning cloud infrastructure, services, and applications. To optimize, operate, and sustain cloud infrastructure, members will be completely immersed in cloud environments, particularly through the Google Cloud Platform (GCP). They will be tasked with deploying scalable applications, automating infrastructure, and implementing best practices for cloud security and cost management.",
    nameColor: "text-red-500",
    categories: ["Cloud Infrastructure", "Scalability & Deployment", "DevOps & Automation"],

    memberLevelTitle: "Cloud Solutions Cadet",
    memberLevelDescription:
      "The Cloud Solutions Cadets are members of the Technology Department who focus on learning and contributing to the development and management of scalable cloud solutions using the Google Cloud Platform.",  

    supportGroupTitle: "Program Analyst",
    supportGroupDescription:
      "Responsible for planning and conceptualizing workshops and programs that engage participants and meet departmental goals. They work closely with Curriculum Analysts to create PowerPoint presentations based on provided materials or speaker content, ensuring consistency by using a designated template. The Program Analyst also issues certificates upon program completion, coordinates the smooth delivery of content, and maintains communication throughout the workshops.",
    supportGroupSecondaryTitle: "Compliance Analyst",
    supportGroupSecondaryDescription:
      "Ensures active participation in sessions and workshops by tracking attendance, following up with non-participating members, and regularly requesting updates to foster engagement. They manage and oversee the distribution of class materials, set up assignments, organize resources, and enforce guidelines to ensure alignment with project goals and compliance with tasks established by the Project Analyst.",
    supportGroupTertiaryTitle: "Curriculum Analyst",
    supportGroupTertiaryDescription: "Researches study jam materials to provide structured and effective skill-building for the cadets. They outline key session topics, assess content depth, and may also serve as session speakers. They work closely with the Program Analyst on creating the presentation materials.",
  
  },

  "project-management": {
    description:
      "The Project Management Team is not part of the Core Tech Teams but supports them in executing initiatives across the Technology Department.",
    descriptionBullets: [
      "Workflow Coordination: Translates plans from Core Team Leads into actionable timelines and workflows.",
      "Resource & Progress Management: Oversees resources, monitors progress, and ensures tasks are completed on time.",
      "Collaboration Support: Facilitates coordination among tech teams to deliver projects efficiently.",
    ],
    nameColor: "text-green-400",
    categories: ["Planning & Scheduling", "Team Coordination", "Resource Management"],

    memberLevelTitle: "Project Management Lead",
    memberLevelDescription:
      "Leads the Project Management Team by aligning workflows with departmental goals and ensuring resources and timelines are managed effectively. The Lead supports the Core Tech Teams by ensuring the smooth execution of events and initiatives. Key responsibilities include translating plans from Core Team Leads into actionable timelines and workflows, overseeing resources, and monitoring progress to make sure tasks are completed on time.",  
    memberLevelSecondaryTitle: "Project Management Co-Leads",
    memberLevelSecondaryDescription:
      "The Co-Leads support the Lead in project execution across the Technology Department. They help in creating actionable timelines, tracking workflows, and monitoring resource allocation to ensure deadlines are met. In addition, they also collaborate with the Lead in coordinating between Project Management Associates and Tech Team Leads to improve efficiency, resolve blockers, and ensure projects are delivered successfully.",
    memberLevelTertiaryTitle: "Project Management Secretary",
    memberLevelTertiaryDescription:
      "Responsible for ensuring the consolidation of reports, templates, and project records. The role also requires taking accurate minutes during meetings and recording key decisions, ensuring clarity, accountability, and consistency.",
    memberLevelQuaternaryTitle: "Project Management Associates",
    memberLevelQuaternaryDescription:
      "They assist in the planning, execution, and monitoring of the events organized by the Technology Department together with relevant documents, ensuring proper tracking of set deadlines, and updating the progress trackers. Associates are also involved in contributing to relevant reports, evaluations, and post-event documents to support continuous improvement and maintain clear, organized records of activities and outcomes.",
  },

  executives: {
    description:
      "The Executives drive the strategic direction and day-to-day operations of the organization. This team oversees all departments, ensures alignment with the chapter's mission and vision, and represents GDG PUP in external engagements. Executive members develop high-level leadership, communication, and decision-making skills while building a culture of excellence, inclusivity, and innovation across every team.",
    nameColor: "text-yellow-400",
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
