import AbstractView from './abstract.js';
import {COLORS} from '../const.js';
import {isTaskExpired, isTaskRepeating, humanizeTaskDueDate} from '../utils/task.js';
import {renderTemplate, RenderPosition} from '../utils/render.js';

const BLANK_TASK = {
  color: COLORS[0],
  description: ``,
  dueDate: null,
  repeating: {
    mo: false,
    tu: false,
    we: false,
    th: false,
    fr: false,
    sa: false,
    su: false,
  },
};

const createTaskEditDateTemplate = (dueDate, isDueDate) => {
  return (
    `<button class="card__date-deadline-toggle" type="button">
      date: <span class="card__date-status">${isDueDate ? `yes` : `no`}</span>
    </button>

    ${isDueDate ? `<fieldset class="card__date-deadline">
      <label class="card__input-deadline-wrap">
        <input
          class="card__date"
          type="text"
          placeholder=""
          name="date"
          value="${dueDate !== null ? humanizeTaskDueDate(dueDate) : ``}"
        />
      </label>
    </fieldset>` : ``}
    `
  );
};

const createTaskEditRepeatingTemplate = (repeating, isRepeating) => {
  return (
    `<button class="card__repeat-toggle" type="button">
      repeat:<span class="card__repeat-status">${isRepeating ? `yes` : `no`}</span>
    </button>

    ${isRepeating ? `<fieldset class="card__repeat-days">
      <div class="card__repeat-days-inner">
        ${Object.entries(repeating).map(([day, repeat]) => `<input
          class="visually-hidden card__repeat-day-input"
          type="checkbox"
          id="repeat-${day}"
          name="repeat"
          value="${day}"
          ${repeat ? `checked` : ``}
        />
        <label class="card__repeat-day" for="repeat-${day}"
          >${day}</label
        >`).join(``)}
      </div>
    </fieldset>` : ``}`
  );
};

const createTaskEditColorsTemplate = (currentColor) => {
  return COLORS.map((color) => `<input
      type="radio"
      id="color-${color}"
      class="card__color-input card__color-input--${color} visually-hidden"
      name="color"
      value="${color}"
      ${currentColor === color ? `checked` : ``}
    />
    <label
      for="color-${color}"
      class="card__color card__color--${color}"
      >${color}</label
    >`
  ).join(``);
};

const createTaskEditTemplate = (task, option) => {
  const {color, description, dueDate, repeating} = task;
  const {isDueDate, isRepeating} = option;

  const deadlineClassName = isTaskExpired(dueDate)
    ? `card--deadline`
    : ``;
  const dateTemplate = createTaskEditDateTemplate(dueDate, isDueDate);

  const repeatingClassName = isRepeating
    ? `card--repeat`
    : ``;
  const repeatingTemplate = createTaskEditRepeatingTemplate(repeating, isRepeating);

  const colorsTemplate = createTaskEditColorsTemplate(color);

  return (
    `<article class="card card--edit card--${color} ${deadlineClassName} ${repeatingClassName}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >${description}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                ${dateTemplate}

                ${repeatingTemplate}
              </div>
            </div>

            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
                ${colorsTemplate}
              </div>
            </div>
          </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit">save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`
  );
};

export default class TaskEdit extends AbstractView {
  constructor(task) {
    super();
    this._task = task || BLANK_TASK;
    this._option = {
      isDueDate: Boolean(this._task.dueDate),
      isRepeating: isTaskRepeating(this._task.repeating),
    };

    this._formSubmitHandler = this._formSubmitHandler.bind(this);

    this._enableDueDateToggler();
    this._enableRepeatingToggler();
  }

  getTemplate() {
    return createTaskEditTemplate(this._task, this._option);
  }

  /*
    Схема активации работы тогглеров:
      1. Получаем элемент
      2. Определяем функцию-хендлер
        1) Удаляем связанные с тогглером элементы из разметки
        2) Создаем новый шаблон по результату события
          * Так как тоггл – смена значения на противоположное
        3) Рендерим новый шаблон вместо старого
        4) Меняем уже значение этой опции тогглера
        5) Вешаем обработчик на новый отрендеренный элемент
      3. Вешаем обработчик на элемент
  */

  _enableDueDateToggler() {
    const element = this.getElement();

    const dueDateToggleHandler = (evt) => {
      evt.preventDefault();

      // Стираем разметку, которая была
      element.querySelector(`.card__date-deadline-toggle`).remove();
      if (element.querySelector(`.card__date-deadline`)) {
        element.querySelector(`.card__date-deadline`).remove();
      }

      // Создаем новую, уже с результатом нажатия по кнопке (противоположное значение – то что мы хотим достичь кликом)
      const dateTemplate = createTaskEditDateTemplate(this._task.dueDate, !this._option.isDueDate);
      renderTemplate(element.querySelector(`.card__dates`), dateTemplate, RenderPosition.AFTERBEGIN);

      // Устанавливаем новые данные
      this._option.isDueDate = !this._option.isDueDate;

      // Добавляем обработчик на уже новую разметку, обработчик будет делать то же самое
      element
        .querySelector(`.card__date-deadline-toggle`)
        .addEventListener(`click`, dueDateToggleHandler);
    };

    // Вешаем обработчик
    element
      .querySelector(`.card__date-deadline-toggle`)
      .addEventListener(`click`, dueDateToggleHandler);
  }

  _enableRepeatingToggler() {
    const element = this.getElement();

    const repeatingToggleHandler = (evt) => {
      evt.preventDefault();

      element.querySelector(`.card__repeat-toggle`).remove();
      if (element.querySelector(`.card__repeat-days`)) {
        element.querySelector(`.card__repeat-days`).remove();
      }

      // При isRepeating === true, мы удаляем класс потому что мы делаем карточку от "обратных" свойств, что будет видно дальше
      if (!this._option.isRepeating) {
        element.classList.add(`card--repeat`);
      } else {
        element.classList.remove(`card--repeat`);
      }

      const repeatingTemplate = createTaskEditRepeatingTemplate(this._task.repeating, !this._option.isRepeating);
      renderTemplate(element.querySelector(`.card__dates`), repeatingTemplate, RenderPosition.BEFOREEND);

      this._option.isRepeating = !this._option.isRepeating;

      element
        .querySelector(`.card__repeat-toggle`)
        .addEventListener(`click`, repeatingToggleHandler);
    };

    element
      .querySelector(`.card__repeat-toggle`)
      .addEventListener(`click`, repeatingToggleHandler);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._task);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }
}
