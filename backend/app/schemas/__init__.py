from pydantic import BaseModel, EmailStr


class ChatRequest(BaseModel):
    query: str


# --- Auth schemas ---

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    # Returned after successful register or login
    access_token: str
    token_type: str = "bearer"
