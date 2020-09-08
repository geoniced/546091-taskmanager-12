import {FilterType} from '../const.js';
import {isTaskExpired, isTaskExpiringToday, isTaskRepeating} from "../utils/task.js";

export const filter = {
  [FilterType.ALL]: (tasks) => tasks.filter((task) => !task.isArchive),
  [FilterType.OVERDUE]: (tasks) => tasks.filter((task) => isTaskExpired(task.dueDate)),
  [FilterType.TODAY]: (tasks) => tasks.filter((task) => isTaskExpiringToday(task.dueDate)),
  [FilterType.FAVORITES]: (tasks) => tasks.filter((task) => task.isFavorite),
  [FilterType.REPEATING]: (tasks) => tasks.filter((task) => isTaskRepeating(task.repeating)),
  [FilterType.ARCHIVE]: (tasks) => tasks.filter((task) => task.isArchive),
};
