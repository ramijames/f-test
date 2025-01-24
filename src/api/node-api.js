import { lstat } from 'fs/promises'
import { cwd } from 'process'
import { ipcRenderer, ipcMain } from 'electron'

ipcRenderer.on('main-process-message', (_event, ...args) => {
  console.log('[Receive Main-process message]:', ...args)
})

lstat(cwd()).then(stats => {
  console.log('[fs.lstat]', stats)
}).catch(err => {
  console.error(err)
})

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