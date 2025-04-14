from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import grpc
import requests
import user_pb2
import user_pb2_grpc

app = FastAPI()

# ----------- gRPC Client Setup -----------
channel = grpc.insecure_channel('localhost:50051')
grpc_stub = user_pb2_grpc.UserServiceStub(channel)

# ----------- Pydantic Models -----------
class AuthRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    username: str
    password: str

# ----------- gRPC GET User -----------
@app.get("/mobile/users/{user_id}")
def get_user(user_id: str):
    try:
        response = grpc_stub.GetUser(user_pb2.UserRequest(id=user_id))
        return {
            "id": response.id,
            "username": response.username,
            "email": response.email
        }
    except grpc.RpcError as e:
        raise HTTPException(status_code=500, detail=str(e))

# ----------- gRPC Login -----------
@app.post("/mobile/auth/login")
def login_user(auth: AuthRequest):
    try:
        response = grpc_stub.Login(user_pb2.LoginRequest(
            username=auth.username,
            password=auth.password
        ))
        return {
            "success": response.success,
            "token": response.token
        }
    except grpc.RpcError as e:
        raise HTTPException(status_code=500, detail=str(e))

# ----------- Login + Get Parts -----------
@app.post("/mobile/auth/loginGetData")
def login_get_data(auth: AuthRequest):
    try:
        login_response = grpc_stub.Login(user_pb2.LoginRequest(
            username=auth.username,
            password=auth.password
        ))

        if not login_response.success:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        # REST call to parts API
        parts_resp = requests.get("http://localhost:3000/parts", params=auth.dict())
        parts_data = parts_resp.json()

        return {
            "login": {
                "success": login_response.success,
                "token": login_response.token
            },
            "parts": parts_data
        }

    except grpc.RpcError as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {e}")
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Parts fetch failed: {e}")

# ----------- gRPC Register User -----------
@app.post("/mobile/auth/register")
def register_user(new_user: RegisterRequest):
    try:
        response = grpc_stub.CreateUser(user_pb2.CreateUserRequest(
            email=new_user.email,
            username=new_user.username,
            password=new_user.password
        ))
        return {
            "success": response.success,
            "user_id": response.id
        }
    except grpc.RpcError as e:
        raise HTTPException(status_code=500, detail=str(e))

# ----------- REST to REST (order via PHP) -----------
@app.post("/mobile/order")
async def create_order(req: Request):
    try:
        body = await req.json()
        response = requests.post("http://localhost:8000/API.php", json=body)
        return response.json()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))

# ----------- REST to REST (get parts) -----------
@app.post("/mobile/catalog")
async def get_catalog(req: Request):
    try:
        body = await req.json()
        response = requests.get("http://localhost:3000/parts", params=body)
        return response.json()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))

# ----------- Run the app -----------
# Use this only for local dev or testing
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)