import grpc
import user_pb2
import user_pb2_grpc

def run():
    channel = grpc.insecure_channel('localhost:50051')
    stub = user_pb2_grpc.UserServiceStub(channel)

    # Create a new user with a password
    user_request = user_pb2.UserRequest(username="john_doe", email="john.doe@example.com", age=30, password="securepassword")
    response = stub.CreateUser(user_request)
    print(f"CreateUser Response: {response.message}, User ID: {response.user_id}")

    # Login with username and password
    login_request = user_pb2.LoginRequest(username="john_doe", password="securepassword")
    login_response = stub.Login(login_request)
    print(f"Login Response: {login_response.message}, Success: {login_response.success}")

    # Fetch the user by ID
    user_request = user_pb2.UserRequest(user_id=response.user_id)
    response = stub.GetUser(user_request)
    print(f"GetUser Response: {response.message}, Username: {response.username}, Email: {response.email}, Age: {response.age}")

if __name__ == '__main__':
    run()