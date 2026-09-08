import os
import json
import re

def parse_metadata(lines):
    meta = {
        "title": "",
        "author": "CDiangell",
        "universe": "Re:Zero Starting Life in Another World",
        "pair": "",
        "characters": "",
        "chapter_title": ""
    }
    
    header_lines = []
    body_start_idx = 0
    hr_count = 0
    
    for idx, line in enumerate(lines):
        trimmed = line.strip()
        if trimmed == "---":
            hr_count += 1
            if hr_count == 2:
                body_start_idx = idx + 1
                break
        header_lines.append(trimmed)
        
    for line in header_lines:
        if line.startswith("# "):
            if not meta["title"]:
                meta["title"] = line[2:].strip()
        elif line.startswith("## ") or line.startswith("# 1") or line.startswith("# 2"):
            meta["chapter_title"] = re.sub(r"^#+\s*", "", line).replace(r"\-", "-").strip()
        elif "**Autor:**" in line:
            meta["author"] = line.split("**Autor:**")[1].strip()
        elif "**Universo:**" in line:
            meta["universe"] = line.split("**Universo:**")[1].strip()
        elif "**Par:**" in line:
            meta["pair"] = line.split("**Par:**")[1].strip()
        elif "**Personagens:**" in line:
            meta["characters"] = line.split("**Personagens:**")[1].strip()
            
    return meta, lines[body_start_idx:]

def md_to_reader_and_ao3(body_lines):
    # Group paragraphs
    blocks = []
    curr = []
    for line in body_lines:
        t = line.strip()
        if not t:
            if curr:
                blocks.append("\n".join(curr))
                curr = []
        else:
            curr.append(t)
    if curr:
        blocks.append("\n".join(curr))
        
    reader_elements = []
    ao3_elements = []
    
    for block in blocks:
        if block == "---":
            reader_elements.append('<div class="scene-break"><span class="star-icon">✦ ✦ ✦</span></div>')
            ao3_elements.append('<hr />')
            continue
            
        scene_match = re.match(r"^\*\*(\[[^\]]+\])\*\*$", block)
        if scene_match:
            loc = scene_match.group(1)
            reader_elements.append(f'<div class="scene-tag"><span class="scene-badge">CENA</span> {loc}</div>')
            ao3_elements.append(f'<h4>{loc}</h4>')
            continue
            
        if block.startswith(">"):
            raw_quote = re.sub(r"^>\s*", "", block, flags=re.MULTILINE)
            fmt = format_inline(raw_quote)
            reader_elements.append(f'<blockquote class="scroll-quote"><p>{fmt}</p></blockquote>')
            ao3_elements.append(f'<blockquote>\n  <p>{fmt}</p>\n</blockquote>')
            continue
            
        fmt = format_inline(block)
        reader_elements.append(f'<p>{fmt}</p>')
        ao3_elements.append(f'<p>{fmt}</p>')
        
    return "\n\n".join(reader_elements), "\n\n".join(ao3_elements)

def format_inline(text):
    # Bold + Italic: ***text***
    text = re.sub(r"\*\*\*([^\*]+)\*\*\*", r"<strong><em>\1</em></strong>", text)
    # Magic and authorities highlight: **«...»**
    text = re.sub(r"\*\*«([^»]+)»\*\*", r'<strong class="magic-spell">«\1»</strong>', text)
    # Bold: **text**
    text = re.sub(r"\*\*([^\*]+)\*\*", r"<strong>\1</strong>", text)
    # Satella / Telepathy: *«...»*
    text = re.sub(r"\*«([^»]+)»\*", r'<em class="witch-voice">«\1»</em>', text)
    # Internal thoughts: *‘...’* or *'...' *
    text = re.sub(r"\*‘([^’]+)’\*", r'<em class="thought-voice">‘\1’</em>', text)
    # Standard Italic: *text*
    text = re.sub(r"\*([^\*]+)\*", r"<em>\1</em>", text)
    return text

def parse_glossary(glossary_path):
    with open(glossary_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    items = []
    in_table = False
    for line in lines:
        line = line.strip()
        if line.startswith("|") and ("Termo em Re:Zero" in line or "-----" in line):
            in_table = True
            continue
        if in_table and line.startswith("|") and line.endswith("|"):
            parts = [p.strip() for p in line.split("|")[1:-1]]
            if len(parts) >= 2:
                items.append({
                    "rezero": parts[0],
                    "terra": parts[1]
                })
    return items

def build_all():
    base_dir = r"C:\Antigravity\Histórias"
    
    stories_config = [
        {
            "id": "reencontro",
            "title": "Reencontro a Muito Postergado",
            "fandom": "Re:Zero Starting Life in Another World",
            "category": "rezero",
            "summary": "O reencontro com a dor da saudade entre Subaru Natsuki, seus pais no Japão e a sua nova vida ao lado de Beatrice e do acampamento de Emilia na Mansão Miload.",
            "coverColor": "from-amber-600 to-indigo-950",
            "chapters": [
                {
                    "id": "reencontro-cap1",
                    "number": 1,
                    "title": "Capítulo 1: Mudança Térmica",
                    "file": os.path.join(base_dir, r"Reencontro a Muito Postergado\1 - Mudança Térmica.md")
                }
            ]
        },
        {
            "id": "tfs-wtbo",
            "title": "Two Forgotten Stars - When Two Become One",
            "fandom": "Re:Zero Starting Life in Another World",
            "category": "rezero",
            "summary": "Uma narrativa aprofundada explorando o encontro e o romance estelar entre Subaru Natsuki e Anastasia Hoshin, acompanhados por Beatrice, Tia, Eridna e Halibel.",
            "coverColor": "from-purple-600 to-slate-900",
            "chapters": [
                {
                    "id": "tfs-cap1",
                    "number": 1,
                    "title": "Capítulo 1: A Primeira Colisão de Estrelas",
                    "file": os.path.join(base_dir, r"TFS - WTBO\1 - A Primeira Colisão de Estrelas.md")
                },
                {
                    "id": "tfs-cap2",
                    "number": 2,
                    "title": "Capítulo 2: O Doce Despertar das Estrelas",
                    "file": os.path.join(base_dir, r"TFS - WTBO\2 - O Doce Despertar das Estrelas.md")
                }
            ]
        },
        {
            "id": "acordo-mutuo",
            "title": "Um Acordo Mútuo de Felicidade",
            "fandom": "Re:Zero Starting Life in Another World",
            "category": "rezero",
            "summary": "A busca por paz, harmonia e afeto compartilhado na mansão entre Subaru, Beatrice, Petra e a complexidade com a Rem pós-Santuário.",
            "coverColor": "from-emerald-600 to-slate-900",
            "chapters": [
                {
                    "id": "acordo-vol1",
                    "number": 1,
                    "title": "Volume Único",
                    "file": os.path.join(base_dir, r"Um Acordo Mútuo de Felicidade\Um Acordo Mútuo de Felicidade.md")
                }
            ]
        },
        {
            "id": "queda-amado",
            "title": "A Queda daquele Amado pelo Mundo",
            "fandom": "Re:Zero Starting Life in Another World",
            "category": "rezero",
            "summary": "The Fall of the One Beloved by the World. O confronto lendário e existencial entre Reinhard van Astrea e Satella, a Bruxa da Inveja, nas Dunas de Areia de Augria.",
            "coverColor": "from-rose-700 to-indigo-950",
            "chapters": [
                {
                    "id": "queda-cap1",
                    "number": 1,
                    "title": "Capítulo Único: O Duelo nas Dunas de Augria",
                    "file": os.path.join(base_dir, r"The Fall of the One Beloved by the World\A Queda daquele Amado pelo Mundo.md")
                }
            ]
        }
    ]
    
    compiled_stories = []
    
    for s in stories_config:
        s_data = {
            "id": s["id"],
            "title": s["title"],
            "fandom": s["fandom"],
            "category": s["category"],
            "summary": s["summary"],
            "coverColor": s["coverColor"],
            "chapters": []
        }
        for ch in s["chapters"]:
            if os.path.exists(ch["file"]):
                with open(ch["file"], "r", encoding="utf-8") as f:
                    lines = f.readlines()
                meta, body_lines = parse_metadata(lines)
                reader_html, ao3_html = md_to_reader_and_ao3(body_lines)
                
                ch_data = {
                    "id": ch["id"],
                    "number": ch["number"],
                    "title": ch["title"],
                    "meta": meta,
                    "readerHtml": reader_html,
                    "ao3Html": ao3_html
                }
                s_data["chapters"].append(ch_data)
        compiled_stories.append(s_data)
        
    glossary_items = parse_glossary(os.path.join(base_dir, "GLOSSARIO.md"))
    
    data_bundle = {
        "stories": compiled_stories,
        "glossary": glossary_items,
        "author": "CDiangell",
        "ao3Profile": "https://archiveofourown.org/users/CDiangell",
        "githubRepo": "https://github.com/CDiangell-dei/historias"
    }
    
    js_content = f"window.STORIES_DATA = {json.dumps(data_bundle, ensure_ascii=False, indent=2)};"
    
    out_js = os.path.join(base_dir, r"recursos\stories_data.js")
    with open(out_js, "w", encoding="utf-8") as f:
        f.write(js_content)
        
    print(f"Data compiled to {out_js}")

if __name__ == "__main__":
    build_all()
