// gets the path of the icons in the distribution folder
import icons from '../../img/icons.svg';

import { Fraction } from 'fractional';
import { mark } from 'regenerator-runtime';

import { View } from './View';

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _buttonsParent;
  _errorMessage =
    'We could not find the specified item Please try another item';
  _successMessage = '';

  addHandlerRender(handler) {
    // Listening to the hashchange,load events at once
    ['load', 'hashchange'].forEach(event =>
      window.addEventListener(event, handler)
    );
  }

  addHandlerUpdateServing(handler) {
    this._parentElement.addEventListener('click', function (event) {
      // Getting the button that is clicked
      const button = event.target.closest('.btn--tiny');

      // if the click is happaned outside the div element
      if (!button) return;
      // we stored the current pageno in the dataset and it returns next page
      // if we click next button and viceversa
      const res = +button.dataset.updateTo;

      // giving the control back to the controller
      handler(res);
    });
  }

  addHandlerBookmark(handler) {
    this._parentElement.addEventListener('click', function (event) {
      // select the bookmark button
      const button = event.target.closest('.btn--bookmark');

      // if it is not the bookmark button return
      if (!button) return;
      handler();
    });
  }

  _generateMarkup() {
    const recipe = this._data.recipe;
    return `
    <figure class="recipe__fig">
          <img src=${recipe.image} alt="${recipe.title}" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${recipe.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}.svg#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              recipe.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}.svg#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              recipe.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button data-update-to = ${
                recipe.servings - 1
              } class="btn--tiny btn--decrease-servings">
                <svg>
                  <use href="${icons}.svg#icon-minus-circle"></use>
                </svg>
              </button>
              <button data-update-to = ${
                recipe.servings + 1
              } class="btn--tiny btn--increase-servings">
                <svg>
                  <use href="${icons}.svg#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated ${
            this._data.recipe.key ? '' : 'hidden'
          }}">
            <svg>
              <use href="${icons}.svg#icon-user"></use>
            </svg>
          </div>

          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${icons}.svg#icon-bookmark${
      recipe.bookmarked === true ? '-fill' : ''
    }"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
            ${recipe.ingredients
              .map(ing => {
                return `<li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icons}.svg#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${
                recipe.servings * ing.quantity
                  ? new Fraction(ing.quantity).toString()
                  : ''
              }</div>
              <div class="recipe__description">
                <span class="recipe__unit">${ing.unit}</span>
                ${ing.description}
              </div>
            </li>`;
              })
              .join('')}
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">The Pioneer Woman</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="http://thepioneerwoman.com/cooking/pasta-with-tomato-cream-sauce/"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}.svg#icon-arrow-right"></use>
            </svg>
          </a>
        </div>
      `;
  }
}

export default new RecipeView();
