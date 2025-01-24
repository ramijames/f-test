import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import started from 'electron-squirrel-startup';
import { Sequelize, DataTypes } from 'sequelize'
import RSSParser from 'rss-parser';

if (started) {
  app.quit();
}

// Get user data path from Electron
const userDataPath = app.getPath('userData');
const dataDir = path.join(userDataPath, 'data');

// Create data directory if it doesn't exist
if (!fs.existsSync(dataDir)){
    fs.mkdirSync(dataDir, { recursive: true });
}

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(dataDir, 'database.sqlite')
})

console.log('Database path:', sequelize.options.storage); // /Users/ramijames/Library/Application Support/f-test/data/database.sqlite

const parser = new RSSParser();

const Feed = sequelize.define('Feed', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  language: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  lastBuildDate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  items: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  itunes: {
    type: DataTypes.JSON,
    allowNull: true,
  },
});

Feed.delete = async (id) => {
  return await Feed.destroy({
    where: { id }
  });
};

Feed.parse = async (url) => {
  try {
    const feed = await parser.parseURL(url);
    console.log('Feed parsed:', feed);
    return feed;
  } catch (error) {
    throw new Error(`Failed to parse feed: ${error.message}`);
  }
};

// Sync DB
sequelize.sync().then(async () => {
  console.log('Database synced');

  // Check if the test feed already exists to avoid duplicates
  // const existingFeed = await Feed.findOne({ where: { title: 'Test Feed' } });
  // if (!existingFeed) {
    // Add a test Feed
    try {
      const testFeed = await Feed.create({
        title: 'Another Test Feed',
        link: 'blah',
        description: 'One test feed',
        language: 'en',
        image: { url: 'https://example.com/image.png' },
        lastBuildDate: '2023-10-27',
        items: [],
        itunes: {},
      });
      console.log('Test Feed added:', testFeed.toJSON());
    } catch (err) {
      console.error('Error adding Test Feed:', err);
    }
  // } else {
  //   console.log('Test Feed already exists:', existingFeed.toJSON());
  // }
});

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
