import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const APIKEY = '34983881-8eebfecbf2b0cd36b89881ac8';
export const queryObj = {
  perPage: 40,
  query: '',
  page: 1,
  returnUrl() {
    return `https://pixabay.com/api/?key=${APIKEY}&q=${this.query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.perPage}&page=${this.page}`;
  },
  nextPage() {
    this.page += 1;
  },
  setQuery(query) {
    this.query = query;
  },
  setPage(page) {
    this.page = page;
  },
};
