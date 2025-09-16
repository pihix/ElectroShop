from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv
import os

if not os.path.exists(".env") and os.path.exists(".env.test"):
    load_dotenv(".env.test")
else:
    load_dotenv(os.getenv("ENV_FILE", ".env"))

class Settings(BaseSettings):
    db_username: str
    db_password: str
    db_hostname: str
    db_port: str
    db_name: str

    secret_key: str
    algorithm: str
    access_token_expire_minutes: int

    model_config = SettingsConfigDict(env_file=os.getenv("ENV_FILE", ".env"), extra="allow")

settings = Settings()
