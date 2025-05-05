import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { UserResponse, LoginResponse } from '../../generated/user_pb';

@Injectable()
export class UsersService implements OnModuleInit {
  private userService: any;  // This will hold the gRPC service methods

  constructor(
    @Inject('USER_PACKAGE') private client: ClientGrpc,  // Injecting the correct client
  ) {}

  onModuleInit() {
    this.userService = this.client.getService('UserService');  // Make sure this matches the service name in your .proto file
  }

  findOne(username: string): Observable<UserResponse> {
    return this.userService.GetUser({ username });
  }

  createUser(username: string, email: string, password: string, age: number): Observable<UserResponse> {
    return this.userService.CreateUser({ username, email, password, age });
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.userService.Login({ username, password });
  }
}