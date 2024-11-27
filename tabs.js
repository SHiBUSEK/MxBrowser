document.addEventListener('DOMContentLoaded', () => {
  let tabCount = 1;
  const newTabUrl = 'newtab.html';

  function createNewTab() {
    tabCount++;
    const newTabId = `tab-${tabCount}`;
    const newTab = document.createElement('li');
    newTab.className = 'tab';
    newTab.dataset.tabId = tabCount;
    newTab.innerHTML = `New Tab <button class="close-tab">×</button>`;
    document.getElementById('tabs-list').appendChild(newTab);

    const newWebview = document.createElement('webview');
    newWebview.src = newTabUrl;
    newWebview.dataset.tabId = tabCount;
    newWebview.style.display = 'none';
    newWebview.addEventListener('did-finish-load', () => {
      updateTabTitle(newWebview, newTabId);
    });
    document.getElementById('webview-container').appendChild(newWebview);

    switchTab(tabCount);
  }

  function updateTabTitle(webview, tabId) {
    webview.executeJavaScript('document.title').then(title => {
      document.querySelector(`li[data-tab-id="${tabId}"]`).innerHTML = `${title} <button class="close-tab">×</button>`;
    });
  }

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

  document.getElementById('newTabButton').addEventListener('click', createNewTab);

  document.getElementById('tabs-list').addEventListener('click', event => {
    if (event.target.classList.contains('tab')) {
      switchTab(event.target.dataset.tabId);
    } else if (event.target.classList.contains('close-tab')) {
      const tab = event.target.parentNode;
      const tabId = tab.dataset.tabId;
      document.querySelector(`webview[data-tab-id="${tabId}"]`).remove();
      tab.remove();
      if (document.querySelectorAll('.tab.active').length === 0 && document.querySelectorAll('.tab').length > 0) {
        switchTab(document.querySelector('.tab').dataset.tabId);
      }
    }
  });

  document.getElementById('goButton').addEventListener('click', () => {
    const newUrl = document.getElementById('urlInput').value;
    const activeWebview = document.querySelector('webview[style*="display: block"]');
    if (activeWebview) {
      activeWebview.src = newUrl;
      updateTabTitle(activeWebview, activeWebview.dataset.tabId);
    }
  });

  document.getElementById('urlInput').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const newUrl = document.getElementById('urlInput').value;
      const activeWebview = document.querySelector('webview[style*="display: block"]');
      if (activeWebview) {
        activeWebview.src = newUrl;
        updateTabTitle(activeWebview, activeWebview.dataset.tabId);
      }
    }
  });

  const firstWebview = document.getElementById('webview');
  firstWebview.src = newTabUrl;
  firstWebview.addEventListener('did-finish-load', () => {
    updateTabTitle(firstWebview, '1');
  });

  switchTab(1);
});
