from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from starlette.responses import Response
from app.models.user import User

from app.config import settings
from app.database import Base, engine
from app.routes import auth, dashboard, incidents, logs, users, settings as settings_routes, alerts,reports
from app.routes import setup

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.API_VERSION,
    description="Enterprise SOC dashboard API for incident analysis and telemetry.",
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "127.0.0.1", "0.0.0.0", "testserver", "host.docker.internal"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.CORS_ALLOWED_ORIGINS.split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.middleware("http")
async def security_headers(request: Request, call_next):
    response: Response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Cache-Control"] = "no-store"
    return response


app.include_router(auth.router, prefix="/api")
app.include_router(dashboard.router)
app.include_router(logs.router)
app.include_router(incidents.router)
app.include_router(setup.router)
app.include_router(users.router)
app.include_router(settings_routes.router)
app.include_router(alerts.router)
app.include_router(reports.router)

@app.get("/")
def root():
    return {
        "message": "SOC API Running",
        "app": settings.APP_NAME,
        "version": settings.API_VERSION,
    }