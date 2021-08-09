import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  private logger = new Logger('TasksReppository', { timestamp: true });

  async createTask(dto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = dto;
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });
    await this.save(task);
    return task;
  }

  async getTasks(dto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = dto;

    const query = this.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        // please notice that without the wrapping parentheses this condition won't be treated as one singular condition
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(taks.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = query.getMany();
      return tasks;
    } catch (err) {
      this.logger.error(
        `Failed to get tasks for user "${
          user.username
        }". Filters "${JSON.stringify(dto)}"`,
        err.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
