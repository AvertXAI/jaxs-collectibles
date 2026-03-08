import fs from 'fs';
import path from 'path';

const HEADER = `//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
//////////////////////////////////////////////////\n`;

const TARGET_DIRS = ['./app', './components', './brain', './lib'];
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

function processFiles(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            processFiles(filePath);
        } else if (EXTENSIONS.includes(path.extname(filePath))) {
            let content = fs.readFileSync(filePath, 'utf8');

            // Prevent double injection if script is run twice
            if (!content.includes('Author: Jason Cruz')) {
                console.log(`📝 Protecting: ${filePath}`);
                fs.writeFileSync(filePath, HEADER + content);
            }
        }
    });
}

console.log("🛡️ INITIATING LEGAL PROTECTION PROTOCOL...");
TARGET_DIRS.forEach(dir => {
    if (fs.existsSync(dir)) processFiles(dir);
});
console.log("✅ ALL ASSETS SIGNED AND SECURED.");