'use strict';
import axios from "axios";
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


const formElement = document.querySelector('.form-search');
const inputElement = document.querySelector('.form-input');
const loader = document.querySelector('.loader-container');
const btnLoadMore = document.querySelector(".btn-load-more");


function showLoader() {
    loader.style.display = 'block';
}
function hideLoader() {
  loader.style.display = 'none';
}

const API_KEY = '41575459-699006cd61f4fecce9ea2d52d';
let page = 1;
let query;
let perPage = 40;


let requestParams = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: perPage,
};

async function searchImages(q, page) {
    const searchParams = new URLSearchParams(requestParams);

    try {
        const response = await axios.get(`https://pixabay.com/api/?${searchParams}`);

        hideLoader();
        const { hits, totalHits } = response.data;
        const gallery = document.querySelector('.gallery');
        const lightbox = new SimpleLightbox('.gallery a', {
            captionType: 'attr',
            captionsData: 'alt',
            captionDelay: 250,
            captionPosition: 'bottom',
            close: true,
            enableKeyboard: true,
            docClose: true,
        });
        lightbox.refresh();
         
        if (page === 1)
            gallery.innerHTML = '';
    
        const galleryHTML = hits.reduce(
            (html, image) =>
                html +
                `<li class="gallery-item">
              <a class="image-link link" href="${image.largeImageURL}">
              <img class="images" data-source="${image.largeImageURL}" alt="${image.tags}" src="${image.webformatURL}" width="360" height="200">
              </a>
              <div class="information">
              <p>Likes: ${image.likes}</p>
              <p>Views: ${image.views}</p>
              <p>Comments: ${image.comments}</p>
              <p>Downloads: ${image.downloads}</p>
        </div>
      </li>`,
            ''
        );
        gallery.insertAdjacentHTML('beforeend', galleryHTML);
        lightbox.refresh();
         
        if (page * perPage >= totalHits) {
            btnLoadMore.style.display = 'none';
            iziToast.error({
                title: 'Error',
                message: "We're sorry, but you've reached the end of search results.",
                position: 'topRight',
            });
        } else {
            btnLoadMore.style.display = 'block';
            const scrollImages = document
                .querySelector('.image-link')
                .getBoundingClientRect().height;
            window.scrollBy({
                top: scrollImages * 2,
                behavior: 'smooth',
            });
        }
         
    } catch (error) {
        hideLoader();

        iziToast.error({
            title: 'Error',
            message: error.message,
            position: 'topRight',
        });
    }
    };


  
    formElement.addEventListener('submit', event => {
        event.preventDefault();

        const searchQuery = inputElement.value.trim();
        page = 1;
        btnLoadMore.style.display = 'none'
        searchImages(searchQuery, page);
        formElement.reset();
    });
    btnLoadMore.addEventListener('click', () => {
  page += 1;
  searchImages(query, page);
});