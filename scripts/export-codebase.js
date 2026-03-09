//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
//////////////////////////////////////////////////
const fs = require('fs');
const path = require('path');

// THE FIX: Point the root directory one level up from the /scripts folder
const ROOT_DIR = path.resolve(__dirname, '..');

// Save the output directly into the /scripts folder to keep your root clean
const OUTPUT_FILE = path.join(__dirname, '_codebase_dump.txt');

// THE SHIELD: Now specifically ignoring the 'scripts' folder itself
const IGNORE_LIST = ['.git', 'node_modules', '.pytest_cache', 'Joplin', 'Postgres', 'SSH', 'dist', 'build'];

const ALLOWED_EXTS = ['.js', '.cpp', '.h', '.py', '.qml', '.json', '.md', '.ts', '.tsx'];

function walkDir(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        if (IGNORE_LIST.includes(file)) continue;

        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            walkDir(filePath, fileList);
        } else {
            const ext = path.extname(file);
            if (ALLOWED_EXTS.includes(ext)) {
                fileList.push(filePath);
            }
        }
    }
    return fileList;
}

function generateDump() {
    console.log(`Scanning Architecture from: ${ROOT_DIR}...`);
    const files = walkDir(ROOT_DIR);

    let output = "=== JAX'S COLLECTIBLES CODEBASE DUMP ===\n\n";

    files.forEach(file => {
        const relativePath = path.relative(ROOT_DIR, file);
        const content = fs.readFileSync(file, 'utf8');

        output += `\n// ==========================================\n`;
        output += `// FILE: ${relativePath}\n`;
        output += `// ==========================================\n\n`;
        output += content + `\n`;
    });

    fs.writeFileSync(OUTPUT_FILE, output);
    console.log(`✅ Codebase extracted safely to: ${OUTPUT_FILE}`);
}

generateDump();