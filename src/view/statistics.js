import flatpickr from "flatpickr";
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from "./smart.js";
import {getCurrentDate} from "../utils/task.js";
import {countCompletedTaskInDateRange} from "../utils/statistics.js";

const renderColorsChart = (colorsCtx, tasks) => {

};

const renderDaysChart = (daysCtx, tasks, dateFrom, dateTo) => {

};

const createStatisticsTemplate = (data) => {
  const {tasks, dateFrom, dateTo} = data;
  const completedTasksCount = countCompletedTaskInDateRange(tasks, dateFrom, dateTo);

  return (
    `<section class="statistic container">
      <div class="statistic__line">
        <div class="statistic__period">
          <h2 class="statistic__period-title">Task Activity DIAGRAM</h2>

          <div class="statistic-input-wrap">
            <input
              class="statistic__period-input"
              type="text"
              placeholder=""
            />
          </div>

          <p class="statistic__period-result">
            In total for the specified period
            <span class="statistic__task-found">${completedTasksCount}</span>
            tasks were fulfilled.
          </p>
        </div>
        <div class="statistic__line-graphic visually-hidden">
          <canvas class="statistic__days" width="550" height="150"></canvas>
        </div>
      </div>

      <div class="statistic__circle">
        <div class="statistic__colors-wrap visually-hidden">
          <canvas class="statistic__colors" width="400" height="300"></canvas>
        </div>
      </div>
    </section>`
  );
};

export default class Statistics extends SmartView {
  constructor(tasks) {
    super();

    this._data = {
      tasks,
      dateFrom: (() => {
        const daysToFullWeek = 6;
        const date = getCurrentDate();
        date.setDate(date.getDate() - daysToFullWeek);
        return date;
      })(),
      dateTo: getCurrentDate(),
    };

    this._colorsChart = null;
    this._datesChart = null;

    this._dateChangeHandler = this._dateChangeHandler.bind(this);

    this._setCharts();
    this._setDatepicker();
  }

  removeElement() {
    super.removeElement();

    if (this._colorsChart !== null || this._datesChart !== null) {
      this._colorsChart = null;
      this._datesChart = null;
    }

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  getTemplate() {
    return createStatisticsTemplate(this._data);
  }

  restoreHandlers() {
    this._setCharts();
    this._setDatepicker();
  }

  _dateChangeHandler([dateFrom, dateTo]) {
    if (!dateFrom || !dateTo) {
      return;
    }

    this.updateData({
      dateFrom,
      dateTo
    });
  }

  _setDatepicker() {
    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }

    this._datepicker = flatpickr(
        this.getElement().querySelector(`.statistic__period-input`),
        {
          mode: `range`,
          dateFormat: `j F`,
          defaultDate: [this._data.dateFrom, this._data.dateTo],
          onChange: this._dateChangeHandler
        }
    );
  }

  _setCharts() {
    if (this._colorsChart !== null || this._datesChart !== null) {
      this._colorsChart = null;
      this._datesChart = null;
    }

    const {tasks, dateFrom, dateTo} = this._data;
    const colorsCtx = this.getElement().querySelector(`.statistic__colors`);
    const daysCtx = this.getElement().querySelector(`.statistic__days`);

    this._colorsChart = renderColorsChart(colorsCtx, tasks);
    this._datesChart = renderDaysChart(daysCtx, tasks, dateFrom, dateTo);
  }
}
