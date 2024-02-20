from fastapi import FastAPI, APIRouter, HTTPException, Depends, status,Header, Query,Request
import time
from fastapi.middleware.cors import CORSMiddleware
from settings import BLOGS_PER_PAGE
from typing import Tuple,List
import models
from database import engine,SessionLocal
from sqlalchemy.orm import Session
from schemas import BlogBase,UserBase,AdminBase

app = FastAPI()
router = APIRouter()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)
# app.include_router(router)
models.Base.metadata.create_all(bind=engine)

def get_db() -> Tuple[Session, ...]:  
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = (Session, Depends(get_db))


# Blogs
@app.post('/blogs/{user_id}',status_code = status.HTTP_200_OK)
async def create_blog(user_id:int,blog:BlogBase,db: Session = Depends(get_db)):
    db_blog = await models.Blog(UserID=user_id, **blog.dict())
    db.add(db_blog)
    db.commit()
    db.refresh(db_blog)
    return {db_blog} 


@app.get('/blogs/{blogId}',status_code = status.HTTP_200_OK)
async def fetchBlog(blogId:int,db: Session = Depends(get_db)):
    fetchedBlog = db.query(models.Blog).filter(models.Blog.BlogID == blogId).first()
    if fetchBlog is None:
        raise HTTPException(status_code=404,detail='Blog not found')
    return {fetchedBlog}

@app.get('/blogs/', status_code=status.HTTP_200_OK)
async def fetch_all_blogs(db: Session = Depends(get_db)):
    all_blogs = db.query(models.Blog).all()
    return all_blogs

#fecth all the blogs of user
@app.get('/users/{user_id}/blogs/',status_code = status.HTTP_200_OK)
async def fetchUserBlogs(user_id:int,db: Session = Depends(get_db)):
    # user = db.query(models.User).filter(models.User.UserID == user_id).first()
    # if user is None:
    #     raise HTTPException(status_code=404,detail='User not found')
    blogs = db.query(models.Blog).filter(models.Blog.UserID == user_id).all()
    return {blogs}

# fecth all the blogs of user pagewise
@app.get("/blogs/pagewise/{userId}/{page}")
async def get_blogs(page: int,userId:int , db: Session = Depends(get_db)):
    offset = (page - 1) * BLOGS_PER_PAGE
    total_blogs = db.query(models.Blog).count()

    limit = min(BLOGS_PER_PAGE, total_blogs - offset)
    blogs = (
        db.query(models.Blog, models.User.FirstName)
        .join(models.User)
        .filter(models.User.UserID == userId) 
        .order_by(models.Blog.UpdatedAt.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    blog_results = [
        {
            "BlogID": blog.Blog.BlogID,
            "Title": blog.Blog.Title,
            "Content": blog.Blog.Content,
            "UserName": blog.FirstName
        }
        for blog in blogs
    ]
    print(blog_results)
    return blog_results
# update blog
@app.put('/blogs/{blogId}',status_code = status.HTTP_200_OK)
async def updateBlog(blogId:int,blog_data:BlogBase,db: Session = Depends(get_db)):
    db_blog = db.query(models.Blog).filter(models.Blog.BlogID == blogId).first()
    if db_blog is None:
        raise HTTPException(status_code=404,detail='Blog not found')
    if blog_data.Title:
        db_blog.Title = blog_data.Title
    if blog_data.Content:
        db_blog.Content = blog_data.Content
    db.commit()
    db.refresh(db_blog)
    return {"blog": db_blog}

@app.delete('/blogs/{blog_id}',status_code=status.HTTP_200_OK)
async def delete_blog(blog_id:int,db: Session = Depends(get_db)):
    db_blog = db.query(models.Blog).filter(models.Blog.BlogID == blog_id).first()
    if db_blog is None:
        raise HTTPException(status_code=404,detail='Blog not found')
    db.delete(db_blog)
    db.commit()
    return {}

# Users
@app.post('/users/', status_code=status.HTTP_201_CREATED)
async def create_user(user: UserBase, db: Session = Depends(get_db)):
    db_user = models.User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post('/sign-in',status_code=status.HTTP_200_OK)
async def checkForUserInDB(request:Request,db:Session = Depends(get_db)):
    request_data = await request.json()
    email = request_data.get('Email')
    password = request_data.get('Password')
    user = db.query(models.User).filter(models.User.Email == email).first()
    if user is None:
        raise HTTPException(status_code=404,detail='User not found')
    if(user.Password != password):
        raise HTTPException(status_code=404,detail='Incorrect Password')
    return {"UserId":user.UserID}


@app.get('/users/{user_id}',status_code=status.HTTP_200_OK)
async def fetchUser(user_id:int, db:Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.UserID == user_id).first()
    if user is None:
        raise HTTPException(status_code=404,detail='User not found')
    return {"FirstName":user.FirstName,"LastName":user.LastName}

# fecth all the blogs according to page wise 
@app.get("/blogs/pagewise/{page}")
async def get_blogs(page: int , db: Session = Depends(get_db)):
    offset = (page - 1) * BLOGS_PER_PAGE
    total_blogs = db.query(models.Blog).count()

    limit = min(BLOGS_PER_PAGE, total_blogs - offset)
    # blogs = db.query(models.Blog).join(models.User).order_by(models.Blog.UpdatedAt.desc()).offset(offset).limit(limit).all()
    blogs = (
        db.query(models.Blog, models.User.FirstName)
        .join(models.User)
        .order_by(models.Blog.UpdatedAt.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    blog_results = [
        {
            "BlogID": blog.Blog.BlogID,
            "Title": blog.Blog.Title,
            "Content": blog.Blog.Content,
            "UserName": blog.FirstName
        }
        for blog in blogs
    ]
    print(blog_results)
    return blog_results


@app.get('/users/',status_code = status.HTTP_200_OK)
async def fetchUsers(db:Session = Depends(get_db)):
    all_users = db.query(models.User).all()
    return {"users":all_users}

@app.put('/users/username/{id}/',status_code = status.HTTP_200_OK)
async def updateUser(id:int,fName:str,lName:str,db:Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.UserID == id).first()
    if user is None:
        raise HTTPException(status_code=404, detail='User not found')
    if fName:
        user.FirstName = fName
    if lName:
        user.LastName = lName
    db.commit()
    db.refresh(user)
    return {"User": user}


#Update Password
@app.put('/users/password/{id}',status_code = status.HTTP_200_OK)
async def updateUserPassword(id:int,db:Session = Depends(get_db),password: str = Header(..., convert_underscores=False)):
    user = db.query(models.User).filter(models.User.UserID == id).first()
    if user is None:
        raise HTTPException(status_code = 404, details='User Not found')
    user.Password = password
    db.commit()
    db.refresh(user)
    return {"User": user}














