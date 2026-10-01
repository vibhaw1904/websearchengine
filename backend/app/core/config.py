from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "Perplexity Backend"
    env: str = "development"
    debug: bool = True
    database_url: str = ""
    secret_key: str = "change-me"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    tavily_api_key: str = ""
    openrouter_api_key: str = ""
    openrouter_model: str = "openai/gpt-4o-mini"


settings = Settings()
