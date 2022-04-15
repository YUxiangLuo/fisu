// preload.js
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getNodes: (url) => ipcRenderer.invoke("get_nodes", [url]),
  openFile: () => ipcRenderer.invoke('open_file')
})