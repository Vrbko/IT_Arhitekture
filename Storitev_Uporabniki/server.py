import grpc
from concurrent import futures
import user_pb2
import user_pb2_grpc
import bcrypt
from datetime import datetime
import sqlite3
import logging

# Set up logging
logging.basicConfig(
    level=logging.DEBUG,  # Set the logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    format='%(asctime)s - %(levelname)s - %(message)s',  # Log format
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('logs/server.log')
            # You can log to the console or to a file, e.g. logging.FileHandler('server.log')
    ]
)

# Create SQLite database connection and table
def create_db():
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    # Create table if it doesn't exist
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            email TEXT,
            age INTEGER,
            password TEXT  -- Store hashed password
        )
    ''')
    conn.commit()
    conn.close()

# UserService class to handle gRPC calls
class UserService(user_pb2_grpc.UserServiceServicer):
    def CreateUser(self, request, context):
        logging.info(f"Received CreateUser request for username: {request.username}")

        # Hash the password before storing it in the database
        hashed_password = bcrypt.hashpw(request.password.encode('utf-8'), bcrypt.gensalt())
        
        # Connect to the SQLite database
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        
        # Insert the new user into the database (including hashed password)
        c.execute('''
            INSERT INTO users (username, email, age, password)
            VALUES (?, ?, ?, ?)
        ''', (request.username, request.email, request.age, hashed_password))
        
        # Commit the changes and close the connection
        conn.commit()
        
        # Get the user ID of the newly inserted user
        user_id = c.lastrowid
        conn.close()

        logging.info(f"User created successfully with ID: {user_id}  password: {request.password} email {request.email}")

        # Return the response with user details
        user_response = user_pb2.UserResponse(
            user_id=user_id,
            username=request.username,
            email=request.email,
            age=request.age,
            message="User created successfully"
        )
        return user_response

    def GetUser(self, request, context):
        logging.info(f"Received GetUser request for user_id: {request.user_id}")

        # Connect to the SQLite database
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        
        # Query the database to fetch the user by ID
        c.execute('''
            SELECT * FROM users WHERE user_id = ?
        ''', (request.user_id,))
        
        # Fetch the result
        user = c.fetchone()
        conn.close()

        if user:
            logging.info(f"User fetched successfully: {user}")
            # If the user exists, return the response with user details
            user_response = user_pb2.UserResponse(
                user_id=user[0],
                username=user[1],
                email=user[2],
                age=user[3],
                message="User fetched successfully"
            )
            return user_response
        else:
            logging.warning(f"User with ID {request.user_id} not found.")
            # If the user does not exist, return an error message
            user_response = user_pb2.UserResponse(
                user_id=0,
                username="",
                email="",
                age=0,
                message="User not found"
            )
            return user_response

    def Login(self, request, context):
        logging.info(f"Received Login request for username: {request.username}   pass: {request.password}")

        # Connect to the SQLite database
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        
        # Query the database to fetch the user by username
        c.execute('''
            SELECT * FROM users WHERE username = ?
        ''', (request.username,))
        
        # Fetch the result
        user = c.fetchone()
        conn.close()

        if user:
            stored_password = user[4]  # The stored hashed password
            
            # Ensure the provided password is in bytes before comparison
            if bcrypt.checkpw(request.password.encode('utf-8'), stored_password):
                logging.info(f"Login successful for username: {request.username}")
                # If passwords match
                login_response = user_pb2.LoginResponse(
                    success=True,
                    message="Login successful"
                )
            else:
                logging.warning(f"Incorrect password for username: {request.username}")
                # If passwords don't match
                login_response = user_pb2.LoginResponse(
                    success=False,
                    message="Incorrect password"
                )
        else:
            logging.warning(f"User with username {request.username} not found.")
            # If user doesn't exist
            login_response = user_pb2.LoginResponse(
                success=False,
                message="User not found"
            )
        
        return login_response

def serve():
    create_db()  # Ensure the database is created before starting the server
    
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    user_pb2_grpc.add_UserServiceServicer_to_server(UserService(), server)
    server.add_insecure_port('[::]:50051')
    logging.info("Server started on port 50051...")
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    serve()