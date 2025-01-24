import { app, BrowserWindow, ipcRenderer, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
// import sequelize from './database.js';
// import Feed from './models/Feed.js';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

let mainWindow = null;

const createWindow = () => {

  if (mainWindow) {
    // If window exists, just focus it
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
    return;
  }
  
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    frame: false,
    titleBarStyle: 'hidden',
    vibrancy: 'under-window',
    visualEffectState: 'active',
    title: 'Feedl',
    transparent: true,
    backgroundColor: '#FFFFFF',
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
    // Explicitly quit the app on macOS when the window is closed
    if (process.platform === 'darwin') {
      app.quit();
    }
  });
};

app.whenReady().then(createWindow);

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('window-all-closed', () => {
  console.log('All windows closed');
  if (process.platform !== 'darwin') {
    app.quit();
  } else {
    // In development, force quit on macOS
    if (process.env.NODE_ENV === 'development') {
      app.quit();
    }
  }
});

// Explicitly quit the app on macOS when CMD+Q is invoked
app.on('before-quit', () => {
  console.log('App before-quit');
  if (process.platform === 'darwin') {
    app.exit(); // Ensure a hard exit
  }
});

ipcMain.handle('feed:add', async (event, { 
  title,
  link,
  description,
  language,
  image,
  lastBuildDate,
  items,
  itunes
 }) => {
  return await Feed.create({ 
    title,
    link,
    description,
    language,
    image,
    lastBuildDate,
    items,
    itunes
   })
});

ipcMain.handle('feed:all', async (event) => {
  return await Feed.findAll();
});

ipcMain.handle('feed:get', async (event, id) => {
  return await Feed.findByPk(id);
});

ipcMain.handle('feed:delete', async (event, id) => {
  return await Feed.destroy({ where: { id } });
});

ipcMain.handle('feed:parse', async (event, feedUrl) => {
  console.log('parsing feed:', feedUrl);
  return await Feed.parse(feedUrl);
});
