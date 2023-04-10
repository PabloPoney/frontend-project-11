import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import resources from './locales/index.js';
import { render } from './render.js';
import { fetchFeed, updateFeeds } from './parser.js';

const feedHandler = (state, watchedState, url) => {
  fetchFeed(url)
  .then((feed) => {
    if (feed.items.length !== 0) {
      watchedState.inputForm.status = 'valid';

      const newFeed = {
        title: feed.title,
        url: feed.url,
        description: feed.description,
      };
      watchedState.feeds = [ newFeed, ...state.feeds ];
      watchedState.posts = [ ...feed.items, ...state.posts ];

      state.usedUrls.push(feed.url);
      state.inputForm.currentValue = null;
    } else {
      watchedState.inputForm.status = 'no-rss';
    }
  })
  .catch((err) => {
    console.log('feedHandler:', err);
    watchedState.inputForm.status = err.message;
  });
};

export const app = () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('.form-control'),
    feedbackAlert: document.querySelector('.feedback'),
    postsBlock: document.querySelector('.posts'),
    feedsBlock: document.querySelector('.feeds'),
    modalBlock: document.getElementById('modal'),
  };

  const state = {
    lng: 'ru',
    inputForm: {
      currentValue: null,
      status: null,
    },
    feeds: [],
    posts: [],
    touchedPostsId: new Set(),
    usedUrls: [],
  };
  const watchedState = onChange(state, (path) => {
    render(path, state, elements, i18n);
  });

  const i18n = i18next.createInstance();
  i18n.init({
    lng: state.lng,
    debug: false,
    resources,
  })
  .then(() => {
    elements.input.addEventListener('change', (e) => {
      state.inputForm.currentValue = e.target.value.trim();
    });
  
    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const schema = yup
        .string()
        .required('not-valid')
        .url('not-valid')
        .notOneOf(state.usedUrls, 're-link');
      schema
        .validate(state.inputForm.currentValue)
        .then(() => {
          feedHandler(state, watchedState, state.inputForm.currentValue);
        })
        .catch((err) => {
          watchedState.inputForm.status = err.message;
        })
        .finally(() => {
          state.inputForm.status = null;
        });
    });
  });

  updateFeeds(state, watchedState);
};
