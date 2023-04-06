import axios from 'axios';

const getProxyUrl = (url) => {
  const urlWithProxy = new URL('/get', 'https://allorigins.hexlet.app');
  urlWithProxy.searchParams.set('url', url);
  urlWithProxy.searchParams.set('disableCache', 'true');
  return urlWithProxy;
};

export default (url, state) => {
  // const proxyUrl = getProxyUrl(url);

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

  const fetchFeed = (url) => axios.get(getProxyUrl(url))
    .then((response) => parseFeed(response.data.contents))
    .then((data) => ({ ...data, url }))
    .catch((err) => {
      throw new Error(`Failed to load feed from URL: ${url}. Error: ${err.message}`);
    });

    const updateFeeds = (state) => {
      const promises = state.feeds.map((feed) => fetchFeed(feed.url));
      Promise.all(promises)
      .then((feeds) => {
        state.feeds = feeds;
      })
      .finally(() => setTimeout(updateFeeds, 5000, state));
    }
    updateFeeds(state);

  return fetchFeed(url);
};
