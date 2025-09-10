from app.main import app
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:5174",  # ton frontend React
    "http://127.0.0.1:5174",  # parfois React lance sur 127.0.0.1 au lieu de localhost
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # on autorise seulement ton frontend
    allow_credentials=True,
    allow_methods=["*"],          # autoriser toutes les méthodes (GET, POST, etc.)
    allow_headers=["*"],          # autoriser tous les headers
)
