import axios from 'axios';

const getAllOriginsResponse = (url) => {
  const allOriginsLink = 'https://allorigingets.hexlet.app/';
  const workingUrl = new URL(allOriginsLink);
  workingUrl.searchParams.set('disableCache', 'true');
  workingUrl.searchParams.set('url', url);

  return axios.get(workingUrl);
};

export default (state) => {
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

  const fetchFeed = (url) => getAllOriginsResponse(url)
    .then((response) => parseFeed(response.data.contents))
    .then((data) => ({ ...data, url }))
    .catch((err) => {
      throw new Error(`Failed to load feed from URL: ${url}. Error: ${err.message}`);
    });

  const updateFeeds = () => {
    const promises = state.feeds.map((feed) => fetchFeed(feed.url));
    Promise.all(promises)
      .then((feeds) => {
        state.feedsData = feeds;
      })
      .finally(() => setTimeout(updateFeeds, state.updateInterval));
  };

  updateFeeds();
};
