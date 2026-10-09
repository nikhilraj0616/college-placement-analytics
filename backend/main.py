from dotenv import load_dotenv
load_dotenv()  # Load .env before any module reads os.getenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base

# Import all models so they register with Base before create_all
import models.user       # noqa: F401
import models.student    # noqa: F401
import models.company    # noqa: F401
import models.placement  # noqa: F401

# Import routers
from routes.auth import router as auth_router
from routes.students import router as students_router
from routes.placements import router as placements_router
from routes.upload import router as upload_router
from routes.analytics import router as analytics_router
from routes.export import router as export_router

app = FastAPI(title="College Placement Analytics API", version="1.0.0")

# CORS — allow the Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auto-create all DB tables on startup
Base.metadata.create_all(bind=engine)

# Register routers
app.include_router(auth_router)
app.include_router(students_router)
app.include_router(placements_router)
app.include_router(upload_router)
app.include_router(analytics_router)
app.include_router(export_router)


@app.get("/")
def root():
    return {"message": "College Placement Analytics API is running. Visit /docs for Swagger UI."}
