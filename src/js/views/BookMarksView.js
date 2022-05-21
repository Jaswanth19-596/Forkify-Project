import { View } from './View';

class BookMark extends View {
  _parentElement = document.querySelector('.bookmarks__list');

  _generateMarkup() {
    return this._data.map(bookmark => this._generateMarkupPreview(bookmark));
  }

  _generateMarkupPreview(recipe = this._data) {
    const id = window.location.hash.slice(1);
    return `<li class="preview">
        <a class="preview__link ${
          recipe.id === id ? 'preview__link--active' : ''
        }" href="#${recipe.id}">
        <figure class="preview__fig">
        <img src="${recipe.image}" alt="Test" />
        </figure>
        <div class="preview__data">
            <h4 class="preview__title">${recipe.title}</h4>
            <p class="preview__publisher">${recipe.publisher}</p>
        </div>
        </a>
      </li>;`;
  }
}

export default new BookMark();
