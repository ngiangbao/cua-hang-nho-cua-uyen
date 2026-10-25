// Cầu nối nhỏ để nút "Kiểm tra cập nhật" trong game gọi được tới bản desktop
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("desktopApp", { checkUpdate: () => ipcRenderer.send("check-update") });
