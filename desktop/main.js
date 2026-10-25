// Bản desktop: chạy bản web qua một máy chủ nội bộ để YouTube, service worker và bản lưu hoạt động như trên trình duyệt
const { app, BrowserWindow, shell, Menu, dialog, ipcMain } = require("electron");
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

// Cổng cố định để bản lưu (localStorage) luôn gắn với cùng một địa chỉ
const PORT = 38917;
const ROOT = path.join(__dirname, "app");
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json", ".webmanifest": "application/manifest+json", ".png": "image/png", ".svg": "image/svg+xml", ".ico": "image/x-icon" };

app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

function startServer(port) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
      let file = path.normalize(path.join(ROOT, urlPath === "/" ? "index.html" : urlPath));
      if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
      fs.readFile(file, (err, data) => {
        if (err) { res.writeHead(404); return res.end("Not found"); }
        res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-cache" });
        res.end(data);
      });
    });
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => resolve(server.address().port));
  });
}

async function createWindow() {
  let port;
  try { port = await startServer(PORT); } catch (e) { port = await startServer(0); }
  const win = new BrowserWindow({
    width: 1600, height: 900, minWidth: 960, minHeight: 540,
    backgroundColor: "#2d2424", autoHideMenuBar: true, title: "Cửa hàng nhỏ của Uyên",
    icon: path.join(ROOT, "icons", "icon-512.png"),
    show: !process.env.SMOKE_TEST,
    webPreferences: { contextIsolation: true, sandbox: true, preload: path.join(__dirname, "preload.js") },
  });
  Menu.setApplicationMenu(null);
  // Mở liên kết ngoài (ví dụ tìm nhạc YouTube) bằng trình duyệt của máy
  const isLocal = url => url.startsWith(`http://127.0.0.1:${port}`);
  win.webContents.setWindowOpenHandler(({ url }) => { if (/^https?:/.test(url)) shell.openExternal(url); return { action: "deny" }; });
  win.webContents.on("will-navigate", (e, url) => { if (!isLocal(url)) { e.preventDefault(); shell.openExternal(url); } });
  // F11: bật/tắt toàn màn hình
  win.webContents.on("before-input-event", (e, input) => {
    if (input.type === "keyDown" && input.key === "F11") { win.setFullScreen(!win.isFullScreen()); e.preventDefault(); }
  });
  win.loadURL(`http://127.0.0.1:${port}/`);
  // Kiểm thử nhanh trên CI: tải trang, in tiêu đề rồi thoát
  if (process.env.SMOKE_TEST) win.webContents.once("did-finish-load", async () => {
    const t = await win.webContents.executeJavaScript("document.title + ' | ' + document.querySelectorAll('#t-new, #t-continue').length");
    console.log("SMOKE_OK " + t); app.quit();
  });
}

// ---------- Tự cập nhật ----------
// Bản cài Windows (NSIS) và Linux AppImage: tự tải bản mới từ GitHub Releases rồi cài khi khởi động lại.
// Bản macOS (chưa ký), .deb và bản portable: báo có bản mới và mở trang tải về.
const RELEASES = "https://github.com/ngiangbao/cua-hang-nho-cua-uyen/releases/latest";
const canSelfUpdate = app.isPackaged && ((process.platform === "win32" && !process.env.PORTABLE_EXECUTABLE_DIR) || (process.platform === "linux" && !!process.env.APPIMAGE));
let updater = null, manualCheck = false, notified = false;
const mainWin = () => BrowserWindow.getAllWindows()[0];
const newer = (a, b) => { const x = a.split(".").map(Number), y = b.split(".").map(Number); for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); return false; };
const upToDate = () => { if (manualCheck) dialog.showMessageBox(mainWin(), { type: "info", message: `Bạn đang dùng bản mới nhất (${app.getVersion()}).` }); };

function setupUpdater() {
  if (!canSelfUpdate) return;
  updater = require("electron-updater").autoUpdater;
  updater.autoDownload = true;
  updater.autoInstallOnAppQuit = true;
  updater.on("update-not-available", upToDate);
  updater.on("error", () => { if (manualCheck) dialog.showMessageBox(mainWin(), { type: "warning", message: "Không kiểm tra được bản cập nhật. Hãy thử lại khi có mạng." }); });
  updater.on("update-available", info => { if (manualCheck) dialog.showMessageBox(mainWin(), { type: "info", message: `Đang tải bản ${info.version} ở chế độ nền…` }); });
  updater.on("update-downloaded", async info => {
    const r = await dialog.showMessageBox(mainWin(), { type: "info", buttons: ["Khởi động lại & cập nhật", "Để sau"], defaultId: 0, cancelId: 1,
      message: `Bản ${info.version} đã sẵn sàng.`, detail: "Tiến trình chơi được lưu tự động. Nếu chọn \"Để sau\", bản mới sẽ được cài khi bạn đóng game." });
    if (r.response === 0) { await mainWin()?.webContents.executeJavaScript("typeof save === 'function' && S && save(true)").catch(() => {}); updater.quitAndInstall(); }
  });
}

async function checkForUpdates(manual) {
  manualCheck = manual;
  if (!app.isPackaged) return manual && upToDate();
  if (updater) return updater.checkForUpdates().catch(() => {});
  try {
    const res = await fetch("https://api.github.com/repos/ngiangbao/cua-hang-nho-cua-uyen/releases/latest", { headers: { "User-Agent": "CuaHangNhoCuaUyen" } });
    const latest = ((await res.json()).tag_name || "").replace(/^v/, "");
    if (latest && newer(latest, app.getVersion())) {
      if (notified && !manual) return; notified = true;
      const r = await dialog.showMessageBox(mainWin(), { type: "info", buttons: ["Mở trang tải về", "Để sau"], defaultId: 0, cancelId: 1,
        message: `Đã có bản mới ${latest} (bạn đang dùng ${app.getVersion()}).` });
      if (r.response === 0) shell.openExternal(RELEASES);
    } else upToDate();
  } catch (e) { if (manual) dialog.showMessageBox(mainWin(), { type: "warning", message: "Không kiểm tra được bản cập nhật. Hãy thử lại khi có mạng." }); }
}
ipcMain.on("check-update", () => checkForUpdates(true));

app.whenReady().then(async () => {
  await createWindow();
  if (process.env.SMOKE_TEST) return;
  setupUpdater();
  setTimeout(() => checkForUpdates(false), 8000);
  setInterval(() => checkForUpdates(false), 4 * 60 * 60 * 1000);
});
app.on("window-all-closed", () => app.quit());
