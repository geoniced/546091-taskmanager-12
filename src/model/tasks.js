import Observer from '../utils/observer.js';

export default class Tasks extends Observer {
  constructor() {
    super();
    this._tasks = [];
  }

  setTasks(updateType, tasks) {
    this._tasks = tasks.slice();

    this._notify(updateType);
  }

  getTasks() {
    return this._tasks;
  }

  updateTask(updateType, update) {
    const index = this._tasks.findIndex((task) => task.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting task`);
    }

    this._tasks = [
      ...this._tasks.slice(0, index),
      update,
      ...this._tasks.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addTask(updateType, update) {
    this._tasks = [
      update,
      ...this._tasks
    ];

    this._notify(updateType, update);
  }

  deleteTask(updateType, update) {
    const index = this._tasks.findIndex((task) => task.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting task`);
    }

    this._tasks = [
      ...this._tasks.slice(0, index),
      ...this._tasks.slice(index + 1)
    ];

    this._notify(updateType);
  }

  static adaptToClient(task) {
    const adaptedTask = Object.assign(
        {},
        task,
        {
          dueDate: task.due_date !== null ? new Date(task.due_date) : task.due_date,
          isArchive: task.is_archived,
          isFavorite: task.is_favorite,
          repeating: task.repeating_days
        }
    );

    delete task.due_date;
    delete task.is_archived;
    delete task.is_favorite;
    delete task.repeating_days;

    return adaptedTask;
  }

  static adaptToServer(task) {
    const adaptedTask = Object.assign(
        {},
        task,
        {
          "due_date": task.dueDate instanceof Date ? task.dueDate.toISOString() : null,
          "is_archived": task.isArchive,
          "is_favorite": task.isFavorite,
          "repeating_days": task.repeating
        }
    );

    delete task.dueDate;
    delete task.isArchive;
    delete task.isFavorite;
    delete task.repeating;

    return adaptedTask;
  }
}
