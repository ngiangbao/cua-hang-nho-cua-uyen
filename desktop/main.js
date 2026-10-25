// Bản desktop: chạy bản web qua một máy chủ nội bộ để YouTube, service worker và bản lưu hoạt động như trên trình duyệt
const { app, BrowserWindow, shell, Menu } = require("electron");
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
    webPreferences: { contextIsolation: true, sandbox: true },
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

app.whenReady().then(createWindow);
app.on("window-all-closed", () => app.quit());
