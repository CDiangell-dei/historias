import re
import os
import sys

def markdown_to_ao3_html(md_text):
    lines = md_text.splitlines()
    
    # 1. Skip top metadata header if present
    # Look for the second '---' separator that closes the header block
    start_idx = 0
    hr_count = 0
    in_header = False
    
    if len(lines) > 0 and lines[0].strip().startswith("#"):
        in_header = True
        for idx, line in enumerate(lines):
            if line.strip() == "---":
                hr_count += 1
                if hr_count == 2:
                    start_idx = idx + 1
                    in_header = False
                    break
    
    if in_header: # If there wasn't a second ---, fall back to start
        start_idx = 0

    body_lines = lines[start_idx:]
    
    # Group into paragraph blocks separated by blank lines
    blocks = []
    current_block = []
    
    for line in body_lines:
        trimmed = line.strip()
        if not trimmed:
            if current_block:
                blocks.append("\n".join(current_block))
                current_block = []
        else:
            current_block.append(trimmed)
            
    if current_block:
        blocks.append("\n".join(current_block))
        
    html_elements = []
    
    for block in blocks:
        # Check for horizontal rule
        if block == "---":
            html_elements.append("<hr />")
            continue
            
        # Check for Scene Header: **[...]**
        scene_match = re.match(r"^\*\*(\[[^\]]+\])\*\*$", block)
        if scene_match:
            scene_title = scene_match.group(1)
            html_elements.append(f"<h4>{scene_title}</h4>")
            continue
            
        # Check for Blockquote: starts with >
        if block.startswith(">"):
            # Strip > and leading spaces
            quote_text = re.sub(r"^>\s*", "", block, flags=re.MULTILINE)
            # Format markdown inside quote
            quote_html = format_inline_markdown(quote_text)
            html_elements.append(f"<blockquote>\n  <p>{quote_html}</p>\n</blockquote>")
            continue
            
        # Standard paragraph
        p_html = format_inline_markdown(block)
        html_elements.append(f"<p>{p_html}</p>")
        
    return "\n\n".join(html_elements)

def format_inline_markdown(text):
    # Bold + Italic: ***text***
    text = re.sub(r"\*\*\*([^\*]+)\*\*\*", r"<strong><em>\1</em></strong>", text)
    # Bold: **text**
    text = re.sub(r"\*\*([^\*]+)\*\*", r"<strong>\1</strong>", text)
    # Italic: *text*
    text = re.sub(r"\*([^\*]+)\*", r"<em>\1</em>", text)
    return text

def convert_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        md_content = f.read()
        
    ao3_html = markdown_to_ao3_html(md_content)
    
    dir_name, base_name = os.path.split(file_path)
    name_without_ext = os.path.splitext(base_name)[0]
    out_path = os.path.join(dir_name, f"{name_without_ext} (AO3).html")
    
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(ao3_html.strip() + "\n")
        
    print(f"Exported successfully to: {out_path}")
    return out_path

if __name__ == "__main__":
    target = r"C:\Antigravity\Histórias\Reencontro a Muito Postergado\1 - Mudança Térmica.md"
    if len(sys.argv) > 1:
        target = sys.argv[1]
    convert_file(target)
