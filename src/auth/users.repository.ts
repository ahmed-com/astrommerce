import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CustomLogger } from 'src/Logger/CustomLogger';
import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  private logger: CustomLogger;

  constructor() {
    super();

    this.logger = new CustomLogger('UsersRepository', {
      timestamp: true,
      stage: process.env.STAGE,
    });
  }

  async createUser(username: string, password: string): Promise<void> {
    const user = this.create({ username, password });
    try {
      await this.save(user);
    } catch (err) {
      if (err.code == 23505) {
        throw new ConflictException('Username already exists!');
      } else {
        this.logger.error(
          `Failed to save user : ${JSON.stringify(user)}`,
          err.stack,
        );
        throw new InternalServerErrorException();
      }
    }
    return;
  }
}
