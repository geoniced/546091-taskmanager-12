import {COLORS} from '../const.js';
import {getRandomInteger} from '../utils.js';

const getDescription = () => {
  const descriptions = [
    `Изучить теорию`,
    `Сделать домашку`,
    `Пройти интенсив на соточку`,
  ];

  const randomIndex = getRandomInteger(0, descriptions.length - 1);

  return descriptions[randomIndex];
};

const generateDate = () => {
  const isDate = Boolean(getRandomInteger(0, 1));

  if (!isDate) { // Task does not have a deadline so we should generate a schedule for it later
    return null;
  }

  const maxDaysGap = 7;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);
  const currentDate = new Date();

  currentDate.setHours(23, 59, 59, 999);

  currentDate.setDate(currentDate.getDate() + daysGap);

  return currentDate; // Вместо new Date(currentDate), как подчеркнули в вопросах авторам про это
};

const generateRepeating = () => {
  return {
    mo: false,
    tu: false,
    we: Boolean(getRandomInteger(0, 1)),
    th: false,
    fr: Boolean(getRandomInteger(0, 1)),
    sa: false,
    su: false,
  };
};

const getRandomColor = () => {
  const randomIndex = getRandomInteger(0, COLORS.length - 1);

  return COLORS[randomIndex];
};

export const generateTask = () => {
  const dueDate = generateDate();
  const repeating = dueDate === null
    ? generateRepeating()
    : {
      mo: false,
      tu: false,
      we: false,
      th: false,
      fr: false,
      sa: false,
      su: false,
    };

  return {
    description: getDescription(),
    dueDate,
    repeating,
    color: getRandomColor(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    isArchive: Boolean(getRandomInteger(0, 1)),
  };
};
