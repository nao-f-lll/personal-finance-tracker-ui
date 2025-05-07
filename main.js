const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    //fullscreen: false,
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, 'renderer.js')
    }
  });
  win.maximize();
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);