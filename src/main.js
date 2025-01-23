import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

let mainWindow = null;

const createWindow = () => {
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

  // Open the DevTools in dev mode only
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Explicitly quit the app on macOS when CMD+Q is invoked
app.on('before-quit', () => {
  if (process.platform === 'darwin') {
    app.exit(); // Ensure a hard exit
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  } else {
    // In development, force quit on macOS
    if (process.env.NODE_ENV === 'development') {
      app.quit();
    }
  }
});


// ipcMain.handle('feed:add', async (event, { 
//   title,
//   link,
//   description,
//   language,
//   image,
//   lastBuildDate,
//   items,
//   itunes
//  }) => {
//   return await Feed.create({ 
//     title,
//     link,
//     description,
//     language,
//     image,
//     lastBuildDate,
//     items,
//     itunes
//    })
// });

// ipcMain.handle('feed:all', async (event) => {
//   return await Feed.findAll();
// });

// ipcMain.handle('feed:get', async (event, id) => {
//   return await Feed.findByPk(id);
// });

// ipcMain.handle('feed:delete', async (event, id) => {
//   return await Feed.destroy({ where: { id } });
// });

// ipcMain.handle('feed:parse', async (event, feedUrl) => {
//   console.log('parsing feed:', feedUrl);
//   return await Feed.parse(feedUrl);
// });
