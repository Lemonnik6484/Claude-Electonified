const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("claude", {
    prompt: async (prompt, model) => ipcRenderer.invoke('prompt', prompt, model)
});

contextBridge.exposeInMainWorld("storage", {
    saveKey: (key) => ipcRenderer.invoke('saveKey', key),
    loadKey: () => ipcRenderer.invoke('loadKey')
});