from pydantic import BaseModel

class BlogBase(BaseModel):
    Title: str
    Content: str

class UserBase(BaseModel):
    Email: str
    Password: str
    FirstName: str
    LastName: str

class AdminBase(BaseModel):
    Email: str
    Password: str
    FirstName: str
    LastName: str