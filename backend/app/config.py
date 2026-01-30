from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET_KEY: str
    GROQ_API_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 120

    model_config = SettingsConfigDict(extra='ignore', env_file=".env", env_file_encoding="utf-8")

settings = Settings()
