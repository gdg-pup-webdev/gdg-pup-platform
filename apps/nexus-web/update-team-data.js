import fs from 'fs';

const filePath = 'apps/nexus-web/src/features/products/components/team-structure-section/team-members.data.ts';
let content = fs.readFileSync(filePath, 'utf-8');

const replacements = [
  // TeamMember type
  { search: 'mascotSrc: string;', replace: 'mascotSrc: string;\n  row?: number;' },

  // UI/UX (All row 1)
  { search: 'name: "Jedia Nicole Sagun",\n      role: "UI/UX Lead",', replace: 'name: "Jedia Nicole Sagun",\n      role: "UI/UX Lead",\n      row: 1,' },
  { search: 'name: "Kassandra Rychelle Balona",\n      role: "UI/UX Co Lead",', replace: 'name: "Kassandra Rychelle Balona",\n      role: "UI/UX Co Lead",\n      row: 1,' },
  { search: 'name: "Joyrel Baladjay",\n      role: "UI/UX Learning Head Committee",', replace: 'name: "Joyrel Baladjay",\n      role: "UI/UX Learning Head Committee",\n      row: 1,' },
  { search: 'name: "Kacey Michaela Solis",\n      role: "UI/UX Learning Head Committee",', replace: 'name: "Kacey Michaela Solis",\n      role: "UI/UX Learning Head Committee",\n      row: 1,' },

  // Web Dev (All row 1)
  { search: 'name: "Erwin Daguinotas",\n      role: "Web Development Lead",', replace: 'name: "Erwin Daguinotas",\n      role: "Web Development Lead",\n      row: 1,' },
  { search: 'name: "Rhandie Sales Jr.",\n      role: "Web Development Co Lead",', replace: 'name: "Rhandie Sales Jr.",\n      role: "Web Development Co Lead",\n      row: 1,' },
  { search: 'name: "Daniella Simara",\n      role: "Web Development Learning Head Committee",', replace: 'name: "Daniella Simara",\n      role: "Web Development Learning Head Committee",\n      row: 1,' },
  { search: 'name: "Gerald Berongoy",\n      role: "Web Development Learning Head Committee",', replace: 'name: "Gerald Berongoy",\n      role: "Web Development Learning Head Committee",\n      row: 1,' },

  // Cybersecurity (All row 1)
  { search: 'name: "Clarisse Jem Salazar",\n      role: "Cybersecurity Lead",', replace: 'name: "Clarisse Jem Salazar",\n      role: "Cybersecurity Lead",\n      row: 1,' },
  { search: 'name: "John Victor Claudio Duatin",\n      role: "Cybersecurity Co-Lead",', replace: 'name: "John Victor Claudio Duatin",\n      role: "Cybersecurity Co-Lead",\n      row: 1,' },
  { search: 'name: "Salvador Vincent Javier",\n      role: "Cybersecurity Learning Head Committee",', replace: 'name: "Salvador Vincent Javier",\n      role: "Cybersecurity Learning Head Committee",\n      row: 1,' },
  { search: 'name: "Emmanuel Mutas",\n      role: "Cybersecurity Learning Head Committee",', replace: 'name: "Emmanuel Mutas",\n      role: "Cybersecurity Learning Head Committee",\n      row: 1,' },

  // Cloud Solutions (All row 1)
  { search: 'name: "Kyla Marie Agapito",\n      role: "Cloud Solutions Lead",', replace: 'name: "Kyla Marie Agapito",\n      role: "Cloud Solutions Lead",\n      row: 1,' },
  { search: 'name: "James Gabriele Torzar",\n      role: "Cloud Solutions Co-Lead",', replace: 'name: "James Gabriele Torzar",\n      role: "Cloud Solutions Co-Lead",\n      row: 1,' },
  { search: 'name: "Justin Royse Solomon",\n      role: "Cloud Solutions Learning Head Committee",', replace: 'name: "Justin Royse Solomon",\n      role: "Cloud Solutions Learning Head Committee",\n      row: 1,' },
  { search: 'name: "Raphael Johnathan Flores",\n      role: "Cloud Solutions Learning Head Committee",', replace: 'name: "Raphael Johnathan Flores",\n      role: "Cloud Solutions Learning Head Committee",\n      row: 1,' },

  // Project Management (All row 1)
  { search: 'name: "Patricia Anne Panlilio",\n      role: "Project Management Lead",', replace: 'name: "Patricia Anne Panlilio",\n      role: "Project Management Lead",\n      row: 1,' },
  { search: 'name: "Lance Gabriel P. Vargas",\n      role: "Project Management Co-Lead",', replace: 'name: "Lance Gabriel P. Vargas",\n      role: "Project Management Co-Lead",\n      row: 1,' },
  { search: 'name: "Trishia Sai Mejia",\n      role: "Project Management Co-Lead",', replace: 'name: "Trishia Sai Mejia",\n      role: "Project Management Co-Lead",\n      row: 1,' },
  { search: 'name: "Abielle Viktoria Dig",\n      role: "Project Management Secretary",', replace: 'name: "Abielle Viktoria Dig",\n      role: "Project Management Secretary",\n      row: 1,' },

  // Administrative
  { search: 'name: "Shunrenn Locaylocay",\n      role: "Chief Executive Officer (CEO)",', replace: 'name: "Shunrenn Locaylocay",\n      role: "Chief Executive Officer (CEO)",\n      row: 1,' },
  { search: 'name: "Randy Carlo Lorenzo",\n      role: "Chapter Lead and President",', replace: 'name: "Randy Carlo Lorenzo",\n      role: "Chapter Lead and President",\n      row: 1,' },
  { search: 'name: "Syruz Ken Domingo",\n      role: "Chief Secretariat (CSec)",', replace: 'name: "Syruz Ken Domingo",\n      role: "Chief Secretariat (CSec)",\n      row: 2,' },
  { search: 'name: "Kurt Lopez",\n      role: "Deputy Chief Secretariat (DCSec)",', replace: 'name: "Kurt Lopez",\n      role: "Deputy Chief Secretariat (DCSec)",\n      row: 2,' },
  { search: 'name: "Cathyren Sacatani",\n      role: "Chief Finance Officer (CFO)",', replace: 'name: "Cathyren Sacatani",\n      role: "Chief Finance Officer (CFO)",\n      row: 3,' },
  { search: 'name: "Irah Markeisha Jose",\n      role: "Deputy Chief Finance Officer (DCFO)",', replace: 'name: "Irah Markeisha Jose",\n      role: "Deputy Chief Finance Officer (DCFO)",\n      row: 3,' },
  { search: 'name: "Maryrose Marquez",\n      role: "Treasurer",', replace: 'name: "Maryrose Marquez",\n      role: "Treasurer",\n      row: 4,' },
  { search: 'name: "Francis Jason Chuaunsu",\n      role: "Manegerial Consultant",', replace: 'name: "Francis Jason Chuaunsu",\n      role: "Manegerial Consultant",\n      row: 4,' },

  // Marketing
  { search: 'name: "Gianne Crizzle Dasco",\n      role: "Chief Marketing Officer (CMO)",', replace: 'name: "Gianne Crizzle Dasco",\n      role: "Chief Marketing Officer (CMO)",\n      row: 1,' },
  { search: 'name: "Viviene Tricia Rabano",\n      role: "Deputy Chief Marketing Officer (DCMO)",', replace: 'name: "Viviene Tricia Rabano",\n      role: "Deputy Chief Marketing Officer (DCMO)",\n      row: 1,' },
  { search: 'name: "Victoria Estilong Balgos",\n      role: "Social Media Manager Lead",', replace: 'name: "Victoria Estilong Balgos",\n      role: "Social Media Manager Lead",\n      row: 2,' },
  { search: 'name: "David Monterde Gabriel Jr.",\n      role: "Social Media Manager Co-lead",', replace: 'name: "David Monterde Gabriel Jr.",\n      role: "Social Media Manager Co-lead",\n      row: 2,' },
  { search: 'name: "Charles Matthew Pacuan",\n      role: "Social Media Manager Co-lead",', replace: 'name: "Charles Matthew Pacuan",\n      role: "Social Media Manager Co-lead",\n      row: 2,' },
  { search: 'name: "Jade Shana Emit Naig",\n      role: "Content Writer Lead",', replace: 'name: "Jade Shana Emit Naig",\n      role: "Content Writer Lead",\n      row: 3,' },
  { search: 'name: "Ethaniel Klymore Sales",\n      role: "Content Writer Co-lead",', replace: 'name: "Ethaniel Klymore Sales",\n      role: "Content Writer Co-lead",\n      row: 3,' },
  { search: 'name: "Emmanuel Andrei Basco",\n      role: "Content Calendar Manager Lead",', replace: 'name: "Emmanuel Andrei Basco",\n      role: "Content Calendar Manager Lead",\n      row: 4,' },
  { search: 'name: "Clarissa Jasmine Dela Cruz",\n      role: "Content Manager Co-lead",', replace: 'name: "Clarissa Jasmine Dela Cruz",\n      role: "Content Manager Co-lead",\n      row: 4,' },
  { search: 'name: "Marky Cortezo",\n      role: "Content Creation Lead",', replace: 'name: "Marky Cortezo",\n      role: "Content Creation Lead",\n      row: 4,' },

  // Creatives
  { search: 'name: "Ayen Mejorada",\n      role: "Chief Creatives Officer (CCO)",', replace: 'name: "Ayen Mejorada",\n      role: "Chief Creatives Officer (CCO)",\n      row: 1,' },
  { search: 'name: "Hesed Suñga",\n      role: "Deputy Chief Creatives Officer (DCCO)",', replace: 'name: "Hesed Suñga",\n      role: "Deputy Chief Creatives Officer (DCCO)",\n      row: 1,' },
  { search: 'name: "Alecza Patrice Bonifacio",\n      role: "Branding & Assets Lead",', replace: 'name: "Alecza Patrice Bonifacio",\n      role: "Branding & Assets Lead",\n      row: 2,' },
  { search: 'name: "Cyruz Cordero Arcan",\n      role: "Branding & Assets Co-Lead",', replace: 'name: "Cyruz Cordero Arcan",\n      role: "Branding & Assets Co-Lead",\n      row: 2,' },
  { search: 'name: "Daniella J. Mendoza",\n      role: "Graphic Design Lead",', replace: 'name: "Daniella J. Mendoza",\n      role: "Graphic Design Lead",\n      row: 3,' },
  { search: 'name: "Matthew Erivera Cucio",\n      role: "Audio & Visuals Lead",', replace: 'name: "Matthew Erivera Cucio",\n      role: "Audio & Visuals Lead",\n      row: 3,' },

  // Operations
  { search: 'name: "Elija Cabaddu",\n      role: "Chief Operations Officer (COO)",', replace: 'name: "Elija Cabaddu",\n      role: "Chief Operations Officer (COO)",\n      row: 1,' },
  { search: 'name: "Aifah Mae Maddie",\n      role: "Deputy Chief Operations Officer (DCOO)",', replace: 'name: "Aifah Mae Maddie",\n      role: "Deputy Chief Operations Officer (DCOO)",\n      row: 1,' },
  { search: 'name: "Jinrikisha Omela",\n      role: "Technicals Lead",', replace: 'name: "Jinrikisha Omela",\n      role: "Technicals Lead",\n      row: 2,' },
  { search: 'name: "Danielle Pauleen Labasa",\n      role: "Technicals Co Lead",', replace: 'name: "Danielle Pauleen Labasa",\n      role: "Technicals Co Lead",\n      row: 2,' },
  { search: 'name: "Charles Lalata",\n      role: "Technicals Senior Lead",', replace: 'name: "Charles Lalata",\n      role: "Technicals Senior Lead",\n      row: 3,' },
  { search: 'name: "Eugene Gonzaga",\n      role: "Technicals Junior Lead",', replace: 'name: "Eugene Gonzaga",\n      role: "Technicals Junior Lead",\n      row: 3,' },
  { search: 'name: "Maria Angeline Aguirre",\n      role: "Programs Lead",', replace: 'name: "Maria Angeline Aguirre",\n      role: "Programs Lead",\n      row: 4,' },
  { search: 'name: "Jade Micah Lazaro",\n      role: "Programs Co-Lead",', replace: 'name: "Jade Micah Lazaro",\n      role: "Programs Co-Lead",\n      row: 4,' },
  { search: 'name: "Kishey Ibañez",\n      role: "Logistics Lead",', replace: 'name: "Kishey Ibañez",\n      role: "Logistics Lead",\n      row: 5,' },
  { search: 'name: "Alessa Estaras",\n      role: "Logistics Co-lead",', replace: 'name: "Alessa Estaras",\n      role: "Logistics Co-lead",\n      row: 5,' },
  { search: 'name: "Hans Ezekiel Naperi",\n      role: "Documentations Lead",', replace: 'name: "Hans Ezekiel Naperi",\n      role: "Documentations Lead",\n      row: 6,' },
  { search: 'name: "Cali Dominic Ranjo",\n      role: "Documentations Co-lead",', replace: 'name: "Cali Dominic Ranjo",\n      role: "Documentations Co-lead",\n      row: 6,' },

  // Community Relations
  { search: 'name: "Solomon Nadonga",\n      role: "Chief Community Relations Officer (CCRO)",', replace: 'name: "Solomon Nadonga",\n      role: "Chief Community Relations Officer (CCRO)",\n      row: 1,' },
  { search: 'name: "Railley Nieles",\n      role: "Deputy Chief Community Relations Officer (DCCRO)",', replace: 'name: "Railley Nieles",\n      role: "Deputy Chief Community Relations Officer (DCCRO)",\n      row: 1,' },
  { search: 'name: "Raymund Jr. Dimacutac",\n      role: "Student Development Lead",', replace: 'name: "Raymund Jr. Dimacutac",\n      role: "Student Development Lead",\n      row: 2,' },
  { search: 'name: "Gerick Eol Hernandez ",\n      role: "Student Development Co-Lead",', replace: 'name: "Gerick Eol Hernandez ",\n      role: "Student Development Co-Lead",\n      row: 2,' },
  { search: 'name: "Troy Lauren Lazaro",\n      role: "Talent Development Lead",', replace: 'name: "Troy Lauren Lazaro",\n      role: "Talent Development Lead",\n      row: 3,' },
  { search: 'name: "Erica Mae Mallari",\n      role: "Talent Development Co-Lead",', replace: 'name: "Erica Mae Mallari",\n      role: "Talent Development Co-Lead",\n      row: 3,' },
  { search: 'name: "Marianne Mae Bautista",\n      role: "Community Relations Consultant",', replace: 'name: "Marianne Mae Bautista",\n      role: "Community Relations Consultant",\n      row: 3,' },
];

let failed = [];
for (const r of replacements) {
  if (content.includes(r.search)) {
    content = content.replace(r.search, r.replace);
  } else {
    failed.push(r.search);
  }
}

fs.writeFileSync(filePath, content);
if (failed.length > 0) {
  console.log("Failed to replace:", failed);
} else {
  console.log("Successfully updated team-members.data.ts");
}
