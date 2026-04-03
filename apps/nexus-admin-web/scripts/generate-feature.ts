import * as fs from "fs";
import * as path from "path";

// ============================================================================
// Google + Firebase Style Theme
// ============================================================================

const colors = {
  blue: "\x1b[34m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  gray: "\x1b[90m",
  bold: "\x1b[1m",
  reset: "\x1b[0m",
};

function color(text: string, tone: keyof typeof colors) {
  return `${colors[tone]}${text}${colors.reset}`;
}

function googleDots() {
  return (
    color("🔵", "blue") +
    color("🔴", "red") +
    color("🟡", "yellow") +
    color("🟢", "green")
  );
}

// ============================================================================
// ASCII Art Banner
// ============================================================================

const ASCII_ART = `
                                                                   
                                                                   
                                                                   
                                      :+*                         
                                     +::=+*                        
                                    =:::-+++*                      
      *-+*                         +:::--++++*                    
      *:-=++*               @@@     =::---=++++*                  
      +:--===++*     @%*+===####%%%%%#:::---=+++++*                
      =::--======+##-::::::##########%:::----==+++++*              
      =::--====+%*::::::::############=::----=======+              
      -:::--=+%#=::::::::-#############::----=======+              
     *-:::--+##=:::-=+++==-====++++**########*+=====+              
     *-::::=###+=--==+++++++++***++**#########*++++++              
      =:::+=-=+++*++++++++++++**+++**##########++=####*           
      #+-=***+++*++++++++++++**++++***#########*+#####%%          
   #+-+####**++*++++++++++==+*+++++***#########*+######%          
  +=*#####**++**+++++++++::::+++++*****#########+######%%         
 -+#######*+++=:::+++++++:::-:----+****#########+###:-:-:*        
 *=*######*++*=:::-++++==+-===++++*=+***########*=*###*-+-..-#    
  =+#####**++++==========+=+==+++++=+***########%=%######%*:-=@   
  #=*#*****+++==========+++++==+++-=++*#######*#+--+#*%###*:--%   
   #=****+=-===::-==+++*##**+++++++++****##+*===--=+++#%#%=-=#    
    %+**+++====++*#%%%#:::::::-=++++**++++*:-=*%########+#=-:-:#  
     *++++*++++*-*%%%%=:::::::::::-====*=:-==+=#####%%##%###%---% 
      #++++++++:::-==-=:::::::::::::-*::-==+**.=*%%%%%##%##*----% 
           #==+:::::::=:-**-::::::=-.-===+**#- :-+*%##*+------#@  
           @+==-+:::::::::::::::=.:-==+**#*+*#..--=*#######%      
            %*+==:=::::::::::::+-==+******#%%#+.:-+#####**%       
             ##**+=+*+++++++***=+**#***#%#%%#*.-==*####**%        
                %***##****#####*#***#@@%####%::-=##%%*+%          
                   %@%########@**%%########-.:*+*##**%            
                    #**#######%##########-:--=*#*####             
                    *########++***##**++*+=+*##%#****#            
                    @***#*#++++++++*#++***##*++*#***++*    
`;

function showAsciiArt() {
  console.log(color(ASCII_ART, "gray"));
}

// ============================================================================
// Spinner (Firebase Style)
// ============================================================================

const spinnerFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runWithSpinner(label: string) {
  process.stdout.write("   ");

  for (let i = 0; i < 6; i++) {
    const frame = spinnerFrames[i % spinnerFrames.length];
    process.stdout.write(
      `\r   ${color(frame, "yellow")} ${color(label, "gray")}`,
    );
    await sleep(60);
  }

  process.stdout.write(`\r   ${color("⚡", "green")} ${label}\n`);
}

// ============================================================================
// Helper Functions
// ============================================================================

function toPascalCase(str: string): string {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

function isValidFeatureName(name: string): boolean {
  return /^[a-z]+(-[a-z]+)*$/.test(name);
}

// ============================================================================
// CLI Messages (UNCHANGED TEXT)
// ============================================================================

function showUsage(): void {
  console.log(
    color(
      `
⚡🐶 Sparky needs a feature name!

Usage: pnpm run g <feature-name>
Example: pnpm run g user-profile

Feature names must be in kebab-case (lowercase with hyphens)
Valid examples: user, user-profile, card-activation
Invalid examples: UserProfile, user_profile, 123user

Sparky believes in clean architecture and clean naming. Tularan si Sparky.
      `.trim(),
      "yellow",
    ),
  );
}

function showInvalidNameError(name: string): void {
  console.log(
    color(
      `
⚡🐶 Sparky inspected '${name}'...

Feature names must be in kebab-case (lowercase with hyphens)
Examples: user-profile, card-activation, event-gallery

Umulit ka!
      `.trim(),
      "red",
    ),
  );
}

function showDuplicateError(name: string, location: string): void {
  console.log(
    color(
      `
⚡🐶 Sparky sniffed around and found something...

Feature '${name}' already exists.

📌 Location: ${location}.

Umulit ka!
      `.trim(),
      "red",
    ),
  );
}

// ============================================================================
// Templates
// ============================================================================

function generateMainIndexTemplate(featureName: string): string {
  const pascal = toPascalCase(featureName);
  return `
/**
 * ${pascal} Feature Module
 */

export * from './types';
export * from './api';
export * from './components';
export * from './hooks';
`;
}

// ============================================================================
// File System
// ============================================================================

function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeFile(filePath: string, content: string): void {
  fs.writeFileSync(filePath, content, "utf-8");
}

// ============================================================================
// Main Generator
// ============================================================================

async function generateFeature(featureName: string) {
  const srcDir = path.join(__dirname, "..", "src");
  const featuresDir = path.join(srcDir, "features");
  const featureDir = path.join(featuresDir, featureName);

  if (fs.existsSync(featureDir)) {
    showDuplicateError(featureName, featureDir);
    process.exit(1);
  }

  console.log(
    `\n${googleDots()} ${colors.bold}${color(
      "Nexus Feature Generator",
      "gray",
    )}${colors.reset}\n`,
  );

  showAsciiArt();

  console.log(
    `${color("⚡🐶 Sparky is Generating feature:", "gray")} ${color(
      featureName,
      "blue",
    )}\n`,
  );

  console.log(color("📁 Creating directories...", "yellow"));

  ensureDirectoryExists(featureDir);
  await runWithSpinner(`features/${featureName}/`);

  ensureDirectoryExists(path.join(featureDir, "api"));
  await runWithSpinner(`features/${featureName}/api/`);

  ensureDirectoryExists(path.join(featureDir, "components"));
  await runWithSpinner(`features/${featureName}/components/`);

  ensureDirectoryExists(path.join(featureDir, "hooks"));
  await runWithSpinner(`features/${featureName}/hooks/`);

  console.log("\n" + color("📄 Creating files...", "yellow"));

  writeFile(
    path.join(featureDir, "index.ts"),
    generateMainIndexTemplate(featureName),
  );
  await runWithSpinner("index.ts");

  console.log(
    `\n${color(
      `🤩 Feature '${featureName}' created successfully!`,
      "green",
    )}\n`,
  );

  console.log(color(`📍 Location: src/features/${featureName}/\n`, "gray"));

  console.log(color("💡 Next steps:", "yellow"));
  console.log("   1. Add your types to types.ts");
  console.log("   2. Create components in components/");
  console.log("   3. Create hooks in hooks/");
  console.log("   4. Create API functions in api/");
  console.log("   5. Export everything through index.ts files\n");

  console.log(
    `${color("⚡🐶 Sparky approves this structure. Ang galing mo!", "blue")}\n
${colors.bold}Thank you for using Nexus Feature Generator${colors.reset}
${googleDots()}
`,
  );
}

// ============================================================================
// Entry
// ============================================================================

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    showUsage();
    process.exit(1);
  }

  const featureName = args[0];

  if (!isValidFeatureName(featureName)) {
    showInvalidNameError(featureName);
    process.exit(1);
  }

  try {
    await generateFeature(featureName);
  } catch (error) {
    console.error(
      "\n" +
        color(
          "⚡🐶 Uh-oh… Sparky ran into an issue while generating the feature:",
          "red",
        ),
      error,
    );
    process.exit(1);
  }
}

main();
