// auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginResponse,UserResponse, UserRequest } from '../../generated/user_pb';  // Adjust the import as needed

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    // Call the login method and get the response
    console.log (pass);
    const loginResponse: LoginResponse = await this.usersService.login(username, pass).toPromise();
  
    // Logging the full response for debugging purposes
    console.log('Login response:', loginResponse);
  
    // Directly access 'success' and 'message' properties if it's a plain object
    const jsonResponse = loginResponse;
    console.log('Success:', jsonResponse["success"]);
  
    // Check if login was successful
    if (jsonResponse["success"] == true) {
      console.log("success");
      const user: UserResponse = await this.usersService.findOne(username).toPromise();
      return user;  // Return user data excluding password
    }
  
    return null;  // If login failed, return null
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    console.log(payload);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: any): Promise<any> {
    // Call the createUser method and pass individual arguments
    const registerResponse: UserResponse = await this.usersService.createUser( user.username, user.email, user.password, user.age).toPromise();
    
    // Logging the full response for debugging purposes
    console.log('Register response:', registerResponse);
  
    // Directly access the response properties like 'message' and 'user_id'
    const jsonResponse = registerResponse;
    console.log('User registration message:', jsonResponse["message"]);
  
    // Check if registration was successful
    if (jsonResponse["message"] === "User created successfully") {
      console.log("Registration successful" + jsonResponse);
      return jsonResponse;  // Return user data excluding password
    }
  
    return null;  // If registration failed, return null
  }
}