from sqlalchemy import  Column, Integer, String, Text, TIMESTAMP, ForeignKey
from database import Base
from sqlalchemy.sql import func

class User(Base):
    __tablename__ = "Users"
    UserID = Column(Integer, primary_key=True, index=True)
    Email = Column(String(255), unique=True, index=True, nullable=False)
    Password = Column(String(255), nullable=False)
    FirstName = Column(String(50), nullable=False)
    LastName = Column(String(50), nullable=False)

class Blog(Base):
    __tablename__ = "Blogs"
    BlogID = Column(Integer, primary_key=True, index=True)
    UserID = Column(Integer, ForeignKey("Users.UserID"), nullable=False)
    Title = Column(String(255), nullable=False)
    Content = Column(Text, nullable=False)
    CreatedAt = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    UpdatedAt = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now(), nullable=False)

class Admin(Base):
    __tablename__ = "Admins"
    AdminID = Column(Integer, primary_key=True, index=True)
    UserID = Column(Integer, ForeignKey("Users.UserID"), nullable=False)
    FirstName = Column(String(50), nullable=False)
    LastName = Column(String(50), nullable=False)
    Email = Column(String(255), unique=True, index=True, nullable=False)
    Password = Column(String(255), nullable=False)
