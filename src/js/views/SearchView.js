class SearchView {
  // form element is the parent element
  #parentElement = document.querySelector('.search');

  // Gets the search item entered by the user
  getQuery() {
    const query = this.#parentElement.querySelector('.search__field').value;

    // Clear the input field
    this.#clearInputField();
    return query;
  }

  // Invokes When the user clicks submit or clicks enter on keyboard
  addHandlerSearch(handler) {
    this.#parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }

  #clearInputField() {
    this.#parentElement.querySelector('.search__field').value = '';
  }
}

export default new SearchView();
