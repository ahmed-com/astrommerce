import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(username : string , password: string): Promise<void> {

    const user = this.create({ username, password });
    try {
      await this.save(user);
    } catch (err) {
      if (err.code == 23505) {
        throw new ConflictException('Username already exists!');
      } else {
        throw new InternalServerErrorException();
      }
    }
    return;
  }
}
