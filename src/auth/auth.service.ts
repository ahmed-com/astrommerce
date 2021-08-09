import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(dto: AuthCredentialsDto): Promise<void> {
    const { username, password } = dto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    return this.usersRepository.createUser(username, hashedPassword);
  }

  async signIn(dto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const { username, password } = dto;

    const user = await this.usersRepository.findOne({ username });

    const isAuthenticated =
      !!user && (await bcrypt.compare(password, user.password));

    if (!isAuthenticated)
      throw new UnauthorizedException('Please check your login credentials');

    const payload: JwtPayload = { username };

    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }
}
