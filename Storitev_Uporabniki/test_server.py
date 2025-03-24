import grpc
import user_pb2
import user_pb2_grpc
import pytest
import sqlite3

GRPC_ADDRESS = 'localhost:50051'

@pytest.fixture(scope='module')
def stub():
    channel = grpc.insecure_channel(GRPC_ADDRESS)
    return user_pb2_grpc.UserServiceStub(channel)

def test_create_user(stub):
    request = user_pb2.UserRequest(
        username="testuser",
        email="test@example.com",
        age=30,
        password="testpass"
    )
    response = stub.CreateUser(request)
    print(response)
    assert response.user_id > 0
    assert response.username == "testuser"
    assert response.email == "test@example.com"
    assert response.age == 30
    assert response.message == "User created successfully"

def test_get_user_success(stub):
    # Assuming the user_id returned above is 1, adjust if needed
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute("SELECT user_id FROM users WHERE username='testuser'")
    user_id = cursor.fetchone()[0]
    conn.close()

    request = user_pb2.UserRequest(user_id=user_id)
    response = stub.GetUser(request)
    print(response)
    assert response.user_id == user_id
    assert response.username == "testuser"
    assert response.message == "User fetched successfully"

def test_get_user_not_found(stub):
    request = user_pb2.UserRequest(user_id=9999)  # Non-existing user
    response = stub.GetUser(request)
    print(response)
    assert response.user_id == 0
    assert response.message == "User not found"

def test_login_success(stub):
    request = user_pb2.LoginRequest(
        username="testuser",
        password="testpass"
    )
    response = stub.Login(request)
    print(response)
    assert response.success is True
    assert response.message == "Login successful"

def test_login_wrong_password(stub):
    request = user_pb2.LoginRequest(
        username="testuser",
        password="wrongpass"
    )
    response = stub.Login(request)
    print(response)
    assert response.success is False
    assert response.message == "Incorrect password"

def test_login_user_not_found(stub):
    request = user_pb2.LoginRequest(
        username="nonexistent",
        password="nopass"
    )
    response = stub.Login(request)
    print(response)
    assert response.success is False
    assert response.message == "User not found"