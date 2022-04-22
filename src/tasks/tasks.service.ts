import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task, TaskStatus } from './task.model';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }

    return tasks;
  }

  getTaskById(taskId: string): Task {
    const found = this.tasks.find((task) => task.id === taskId);

    if (!found) {
      throw new NotFoundException(`Task with id ${taskId} not found.`);
    }

    return found;
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
