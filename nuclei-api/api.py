from fastapi import FastAPI
import subprocess, json

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/scan")
def scan(data: dict):
    target = data.get("target", "")
    if not target:
        return {"error": "no target provided"}
    try:
        result = subprocess.run(
            ["nuclei", "-u", target, "-jsonl", "-silent",
             "-severity", "medium,high,critical", "-timeout", "10"],
            capture_output=True, text=True, timeout=350
        )
        findings = []
        for line in result.stdout.strip().split("\n"):
            if line.strip():
                try:
                    findings.append(json.loads(line))
                except:
                    pass
        return {"target": target, "findings": findings, "count": len(findings)}
    except Exception as e:
        return {"error": str(e), "findings": [], "count": 0}