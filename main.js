const { Menu, globalShortcut, Notification } = require('electron');
const { app, BrowserWindow, nativeImage, session } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const path = require('path');
const preloadPath = path.join(__dirname, 'preload.js');

Menu.setApplicationMenu(null);
log.transports.file.level = 'info';
log.transports.file.file = path.join(app.getPath('userData'), 'logs', 'main.log');

let mainWindow;

function createWindow() {
  const iconPath = path.join(__dirname, 'assets', 'icon.png');
  const icon = nativeImage.createFromPath(iconPath);

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true,
      sandbox: true,
    },
    icon: icon
  });

  mainWindow.setMinimumSize(450, 300);
  mainWindow.loadFile('index.html');
  mainWindow.setTitle('MxBrowser');

  globalShortcut.register('Control+Shift+I', () => {
    mainWindow.webContents.openDevTools();
  });

  session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
    processUrlMiddleware(details.url, callback);
  });
}

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

const normalizeUrl = (url) => {
  let normalizedUrl = url.trim();

  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl = 'https://' + normalizedUrl;
  }

  normalizedUrl = normalizedUrl.replace(/^(https?:\/\/)(www\.)?www\./i, '$1$2');

  return normalizedUrl;
};

const searchWithDuckDuckGo = (query) => {
  const searchUrl = `https://duckduckgo.com/?t=h_&q=${encodeURIComponent(query)}&ia=web`;
  mainWindow.webContents.executeJavaScript(`
    var activeWebview = document.querySelector('webview[style*="display: block"]');
    if (activeWebview) {
      activeWebview.src = '${searchUrl}';
    }
  `);
};

const openUrl = (url, fallbackUrl, callback) => {
  fetch(url)
    .then(response => {
      if (response.ok) {
        callback({ cancel: true, url: url });
      } else {
        fetch(fallbackUrl).then(httpResponse => {
          if (httpResponse.ok) {
            callback({ cancel: true, url: fallbackUrl });
          } else {
            callback({ cancel: true });
            searchWithDuckDuckGo(url);
          }
        }).catch(() => {
          callback({ cancel: true });
          searchWithDuckDuckGo(url);
        });
      }
    })
    .catch(() => {
      fetch(fallbackUrl).then(httpResponse => {
        if (httpResponse.ok) {
          callback({ cancel: true, url: fallbackUrl });
        } else {
          callback({ cancel: true });
          searchWithDuckDuckGo(url);
        }
      }).catch(() => {
        callback({ cancel: true });
        searchWithDuckDuckGo(url);
      });
    });
};

const processUrlMiddleware = (url, callback) => {
  if (url.endsWith('.html') || url.endsWith('.css') || isValidUrl(url)) {
    callback({ cancel: false });
    return;
  }

  const normalizedUrl = normalizeUrl(url);
  const httpUrl = normalizedUrl.replace(/^https:\/\//i, 'http://');

  openUrl(normalizedUrl, httpUrl, callback);
};

app.whenReady().then(() => {
  createWindow();

  if (typeof autoUpdater.checkForUpdatesAndNotify === 'function') {
    log.info('Checking for updates and notifying if available.');
    autoUpdater.checkForUpdatesAndNotify().catch(error => {
      log.error('Error checking for updates:', error);
    });
  }

  globalShortcut.register('Control+Shift+I', () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
      focusedWindow.webContents.openDevTools();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

autoUpdater.on('update-available', (info) => {
  log.info('Update available:', info);
});

autoUpdater.on('update-downloaded', (info) => {
  log.info('The changes will be visible after restarting the application.:', info);
  
  const options = {
    title: 'MxBrowser Update Available',
    body: 'A new version of MxBrowser is available. It will be installed the next time you restart the application.',
    icon: path.join(__dirname, 'assets', 'icon.png')
  };
  new Notification({ title: options.title, body: options.body, icon: options.icon }).show();
});

autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update...');
});

autoUpdater.on('update-not-available', (info) => {
  log.info('Update not available:', info);
});

autoUpdater.on('error', (err) => {
  log.error('Error in auto-updater:', err);
});

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}% (${progressObj.transferred}/${progressObj.total})`;
  log.info(log_message);
});
