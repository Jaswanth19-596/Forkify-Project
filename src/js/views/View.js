// import { classof } from 'core-js/core/object';
import { mark } from 'regenerator-runtime';
import icons from '../../img/icons.svg';

// Parent class of Recipe view and Results View

// we are exporting class because it is a parent class and
// we dont create a object of it
export class View {
  _data;
  _errorMessage =
    "Sorry !! Can't find the specified item Please try other item";

  render(data = this._data) {
    // Setting the state object to our current object
    this._data = data;
    console.log(this._data);
    // If the object is empty then return and render the error
    if (!this._data || (Array.isArray(this._data) && this._data.length === 0))
      return this.renderError();

    // Generating the HTML for rendering
    const markup = this._generateMarkup();

    // Removing the already existing HTML in the container
    this._clearParentElement();

    // Inserting the html code into the recipe container
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    // Setting the state object to our current object
    this._data = data;

    // Generating the HTML for rendering
    const markup = this._generateMarkup();

    // creating the new DOM element from the String markup
    const newDOM = document.createRange().createContextualFragment(markup);

    // selecting all the elements from the newDOM
    const newElements = Array.from(newDOM.querySelectorAll('*'));

    // selecting the elements from the existing DOM
    const oldElements = Array.from(this._parentElement.querySelectorAll('*'));
    // traversing through the new elements and finding which elements has changed
    newElements.forEach((newEl, i) => {
      const oldEl = oldElements[i];

      // updating if the element only has text content
      if (
        !oldEl.isEqualNode(newEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        oldEl.textContent = newEl.textContent;
      }

      // updating the attributes i.e the pageno's
      if (!oldEl.isEqualNode(newEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          oldEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  renderSpinner = function () {
    const markup = `
    <div class="spinner">
    <svg>
        <use href="${icons}.svg#icon-loader"></use>
    </svg>
    </div> `;

    // Removing the already existing HTML in the container
    this._clearParentElement();

    // Adding the spinner into the Container
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };

  _clearParentElement() {
    this._parentElement.innerHTML = '';
  }

  renderError(message = this._errorMessage) {
    const markup = `
        <div class="error">
          <div>
            <svg>
              <use href="${icons}.svg#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>`;
    this._clearParentElement();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderSuccess(message = this._message) {
    console.log(message);
    const markup = `
        <div class="message">
          <div>
            <svg>
              <use href="${icons}.svg#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
          </div>`;
    this._clearParentElement();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
