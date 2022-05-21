import * as model from '../model.js';
import { RES_PER_PAGE } from '../config.js';
import { View } from './View.js';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    // Getting the current page no
    const pageNo = this._data.pageNo;

    // calculating the no of pages required to display the data
    const numPages = Math.ceil(this._data.results.length / RES_PER_PAGE);

    // if we are on first page and we are on first page
    if (numPages === 1) return ``;

    // if on first page and there are multiple pages
    if (pageNo === 1 && numPages > 1) {
      return this._getNextButton();
    }

    // if it is the last page
    if (pageNo > 1 && pageNo === numPages) {
      return this._getPrevButton();
    }

    // if in the middle page
    if (pageNo > 1 && pageNo < numPages) {
      return this._getPrevButton() + this._getNextButton();
    }
  }

  _getPrevButton(pageNo = this._data.pageNo) {
    return `<button data-goto = ${
      pageNo - 1
    } class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
  <span>Page ${pageNo - 1}</span>
 </button>`;
  }

  _getNextButton(pageNo = this._data.pageNo) {
    return `<button data-goto = ${
      pageNo + 1
    } class="btn--inline pagination__btn--next">
    <span>Page ${pageNo + 1}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
   </button>`;
  }

  addHandlerForPageButtonsDisplay = function (handler) {
    this._parentElement.addEventListener('click', function (event) {
      // selecting the clicked button
      const button = event.target.closest('.btn--inline');

      // if the user clicks out side the button
      if (!button) return;

      // Knowing which page no to go
      const goToPage = +button.dataset.goto;

      // Giving the control back to controller
      handler(goToPage);
    });
  };
}
export default new PaginationView();
