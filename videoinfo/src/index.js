const electron = require('electron');
const ffmpeg = require('fluent-ffmpeg');

const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;

app.on('ready', _ => {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(`file:\\${__dirname}\\index.html`);
    mainWindow.on('closed', _ => {
        mainWindow = null;
    });
});

ipcMain.on('video:submit', (event, path) => {
  console.log('Path: ', path);
  ffmpeg.ffprobe(path, (err, metadata) => {
      mainWindow.webContents.send(
        'video:metadata', 
        metadata.format.duration);
  });
});