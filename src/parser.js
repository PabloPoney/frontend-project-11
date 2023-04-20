import axios from 'axios';
import _ from 'lodash';

const getProxyUrl = (url) => {
  const urlWithProxy = new URL('/get', 'https://allorigins.hexlet.app');
  urlWithProxy.searchParams.set('url', url);
  urlWithProxy.searchParams.set('disableCache', 'true');
  return urlWithProxy;
};

const parseFeed = (xml) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');
  const title = doc.querySelector('title')?.textContent;
  const description = doc.querySelector('description')?.textContent;
  const items = Array.from(doc.querySelectorAll('item')).map((item) => ({
    title: item.querySelector('title')?.textContent,
    description: item.querySelector('description')?.textContent,
    link: item.querySelector('link')?.textContent,
  }));
  return { title, description, items };
};

export const fetchFeed = (url) => axios.get(getProxyUrl(url))
  .then((response) => ({ ...parseFeed(response.data.contents), url }))
  .catch(() => {
    throw new Error('network-error');
  });

export const updateFeeds = (state, watchedState) => {
  const promises = state.feeds.map((feed) => fetchFeed(feed.url));
  Promise.all(promises)
    .then((feeds) => {
      feeds.forEach((feed) => {
        const newPosts = _.differenceWith(feed.items, state.posts, _.isEqual);
        if (newPosts.length > 0) {
          watchedState.posts = [...newPosts, ...state.posts];
        }
      });
    })
    .finally(() => setTimeout(updateFeeds, 5000, state, watchedState));
};
