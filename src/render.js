export default (state, elements, i18n) => {
  switch (state.inputForm.valid) {
    case 'valid':
      elements.informAlert.classList.replace('text-danger', 'text-success');
      elements.formControl.classList.remove('is-invalid');
      elements.informAlert.textContent = i18n.t('rssAdded');
      elements.formControl.value = '';
      elements.formControl.focus();
      break;
    case 'not-valid':
      elements.informAlert.classList.replace('text-success', 'text-danger');
      elements.formControl.classList.add('is-invalid');
      elements.informAlert.textContent = i18n.t('errors.notValid');
      break;
    case 're-link':
      elements.informAlert.classList.add('text-danger');
      elements.formControl.classList.add('is-invalid');
      elements.informAlert.textContent = i18n.t('errors.reLink');
      break;
    default:
      break;
  }
};
