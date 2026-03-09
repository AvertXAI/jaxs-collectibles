import os
import sys
from datetime import datetime

# Target the root directory (one level up from /scripts)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, '..'))

# Dynamically grab the root folder name and format it
ROOT_FOLDER_NAME = os.path.basename(ROOT_DIR)
SAFE_FOLDER_NAME = ROOT_FOLDER_NAME.replace("-", "_").replace(" ", "_").lower()
DISPLAY_NAME = ROOT_FOLDER_NAME.upper()

# Output file prefix
OUTPUT_PREFIX = os.path.join(SCRIPT_DIR, f'_{SAFE_FOLDER_NAME}_dump_part_')

# Hardcoded chunk limit to keep the DOM stable
CHUNK_LIMIT = 35000

# The Shield: Ignoring heavy directories, databases, notes, virtual environments, and dump scripts
IGNORE_LIST = {
    'node_modules', '.git', '.next', '.vercel', 'public',
    'package-lock.json', '.env', '.env.local', 'scripts',
    '__pycache__', 'build', 'dist', '.vscode', '.idea',
    'venv', '.venv', 'env', 'Lib', 'site-packages',
    'Include', 'Scripts', 'vcpkg_installed', 'external', 'third_party',
    '.pytest_cache', 'Joplin', 'Postgres', 'SSH', 'avert-proxie-dump-scripts',
    f'{SAFE_FOLDER_NAME}_dump_scripts'
}

# Targeted file extensions: Code architecture AND Markdown documentation
ALLOWED_EXTS = {
    '.js', '.jsx', '.ts', '.tsx', '.css', '.json', '.sql',
    '.cpp', '.hpp', '.h', '.py', '.sh', '.yml', '.yaml',
    '.toml', '.in', '.log', '.md', '.markdown'
}

# Specific files that lack extensions but are critical to architecture
EXACT_FILES = {'CMakeLists.txt', 'Makefile', 'makefile'}

def generate_tree(dir_path, prefix=""):
    """Recursively builds a string representation of the directory tree."""
    tree_str = ""
    try:
        items = sorted(os.listdir(dir_path))
    except PermissionError:
        return ""

    # Filter out ignored items and non-relevant files
    valid_items = []
    for item in items:
        if item in IGNORE_LIST:
            continue

        full_path = os.path.join(dir_path, item)
        if os.path.isdir(full_path):
            valid_items.append((item, True)) # True = is_dir
        else:
            ext = os.path.splitext(item)[1].lower()
            if ext in ALLOWED_EXTS or item in EXACT_FILES:
                if ext != '.pyc':
                    valid_items.append((item, False)) # False = is_file

    for index, (item, is_dir) in enumerate(valid_items):
        is_last = index == len(valid_items) - 1
        connector = "└── " if is_last else "├── "
        tree_str += f"{prefix}{connector}{item}\n"

        if is_dir:
            extension_prefix = "    " if is_last else "│   "
            tree_str += generate_tree(os.path.join(dir_path, item), prefix + extension_prefix)

    return tree_str

def get_files(dir_path):
    file_list = []
    for root, dirs, files in os.walk(dir_path):
        dirs[:] = [d for d in dirs if d not in IGNORE_LIST]
        for file in files:
            if file in IGNORE_LIST:
                continue
            ext = os.path.splitext(file)[1].lower()
            if ext in ALLOWED_EXTS or file in EXACT_FILES:
                if ext != '.pyc':
                    file_list.append(os.path.join(root, file))
    return file_list

def generate_dump():
    print(f"Scanning {DISPLAY_NAME} Architecture & Docs from: {ROOT_DIR}...")

    # 1. Generate the Directory Tree first
    print("Generating Directory Tree...")
    dir_tree = f"// ==========================================\n"
    dir_tree += f"// DIRECTORY STRUCTURE: {ROOT_FOLDER_NAME}\n"
    dir_tree += f"// ==========================================\n"
    dir_tree += f"{ROOT_FOLDER_NAME}/\n"
    dir_tree += generate_tree(ROOT_DIR)
    dir_tree += f"// ==========================================\n\n"

    # 2. Extract file contents
    files = get_files(ROOT_DIR)
    all_file_blocks = []

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

    if not all_file_blocks and not dir_tree.strip():
        print("No valid files or directories found. Exiting.")
        return

    # 3. Pack blocks into chunks, prepend dir_tree to the FIRST chunk
    chunks = []
    current_chunk = dir_tree  # Tree goes at the top of chunk 1

    for block in all_file_blocks:
        if len(current_chunk) + len(block) > CHUNK_LIMIT and len(current_chunk) > len(dir_tree):
            chunks.append(current_chunk)
            current_chunk = ""
        current_chunk += block

    if len(current_chunk) > 0:
        chunks.append(current_chunk)

    # 4. Write chunks to disk
    total_parts = len(chunks)
    current_timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    for index, chunk_text in enumerate(chunks):
        part_num = index + 1
        final_output = ""

        if total_parts == 1:
            final_output = f"// DUMP GENERATED: {current_timestamp}\n"
            final_output += f"=== {DISPLAY_NAME} CODEBASE & DOCS DUMP ===\n\n"
            final_output += chunk_text
            final_output += "\n// === END OF DUMP ===\n// INSTRUCTION: Review the logic, scope, hardware, and documentation notes. Integrate the context, provide your estimation for building the PiOS server and completing the code, and await further questions."
        else:
            final_output = f"// DUMP GENERATED: {current_timestamp}\n"
            final_output += f"=== {DISPLAY_NAME} CODEBASE & DOCS DUMP (PART {part_num} OF {total_parts}) ===\n"

            if part_num < total_parts:
                final_output += f"// INSTRUCTION: This is part {part_num} of {total_parts}. Acknowledge receipt, hold this documentation and codebase logic in your context, do NOT answer yet, and wait for the next part.\n\n"
                final_output += chunk_text
                final_output += "\n// ==========================================\n"
                final_output += f"// END OF PART {part_num}. WAITING FOR MORE DATA...\n"
                final_output += "// =========================================="
            else:
                final_output += f"// INSTRUCTION: This is the FINAL part ({part_num} of {total_parts}). You now have the complete codebase and documentation. Review the logic, scope, and hardware notes, integrate with the context, provide your estimation for building the PiOS server and completing the code, and then await \"START\" for the next phase.\n\n"
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