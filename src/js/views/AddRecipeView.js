import { View } from './View';

class AddRecipeView extends View {
  _addRecipe = document.querySelector('.nav__btn--add-recipe');
  _overlay = document.querySelector('.overlay');
  _window = document.querySelector('.add-recipe-window');
  _closeWindow = document.querySelector('.btn--close-modal');
  _upload = document.querySelector('.upload');
  _parentElement = document.querySelector('.add-recipe-window');
  _message = 'Recipe uploaded to the API success fully';
  constructor() {
    super();
    this.addhandlerAddRecipe();
    this.addhandlerCloseRecipe();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  addhandlerAddRecipe(handler) {
    this._addRecipe.addEventListener('click', this.toggleWindow.bind(this));
  }

  addhandlerCloseRecipe(handler) {
    this._closeWindow.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  uploadHandler(handler) {
    this._upload.addEventListener('click', function (e) {
      e.preventDefault();

      // selecting the upload button
      const button = document.querySelector('.upload__btn');
      // if the user clickes anywhere in the form then the form will not be submitted
      if (e.target.closest('.btn') != button) return;

      // Getting all the form data
      const formData = [...new FormData(this)];
      // Converting the form data into an object
      const data = Object.fromEntries(formData);
      // passing control to the controller
      handler(data);
    });
  }
}

export default new AddRecipeView();
