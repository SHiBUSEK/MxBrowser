window.addEventListener('DOMContentLoaded', () => {
  const goButton = document.getElementById('goButton');
  const urlInput = document.getElementById('urlInput');
  const backButton = document.getElementById('backButton');
  const forwardButton = document.getElementById('forwardButton');
  const tabsList = document.getElementById('tabs-list');

   urlInput.value = 'newtab.html';

   goButton.addEventListener('click', () => {
    const newUrl = urlInput.value;
    const activeTabId = document.querySelector('.tab.active').dataset.tabId;
    const activeWebview = document.querySelector(`webview[data-tab-id="${activeTabId}"]`);
    if (activeWebview) {
      if (newUrl.includes(' ') || !newUrl.includes('.')) {
        searchWithDuckDuckGo(newUrl);
      } else {
        navigateToUrl(newUrl);
      }
    }
  });  

  backButton.addEventListener('click', () => {
    const activeTabId = document.querySelector('.tab.active').dataset.tabId;
    const activeWebview = document.querySelector(`webview[data-tab-id="${activeTabId}"]`);
    if (activeWebview) {
      activeWebview.goBack();
    }
  });

  forwardButton.addEventListener('click', () => {
    const activeTabId = document.querySelector('.tab.active').dataset.tabId;
    const activeWebview = document.querySelector(`webview[data-tab-id="${activeTabId}"]`);
    if (activeWebview) {
      activeWebview.goForward();
    }
  });

  tabsList.addEventListener('dblclick', () => {
    const createNewTabEvent = new CustomEvent('create-new-tab');
    document.dispatchEvent(createNewTabEvent);
  });

  document.addEventListener('create-new-tab', () => {
    if (window.createNewTab) {
      window.createNewTab();
    }
  });
});
