window.addEventListener('DOMContentLoaded', () => {
  const goButton = document.getElementById('goButton');
  const urlInput = document.getElementById('urlInput');
  const backButton = document.getElementById('backButton');
  const forwardButton = document.getElementById('forwardButton');
  const webview = document.getElementById('webview');

  goButton.addEventListener('click', () => {
    let url = urlInput.value;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'http://' + url;
    }
    webview.src = url;
  });

  backButton.addEventListener('click', () => {
    webview.goBack();
  });

  forwardButton.addEventListener('click', () => {
    webview.goForward();
  });

  webview.addEventListener('did-navigate', (event) => {
    urlInput.value = event.url;
  });
});





