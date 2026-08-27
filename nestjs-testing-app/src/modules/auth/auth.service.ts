import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(loginDto: any) {
    // Fake authentication logic
    if (loginDto.email === 'test@example.com' && loginDto.password === 'password') {
      const payload = { email: loginDto.email, sub: 'user-123' };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async register(registerDto: any) {
    // Fake registration
    return {
      message: 'User registered successfully',
      user: {
        email: registerDto.email,
        name: registerDto.name,
      }
    };
  }
}
