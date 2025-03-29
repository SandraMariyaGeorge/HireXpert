from fastapi import APIRouter, Form
from models.user_model import Users,UserLogin, UserBase
from models.userdetails_model import UserDetails

router = APIRouter(
    prefix="/auth",
    tags=["user"],
)


@router.post("/signup")
async def signup(
    username: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    role: str = Form(...),
):
    userdata = UserBase(username=username, email=email, password=password,role=role)
    user = Users()
    return user.create_user(userdata)

@router.post("/signin")
async def signin(
    username: str = Form(...),
    password: str = Form(...),
):
    user = Users()
    user_data = user.verify_user(username, password)
    userdetails = UserDetails()
    userdetails = userdetails.get_user_details(username)

    if user_data:
        return user.generate_jwt(user_data,userdetails['name'])
    return {"error": "Invalid username or password"}

@router.post("/verify")
async def verify(
    token: str = Form(...),
):
    user = Users()
    return user.verify_jwt(token)

