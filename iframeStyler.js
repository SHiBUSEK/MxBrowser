if (!window.iframeStylerInitialized) {
  console.log('IframeStyler: Initializing...');
  window.iframeStylerInitialized = true;

  document.addEventListener('DOMContentLoaded', () => {
    console.log('IframeStyler: Loaded and waiting for webviews...');

    const applyStylesToActiveWebview = () => {
      const activeWebview = document.querySelector('webview[style*="display: block"]');
      if (!activeWebview) return;

      if (!activeWebview.hasAttribute('dom-ready-registered')) {
        activeWebview.addEventListener('dom-ready', () => {
          executeStylesOnWebview(activeWebview);
        });
        activeWebview.setAttribute('dom-ready-registered', 'true');
      } else {
        executeStylesOnWebview(activeWebview);
      }
    };

    const executeStylesOnWebview = (webview) => {
      try {
        const shadowRoot = webview.shadowRoot;
        if (!shadowRoot) return;

        const iframe = shadowRoot.querySelector('iframe');
        if (!iframe) return;

        iframe.style.height = '100%';
        iframe.style.width = '100%';
        iframe.style.border = 'none';
      } catch (error) {
        console.error('IframeStyler: Error accessing or styling iframe:', error);
      }
    };

    document.addEventListener('switch-tab', applyStylesToActiveWebview);
    applyStylesToActiveWebview();
  });
}
