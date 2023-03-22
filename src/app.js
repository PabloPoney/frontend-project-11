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
      form: document.querySelector('[data="form"]'),
      input: document.querySelector('[data="input"]'),
      informAlert: document.querySelector('.feedback'),
      formControl: document.querySelector('.form-control'),
    };

    const state = {
      inputForm: {},
    }
    const watchedState = onChange(state, () => {
      const originalState = onChange.target(watchedState);
      render(originalState, elements, i18n);
    });
    const usedUrls = [];
  
    elements.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const inputValue = elements.input.value;
      
      const schema = yup
        .string()
        .url('not-valid')
        .notOneOf(usedUrls, 're-link');
      schema
        .validate(inputValue)
        .then((validatedUrl) => {
          usedUrls.push(validatedUrl);
          watchedState.inputForm.valid = 'valid';
        })
        .catch((e) => { 
          watchedState.inputForm.valid = e.message;
        });

    });
  });
};