import { queryObj } from './js/fetch';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const axios = require('axios').default;
const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const buttonLoadMore = document.querySelector('.load-more');

const gal = new SimpleLightbox('.gallery a', {
  captions: true,
  captionDelay: 250,
});

function clearGallery() {
  gallery.innerHTML = '';
}

function buttonLoadMoreState(param) {
  buttonLoadMore.style.display = param;
}

function searchPictures(event) {
  buttonLoadMoreState('none');
  clearGallery();
  event.preventDefault();
  const query = event.target.searchQuery.value.trim();
  if (query === '') {
    return;
  }
  queryObj.setPage(1);
  queryObj.setQuery(query);
  getPictures(queryObj.returnUrl());
}

searchForm.addEventListener('submit', searchPictures);
buttonLoadMore.addEventListener('click', loadMore);

function loadMore() {
  queryObj.nextPage();
  getPictures(queryObj.returnUrl());
}

function createPhotosHtml(imagesArr) {
  return imagesArr
    .map(image => {
      return `
<div class="photo-card">
  <a class="image-link" href="${image.largeImageURL}"><img src="${image.webformatURL}" alt="${image.tags}"  loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span class="count">${image.likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span class="count">${image.views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span class="count">${image.comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span class="count">${image.downloads}</span>
    </p>
  </div>
</div>`;
    })
    .join('');
}

function scroll() {
  if (queryObj.page !== 1) {
    let { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}

async function getPictures(url) {
  try {
    const response = await axios.get(url);
    const images = response.data.hits;
    if (images.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    if (queryObj.page === 1) {
      Notify.info(`Hooray! We found ${response.data.totalHits} images.`);
    }
    if (queryObj.page * queryObj.perPage > response.data.totalHits) {
      buttonLoadMore.disabled = true;
    }

    buttonLoadMoreState('block');
    gallery.insertAdjacentHTML('beforeend', createPhotosHtml(images));
    scroll();
    gal.refresh();
  } catch (error) {
    Notify.failure(error);
  }
}
