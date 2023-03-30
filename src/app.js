import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import resources from './locales/index.js';
import render from './render.js';
import updateFeeds from './parser.js'

const getAllOriginsResponse = (url) => {
  const allOriginsLink = 'https://allorigingets.hexlet.app/';
  const workingUrl = new URL(allOriginsLink);
  workingUrl.searchParams.set('disableCache', 'true');
  workingUrl.searchParams.set('url', url);

  return axios.get(workingUrl);
};

export default () => {
  const i18n = i18next.createInstance();
  i18n.init({
    lng: 'ru',
    debug: false,
    resources,
  })
  .then(() => {
    const elements = {
      form: document.querySelector('.rss-form'),
      input: document.querySelector('.form-control'),
      validationAlert: document.querySelector('.feedback'),
    };

    const state = {
      inputForm: {},
      usedUrls: [],
    }
    const watchedState = onChange(state.inputForm, () => {
      const originalState = onChange.target(watchedState);
      render(originalState, elements, i18n);
    });

    elements.input.addEventListener('change', (e) => {
      state.currentValue = e.target.value.trim();
    });
  
    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const schema = yup
        .string()
        .required('not-valid')
        .url('not-valid')
        .notOneOf(state.usedUrls, 're-link');
      schema
        .validate(state.currentValue)
        .then(() => {
          watchedState.valid = 'valid';
          state.usedUrls.push(state.currentValue);
          getAllOriginsResponse(state.currentValue);
        })
        .catch((e) => { 
          watchedState.valid = e.message;
        });
    });
  });
};