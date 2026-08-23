#!/usr/bin/env python3
"""Fail on likely toast-only UI actions without a request/mutation nearby."""
from __future__ import annotations
import argparse
from pathlib import Path
import re
WATCH={"onClick":re.compile(r"onClick\s*=\s*\{?\s*\(?[^)]*\)?\s*=>"),"toast":re.compile(r"showToast\s*\("),"request":re.compile(r"requestCore\s*\(|requestCoreMultipart\s*\(|fetch\s*\(|axios\.|api[A-Z]\w*\s*\(")}
def scan_file(path:Path)->list[tuple[int,str]]:
 lines=path.read_text(encoding="utf-8",errors="ignore").splitlines(); findings=[]
 for i,line in enumerate(lines,1):
  if WATCH["onClick"].search(line) and WATCH["toast"].search(line):
   window="\n".join(lines[max(0,i-3):min(len(lines),i+8)])
   if not WATCH["request"].search(window): findings.append((i,line.strip()))
 return findings
def main()->int:
 ap=argparse.ArgumentParser(); ap.add_argument("--workspace",required=True); ap.add_argument("--repos",nargs="+",required=True); ap.add_argument("--fail-on-findings",action="store_true"); args=ap.parse_args(); root=Path(args.workspace); findings=[]
 for repo in args.repos:
  base=root/repo
  if not base.exists(): raise SystemExit(f"Missing repo path: {base}")
  for path in base.rglob("*.tsx"):
   if "node_modules" in path.parts or "dist" in path.parts: continue
   for line_no,text in scan_file(path): findings.append((repo,str(path.relative_to(base)),line_no,text))
 for repo,path,line_no,text in findings: print(f"REVIEW {repo}/{path}:{line_no}: likely toast-only action: {text}")
 print(f"SUMMARY findings={len(findings)}")
 return 1 if findings and args.fail_on_findings else 0
if __name__=="__main__": raise SystemExit(main())
