from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    # Database Config
    db_username: str
    db_password: str
    db_hostname: str
    db_port: str
    db_name: str

    # JWT Config
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int

    class Config:
        env_file = os.getenv("ENV_FILE", ".env")


settings = Settings()
