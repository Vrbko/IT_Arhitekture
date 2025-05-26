# Use an official Python runtime as the base image
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install the specified versions of the required packages
RUN pip install --upgrade pip==25.0.1 && \
    pip install setuptools==77.0.3 && \
    pip install grpcio==1.71.0 && \
    pip install grpcio-tools==1.71.0 && \
    pip install protobuf==5.29.4 && \
    pip install bcrypt==4.3.0 && \
    pip install SQLAlchemy==2.0.39 && \
    pip install typing_extensions==4.12.2

# Expose the necessary port for your service
EXPOSE 50051
RUN mkdir -p app/logs && chmod -R 777 app/logs
# Command to run the application
CMD ["python", "server.py"]
