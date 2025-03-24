import grpc
import user_pb2
import user_pb2_grpc
import pytest

# Define a function that makes the gRPC call for testing
def test_create_user():
    channel = grpc.insecure_channel('localhost:50051')  # gRPC server address
    stub = user_pb2_grpc.UserServiceStub(channel)

    # Create a request to send to the server
    request = user_pb2.UserRequest(
        username="testuser",
        email="test@example.com",
        password="securepassword"
    )
    response = stub.CreateUser(request)

    # Check that the response is as expected
    assert response.user_id > 0
    assert response.message == "User created successfully"