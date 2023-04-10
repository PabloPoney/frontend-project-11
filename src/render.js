const idGeneratorFactory = (counter) => {
  let id = counter;
  return () => {
    return id--;
  }
};

const feedsGenerator = (feeds) => {
  const feedsCardElement = document.createElement('div');
  feedsCardElement.classList.add('card', 'border-0');
  
  const feedsCardBodyElement = document.createElement('div');
  feedsCardBodyElement.classList.add('card-body');

  const feedsCardTitleElement = document.createElement('h2');
  feedsCardTitleElement.classList.add('card-title', 'h4');
  feedsCardTitleElement.textContent = 'Фиды';
  feedsCardBodyElement.appendChild(feedsCardTitleElement);

  const feedsListGroupElement = document.createElement('ul');
  feedsListGroupElement.classList.add('list-group', 'boreder-0', 'rounded-0');

  feeds.forEach((feed) => {
    const itemListElement = document.createElement('li');
    const itemListClasses = [
      "list-group-item",
      "border-0",
      "border-end-0"
    ];
    itemListElement.classList.add(...itemListClasses);

    const itemListTitle = document.createElement('h3');
    itemListTitle.classList.add('h6', 'm-0');
    itemListTitle.textContent = feed.title;


    const itemListDescription = document.createElement('p');
    itemListDescription.classList.add('m-0','small', 'text-black-50');
    itemListDescription.textContent = feed.description;

    itemListElement.appendChild(itemListTitle);
    itemListElement.appendChild(itemListDescription);

    feedsListGroupElement.appendChild(itemListElement);
  });

  feedsCardElement.appendChild(feedsCardBodyElement);
  feedsCardElement.appendChild(feedsListGroupElement);

  return feedsCardElement;
};

const postsGenerator = (posts, elements, state) => {
  const generateId = idGeneratorFactory(posts.length);
  const { modalBlock } = elements;

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

 
  posts.forEach((post) => {
      const itemListElement = document.createElement('li');
      const itemListClasses = [
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-start",
        "border-0",
        "border-end-0"
      ];
      itemListElement.classList.add(...itemListClasses);
  
      const elementId = generateId();
  
      const linkListElement = document.createElement('a');
      const linkListClasses = state.touchedPostsId.has(elementId) ?
        ['fw-normal', 'link-secondary'] :
        ['fw-bold'];
      linkListElement.classList.add(...linkListClasses);
      linkListElement.href = post.link;
      linkListElement.dataset.id = elementId;
      linkListElement.target = '_blank';
      linkListElement.rel = 'noopener noreferrer';
      linkListElement.textContent = post.title;
      linkListElement.addEventListener('click', () => {
        linkListElement.classList.remove('fw-bold');
        linkListElement.classList.add('fw-normal', 'link-secondary');
        state.touchedPostsId.add(elementId);
      });
  
      const buttonListElement = document.createElement('button');
      buttonListElement.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      buttonListElement.dataset.id = elementId;
      buttonListElement.dataset.bsToggle = 'modal';
      buttonListElement.dataset.bsTarget = '#modal';
      buttonListElement.textContent = 'Просмотр';

      buttonListElement.addEventListener('click', () => {
        const modalTitleElement = modalBlock.querySelector('.modal-title');
        const modalTextElement = modalBlock.querySelector('.text-break');
        const modalLinkElement = modalBlock.querySelector('.btn-primary');
        modalTitleElement.textContent = post.title;
        modalTextElement.textContent = post.description;
        modalLinkElement.href = post.link;
        linkListElement.classList.remove('fw-bold');
        linkListElement.classList.add('fw-normal', 'link-secondary');
        state.touchedPostsId.add(elementId);
      });
      
      itemListElement.appendChild(linkListElement);
      itemListElement.appendChild(buttonListElement);
      postsListGroupElement.appendChild(itemListElement);
  });

  postsCardElement.appendChild(postsCardBodyElement);
  postsCardElement.appendChild(postsListGroupElement);

  return postsCardElement;
};

const renderValidation = (state, elements, i18n) => {
  const { validationAlert, input } = elements;
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
    case 'network-error':
      validationAlert.classList.replace('text-success', 'text-danger');
      input.classList.add('is-invalid');
      validationAlert.textContent = i18n.t('errors.networkError');
      break;
    default:
      validationAlert.classList.replace('text-success', 'text-danger');
      input.classList.add('is-invalid');
      validationAlert.textContent = i18n.t('errors.default');
      break;
  }
};

export default (state, elements, i18n, path) => {
  const { postsBlock, feedsBlock } = elements;
  console.log(path);
  switch (path) {
    case 'inputForm.validation':
      renderValidation(state, elements, i18n);
      break;
    case 'feeds':
      const feeds = feedsGenerator(state.feeds);
      while (feedsBlock.firstChild) {
        feedsBlock.removeChild(feedsBlock.firstChild);
      }
      feedsBlock.appendChild(feeds);
      break;
    case 'posts':
      const posts = postsGenerator(state.posts, elements, state);
      while (postsBlock.firstChild) {
        postsBlock.removeChild(postsBlock.firstChild);
      }
      postsBlock.appendChild(posts);
      break;
    default:
      console.log(`error of render to the path:${path}\n`, state);
      break;
  }
};
