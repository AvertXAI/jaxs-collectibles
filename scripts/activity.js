// --- CREATING AN ACTIVITY SCANNER ---
// This script will scan your project for any files that have been created or modified within the last 24 hours.
// It provides a clear report of recent activity, helping you track your progress and stay motivated.

const fs = require('fs');
const path = require('path');

// --- ACTIVITY SCANNER CONFIGURATION ---
const IGNORE_DIRS = ['.git', 'node_modules', '.next', 'public', 'dist', 'build'];
const ALLOWED_EXTS = ['.ts', '.tsx', '.js', '.jsx', '.css', '.json'];
const TIME_WINDOW_MS = 24 * 60 * 60 * 1000; // Last 24 Hours
const now = Date.now();

let newFiles = [];
let modifiedFiles = [];

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
                // Check timestamps against our 24-hour window
                const isNew = (now - stat.birthtimeMs) < TIME_WINDOW_MS;
                const isModified = (now - stat.mtimeMs) < TIME_WINDOW_MS && !isNew;

                // Keep the file paths clean and readable
                const relativePath = path.relative(__dirname, fullPath);

                if (isNew) newFiles.push(relativePath);
                if (isModified) modifiedFiles.push(relativePath);
            }
        }
    }
}

try {
    walkDir(__dirname);

    const timestamp = new Date().toLocaleString();
    let report = `\n======================================\n`;
    report += ` ACTIVITY REPORT: ${timestamp}\n`;
    report += `======================================\n\n`;

    report += `[NEW FILES CREATED - LAST 24H]\n`;
    if (newFiles.length === 0) report += `  None detected.\n`;
    newFiles.forEach(f => report += `  + ${f}\n`);

    report += `\n[FILES MODIFIED - LAST 24H]\n`;
    if (modifiedFiles.length === 0) report += `  None detected.\n`;
    modifiedFiles.forEach(f => report += `  ~ ${f}\n`);

    report += `\n--------------------------------------\n`;

    // 1. Output to Terminal
    console.log(report);

    // 2. Append to Text File
    const logFilePath = path.join(__dirname, 'vault-activity-log.txt');
    fs.appendFileSync(logFilePath, report, 'utf8');
    console.log(`> Activity securely logged to: vault-activity-log.txt\n`);

} catch (error) {
    console.error('Scan failed:', error);
}