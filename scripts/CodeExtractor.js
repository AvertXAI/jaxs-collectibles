const fs = require('fs');
const path = require('path');

// Target the root directory (one level up from /scripts)
const SCRIPT_DIR = __dirname;
const ROOT_DIR = path.resolve(SCRIPT_DIR, '..');

// Dynamically grab the root folder name and format it
const ROOT_FOLDER_NAME = path.basename(ROOT_DIR);
const SAFE_FOLDER_NAME = ROOT_FOLDER_NAME.replace(/-/g, '_').replace(/ /g, '_').toLowerCase();
const DISPLAY_NAME = ROOT_FOLDER_NAME.toUpperCase();

// Output file prefix
const OUTPUT_PREFIX = path.join(SCRIPT_DIR, `_${SAFE_FOLDER_NAME}_dump_part_`);

// Hardcoded chunk limit to keep the DOM stable
const CHUNK_LIMIT = 35000;

// The Shield: Ignoring heavy directories, databases, notes, and virtual environments
const IGNORE_LIST = new Set([
    'node_modules', '.git', '.next', '.vercel', 'public',
    'package-lock.json', '.env', '.env.local', 'scripts',
    '__pycache__', 'build', 'dist', '.vscode', '.idea',
    'venv', '.venv', 'env', 'Lib', 'site-packages',
    'Include', 'Scripts', 'vcpkg_installed', 'external', 'third_party',
    '.pytest_cache', 'Joplin', 'Postgres', 'SSH', 'avert-proxie-dump-scripts',
    `${SAFE_FOLDER_NAME}_dump_scripts`
]);

// Targeted file extensions for the split architecture and documentation
const ALLOWED_EXTS = new Set([
    '.js', '.jsx', '.ts', '.tsx', '.css', '.json', '.sql',
    '.cpp', '.hpp', '.h', '.py', '.sh', '.yml', '.yaml',
    '.toml', '.in', '.log', '.md', '.markdown'
]);

// Specific files that lack extensions but are critical to architecture
const EXACT_FILES = new Set(['CMakeLists.txt', 'Makefile', 'makefile']);

function generateTree(dirPath, prefix = "") {
    let treeStr = "";
    let items;

    try {
        items = fs.readdirSync(dirPath, { withFileTypes: true });
    } catch (e) {
        return "";
    }

    let validItems = [];
    for (const item of items) {
        if (IGNORE_LIST.has(item.name)) continue;

        if (item.isDirectory()) {
            validItems.push({ name: item.name, isDir: true });
        } else {
            const ext = path.extname(item.name).toLowerCase();
            if (ALLOWED_EXTS.has(ext) || EXACT_FILES.has(item.name)) {
                if (ext !== '.pyc') {
                    validItems.push({ name: item.name, isDir: false });
                }
            }
        }
    }

    // Sort alphabetically so the tree looks clean
    validItems.sort((a, b) => a.name.localeCompare(b.name));

    validItems.forEach((item, index) => {
        const isLast = index === validItems.length - 1;
        const connector = isLast ? "└── " : "├── ";
        treeStr += `${prefix}${connector}${item.name}\n`;

        if (item.isDir) {
            const extensionPrefix = isLast ? "    " : "│   ";
            treeStr += generateTree(path.join(dirPath, item.name), prefix + extensionPrefix);
        }
    });

    return treeStr;
}

function getFiles(dirPath) {
    let fileList = [];
    const items = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const item of items) {
        if (IGNORE_LIST.has(item.name)) continue;

        const fullPath = path.join(dirPath, item.name);

        if (item.isDirectory()) {
            fileList = fileList.concat(getFiles(fullPath));
        } else if (item.isFile()) {
            const ext = path.extname(item.name).toLowerCase();
            if (ALLOWED_EXTS.has(ext) || EXACT_FILES.has(item.name)) {
                if (ext !== '.pyc') {
                    fileList.push(fullPath);
                }
            }
        }
    }
    return fileList;
}

function generateDump() {
    console.log(`Scanning ${DISPLAY_NAME} Architecture & Docs from: ${ROOT_DIR}...`);

    // 1. Generate Directory Tree
    console.log("Generating Directory Tree...");
    let dirTree = "// ==========================================\n";
    dirTree += `// DIRECTORY STRUCTURE: ${ROOT_FOLDER_NAME}\n`;
    dirTree += "// ==========================================\n";
    dirTree += `${ROOT_FOLDER_NAME}/\n`;
    dirTree += generateTree(ROOT_DIR);
    dirTree += "// ==========================================\n\n";

    // 2. Extract file contents
    const files = getFiles(ROOT_DIR);
    const allFileBlocks = [];

    for (const filePath of files) {
        const relPath = path.relative(ROOT_DIR, filePath);
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            let fileBlock = "\n// ==========================================\n";
            fileBlock += `// FILE: ${relPath}\n`;
            fileBlock += "// ==========================================\n\n";
            fileBlock += content + "\n";
            allFileBlocks.push(fileBlock);
        } catch (e) {
            console.log(`Skipping ${relPath} due to read error: ${e.message}`);
        }
    }

    if (allFileBlocks.length === 0 && dirTree.trim() === "") {
        console.log("No valid files or directories found. Exiting.");
        return;
    }

    // 3. Pack blocks into chunks
    const chunks = [];
    let currentChunk = dirTree; // Tree goes at the top of chunk 1

    for (const block of allFileBlocks) {
        if (currentChunk.length + block.length > CHUNK_LIMIT && currentChunk.length > dirTree.length) {
            chunks.push(currentChunk);
            currentChunk = "";
        }
        currentChunk += block;
    }

    if (currentChunk.length > 0) {
        chunks.push(currentChunk);
    }

    // 4. Write chunks to disk
    const totalParts = chunks.length;
    const currentTimestamp = new Date().toLocaleString();

    chunks.forEach((chunkText, index) => {
        const partNum = index + 1;
        let finalOutput = "";

        if (totalParts === 1) {
            finalOutput = `// DUMP GENERATED: ${currentTimestamp}\n`;
            finalOutput += `=== ${DISPLAY_NAME} CODEBASE & DOCS DUMP ===\n\n`;
            finalOutput += chunkText;
            finalOutput += "\n// === END OF DUMP ===\n// INSTRUCTION: Review the logic, scope, hardware, and documentation notes. Integrate the context, provide your estimation for building the PiOS server and completing the code, and await further questions.";
        } else {
            finalOutput = `// DUMP GENERATED: ${currentTimestamp}\n`;
            finalOutput += `=== ${DISPLAY_NAME} CODEBASE & DOCS DUMP (PART ${partNum} OF ${totalParts}) ===\n`;

            if (partNum < totalParts) {
                finalOutput += `// INSTRUCTION: This is part ${partNum} of ${totalParts}. Acknowledge receipt, hold this documentation and codebase logic in your context, do NOT answer yet, and wait for the next part.\n\n`;
                finalOutput += chunkText;
                finalOutput += "\n// ==========================================\n";
                finalOutput += `// END OF PART ${partNum}. WAITING FOR MORE DATA...\n`;
                finalOutput += "// ==========================================";
            } else {
                finalOutput += `// INSTRUCTION: This is the FINAL part (${partNum} of ${totalParts}). You now have the complete codebase and documentation. Review the logic, scope, and hardware notes, integrate with the context, provide your estimation for building the PiOS server and completing the code, and then await "START" for the next phase.\n\n`;
                finalOutput += chunkText;
                finalOutput += "\n// ==========================================\n";
                finalOutput += "// === END OF COMPLETE DUMP ===\n";
                finalOutput += "// STANDING BY FOR 'START'.\n";
                finalOutput += "// ==========================================";
            }
        }

        const outputPath = path.join(SCRIPT_DIR, `_${SAFE_FOLDER_NAME}_dump_part_${partNum}.txt`);
        fs.writeFileSync(outputPath, finalOutput, 'utf-8');
        console.log(`✅ Part ${partNum}/${totalParts} extracted to: ${outputPath}`);
    });

    console.log(`\n🚀 Extraction Complete! Found ${files.length} files split across ${totalParts} text chunks.`);
}

generateDump();