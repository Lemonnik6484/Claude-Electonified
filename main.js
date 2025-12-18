const { app, BrowserWindow, ipcMain, safeStorage } = require('electron/main')
const Anthropic = require("@anthropic-ai/sdk");
const path = require('node:path')
const fs = require('fs');

function createWindow () {
    const win = new BrowserWindow({
        autoHideMenuBar: true,
        width: 800,
        height: 600,
        minWidth: 550,
        minHeight: 400,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        icon: './icon.png'
    })

    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// Handles

ipcMain.handle('claude-prompt', async (prompt, model) => {
    const anthropic = new Anthropic({
        apiKey: "",
    });

    const msg = await anthropic.messages.create({
        model: "claude-haiku-4-5",
        max_tokens: 1000,
        messages: [
            {
                role: "user",
                content: "What should I search for to find the latest developments in renewable energy? Use markdown in your answer."
            }
        ]
    });
    console.log(msg);
});