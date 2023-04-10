const idGeneratorFactory = (counter) => {
  let id = counter;
  return () => {
    return id--;
  };
};

const cardBlockGenerator = (titleName) => {
  const cardBlock = document.createElement('div');
  cardBlock.classList.add('card', 'border-0');

  const titleBlock = document.createElement('div');
  titleBlock.classList.add('card-body');

  const titleElement = document.createElement('h2');
  titleElement.classList.add('card-title', 'h4');
  titleElement.textContent = titleName;
  titleBlock.appendChild(titleElement);

  const listGroupBlock = document.createElement('ul');
  listGroupBlock.classList.add('list-group', 'boreder-0', 'rounded-0');

  cardBlock.appendChild(titleBlock);
  cardBlock.appendChild(listGroupBlock);

  return cardBlock;
};

const feedsRender = (state, elements, i18n) => {
  const { feedsBlock } = elements;
  while (feedsBlock.firstChild) {
    feedsBlock.removeChild(feedsBlock.firstChild);
  }

  const { feeds } = state;

  const feedsCardBlock = cardBlockGenerator(i18n.t('feeds'));
  const feedsListGroupBlock = feedsCardBlock.querySelector('.list-group');

  feeds.forEach((feed) => {
    const feedListElement = document.createElement('li');
    feedListElement.classList.add(
      'list-group-item',
      'border-0',
      'border-end-0'
    );

    const feedListTitle = document.createElement('h3');
    feedListTitle.classList.add('h6', 'm-0');
    feedListTitle.textContent = feed.title;

    const feedListDescription = document.createElement('p');
    feedListDescription.classList.add('m-0', 'small', 'text-black-50');
    feedListDescription.textContent = feed.description;

    feedListElement.appendChild(feedListTitle);
    feedListElement.appendChild(feedListDescription);

    feedsListGroupBlock.appendChild(feedListElement);
  });
  feedsBlock.appendChild(feedsCardBlock);
};

const postsRender = (state, elements, i18n) => {
  const { posts } = state;
  const generateId = idGeneratorFactory(posts.length);

  const { postsBlock, modalBlock } = elements;
  while (postsBlock.firstChild) {
    postsBlock.removeChild(postsBlock.firstChild);
  }

  const postsCardBlock = cardBlockGenerator(i18n.t('posts'));
  const postsListGroupBlock = postsCardBlock.querySelector('.list-group');

  posts.forEach((post) => {
    const elementId = generateId();

    const postListElement = document.createElement('li');
    const postListElementClasses = [
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    ];
    postListElement.classList.add(...postListElementClasses);

    const postListLink = document.createElement('a');
    postListLink.href = post.link;
    postListLink.dataset.id = elementId;
    postListLink.target = '_blank';
    postListLink.rel = 'noopener noreferrer';
    postListLink.textContent = post.title;

    const postListLinkClasses = state.touchedPostsId.has(elementId)
      ? ['fw-normal', 'link-secondary']
      : ['fw-bold'];
    postListLink.classList.add(...postListLinkClasses);

    const toTouchLink = () => {
      postListLink.classList.remove('fw-bold');
      postListLink.classList.add('fw-normal', 'link-secondary');
      state.touchedPostsId.add(elementId);
    };

    postListLink.addEventListener('click', toTouchLink);

    postListElement.appendChild(postListLink);

    const postListButton = document.createElement('button');
    postListButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    postListButton.dataset.id = elementId;
    postListButton.dataset.bsToggle = 'modal';
    postListButton.dataset.bsTarget = '#modal';
    postListButton.textContent = 'Просмотр';

    postListButton.addEventListener('click', () => {
      const modalTitleElement = modalBlock.querySelector('.modal-title');
      const modalTextElement = modalBlock.querySelector('.text-break');
      const modalLinkElement = modalBlock.querySelector('.btn-primary');

      modalTitleElement.textContent = post.title;
      modalTextElement.textContent = post.description;
      modalLinkElement.href = post.link;

      toTouchLink();
    });

    postListElement.appendChild(postListButton);
    postsListGroupBlock.appendChild(postListElement);
  });

  postsBlock.appendChild(postsCardBlock);
};

const feedbackAlertRender = (state, elements, i18n) => {
  const { feedbackAlert, input } = elements;
  switch (state.inputForm.status) {
    case 'valid':
      feedbackAlert.classList.replace('text-danger', 'text-success');
      feedbackAlert.textContent = i18n.t('rssAdded');
      input.classList.remove('is-invalid');
      input.value = '';
      input.focus();
      break;
    case 'not-valid':
      feedbackAlert.classList.replace('text-success', 'text-danger');
      feedbackAlert.textContent = i18n.t('errors.notValid');
      input.classList.add('is-invalid');
      break;
    case 're-link':
      feedbackAlert.classList.add('text-danger');
      feedbackAlert.textContent = i18n.t('errors.reLink');
      input.classList.add('is-invalid');
      break;
    case 'no-rss':
      feedbackAlert.classList.replace('text-success', 'text-danger');
      feedbackAlert.textContent = i18n.t('errors.noRss');
      input.classList.add('is-invalid');
      break;
    case 'network-error':
      feedbackAlert.classList.replace('text-success', 'text-danger');
      feedbackAlert.textContent = i18n.t('errors.networkError');
      input.classList.add('is-invalid');
      break;
    default:
      feedbackAlert.classList.replace('text-success', 'text-danger');
      feedbackAlert.textContent = i18n.t('errors.default');
      input.classList.add('is-invalid');
      break;
  }
};

export const renderSwitch = (path, state, elements, i18n) => {
  switch (path) {
    case 'inputForm.status':
      feedbackAlertRender(state, elements, i18n);
      break;
    case 'feeds':
      feedsRender(state, elements, i18n);
      break;
    case 'posts':
      postsRender(state, elements, i18n);
      break;
    default:
      feedbackAlertRender(state, elements, i18n);
      console.log(`error of render to the path:${path}\n`, state);
      break;
  }
};
