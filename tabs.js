document.addEventListener('DOMContentLoaded', () => {
  let tabCount = 1;

  document.getElementById('newTabButton').addEventListener('click', () => {
    tabCount++;
    const newTabId = `tab-${tabCount}`;
    const newTab = document.createElement('li');
    newTab.className = 'tab';
    newTab.dataset.tabId = tabCount;
    newTab.textContent = `Tab ${tabCount}`;
    document.getElementById('tabs-list').appendChild(newTab);

    const newWebview = document.createElement('webview');
    newWebview.src = 'https://example.com';
    newWebview.dataset.tabId = tabCount;
    newWebview.style.display = 'none';
    document.getElementById('webview-container').appendChild(newWebview);

    switchTab(tabCount);
  });

  function switchTab(tabId) {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tabId == tabId);
    });

    document.querySelectorAll('webview').forEach(webview => {
      webview.style.display = webview.dataset.tabId == tabId ? 'block' : 'none';
    });

    const switchTabEvent = new CustomEvent('switch-tab', { detail: { tabId } });
    document.dispatchEvent(switchTabEvent);
  }

  document.getElementById('tabs-list').addEventListener('click', event => {
    if (event.target.classList.contains('tab')) {
      switchTab(event.target.dataset.tabId);
    }
  });

  document.getElementById('goButton').addEventListener('click', () => {
    const newUrl = document.getElementById('urlInput').value;
    const activeWebview = document.querySelector('webview[style*="display: block"]');
    if (activeWebview) {
      activeWebview.src = newUrl;
    }
  });

  document.getElementById('urlInput').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const newUrl = document.getElementById('urlInput').value;
      const activeWebview = document.querySelector('webview[style*="display: block"]');
      if (activeWebview) {
        activeWebview.src = newUrl;
      }
    }
  });

  switchTab(1);
});
