// auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginResponse,UserResponse } from '../../generated/user_pb';  // Adjust the import as needed

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    // Call the login method and get the response
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
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}