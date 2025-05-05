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
    // Send login request and await the response
    const loginResponse: LoginResponse = await this.usersService.login(username, pass).toPromise();
  
    // Check if the login was successful
    if (loginResponse.getSuccess) {
      // Login was successful, now fetch the user data (without the password field, since it's not in UserResponse)
      const user: UserResponse = await this.usersService.findOne(username).toPromise();
  
      // Return the user data (no password field exists, so just return the full response)
      return user;
    }
  
    // If login fails, return null
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}