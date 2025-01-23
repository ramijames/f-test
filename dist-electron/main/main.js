"use strict";
const electron = require("electron");
const path = require("node:path");
const started = require("electron-squirrel-startup");
if (started) {
  electron.app.quit();
}
let mainWindow = null;
const createWindow = () => {
  mainWindow = new electron.BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    },
    frame: false,
    titleBarStyle: "hidden",
    vibrancy: "under-window",
    visualEffectState: "active",
    title: "Feedl",
    transparent: true,
    backgroundColor: "#FFFFFF"
  });
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};
electron.app.whenReady().then(() => {
  createWindow();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
electron.app.on("before-quit", () => {
  if (process.platform === "darwin") {
    electron.app.exit();
  }
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  } else {
    if (process.env.NODE_ENV === "development") {
      electron.app.quit();
    }
  }
});
