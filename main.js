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
    autoUpdater.checkForUpdatesAndNotify().catch(() => {});
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

autoUpdater.on('update-available', () => {});
autoUpdater.on('update-downloaded', () => {});
