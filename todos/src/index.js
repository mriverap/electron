const electron = require('electron');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}//main.html`);

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);

  mainWindow.on('closed', _ => {
     app.quit();
  })
});

ipcMain.on('todo:submitted', (event, todostring) => {
  mainWindow.webContents.send('todo:addtolist', todostring);
  addWindow.close();
});

function createAddWindow() {
  addWindow = new BrowserWindow(
    {
      width: 300,
      height: 200,
      title: 'Add New ToDo'
    }
  );
  addWindow.loadURL(`file://${__dirname}//add.html`);
  addWindow.on('closed', () => addWindow = null);
}

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      { 
        label: 'New ToDo',
        click() {
          createAddWindow();
        },
        accelerator: 'Ctrl+N'
      },
      {
        label: 'Clear ToDo List',
        click() {
          mainWindow.webContents.send('clearall');
        },
        accelerator: 'Ctrl+D'
      },
      { 
        label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Command+Q':'Ctrl+Q',
        click() { 
          app.quit();
        }
      }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () { require('electron').shell.openExternal('https://electronjs.org') }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  menuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production') {
  menuTemplate.push({
    label:'Developer',
    submenu: [
      { role: 'reload' },
      {
        label: 'Toggle Developer Tools',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
        accelerator: process.platform === 'darwin'?'Command+Alt+I':'Ctrl+Shift+I'
      }
    ]
  })
}