const { Menu } = require('electron');
const { app, BrowserWindow, nativeImage } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const preloadPath = path.join(__dirname, 'preload.js');
Menu.setApplicationMenu(null);

function createWindow() {
  const iconPath = path.join(__dirname, 'assets', 'icon.png');
  const icon = nativeImage.createFromPath(iconPath);

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true
    },
    icon: icon
  });

  win.loadFile('index.html');
  win.setTitle('MxBrowser');
}

app.whenReady().then(() => {
  createWindow();
  
  if (typeof autoUpdater.checkForUpdatesAndNotify === 'function') {
    autoUpdater.checkForUpdatesAndNotify().catch(error => {
      console.error('Error checking for updates:', error);
    });
  } else {
    console.error('autoUpdater.checkForUpdatesAndNotify is not a function');
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

autoUpdater.on('update-available', () => {
  console.log('Update available.');
});

autoUpdater.on('update-downloaded', () => {
  console.log('Update downloaded. Changes will be visable after restarting.');
});
