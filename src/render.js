const generateId = (() => {
  let id = 0;
  return () => id += 1;
})();

const renderPosts = (feed) => {
  const postsCardElement = document.createElement('div');
  postsCardElement.classList.add('card', 'border-0');

  const postsCardBodyElement = document.createElement('div');
  postsCardBodyElement.classList.add('card-body');

  const postsCardTitleElement = document.createElement('h2');
  postsCardTitleElement.classList.add('card-title', 'h4');
  postsCardTitleElement.textContent = 'Посты';
  postsCardBodyElement.appendChild(postsCardTitleElement);

  const postsListGroupElement = document.createElement('ul');
  postsListGroupElement.classList.add('list-group', 'boreder-0', 'rounded-0');

  for (const item of feed.items) {
    const itemListElement = document.createElement('li');
    const itemListClasses = [
      "list-group-item",
      "d-flex","justify-content-between",
      "align-items-start",
      "border-0",
      "border-end-0"
    ];
    itemListElement.classList.add(...itemListClasses);

    const elementId = generateId();

    const linkListElement = document.createElement('a');
    linkListElement.classList.add('fw-bold');
    linkListElement.href = item.link;
    linkListElement.dataset.id = elementId;
    linkListElement.target = '_blank';
    linkListElement.rel = 'noopener noreferrer';
    linkListElement.textContent = item.title;

    const buttonListElement = document.createElement('button');
    buttonListElement.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    buttonListElement.dataset.id = elementId;
    buttonListElement.dataset.bsToggle = 'modal';
    buttonListElement.dataset.bsTarget = '#modal';
    buttonListElement.textContent = 'Просмотр';

    
    itemListElement.appendChild(linkListElement);
    itemListElement.appendChild(buttonListElement);
    postsListGroupElement.appendChild(itemListElement);
  }

  postsCardElement.appendChild(postsCardBodyElement);
  postsCardElement.appendChild(postsListGroupElement);
  return postsCardElement;
};

const renederValidation = (state, elements, i18n) => {
  const { validationAlert, input, posts } = elements;
  switch (state.inputForm.validation) {
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
    case 'no-rss':
      validationAlert.classList.replace('text-success', 'text-danger');
      input.classList.add('is-invalid');
      validationAlert.textContent = i18n.t('errors.noRss');
      break;
    default:
      console.log(state.validation);
      break;
  }
};

export default (state, elements, i18n, path) => {
  const { postsBlock } = elements;
  switch (path) {
    case 'inputForm.validation':
      renederValidation(state,elements, i18n);
      break;
    case 'feeds':
      const posts = renderPosts(state.feeds[0], elements);
      while (postsBlock.firstChild) {
        postsBlock.removeChild(postsBlock.firstChild);
      }
      postsBlock.appendChild(posts);
      break;
    default:
      console.log(state.validation);
      break;
  }
};
