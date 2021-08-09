import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() dto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(dto);
  }

  @Post('/signin')
  signIn(@Body() dto: AuthCredentialsDto): Promise<{accessToken: string}> {
    return this.authService.signIn(dto);
  }
}
