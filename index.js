window.addEventListener('DOMContentLoaded', function() {
  const queryString = require('query-string');

  const inputEl = document.getElementById('url-input');
  const formEl = document.getElementById('url-form');

  // Output Els
  const titleEl = document.getElementById('title');
  const descriptionEl = document.getElementById('description');
  const iconEl = document.getElementById('icon');
  const imageEl = document.getElementById('image');
  const keywordsEl = document.getElementById('keywords');
  const siteNameEl = document.getElementById('siteName');
  const typeEl = document.getElementById('type');
  const fullDataEl = document.getElementById('full-data');

  const spinnerContainer = document.getElementById('spinner');
  const outputContainer = document.getElementById('output');

  function fetchAndDisplayMetadata(url) {
    spinnerContainer.classList.remove('hidden');
    spinnerContainer.classList.remove('hidden-faded');

    fetch('https://tengam.org/api/v1/metadata', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        "objects": [
          { "url":  url }
        ]
      })
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      throw new Error("Response not OK");
    })
    .then((metadata) => {
      outputContainer.classList.remove('hidden');
      spinnerContainer.classList.add('hidden-faded');
      if (!metadata[0]) {
        throw new Error('No metadata response, possible API error?');
      }

      const data = metadata[0];
      titleEl.innerText = data.title;
      descriptionEl.innerText = data.description;
      iconEl.src = data.icon;
      imageEl.src = data.image;
      keywordsEl.innerText = data.keywords.join(', ');
      siteNameEl.innerText = data.siteName;
      typeEl.innerText = data.type;
      const value = JSON.stringify(data, null, 2);
      fullDataEl.value = value;

      const longestLineLength = value.split('\n').reduce((longest, current) => {
        if (longest < current.length) {
          return current.length;
        } else {
          return longest;
        }
      }, 0);

      fullDataEl.rows = value.split('\n').length;
      fullDataEl.cols = longestLineLength;
    });

  }

  formEl.addEventListener('submit', function(event) {
    const urlValue = inputEl.value;
    if (!urlValue) {
      event.preventDefault();
      return false;
    }

    fetchAndDisplayMetadata(urlValue);
    location.search = queryString.stringify({
      url: urlValue
    });

    event.preventDefault();
    return false;
  });

  const parsed = queryString.parse(location.search);
  if (parsed.url) {
    const url = decodeURIComponent(parsed.url);
    inputEl.value = url;
    fetchAndDisplayMetadata(url);
  }
});
