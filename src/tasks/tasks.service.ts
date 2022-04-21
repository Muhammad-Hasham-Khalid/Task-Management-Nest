import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task, TaskStatus } from './task.model';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(taskId: string): Task {
    return this.tasks.find((task) => task.id === taskId);
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const newTask = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(newTask);
    return newTask;
  }

  deleteTaskById(id: string): Task {
    let deletedTask: Task;

    this.tasks = this.tasks.filter((task) => {
      if (task.id === id) {
        deletedTask = task;
        return false;
      }
      return true;
    });

    return deletedTask;
  }

  updateTaskStatus(id: string, status: TaskStatus) {
    let updatedTask: Task;
    this.tasks = this.tasks.map((task) => {
      if (task.id === id) {
        updatedTask = {
          ...task,
          status,
        };
        return updatedTask;
      }

      return task;
    });

    return updatedTask;
  }
}
