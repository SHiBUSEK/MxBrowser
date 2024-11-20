const { app, BrowserWindow, nativeImage, autoUpdater } = require('electron');
const path = require('path');

const preloadPath = path.join(__dirname, 'preload.js');

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
  autoUpdater.checkForUpdatesAndNotify();
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
  console.log('Aktualizacja dostępna.');
});

autoUpdater.on('update-downloaded', () => {
  console.log('Aktualizacja pobrana. Aplikacja zostanie zaktualizowana po restarcie.');
});






