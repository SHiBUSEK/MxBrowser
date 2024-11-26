const { Menu, globalShortcut } = require('electron');
const { app, BrowserWindow, nativeImage } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const path = require('path');
const preloadPath = path.join(__dirname, 'preload.js');

Menu.setApplicationMenu(null);
log.transports.file.level = 'info';
log.transports.file.file = path.join(app.getPath('userData'), 'logs', 'main.log');

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
      webviewTag: true,
      sandbox: true,
    },
    icon: icon
  });

  win.loadFile('index.html');
  win.setTitle('MxBrowser');

  globalShortcut.register('Control+Shift+I', () => {
    win.webContents.openDevTools();
  });
}

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
  log.info('Update downloaded. Changes will be visible after restarting:', info);
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
