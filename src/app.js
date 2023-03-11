import * as yup from 'yup';
import onChange from 'on-change';

const render = (state) => {
  const informAlert = document.querySelector('.feedback');
  const formControl = document.querySelector('.form-control');
  switch (state.inputForm.valid) {
    case 'valid':
      informAlert.classList.replace('text-danger', 'text-success');
      formControl.classList.remove('is-invalid');
      informAlert.textContent = 'RSS успешно загружен';
      formControl.value = '';
      formControl.focus();
      break;
    case 'not-valid':
      informAlert.classList.replace('text-success', 'text-danger');
      formControl.classList.add('is-invalid');
      informAlert.textContent = 'Ссылка должна быть валидным URL';
      break;
    case 're-link':
      informAlert.classList.add('text-danger');
      formControl.classList.add('is-invalid');
      informAlert.textContent = 'RSS уже существует';
      break;
    default:
      break;
  }
};

export default () => {
  const state = {
    inputForm: {

    },
  }
  const watchedState = onChange(state, () => {
    const originalState = onChange.target(watchedState);
    render(originalState)
  });

  const usedUrls = [];

  const form = document.querySelector('[data="form"]');
  const input = document.querySelector('[data="input"]')

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const inputValue = input.value;
    
    const schema = yup
      .string()
      .url('not-valid')
      .notOneOf(usedUrls, 're-link');
    schema
      .validate(inputValue)
      .then((validatedUrl) => {
        usedUrls.push(validatedUrl);
        watchedState.inputForm.valid = 'valid'
        console.log(watchedState);
      })
      .catch((e) => { 
        watchedState.inputForm.valid = e.message;
        console.log(watchedState)
      });
  
  });

};