// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var user_pb = require('./user_pb.js');

function serialize_user_LoginRequest(arg) {
  if (!(arg instanceof user_pb.LoginRequest)) {
    throw new Error('Expected argument of type user.LoginRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_user_LoginRequest(buffer_arg) {
  return user_pb.LoginRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_user_LoginResponse(arg) {
  if (!(arg instanceof user_pb.LoginResponse)) {
    throw new Error('Expected argument of type user.LoginResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_user_LoginResponse(buffer_arg) {
  return user_pb.LoginResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_user_UserRequest(arg) {
  if (!(arg instanceof user_pb.UserRequest)) {
    throw new Error('Expected argument of type user.UserRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_user_UserRequest(buffer_arg) {
  return user_pb.UserRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_user_UserResponse(arg) {
  if (!(arg instanceof user_pb.UserResponse)) {
    throw new Error('Expected argument of type user.UserResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_user_UserResponse(buffer_arg) {
  return user_pb.UserResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var UserServiceService = exports.UserServiceService = {
  createUser: {
    path: '/user.UserService/CreateUser',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.UserRequest,
    responseType: user_pb.UserResponse,
    requestSerialize: serialize_user_UserRequest,
    requestDeserialize: deserialize_user_UserRequest,
    responseSerialize: serialize_user_UserResponse,
    responseDeserialize: deserialize_user_UserResponse,
  },
  getUser: {
    path: '/user.UserService/GetUser',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.UserRequest,
    responseType: user_pb.UserResponse,
    requestSerialize: serialize_user_UserRequest,
    requestDeserialize: deserialize_user_UserRequest,
    responseSerialize: serialize_user_UserResponse,
    responseDeserialize: deserialize_user_UserResponse,
  },
  login: {
    path: '/user.UserService/Login',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.LoginRequest,
    responseType: user_pb.LoginResponse,
    requestSerialize: serialize_user_LoginRequest,
    requestDeserialize: deserialize_user_LoginRequest,
    responseSerialize: serialize_user_LoginResponse,
    responseDeserialize: deserialize_user_LoginResponse,
  },
};

exports.UserServiceClient = grpc.makeGenericClientConstructor(UserServiceService, 'UserService');
