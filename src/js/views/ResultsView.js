import { View } from './View';
import icons from '../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');

  _generateMarkup() {
    return this.getRecipies().map(this._generateMarkupPreview).join('');
  }

  _generateMarkupPreview(recipe) {
    const id = window.location.hash.slice(1);
    console.log(recipe);
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
      <div class="recipe__user-generated ${
        recipe.results ? (recipe.results[0].key ? '' : 'hidden') : ''
      }">
      <svg>
        <use href="${icons}.svg#icon-user"></use>
      </svg>
    </div>
    </a>
  </li>;`;
  }

  // Takes the array from the object and returns that
  getRecipies() {
    let arr;
    if (Array.isArray(this._data)) {
      return this._data;
    } else {
      return this._data.search.results;
    }
  }
}

export default new ResultsView();
