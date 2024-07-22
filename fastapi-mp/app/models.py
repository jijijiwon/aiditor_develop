from pydantic import BaseModel, EmailStr

class User(BaseModel):
    email: EmailStr
    name: str

class ErrorRequest(BaseModel):
    email: EmailStr
    name: str
    content: str