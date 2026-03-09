import os
import sys

# Target the root directory of Avert-Proxie (one level up from /scripts)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, '..'))

# Output file prefix
OUTPUT_PREFIX = os.path.join(SCRIPT_DIR, '_avert_proxie_dump_part_')

# Hardcoded chunk limit to keep the DOM stable
CHUNK_LIMIT = 35000

# The Shield: Ignoring heavy directories, databases, notes, and virtual environments
IGNORE_LIST = {
    'node_modules', '.git', '.next', '.vercel', 'public',
    'package-lock.json', '.env', '.env.local', 'scripts',
    '__pycache__', 'build', 'dist', '.vscode', '.idea',
    'venv', '.venv', 'env', '.env', 'Lib', 'site-packages',
    'Include', 'Scripts', 'vcpkg_installed', 'external', 'third_party', '.pytest_cache', 'Joplin', 'Postgres', 'SSH'
}

# Targeted file extensions for the split architecture
ALLOWED_EXTS = {
    '.js', '.jsx', '.ts', '.tsx', '.css', '.json', '.sql',
    '.cpp', '.hpp', '.h', '.py', '.sh', '.yml', '.yaml',
    '.toml', '.in', '.log'
}

# Specific files that lack extensions but are critical to architecture
EXACT_FILES = {'CMakeLists.txt', 'Makefile', 'makefile'}

def get_files(dir_path):
    file_list = []
    for root, dirs, files in os.walk(dir_path):
        # Modify dirs in-place to skip ignored directories
        dirs[:] = [d for d in dirs if d not in IGNORE_LIST]

        for file in files:
            if file in IGNORE_LIST:
                continue

            ext = os.path.splitext(file)[1].lower()
            if ext in ALLOWED_EXTS or file in EXACT_FILES:
                # Failsafe against python bytecode
                if ext != '.pyc':
                    file_list.append(os.path.join(root, file))
    return file_list

def generate_dump():
    print(f"Scanning Avert-Proxie Architecture from: {ROOT_DIR}...")
    files = get_files(ROOT_DIR)
    all_file_blocks = []

    # Step 1: Read all files and format them into distinct blocks
    for file_path in files:
        rel_path = os.path.relpath(file_path, ROOT_DIR)
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            print(f"Skipping {rel_path} due to read error: {e}")
            continue

        file_block = "\n// ==========================================\n"
        file_block += f"// FILE: {rel_path}\n"
        file_block += "// ==========================================\n\n"
        file_block += content + "\n"

        all_file_blocks.append(file_block)

    # Step 2: Pack blocks into chunks based on the character limit
    chunks = []
    current_chunk = ""

    for block in all_file_blocks:
        if len(current_chunk) + len(block) > CHUNK_LIMIT and len(current_chunk) > 0:
            chunks.append(current_chunk)
            current_chunk = ""

        current_chunk += block

    if len(current_chunk) > 0:
        chunks.append(current_chunk)

    # Step 3: Write the chunks to disk with AI Context Instructions
    total_parts = len(chunks)

    for index, chunk_text in enumerate(chunks):
        part_num = index + 1
        final_output = ""

        if total_parts == 1:
            # Single page scenario
            final_output = "=== AVERT-PROXIE CODEBASE DUMP ===\n\n"
            final_output += chunk_text
            final_output += "\n// === END OF DUMP ===\n// INSTRUCTION: Review the logic and scope, provide your estimation for building the PiOS server and completing the code, and await further questions."
        else:
            # Multi-page scenario
            final_output = f"=== AVERT-PROXIE CODEBASE DUMP (PART {part_num} OF {total_parts}) ===\n"

            if part_num < total_parts:
                final_output += f"// INSTRUCTION: This is part {part_num} of {total_parts}. Acknowledge receipt, hold this in your context, do NOT answer yet, and wait for the next part.\n\n"
                final_output += chunk_text
                final_output += "\n// ==========================================\n"
                final_output += f"// END OF PART {part_num}. WAITING FOR MORE DATA...\n"
                final_output += "// =========================================="
            else:
                final_output += f"// INSTRUCTION: This is the FINAL part ({part_num} of {total_parts}). You now have the complete codebase. Review the logic and scope, provide your estimation for building the PiOS server and completing the code, and then await \"START\" for the next phase.\n\n"
                final_output += chunk_text
                final_output += "\n// ==========================================\n"
                final_output += "// === END OF COMPLETE DUMP ===\n"
                final_output += "// STANDING BY FOR 'START'.\n"
                final_output += "// =========================================="

        output_path = f"{OUTPUT_PREFIX}{part_num}.txt"
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(final_output)
        print(f"✅ Part {part_num}/{total_parts} extracted to: {output_path}")

    print(f"\n🚀 Extraction Complete! Found {len(files)} files split across {total_parts} text chunks.")

if __name__ == "__main__":
    generate_dump()