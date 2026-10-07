"""Render the Markdown document set from docs/source/project.json. Usage: build-docs.py project.json docs/"""
import json, sys, os, datetime
src = json.load(open(sys.argv[1])); out = sys.argv[2]; os.makedirs(out, exist_ok=True)
today = datetime.date.today().isoformat()
def table(headers, rows):
    return "| " + " | ".join(headers) + " |\n| " + " | ".join("---" for _ in headers) + " |\n" + "\n".join("| " + " | ".join(str(c) for c in r) + " |" for r in rows) + "\n"
def write(name, body):
    open(os.path.join(out, name), "w").write(f"# {name[:-3].replace('_',' ').title()}\n\nAs of {today}. Project: {src.get('client','')}. Scenario: {src.get('scenario','')}.\n\n{body}")
na = lambda s: f"Not applicable in {s}.\n"
write("TECH_STACK_ANALYSIS.md", table(["Item","Evidence","Target equivalent","Note"], src.get("stack", [])) or na(src.get("scenario")))
write("DESIGN_TOKENS.md", table(["Token","Value","Source values","Label"], src.get("tokens", [])))
write("COMPONENT_INVENTORY.md", table(["Component","Tier","Decision","Variants","States","Options","Content fields","Pages"], src.get("components", [])))
write("STORYBLOK_SCHEMA.md", table(["Block","Type","Group","Fields","Options","Allowlist","Pages"], src.get("blocks", [])) + "\n## Languages\n" + ", ".join(src.get("languages", [])) + "\n")
write("RISK_REGISTER.md", table(["ID","Risk","Likelihood","Impact","Owner","Mitigation","Status","Gate blocked"], src.get("risks", [])))
write("SITE_MAP.md", "```mermaid\n" + src.get("sitemap_mermaid", "flowchart LR\n  A[Home] --> B[Section]") + "\n```\n\n" + table(["URL","Module","Template","Blocks"], src.get("urls", [])))
write("LAYOUT_ARCHITECTURE.md", src.get("layout_md", "See research set."))
write("INTERACTION_PATTERNS.md", src.get("interactions_md", "See BEHAVIORS.md per page."))
write("ESTIMATE.md", table(["Item class","Count","Low","Typical","High"], src.get("estimate_rows", [])) + f"\nConfidence: +/-{src.get('confidence_pct', 15)} %.\n")
print("rendered Markdown set to", out)
