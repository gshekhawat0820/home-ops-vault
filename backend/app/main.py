from fastapi import FastAPI

app = FastAPI(title="Home Ops Vault API")


@app.get("/api/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
