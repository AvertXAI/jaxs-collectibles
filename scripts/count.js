// --- CREATING A VAULT SCANNER ---
// This script will scan your entire project and count the total lines of code across all relevant files.
// It ignores common dependency folders and build outputs to give you an accurate "code written" metric.

const fs = require('fs');
const path = require('path');

// --- VAULT SCANNER CONFIGURATION ---
const IGNORE_DIRS = ['.git', 'node_modules', '.next', 'public', 'dist', 'build'];
const ALLOWED_EXTS = ['.ts', '.tsx', '.js', '.jsx', '.css', '.json'];

let totalLines = 0;
let totalFiles = 0;

function countLinesInFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    // Filter out completely empty lines
    const lines = content.split('\n').filter(line => line.trim().length > 0).length;
    totalLines += lines;
    totalFiles++;
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (!IGNORE_DIRS.includes(file)) {
                walkDir(fullPath);
            }
        } else {
            const ext = path.extname(file);
            if (ALLOWED_EXTS.includes(ext)) {
                countLinesInFile(fullPath);
            }
        }
    }
}

try {
    walkDir(__dirname);

    // Generate Timestamp
    const timestamp = new Date().toLocaleString();
    const reportLine = `[${timestamp}] Modules: ${totalFiles} | Total Lines of Code: ${totalLines.toLocaleString()}\n`;

    // 1. Output to Terminal
    console.log('\n======================================');
    console.log('   VAULT ARCHITECTURE SCAN COMPLETE   ');
    console.log('======================================');
    console.log(reportLine);

    // 2. Append to Text File
    const logFilePath = path.join(__dirname, 'vault-scan-history.txt');
    fs.appendFileSync(logFilePath, reportLine, 'utf8');
    console.log(`> History securely logged to: vault-scan-history.txt`);
    console.log('======================================\n');

} catch (error) {
    console.error('Scan failed:', error);
}