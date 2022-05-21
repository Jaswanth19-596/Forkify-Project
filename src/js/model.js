import { API_URL } from './config';
import { getJSON, sendJSON } from './helper';
import recipeView from './views/RecipeView';
import { KEY } from './config.js';

export const loadRecipe = async function (id) {
  try {
    // Getting the data from the API
    const data = await getJSON(`${API_URL}/${id}?key=${KEY}`);

    // Taking the recipe from the object
    state.recipe = data.data.recipe;

    // chaging the names as our convinient names
    // change the names of the attributed in the fetched recipe - removing underscores
    state.recipe = {
      cookingTime: state.recipe.cooking_time,
      publisher: state.recipe.publisher,
      sourceUrl: state.recipe.source_url,
      ingredients: state.recipe.ingredients,
      servings: state.recipe.servings,
      title: state.recipe.title,
      image: state.recipe.image_url,
      id: state.recipe.id,
    };

    // while loading the current recipe we check the bookmarks array
    // if the current recipe is in bookmarks then make its bookmarked as true
    if (state.bookmarks.some(bookmark => bookmark.id === state.recipe.id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    recipeView.renderError();
  }
};

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    pageNo: 1,
  },
  bookmarks: [],
};

export const loadSearchResults = async function (query) {
  try {
    // fetches the results of the search
    const data = await getJSON(`${API_URL}?search=${query}&key=${KEY}`);

    // storing the query in our state object
    state.search.query = query;

    // changing the names of the obtained objects
    const results = data.data.recipes.map(obj => {
      return {
        title: obj.title,
        image: obj.image_url,
        id: obj.id,
        publisher: obj.publisher,
      };
    });
    // making the results display from page 1
    state.search.pageNo = 1;

    // setting the search results to our state
    state.search.results = results;
  } catch (err) {
    console.log(err);
  }
};

// returns the corresponding limited results based on the page number
export const getSearchResultsPage = function (pageNo = state.search.pageNo) {
  // storing the current pageNo in our state
  state.search.pageNo = pageNo;

  const start = (pageNo - 1) * 10;
  const end = pageNo * 10;

  return state.search.results.slice(start, end);
};

// updates the servings when the user clicks increase or decrease
export const updateServings = function (newServings) {
  // updating the ingredients first
  state.recipe.ingredients.forEach(element => {
    element.quantity = (
      element.quantity *
      (newServings / state.recipe.servings)
    ).toFixed(2);
  });
  // updating the noOf servings
  state.recipe.servings = newServings;
};

export const addBookMark = function (recipe) {
  // ADD the bookmark
  state.bookmarks.push(recipe);

  // mark the current recipe as bookmark
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }

  // when user adds new bookmark then store it
  storeBookmarks();
};

export const removeBookMark = function (id) {
  // find the bookmark index
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);

  // remove the bookmark
  state.bookmarks.splice(index, 1);
  state.recipe.bookmarked = false;

  // when user removes new bookmark then store it
  storeBookmarks();
};

storeBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const getLocalStorageBookmarks = function () {
  // getting the bookmarks from the local storage
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  // setting the current bookmarks
  state.bookmarks = bookmarks ? bookmarks : [];
};

export const init = function () {
  getLocalStorageBookmarks();
};

export const uploadRecipeToAPI = async function (newRecipe) {
  try {
    // cleaning the data and taking useful data
    const measures = Object.entries(newRecipe).filter(arr => {
      return arr[0].startsWith('ingredient') && arr[1] !== '';
    });
    const ingredients = measures.map(ing => {
      const quantities = ing[1].split(',');
      if (quantities.length !== 3) {
        throw new Error(
          'Wrong Ingredient format .. Please upload according to the format'
        );
      }
      return {
        quantity: quantities[0] ? +quantities[0] : null,
        unit: quantities[1],
        description: quantities[2],
      };
    });

    const recipe = recipeNameChangerToAPINames(newRecipe);

    const response = await sendJSON(`${API_URL}?key=${KEY}`, recipe);

    const data = response.data.recipe;
    const uploadedrecipe = recipeNameChangerFromAPINames(data);
    console.log(uploadedrecipe);
    updateTheCurrentRecipe(uploadedrecipe);
  } catch (err) {
    throw err.message;
  }
};

const updateTheCurrentRecipe = function (recipe) {
  state.recipe = recipe;
  state.recipe.bookmarked = true;
  state.bookmarks.push(state.recipe);
};

const recipeNameChangerToAPINames = function (newRecipe) {
  const recipe = {
    title: newRecipe.title,
    source_url: newRecipe.sourceUrl,
    image_url: newRecipe.image,
    publisher: newRecipe.publisher,
    servings: +newRecipe.servings,
    cooking_time: newRecipe.cookingTime,
    ingredients: newRecipe.ingredients,
    id: newRecipe.id,
  };
  return recipe;
};

// changes name From API names to
const recipeNameChangerFromAPINames = function (newRecipe) {
  const recipe = {
    title: newRecipe.title,
    sourceUrl: newRecipe.source_url,
    image: newRecipe.image_url,
    publisher: newRecipe.publisher,
    servings: +newRecipe.servings,
    cookingTime: newRecipe.cooking_time,
    ingredients: newRecipe.ingredients,
    id: newRecipe.id,
    key: KEY,
  };
  return recipe;
};
