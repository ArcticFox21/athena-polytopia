const { app, BrowserWindow } = require('electron');
require('./injector.js');

function createWindow () {
  const window = new BrowserWindow({
    backgroundColor: '#111111',
    icon: 'icon/icon.png',
    webPreferences: {
      devTools: false,
      nodeIntegration: true
    }
  });
  window.maximize();
  window.loadFile('app/index.html');
  window.removeMenu();
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
});
