export default (state, elements, i18n) => {
  const { validationAlert, input } = elements;
  switch (state.valid) {
    case 'valid':
      validationAlert.classList.replace('text-danger', 'text-success');
      input.classList.remove('is-invalid');
      validationAlert.textContent = i18n.t('rssAdded');
      input.value = '';
      input.focus();
      break;
    case 'not-valid':
      validationAlert.classList.replace('text-success', 'text-danger');
      input.classList.add('is-invalid');
      validationAlert.textContent = i18n.t('errors.notValid');
      break;
    case 're-link':
      validationAlert.classList.add('text-danger');
      input.classList.add('is-invalid');
      validationAlert.textContent = i18n.t('errors.reLink');
      break;
    default:
      break;
  }
};
