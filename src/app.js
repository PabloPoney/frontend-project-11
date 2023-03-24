import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import resources from './locales/index.js';
import render from './render.js';

export default () => {
  const i18n = i18next.createInstance();
  i18n.init({
    lng: 'ru',
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
        .url('not-valid')
        .notOneOf(state.usedUrls, 're-link');
      schema
        .validate(state.currentValue)
        .then(() => {
          watchedState.valid = 'valid';
          state.usedUrls.push(state.currentValue);
        })
        .catch((e) => { 
          watchedState.valid = e.message;
        });
    });
  });
};