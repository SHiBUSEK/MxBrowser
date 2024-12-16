if (!window.iframeStylerInitialized) {
  window.iframeStylerInitialized = true;

  document.addEventListener('DOMContentLoaded', () => {

    const applyStylesToActiveWebview = () => {
      const activeWebview = document.querySelector('webview[style*="display: block"]');
      if (activeWebview && !activeWebview.hasAttribute('dom-ready-registered')) {
        activeWebview.addEventListener('dom-ready', () => executeStylesOnWebview(activeWebview));
        activeWebview.setAttribute('dom-ready-registered', 'true');
      } else if (activeWebview) {
        executeStylesOnWebview(activeWebview);
      }
    };

    const executeStylesOnWebview = (webview) => {
      const iframe = webview?.shadowRoot?.querySelector('iframe');
      if (iframe) Object.assign(iframe.style, { height: '100%', width: '100%', border: 'none' });
    };

    document.addEventListener('switch-tab', applyStylesToActiveWebview);
    applyStylesToActiveWebview();
  });
}
