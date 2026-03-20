import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import { spawnSync } from "child_process";

// ============================================================================
// Google + Firebase Style Theme
// ============================================================================

const colors = {
    blue: "\x1b[34m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    green: "\x1b[32m",
    gray: "\x1b[90m",
    cyan: "\x1b[36m",
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
// Spinner
// ============================================================================

const spinnerFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runWithSpinner(label: string) {
    process.stdout.write("   ");
    for (let i = 0; i < 6; i++) {
        const frame = spinnerFrames[i % spinnerFrames.length];
        process.stdout.write(`\r   ${color(frame, "yellow")} ${color(label, "gray")}`);
        await sleep(60);
    }
    process.stdout.write(`\r   ${color("⚡", "green")} ${label}\n`);
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
// Constants
// ============================================================================

const SUPPORTED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".tiff", ".tif"];

// Public folder feature directories, relative to the nexus-web root
const PUBLIC_FOLDERS = [
    "branding",
    "home",
    "about",
    "id",
    "team",
    "partners",
    "auth",
    "leaderboard",
    "sparky-points",
    "custom (type a path)",
];

const QUALITY = 90;

// ============================================================================
// Readline Helper
// ============================================================================

function createRL() {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
}

function ask(rl: readline.Interface, question: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(question, (answer) => resolve(answer.trim()));
    });
}

// ============================================================================
// Checks
// ============================================================================

function checkFfmpegInstalled(): boolean {
    const result = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" });
    return result.status === 0;
}

function isConvertible(filePath: string): boolean {
    const ext = path.extname(filePath).toLowerCase();
    return SUPPORTED_EXTENSIONS.includes(ext);
}

// ============================================================================
// Naming Convention
// ============================================================================

/**
 * Converts a raw filename to the project's asset naming convention:
 * [feature]-[description].webp  (all lowercase kebab-case)
 */
function toAssetName(rawFilename: string, destFolder: string): string {
    // Derive the feature segment from the last path component of the dest folder
    const feature = path.basename(destFolder).toLowerCase();

    const stem = path.basename(rawFilename, path.extname(rawFilename));

    // Lowercase, replace any non-alphanumeric run (spaces, underscores, dots…) with a hyphen,
    // collapse multiple hyphens, trim leading/trailing hyphens
    const kebab = stem
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

    // Prepend feature prefix only when not already present
    const named = kebab.startsWith(feature + "-") || kebab === feature
        ? kebab
        : `${feature}-${kebab}`;

    return named + ".webp";
}

// ============================================================================
// Conversion
// ============================================================================

interface ConversionResult {
    input: string;
    output: string;
    success: boolean;
    error?: string;
}

function convertToWebp(inputPath: string, outputPath: string): ConversionResult {
    const result = spawnSync(
        "ffmpeg",
        ["-y", "-i", inputPath, "-quality", String(QUALITY), outputPath],
        { stdio: "pipe" },
    );

    if (result.status === 0) {
        return { input: inputPath, output: outputPath, success: true };
    } else {
        const errorMsg = result.stderr?.toString() ?? "Unknown ffmpeg error";
        return { input: inputPath, output: outputPath, success: false, error: errorMsg };
    }
}

// ============================================================================
// Prompt: Pick destination folder
// ============================================================================

async function promptDestinationFolder(rl: readline.Interface, rootDir: string): Promise<string> {
    console.log("\n" + color("📂 Where should the converted file(s) be placed?", "yellow"));
    console.log(color("   (Folders inside public/)\n", "gray"));

    PUBLIC_FOLDERS.forEach((folder, i) => {
        const isCustom = i === PUBLIC_FOLDERS.length - 1;
        const label = isCustom
            ? color(`  ${i + 1}. ${folder}`, "cyan")
            : `  ${color(String(i + 1), "blue")}. public/${color(folder, "bold")}`;
        console.log(label);
    });

    console.log();

    while (true) {
        const answer = await ask(
            rl,
            color(`⚡🐶 Sparky is asking: Enter a number (1-${PUBLIC_FOLDERS.length}): `, "yellow"),
        );

        const choice = parseInt(answer, 10);

        if (isNaN(choice) || choice < 1 || choice > PUBLIC_FOLDERS.length) {
            console.log(color(`   Hmm, "${answer}" is not a valid choice. Try again!\n`, "red"));
            continue;
        }

        // Custom path
        if (choice === PUBLIC_FOLDERS.length) {
            const customPath = await ask(
                rl,
                color("   Enter a path relative to nexus-web root (e.g. public/team): ", "cyan"),
            );
            const resolved = path.resolve(rootDir, customPath);
            return resolved;
        }

        const selected = PUBLIC_FOLDERS[choice - 1];
        return path.join(rootDir, "public", selected);
    }
}

// ============================================================================
// Prompt: Pick source files
// ============================================================================

async function promptSourceFiles(rl: readline.Interface): Promise<string[]> {
    console.log("\n" + color("🖼️  What image(s) do you want to convert?", "yellow"));
    console.log(
        color(
            "   Supported formats: " + SUPPORTED_EXTENSIONS.join(", "),
            "gray",
        ),
    );
    console.log(color("   You can enter one file, multiple files (comma-separated),", "gray"));
    console.log(color("   or a folder path to batch-convert all images inside it.\n", "gray"));

    while (true) {
        const answer = await ask(
            rl,
            color("⚡🐶 Sparky is asking: Folder path: ", "yellow"),
        );

        if (!answer) {
            console.log(color("   Please enter at least one file or folder path.\n", "red"));
            continue;
        }

        // Check if it's a directory
        const stat = fs.existsSync(answer) ? fs.statSync(answer) : null;

        if (stat && stat.isDirectory()) {
            const files = fs
                .readdirSync(answer)
                .filter((f) => isConvertible(f))
                .map((f) => path.join(answer, f));

            if (files.length === 0) {
                console.log(
                    color(
                        `   No convertible images found in "${answer}". Supported: ${SUPPORTED_EXTENSIONS.join(", ")}\n`,
                        "red",
                    ),
                );
                continue;
            }

            console.log(
                color(`   Found ${files.length} image(s) in the folder.\n`, "green"),
            );
            return files;
        }

        // Treat as comma-separated list of files
        const paths = answer
            .split(",")
            .map((p) => p.trim())
            .filter(Boolean);

        const missing = paths.filter((p) => !fs.existsSync(p));
        if (missing.length > 0) {
            console.log(color(`   Cannot find: ${missing.join(", ")}\n`, "red"));
            continue;
        }

        const nonConvertible = paths.filter((p) => !isConvertible(p));
        if (nonConvertible.length > 0) {
            console.log(
                color(
                    `   These files are not a supported image format: ${nonConvertible.join(", ")}\n`,
                    "red",
                ),
            );
            continue;
        }

        return paths;
    }
}

// ============================================================================
// Prompt: Delete originals?
// ============================================================================

async function promptDeleteOriginals(rl: readline.Interface): Promise<boolean> {
    const answer = await ask(
        rl,
        color(
            "\n⚡🐶 Sparky is asking: Delete original file(s) after conversion? (y/N): ",
            "yellow",
        ),
    );
    return answer.toLowerCase() === "y";
}

// ============================================================================
// Main
// ============================================================================

async function main() {
    // Root is one level above scripts/
    const rootDir = path.resolve(__dirname, "..");

    console.log(
        `\n${googleDots()} ${colors.bold}${color("Nexus WebP Converter", "gray")}${colors.reset}\n`,
    );

    showAsciiArt();

    // Verify ffmpeg is available
    if (!checkFfmpegInstalled()) {
        console.log(
            color(
                "⚡🐶 Sparky couldn't find ffmpeg!\n\n" +
                "   Please install it first:\n" +
                "   • macOS:  brew install ffmpeg\n" +
                "   • Ubuntu: sudo apt install ffmpeg\n" +
                "   • Windows: https://ffmpeg.org/download.html",
                "red",
            ),
        );
        process.exit(1);
    }

    const rl = createRL();

    try {
        // 1. Collect source files
        const sourceFiles = await promptSourceFiles(rl);

        // 2. Pick destination folder
        const destFolder = await promptDestinationFolder(rl, rootDir);

        // 3. Delete originals?
        const deleteOriginals = await promptDeleteOriginals(rl);

        // 4. Preview
        console.log("\n" + color("📋 Conversion plan:", "yellow"));
        console.log(color(`   Source files  : ${sourceFiles.length} image(s)`, "gray"));
        console.log(color(`   Destination   : ${path.relative(rootDir, destFolder)}`, "gray"));
        console.log(
            color(
                `   Delete originals: ${deleteOriginals ? "yes" : "no"}`,
                deleteOriginals ? "red" : "gray",
            ),
        );

        const confirm = await ask(
            rl,
            color("\n⚡🐶 Sparky is ready! Proceed? (Y/n): ", "yellow"),
        );

        if (confirm.toLowerCase() === "n") {
            console.log(color("\n   Aborted. Umulit ka!\n", "red"));
            process.exit(0);
        }

        // 5. Ensure destination folder exists
        if (!fs.existsSync(destFolder)) {
            fs.mkdirSync(destFolder, { recursive: true });
        }

        // 6. Convert
        console.log("\n" + color("⚡ Converting...\n", "yellow"));

        const results: ConversionResult[] = [];

        for (const src of sourceFiles) {
            const baseName = toAssetName(path.basename(src), destFolder);
            const dest = path.join(destFolder, baseName);

            await runWithSpinner(
                `${path.basename(src)} → ${color(baseName, "cyan")}`,
            );

            const result = convertToWebp(src, dest);
            results.push(result);

            if (result.success && deleteOriginals) {
                fs.unlinkSync(src);
            }
        }

        // 7. Summary
        const succeeded = results.filter((r) => r.success);
        const failed = results.filter((r) => !r.success);

        console.log();

        if (succeeded.length > 0) {
            console.log(
                color(`🎉 Successfully converted ${succeeded.length} file(s) to WebP!`, "green"),
            );
            console.log(
                color(
                    `📍 Location: ${path.relative(rootDir, destFolder)}/\n`,
                    "gray",
                ),
            );
        }

        if (failed.length > 0) {
            console.log(color(`❌ ${failed.length} file(s) failed to convert:`, "red"));
            for (const f of failed) {
                console.log(color(`   • ${path.basename(f.input)}: ${f.error}`, "red"));
            }
            console.log();
        }

        console.log(color("💡 Next steps:", "yellow"));
        console.log("   1. Add a constant in src/lib/constants/assets.ts");
        console.log("   2. Use ASSETS.<KEY> in your component — never the raw string");
        console.log("   3. Clear Next.js cache if replacing an existing asset: rm -rf .next\n");

        console.log(
            `${color("⚡🐶 Sparky approves your assets. Ang galing mo!", "blue")}\n` +
            `${colors.bold}Thank you for using Nexus WebP Converter${colors.reset}\n` +
            `${googleDots()}\n`,
        );
    } finally {
        rl.close();
    }
}

main().catch((err) => {
    console.error(color("\n⚡🐶 Uh-oh… Sparky ran into an unexpected issue:", "red"), err);
    process.exit(1);
});
