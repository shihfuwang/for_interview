const { app, BrowserWindow } = require('electron');
const path = require('path');
const { fork } = require('child_process');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true
    }
});
    mainWindow.loadURL('http://localhost:3300/');
}

app.on('ready', () => {
    // 啟動伺服器
    const serverProcess = fork(path.join(__dirname, 'app.js'));

    serverProcess.on('message', (message) => {
        if (message === 'server-started') {
            createWindow();
        }
    });

    // 當 Electron 應用關閉時關閉伺服器
    app.on('will-quit', () => {
        serverProcess.kill();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
