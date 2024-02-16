from fastapi import FastAPI, HTTPException, Depends, status,Header
from typing import Tuple
import models
from database import engine,SessionLocal
from sqlalchemy.orm import Session
from schemas import BlogBase,UserBase,AdminBase
app = FastAPI()
models.Base.metadata.create_all(bind=engine)



def get_db() -> Tuple[Session, ...]:  # Change the return type to Tuple
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = (Session, Depends(get_db))  # Replace Annotated with a regular tuple


# Blogs
@app.post('/blogs/{id}',status_code = status.HTTP_200_OK)
async def create_blog(id:int,blog:BlogBase,db: Session = Depends(get_db)):
    db_blog = models.Blog(UserID=id, **blog.dict())
    db.add(db_blog)
    db.commit()
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
    return {"blogs": all_blogs}

#fecth all the blogs of user
@app.get('/users/{user_id}/blogs/',status_code = status.HTTP_200_OK)
async def fetchUserBlogs(user_id:int,db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.UserID == user_id).first()
    if user is None:
        raise HTTPException(status_code=404,detail='User not found')
    blogs = db.query(models.Blog).filter(models.Blog.UserID == user_id).all()
    return {"user_name":user.FirstName,"blogs":blogs}


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
    return db_user

@app.get('/users/{user_id}',status_code=status.HTTP_200_OK)
async def fetchUser(user_id:int, db:Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.UserID == user_id).first()
    if user is None:
        raise HTTPException(status_code=404,detail='User not found')
    return user 

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












