from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "Perplexity Backend"
    env: str = "development"
    debug: bool = True
    database_url: str = ""
    secret_key: str = "change-me"
    tavily_api_key: str = ""


settings = Settings()
