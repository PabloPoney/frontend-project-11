import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import resources from './locales/index.js';
import render from './render.js';
import { fetchFeed, updateFeeds } from './parser.js'
import _ from 'lodash';

const feedHandler = (state, watchedState, url) => {
  fetchFeed(url)
  .then((feed) => {
    if (feed.items.length === 0) {
      console.log('no-rss');
      watchedState.inputForm.validation = 'no-rss';
    } else {
      watchedState.inputForm.validation = 'valid'
      watchedState.feeds.push({
        title: feed.title,
        url: feed.url,
        description: feed.description,
      });
      const newPosts = _.differenceWith(feed.items, state.posts, _.isEqual);
      watchedState.posts = [ ...newPosts, ...state.posts ];
      state.usedUrls.push(feed.url);
    }
  })
  .finally(() => {
    state.inputForm.validation = null;
  })
};

export default () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('.form-control'),
    validationAlert: document.querySelector('.feedback'),
    postsBlock: document.querySelector('.posts'),
  };

  const state = {
    inputForm: {
      currentValue: null,
      validation: null,
    },
    feeds: [],
    posts: [],
    usedUrls: [],
  }
  const watchedState = onChange(state, (path) => {
    render(state, elements, i18n, path);
    console.log(path, state);
  });

  const i18n = i18next.createInstance();
  i18n.init({
    lng: 'ru',
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
        .catch((e) => {
          console.log(e)
          watchedState.inputForm.validation = e.message;
          state.inputForm.validation = null;
        });
    });
  });

  updateFeeds(state, watchedState);
};
