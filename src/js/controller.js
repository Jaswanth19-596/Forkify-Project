// For polyfilling async functions
import 'regenerator-runtime/runtime';

// For polyfilling everything
import 'core-js/stable';

import recipeView from './views/RecipeView.js';

import * as model from './model.js';

import resultsView from './views/ResultsView.js';

import SearchView from './views/SearchView.js';

import paginationView from './views/PaginationView.js';

import bookMarkView from './views/BookMarksView';

import addRecipeView from './views/AddRecipeView.js';
import { compileString } from 'sass';
import { START_PAGE_NO, MODAL_CLOSE_WINDOW } from './config.js';
const { get } = require('immutable');

const recipeContainer = document.querySelector('.recipe');

const recipeController = async function () {
  try {
    // rendering the bookmarks from the local storage
    bookMarkView.render(model.state.bookmarks);

    // Getting the hash of the current page
    const id = window.location.hash.slice(1);

    // If the hash is empty then return
    if (!id) return;

    // Render the loading icon while fetching
    recipeView.renderSpinner();

    // update results view to mark the selected item
    resultsView.update(model.getSearchResultsPage());

    // update bookmarks view to mark the selected item
    bookMarkView.render(model.state.bookmarks);

    // Load the recipe
    await model.loadRecipe(id);

    // recipe details came to the model and from model we used it
    let recipe = model.state;

    // rendering the recipe
    recipeView.render(recipe);

    recipeView.addHandlerUpdateServing(controlServings);
  } catch (err) {
    throw err;
  }
};

const controlSearchResults = async function () {
  // Getting the query from the search box
  const query = SearchView.getQuery();

  // When the page loads then there will be no search item
  if (!query) return;

  // Loads the spinner while fetching
  resultsView.renderSpinner();

  // Loads the data from the API
  await model.loadSearchResults(query);

  // render the search results only for 1 page
  resultsView.render(model.getSearchResultsPage(START_PAGE_NO));

  // render the page buttons
  paginationView.render(model.state.search);
};
/**
 *
 * @param {Integer} goToPage Shows the items in the current page
 */
const paginationController = function (goToPage) {
  // render the search results only for new page
  resultsView.render(model.getSearchResultsPage(goToPage));

  // update the pagination view based on the page we are on
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // the servings are minimum for 1 person
  if (newServings < 1) return;
  // update the ingredients and the no of servings in the actual state
  model.updateServings(newServings);
  // update the view
  recipeView.update(model.state);
};

const controlBookMarks = function () {
  // if the item is already bookmarked and the user again clicked on it
  // means un bookmark it
  if (!model.state.recipe.bookmarked) {
    model.addBookMark(model.state.recipe);
  } else {
    model.removeBookMark(model.state.recipe.id);
  }

  // updating the view so that the bookmark button is highlighted
  recipeView.update(model.state);

  // rendering the bookmarks
  bookMarkView.render(model.state.bookmarks);
};

const contolAddRecipe = async function (newRecipe) {
  try {
    // upload the data to recipe
    const recipe = await model.uploadRecipeToAPI(newRecipe);

    // show a success message
    addRecipeView.renderSuccess();

    // close the window after few seconds
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_WINDOW * 1000);

    // update the bookm
    bookMarkView.render(model.state.bookmarks);

    // change the url of the browser to the current recipe id
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    recipeView.render();
  } catch (err) {
    addRecipeView.renderError(err);
  }
};

// Adds the event handlers for all the buttons
const init = function () {
  const button = document.querySelector('.upload__btn');
  // gets the data from local storage and loads bookmarks
  model.init();

  addRecipeView.uploadHandler(contolAddRecipe);
  recipeView.addHandlerRender(recipeController);
  recipeView.addHandlerBookmark(controlBookMarks);
  SearchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerForPageButtonsDisplay(paginationController);
};

init();
