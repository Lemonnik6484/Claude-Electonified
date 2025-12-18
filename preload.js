const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("claude", {
    send: async (prompt, model) => ipcRenderer.invoke('claude-prompt', prompt, model)
});