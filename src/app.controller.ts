import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './repositories/user-repository';
import { CreateUserBody } from './dtos/create-user-body';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth/auth.service';


@Controller('app')
export class AppController {
  constructor(private userRepository: UserRepository, private authService: AuthService) {}

  @Post("register")
  async register(@Body() body: CreateUserBody) {
    const {email, password} = body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create(email, hashedPassword);
    
    return user;
  }


  @Post('login')
  async login(@Body() body: CreateUserBody) {
    const { email, password } = body;

    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return this.authService.login(user);
  }
}
