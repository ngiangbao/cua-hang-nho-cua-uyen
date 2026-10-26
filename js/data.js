// ===== Dữ liệu game "Cửa hàng nhỏ của Uyên" =====
// Phiên bản hiện tại; nhớ đổi cùng version.json khi phát hành
const APP_VERSION = "1.1.0";

const HERO = L("Bảo Uyên");

// ---------- Nguyên liệu ----------
// cost: giá nhập 1 phần (đồng). free: không cần nhập kho
const INGREDIENTS = {
  phin:      { name: L("Cà phê phin"),  icon: "☕", color: "#3b2314", cost: 4000 },
  espresso:  { name: "Espresso",     icon: "☕", color: "#1f120a", cost: 6000, equip: "may_espresso" },
  sua_dac:   { name: L("Sữa đặc"),      icon: "🥫", color: "#f4e3c1", cost: 2500 },
  sua_tuoi:  { name: L("Sữa tươi"),     icon: "🥛", color: "#fbf7ef", cost: 3000 },
  da:        { name: L("Đá"),           icon: "🧊", color: "#cfefff", free: true },
  nuoc_nong: { name: L("Nước nóng"),    icon: "♨️", color: "#e8d8c8", free: true },
  duong:     { name: L("Đường"),        icon: "🍬", color: "#ffffff", cost: 500 },
  trung:     { name: L("Kem trứng"),    icon: "🥚", color: "#f7d774", cost: 5000, equip: "may_danh_trung" },
  muoi:      { name: L("Kem muối"),     icon: "🧂", color: "#fff6e6", cost: 4000, equip: "may_danh_trung" },
  foam:      { name: L("Bọt sữa"),      icon: "☁️", color: "#fffdf8", cost: 2000, equip: "may_espresso" },
  tra:       { name: L("Trà"),          icon: "🍵", color: "#c98a2d", cost: 2000 },
  chanh:     { name: L("Chanh"),        icon: "🍋", color: "#f5e663", cost: 1500 },
  sa:        { name: L("Sả"),           icon: "🌿", color: "#b8d86b", cost: 1000 },
  cacao:     { name: L("Ca cao"),       icon: "🍫", color: "#6b3a1e", cost: 4000 },
  dao:       { name: L("Đào ngâm"),     icon: "🍑", color: "#ffb38a", cost: 6000, equip: "tu_mat" },
  vai:       { name: L("Vải"),          icon: "🍒", color: "#ffe1e8", cost: 6000, equip: "tu_mat" },
  cam:       { name: L("Cam"),          icon: "🍊", color: "#ff9f1c", cost: 5000, equip: "may_xay" },
  bo:        { name: L("Bơ"),           icon: "🥑", color: "#a8c66c", cost: 9000, equip: "may_xay" },
  sua_chua:  { name: L("Sữa chua"),     icon: "🥣", color: "#fff8f0", cost: 5000, equip: "tu_mat" },
  dua:       { name: L("Cốt dừa"),      icon: "🥥", color: "#fffaf0", cost: 5000, equip: "bo_cot_dua" },
  tran_chau: { name: L("Trân châu"),    icon: "⚫", color: "#2d1b10", cost: 3000, equip: "noi_tran_chau" },
  matcha:    { name: "Matcha",       icon: "🍃", color: "#7fb347", cost: 8000, equip: "may_espresso" },
  dau:       { name: L("Dâu Đà Lạt"),   icon: "🍓", color: "#ff4d6d", cost: 7000, secret: "tra_dau" },
  // Đặc sản địa phương — chỉ nhập được ở quán thuộc thành phố đó
  com:       { name: L("Cốm làng Vòng"), icon: "🌾", color: "#b5d67a", cost: 5000, only: ["hanoi"] },
  sen:       { name: L("Hoa sen"),       icon: "🪷", color: "#ffd6e0", cost: 6000, only: ["hanoi", "hue"] },
  tac:       { name: L("Tắc"),           icon: "🟠", color: "#ffb703", cost: 1500, only: ["saigon"] },
  rau_ma:    { name: L("Rau má"),        icon: "🥬", color: "#74c69d", cost: 3000, only: ["saigon"] },
  dau_nanh:  { name: L("Đậu nành"),      icon: "🫘", color: "#f1e3c8", cost: 2500, only: ["dalat"] },
  atiso:     { name: L("Atiso"),         icon: "🌺", color: "#7a9e7e", cost: 5000, only: ["dalat"] },
  la_dua:    { name: L("Lá dứa"),        icon: "🌴", color: "#52b788", cost: 2000, only: ["hoian"] },
  dua_tuoi:  { name: L("Dừa tươi"),      icon: "🥥", color: "#f6fff0", cost: 8000, only: ["danang"] },
  ky_tu:     { name: L("Kỷ tử"),         icon: "🔴", color: "#e63946", cost: 4000, only: ["hue"] },
};

// ---------- Đồ uống ----------
// recipe: thứ tự chuẩn. hot: đồ nóng (trời lạnh/mưa bán chạy)
const DRINKS = {
  den_da:       { name: L("Cà phê đen đá"),     price: 25000, recipe: ["phin", "da"], hot: false },
  den_nong:     { name: L("Cà phê đen nóng"),   price: 25000, recipe: ["phin", "nuoc_nong"], hot: true },
  sua_da:       { name: L("Cà phê sữa đá"),     price: 29000, recipe: ["sua_dac", "phin", "da"], hot: false },
  bac_xiu:      { name: L("Bạc xỉu"),           price: 32000, recipe: ["sua_dac", "sua_tuoi", "phin", "da"], hot: false },
  tra_chanh:    { name: L("Trà chanh"),         price: 20000, recipe: ["tra", "chanh", "duong", "da"], hot: false },
  ca_cao_nong:  { name: L("Ca cao nóng"),       price: 35000, recipe: ["cacao", "nuoc_nong", "sua_dac"], hot: true },
  nuoc_mot:     { name: L("Nước mót Hội An"),   price: 30000, recipe: ["tra", "sa", "chanh", "da"], hot: false, only: "hoian" },
  ca_phe_trung: { name: L("Cà phê trứng"),      price: 45000, recipe: ["phin", "trung"], hot: true, equip: "may_danh_trung" },
  ca_phe_muoi:  { name: L("Cà phê muối"),       price: 39000, recipe: ["sua_dac", "phin", "da", "muoi"], hot: false, equip: "may_danh_trung" },
  ca_phe_dua:   { name: L("Cà phê cốt dừa"),    price: 45000, recipe: ["phin", "dua", "sua_dac", "da"], hot: false, equip: "bo_cot_dua" },
  tra_dao:      { name: L("Trà đào cam sả"),    price: 45000, recipe: ["tra", "dao", "sa", "da"], hot: false, equip: "tu_mat" },
  tra_vai:      { name: L("Trà vải"),           price: 42000, recipe: ["tra", "vai", "da"], hot: false, equip: "tu_mat" },
  sua_chua_cf:  { name: L("Sữa chua cà phê"),   price: 39000, recipe: ["sua_chua", "phin", "da"], hot: false, equip: "tu_mat" },
  tra_sua:      { name: L("Trà sữa trân châu"), price: 42000, recipe: ["tra", "sua_tuoi", "duong", "tran_chau", "da"], hot: false, equip: "noi_tran_chau" },
  sinh_to_bo:   { name: L("Sinh tố bơ"),        price: 49000, recipe: ["bo", "sua_dac", "sua_tuoi", "da"], hot: false, equip: "may_xay" },
  nuoc_cam:     { name: L("Nước cam"),          price: 39000, recipe: ["cam", "duong", "da"], hot: false, equip: "may_xay" },
  espresso:     { name: "Espresso",          price: 39000, recipe: ["espresso"], hot: true, equip: "may_espresso" },
  latte:        { name: "Latte",             price: 55000, recipe: ["espresso", "sua_tuoi", "foam"], hot: true, equip: "may_espresso" },
  cappuccino:   { name: "Cappuccino",        price: 55000, recipe: ["espresso", "foam", "cacao"], hot: true, equip: "may_espresso" },
  matcha_latte: { name: L("Matcha latte đá"),   price: 55000, recipe: ["matcha", "sua_tuoi", "da"], hot: false, equip: "may_espresso" },
  // Món địa phương — chỉ bán ở quán thuộc thành phố đó
  cf_com:       { name: L("Cà phê cốm"),        price: 45000, recipe: ["phin", "sua_tuoi", "com", "da"], hot: false, only: "hanoi" },
  tra_sen:      { name: L("Trà sen Tây Hồ"),    price: 40000, recipe: ["tra", "sen", "nuoc_nong"], hot: true, only: "hanoi" },
  tra_tac:      { name: L("Trà tắc"),           price: 25000, recipe: ["tra", "tac", "duong", "da"], hot: false, only: "saigon" },
  rau_ma_dx:    { name: L("Rau má sữa"),        price: 30000, recipe: ["rau_ma", "sua_dac", "da"], hot: false, only: "saigon" },
  sua_dau_nanh: { name: L("Sữa đậu nành nóng"), price: 20000, recipe: ["dau_nanh", "duong", "nuoc_nong"], hot: true, only: "dalat" },
  tra_atiso:    { name: L("Trà atiso"),         price: 30000, recipe: ["atiso", "duong", "nuoc_nong"], hot: true, only: "dalat" },
  tra_la_dua:   { name: L("Trà lá dứa"),        price: 30000, recipe: ["tra", "la_dua", "duong", "da"], hot: false, only: "hoian" },
  nuoc_dua:     { name: L("Nước dừa Mỹ Khê"),   price: 35000, recipe: ["dua_tuoi", "da"], hot: false, only: "danang" },
  dua_dam:      { name: L("Dừa dầm"),           price: 40000, recipe: ["dua_tuoi", "sua_dac", "da"], hot: false, only: "danang" },
  tra_cung_dinh:{ name: L("Trà cung đình Huế"), price: 45000, recipe: ["tra", "ky_tu", "sen", "nuoc_nong"], hot: true, only: "hue" },
  sua_sen:      { name: L("Sữa sen Huế"),       price: 40000, recipe: ["sen", "sua_tuoi", "duong", "da"], hot: false, only: "hue" },
  // Món của cốt truyện — mở khi viết xong trang cuối sổ tay
  ky_uc:        { name: L("Ly Ký Ức"),          price: 69000, recipe: ["phin", "sua_dac", "sua_tuoi", "cacao"], hot: false, story: true },
  // Công thức bí mật — mở khóa qua câu chuyện khách ruột
  jazz_latte:   { name: L("Latte Jazz Đêm"),    price: 65000, recipe: ["espresso", "sua_dac", "sua_tuoi", "foam", "cacao"], hot: true, equip: "may_espresso", secret: true },
  cf_cu_hoa:    { name: L("Cà phê Cụ Hòa"),     price: 60000, recipe: ["phin", "trung", "cacao"], hot: true, equip: "may_danh_trung", secret: true },
  tra_dau:      { name: L("Trà dâu Đà Lạt"),    price: 55000, recipe: ["tra", "dau", "duong", "da"], hot: false, secret: true },
};

// ---------- Máy móc (mỗi quán mua riêng) ----------
const EQUIPMENT = {
  may_danh_trung: { name: L("Máy đánh kem trứng"), price: 800000,  desc: L("Mở khóa Cà phê trứng, Cà phê muối") },
  tu_mat:         { name: L("Tủ mát trái cây"),    price: 900000,  desc: L("Mở khóa Trà đào, Trà vải, Sữa chua cà phê") },
  bo_cot_dua:     { name: L("Bộ ủ cốt dừa"),       price: 600000,  desc: L("Mở khóa Cà phê cốt dừa") },
  noi_tran_chau:  { name: L("Nồi nấu trân châu"),  price: 700000,  desc: L("Mở khóa Trà sữa trân châu") },
  may_xay:        { name: L("Máy xay sinh tố"),    price: 1200000, desc: L("Mở khóa Sinh tố bơ, Nước cam") },
  may_espresso:   { name: L("Máy Espresso Ý"),     price: 3500000, desc: L("Mở khóa Espresso, Latte, Cappuccino, Matcha") },
};

// ---------- Trang trí (mỗi quán riêng) ----------
const DECOR = {
  ban_ghe:  { name: L("Thêm bàn ghế"),        price: 500000,  max: 1, desc: L("Đón tối đa 5 khách cùng lúc (thay vì 3)") },
  cay_xanh: { name: L("Cây xanh & hoa"),      price: 300000,  max: 1, desc: L("+5% tiền tip") },
  loa_jazz: { name: L("Loa nghe jazz"),       price: 450000,  max: 1, desc: L("Khách kiên nhẫn hơn 15%") },
  bien_neon:{ name: L("Biển hiệu đèn neon"),  price: 700000,  max: 1, desc: L("+15% lượng khách") },
  may_lanh: { name: L("Máy lạnh"),            price: 1500000, max: 1, desc: L("+10% khách, +5% tip, ngày nóng hút khách. Điện +30.000đ/ngày") },
  tranh:    { name: L("Tranh tường địa phương"), price: 800000, max: 1, desc: L("Uy tín tăng nhanh hơn 20%") },
  san_vuon: { name: L("Sân vườn nhỏ"),        price: 1200000, max: 1, chapter: 3, desc: L("Góc sân giàn hoa giấy: khách kiên nhẫn hơn 12%, +8% khách") },
  goc_sach: { name: L("Góc đọc sách"),        price: 900000,  max: 1, chapter: 3, desc: L("Khách ngồi lâu trò chuyện: điểm thân thiết tăng nhanh hơn 30%") },
};

// ---------- Địa điểm ----------
const LOCATIONS = {
  hanoi:  { name: L("Hẻm Phố Cổ"), city: L("Hà Nội"),  cost: 0,        rent: 150000, flow: 1.0, specialty: "ca_phe_trung", key: 5,  tempo: 92,
            wall: "#ffe6b8", accent: "#e07a5f", desc: L("Căn quán nhỏ ngoại nhượng lại, cửa sổ nhìn ra mái ngói rêu phong.") },
  saigon: { name: L("Góc Quận 1"), city: L("Sài Gòn"), cost: 15000000, rent: 320000, flow: 1.45, specialty: "bac_xiu", key: 10, tempo: 108,
            wall: "#d9f2ef", accent: "#2a9d8f", desc: L("Sôi động, đông khách văn phòng, thèm đồ đá quanh năm.") },
  dalat:  { name: L("Đồi Thông"), city: L("Đà Lạt"),   cost: 25000000, rent: 200000, flow: 1.15, specialty: "ca_cao_nong", key: 3,  tempo: 80,
            wall: "#e8e1f5", accent: "#7b6cc4", desc: L("Se lạnh, sương mù, khách thích đồ nóng.") },
  hoian:  { name: L("Phố Đèn Lồng"), city: L("Hội An"), cost: 40000000, rent: 260000, flow: 1.35, specialty: "nuoc_mot", key: 7, tempo: 90,
            wall: "#fff1a8", accent: "#e9a23b", desc: L("Du khách khắp nơi, tường vàng, đèn lồng rực rỡ.") },
  danang: { name: L("Bờ Biển Mỹ Khê"), city: L("Đà Nẵng"), cost: 55000000, rent: 300000, flow: 1.5, specialty: "ca_phe_dua", key: 0, tempo: 112,
            wall: "#d4f1ff", accent: "#1d8fd8", desc: L("Nắng gió biển, khách mê đồ mát.") },
  hue:    { name: L("Bên Sông Hương"), city: L("Huế"),  cost: 75000000, rent: 230000, flow: 1.25, specialty: "ca_phe_muoi", key: 8, tempo: 76,
            wall: "#f1e0f5", accent: "#9b5de5", desc: L("Trầm mặc, thơ mộng, quê hương cà phê muối.") },
};
const LOCATION_ORDER = ["hanoi", "saigon", "dalat", "hoian", "danang", "hue"];
const MIN_DAYS_BETWEEN_SHOPS = 10;
// Tọa độ thật (kinh độ, vĩ độ) để đặt quán trên bản đồ
const GEO = {
  hanoi: [105.85, 21.03], saigon: [106.70, 10.78], dalat: [108.44, 11.94],
  hoian: [108.33, 15.88], danang: [108.20, 16.05], hue: [107.59, 16.46],
};
// Đường viền Việt Nam (giản lược) theo kinh độ, vĩ độ
const VN_OUTLINE = [[102.14,22.4],[102.6,22.75],[103.3,22.8],[103.95,22.5],[104.4,22.8],[105.3,23.3],[106.2,22.98],[106.7,22.85],[107.4,22.2],[108.05,21.55],
  [107.4,21.2],[106.7,20.7],[106.2,20.2],[105.9,19.6],[105.7,18.9],[106.1,18.3],[106.5,17.8],[107.1,17.1],[107.6,16.5],[108.2,16.1],[108.4,15.6],[108.8,15.2],
  [109.0,14.5],[109.2,13.8],[109.3,13.0],[109.2,12.3],[109.15,11.8],[108.8,11.3],[108.0,10.7],[107.2,10.4],[106.8,10.3],[106.5,9.7],[105.8,9.0],[105.2,8.6],
  [104.8,8.6],[104.8,9.5],[104.9,10.2],[104.5,10.4],[105.1,10.9],[106.2,10.95],[106.4,11.6],[107.5,12.3],[107.6,13.0],[107.5,14.0],[107.7,14.6],[107.3,15.4],
  [107.4,16.2],[106.8,16.5],[106.5,17.0],[106.0,17.5],[105.6,18.0],[105.1,18.6],[104.4,19.0],[104.0,19.4],[104.6,19.8],[104.5,20.2],[104.0,20.5],[103.3,20.7],
  [103.0,21.2],[102.4,21.9]];
// Kho khởi đầu của mỗi quán mới mở
const STARTER_INV = { phin: 30, sua_dac: 25, sua_tuoi: 20, duong: 30, tra: 20, chanh: 15, sa: 10, cacao: 10 };

// ---------- Nhân viên ----------
const ROLES = {
  waiter:  { name: L("Phục vụ"),  icon: "🧑‍🍳", wage: [120000, 180000], desc: L("Tự nhận order, khách kiên nhẫn hơn 25%.") },
  cleaner: { name: L("Tạp vụ"),   icon: "🧹",   wage: [90000, 140000],  desc: L("Giữ quán luôn sạch sẽ, Uyên không phải tự dọn.") },
  cashier: { name: L("Thu ngân"), icon: "💁",   wage: [130000, 190000], desc: L("+10% tiền tip, tự nhập kho mỗi sáng theo mức đặt.") },
  barista: { name: L("Pha chế"),  icon: "☕",   wage: [200000, 320000], desc: L("Tự pha đồ uống. Quán có pha chế có thể tự vận hành khi Uyên sang quán khác.") },
};
const ROLE_ORDER = ["waiter", "cleaner", "cashier", "barista"];
// Ưu điểm và nhược điểm ngẫu nhiên của ứng viên. eff: hiệu ứng (speed, quality, tip, patience, flow, rep, save, waste, absent)
const PERKS = {
  nhanh:    { name: L("Nhanh nhẹn"),         icon: "⚡", desc: L("Làm việc nhanh hơn 20%"), eff: { speed: 0.2 } },
  taynghe:  { name: L("Tay nghề cao"),       icon: "🎯", desc: L("+10% cơ hội pha ly hoàn hảo"), eff: { quality: 0.1 } },
  duyen:    { name: L("Duyên dáng"),         icon: "💖", desc: L("Khách tip thêm 8%"), eff: { tip: 0.08 } },
  thanthien:{ name: L("Thân thiện"),         icon: "😊", desc: L("Khách kiên nhẫn hơn 12%"), eff: { patience: 0.12 } },
  noitieng: { name: L("Nổi tiếng trên mạng"), icon: "📱", desc: L("+6% lượng khách tới quán"), eff: { flow: 0.06 } },
  kytinh:   { name: L("Kỹ tính"),            icon: "✨", desc: L("Uy tín quán tăng nhanh hơn 15%"), eff: { rep: 0.15 } },
  tietkiem: { name: L("Tiết kiệm"),          icon: "🪙", desc: L("15% cơ hội pha không tốn nguyên liệu"), eff: { save: 0.15 } },
  banhang:  { name: L("Khéo bán hàng"),      icon: "💰", desc: L("Khách tip thêm 5%, uy tín tăng nhanh hơn 5%"), eff: { tip: 0.05, rep: 0.05 } },
};
const FLAWS = {
  chamchap: { name: L("Chậm chạp"),       icon: "🐢", desc: L("Làm việc chậm hơn 15%"), eff: { speed: -0.15 } },
  vungve:   { name: L("Vụng về"),         icon: "💥", desc: L("-10% cơ hội pha ly hoàn hảo"), eff: { quality: -0.1 } },
  haycau:   { name: L("Hay cáu"),         icon: "😤", desc: L("Khách kém kiên nhẫn 10%"), eff: { patience: -0.1 } },
  haynghi:  { name: L("Hay xin nghỉ"),    icon: "🛌", desc: L("10% khả năng vắng mặt mỗi ngày (ngày nghỉ không trả lương)"), eff: { absent: 0.1 } },
  doiluong: { name: L("Đòi lương cao"),   icon: "💸", desc: L("Lương cao hơn 20%"), wage: 0.2 },
  dienthoai:{ name: L("Ham điện thoại"),  icon: "📵", desc: L("Làm chậm hơn 10%, khách tip ít đi 4%"), eff: { speed: -0.1, tip: -0.04 } },
  voy:      { name: L("Vô ý"),            icon: "🫗", desc: L("8% khả năng làm đổ, tốn gấp đôi nguyên liệu"), eff: { waste: 0.08 } },
  laumieng: { name: L("Lắm miệng"),       icon: "🗣️", desc: L("Uy tín tăng chậm hơn 10%"), eff: { rep: -0.1 } },
};
const REROLL_COST = 50000;

// ---------- Tên ngẫu nhiên ----------
const HO = [L("Nguyễn"), L("Trần"), L("Lê"), L("Phạm"), L("Hoàng"), L("Huỳnh"), "Phan", L("Vũ"), L("Võ"), L("Đặng"), L("Bùi"), L("Đỗ"), L("Hồ"), L("Ngô"), L("Dương"), L("Lý")];
const TEN_F = ["Lan", "Hoa", "Trang", L("Thảo"), L("Ngân"), L("Hương"), L("Yến"), "Nhung", L("Quỳnh"), L("Châu"), "Anh", "My", L("Tâm"), L("Hạnh"), L("Vân"), L("Diệp"), "Nhi", L("Thư")];
const TEN_M = [L("Hùng"), L("Dũng"), "Nam", L("Phúc"), L("Quân"), L("Sơn"), L("Tùng"), L("Hiếu"), L("Thắng"), "Vinh", L("Toàn"), L("Lộc"), L("Hậu"), L("Tín"), L("Kiên"), L("Đạt"), "Huy", "Phong"];

// ---------- Thời tiết & sự kiện ----------
const WEATHER = {
  nang:  { name: L("Nắng đẹp"),  icon: "☀️", flow: 1.0,  hot: 1.0 },
  nong:  { name: L("Nắng nóng"), icon: "🔥", flow: 1.1,  hot: 0.4 },
  mua:   { name: L("Mưa rào"),   icon: "🌧️", flow: 0.8,  hot: 1.8 },
  mat:   { name: L("Mát mẻ"),    icon: "⛅", flow: 1.1,  hot: 1.3 },
  lanh:  { name: L("Se lạnh"),   icon: "🌫️", flow: 0.95, hot: 2.4 },
};

const EVENTS = [
  { id: "doan_khach", name: L("Đoàn khách du lịch"), icon: "🧳", desc: L("Một đoàn du khách ghé phố hôm nay — khách đông hơn 35%!"), flow: 1.35 },
  { id: "phe_binh",   name: L("Nhà phê bình ẩm thực"), icon: "📝", desc: L("Nghe nói hôm nay có nhà phê bình ẩm thực ghé quán. Pha thật chuẩn nhé!"), critic: true },
  { id: "mat_dien",   name: L("Cúp điện buổi trưa"), icon: "🔌", desc: L("Điện lực báo cắt điện 11h–13h. Máy espresso và máy xay sẽ nghỉ."), outage: [11 * 60, 13 * 60] },
  { id: "may_hong",   name: L("Máy móc trục trặc"), icon: "🔧", desc: L("Thợ phải ghé sửa vòi nước rò rỉ. Phí sửa 150.000đ."), cost: 150000 },
  { id: "le_hoi",     name: L("Lễ hội đường phố"), icon: "🎉", desc: L("Phố đi bộ có lễ hội, khách vui vẻ tip nhiều hơn!"), flow: 1.2, tip: 0.1 },
  { id: "tran_dau",   name: L("Đêm bóng đá"), icon: "⚽", desc: L("Tối nay có trận chung kết, khách đông vào buổi tối!"), evening: 1.8 },
  { id: "gia_sua",    name: L("Sữa tăng giá"), icon: "📈", desc: L("Nhà cung cấp tăng giá sữa 30% trong hôm nay."), priceUp: ["sua_dac", "sua_tuoi"] },
  { id: "khuyen_mai", name: L("Chợ đầu mối giảm giá"), icon: "🛒", desc: L("Chợ giảm 25% giá nguyên liệu hôm nay. Nhập kho thôi!"), discount: 0.25 },
];

// Quảng cáo: lvl là mức khách so với mức chuẩn khi đang quảng cáo. Không chạy quảng cáo, quán chỉ còn AD_BASE (vắng hơn 30%).
const AD_BASE = 0.7;
const MARKETING = {
  to_roi: { name: L("Phát tờ rơi"),           icon: "📄", price: 150000,  days: 1, lvl: 1.0,  scope: "active", desc: L("Dán tờ rơi lên quầy: khách về mức bình thường tại quán Uyên đứng hôm nay") },
  mxh:    { name: L("Quảng cáo mạng xã hội"), icon: "📱", price: 600000,  days: 3, lvl: 1.1,  scope: "all",    desc: L("Bài đăng lan khắp mạng: khách bình thường +10% cho cả chuỗi trong 3 ngày") },
  kol:    { name: L("Mời KOL review"),        icon: "🎥", price: 1800000, days: 3, lvl: 1.3,  scope: "all",    desc: L("KOL tới quán chụp hình, quay phim: khách +30% cho cả chuỗi trong 3 ngày") },
};

// ---------- Lời thoại khách vãng lai ----------
const GEN = {
  greet: [
    L("Chào chị chủ quán!"), L("Quán xinh ghê!"), L("Ở đây có chỗ ngồi không chị?"), L("Nghe bạn giới thiệu nên ghé thử nè."),
    L("Trời này mà có ly nước thì tuyệt."), L("Chào Uyên, lâu rồi mới ghé!"), L("Ơ quán mới mở hả chị?"), L("Quán thơm mùi cà phê quá."),
    L("Mình đi ngang thấy dễ thương nên vào."), L("Chị ơi cho em gọi món với."), L("Nhạc quán hay ghê, nhạc gì vậy chị?"), L("Hôm nay quán đông nhỉ!"),
  ],
  order: [
    L("Cho mình một ly {d} nhé."), L("Một {d}, cảm ơn chị!"), L("Chị làm giúp em ly {d} được không?"), L("Hôm nay thử {d} xem sao."),
    L("Như mọi khi... à không, hôm nay {d}!"), L("{d} một ly, mang ra bàn giúp em nha."), L("Em nghe nói {d} ở đây ngon lắm."), L("Cho một {d}, ít ngọt thôi nha... đùa đó, như công thức là được!"),
  ],
  perfect: [
    L("Trời ơi ngon xỉu!"), L("Đúng vị luôn, mai mình quay lại!"), L("Ly này phải chụp hình đăng story mới được."), L("Chuẩn không cần chỉnh!"),
    L("Uyên pha khéo tay ghê."), L("Ngon hơn quán quen của mình luôn á."), L("Uống một ngụm là hết mệt."), L("Mười điểm không có nhưng!"),
  ],
  good: [L("Ngon nè, cảm ơn chị!"), L("Ổn áp đó."), L("Vị lạ lạ mà cũng được ghê."), L("Uống cũng được, cảm ơn nha.")],
  ok: [L("Hơi khác khác mọi lần..."), L("Hình như thiếu cái gì đó."), L("Cũng tạm được."), L("Lần sau làm chuẩn hơn nha chị.")],
  wrong: [L("Ơ, đây đâu phải món em gọi?"), L("Cái này... không phải {d} đâu chị ơi."), L("Thôi khỏi, mình đi đây."), L("Sai món rồi chị ơi!")],
  leave: [L("Lâu quá, thôi mình đi."), L("Chờ mãi không thấy, để hôm khác vậy."), L("Trễ giờ làm rồi, đi đây!"), L("Haizz... đông quá.")],
  chats: [
    { q: L("Dạo này kẹt xe kinh khủng, chị đi làm có bị kẹt không?"), a: [
      [L("Kẹt lắm, nên chị ở luôn trên quán cho lẹ!"), 2, L("Hahaha, chị vui tính ghê.")],
      [L("Chị đi bộ thôi, quán gần nhà."), 1, L("Sướng ghê, em ước được vậy.")],
      [L("Ừ."), -1, L("...Dạ.")]] },
    { q: L("Chị ơi, quán mở lâu chưa?"), a: [
      [L("Quán của ngoại chị đó, ngoại về quê dưỡng già nên nhượng lại cho chị."), 2, L("Ôi dễ thương quá, em sẽ ghé thường xuyên!")],
      [L("Mới thôi, ủng hộ chị nhiều nha!"), 1, L("Chắc chắn rồi!")],
      [L("Lâu lắm rồi, sao em không biết?"), -1, L("Ơ... em xin lỗi.")]] },
    { q: L("Hôm nay em vừa được tăng lương đó!"), a: [
      [L("Chúc mừng em! Ly này chị tặng thêm topping nha."), 2, L("Chị dễ thương quá trời!")],
      [L("Vậy hôm nay em bao cả quán nha!"), 1, L("Haha, cho em suy nghĩ đã...")],
      [L("Chắc tăng ít thôi ha."), -2, L("...Thôi, em uống cho xong.")]] },
    { q: L("Chị thấy trời hôm nay sao?"), a: [
      [L("Trời đẹp, hợp ngồi cà phê tán gẫu!"), 2, L("Chuẩn luôn!")],
      [L("Thời tiết thất thường quá."), 1, L("Đúng rồi, sáng nắng chiều mưa.")],
      [L("Không để ý."), -1, L("À... vâng.")]] },
    { q: L("Em đang tìm chỗ ngồi làm việc yên tĩnh, quán mình có wifi không chị?"), a: [
      [L("Có chứ, mật khẩu ghi trên bảng menu đó em."), 2, L("Tuyệt vời, em sẽ thành khách ruột.")],
      [L("Có, nhưng em ngồi lâu nhớ gọi thêm nha."), 1, L("Hihi, tất nhiên rồi.")],
      [L("Ra quán cà phê là để trò chuyện chứ!"), 0, L("Cũng có lý ha.")]] },
    { q: L("Nhạc jazz trong quán là do chị chọn hả?"), a: [
      [L("Ừ, chị mê jazz từ hồi nghe đĩa than của ngoại."), 2, L("Gu chị xịn thật.")],
      [L("Nhạc ngẫu nhiên thôi em."), 1, L("Ngẫu nhiên mà hay ghê.")],
      [L("Em không thích thì bịt tai lại."), -2, L("Ơ kìa...")]] },
  ],
};

// ---------- Khách ruột (27 nhân vật) ----------
// loc: "global" xuất hiện mọi quán. day: ngày bắt đầu xuất hiện
// look: g=giới tính, age, skin, hair (kiểu), hc (màu tóc), shirt (kiểu), sc (màu áo), acc (phụ kiện)
// chats: [câu hỏi, [[lựa chọn, điểm thân thiết, câu đáp]...]]
// story: mốc trái tim (h) -> lời kể + phần thưởng
const CHARACTERS = [
  // ===== Toàn quốc =====
  { id: "minh", name: "Minh", title: L("Sinh viên IT"), loc: "global", day: 1, fav: ["den_da", "bac_xiu"], patience: 1.1, tip: 1.0,
    look: { g: "m", age: "young", skin: "#f1c27d", hair: "short", hc: "#1d1410", shirt: "hoodie", sc: "#57cc99", acc: ["glasses"] },
    bio: L("Năm ba đại học, code xuyên đêm, nợ deadline nhiều hơn nợ tiền."),
    greet: [L("Chị Uyên ơi, hôm nay em lại chạy deadline..."), L("Wifi quán vẫn mật khẩu cũ chứ chị?"), L("Chào chị, cho em góc cạnh ổ điện nhé!")],
    happy: [L("Ngon quá, đủ năng lượng fix thêm chục cái bug!"), L("Ly này là chân ái của em.")],
    sad: [L("Hơi khác vị mọi khi... chắc tại em mệt.")],
    chats: [
      { q: L("Chị ơi, theo chị em nên đi thực tập hay ở lại làm dự án riêng?"), a: [
        [L("Đi thực tập học hỏi trước, dự án làm song song."), 8, L("Hợp lý ghê... vừa có lương vừa có kinh nghiệm.")],
        [L("Làm dự án riêng đi, tuổi trẻ phải liều!"), 4, L("Liều thì liều... nhưng chắc mẹ em không chịu đâu.")],
        [L("Hỏi chị Google ấy."), -4, L("Ơ... em tưởng chị khác Google chứ.")]] },
      { q: L("Em vừa thức trắng hai đêm. Có bí quyết nào tỉnh táo không chị?"), a: [
        [L("Ngủ đi em, cà phê không thay được giấc ngủ đâu."), 8, L("Dạ... nghe chị, tối nay em ngủ sớm.")],
        [L("Uống thêm ly nữa là tỉnh!"), -3, L("Tim em đập như trống trường rồi chị ơi...")],
        [L("Đi bộ quanh hồ một vòng cho thoáng."), 5, L("Ý hay, để em thử.")]] },
      { q: L("Chị có tin máy tính sau này pha cà phê ngon hơn người không?"), a: [
        [L("Máy pha được, nhưng không biết hỏi han khách như chị."), 7, L("Đúng ha... không ai thay được chị Uyên.")],
        [L("Có chứ, chị sắp thất nghiệp rồi!"), 2, L("Haha, em không để chuyện đó xảy ra đâu.")],
        [L("Nói chuyện khác đi."), -2, L("Dạ...")]] },
    ],
    story: [
      { h: 1, lines: [L("Chị biết không, em đang viết một cái app gọi món cho quán nhỏ."), L("Nếu xong, em muốn quán chị là quán đầu tiên dùng thử!")], reward: { rep: 3 } },
      { h: 3, lines: [L("App của em được giải nhì cuộc thi khởi nghiệp sinh viên!"), L("Ban giám khảo hỏi em lấy cảm hứng ở đâu, em kể về quán chị đấy."), L("Đây là một phần tiền thưởng, chị nhận giúp em nha.")], reward: { money: 300000 } },
      { h: 5, lines: [L("Em được nhận vào làm ở công ty lớn rồi."), L("Nhưng sáng nào em cũng ghé. Quán chị là văn phòng thứ hai của em mà."), L("Em còn rủ cả team mới tới đây nữa!")], reward: { flow: 0.04 } },
    ] },

  { id: "lan", name: L("Cô Lan"), title: L("Giáo viên về hưu"), loc: "global", day: 1, fav: ["ca_phe_trung", "ca_cao_nong", "den_nong"], patience: 1.4, tip: 1.2,
    look: { g: "f", age: "old", skin: "#f3cfa8", hair: "bun", hc: "#bdbdbd", shirt: "blouse", sc: "#b388eb", acc: ["glasses"] },
    bio: L("Dạy Văn ba mươi năm, giờ thích đọc báo giấy và chấm điểm... đồ uống."),
    greet: [L("Chào con Uyên, hôm nay quán vẫn ấm cúng nhỉ."), L("Cô ghé đọc báo một chút, con cứ làm việc đi."), L("Con gái ngoan, dạo này có mệt không?")],
    happy: [L("Mười điểm, cô cho con mười điểm!"), L("Vị này làm cô nhớ quán cũ ở Tràng Tiền ghê.")],
    sad: [L("Bài này... cô cho sáu điểm thôi con ạ.")],
    chats: [
      { q: L("Ngày xưa ngoại con hay ngồi đúng chỗ này đan áo. Bà về quê rồi, con có hay gọi cho bà không?"), a: [
        [L("Tối nào con cũng gọi kể chuyện quán cho bà nghe cô ạ."), 9, L("Bà mà nghe chắc tự hào lắm. Nhớ gửi lời hỏi thăm của cô nhé.")],
        [L("Con bận quá cũng ít gọi..."), 1, L("Bận thì bận, nhưng nhớ gọi cho bà con nhé.")],
        [L("Bà ở quê vui hơn ở đây mà cô."), -2, L("Ừ... nhưng bà vẫn nhớ con lắm đấy.")]] },
      { q: L("Con có đọc sách không? Dạo này cô đọc lại 'Hà Nội băm sáu phố phường'."), a: [
        [L("Con có ạ, cuốn đó viết về quà Hà Nội hay lắm."), 8, L("Ôi, con gái biết đọc sách, cô quý quá.")],
        [L("Con hay nghe podcast hơn cô ạ."), 3, L("Cũng được, miễn là con chịu học.")],
        [L("Sách cũ quá cô ơi."), -3, L("Cũ mà không cũ đâu con.")]] },
      { q: L("Cô hỏi thật, con có định lấy chồng chưa?"), a: [
        [L("Con lo cho quán trước đã cô ơi, chuyện đó để duyên tới."), 6, L("Phải, con gái có sự nghiệp là quý.")],
        [L("Cô giới thiệu cho con đi!"), 4, L("Haha, để cô xem đứa cháu nào hiền lành.")],
        [L("Chuyện riêng của con mà cô."), -2, L("Ừ, cô vô duyên quá.")]] },
    ],
    story: [
      { h: 1, lines: [L("Uyên này, hồi con còn bé xíu, cô hay mua kẹo lạc cho con đấy."), L("Thấy con lớn lên giữ quán của bà, cô mừng lắm.")], reward: { rep: 3 } },
      { h: 3, lines: [L("Cô viết một bài về quán con gửi báo phường."), L("Họ đăng rồi! Tiêu đề là 'Cô chủ nhỏ giữ hồn phố cũ'.")], reward: { rep: 6 } },
      { h: 5, lines: [L("Cô có cuốn sổ công thức tay của ngoại con, bà gửi cô giữ hộ trước khi về quê dưỡng già."), L("Bà dặn: 'Khi nào Uyên đủ vững, hãy đưa cho nó.'"), L("Giờ là lúc rồi, con ạ.")], reward: { money: 800000 } },
    ] },

  { id: "tuan", name: L("Tuấn"), title: L("Anh shipper"), loc: "global", day: 2, fav: ["sua_da", "tra_chanh"], patience: 0.7, tip: 1.0,
    look: { g: "m", age: "young", skin: "#d9a066", hair: "cap", hc: "#ff8c42", shirt: "tee", sc: "#ff8c42", acc: [] },
    bio: L("Chạy mười hai đơn một ngày, thuộc mọi con hẻm trong thành phố."),
    greet: [L("Uyên ơi nhanh giúp anh, còn ba đơn!"), L("Anh ghé uống miếng lấy sức rồi chạy tiếp."), L("Hôm nay nắng cháy da luôn em ạ.")],
    happy: [L("Nhanh mà ngon, đúng chuẩn shipper!"), L("Uống xong chạy thêm năm đơn được!")],
    sad: [L("Thôi kệ, uống cho có sức chạy.")],
    chats: [
      { q: L("Em có biết hẻm nào tắt ra chợ nhanh nhất không? Đùa thôi, anh biết hết rồi."), a: [
        [L("Vậy anh làm hướng dẫn viên du lịch hẻm đi!"), 7, L("Ý tưởng hay đó, tour 'hẻm lắt léo'!")],
        [L("Anh giỏi ghê."), 4, L("Nghề mà em.")],
        [L("Em không hỏi mà."), -3, L("Ờ... ừ.")]] },
      { q: L("Có khách hôm nay boom hàng anh, mất trắng tiền ứng. Buồn ghê."), a: [
        [L("Ly này em mời anh, lấy lại tinh thần nha."), 9, L("Em tốt quá... anh nhớ đó nha.")],
        [L("Lần sau anh gọi xác nhận trước nhé."), 5, L("Ừ, phải cẩn thận hơn.")],
        [L("Chuyện thường mà."), -2, L("Thường với em thôi...")]] },
    ],
    story: [
      { h: 1, lines: [L("Anh in tờ rơi của quán dán sau thùng hàng rồi đó."), L("Chạy khắp thành phố quảng cáo miễn phí cho em!")], reward: { flow: 0.03 } },
      { h: 3, lines: [L("Anh để dành đủ tiền mua xe máy mới rồi!"), L("Lần đầu tiên anh chạy xe không phải đi mượn.")], reward: { rep: 4 } },
      { h: 5, lines: [L("Anh đang tính mở dịch vụ giao hàng riêng."), L("Khách đầu tiên ký hợp đồng chính là... quán em nhé! Anh giao giá hữu nghị.")], reward: { money: 500000 } },
    ] },

  { id: "mai", name: "Mai", title: L("Nhà văn tự do"), loc: "global", day: 3, fav: ["latte", "den_nong", "tra_vai"], patience: 1.5, tip: 1.3,
    look: { g: "f", age: "young", skin: "#f6d5b5", hair: "long", hc: "#5a3825", shirt: "tee", sc: "#2ec4b6", acc: ["scarf"] },
    bio: L("Đang viết cuốn tiểu thuyết đầu tay. Mỗi ly cà phê là một chương."),
    greet: [L("Chào Uyên, cho mình bàn gần cửa sổ nhé."), L("Hôm nay mình bí ý tưởng quá..."), L("Ánh sáng quán sáng nay đẹp như văn vậy.")],
    happy: [L("Vị này phải viết vào truyện mới được."), L("Cảm hứng tới rồi! Cảm ơn Uyên.")],
    sad: [L("Chắc mình bị cảm nên không cảm được vị...")],
    chats: [
      { q: L("Nhân vật chính của mình là một cô chủ quán... Uyên nghĩ cô ấy sợ điều gì nhất?"), a: [
        [L("Sợ một ngày quán vắng, không ai còn nhớ hương vị cũ."), 9, L("Hay quá... mình ghi lại ngay đây.")],
        [L("Sợ hết tiền trả tiền nhà!"), 5, L("Haha, thực tế ghê, nhưng cũng đúng.")],
        [L("Sợ gián."), 2, L("Ơ... cũng là một ý.")]] },
      { q: L("Uyên có tin vào chuyện định mệnh không?"), a: [
        [L("Tin chứ, như việc ngoại nhượng lại quán này cho mình."), 8, L("Đẹp quá. Định mệnh mang mùi cà phê.")],
        [L("Mình tin vào cố gắng hơn."), 6, L("Cũng là một kiểu định mệnh đó.")],
        [L("Mai nói gì khó hiểu quá."), -2, L("Ừ... nhà văn hay vậy mà.")]] },
    ],
    story: [
      { h: 1, lines: [L("Mình viết xong chương một rồi! Bối cảnh là một quán cà phê nhỏ trong hẻm."), L("Đoán xem lấy cảm hứng từ đâu?")], reward: { rep: 3 } },
      { h: 3, lines: [L("Nhà xuất bản nhận bản thảo của mình rồi Uyên ơi!"), L("Mình muốn đặt tên sách là 'Cửa hàng nhỏ'... được không?")], reward: { rep: 5 } },
      { h: 5, lines: [L("Sách ra mắt rồi! Buổi ký tặng mình xin tổ chức ở quán Uyên nhé."), L("Độc giả sẽ tới đông lắm đó.")], reward: { money: 600000, flow: 0.04 } },
    ] },

  { id: "ongba", name: L("Ông Ba"), title: L("Cựu chiến binh"), loc: "global", day: 4, fav: ["den_nong", "den_da"], patience: 1.6, tip: 1.1,
    look: { g: "m", age: "old", skin: "#d8a47f", hair: "bald", hc: "#dddddd", shirt: "shirt", sc: "#6a994e", acc: ["mustache"] },
    bio: L("Bảy mươi tám tuổi, sáng nào cũng một ly đen không đường và một câu chuyện cũ."),
    greet: [L("Cháu Uyên, cho ông ly đen như mọi khi."), L("Sáng nay ông đi bộ được ba vòng hồ đấy."), L("Ông ngồi một lát, nghe nhạc của cháu.")],
    happy: [L("Đắng mà thơm, như đời người cháu ạ."), L("Ngon! Giống cà phê ngoại cháu pha ngày trước.")],
    sad: [L("Hơi lạt... nhưng thôi, ông không chê cháu.")],
    chats: [
      { q: L("Ngày xưa ông với ngoại cháu cùng tổ thanh niên xung phong. Bà giỏi lắm đấy."), a: [
        [L("Ông kể cho cháu nghe thêm về bà đi ạ!"), 9, L("Bà cháu là người gan dạ nhất đội...")],
        [L("Thật hả ông? Cháu không biết luôn."), 5, L("Ừ, bà khiêm tốn, ít kể lắm.")],
        [L("Chuyện xưa rồi ông ạ."), -3, L("Xưa... nhưng không cũ đâu cháu.")]] },
      { q: L("Bọn trẻ bây giờ cứ cắm mặt vào điện thoại. Cháu thấy sao?"), a: [
        [L("Điện thoại tiện thật, nhưng ngồi nói chuyện thế này vẫn quý nhất ông ạ."), 8, L("Phải, phải. Cháu hiểu chuyện lắm.")],
        [L("Thời đại mới mà ông."), 3, L("Ừ, ông cũng phải học thôi.")],
        [L("Ông cũng nên mua một cái đi."), 1, L("Haha, để ông nghĩ.")]] },
    ],
    story: [
      { h: 1, lines: [L("Ông mang tặng cháu tấm ảnh cũ này. Ngoại cháu năm mười tám tuổi đấy."), L("Treo lên tường cho quán có hồn.")], reward: { rep: 4 } },
      { h: 3, lines: [L("Hội cựu chiến binh phường muốn họp mặt ở quán cháu mỗi tháng."), L("Ông bảo rồi: 'Cà phê con bé Uyên là nhất!'")], reward: { money: 400000 } },
      { h: 5, lines: [L("Ông già rồi, không biết còn uống được bao lâu."), L("Nhưng thấy cháu giữ quán thế này, ông yên lòng."), L("Cháu cứ mở thêm quán đi, mang cái hồn này đi xa.")], reward: { rep: 6, flow: 0.03 } },
    ] },

  { id: "khoa", name: L("Anh Khoa"), title: L("Dân văn phòng"), loc: "global", day: 5, fav: ["bac_xiu", "espresso", "sua_da"], patience: 0.8, tip: 1.4,
    look: { g: "m", age: "mid", skin: "#f0c8a0", hair: "side", hc: "#2b1d16", shirt: "tie", sc: "#ffffff", acc: [] },
    bio: L("Trưởng phòng kinh doanh, sống bằng cà phê và họp online."),
    greet: [L("Một ly mang đi, anh có họp lúc chín giờ!"), L("Uyên, cho anh như mọi khi, gấp nhé."), L("Sáng thứ hai... cần cà phê gấp đôi.")],
    happy: [L("Hoàn hảo, KPI hôm nay chắc chắn đạt!"), L("Đây mới gọi là năng suất.")],
    sad: [L("Thôi, kịp giờ là được rồi.")],
    chats: [
      { q: L("Sếp anh bắt chạy doanh số gấp đôi quý này. Em có mẹo bán hàng không?"), a: [
        [L("Hiểu khách muốn gì trước, bán sau anh ạ."), 8, L("Nghe như triết lý quán em vậy. Hay!")],
        [L("Giảm giá thật sâu!"), 2, L("Sếp anh sẽ giết anh mất.")],
        [L("Em bán cà phê thôi mà anh."), 0, L("Ừ, nhưng em bán giỏi đấy.")]] },
      { q: L("Anh tính nghỉ việc mở quán giống em. Có khó không?"), a: [
        [L("Khó lắm anh, nhưng mỗi sáng mở cửa đều thấy vui."), 8, L("Nghe mà muốn thử ghê...")],
        [L("Dễ lắm, anh mở đi!"), -2, L("Thật không đó? Anh thấy em bận tối mắt.")],
        [L("Anh mở thì em mất khách à!"), 4, L("Haha, yên tâm, anh vẫn ghé.")]] },
    ],
    story: [
      { h: 1, lines: [L("Công ty anh muốn đặt cà phê cho buổi họp sáng thứ sáu."), L("Anh giới thiệu quán em luôn.")], reward: { money: 350000 } },
      { h: 3, lines: [L("Anh được thăng chức giám đốc vùng!"), L("Mỗi lần đi công tác tỉnh nào anh cũng sẽ tìm xem có quán em không.")], reward: { rep: 5 } },
      { h: 5, lines: [L("Anh có quen mấy người cho thuê mặt bằng đẹp."), L("Khi nào em mở quán mới, anh nói giúp một tiếng, rẻ hơn hẳn.")], reward: { money: 1000000 } },
    ] },

  { id: "linh", name: "Linh", title: L("TikToker ẩm thực"), loc: "global", day: 8, fav: ["tra_dao", "matcha_latte", "tra_sua"], patience: 0.9, tip: 1.2,
    look: { g: "f", age: "young", skin: "#fbd9c0", hair: "pony", hc: "#ff6fae", shirt: "tee", sc: "#ffd166", acc: ["earrings"] },
    bio: L("Năm trăm nghìn người theo dõi. Một video có thể làm quán đông nghẹt."),
    greet: [L("Hello mọi người, hôm nay Linh review quán của chị Uyên nha!"), L("Chị ơi cho em xin góc có ánh sáng đẹp!"), L("Quán chị lên xu hướng rồi đó, biết chưa?")],
    happy: [L("Đỉnh nóc kịch trần! Mười trên mười!"), L("Video này chắc chắn triệu view!")],
    sad: [L("Ừm... đoạn này em cắt đi vậy.")],
    chats: [
      { q: L("Chị thấy em nên quay góc nào cho quán đẹp nhất?"), a: [
        [L("Quay lúc chị pha phin, khói bay lên đẹp lắm."), 9, L("Ý tưởng xuất sắc! Chị có năng khiếu đạo diễn đó.")],
        [L("Góc nào cũng được, quán chị đẹp mà."), 4, L("Tự tin ghê ha!")],
        [L("Đừng quay chị nha, chị ngại."), 1, L("Vậy em quay ly nước thôi.")]] },
      { q: L("Có người bình luận chê video em giả tạo... buồn ghê."), a: [
        [L("Em làm vì đam mê thật, người hiểu sẽ thấy."), 9, L("Cảm ơn chị... em cần nghe câu đó.")],
        [L("Kệ họ đi, em cứ làm tiếp."), 5, L("Dạ, em sẽ cố.")],
        [L("Thì bớt diễn lại chút."), -3, L("...Chị cũng nghĩ vậy hả?")]] },
    ],
    story: [
      { h: 1, lines: [L("Video review quán chị được ba trăm nghìn view rồi!"), L("Khách đang kéo tới đó, chuẩn bị nha!")], reward: { flow: 0.05 } },
      { h: 3, lines: [L("Em muốn làm series 'Một ngày làm chủ quán' quay ở chỗ chị."), L("Nhà tài trợ trả tiền nữa nè!")], reward: { money: 700000 } },
      { h: 5, lines: [L("Chị Uyên ơi, em được giải Nhà sáng tạo nội dung của năm."), L("Trên sân khấu em cảm ơn chị đó. Chị là người đầu tiên tin em.")], reward: { rep: 8, flow: 0.04 } },
    ] },

  // ===== Hà Nội =====
  { id: "cuhoa", name: L("Cụ Hòa"), title: L("Kỳ thủ cờ tướng"), loc: "hanoi", day: 1, fav: ["tra_sen", "den_nong", "ca_phe_trung"], patience: 1.8, tip: 1.0,
    look: { g: "m", age: "old", skin: "#e2b48c", hair: "bald", hc: "#f2f2f2", shirt: "shirt", sc: "#8d6e63", acc: ["beard"] },
    bio: L("Tám mươi lăm tuổi, vô địch cờ tướng phố cổ ba mươi năm liền."),
    greet: [L("Con bé, có ai đánh với cụ ván cờ không?"), L("Một ly nóng, đặc vào nhé."), L("Phố này đổi nhiều rồi, chỉ quán này là còn giữ hương cũ.")],
    happy: [L("Khá lắm! Cờ cao một nước."), L("Đậm đà, đúng vị Hà Nội.")],
    sad: [L("Nước này đi hỏng rồi con ạ.")],
    chats: [
      { q: L("Con có biết đánh cờ tướng không? Cờ dạy người ta kiên nhẫn đấy."), a: [
        [L("Cụ dạy con đi ạ, con muốn học."), 9, L("Tốt! Bài đầu tiên: pháo đầu.")],
        [L("Con chỉ biết cờ ca rô cụ ạ."), 4, L("Ca rô cũng là cờ, haha.")],
        [L("Cờ chán lắm cụ."), -4, L("Chán là vì chưa hiểu đấy.")]] },
      { q: L("Hồi xưa phố này có tiếng rao 'Ai bánh mì nóng giòn đây'. Giờ vắng rồi."), a: [
        [L("Con vẫn nghe thấy mỗi sáng sớm đó cụ."), 7, L("Thế à... vậy là phố chưa mất hồn.")],
        [L("Giờ người ta đặt app hết rồi cụ."), 3, L("Ừ, thời thế.")],
        [L("Cụ hoài cổ quá."), -2, L("Già rồi, không hoài cổ thì hoài gì.")]] },
    ],
    story: [
      { h: 1, lines: [L("Cụ dạy con một mẹo: đánh trứng phải nhẹ tay, như đi quân sĩ."), L("Bọt mịn thì cà phê mới mượt.")], reward: { rep: 3 } },
      { h: 3, lines: [L("Ngày xưa cụ hay uống cà phê trứng rắc chút ca cao."), L("Con thử làm xem: phin, kem trứng, rồi rắc ca cao lên trên."), L("Gọi nó là... 'Cà phê Cụ Hòa' nhé, hà hà.")], reward: { recipe: "cf_cu_hoa" } },
      { h: 5, lines: [L("Cụ thắng giải cờ phường lần thứ ba mươi mốt!"), L("Cúp này cụ để ở quán con, ai vào cũng thấy.")], reward: { rep: 7 } },
    ] },

  { id: "hang", name: L("Hằng"), title: L("Sinh viên Mỹ thuật"), loc: "hanoi", day: 2, fav: ["cf_com", "ca_phe_trung", "tra_dao", "tra_chanh"], patience: 1.2, tip: 0.9,
    look: { g: "f", age: "young", skin: "#fde0c5", hair: "bob", hc: "#c0392b", shirt: "tee", sc: "#f4a261", acc: ["beret"] },
    bio: L("Vẽ ký họa phố cổ, áo lúc nào cũng dính màu nước."),
    greet: [L("Chị Uyên ơi, cho em ngồi vẽ cái cửa sổ quán nha!"), L("Hôm nay ánh nắng vàng như màu ochre."), L("Em hết tiền mua màu rồi... nhưng vẫn phải có cà phê!")],
    happy: [L("Màu ly nước đẹp quá, em vẽ lại liền!"), L("Ngon như một bức tranh vậy.")],
    sad: [L("Màu này hơi... lệch tông chị ạ.")],
    chats: [
      { q: L("Chị thích tranh sơn dầu hay màu nước hơn?"), a: [
        [L("Màu nước, nhẹ nhàng như sáng sớm Hà Nội."), 8, L("Đúng gu em luôn!")],
        [L("Sơn dầu, nhìn đậm đà như cà phê."), 6, L("So sánh hay ghê.")],
        [L("Chị không rành tranh lắm."), 1, L("Không sao, em dạy chị.")]] },
      { q: L("Bố mẹ em muốn em học kế toán, không cho theo vẽ..."), a: [
        [L("Làm điều em yêu, nhưng cũng nói chuyện thật lòng với bố mẹ nhé."), 9, L("Dạ... em sẽ thử nói chuyện lại.")],
        [L("Kế toán cũng ổn định mà."), 2, L("Ổn định... mà không vui.")],
        [L("Bỏ nhà đi vẽ luôn!"), -3, L("Chị ơi, nghe liều quá...")]] },
    ],
    story: [
      { h: 1, lines: [L("Em tặng chị bức ký họa quán mình nè."), L("Chị treo lên được không?")], reward: { rep: 3 } },
      { h: 3, lines: [L("Em vẽ lại menu cho quán chị, chữ tay và hình minh họa!"), L("Khách khen dễ thương lắm đó.")], reward: { flow: 0.03 } },
      { h: 5, lines: [L("Triển lãm đầu tay của em mở rồi chị ơi! Bố mẹ em cũng tới."), L("Bức tranh lớn nhất tên là 'Cửa hàng nhỏ của Uyên'."), L("Có người mua nó, em chia chị một phần nha.")], reward: { money: 600000, rep: 4 } },
    ] },

  { id: "duc", name: L("Đức"), title: L("Nghệ sĩ saxophone"), loc: "hanoi", day: 3, fav: ["den_da", "latte", "jazz_latte"], patience: 1.3, tip: 1.3,
    look: { g: "m", age: "mid", skin: "#c68642", hair: "curly", hc: "#1a1a1a", shirt: "shirt", sc: "#264653", acc: ["beard", "sunglasses"] },
    bio: L("Thổi saxophone ở một club jazz phố Tạ Hiện. Đêm diễn, ngày ngủ."),
    greet: [L("Yo Uyên, nhạc quán hôm nay swing đấy."), L("Vừa diễn xong, cần một ly thật đậm."), L("Em mở bài này... Coltrane hả? Không, nghe giống nhạc tự chế.")],
    happy: [L("Ngọt như một nốt Si giáng."), L("Groove quá! Ly này có nhịp điệu.")],
    sad: [L("Lệch tông rồi em ơi...")],
    chats: [
      { q: L("Em có biết jazz hay nhất ở chỗ nào không? Ở những nốt mình không chơi."), a: [
        [L("Như cà phê phin, ngon nhất ở lúc chờ từng giọt."), 9, L("Wow... câu này anh phải viết thành bài.")],
        [L("Vậy anh im lặng cả buổi là hay nhất à?"), 4, L("Haha, đỡ không nổi.")],
        [L("Em chỉ nghe nhạc trẻ thôi."), -2, L("Ừ... cũng được.")]] },
      { q: L("Anh định thôi diễn club để đi dạy nhạc cho trẻ con. Có nên không?"), a: [
        [L("Truyền lửa cho bọn trẻ là điều tuyệt vời mà anh."), 8, L("Ừ, anh cũng nghĩ vậy.")],
        [L("Anh sẽ nhớ sân khấu lắm đó."), 6, L("Đúng... có lẽ anh vẫn diễn cuối tuần.")],
        [L("Dạy trẻ con mệt lắm."), -2, L("Ừm... cảm ơn đã cảnh báo.")]] },
    ],
    story: [
      { h: 1, lines: [L("Anh thu một bản nhạc ngẫu hứng tên là 'Phin chiều'."), L("Em mở trong quán đi, coi như quà.")], reward: { rep: 3 } },
      { h: 3, lines: [L("Anh có công thức của club cũ: espresso, sữa đặc, sữa tươi, bọt sữa, rắc ca cao."), L("Tụi anh gọi là 'Latte Jazz Đêm'. Giờ nó là của em.")], reward: { recipe: "jazz_latte" } },
      { h: 5, lines: [L("Tối thứ bảy này anh mang ban nhạc tới quán em diễn miễn phí."), L("Đêm jazz đầu tiên của 'Cửa hàng nhỏ của Uyên'!")], reward: { money: 500000, flow: 0.04 } },
    ] },

  { id: "chithu", name: L("Chị Thu"), title: L("Bán hoa xe đạp"), loc: "hanoi", day: 2, fav: ["sua_da", "tra_chanh"], patience: 1.0, tip: 1.0,
    look: { g: "f", age: "mid", skin: "#e8b88a", hair: "nonla", hc: "#2b1b12", shirt: "blouse", sc: "#ff99c8", acc: [] },
    bio: L("Chiếc xe đạp chở đầy hoa theo mùa: sen tháng sáu, cúc họa mi tháng mười một."),
    greet: [L("Uyên ơi, chị để xe hoa trước cửa nhé!"), L("Hôm nay có hoa sen, đẹp lắm em ạ."), L("Bán chưa được bó nào, uống ly lấy hên.")],
    happy: [L("Ngọt ngào như bó hồng nhung!"), L("Uống xong chắc bán đắt hàng!")],
    sad: [L("Hôm nay xui thật...")],
    chats: [
      { q: L("Em thích hoa gì nhất?"), a: [
        [L("Cúc họa mi, mùa đó Hà Nội đẹp nhất chị ạ."), 8, L("Đúng rồi! Tháng mười một chị để dành cho em bó đẹp nhất.")],
        [L("Hoa hồng, sang trọng."), 5, L("Hồng thì chị có đủ màu.")],
        [L("Hoa nào cũng héo cả."), -3, L("Nói vậy buồn ghê...")]] },
      { q: L("Con chị năm nay thi vào lớp mười, chị lo quá."), a: [
        [L("Chị cứ động viên cháu, áp lực quá cháu dễ mệt."), 8, L("Ừ... chị sẽ bớt la nó.")],
        [L("Cháu sẽ đỗ thôi chị!"), 6, L("Mong là vậy, cảm ơn em.")],
        [L("Thi trượt thì học trường khác."), -1, L("Ừ... nói thì dễ.")]] },
    ],
    story: [
      { h: 1, lines: [L("Mỗi sáng chị sẽ để một bình hoa nhỏ trên quầy cho em."), L("Quán có hoa, khách vui hơn.")], reward: { rep: 3 } },
      { h: 3, lines: [L("Con chị đỗ trường chuyên rồi Uyên ơi!"), L("Chị khao em bó hoa to nhất và cả... tiền mua đường cho quán.")], reward: { money: 300000 } },
      { h: 5, lines: [L("Chị dành dụm mở được sạp hoa cố định rồi, ngay cạnh quán em."), L("Từ giờ hàng xóm thật sự rồi nhé!")], reward: { flow: 0.04 } },
    ] },

  // ===== Sài Gòn =====
  { id: "bao", name: L("Bảo"), title: L("Founder startup"), loc: "saigon", day: 1, fav: ["espresso", "den_da", "bac_xiu"], patience: 0.8, tip: 1.3,
    look: { g: "m", age: "young", skin: "#f1c27d", hair: "spiky", hc: "#222222", shirt: "tee", sc: "#2b2d42", acc: ["headphones"] },
    bio: L("Gọi vốn ba lần thất bại, lần thứ tư đang... đang gọi."),
    greet: [L("Chị Uyên, cho em ly đậm nhất, em pitch lúc mười giờ!"), L("Hôm qua em ngủ ba tiếng, chuyện bình thường."), L("Chị có muốn đầu tư startup không? Đùa thôi.")],
    happy: [L("Ly này scale được nè chị!"), L("Đậm đà, đúng tinh thần khởi nghiệp.")],
    sad: [L("Pivot được không chị... ý em là đổi vị.")],
    chats: [
      { q: L("Nhà đầu tư nói ý tưởng em 'quá sớm'. Chị thấy sao?"), a: [
        [L("Sớm thì kiên nhẫn chờ thời, như ủ cà phê vậy."), 9, L("Cold brew mindset! Em thích.")],
        [L("Vậy làm cái khác đi em."), 2, L("Nghe đau ghê chị.")],
        [L("Chị không hiểu startup lắm."), 3, L("Chị đang chạy chuỗi quán đó, startup chính hiệu luôn!")]] },
      { q: L("Chị nghĩ làm giàu nhanh hay làm giàu bền?"), a: [
        [L("Bền chứ, từng ly một, từng khách một."), 8, L("Đúng rồi... em vội quá.")],
        [L("Nhanh, rồi nghỉ hưu sớm!"), 3, L("Mơ ước chung của dân tech.")],
        [L("Làm giàu gì, đủ sống là vui."), 6, L("Nghe bình yên ghê.")]] },
    ],
    story: [
      { h: 1, lines: [L("Em mang team tới ngồi brainstorm ở quán chị mỗi chiều thứ tư."), L("Chị ráng giữ cái bàn dài cho tụi em nha!")], reward: { money: 300000 } },
      { h: 3, lines: [L("Gọi vốn thành công rồi chị Uyên ơiii!"), L("Câu kết bài pitch của em là 'kiên nhẫn như ủ cà phê'. Bản quyền của chị đó.")], reward: { money: 800000 } },
      { h: 5, lines: [L("Công ty em giờ có năm mươi người. Mỗi sáng đặt cà phê từ quán chị."), L("Hợp đồng dài hạn, chị ký giúp em nha!")], reward: { flow: 0.05, rep: 4 } },
    ] },

  { id: "vy", name: "Vy", title: L("Nhân viên ngân hàng"), loc: "saigon", day: 1, fav: ["rau_ma_dx", "sua_chua_cf", "tra_vai", "bac_xiu"], patience: 1.0, tip: 1.2,
    look: { g: "f", age: "young", skin: "#fce1cf", hair: "long", hc: "#7b4b2a", shirt: "blouse", sc: "#ffffff", acc: ["earrings"] },
    bio: L("Đếm tiền cả ngày nhưng ước mơ là mở tiệm bánh."),
    greet: [L("Chị ơi, cứu em với, cuối tháng chốt sổ!"), L("Hôm nay khách vay đông dã man."), L("Cho em món mát mát, ngọt ngọt nhé.")],
    happy: [L("Ngọt dịu, như lúc được lương!"), L("Ngon quá chị ơi, em hết stress.")],
    sad: [L("Chắc em quen vị cũ rồi...")],
    chats: [
      { q: L("Em muốn nghỉ ngân hàng mở tiệm bánh, nhưng sợ mất ổn định..."), a: [
        [L("Thử bán bánh online cuối tuần trước đã, có khách rồi tính tiếp."), 9, L("Ý hay quá! Bắt đầu nhỏ thôi.")],
        [L("Nghỉ liền đi, đời có một lần!"), 3, L("Em chưa đủ gan chị ạ.")],
        [L("Ngân hàng lương cao mà, tiếc lắm."), 1, L("Ừ... ai cũng nói vậy.")]] },
      { q: L("Chị có hay tiết kiệm không? Em lập bảng chi tiêu từng đồng."), a: [
        [L("Có, chạy quán là phải tính kỹ tiền nguyên liệu, tiền thuê, tiền lương."), 8, L("Chị đúng là bà chủ thực thụ.")],
        [L("Chị tiêu theo cảm hứng."), 2, L("Ôi, nghe mà em hoảng.")],
        [L("Em dạy chị với!"), 6, L("Được! Bài một: ghi lại mọi khoản chi.")]] },
    ],
    story: [
      { h: 1, lines: [L("Em làm thử mẻ bánh bông lan, mang cho chị ăn thử."), L("Khách nào hỏi thì giới thiệu giúp em nhé.")], reward: { rep: 3 } },
      { h: 3, lines: [L("Em bán bánh online được hai trăm đơn tháng rồi!"), L("Em gửi chị tiền hoa hồng vì đã giới thiệu.")], reward: { money: 500000 } },
      { h: 5, lines: [L("Em nghỉ ngân hàng rồi, tiệm bánh khai trương tuần sau."), L("Mình làm đối tác nha: bánh của em, cà phê của chị!")], reward: { flow: 0.04, rep: 4 } },
    ] },

  { id: "chusau", name: L("Chú Sáu"), title: L("Xe ôm truyền thống"), loc: "saigon", day: 2, fav: ["tra_tac", "den_da", "sua_da"], patience: 1.3, tip: 0.9,
    look: { g: "m", age: "old", skin: "#c68642", hair: "cap", hc: "#2f4858", shirt: "shirt", sc: "#4ea8de", acc: ["mustache"] },
    bio: L("Chạy xe ôm từ thời chưa có app. Biết mọi câu chuyện của Sài Gòn."),
    greet: [L("Con gái, cho chú ly đen đá, nhiều đá nghen!"), L("Trời Sài Gòn nóng muốn xỉu luôn con."), L("Bữa nay ế khách quá trời.")],
    happy: [L("Đã quá con ơi! Uống cái mát rượi!"), L("Ngon dữ thần!")],
    sad: [L("Ờ, uống đỡ khát cũng được.")],
    chats: [
      { q: L("Hồi trước chú chở khách bằng xe Cub, giờ ai cũng xài app. Chú theo không kịp..."), a: [
        [L("Con chỉ chú cài app chạy luôn, thêm khách mà chú!"), 9, L("Thiệt hả? Con chỉ chú nghen!")],
        [L("Chú cứ chạy khách ruột cũng được mà."), 5, L("Ờ, khách ruột thương chú lắm.")],
        [L("Chú nghỉ hưu đi."), -2, L("Nghỉ thì lấy gì ăn con...")]] },
      { q: L("Con biết hẻm nào ở Sài Gòn có tô hủ tiếu ngon nhất không?"), a: [
        [L("Chú dẫn đường đi, con bao chú một tô!"), 8, L("Chịu chơi! Chủ nhật này nha.")],
        [L("Con chỉ biết pha cà phê thôi chú."), 3, L("Vậy để chú chỉ con.")],
        [L("Con ăn kiêng chú ơi."), 1, L("Tội nghiệp, ăn kiêng gì ở Sài Gòn.")]] },
    ],
    story: [
      { h: 1, lines: [L("Chú giới thiệu quán con cho hết mấy ông xe ôm đầu chợ."), L("Mai tụi nó kéo nhau tới uống đó!")], reward: { flow: 0.03 } },
      { h: 3, lines: [L("Nhờ con chỉ cài app, giờ ngày chú chạy được gấp đôi."), L("Chú gửi con ít tiền, coi như cảm ơn, đừng từ chối.")], reward: { money: 300000 } },
      { h: 5, lines: [L("Chú có đứa cháu muốn học nghề pha chế."), L("Con nhận nó làm học việc nghen? Nó chăm lắm.")], reward: { rep: 6 } },
    ] },

  { id: "jenny", name: "Jenny", title: L("Việt kiều về thăm quê"), loc: "saigon", day: 3, fav: ["bac_xiu", "ca_phe_dua"], patience: 1.1, tip: 1.6,
    look: { g: "f", age: "young", skin: "#f5d0b0", hair: "long", hc: "#e0b15a", shirt: "tee", sc: "#ff6b6b", acc: ["sunglasses"] },
    bio: L("Sinh ra ở California, về Việt Nam tìm lại mùi vị tuổi thơ trong lời kể của mẹ."),
    greet: [L("Hi chị! Em muốn thử... bạc xỉu? Em nói đúng không?"), L("Mẹ em nói cà phê Việt Nam là best in the world!"), L("Chị ơi, chị nói chậm chậm giúp em nha.")],
    happy: [L("Oh my god, ngon quá trời luôn!"), L("Đúng vị mẹ em kể! I could cry.")],
    sad: [L("Hmm, khác khác so với em tưởng...")],
    chats: [
      { q: L("Tiếng Việt của em có kỳ không chị? Em học mẹ hết đó."), a: [
        [L("Dễ thương lắm, chị nghe hiểu hết luôn!"), 9, L("Thật hả? Em vui quá!")],
        [L("Hơi lơ lớ nhưng ổn mà."), 5, L("Em sẽ luyện thêm!")],
        [L("Em nói tiếng Anh đi cho nhanh."), -3, L("Oh... em muốn nói tiếng Việt mà.")]] },
      { q: L("Mẹ em kể hồi xưa bà ngoại bán cà phê ở chợ Bến Thành. Em muốn tìm lại chỗ đó."), a: [
        [L("Chị dẫn em đi hỏi mấy cô bán lâu năm nha."), 9, L("Chị tốt quá, thank you so much!")],
        [L("Chợ đổi nhiều rồi, khó tìm lắm em."), 3, L("Em biết... nhưng em vẫn muốn thử.")],
        [L("Chắc mẹ em nhớ nhầm."), -3, L("Hmm...")]] },
    ],
    story: [
      { h: 1, lines: [L("Em gọi video cho mẹ, cho mẹ xem quán chị."), L("Mẹ khóc luôn, nói giống quán bà ngoại ngày xưa.")], reward: { rep: 3 } },
      { h: 3, lines: [L("Mình tìm được cô bán cà phê quen bà ngoại em rồi!"), L("Cô còn nhớ tên bà luôn. Cảm ơn chị nhiều lắm.")], reward: { money: 600000 } },
      { h: 5, lines: [L("Em quyết định ở lại Việt Nam một năm."), L("Em sẽ viết blog tiếng Anh về quán chị cho bạn bè quốc tế!")], reward: { flow: 0.05 } },
    ] },

  // ===== Đà Lạt =====
  { id: "phuong", name: L("Phương"), title: L("Chủ vườn dâu"), loc: "dalat", day: 1, fav: ["tra_atiso", "ca_cao_nong", "tra_dau", "den_nong"], patience: 1.3, tip: 1.1,
    look: { g: "f", age: "young", skin: "#ffe0cc", hair: "pony", hc: "#3d2314", shirt: "flannel", sc: "#d62828", acc: ["scarf"] },
    bio: L("Bỏ phố về Đà Lạt trồng dâu. Hai bàn tay lúc nào cũng thơm mùi đất."),
    greet: [L("Chào Uyên, sáng nay sương dày quá."), L("Dâu năm nay ngọt lắm nè!"), L("Cho mình ly gì nóng nóng nha.")],
    happy: [L("Ấm cả người luôn!"), L("Ngon như dâu mới hái.")],
    sad: [L("Hơi nguội rồi Uyên ơi...")],
    chats: [
      { q: L("Uyên có nghĩ tới chuyện bỏ phố về rừng như mình không?"), a: [
        [L("Có chứ, nhưng chắc phải mang theo cái phin!"), 8, L("Haha, mang cả quán lên luôn!")],
        [L("Mình mê thành phố hơn."), 4, L("Mỗi người một kiểu mà.")],
        [L("Về rừng chi cho muỗi đốt."), -2, L("Muỗi Đà Lạt hiền mà...")]] },
      { q: L("Mùa này mưa nhiều, dâu dễ hỏng lắm. Mình lo quá."), a: [
        [L("Quán mình mua dâu của Phương để làm đồ uống nhé!"), 9, L("Thật hả? Vậy là có đầu ra rồi!")],
        [L("Làm mứt dâu để được lâu hơn đó."), 6, L("Ý hay, mình thử.")],
        [L("Trồng cây khác đi."), -2, L("Dâu là đam mê mà...")]] },
    ],
    story: [
      { h: 1, lines: [L("Mình mang cho Uyên một rổ dâu đầu mùa."), L("Pha thử đồ uống gì đi!")], reward: { rep: 3 } },
      { h: 3, lines: [L("Thử công thức này nè: trà, dâu Đà Lạt, chút đường và đá."), L("Mình gọi là 'Trà dâu Đà Lạt'. Dâu cứ lấy ở vườn mình!")], reward: { recipe: "tra_dau" } },
      { h: 5, lines: [L("Vườn mình được cấp chứng nhận hữu cơ rồi!"), L("Khách du lịch tới vườn đều được giới thiệu sang quán Uyên.")], reward: { flow: 0.04, money: 400000 } },
    ] },

  { id: "khang", name: "Khang", title: L("Nhiếp ảnh gia"), loc: "dalat", day: 1, fav: ["den_nong", "cappuccino"], patience: 1.4, tip: 1.2,
    look: { g: "m", age: "mid", skin: "#e6b98f", hair: "beanie", hc: "#4a3b2f", shirt: "hoodie", sc: "#8d99ae", acc: ["camera", "beard"] },
    bio: L("Săn mây Đà Lạt lúc năm giờ sáng, săn cà phê lúc sáu giờ."),
    greet: [L("Sáng nay mây đẹp không tưởng, Uyên ạ."), L("Cho anh ngồi gần cửa, ánh sáng đẹp."), L("Anh chụp quán em một tấm được không?")],
    happy: [L("Ly này lên hình đẹp như phim."), L("Hoàn hảo, như khoảnh khắc vàng.")],
    sad: [L("Lệch nét rồi em...")],
    chats: [
      { q: L("Em có biết vì sao anh thích chụp phim hơn máy số không?"), a: [
        [L("Vì mỗi tấm đều phải chờ, như chờ phin nhỏ giọt."), 9, L("Chính xác! Em hiểu nghệ thuật đấy.")],
        [L("Vì nhìn hoài cổ, sang chảnh."), 4, L("Cũng đúng một phần.")],
        [L("Máy số tiện hơn mà anh."), 0, L("Tiện, nhưng thiếu hồn.")]] },
      { q: L("Anh muốn làm triển lãm về những quán cà phê nhỏ của Việt Nam."), a: [
        [L("Anh chụp quán em đi! Em sẽ giới thiệu các quán khác nữa."), 8, L("Deal! Em là người mẫu chính.")],
        [L("Ý tưởng hay quá anh."), 5, L("Cảm ơn em.")],
        [L("Ai đi xem ảnh quán cà phê."), -3, L("...Nhiều người lắm đó.")]] },
    ],
    story: [
      { h: 1, lines: [L("Anh chụp em đang pha phin lúc sương sớm."), L("Tấm này anh tặng em, đẹp lắm.")], reward: { rep: 3 } },
      { h: 3, lines: [L("Ảnh quán em được đăng trên một tạp chí du lịch."), L("Họ trả nhuận ảnh, anh chia em một nửa.")], reward: { money: 500000 } },
      { h: 5, lines: [L("Triển lãm 'Những cửa hàng nhỏ' mở ở Sài Gòn. Ảnh bìa là quán em."), L("Hàng nghìn người đã thấy nụ cười của Uyên đấy.")], reward: { flow: 0.05 } },
    ] },

  { id: "bamuoi", name: L("Bà Mười"), title: L("Đan len bên hiên"), loc: "dalat", day: 2, fav: ["sua_dau_nanh", "ca_cao_nong", "den_nong"], patience: 2.0, tip: 1.0,
    look: { g: "f", age: "old", skin: "#eec39a", hair: "bun", hc: "#e0e0e0", shirt: "blouse", sc: "#b5838d", acc: ["scarf"] },
    bio: L("Đan khăn len cho cả xóm. Thích ngồi sưởi nắng và kể chuyện xưa."),
    greet: [L("Cháu gái, cho bà ly ấm ấm."), L("Bà đan cho cháu cái khăn nè, lạnh rồi đó."), L("Hôm nay bà khỏe, đi bộ tới đây luôn.")],
    happy: [L("Ấm như bếp lửa nhà quê."), L("Cháu khéo tay ghê, giống bà hồi trẻ.")],
    sad: [L("Bà già rồi, uống gì cũng được cháu.")],
    chats: [
      { q: L("Cháu có muốn học đan len không? Bà dạy cho."), a: [
        [L("Dạ có! Rảnh tay con sẽ ngồi học bà."), 9, L("Ngoan quá. Bài đầu: mũi lên, mũi xuống.")],
        [L("Con vụng lắm bà ơi."), 4, L("Vụng thì tập, có gì đâu.")],
        [L("Giờ ai còn đan len bà."), -3, L("Bà vẫn đan đây thôi...")]] },
      { q: L("Con cháu bà ở xa hết, ít khi về..."), a: [
        [L("Bà cứ ghé quán con mỗi ngày, con làm cháu bà!"), 9, L("Ôi cháu tôi... bà cảm động quá.")],
        [L("Chắc họ bận việc thôi bà."), 4, L("Ừ, bà biết.")],
        [L("Bà gọi điện cho họ đi."), 3, L("Bà không rành điện thoại...")]] },
    ],
    story: [
      { h: 1, lines: [L("Bà đan cho cháu cái khăn màu cà phê sữa."), L("Đeo vào cho ấm cổ khi pha chế sớm.")], reward: { rep: 3 } },
      { h: 3, lines: [L("Bà dạy cả hội phụ nữ phường đan khăn bán cho du khách."), L("Bà gửi ít tiền lãi cho quán, coi như tiền thuê chỗ ngồi.")], reward: { money: 300000 } },
      { h: 5, lines: [L("Con cháu bà về thăm rồi! Bà dẫn tụi nó tới quán cháu."), L("Bà bảo: đây là cháu gái thứ mười một của bà.")], reward: { rep: 7 } },
    ] },

  // ===== Hội An =====
  { id: "tom", name: "Tom", title: L("Du khách Úc"), loc: "hoian", day: 1, fav: ["ca_phe_dua", "nuoc_mot", "den_da"], patience: 1.2, tip: 1.6,
    look: { g: "m", age: "mid", skin: "#f7c6a3", hair: "short", hc: "#f2d16b", shirt: "hawaii", sc: "#06d6a0", acc: ["sunglasses"] },
    bio: L("Đến Hội An ba ngày, ở lại ba năm. Đang học tiếng Việt qua thực đơn."),
    greet: [L("Xin chào! Một... cà phê, please. Đúng không?"), L("G'day Uyên! Hôm nay nóng quá!"), L("Tôi học được từ mới: 'ngon quá'!")],
    happy: [L("Ngon quá! Wow, I mean... rất ngon!"), L("Best coffee in Hội An, no worries!")],
    sad: [L("Hmm, hơi lạ... strange taste, mate.")],
    chats: [
      { q: L("Tiếng Việt khó quá! Ma, má, mà, mả, mã, mạ... Help me!"), a: [
        [L("Từ từ thôi Tom, mỗi ngày một từ nhé. Hôm nay: 'cà phê sữa đá'."), 9, L("Cà... phê... sữa... đá! Tôi làm được!")],
        [L("Cứ nói tiếng Anh, Uyên hiểu mà."), 3, L("Nhưng tôi muốn học!")],
        [L("Ừ khó thật, bỏ đi."), -3, L("Oh no...")]] },
      { q: L("Tôi muốn mở tour xe đạp quanh làng rau Trà Quế. Có tốt không?"), a: [
        [L("Tuyệt! Điểm dừng cuối là quán Uyên nhé!"), 8, "Deal, mate! Partnership!"],
        [L("Nắng lắm đó, nhớ mang nước."), 5, L("Good tip, cảm ơn!")],
        [L("Ai mà đạp xe trong nắng."), -2, L("Người Úc... thích nắng mà.")]] },
    ],
    story: [
      { h: 1, lines: [L("Tôi viết review năm sao cho quán Uyên trên trang du lịch!"), L("Bạn bè ở Sydney hỏi địa chỉ rồi.")], reward: { flow: 0.03 } },
      { h: 3, lines: [L("Tour xe đạp của tôi chạy rồi! Mỗi đoàn dừng ở quán Uyên."), L("Đây là phần chia lợi nhuận, fair dinkum!")], reward: { money: 600000 } },
      { h: 5, lines: [L("Uyên ơi, tôi được nhập quốc tịch... à không, được cấp thẻ tạm trú dài hạn!"), L("Hội An là nhà tôi rồi. Và quán Uyên là phòng khách.")], reward: { rep: 6, flow: 0.03 } },
    ] },

  { id: "cosau", name: L("Cô Sáu"), title: L("Thợ may áo dài"), loc: "hoian", day: 1, fav: ["tra_la_dua", "nuoc_mot", "tra_vai"], patience: 1.3, tip: 1.2,
    look: { g: "f", age: "mid", skin: "#f0c29b", hair: "bun", hc: "#1a1a1a", shirt: "aodai", sc: "#e63946", acc: ["earrings"] },
    bio: L("Tiệm may ba đời. May áo dài cho khách từ khắp thế giới trong hai mươi bốn giờ."),
    greet: [L("Uyên ơi, khách đặt năm bộ áo dài, cô cần tỉnh táo!"), L("Cho cô ly mát mát, may cả đêm qua."), L("Hôm nay cô đo cho cô dâu người Pháp đó.")],
    happy: [L("Khéo như đường kim mũi chỉ!"), L("Mát cả ruột gan, cảm ơn con.")],
    sad: [L("Đường may này hơi lệch rồi con.")],
    chats: [
      { q: L("Con mặc áo dài màu gì đẹp nhỉ? Để cô may tặng."), a: [
        [L("Màu nâu cà phê sữa, cô ơi!"), 9, L("Đúng chất bà chủ quán! Cô may liền.")],
        [L("Màu đỏ cho may mắn."), 6, L("Đỏ hợp với con lắm.")],
        [L("Con không mặc áo dài đâu."), -2, L("Tiếc ghê...")]] },
      { q: L("Con gái cô không muốn nối nghề may. Cô buồn mà cũng không ép được."), a: [
        [L("Nghề có thể đổi, nhưng tình yêu cái đẹp nó sẽ giữ cô ạ."), 9, L("Con nói phải... cô nhẹ lòng hơn rồi.")],
        [L("Cô nhận học trò khác đi."), 5, L("Ừ, cũng nên vậy.")],
        [L("Nghề may cực lắm mà cô."), 1, L("Cực, nhưng vui.")]] },
    ],
    story: [
      { h: 1, lines: [L("Cô may đồng phục cho nhân viên quán con, tặng luôn!"), L("Mặc vào nhìn chuyên nghiệp hẳn.")], reward: { rep: 4 } },
      { h: 3, lines: [L("Khách nước ngoài may áo ở tiệm cô, cô đều giới thiệu sang quán con."), L("Hôm qua có mười người khen nước mót của con đó.")], reward: { flow: 0.03 } },
      { h: 5, lines: [L("Cô may xong rồi nè: áo dài màu cà phê sữa, thêu hình cái phin."), L("Mặc vào hôm khai trương quán mới nhé con.")], reward: { rep: 5, money: 400000 } },
    ] },

  { id: "nghia", name: L("Nghĩa"), title: L("Nghệ nhân đèn lồng"), loc: "hoian", day: 2, fav: ["den_da", "nuoc_mot"], patience: 1.2, tip: 1.0,
    look: { g: "m", age: "young", skin: "#d9a066", hair: "short", hc: "#1d1410", shirt: "tee", sc: "#f9c74f", acc: [] },
    bio: L("Mỗi chiếc đèn lồng là một tuần làm thủ công. Mơ thắp sáng cả phố cổ."),
    greet: [L("Chào chị Uyên, tay em còn dính hồ dán."), L("Hôm nay em làm xong chiếc đèn thứ một trăm!"), L("Phố tối nay sẽ sáng rực.")],
    happy: [L("Ngon, sáng cả đầu óc!"), L("Giống ánh đèn lồng, ấm áp ghê.")],
    sad: [L("Hôm nay chắc em mệt nên uống không thấy ngon.")],
    chats: [
      { q: L("Chị thích đèn lồng màu gì? Em làm tặng một chiếc."), a: [
        [L("Vàng nghệ, giống màu tường Hội An."), 9, L("Chuẩn! Em làm liền.")],
        [L("Màu nào cũng đẹp hết em."), 5, L("Vậy em làm nhiều màu luôn.")],
        [L("Chị không treo đèn lồng."), -2, L("Ơ... tiếc ghê.")]] },
      { q: L("Có người nói đèn lồng nhựa rẻ hơn, nghề thủ công sẽ mất..."), a: [
        [L("Đồ thủ công có hồn, khách du lịch sẽ luôn tìm kiếm."), 9, L("Cảm ơn chị, em có thêm động lực.")],
        [L("Em mở lớp dạy làm đèn cho du khách đi."), 7, L("Ý hay! Vừa kiếm tiền vừa giữ nghề.")],
        [L("Thời thế thay đổi mà."), 0, L("Ừm...")]] },
    ],
    story: [
      { h: 1, lines: [L("Đèn lồng vàng nghệ cho quán chị đây!"), L("Treo ở cửa, khách từ xa đã thấy.")], reward: { flow: 0.03 } },
      { h: 3, lines: [L("Lớp dạy làm đèn lồng của em đông khách lắm."), L("Buổi học xong em dẫn họ sang quán chị uống nước.")], reward: { money: 400000 } },
      { h: 5, lines: [L("Em được mời làm đèn lồng cho lễ hội quốc tế!"), L("Em muốn trang trí quán chị bằng chiếc đèn lớn nhất.")], reward: { rep: 6 } },
    ] },

  // ===== Đà Nẵng =====
  { id: "hai", name: L("Hải"), title: L("Dân lướt sóng"), loc: "danang", day: 1, fav: ["nuoc_dua", "sinh_to_bo", "nuoc_cam", "ca_phe_dua"], patience: 1.0, tip: 1.1,
    look: { g: "m", age: "young", skin: "#b5774a", hair: "curly", hc: "#3b2a1a", shirt: "tank", sc: "#00b4d8", acc: [] },
    bio: L("Sáng lướt sóng Mỹ Khê, chiều dạy lướt cho khách, tối ngủ sớm."),
    greet: [L("Sóng hôm nay cao hai mét đó chị!"), L("Cho em ly mát lạnh nha, nắng cháy rồi."), L("Chị đi lướt sóng với em không?")],
    happy: [L("Mát như sóng vỗ!"), L("Đã quá chị ơi, nạp năng lượng xong!")],
    sad: [L("Hơi nhạt như biển lặng...")],
    chats: [
      { q: L("Chị có sợ biển không? Em dạy lướt sóng miễn phí cho chị!"), a: [
        [L("Sợ, nhưng chị muốn thử! Sáng chủ nhật nhé."), 9, L("Tuyệt vời! Chị dũng cảm ghê.")],
        [L("Chị chỉ thích ngắm biển thôi."), 4, L("Ngắm cũng đẹp mà.")],
        [L("Lướt sóng nguy hiểm lắm."), -1, L("Có em kèm thì an toàn mà chị.")]] },
      { q: L("Rác trên bãi biển nhiều quá, em muốn tổ chức nhặt rác mỗi tuần."), a: [
        [L("Quán chị tài trợ nước uống cho tình nguyện viên!"), 9, L("Chị là nhất!")],
        [L("Chị sẽ tham gia một buổi."), 7, L("Hẹn chị sáng thứ bảy.")],
        [L("Mấy chuyện đó để nhà nước lo."), -3, L("Biển là của tụi mình mà chị...")]] },
    ],
    story: [
      { h: 1, lines: [L("Nhóm nhặt rác của em có ba chục người rồi."), L("Ai cũng mặc áo in logo quán chị đó!")], reward: { flow: 0.03 } },
      { h: 3, lines: [L("Em thắng giải lướt sóng miền Trung!"), L("Tiền thưởng em mời cả nhóm ăn và gửi quán chị một ít.")], reward: { money: 500000 } },
      { h: 5, lines: [L("Chị Uyên đứng được trên ván rồi! Em quay video lại rồi nè."), L("Video viral luôn, ai cũng hỏi 'chị chủ quán lướt sóng' là ai.")], reward: { rep: 6, flow: 0.03 } },
    ] },

  { id: "ngoc", name: L("Chị Ngọc"), title: L("Hướng dẫn viên du lịch"), loc: "danang", day: 1, fav: ["dua_dam", "ca_phe_dua", "tra_dao"], patience: 0.9, tip: 1.3,
    look: { g: "f", age: "mid", skin: "#f3c7a4", hair: "bob", hc: "#2b1b12", shirt: "shirt", sc: "#52b788", acc: ["sunglasses"] },
    bio: L("Nói được bốn thứ tiếng, dẫn đoàn lên Bà Nà, xuống Hội An mỗi ngày."),
    greet: [L("Uyên ơi, đoàn khách Hàn tới sau mười phút nữa!"), L("Chị cần ly mát để nói tiếp tám tiếng."), L("Hôm nay dẫn đoàn lên Ngũ Hành Sơn, mệt ghê.")],
    happy: [L("Ngon! Chị giới thiệu cho cả đoàn!"), L("Đúng chuẩn đặc sản biển.")],
    sad: [L("Khách hỏi thì chị biết nói sao đây...")],
    chats: [
      { q: L("Khách nước ngoài hay hỏi chị: cà phê Việt có gì đặc biệt?"), a: [
        [L("Pha phin chậm rãi, như nhịp sống người Việt vậy chị."), 9, L("Hay quá! Chị dùng câu này cho đoàn sau.")],
        [L("Đậm và ngọt, sữa đặc là bí quyết."), 6, L("Đúng, nhưng còn thiếu chút cảm xúc.")],
        [L("Rẻ chị ạ."), -2, L("Ờ... chị không nói vậy được.")]] },
      { q: L("Chị dẫn tour mười năm rồi mà chưa đi du lịch cho mình lần nào..."), a: [
        [L("Chị xứng đáng có một chuyến cho riêng mình đó!"), 8, L("Ừ nhỉ... chị sẽ đi Sa Pa.")],
        [L("Nghề của chị là đi mà."), 2, L("Đi làm khác đi chơi em ạ.")],
        [L("Em cũng chưa đi đâu."), 4, L("Vậy hai chị em hẹn nhau đi nhé.")]] },
    ],
    story: [
      { h: 1, lines: [L("Chị thêm quán em vào lịch trình tour ẩm thực."), L("Mỗi tuần ít nhất ba đoàn ghé!")], reward: { flow: 0.04 } },
      { h: 3, lines: [L("Công ty du lịch muốn ký hợp đồng cà phê với quán em."), L("Đây là tiền đặt cọc.")], reward: { money: 700000 } },
      { h: 5, lines: [L("Chị đi Sa Pa về rồi! Lần đầu tiên làm khách du lịch."), L("Chị mua quà cho em và quyết định: từ giờ mỗi năm đi một chuyến.")], reward: { rep: 5 } },
    ] },

  { id: "long", name: "Long", title: L("Kỹ sư cầu đường"), loc: "danang", day: 2, fav: ["den_da", "bac_xiu"], patience: 0.9, tip: 1.1,
    look: { g: "m", age: "mid", skin: "#e0ac69", hair: "hardhat", hc: "#1a1a1a", shirt: "shirt", sc: "#f77f00", acc: [] },
    bio: L("Tham gia xây cầu Rồng. Nhìn đâu cũng thấy kết cấu chịu lực."),
    greet: [L("Uyên, một ly đậm cho kỹ sư!"), L("Công trình mới khởi công, bận ghê."), L("Cái bàn này hơi cập kênh, để anh chỉnh.")],
    happy: [L("Chắc như móng cầu!"), L("Kết cấu vị hoàn hảo.")],
    sad: [L("Sai số hơi lớn em ơi.")],
    chats: [
      { q: L("Em có biết cầu Rồng phun lửa cuối tuần không? Anh tham gia làm đó."), a: [
        [L("Tuyệt quá! Anh kể em nghe chuyện xây cầu đi."), 9, L("Để anh kể từ cái trụ đầu tiên...")],
        [L("Em xem rồi, đẹp lắm!"), 6, L("Lần sau anh dẫn em lên chỗ đẹp nhất.")],
        [L("Em không thích chỗ đông người."), 0, L("Ừ, đông thật.")]] },
      { q: L("Anh làm xa nhà cả năm, con anh mới biết đi mà anh không thấy..."), a: [
        [L("Anh xin nghỉ phép về thăm con đi, công trình chờ được."), 9, L("Em nói đúng... anh sẽ xin nghỉ.")],
        [L("Anh gọi video mỗi tối nha."), 6, L("Ừ, anh vẫn gọi mà.")],
        [L("Vì công việc mà."), 0, L("Ừ... vì công việc.")]] },
    ],
    story: [
      { h: 1, lines: [L("Anh sửa giúp em cái kệ hàng sắp sập rồi đó."), L("Kỹ sư mà, không tính tiền!")], reward: { rep: 3 } },
      { h: 3, lines: [L("Anh về thăm con rồi, con gọi 'ba' rõ lắm!"), L("Cảm ơn em đã khuyên anh. Quà nè.")], reward: { money: 500000 } },
      { h: 5, lines: [L("Công ty anh đặt cà phê cho cả công trường hai trăm người."), L("Mỗi sáng, hợp đồng dài hạn với quán em.")], reward: { flow: 0.04, money: 300000 } },
    ] },

  // ===== Huế =====
  { id: "thaylam", name: L("Thầy Lâm"), title: L("Giáo viên Văn"), loc: "hue", day: 1, fav: ["tra_cung_dinh", "ca_phe_muoi", "den_nong"], patience: 1.5, tip: 1.1,
    look: { g: "m", age: "mid", skin: "#f0c8a0", hair: "side", hc: "#3a3a3a", shirt: "shirt", sc: "#f8f9fa", acc: ["glasses"] },
    bio: L("Dạy Văn trường Quốc Học. Chấm bài bên ly cà phê muối mỗi chiều."),
    greet: [L("Chào cô chủ, chiều Huế buồn mà đẹp."), L("Chồng bài kiểm tra này cao quá..."), L("Cho thầy một ly muối, như mọi khi.")],
    happy: [L("Mặn mà như câu hò Huế."), L("Thơm thảo quá, thầy cảm ơn.")],
    sad: [L("Bài này thầy cho điểm trung bình thôi.")],
    chats: [
      { q: L("Học trò bây giờ ít mê văn quá. Thầy phải làm sao?"), a: [
        [L("Thầy kể chuyện đời vào bài giảng, ai cũng thích nghe chuyện mà."), 9, L("Ý hay... văn học vốn là chuyện đời.")],
        [L("Cho tụi nhỏ xem phim chuyển thể."), 5, L("Cũng là một cách.")],
        [L("Văn chương thời nay khó kiếm tiền."), -2, L("Không phải cái gì cũng đo bằng tiền.")]] },
      { q: L("Cô chủ thích bài thơ nào về Huế?"), a: [
        [L("'Đây thôn Vĩ Dạ' của Hàn Mặc Tử thầy ạ."), 9, L("Sao anh không về chơi thôn Vĩ... Tuyệt.")],
        [L("Em thích nhạc Trịnh hơn."), 5, L("Nhạc Trịnh cũng là thơ.")],
        [L("Em không thuộc bài nào."), 0, L("Không sao, thầy đọc cho nghe.")]] },
    ],
    story: [
      { h: 1, lines: [L("Thầy dẫn học trò tới quán đọc thơ buổi chiều."), L("Gọi là 'Chiều thơ bên ly cà phê muối'.")], reward: { rep: 3 } },
      { h: 3, lines: [L("Học trò thầy đạt giải nhất Văn toàn quốc!"), L("Em ấy viết bài về một quán cà phê nhỏ bên sông Hương.")], reward: { money: 400000, rep: 3 } },
      { h: 5, lines: [L("Thầy viết bài thơ tặng quán, khắc lên tấm gỗ."), L("Treo ở cửa nhé: 'Giữ hương xưa, mở lối mới'.")], reward: { rep: 7 } },
    ] },

  { id: "ohien", name: L("O Hiền"), title: L("Bán chè hẻm"), loc: "hue", day: 1, fav: ["sua_sen", "ca_phe_muoi", "sua_da"], patience: 1.2, tip: 1.0,
    look: { g: "f", age: "mid", skin: "#eab991", hair: "nonla", hc: "#1a1a1a", shirt: "aodai", sc: "#9b5de5", acc: [] },
    bio: L("Gánh chè ba mươi sáu món, nổi tiếng nhất hẻm Kiệt."),
    greet: [L("Mệ ơi... à không, Uyên ơi, cho o ly cà phê muối!"), L("Hôm ni nắng chang chang, o mệt."), L("O mang cho Uyên chén chè bột lọc nè.")],
    happy: [L("Ngon rứa! O khen thiệt đó."), L("Mặn mặn ngọt ngọt, đúng vị Huế.")],
    sad: [L("Răng hôm ni hơi lạ rứa?")],
    chats: [
      { q: L("Uyên có biết nói giọng Huế không? Thử nói 'răng rứa' coi!"), a: [
        [L("Răng rứa o? Con nói được chưa?"), 9, L("Được rồi đó! Giọng dễ thương ghê.")],
        [L("Con chịu thôi o ơi."), 3, L("Từ từ tập nghe.")],
        [L("Khó nghe quá o."), -3, L("Khó nghe mà dễ thương mà...")]] },
      { q: L("O muốn bán chè ở quán Uyên, chung một góc được không?"), a: [
        [L("Được chứ o! Cà phê với chè, khách thích lắm!"), 9, L("Thiệt hả? O mừng quá!")],
        [L("Để con tính toán chỗ đã o."), 4, L("Ừ, không gấp.")],
        [L("Quán con nhỏ lắm o."), -1, L("Ừ, o hiểu.")]] },
    ],
    story: [
      { h: 1, lines: [L("O dạy Uyên bí quyết kem muối: muối hột rang, đánh với kem thật bông."), L("Người Huế uống là biết liền.")], reward: { rep: 4 } },
      { h: 3, lines: [L("Góc chè của o trong quán đắt khách lắm."), L("O chia lại cho Uyên phần tiền chỗ nè.")], reward: { money: 400000 } },
      { h: 5, lines: [L("Báo du lịch viết về 'quán cà phê có chè o Hiền'!"), L("Giờ khách từ Hà Nội, Sài Gòn vô đều hỏi thăm.")], reward: { flow: 0.05 } },
    ] },

  { id: "nam", name: "Nam", title: L("Ca sĩ ca Huế"), loc: "hue", day: 2, fav: ["tra_vai", "ca_phe_muoi"], patience: 1.2, tip: 1.2,
    look: { g: "m", age: "young", skin: "#f3cfa8", hair: "side", hc: "#1d1410", shirt: "aodai", sc: "#3a86ff", acc: [] },
    bio: L("Hát ca Huế trên thuyền rồng mỗi tối. Giọng trong như nước sông Hương."),
    greet: [L("Chị Uyên, tối ni em hát trên thuyền, chị nghe không?"), L("Giọng em hơi khàn, cho em ly trà mát."), L("Hôm ni sông Hương đẹp lắm chị.")],
    happy: [L("Thanh mát như câu Nam ai!"), L("Ngon chi lạ rứa!")],
    sad: [L("Lạc nhịp mất rồi chị ơi.")],
    chats: [
      { q: L("Người trẻ ít nghe ca Huế quá. Em có nên hát thêm nhạc trẻ không?"), a: [
        [L("Thử phối ca Huế với jazz đi, như nhạc quán chị!"), 9, L("Ca Huế jazz?! Nghe điên mà hay!")],
        [L("Hát nhạc trẻ cho dễ nổi."), 3, L("Nhưng em thương ca Huế...")],
        [L("Ca Huế buồn ngủ lắm."), -4, L("Chị nói vậy em buồn...")]] },
      { q: L("Chị có muốn đi thuyền rồng nghe ca Huế một lần không?"), a: [
        [L("Có chứ! Tối thứ bảy chị đóng quán sớm đi."), 9, L("Em hát tặng chị một bài riêng!")],
        [L("Để khi nào rảnh nha em."), 3, L("Dạ, chị nhớ nha.")],
        [L("Chị say sóng."), 0, L("Sông Hương êm mà chị.")]] },
    ],
    story: [
      { h: 1, lines: [L("Em hát một đoạn 'Lý con sáo' tặng quán."), L("Khách vỗ tay quá trời!")], reward: { rep: 3 } },
      { h: 3, lines: [L("Bản ca Huế phối jazz của em lên sóng truyền hình!"), L("Em quay MV ở quán chị đó, chị không phiền chứ?")], reward: { flow: 0.04 } },
      { h: 5, lines: [L("Em được mời biểu diễn ở Festival Huế."), L("Em xin hát mở màn bằng bài 'Cửa hàng nhỏ của Uyên'... em mới sáng tác đó.")], reward: { rep: 6, money: 500000 } },
    ] },
];

// ---------- Thành tựu ----------
const ACHIEVEMENTS = [
  { id: "first",   name: L("Ly đầu tiên"),        desc: L("Phục vụ ly nước đầu tiên"),               test: s => s.totals.served >= 1 },
  { id: "s100",    name: L("Tay pha quen việc"),  desc: L("Phục vụ 100 ly"),                          test: s => s.totals.served >= 100 },
  { id: "s1000",   name: L("Nghìn ly yêu thương"), desc: L("Phục vụ 1.000 ly toàn chuỗi"),           test: s => s.totals.served >= 1000 },
  { id: "p50",     name: L("Đôi tay vàng"),       desc: L("50 ly hoàn hảo"),                          test: s => s.totals.perfect >= 50 },
  { id: "friend",  name: L("Người bạn thân"),     desc: L("Đạt 5 tim với một khách ruột"),            test: s => Object.values(s.chars).some(c => c.aff >= 100) },
  { id: "meet10",  name: L("Quán của mọi người"), desc: L("Làm quen 10 khách ruột"),                  test: s => Object.values(s.chars).filter(c => c.met).length >= 10 },
  { id: "staff",   name: L("Bà chủ thực thụ"),    desc: L("Thuê đủ 4 vị trí ở một quán"),             test: s => s.shops.some(sh => ROLE_ORDER.every(r => sh.staff[r])) },
  { id: "shop2",   name: L("Chi nhánh thứ hai"),  desc: L("Mở quán thứ 2"),                            test: s => s.shops.length >= 2 },
  { id: "shop4",   name: L("Chuỗi cà phê"),       desc: L("Mở 4 quán"),                                test: s => s.shops.length >= 4 },
  { id: "shop6",   name: L("Từ Bắc vào Nam"),     desc: L("Có quán ở cả 6 thành phố"),                 test: s => s.shops.length >= 6 },
  { id: "rich",    name: L("Triệu phú phin"),     desc: L("Có 50.000.000đ trong két"),                 test: s => s.money >= 50000000 },
  { id: "secret",  name: L("Sổ tay bí mật"),      desc: L("Mở khóa 3 công thức bí mật"),               test: s => Object.keys(s.secrets).length >= 3 },
  { id: "story",   name: L("Trang cuối của sổ tay"), desc: L("Hoàn thành cốt truyện 4 chương"),       test: s => !!(s.story && s.story.lastPage) },
  { id: "storm",   name: L("Sau cơn bão"),       desc: L("Cùng khách ruột sửa quán sau đêm bão"),     test: s => !!(s.story && s.story.stormDone) },
  { id: "rep5",    name: L("Năm sao"),            desc: L("Một quán đạt uy tín 90"),                   test: s => s.shops.some(sh => sh.rep >= 90) },
];

const INTRO = [
  { who: "ngoai", text: L("Uyên à, ngoại già rồi, tay không còn đủ vững để canh từng giọt phin nữa.") },
  { who: "ngoai", text: L("Ngoại quyết định về quê dưỡng già: sáng ra vườn tưới rau, chiều nghe đài, tối ngủ sớm.") },
  { who: "ngoai", text: L("Căn nhà cũ có góc sân nhỏ cuối phố, cái phin nhôm cũ và mấy người khách ruột... ngoại nhượng lại hết cho con. Lâu rồi không ai chăm, chắc bụi bặm lắm.") },
  { who: "ngoai", text: L("Đừng lo nhiều về tiền. Cứ pha bằng cả tấm lòng, khách sẽ ở lại. Rảnh thì gọi điện kể chuyện quán cho ngoại nghe nhé.") },
  { who: "ngoai", text: L("Biết đâu một ngày, cửa hàng nhỏ của Uyên sẽ có mặt khắp đất nước này. Ngoại tin con.") },
  { who: "uyen",  text: L("Mình sẽ biến nơi này thành một góc trú ẩn bình yên, cho mình và cho những ai ghé qua.") },
  { who: "uyen",  text: L("Tự tay pha từng ly, trang trí từng góc, chăm từng chậu cây... Hôm nay, Cửa hàng nhỏ của Uyên chính thức mở cửa!") },
];

const TUTORIAL = [
  L("👆 Bấm vào khách có biểu tượng 💬 để nhận order (hoặc trò chuyện!)."),
  L("🧾 Phiếu order hiện ở quầy bên phải. Bấm phiếu để chọn, rồi bấm nguyên liệu theo đúng thứ tự công thức."),
  L("✅ Bấm “Phục vụ” khi xong. Đúng thứ tự = Hoàn hảo, thêm tip và uy tín!"),
  L("📦 Nguyên liệu hết thì vào Kho để nhập. Cuối ngày sẽ trả tiền thuê, điện nước, lương nhân viên."),
  L("👥 Khi uy tín tăng, hãy thuê lần lượt: Phục vụ → Tạp vụ → Thu ngân → Pha chế (mỗi vị trí cách nhau 2 ngày). Nhân viên mới còn vụng, cứng tay dần khi Uyên đứng quầy cùng họ. Khi cả quán đủ cứng tay, Uyên mới mở được chi nhánh mới!"),
  L("🧹 Quán bẩn rất nhanh khi chưa có tạp vụ. Nhớ bấm “Dọn” thường xuyên, quán bẩn thì khách ít tip và quán mất uy tín."),
  L("💖 Khách ruột (tên hồng) có câu chuyện riêng. Khi họ hiện 💖, hãy “Ngồi tâm sự” — quán tạm ngưng đón khách để Uyên lắng nghe. Nghe hết chuyện, họ sẽ tặng kỷ vật cho Sổ sưu tập."),
  L("📺 Bấm vào TV trên tường để đổi nhạc hoặc tìm nhạc YouTube."),
  L("⚠️ Phá sản khi uy tín của bất kỳ quán nào về 0 (khách bỏ đi, pha sai món làm giảm uy tín) hoặc khi két tiền về 0 hay âm (sau khi trả tiền thuê, lương cuối ngày). Phá sản là phải chơi lại từ đầu!"),
];

// ---------- Hướng dẫn lần đầu mở từng tính năng ----------
// Mỗi bước: text; sel (nếu có) là nút cần bấm — nút sẽ sáng lên và bấm vào mới sang bước tiếp
const GUIDES = {
  kho: [
    { text: L("📦 Đây là <b>kho nguyên liệu</b> của quán. Mỗi ly pha sẽ trừ nguyên liệu; hết thì không pha được món đó.") },
    { text: L("Bấm <b>+10</b> để nhập thử 10 phần nguyên liệu. Tiền nhập hàng trừ vào két."), sel: "[data-buy]" },
    { text: L("Nguyên liệu dưới 5 phần sẽ hiện số đỏ. Khi có <b>Thu ngân</b>, kho sẽ tự nhập mỗi sáng.") },
  ],
  menu: [
    { text: L("📜 <b>Thực đơn & Máy móc</b>: các món quán đang bán kèm công thức. Bấm nguyên liệu đúng thứ tự để được “Hoàn hảo”.") },
    { text: L("Mua thêm máy (máy đánh trứng, máy espresso…) để mở món mới. Mỗi quán có máy riêng.") },
  ],
  staff: [
    { text: L("👥 Thuê nhân viên theo thứ tự <b>Phục vụ → Tạp vụ → Thu ngân → Pha chế</b>; mỗi vị trí mới mở sau 2 ngày.") },
    { text: L("Mỗi ứng viên có <b>ưu điểm (xanh)</b> và có thể có <b>nhược điểm (đỏ)</b>. Nhân viên mới còn vụng, cứng tay dần khi Uyên làm cùng.") },
    { text: L("Không ưng ai thì bấm <b>🔄 Tìm ứng viên khác</b>.") },
  ],
  decor: [{ text: L("🪴 <b>Trang trí</b> làm quán ấm cúng hơn: thêm chỗ cho khách xếp hàng, tăng tip, tăng uy tín… Mỗi quán trang trí riêng.") }],
  ads: [
    { text: L("📣 <b>Quảng cáo</b> kéo khách tới quán. Không chạy quảng cáo, quán sẽ vắng hơn khoảng 30%.") },
    { text: L("📄 Tờ rơi rẻ, dán ở quầy, có tác dụng 1 ngày. 📱 Mạng xã hội và 🎥 KOL có tác dụng 3 ngày cho cả chuỗi — KOL còn tới tận quán quay phim!") },
  ],
  chain: [
    { text: L("🗺️ <b>Bản đồ chi nhánh</b>: ☕ là quán đã mở, ✨ là nơi mở được ngay, 📍 là nơi chưa đủ điều kiện.") },
    { text: L("Chạm vào một thành phố để xem giá mở, món địa phương và câu chuyện riêng của quán đó."), sel: ".vn-map .pin" },
    { text: L("Muốn mở chi nhánh mới, nhân viên các quán cũ phải đủ cứng tay để vận hành khi vắng Uyên.") },
  ],
  album: [{ text: L("💞 <b>Khách ruột</b>: trò chuyện và pha đúng món yêu thích để tăng tim. Đủ 1, 3, 5 tim họ sẽ ngồi tâm sự và tặng kỷ vật.") }],
  collect: [{ text: L("📚 <b>Sổ sưu tập</b>: kỷ vật khách ruột trao cho Uyên. Gom đủ một bộ theo vùng để nhận thưởng.") }],
  notebook: [{ text: L("📖 <b>Sổ tay của ngoại</b>: dùng 🧩 mảnh ghép câu chuyện để khôi phục các trang bị mờ. Mảnh ghép có được khi pha đúng ly hợp tâm trạng, nghe khách tâm sự, nhận kỷ vật.") }],
  report: [{ text: L("📊 <b>Sổ sách</b>: doanh thu, tiền tip, chi phí thuê mặt bằng, lương, điện nước của từng quán mỗi ngày. Két tiền về 0 là phá sản!") }],
  achv: [{ text: L("🏆 <b>Thành tựu</b>: các cột mốc Uyên đã đạt được.") }],
  settings: [{ text: L("⚙️ Game tự lưu thường xuyên. Ở đây có thể lưu vào ô khác, xuất file save để chuyển máy, chỉnh âm lượng.") }],
  goals: [{ text: L("🎯 <b>Mục tiêu hôm nay</b>: hoàn thành để nhận thưởng tiền và uy tín.") }],
  music: [{ text: L("📺 <b>TV của quán</b>: đổi kiểu nhạc hoặc dán link YouTube để phát trên TV. Trong lúc chọn nhạc, quán tạm ngưng đón khách.") }],
  board: [{ text: L("📋 <b>Bảng thực đơn</b>: tất cả món quán đang bán và công thức từng bước. Xem bất cứ lúc nào nếu quên công thức.") }],
  lab: [{ text: L("🧪 <b>Phòng thử công thức</b>: chọn 3–5 nguyên liệu theo thứ tự để tạo món signature. Món càng hợp vị càng bán được giá cao.") }],
  report_day: [{ text: L("🌙 <b>Tổng kết ngày</b>: doanh thu trừ chi phí (thuê, lương, điện nước, nhập hàng) là lãi của ngày. Két tiền về 0 hoặc âm là phá sản.") }],
};
