import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import resources from './locales/index.js';
import render from './render.js';
import updateFeeds from './parser.js'

// const feedHandler = (state) => {
//   updateFeeds(state)
//     .then((feed) => {
//       if (feed.items.length === 0) {
//         state.inputForm.validation = 'no-rss';
//       } else {
//         state.feeds.push(feed);
//         state.inputForm.validation = 'valid'
//         state.usedUrls = feed.url;
//         console.log(feed.url);
//       }
//     })
// };

export default () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('.form-control'),
    validationAlert: document.querySelector('.feedback'),
    postsBlock: document.querySelector('.posts'),
  };

  const state = {
    inputForm: {},
    usedUrls: [],
    feeds: [],
  }
  const watchedState = onChange(state, (path) => {
    const originalState = onChange.target(watchedState);
    render(originalState, elements, i18n, path);
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
          updateFeeds(state)
          .then((feed) => {
            if (feed.items.length === 0) {
              watchedState.inputForm.validation = 'no-rss';
            } else {
              watchedState.feeds.push(feed);
              watchedState.inputForm.validation = 'valid'
              state.usedUrls.push(state.inputForm.currentValue);
            }
          })
        })
        .catch((e) => {
          console.log(e)
          watchedState.inputForm.validation = e.message;
        });
    });
  });
};