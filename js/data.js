// ===== Dữ liệu game "Cửa hàng nhỏ của Uyên" =====

const HERO = "Bảo Uyên";

// ---------- Nguyên liệu ----------
// cost: giá nhập 1 phần (đồng). free: không cần nhập kho
const INGREDIENTS = {
  phin:      { name: "Cà phê phin",  icon: "☕", color: "#3b2314", cost: 4000 },
  espresso:  { name: "Espresso",     icon: "☕", color: "#1f120a", cost: 6000, equip: "may_espresso" },
  sua_dac:   { name: "Sữa đặc",      icon: "🥫", color: "#f4e3c1", cost: 2500 },
  sua_tuoi:  { name: "Sữa tươi",     icon: "🥛", color: "#fbf7ef", cost: 3000 },
  da:        { name: "Đá",           icon: "🧊", color: "#cfefff", free: true },
  nuoc_nong: { name: "Nước nóng",    icon: "♨️", color: "#e8d8c8", free: true },
  duong:     { name: "Đường",        icon: "🍬", color: "#ffffff", cost: 500 },
  trung:     { name: "Kem trứng",    icon: "🥚", color: "#f7d774", cost: 5000, equip: "may_danh_trung" },
  muoi:      { name: "Kem muối",     icon: "🧂", color: "#fff6e6", cost: 4000, equip: "may_danh_trung" },
  foam:      { name: "Bọt sữa",      icon: "☁️", color: "#fffdf8", cost: 2000, equip: "may_espresso" },
  tra:       { name: "Trà",          icon: "🍵", color: "#c98a2d", cost: 2000 },
  chanh:     { name: "Chanh",        icon: "🍋", color: "#f5e663", cost: 1500 },
  sa:        { name: "Sả",           icon: "🌿", color: "#b8d86b", cost: 1000 },
  cacao:     { name: "Ca cao",       icon: "🍫", color: "#6b3a1e", cost: 4000 },
  dao:       { name: "Đào ngâm",     icon: "🍑", color: "#ffb38a", cost: 6000, equip: "tu_mat" },
  vai:       { name: "Vải",          icon: "🍒", color: "#ffe1e8", cost: 6000, equip: "tu_mat" },
  cam:       { name: "Cam",          icon: "🍊", color: "#ff9f1c", cost: 5000, equip: "may_xay" },
  bo:        { name: "Bơ",           icon: "🥑", color: "#a8c66c", cost: 9000, equip: "may_xay" },
  sua_chua:  { name: "Sữa chua",     icon: "🥣", color: "#fff8f0", cost: 5000, equip: "tu_mat" },
  dua:       { name: "Cốt dừa",      icon: "🥥", color: "#fffaf0", cost: 5000, equip: "bo_cot_dua" },
  tran_chau: { name: "Trân châu",    icon: "⚫", color: "#2d1b10", cost: 3000, equip: "noi_tran_chau" },
  matcha:    { name: "Matcha",       icon: "🍃", color: "#7fb347", cost: 8000, equip: "may_espresso" },
  dau:       { name: "Dâu Đà Lạt",   icon: "🍓", color: "#ff4d6d", cost: 7000, secret: "tra_dau" },
};

// ---------- Đồ uống ----------
// recipe: thứ tự chuẩn. hot: đồ nóng (trời lạnh/mưa bán chạy)
const DRINKS = {
  den_da:       { name: "Cà phê đen đá",     price: 25000, recipe: ["phin", "da"], hot: false },
  den_nong:     { name: "Cà phê đen nóng",   price: 25000, recipe: ["phin", "nuoc_nong"], hot: true },
  sua_da:       { name: "Cà phê sữa đá",     price: 29000, recipe: ["sua_dac", "phin", "da"], hot: false },
  bac_xiu:      { name: "Bạc xỉu",           price: 32000, recipe: ["sua_dac", "sua_tuoi", "phin", "da"], hot: false },
  tra_chanh:    { name: "Trà chanh",         price: 20000, recipe: ["tra", "chanh", "duong", "da"], hot: false },
  ca_cao_nong:  { name: "Ca cao nóng",       price: 35000, recipe: ["cacao", "nuoc_nong", "sua_dac"], hot: true },
  nuoc_mot:     { name: "Nước mót Hội An",   price: 30000, recipe: ["tra", "sa", "chanh", "da"], hot: false },
  ca_phe_trung: { name: "Cà phê trứng",      price: 45000, recipe: ["phin", "trung"], hot: true, equip: "may_danh_trung" },
  ca_phe_muoi:  { name: "Cà phê muối",       price: 39000, recipe: ["sua_dac", "phin", "da", "muoi"], hot: false, equip: "may_danh_trung" },
  ca_phe_dua:   { name: "Cà phê cốt dừa",    price: 45000, recipe: ["phin", "dua", "sua_dac", "da"], hot: false, equip: "bo_cot_dua" },
  tra_dao:      { name: "Trà đào cam sả",    price: 45000, recipe: ["tra", "dao", "sa", "da"], hot: false, equip: "tu_mat" },
  tra_vai:      { name: "Trà vải",           price: 42000, recipe: ["tra", "vai", "da"], hot: false, equip: "tu_mat" },
  sua_chua_cf:  { name: "Sữa chua cà phê",   price: 39000, recipe: ["sua_chua", "phin", "da"], hot: false, equip: "tu_mat" },
  tra_sua:      { name: "Trà sữa trân châu", price: 42000, recipe: ["tra", "sua_tuoi", "duong", "tran_chau", "da"], hot: false, equip: "noi_tran_chau" },
  sinh_to_bo:   { name: "Sinh tố bơ",        price: 49000, recipe: ["bo", "sua_dac", "sua_tuoi", "da"], hot: false, equip: "may_xay" },
  nuoc_cam:     { name: "Nước cam",          price: 39000, recipe: ["cam", "duong", "da"], hot: false, equip: "may_xay" },
  espresso:     { name: "Espresso",          price: 39000, recipe: ["espresso"], hot: true, equip: "may_espresso" },
  latte:        { name: "Latte",             price: 55000, recipe: ["espresso", "sua_tuoi", "foam"], hot: true, equip: "may_espresso" },
  cappuccino:   { name: "Cappuccino",        price: 55000, recipe: ["espresso", "foam", "cacao"], hot: true, equip: "may_espresso" },
  matcha_latte: { name: "Matcha latte đá",   price: 55000, recipe: ["matcha", "sua_tuoi", "da"], hot: false, equip: "may_espresso" },
  // Công thức bí mật — mở khóa qua câu chuyện khách quen
  jazz_latte:   { name: "Latte Jazz Đêm",    price: 65000, recipe: ["espresso", "sua_dac", "sua_tuoi", "foam", "cacao"], hot: true, equip: "may_espresso", secret: true },
  cf_cu_hoa:    { name: "Cà phê Cụ Hòa",     price: 60000, recipe: ["phin", "trung", "cacao"], hot: true, equip: "may_danh_trung", secret: true },
  tra_dau:      { name: "Trà dâu Đà Lạt",    price: 55000, recipe: ["tra", "dau", "duong", "da"], hot: false, secret: true },
};

// ---------- Máy móc (dùng chung toàn chuỗi) ----------
const EQUIPMENT = {
  may_danh_trung: { name: "Máy đánh kem trứng", price: 800000,  desc: "Mở khóa Cà phê trứng, Cà phê muối" },
  tu_mat:         { name: "Tủ mát trái cây",    price: 900000,  desc: "Mở khóa Trà đào, Trà vải, Sữa chua cà phê" },
  bo_cot_dua:     { name: "Bộ ủ cốt dừa",       price: 600000,  desc: "Mở khóa Cà phê cốt dừa" },
  noi_tran_chau:  { name: "Nồi nấu trân châu",  price: 700000,  desc: "Mở khóa Trà sữa trân châu" },
  may_xay:        { name: "Máy xay sinh tố",    price: 1200000, desc: "Mở khóa Sinh tố bơ, Nước cam" },
  may_espresso:   { name: "Máy Espresso Ý",     price: 3500000, desc: "Mở khóa Espresso, Latte, Cappuccino, Matcha" },
};

// ---------- Trang trí (mỗi quán riêng) ----------
const DECOR = {
  ban_ghe:  { name: "Thêm bàn ghế",        price: 500000,  max: 3, desc: "+1 chỗ xếp hàng mỗi cấp" },
  cay_xanh: { name: "Cây xanh & hoa",      price: 300000,  max: 1, desc: "+5% tiền tip" },
  loa_jazz: { name: "Loa nghe jazz",       price: 450000,  max: 1, desc: "Khách kiên nhẫn hơn 15%" },
  bien_neon:{ name: "Biển hiệu đèn neon",  price: 700000,  max: 1, desc: "+15% lượng khách" },
  may_lanh: { name: "Máy lạnh",            price: 1500000, max: 1, desc: "+10% khách, +5% tip, ngày nóng hút khách. Điện +30.000đ/ngày" },
  tranh:    { name: "Tranh tường địa phương", price: 800000, max: 1, desc: "Uy tín tăng nhanh hơn 20%" },
};

// ---------- Địa điểm ----------
const LOCATIONS = {
  hanoi:  { name: "Hẻm Phố Cổ", city: "Hà Nội",  cost: 0,        rent: 150000, flow: 1.0, specialty: "ca_phe_trung", key: 5,  tempo: 92,
            wall: "#ffe6b8", accent: "#e07a5f", desc: "Căn nhà nhỏ ngoại để lại, cửa sổ nhìn ra mái ngói rêu phong." },
  saigon: { name: "Góc Quận 1", city: "Sài Gòn", cost: 8000000,  rent: 320000, flow: 1.45, specialty: "bac_xiu", key: 10, tempo: 108,
            wall: "#d9f2ef", accent: "#2a9d8f", desc: "Sôi động, đông khách văn phòng, thèm đồ đá quanh năm." },
  dalat:  { name: "Đồi Thông", city: "Đà Lạt",   cost: 14000000, rent: 200000, flow: 1.15, specialty: "ca_cao_nong", key: 3,  tempo: 80,
            wall: "#e8e1f5", accent: "#7b6cc4", desc: "Se lạnh, sương mù, khách thích đồ nóng." },
  hoian:  { name: "Phố Đèn Lồng", city: "Hội An", cost: 22000000, rent: 260000, flow: 1.35, specialty: "nuoc_mot", key: 7, tempo: 90,
            wall: "#fff1a8", accent: "#e9a23b", desc: "Du khách khắp nơi, tường vàng, đèn lồng rực rỡ." },
  danang: { name: "Bờ Biển Mỹ Khê", city: "Đà Nẵng", cost: 32000000, rent: 300000, flow: 1.5, specialty: "ca_phe_dua", key: 0, tempo: 112,
            wall: "#d4f1ff", accent: "#1d8fd8", desc: "Nắng gió biển, khách mê đồ mát." },
  hue:    { name: "Bên Sông Hương", city: "Huế",  cost: 45000000, rent: 230000, flow: 1.25, specialty: "ca_phe_muoi", key: 8, tempo: 76,
            wall: "#f1e0f5", accent: "#9b5de5", desc: "Trầm mặc, thơ mộng, quê hương cà phê muối." },
};
const LOCATION_ORDER = ["hanoi", "saigon", "dalat", "hoian", "danang", "hue"];

// ---------- Nhân viên ----------
const ROLES = {
  waiter:  { name: "Phục vụ",  icon: "🧑‍🍳", wage: [120000, 180000], desc: "Tự nhận order, khách kiên nhẫn hơn 25%." },
  cleaner: { name: "Tạp vụ",   icon: "🧹",   wage: [90000, 140000],  desc: "Giữ quán luôn sạch sẽ, Uyên không phải tự dọn." },
  cashier: { name: "Thu ngân", icon: "💁",   wage: [130000, 190000], desc: "+10% tiền tip, tự nhập kho mỗi sáng theo mức đặt." },
  barista: { name: "Pha chế",  icon: "☕",   wage: [200000, 320000], desc: "Tự pha đồ uống. Quán có pha chế có thể tự vận hành khi Uyên sang quán khác." },
};
const ROLE_ORDER = ["waiter", "cleaner", "cashier", "barista"];
const TRAITS = [
  { id: "cham",  name: "Chăm chỉ",  desc: "Làm nhanh hơn" },
  { id: "duyen", name: "Duyên dáng", desc: "Khách tip nhiều hơn" },
  { id: "can",   name: "Cẩn thận",  desc: "Ít sai sót" },
  { id: "vui",   name: "Vui tính",  desc: "Khách kiên nhẫn hơn" },
];

// ---------- Tên ngẫu nhiên ----------
const HO = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý"];
const TEN_F = ["Lan", "Hoa", "Trang", "Thảo", "Ngân", "Hương", "Yến", "Nhung", "Quỳnh", "Châu", "Anh", "My", "Tâm", "Hạnh", "Vân", "Diệp", "Nhi", "Thư"];
const TEN_M = ["Hùng", "Dũng", "Nam", "Phúc", "Quân", "Sơn", "Tùng", "Hiếu", "Thắng", "Vinh", "Toàn", "Lộc", "Hậu", "Tín", "Kiên", "Đạt", "Huy", "Phong"];

// ---------- Thời tiết & sự kiện ----------
const WEATHER = {
  nang:  { name: "Nắng đẹp",  icon: "☀️", flow: 1.0,  hot: 1.0 },
  nong:  { name: "Nắng nóng", icon: "🔥", flow: 1.1,  hot: 0.4 },
  mua:   { name: "Mưa rào",   icon: "🌧️", flow: 0.8,  hot: 1.8 },
  mat:   { name: "Mát mẻ",    icon: "⛅", flow: 1.1,  hot: 1.3 },
  lanh:  { name: "Se lạnh",   icon: "🌫️", flow: 0.95, hot: 2.4 },
};

const EVENTS = [
  { id: "doan_khach", name: "Đoàn khách du lịch", icon: "🧳", desc: "Một đoàn du khách ghé phố hôm nay — khách đông hơn 35%!", flow: 1.35 },
  { id: "phe_binh",   name: "Nhà phê bình ẩm thực", icon: "📝", desc: "Nghe nói hôm nay có nhà phê bình ẩm thực ghé quán. Pha thật chuẩn nhé!", critic: true },
  { id: "mat_dien",   name: "Cúp điện buổi trưa", icon: "🔌", desc: "Điện lực báo cắt điện 11h–13h. Máy espresso và máy xay sẽ nghỉ.", outage: [11 * 60, 13 * 60] },
  { id: "may_hong",   name: "Máy móc trục trặc", icon: "🔧", desc: "Thợ phải ghé sửa vòi nước rò rỉ. Phí sửa 150.000đ.", cost: 150000 },
  { id: "le_hoi",     name: "Lễ hội đường phố", icon: "🎉", desc: "Phố đi bộ có lễ hội, khách vui vẻ tip nhiều hơn!", flow: 1.2, tip: 0.1 },
  { id: "tran_dau",   name: "Đêm bóng đá", icon: "⚽", desc: "Tối nay có trận chung kết, khách đông vào buổi tối!", evening: 1.8 },
  { id: "gia_sua",    name: "Sữa tăng giá", icon: "📈", desc: "Nhà cung cấp tăng giá sữa 30% trong hôm nay.", priceUp: ["sua_dac", "sua_tuoi"] },
  { id: "khuyen_mai", name: "Chợ đầu mối giảm giá", icon: "🛒", desc: "Chợ giảm 25% giá nguyên liệu hôm nay. Nhập kho thôi!", discount: 0.25 },
];

const MARKETING = {
  to_roi: { name: "Phát tờ rơi",           price: 150000,  days: 1, boost: 0.2,  scope: "active", desc: "+20% khách tại quán Uyên đứng hôm nay" },
  mxh:    { name: "Quảng cáo mạng xã hội", price: 600000,  days: 3, boost: 0.25, scope: "all",    desc: "+25% khách cả chuỗi trong 3 ngày" },
  kol:    { name: "Mời TikToker review",   price: 1800000, days: 3, boost: 0.45, scope: "all",    desc: "+45% khách cả chuỗi trong 3 ngày" },
};

// ---------- Lời thoại khách vãng lai ----------
const GEN = {
  greet: [
    "Chào chị chủ quán!", "Quán xinh ghê!", "Ở đây có chỗ ngồi không chị?", "Nghe bạn giới thiệu nên ghé thử nè.",
    "Trời này mà có ly nước thì tuyệt.", "Chào Uyên, lâu rồi mới ghé!", "Ơ quán mới mở hả chị?", "Quán thơm mùi cà phê quá.",
    "Mình đi ngang thấy dễ thương nên vào.", "Chị ơi cho em gọi món với.", "Nhạc quán hay ghê, nhạc gì vậy chị?", "Hôm nay quán đông nhỉ!",
  ],
  order: [
    "Cho mình một ly {d} nhé.", "Một {d}, cảm ơn chị!", "Chị làm giúp em ly {d} được không?", "Hôm nay thử {d} xem sao.",
    "Như mọi khi... à không, hôm nay {d}!", "{d} một ly, mang ra bàn giúp em nha.", "Em nghe nói {d} ở đây ngon lắm.", "Cho một {d}, ít ngọt thôi nha... đùa đó, như công thức là được!",
  ],
  perfect: [
    "Trời ơi ngon xỉu!", "Đúng vị luôn, mai mình quay lại!", "Ly này phải chụp hình đăng story mới được.", "Chuẩn không cần chỉnh!",
    "Uyên pha khéo tay ghê.", "Ngon hơn quán quen của mình luôn á.", "Uống một ngụm là hết mệt.", "Mười điểm không có nhưng!",
  ],
  good: ["Ngon nè, cảm ơn chị!", "Ổn áp đó.", "Vị lạ lạ mà cũng được ghê.", "Uống cũng được, cảm ơn nha."],
  ok: ["Hơi khác khác mọi lần...", "Hình như thiếu cái gì đó.", "Cũng tạm được.", "Lần sau làm chuẩn hơn nha chị."],
  wrong: ["Ơ, đây đâu phải món em gọi?", "Cái này... không phải {d} đâu chị ơi.", "Thôi khỏi, mình đi đây.", "Sai món rồi chị ơi!"],
  leave: ["Lâu quá, thôi mình đi.", "Chờ mãi không thấy, để hôm khác vậy.", "Trễ giờ làm rồi, đi đây!", "Haizz... đông quá."],
  chats: [
    { q: "Dạo này kẹt xe kinh khủng, chị đi làm có bị kẹt không?", a: [
      ["Kẹt lắm, nên chị ở luôn trên quán cho lẹ!", 2, "Hahaha, chị vui tính ghê."],
      ["Chị đi bộ thôi, quán gần nhà.", 1, "Sướng ghê, em ước được vậy."],
      ["Ừ.", -1, "...Dạ."]] },
    { q: "Chị ơi, quán mở lâu chưa?", a: [
      ["Quán của ngoại chị để lại đó, giờ chị làm tiếp.", 2, "Ôi dễ thương quá, em sẽ ghé thường xuyên!"],
      ["Mới thôi, ủng hộ chị nhiều nha!", 1, "Chắc chắn rồi!"],
      ["Lâu lắm rồi, sao em không biết?", -1, "Ơ... em xin lỗi."]] },
    { q: "Hôm nay em vừa được tăng lương đó!", a: [
      ["Chúc mừng em! Ly này chị tặng thêm topping nha.", 2, "Chị dễ thương quá trời!"],
      ["Vậy hôm nay em bao cả quán nha!", 1, "Haha, cho em suy nghĩ đã..."],
      ["Chắc tăng ít thôi ha.", -2, "...Thôi, em uống cho xong."]] },
    { q: "Chị thấy trời hôm nay sao?", a: [
      ["Trời đẹp, hợp ngồi cà phê tán gẫu!", 2, "Chuẩn luôn!"],
      ["Thời tiết thất thường quá.", 1, "Đúng rồi, sáng nắng chiều mưa."],
      ["Không để ý.", -1, "À... vâng."]] },
    { q: "Em đang tìm chỗ ngồi làm việc yên tĩnh, quán mình có wifi không chị?", a: [
      ["Có chứ, mật khẩu ghi trên bảng menu đó em.", 2, "Tuyệt vời, em sẽ thành khách ruột."],
      ["Có, nhưng em ngồi lâu nhớ gọi thêm nha.", 1, "Hihi, tất nhiên rồi."],
      ["Ra quán cà phê là để trò chuyện chứ!", 0, "Cũng có lý ha."]] },
    { q: "Nhạc jazz trong quán là do chị chọn hả?", a: [
      ["Ừ, chị mê jazz từ hồi nghe đĩa than của ngoại.", 2, "Gu chị xịn thật."],
      ["Nhạc ngẫu nhiên thôi em.", 1, "Ngẫu nhiên mà hay ghê."],
      ["Em không thích thì bịt tai lại.", -2, "Ơ kìa..."]] },
  ],
};

// ---------- Khách quen (27 nhân vật) ----------
// loc: "global" xuất hiện mọi quán. day: ngày bắt đầu xuất hiện
// look: g=giới tính, age, skin, hair (kiểu), hc (màu tóc), shirt (kiểu), sc (màu áo), acc (phụ kiện)
// chats: [câu hỏi, [[lựa chọn, điểm thân thiết, câu đáp]...]]
// story: mốc trái tim (h) -> lời kể + phần thưởng
const CHARACTERS = [
  // ===== Toàn quốc =====
  { id: "minh", name: "Minh", title: "Sinh viên IT", loc: "global", day: 1, fav: ["den_da", "bac_xiu"], patience: 1.1, tip: 1.0,
    look: { g: "m", age: "young", skin: "#f1c27d", hair: "short", hc: "#1d1410", shirt: "hoodie", sc: "#57cc99", acc: ["glasses"] },
    bio: "Năm ba đại học, code xuyên đêm, nợ deadline nhiều hơn nợ tiền.",
    greet: ["Chị Uyên ơi, hôm nay em lại chạy deadline...", "Wifi quán vẫn mật khẩu cũ chứ chị?", "Chào chị, cho em góc cạnh ổ điện nhé!"],
    happy: ["Ngon quá, đủ năng lượng fix thêm chục cái bug!", "Ly này là chân ái của em."],
    sad: ["Hơi khác vị mọi khi... chắc tại em mệt."],
    chats: [
      { q: "Chị ơi, theo chị em nên đi thực tập hay ở lại làm dự án riêng?", a: [
        ["Đi thực tập học hỏi trước, dự án làm song song.", 8, "Hợp lý ghê... vừa có lương vừa có kinh nghiệm."],
        ["Làm dự án riêng đi, tuổi trẻ phải liều!", 4, "Liều thì liều... nhưng chắc mẹ em không chịu đâu."],
        ["Hỏi chị Google ấy.", -4, "Ơ... em tưởng chị khác Google chứ."]] },
      { q: "Em vừa thức trắng hai đêm. Có bí quyết nào tỉnh táo không chị?", a: [
        ["Ngủ đi em, cà phê không thay được giấc ngủ đâu.", 8, "Dạ... nghe chị, tối nay em ngủ sớm."],
        ["Uống thêm ly nữa là tỉnh!", -3, "Tim em đập như trống trường rồi chị ơi..."],
        ["Đi bộ quanh hồ một vòng cho thoáng.", 5, "Ý hay, để em thử."]] },
      { q: "Chị có tin máy tính sau này pha cà phê ngon hơn người không?", a: [
        ["Máy pha được, nhưng không biết hỏi han khách như chị.", 7, "Đúng ha... không ai thay được chị Uyên."],
        ["Có chứ, chị sắp thất nghiệp rồi!", 2, "Haha, em không để chuyện đó xảy ra đâu."],
        ["Nói chuyện khác đi.", -2, "Dạ..."]] },
    ],
    story: [
      { h: 1, lines: ["Chị biết không, em đang viết một cái app gọi món cho quán nhỏ.", "Nếu xong, em muốn quán chị là quán đầu tiên dùng thử!"], reward: { rep: 3 } },
      { h: 3, lines: ["App của em được giải nhì cuộc thi khởi nghiệp sinh viên!", "Ban giám khảo hỏi em lấy cảm hứng ở đâu, em kể về quán chị đấy.", "Đây là một phần tiền thưởng, chị nhận giúp em nha."], reward: { money: 300000 } },
      { h: 5, lines: ["Em được nhận vào làm ở công ty lớn rồi.", "Nhưng sáng nào em cũng ghé. Quán chị là văn phòng thứ hai của em mà.", "Em còn rủ cả team mới tới đây nữa!"], reward: { flow: 0.04 } },
    ] },

  { id: "lan", name: "Cô Lan", title: "Giáo viên về hưu", loc: "global", day: 1, fav: ["ca_phe_trung", "ca_cao_nong", "den_nong"], patience: 1.4, tip: 1.2,
    look: { g: "f", age: "old", skin: "#f3cfa8", hair: "bun", hc: "#bdbdbd", shirt: "blouse", sc: "#b388eb", acc: ["glasses"] },
    bio: "Dạy Văn ba mươi năm, giờ thích đọc báo giấy và chấm điểm... đồ uống.",
    greet: ["Chào con Uyên, hôm nay quán vẫn ấm cúng nhỉ.", "Cô ghé đọc báo một chút, con cứ làm việc đi.", "Con gái ngoan, dạo này có mệt không?"],
    happy: ["Mười điểm, cô cho con mười điểm!", "Vị này làm cô nhớ quán cũ ở Tràng Tiền ghê."],
    sad: ["Bài này... cô cho sáu điểm thôi con ạ."],
    chats: [
      { q: "Ngày xưa ngoại con hay ngồi đúng chỗ này đan áo. Con có nhớ bà không?", a: [
        ["Con nhớ ngoại lắm cô ạ. Mỗi ly cà phê con pha là con nghĩ tới bà.", 9, "Bà mà thấy con bây giờ chắc tự hào lắm."],
        ["Con bận quá cũng ít nghĩ tới...", 1, "Bận thì bận, nhưng đừng quên gốc gác con nhé."],
        ["Cô kể chuyện buồn làm gì ạ.", -4, "Ừ... cô xin lỗi."]] },
      { q: "Con có đọc sách không? Dạo này cô đọc lại 'Hà Nội băm sáu phố phường'.", a: [
        ["Con có ạ, cuốn đó viết về quà Hà Nội hay lắm.", 8, "Ôi, con gái biết đọc sách, cô quý quá."],
        ["Con hay nghe podcast hơn cô ạ.", 3, "Cũng được, miễn là con chịu học."],
        ["Sách cũ quá cô ơi.", -3, "Cũ mà không cũ đâu con."]] },
      { q: "Cô hỏi thật, con có định lấy chồng chưa?", a: [
        ["Con lo cho quán trước đã cô ơi, chuyện đó để duyên tới.", 6, "Phải, con gái có sự nghiệp là quý."],
        ["Cô giới thiệu cho con đi!", 4, "Haha, để cô xem đứa cháu nào hiền lành."],
        ["Chuyện riêng của con mà cô.", -2, "Ừ, cô vô duyên quá."]] },
    ],
    story: [
      { h: 1, lines: ["Uyên này, hồi con còn bé xíu, cô hay mua kẹo lạc cho con đấy.", "Thấy con lớn lên giữ quán của bà, cô mừng lắm."], reward: { rep: 3 } },
      { h: 3, lines: ["Cô viết một bài về quán con gửi báo phường.", "Họ đăng rồi! Tiêu đề là 'Cô chủ nhỏ giữ hồn phố cũ'."], reward: { rep: 6 } },
      { h: 5, lines: ["Cô có cuốn sổ công thức tay của ngoại con, bà gửi cô giữ hộ trước khi đi.", "Bà dặn: 'Khi nào Uyên đủ vững, hãy đưa cho nó.'", "Giờ là lúc rồi, con ạ."], reward: { money: 800000 } },
    ] },

  { id: "tuan", name: "Tuấn", title: "Anh shipper", loc: "global", day: 2, fav: ["sua_da", "tra_chanh"], patience: 0.7, tip: 1.0,
    look: { g: "m", age: "young", skin: "#d9a066", hair: "cap", hc: "#ff8c42", shirt: "tee", sc: "#ff8c42", acc: [] },
    bio: "Chạy mười hai đơn một ngày, thuộc mọi con hẻm trong thành phố.",
    greet: ["Uyên ơi nhanh giúp anh, còn ba đơn!", "Anh ghé uống miếng lấy sức rồi chạy tiếp.", "Hôm nay nắng cháy da luôn em ạ."],
    happy: ["Nhanh mà ngon, đúng chuẩn shipper!", "Uống xong chạy thêm năm đơn được!"],
    sad: ["Thôi kệ, uống cho có sức chạy."],
    chats: [
      { q: "Em có biết hẻm nào tắt ra chợ nhanh nhất không? Đùa thôi, anh biết hết rồi.", a: [
        ["Vậy anh làm hướng dẫn viên du lịch hẻm đi!", 7, "Ý tưởng hay đó, tour 'hẻm lắt léo'!"],
        ["Anh giỏi ghê.", 4, "Nghề mà em."],
        ["Em không hỏi mà.", -3, "Ờ... ừ."]] },
      { q: "Có khách hôm nay boom hàng anh, mất trắng tiền ứng. Buồn ghê.", a: [
        ["Ly này em mời anh, lấy lại tinh thần nha.", 9, "Em tốt quá... anh nhớ đó nha."],
        ["Lần sau anh gọi xác nhận trước nhé.", 5, "Ừ, phải cẩn thận hơn."],
        ["Chuyện thường mà.", -2, "Thường với em thôi..."]] },
    ],
    story: [
      { h: 1, lines: ["Anh in tờ rơi của quán dán sau thùng hàng rồi đó.", "Chạy khắp thành phố quảng cáo miễn phí cho em!"], reward: { flow: 0.03 } },
      { h: 3, lines: ["Anh để dành đủ tiền mua xe máy mới rồi!", "Lần đầu tiên anh chạy xe không phải đi mượn."], reward: { rep: 4 } },
      { h: 5, lines: ["Anh đang tính mở dịch vụ giao hàng riêng.", "Khách đầu tiên ký hợp đồng chính là... quán em nhé! Anh giao giá hữu nghị."], reward: { money: 500000 } },
    ] },

  { id: "mai", name: "Mai", title: "Nhà văn tự do", loc: "global", day: 3, fav: ["latte", "den_nong", "tra_vai"], patience: 1.5, tip: 1.3,
    look: { g: "f", age: "young", skin: "#f6d5b5", hair: "long", hc: "#5a3825", shirt: "tee", sc: "#2ec4b6", acc: ["scarf"] },
    bio: "Đang viết cuốn tiểu thuyết đầu tay. Mỗi ly cà phê là một chương.",
    greet: ["Chào Uyên, cho mình bàn gần cửa sổ nhé.", "Hôm nay mình bí ý tưởng quá...", "Ánh sáng quán sáng nay đẹp như văn vậy."],
    happy: ["Vị này phải viết vào truyện mới được.", "Cảm hứng tới rồi! Cảm ơn Uyên."],
    sad: ["Chắc mình bị cảm nên không cảm được vị..."],
    chats: [
      { q: "Nhân vật chính của mình là một cô chủ quán... Uyên nghĩ cô ấy sợ điều gì nhất?", a: [
        ["Sợ một ngày quán vắng, không ai còn nhớ hương vị cũ.", 9, "Hay quá... mình ghi lại ngay đây."],
        ["Sợ hết tiền trả tiền nhà!", 5, "Haha, thực tế ghê, nhưng cũng đúng."],
        ["Sợ gián.", 2, "Ơ... cũng là một ý."]] },
      { q: "Uyên có tin vào chuyện định mệnh không?", a: [
        ["Tin chứ, như việc ngoại để lại quán này cho mình.", 8, "Đẹp quá. Định mệnh mang mùi cà phê."],
        ["Mình tin vào cố gắng hơn.", 6, "Cũng là một kiểu định mệnh đó."],
        ["Mai nói gì khó hiểu quá.", -2, "Ừ... nhà văn hay vậy mà."]] },
    ],
    story: [
      { h: 1, lines: ["Mình viết xong chương một rồi! Bối cảnh là một quán cà phê nhỏ trong hẻm.", "Đoán xem lấy cảm hứng từ đâu?"], reward: { rep: 3 } },
      { h: 3, lines: ["Nhà xuất bản nhận bản thảo của mình rồi Uyên ơi!", "Mình muốn đặt tên sách là 'Cửa hàng nhỏ'... được không?"], reward: { rep: 5 } },
      { h: 5, lines: ["Sách ra mắt rồi! Buổi ký tặng mình xin tổ chức ở quán Uyên nhé.", "Độc giả sẽ tới đông lắm đó."], reward: { money: 600000, flow: 0.04 } },
    ] },

  { id: "ongba", name: "Ông Ba", title: "Cựu chiến binh", loc: "global", day: 4, fav: ["den_nong", "den_da"], patience: 1.6, tip: 1.1,
    look: { g: "m", age: "old", skin: "#d8a47f", hair: "bald", hc: "#dddddd", shirt: "shirt", sc: "#6a994e", acc: ["mustache"] },
    bio: "Bảy mươi tám tuổi, sáng nào cũng một ly đen không đường và một câu chuyện cũ.",
    greet: ["Cháu Uyên, cho ông ly đen như mọi khi.", "Sáng nay ông đi bộ được ba vòng hồ đấy.", "Ông ngồi một lát, nghe nhạc của cháu."],
    happy: ["Đắng mà thơm, như đời người cháu ạ.", "Ngon! Giống cà phê ngoại cháu pha ngày trước."],
    sad: ["Hơi lạt... nhưng thôi, ông không chê cháu."],
    chats: [
      { q: "Ngày xưa ông với ngoại cháu cùng tổ thanh niên xung phong. Bà giỏi lắm đấy.", a: [
        ["Ông kể cho cháu nghe thêm về bà đi ạ!", 9, "Bà cháu là người gan dạ nhất đội..."],
        ["Thật hả ông? Cháu không biết luôn.", 5, "Ừ, bà khiêm tốn, ít kể lắm."],
        ["Chuyện xưa rồi ông ạ.", -3, "Xưa... nhưng không cũ đâu cháu."]] },
      { q: "Bọn trẻ bây giờ cứ cắm mặt vào điện thoại. Cháu thấy sao?", a: [
        ["Điện thoại tiện thật, nhưng ngồi nói chuyện thế này vẫn quý nhất ông ạ.", 8, "Phải, phải. Cháu hiểu chuyện lắm."],
        ["Thời đại mới mà ông.", 3, "Ừ, ông cũng phải học thôi."],
        ["Ông cũng nên mua một cái đi.", 1, "Haha, để ông nghĩ."]] },
    ],
    story: [
      { h: 1, lines: ["Ông mang tặng cháu tấm ảnh cũ này. Ngoại cháu năm mười tám tuổi đấy.", "Treo lên tường cho quán có hồn."], reward: { rep: 4 } },
      { h: 3, lines: ["Hội cựu chiến binh phường muốn họp mặt ở quán cháu mỗi tháng.", "Ông bảo rồi: 'Cà phê con bé Uyên là nhất!'"], reward: { money: 400000 } },
      { h: 5, lines: ["Ông già rồi, không biết còn uống được bao lâu.", "Nhưng thấy cháu giữ quán thế này, ông yên lòng.", "Cháu cứ mở thêm quán đi, mang cái hồn này đi xa."], reward: { rep: 6, flow: 0.03 } },
    ] },

  { id: "khoa", name: "Anh Khoa", title: "Dân văn phòng", loc: "global", day: 5, fav: ["bac_xiu", "espresso", "sua_da"], patience: 0.8, tip: 1.4,
    look: { g: "m", age: "mid", skin: "#f0c8a0", hair: "side", hc: "#2b1d16", shirt: "tie", sc: "#ffffff", acc: [] },
    bio: "Trưởng phòng kinh doanh, sống bằng cà phê và họp online.",
    greet: ["Một ly mang đi, anh có họp lúc chín giờ!", "Uyên, cho anh như mọi khi, gấp nhé.", "Sáng thứ hai... cần cà phê gấp đôi."],
    happy: ["Hoàn hảo, KPI hôm nay chắc chắn đạt!", "Đây mới gọi là năng suất."],
    sad: ["Thôi, kịp giờ là được rồi."],
    chats: [
      { q: "Sếp anh bắt chạy doanh số gấp đôi quý này. Em có mẹo bán hàng không?", a: [
        ["Hiểu khách muốn gì trước, bán sau anh ạ.", 8, "Nghe như triết lý quán em vậy. Hay!"],
        ["Giảm giá thật sâu!", 2, "Sếp anh sẽ giết anh mất."],
        ["Em bán cà phê thôi mà anh.", 0, "Ừ, nhưng em bán giỏi đấy."]] },
      { q: "Anh tính nghỉ việc mở quán giống em. Có khó không?", a: [
        ["Khó lắm anh, nhưng mỗi sáng mở cửa đều thấy vui.", 8, "Nghe mà muốn thử ghê..."],
        ["Dễ lắm, anh mở đi!", -2, "Thật không đó? Anh thấy em bận tối mắt."],
        ["Anh mở thì em mất khách à!", 4, "Haha, yên tâm, anh vẫn ghé."]] },
    ],
    story: [
      { h: 1, lines: ["Công ty anh muốn đặt cà phê cho buổi họp sáng thứ sáu.", "Anh giới thiệu quán em luôn."], reward: { money: 350000 } },
      { h: 3, lines: ["Anh được thăng chức giám đốc vùng!", "Mỗi lần đi công tác tỉnh nào anh cũng sẽ tìm xem có quán em không."], reward: { rep: 5 } },
      { h: 5, lines: ["Anh có quen mấy người cho thuê mặt bằng đẹp.", "Khi nào em mở quán mới, anh nói giúp một tiếng, rẻ hơn hẳn."], reward: { money: 1000000 } },
    ] },

  { id: "linh", name: "Linh", title: "TikToker ẩm thực", loc: "global", day: 8, fav: ["tra_dao", "matcha_latte", "tra_sua"], patience: 0.9, tip: 1.2,
    look: { g: "f", age: "young", skin: "#fbd9c0", hair: "pony", hc: "#ff6fae", shirt: "tee", sc: "#ffd166", acc: ["earrings"] },
    bio: "Năm trăm nghìn người theo dõi. Một video có thể làm quán đông nghẹt.",
    greet: ["Hello mọi người, hôm nay Linh review quán của chị Uyên nha!", "Chị ơi cho em xin góc có ánh sáng đẹp!", "Quán chị lên xu hướng rồi đó, biết chưa?"],
    happy: ["Đỉnh nóc kịch trần! Mười trên mười!", "Video này chắc chắn triệu view!"],
    sad: ["Ừm... đoạn này em cắt đi vậy."],
    chats: [
      { q: "Chị thấy em nên quay góc nào cho quán đẹp nhất?", a: [
        ["Quay lúc chị pha phin, khói bay lên đẹp lắm.", 9, "Ý tưởng xuất sắc! Chị có năng khiếu đạo diễn đó."],
        ["Góc nào cũng được, quán chị đẹp mà.", 4, "Tự tin ghê ha!"],
        ["Đừng quay chị nha, chị ngại.", 1, "Vậy em quay ly nước thôi."]] },
      { q: "Có người bình luận chê video em giả tạo... buồn ghê.", a: [
        ["Em làm vì đam mê thật, người hiểu sẽ thấy.", 9, "Cảm ơn chị... em cần nghe câu đó."],
        ["Kệ họ đi, em cứ làm tiếp.", 5, "Dạ, em sẽ cố."],
        ["Thì bớt diễn lại chút.", -3, "...Chị cũng nghĩ vậy hả?"]] },
    ],
    story: [
      { h: 1, lines: ["Video review quán chị được ba trăm nghìn view rồi!", "Khách đang kéo tới đó, chuẩn bị nha!"], reward: { flow: 0.05 } },
      { h: 3, lines: ["Em muốn làm series 'Một ngày làm chủ quán' quay ở chỗ chị.", "Nhà tài trợ trả tiền nữa nè!"], reward: { money: 700000 } },
      { h: 5, lines: ["Chị Uyên ơi, em được giải Nhà sáng tạo nội dung của năm.", "Trên sân khấu em cảm ơn chị đó. Chị là người đầu tiên tin em."], reward: { rep: 8, flow: 0.04 } },
    ] },

  // ===== Hà Nội =====
  { id: "cuhoa", name: "Cụ Hòa", title: "Kỳ thủ cờ tướng", loc: "hanoi", day: 1, fav: ["den_nong", "ca_phe_trung"], patience: 1.8, tip: 1.0,
    look: { g: "m", age: "old", skin: "#e2b48c", hair: "bald", hc: "#f2f2f2", shirt: "shirt", sc: "#8d6e63", acc: ["beard"] },
    bio: "Tám mươi lăm tuổi, vô địch cờ tướng phố cổ ba mươi năm liền.",
    greet: ["Con bé, có ai đánh với cụ ván cờ không?", "Một ly nóng, đặc vào nhé.", "Phố này đổi nhiều rồi, chỉ quán này là còn giữ hương cũ."],
    happy: ["Khá lắm! Cờ cao một nước.", "Đậm đà, đúng vị Hà Nội."],
    sad: ["Nước này đi hỏng rồi con ạ."],
    chats: [
      { q: "Con có biết đánh cờ tướng không? Cờ dạy người ta kiên nhẫn đấy.", a: [
        ["Cụ dạy con đi ạ, con muốn học.", 9, "Tốt! Bài đầu tiên: pháo đầu."],
        ["Con chỉ biết cờ ca rô cụ ạ.", 4, "Ca rô cũng là cờ, haha."],
        ["Cờ chán lắm cụ.", -4, "Chán là vì chưa hiểu đấy."]] },
      { q: "Hồi xưa phố này có tiếng rao 'Ai bánh mì nóng giòn đây'. Giờ vắng rồi.", a: [
        ["Con vẫn nghe thấy mỗi sáng sớm đó cụ.", 7, "Thế à... vậy là phố chưa mất hồn."],
        ["Giờ người ta đặt app hết rồi cụ.", 3, "Ừ, thời thế."],
        ["Cụ hoài cổ quá.", -2, "Già rồi, không hoài cổ thì hoài gì."]] },
    ],
    story: [
      { h: 1, lines: ["Cụ dạy con một mẹo: đánh trứng phải nhẹ tay, như đi quân sĩ.", "Bọt mịn thì cà phê mới mượt."], reward: { rep: 3 } },
      { h: 3, lines: ["Ngày xưa cụ hay uống cà phê trứng rắc chút ca cao.", "Con thử làm xem: phin, kem trứng, rồi rắc ca cao lên trên.", "Gọi nó là... 'Cà phê Cụ Hòa' nhé, hà hà."], reward: { recipe: "cf_cu_hoa" } },
      { h: 5, lines: ["Cụ thắng giải cờ phường lần thứ ba mươi mốt!", "Cúp này cụ để ở quán con, ai vào cũng thấy."], reward: { rep: 7 } },
    ] },

  { id: "hang", name: "Hằng", title: "Sinh viên Mỹ thuật", loc: "hanoi", day: 2, fav: ["ca_phe_trung", "tra_dao", "tra_chanh"], patience: 1.2, tip: 0.9,
    look: { g: "f", age: "young", skin: "#fde0c5", hair: "bob", hc: "#c0392b", shirt: "tee", sc: "#f4a261", acc: ["beret"] },
    bio: "Vẽ ký họa phố cổ, áo lúc nào cũng dính màu nước.",
    greet: ["Chị Uyên ơi, cho em ngồi vẽ cái cửa sổ quán nha!", "Hôm nay ánh nắng vàng như màu ochre.", "Em hết tiền mua màu rồi... nhưng vẫn phải có cà phê!"],
    happy: ["Màu ly nước đẹp quá, em vẽ lại liền!", "Ngon như một bức tranh vậy."],
    sad: ["Màu này hơi... lệch tông chị ạ."],
    chats: [
      { q: "Chị thích tranh sơn dầu hay màu nước hơn?", a: [
        ["Màu nước, nhẹ nhàng như sáng sớm Hà Nội.", 8, "Đúng gu em luôn!"],
        ["Sơn dầu, nhìn đậm đà như cà phê.", 6, "So sánh hay ghê."],
        ["Chị không rành tranh lắm.", 1, "Không sao, em dạy chị."]] },
      { q: "Bố mẹ em muốn em học kế toán, không cho theo vẽ...", a: [
        ["Làm điều em yêu, nhưng cũng nói chuyện thật lòng với bố mẹ nhé.", 9, "Dạ... em sẽ thử nói chuyện lại."],
        ["Kế toán cũng ổn định mà.", 2, "Ổn định... mà không vui."],
        ["Bỏ nhà đi vẽ luôn!", -3, "Chị ơi, nghe liều quá..."]] },
    ],
    story: [
      { h: 1, lines: ["Em tặng chị bức ký họa quán mình nè.", "Chị treo lên được không?"], reward: { rep: 3 } },
      { h: 3, lines: ["Em vẽ lại menu cho quán chị, chữ tay và hình minh họa!", "Khách khen dễ thương lắm đó."], reward: { flow: 0.03 } },
      { h: 5, lines: ["Triển lãm đầu tay của em mở rồi chị ơi! Bố mẹ em cũng tới.", "Bức tranh lớn nhất tên là 'Cửa hàng nhỏ của Uyên'.", "Có người mua nó, em chia chị một phần nha."], reward: { money: 600000, rep: 4 } },
    ] },

  { id: "duc", name: "Đức", title: "Nghệ sĩ saxophone", loc: "hanoi", day: 3, fav: ["den_da", "latte", "jazz_latte"], patience: 1.3, tip: 1.3,
    look: { g: "m", age: "mid", skin: "#c68642", hair: "curly", hc: "#1a1a1a", shirt: "shirt", sc: "#264653", acc: ["beard", "sunglasses"] },
    bio: "Thổi saxophone ở một club jazz phố Tạ Hiện. Đêm diễn, ngày ngủ.",
    greet: ["Yo Uyên, nhạc quán hôm nay swing đấy.", "Vừa diễn xong, cần một ly thật đậm.", "Em mở bài này... Coltrane hả? Không, nghe giống nhạc tự chế."],
    happy: ["Ngọt như một nốt Si giáng.", "Groove quá! Ly này có nhịp điệu."],
    sad: ["Lệch tông rồi em ơi..."],
    chats: [
      { q: "Em có biết jazz hay nhất ở chỗ nào không? Ở những nốt mình không chơi.", a: [
        ["Như cà phê phin, ngon nhất ở lúc chờ từng giọt.", 9, "Wow... câu này anh phải viết thành bài."],
        ["Vậy anh im lặng cả buổi là hay nhất à?", 4, "Haha, đỡ không nổi."],
        ["Em chỉ nghe nhạc trẻ thôi.", -2, "Ừ... cũng được."]] },
      { q: "Anh định thôi diễn club để đi dạy nhạc cho trẻ con. Có nên không?", a: [
        ["Truyền lửa cho bọn trẻ là điều tuyệt vời mà anh.", 8, "Ừ, anh cũng nghĩ vậy."],
        ["Anh sẽ nhớ sân khấu lắm đó.", 6, "Đúng... có lẽ anh vẫn diễn cuối tuần."],
        ["Dạy trẻ con mệt lắm.", -2, "Ừm... cảm ơn đã cảnh báo."]] },
    ],
    story: [
      { h: 1, lines: ["Anh thu một bản nhạc ngẫu hứng tên là 'Phin chiều'.", "Em mở trong quán đi, coi như quà."], reward: { rep: 3 } },
      { h: 3, lines: ["Anh có công thức của club cũ: espresso, sữa đặc, sữa tươi, bọt sữa, rắc ca cao.", "Tụi anh gọi là 'Latte Jazz Đêm'. Giờ nó là của em."], reward: { recipe: "jazz_latte" } },
      { h: 5, lines: ["Tối thứ bảy này anh mang ban nhạc tới quán em diễn miễn phí.", "Đêm jazz đầu tiên của 'Cửa hàng nhỏ của Uyên'!"], reward: { money: 500000, flow: 0.04 } },
    ] },

  { id: "chithu", name: "Chị Thu", title: "Bán hoa xe đạp", loc: "hanoi", day: 2, fav: ["sua_da", "tra_chanh"], patience: 1.0, tip: 1.0,
    look: { g: "f", age: "mid", skin: "#e8b88a", hair: "nonla", hc: "#2b1b12", shirt: "blouse", sc: "#ff99c8", acc: [] },
    bio: "Chiếc xe đạp chở đầy hoa theo mùa: sen tháng sáu, cúc họa mi tháng mười một.",
    greet: ["Uyên ơi, chị để xe hoa trước cửa nhé!", "Hôm nay có hoa sen, đẹp lắm em ạ.", "Bán chưa được bó nào, uống ly lấy hên."],
    happy: ["Ngọt ngào như bó hồng nhung!", "Uống xong chắc bán đắt hàng!"],
    sad: ["Hôm nay xui thật..."],
    chats: [
      { q: "Em thích hoa gì nhất?", a: [
        ["Cúc họa mi, mùa đó Hà Nội đẹp nhất chị ạ.", 8, "Đúng rồi! Tháng mười một chị để dành cho em bó đẹp nhất."],
        ["Hoa hồng, sang trọng.", 5, "Hồng thì chị có đủ màu."],
        ["Hoa nào cũng héo cả.", -3, "Nói vậy buồn ghê..."]] },
      { q: "Con chị năm nay thi vào lớp mười, chị lo quá.", a: [
        ["Chị cứ động viên cháu, áp lực quá cháu dễ mệt.", 8, "Ừ... chị sẽ bớt la nó."],
        ["Cháu sẽ đỗ thôi chị!", 6, "Mong là vậy, cảm ơn em."],
        ["Thi trượt thì học trường khác.", -1, "Ừ... nói thì dễ."]] },
    ],
    story: [
      { h: 1, lines: ["Mỗi sáng chị sẽ để một bình hoa nhỏ trên quầy cho em.", "Quán có hoa, khách vui hơn."], reward: { rep: 3 } },
      { h: 3, lines: ["Con chị đỗ trường chuyên rồi Uyên ơi!", "Chị khao em bó hoa to nhất và cả... tiền mua đường cho quán."], reward: { money: 300000 } },
      { h: 5, lines: ["Chị dành dụm mở được sạp hoa cố định rồi, ngay cạnh quán em.", "Từ giờ hàng xóm thật sự rồi nhé!"], reward: { flow: 0.04 } },
    ] },

  // ===== Sài Gòn =====
  { id: "bao", name: "Bảo", title: "Founder startup", loc: "saigon", day: 1, fav: ["espresso", "den_da", "bac_xiu"], patience: 0.8, tip: 1.3,
    look: { g: "m", age: "young", skin: "#f1c27d", hair: "spiky", hc: "#222222", shirt: "tee", sc: "#2b2d42", acc: ["headphones"] },
    bio: "Gọi vốn ba lần thất bại, lần thứ tư đang... đang gọi.",
    greet: ["Chị Uyên, cho em ly đậm nhất, em pitch lúc mười giờ!", "Hôm qua em ngủ ba tiếng, chuyện bình thường.", "Chị có muốn đầu tư startup không? Đùa thôi."],
    happy: ["Ly này scale được nè chị!", "Đậm đà, đúng tinh thần khởi nghiệp."],
    sad: ["Pivot được không chị... ý em là đổi vị."],
    chats: [
      { q: "Nhà đầu tư nói ý tưởng em 'quá sớm'. Chị thấy sao?", a: [
        ["Sớm thì kiên nhẫn chờ thời, như ủ cà phê vậy.", 9, "Cold brew mindset! Em thích."],
        ["Vậy làm cái khác đi em.", 2, "Nghe đau ghê chị."],
        ["Chị không hiểu startup lắm.", 3, "Chị đang chạy chuỗi quán đó, startup chính hiệu luôn!"]] },
      { q: "Chị nghĩ làm giàu nhanh hay làm giàu bền?", a: [
        ["Bền chứ, từng ly một, từng khách một.", 8, "Đúng rồi... em vội quá."],
        ["Nhanh, rồi nghỉ hưu sớm!", 3, "Mơ ước chung của dân tech."],
        ["Làm giàu gì, đủ sống là vui.", 6, "Nghe bình yên ghê."]] },
    ],
    story: [
      { h: 1, lines: ["Em mang team tới ngồi brainstorm ở quán chị mỗi chiều thứ tư.", "Chị ráng giữ cái bàn dài cho tụi em nha!"], reward: { money: 300000 } },
      { h: 3, lines: ["Gọi vốn thành công rồi chị Uyên ơiii!", "Câu kết bài pitch của em là 'kiên nhẫn như ủ cà phê'. Bản quyền của chị đó."], reward: { money: 800000 } },
      { h: 5, lines: ["Công ty em giờ có năm mươi người. Mỗi sáng đặt cà phê từ quán chị.", "Hợp đồng dài hạn, chị ký giúp em nha!"], reward: { flow: 0.05, rep: 4 } },
    ] },

  { id: "vy", name: "Vy", title: "Nhân viên ngân hàng", loc: "saigon", day: 1, fav: ["sua_chua_cf", "tra_vai", "bac_xiu"], patience: 1.0, tip: 1.2,
    look: { g: "f", age: "young", skin: "#fce1cf", hair: "long", hc: "#7b4b2a", shirt: "blouse", sc: "#ffffff", acc: ["earrings"] },
    bio: "Đếm tiền cả ngày nhưng ước mơ là mở tiệm bánh.",
    greet: ["Chị ơi, cứu em với, cuối tháng chốt sổ!", "Hôm nay khách vay đông dã man.", "Cho em món mát mát, ngọt ngọt nhé."],
    happy: ["Ngọt dịu, như lúc được lương!", "Ngon quá chị ơi, em hết stress."],
    sad: ["Chắc em quen vị cũ rồi..."],
    chats: [
      { q: "Em muốn nghỉ ngân hàng mở tiệm bánh, nhưng sợ mất ổn định...", a: [
        ["Thử bán bánh online cuối tuần trước đã, có khách rồi tính tiếp.", 9, "Ý hay quá! Bắt đầu nhỏ thôi."],
        ["Nghỉ liền đi, đời có một lần!", 3, "Em chưa đủ gan chị ạ."],
        ["Ngân hàng lương cao mà, tiếc lắm.", 1, "Ừ... ai cũng nói vậy."]] },
      { q: "Chị có hay tiết kiệm không? Em lập bảng chi tiêu từng đồng.", a: [
        ["Có, chạy quán là phải tính kỹ tiền nguyên liệu, tiền thuê, tiền lương.", 8, "Chị đúng là bà chủ thực thụ."],
        ["Chị tiêu theo cảm hứng.", 2, "Ôi, nghe mà em hoảng."],
        ["Em dạy chị với!", 6, "Được! Bài một: ghi lại mọi khoản chi."]] },
    ],
    story: [
      { h: 1, lines: ["Em làm thử mẻ bánh bông lan, mang cho chị ăn thử.", "Khách nào hỏi thì giới thiệu giúp em nhé."], reward: { rep: 3 } },
      { h: 3, lines: ["Em bán bánh online được hai trăm đơn tháng rồi!", "Em gửi chị tiền hoa hồng vì đã giới thiệu."], reward: { money: 500000 } },
      { h: 5, lines: ["Em nghỉ ngân hàng rồi, tiệm bánh khai trương tuần sau.", "Mình làm đối tác nha: bánh của em, cà phê của chị!"], reward: { flow: 0.04, rep: 4 } },
    ] },

  { id: "chusau", name: "Chú Sáu", title: "Xe ôm truyền thống", loc: "saigon", day: 2, fav: ["den_da", "sua_da"], patience: 1.3, tip: 0.9,
    look: { g: "m", age: "old", skin: "#c68642", hair: "cap", hc: "#2f4858", shirt: "shirt", sc: "#4ea8de", acc: ["mustache"] },
    bio: "Chạy xe ôm từ thời chưa có app. Biết mọi câu chuyện của Sài Gòn.",
    greet: ["Con gái, cho chú ly đen đá, nhiều đá nghen!", "Trời Sài Gòn nóng muốn xỉu luôn con.", "Bữa nay ế khách quá trời."],
    happy: ["Đã quá con ơi! Uống cái mát rượi!", "Ngon dữ thần!"],
    sad: ["Ờ, uống đỡ khát cũng được."],
    chats: [
      { q: "Hồi trước chú chở khách bằng xe Cub, giờ ai cũng xài app. Chú theo không kịp...", a: [
        ["Con chỉ chú cài app chạy luôn, thêm khách mà chú!", 9, "Thiệt hả? Con chỉ chú nghen!"],
        ["Chú cứ chạy khách quen cũng được mà.", 5, "Ờ, khách quen thương chú lắm."],
        ["Chú nghỉ hưu đi.", -2, "Nghỉ thì lấy gì ăn con..."]] },
      { q: "Con biết hẻm nào ở Sài Gòn có tô hủ tiếu ngon nhất không?", a: [
        ["Chú dẫn đường đi, con bao chú một tô!", 8, "Chịu chơi! Chủ nhật này nha."],
        ["Con chỉ biết pha cà phê thôi chú.", 3, "Vậy để chú chỉ con."],
        ["Con ăn kiêng chú ơi.", 1, "Tội nghiệp, ăn kiêng gì ở Sài Gòn."]] },
    ],
    story: [
      { h: 1, lines: ["Chú giới thiệu quán con cho hết mấy ông xe ôm đầu chợ.", "Mai tụi nó kéo nhau tới uống đó!"], reward: { flow: 0.03 } },
      { h: 3, lines: ["Nhờ con chỉ cài app, giờ ngày chú chạy được gấp đôi.", "Chú gửi con ít tiền, coi như cảm ơn, đừng từ chối."], reward: { money: 300000 } },
      { h: 5, lines: ["Chú có đứa cháu muốn học nghề pha chế.", "Con nhận nó làm học việc nghen? Nó chăm lắm."], reward: { rep: 6 } },
    ] },

  { id: "jenny", name: "Jenny", title: "Việt kiều về thăm quê", loc: "saigon", day: 3, fav: ["bac_xiu", "ca_phe_dua"], patience: 1.1, tip: 1.6,
    look: { g: "f", age: "young", skin: "#f5d0b0", hair: "long", hc: "#e0b15a", shirt: "tee", sc: "#ff6b6b", acc: ["sunglasses"] },
    bio: "Sinh ra ở California, về Việt Nam tìm lại mùi vị tuổi thơ trong lời kể của mẹ.",
    greet: ["Hi chị! Em muốn thử... bạc xỉu? Em nói đúng không?", "Mẹ em nói cà phê Việt Nam là best in the world!", "Chị ơi, chị nói chậm chậm giúp em nha."],
    happy: ["Oh my god, ngon quá trời luôn!", "Đúng vị mẹ em kể! I could cry."],
    sad: ["Hmm, khác khác so với em tưởng..."],
    chats: [
      { q: "Tiếng Việt của em có kỳ không chị? Em học mẹ hết đó.", a: [
        ["Dễ thương lắm, chị nghe hiểu hết luôn!", 9, "Thật hả? Em vui quá!"],
        ["Hơi lơ lớ nhưng ổn mà.", 5, "Em sẽ luyện thêm!"],
        ["Em nói tiếng Anh đi cho nhanh.", -3, "Oh... em muốn nói tiếng Việt mà."]] },
      { q: "Mẹ em kể hồi xưa bà ngoại bán cà phê ở chợ Bến Thành. Em muốn tìm lại chỗ đó.", a: [
        ["Chị dẫn em đi hỏi mấy cô bán lâu năm nha.", 9, "Chị tốt quá, thank you so much!"],
        ["Chợ đổi nhiều rồi, khó tìm lắm em.", 3, "Em biết... nhưng em vẫn muốn thử."],
        ["Chắc mẹ em nhớ nhầm.", -3, "Hmm..."]] },
    ],
    story: [
      { h: 1, lines: ["Em gọi video cho mẹ, cho mẹ xem quán chị.", "Mẹ khóc luôn, nói giống quán bà ngoại ngày xưa."], reward: { rep: 3 } },
      { h: 3, lines: ["Mình tìm được cô bán cà phê quen bà ngoại em rồi!", "Cô còn nhớ tên bà luôn. Cảm ơn chị nhiều lắm."], reward: { money: 600000 } },
      { h: 5, lines: ["Em quyết định ở lại Việt Nam một năm.", "Em sẽ viết blog tiếng Anh về quán chị cho bạn bè quốc tế!"], reward: { flow: 0.05 } },
    ] },

  // ===== Đà Lạt =====
  { id: "phuong", name: "Phương", title: "Chủ vườn dâu", loc: "dalat", day: 1, fav: ["ca_cao_nong", "tra_dau", "den_nong"], patience: 1.3, tip: 1.1,
    look: { g: "f", age: "young", skin: "#ffe0cc", hair: "pony", hc: "#3d2314", shirt: "flannel", sc: "#d62828", acc: ["scarf"] },
    bio: "Bỏ phố về Đà Lạt trồng dâu. Hai bàn tay lúc nào cũng thơm mùi đất.",
    greet: ["Chào Uyên, sáng nay sương dày quá.", "Dâu năm nay ngọt lắm nè!", "Cho mình ly gì nóng nóng nha."],
    happy: ["Ấm cả người luôn!", "Ngon như dâu mới hái."],
    sad: ["Hơi nguội rồi Uyên ơi..."],
    chats: [
      { q: "Uyên có nghĩ tới chuyện bỏ phố về rừng như mình không?", a: [
        ["Có chứ, nhưng chắc phải mang theo cái phin!", 8, "Haha, mang cả quán lên luôn!"],
        ["Mình mê thành phố hơn.", 4, "Mỗi người một kiểu mà."],
        ["Về rừng chi cho muỗi đốt.", -2, "Muỗi Đà Lạt hiền mà..."]] },
      { q: "Mùa này mưa nhiều, dâu dễ hỏng lắm. Mình lo quá.", a: [
        ["Quán mình mua dâu của Phương để làm đồ uống nhé!", 9, "Thật hả? Vậy là có đầu ra rồi!"],
        ["Làm mứt dâu để được lâu hơn đó.", 6, "Ý hay, mình thử."],
        ["Trồng cây khác đi.", -2, "Dâu là đam mê mà..."]] },
    ],
    story: [
      { h: 1, lines: ["Mình mang cho Uyên một rổ dâu đầu mùa.", "Pha thử đồ uống gì đi!"], reward: { rep: 3 } },
      { h: 3, lines: ["Thử công thức này nè: trà, dâu Đà Lạt, chút đường và đá.", "Mình gọi là 'Trà dâu Đà Lạt'. Dâu cứ lấy ở vườn mình!"], reward: { recipe: "tra_dau" } },
      { h: 5, lines: ["Vườn mình được cấp chứng nhận hữu cơ rồi!", "Khách du lịch tới vườn đều được giới thiệu sang quán Uyên."], reward: { flow: 0.04, money: 400000 } },
    ] },

  { id: "khang", name: "Khang", title: "Nhiếp ảnh gia", loc: "dalat", day: 1, fav: ["den_nong", "cappuccino"], patience: 1.4, tip: 1.2,
    look: { g: "m", age: "mid", skin: "#e6b98f", hair: "beanie", hc: "#4a3b2f", shirt: "hoodie", sc: "#8d99ae", acc: ["camera", "beard"] },
    bio: "Săn mây Đà Lạt lúc năm giờ sáng, săn cà phê lúc sáu giờ.",
    greet: ["Sáng nay mây đẹp không tưởng, Uyên ạ.", "Cho anh ngồi gần cửa, ánh sáng đẹp.", "Anh chụp quán em một tấm được không?"],
    happy: ["Ly này lên hình đẹp như phim.", "Hoàn hảo, như khoảnh khắc vàng."],
    sad: ["Lệch nét rồi em..."],
    chats: [
      { q: "Em có biết vì sao anh thích chụp phim hơn máy số không?", a: [
        ["Vì mỗi tấm đều phải chờ, như chờ phin nhỏ giọt.", 9, "Chính xác! Em hiểu nghệ thuật đấy."],
        ["Vì nhìn hoài cổ, sang chảnh.", 4, "Cũng đúng một phần."],
        ["Máy số tiện hơn mà anh.", 0, "Tiện, nhưng thiếu hồn."]] },
      { q: "Anh muốn làm triển lãm về những quán cà phê nhỏ của Việt Nam.", a: [
        ["Anh chụp quán em đi! Em sẽ giới thiệu các quán khác nữa.", 8, "Deal! Em là người mẫu chính."],
        ["Ý tưởng hay quá anh.", 5, "Cảm ơn em."],
        ["Ai đi xem ảnh quán cà phê.", -3, "...Nhiều người lắm đó."]] },
    ],
    story: [
      { h: 1, lines: ["Anh chụp em đang pha phin lúc sương sớm.", "Tấm này anh tặng em, đẹp lắm."], reward: { rep: 3 } },
      { h: 3, lines: ["Ảnh quán em được đăng trên một tạp chí du lịch.", "Họ trả nhuận ảnh, anh chia em một nửa."], reward: { money: 500000 } },
      { h: 5, lines: ["Triển lãm 'Những cửa hàng nhỏ' mở ở Sài Gòn. Ảnh bìa là quán em.", "Hàng nghìn người đã thấy nụ cười của Uyên đấy."], reward: { flow: 0.05 } },
    ] },

  { id: "bamuoi", name: "Bà Mười", title: "Đan len bên hiên", loc: "dalat", day: 2, fav: ["ca_cao_nong", "den_nong"], patience: 2.0, tip: 1.0,
    look: { g: "f", age: "old", skin: "#eec39a", hair: "bun", hc: "#e0e0e0", shirt: "blouse", sc: "#b5838d", acc: ["scarf"] },
    bio: "Đan khăn len cho cả xóm. Thích ngồi sưởi nắng và kể chuyện xưa.",
    greet: ["Cháu gái, cho bà ly ấm ấm.", "Bà đan cho cháu cái khăn nè, lạnh rồi đó.", "Hôm nay bà khỏe, đi bộ tới đây luôn."],
    happy: ["Ấm như bếp lửa nhà quê.", "Cháu khéo tay ghê, giống bà hồi trẻ."],
    sad: ["Bà già rồi, uống gì cũng được cháu."],
    chats: [
      { q: "Cháu có muốn học đan len không? Bà dạy cho.", a: [
        ["Dạ có! Rảnh tay con sẽ ngồi học bà.", 9, "Ngoan quá. Bài đầu: mũi lên, mũi xuống."],
        ["Con vụng lắm bà ơi.", 4, "Vụng thì tập, có gì đâu."],
        ["Giờ ai còn đan len bà.", -3, "Bà vẫn đan đây thôi..."]] },
      { q: "Con cháu bà ở xa hết, ít khi về...", a: [
        ["Bà cứ ghé quán con mỗi ngày, con làm cháu bà!", 9, "Ôi cháu tôi... bà cảm động quá."],
        ["Chắc họ bận việc thôi bà.", 4, "Ừ, bà biết."],
        ["Bà gọi điện cho họ đi.", 3, "Bà không rành điện thoại..."]] },
    ],
    story: [
      { h: 1, lines: ["Bà đan cho cháu cái khăn màu cà phê sữa.", "Đeo vào cho ấm cổ khi pha chế sớm."], reward: { rep: 3 } },
      { h: 3, lines: ["Bà dạy cả hội phụ nữ phường đan khăn bán cho du khách.", "Bà gửi ít tiền lãi cho quán, coi như tiền thuê chỗ ngồi."], reward: { money: 300000 } },
      { h: 5, lines: ["Con cháu bà về thăm rồi! Bà dẫn tụi nó tới quán cháu.", "Bà bảo: đây là cháu gái thứ mười một của bà."], reward: { rep: 7 } },
    ] },

  // ===== Hội An =====
  { id: "tom", name: "Tom", title: "Du khách Úc", loc: "hoian", day: 1, fav: ["ca_phe_dua", "nuoc_mot", "den_da"], patience: 1.2, tip: 1.6,
    look: { g: "m", age: "mid", skin: "#f7c6a3", hair: "short", hc: "#f2d16b", shirt: "hawaii", sc: "#06d6a0", acc: ["sunglasses"] },
    bio: "Đến Hội An ba ngày, ở lại ba năm. Đang học tiếng Việt qua thực đơn.",
    greet: ["Xin chào! Một... cà phê, please. Đúng không?", "G'day Uyên! Hôm nay nóng quá!", "Tôi học được từ mới: 'ngon quá'!"],
    happy: ["Ngon quá! Wow, I mean... rất ngon!", "Best coffee in Hội An, no worries!"],
    sad: ["Hmm, hơi lạ... strange taste, mate."],
    chats: [
      { q: "Tiếng Việt khó quá! Ma, má, mà, mả, mã, mạ... Help me!", a: [
        ["Từ từ thôi Tom, mỗi ngày một từ nhé. Hôm nay: 'cà phê sữa đá'.", 9, "Cà... phê... sữa... đá! Tôi làm được!"],
        ["Cứ nói tiếng Anh, Uyên hiểu mà.", 3, "Nhưng tôi muốn học!"],
        ["Ừ khó thật, bỏ đi.", -3, "Oh no..."]] },
      { q: "Tôi muốn mở tour xe đạp quanh làng rau Trà Quế. Có tốt không?", a: [
        ["Tuyệt! Điểm dừng cuối là quán Uyên nhé!", 8, "Deal, mate! Partnership!"],
        ["Nắng lắm đó, nhớ mang nước.", 5, "Good tip, cảm ơn!"],
        ["Ai mà đạp xe trong nắng.", -2, "Người Úc... thích nắng mà."]] },
    ],
    story: [
      { h: 1, lines: ["Tôi viết review năm sao cho quán Uyên trên trang du lịch!", "Bạn bè ở Sydney hỏi địa chỉ rồi."], reward: { flow: 0.03 } },
      { h: 3, lines: ["Tour xe đạp của tôi chạy rồi! Mỗi đoàn dừng ở quán Uyên.", "Đây là phần chia lợi nhuận, fair dinkum!"], reward: { money: 600000 } },
      { h: 5, lines: ["Uyên ơi, tôi được nhập quốc tịch... à không, được cấp thẻ tạm trú dài hạn!", "Hội An là nhà tôi rồi. Và quán Uyên là phòng khách."], reward: { rep: 6, flow: 0.03 } },
    ] },

  { id: "cosau", name: "Cô Sáu", title: "Thợ may áo dài", loc: "hoian", day: 1, fav: ["nuoc_mot", "tra_vai"], patience: 1.3, tip: 1.2,
    look: { g: "f", age: "mid", skin: "#f0c29b", hair: "bun", hc: "#1a1a1a", shirt: "aodai", sc: "#e63946", acc: ["earrings"] },
    bio: "Tiệm may ba đời. May áo dài cho khách từ khắp thế giới trong hai mươi bốn giờ.",
    greet: ["Uyên ơi, khách đặt năm bộ áo dài, cô cần tỉnh táo!", "Cho cô ly mát mát, may cả đêm qua.", "Hôm nay cô đo cho cô dâu người Pháp đó."],
    happy: ["Khéo như đường kim mũi chỉ!", "Mát cả ruột gan, cảm ơn con."],
    sad: ["Đường may này hơi lệch rồi con."],
    chats: [
      { q: "Con mặc áo dài màu gì đẹp nhỉ? Để cô may tặng.", a: [
        ["Màu nâu cà phê sữa, cô ơi!", 9, "Đúng chất bà chủ quán! Cô may liền."],
        ["Màu đỏ cho may mắn.", 6, "Đỏ hợp với con lắm."],
        ["Con không mặc áo dài đâu.", -2, "Tiếc ghê..."]] },
      { q: "Con gái cô không muốn nối nghề may. Cô buồn mà cũng không ép được.", a: [
        ["Nghề có thể đổi, nhưng tình yêu cái đẹp nó sẽ giữ cô ạ.", 9, "Con nói phải... cô nhẹ lòng hơn rồi."],
        ["Cô nhận học trò khác đi.", 5, "Ừ, cũng nên vậy."],
        ["Nghề may cực lắm mà cô.", 1, "Cực, nhưng vui."]] },
    ],
    story: [
      { h: 1, lines: ["Cô may đồng phục cho nhân viên quán con, tặng luôn!", "Mặc vào nhìn chuyên nghiệp hẳn."], reward: { rep: 4 } },
      { h: 3, lines: ["Khách nước ngoài may áo ở tiệm cô, cô đều giới thiệu sang quán con.", "Hôm qua có mười người khen nước mót của con đó."], reward: { flow: 0.03 } },
      { h: 5, lines: ["Cô may xong rồi nè: áo dài màu cà phê sữa, thêu hình cái phin.", "Mặc vào hôm khai trương quán mới nhé con."], reward: { rep: 5, money: 400000 } },
    ] },

  { id: "nghia", name: "Nghĩa", title: "Nghệ nhân đèn lồng", loc: "hoian", day: 2, fav: ["den_da", "nuoc_mot"], patience: 1.2, tip: 1.0,
    look: { g: "m", age: "young", skin: "#d9a066", hair: "short", hc: "#1d1410", shirt: "tee", sc: "#f9c74f", acc: [] },
    bio: "Mỗi chiếc đèn lồng là một tuần làm thủ công. Mơ thắp sáng cả phố cổ.",
    greet: ["Chào chị Uyên, tay em còn dính hồ dán.", "Hôm nay em làm xong chiếc đèn thứ một trăm!", "Phố tối nay sẽ sáng rực."],
    happy: ["Ngon, sáng cả đầu óc!", "Giống ánh đèn lồng, ấm áp ghê."],
    sad: ["Hôm nay chắc em mệt nên uống không thấy ngon."],
    chats: [
      { q: "Chị thích đèn lồng màu gì? Em làm tặng một chiếc.", a: [
        ["Vàng nghệ, giống màu tường Hội An.", 9, "Chuẩn! Em làm liền."],
        ["Màu nào cũng đẹp hết em.", 5, "Vậy em làm nhiều màu luôn."],
        ["Chị không treo đèn lồng.", -2, "Ơ... tiếc ghê."]] },
      { q: "Có người nói đèn lồng nhựa rẻ hơn, nghề thủ công sẽ mất...", a: [
        ["Đồ thủ công có hồn, khách du lịch sẽ luôn tìm kiếm.", 9, "Cảm ơn chị, em có thêm động lực."],
        ["Em mở lớp dạy làm đèn cho du khách đi.", 7, "Ý hay! Vừa kiếm tiền vừa giữ nghề."],
        ["Thời thế thay đổi mà.", 0, "Ừm..."]] },
    ],
    story: [
      { h: 1, lines: ["Đèn lồng vàng nghệ cho quán chị đây!", "Treo ở cửa, khách từ xa đã thấy."], reward: { flow: 0.03 } },
      { h: 3, lines: ["Lớp dạy làm đèn lồng của em đông khách lắm.", "Buổi học xong em dẫn họ sang quán chị uống nước."], reward: { money: 400000 } },
      { h: 5, lines: ["Em được mời làm đèn lồng cho lễ hội quốc tế!", "Em muốn trang trí quán chị bằng chiếc đèn lớn nhất."], reward: { rep: 6 } },
    ] },

  // ===== Đà Nẵng =====
  { id: "hai", name: "Hải", title: "Dân lướt sóng", loc: "danang", day: 1, fav: ["sinh_to_bo", "nuoc_cam", "ca_phe_dua"], patience: 1.0, tip: 1.1,
    look: { g: "m", age: "young", skin: "#b5774a", hair: "curly", hc: "#3b2a1a", shirt: "tank", sc: "#00b4d8", acc: [] },
    bio: "Sáng lướt sóng Mỹ Khê, chiều dạy lướt cho khách, tối ngủ sớm.",
    greet: ["Sóng hôm nay cao hai mét đó chị!", "Cho em ly mát lạnh nha, nắng cháy rồi.", "Chị đi lướt sóng với em không?"],
    happy: ["Mát như sóng vỗ!", "Đã quá chị ơi, nạp năng lượng xong!"],
    sad: ["Hơi nhạt như biển lặng..."],
    chats: [
      { q: "Chị có sợ biển không? Em dạy lướt sóng miễn phí cho chị!", a: [
        ["Sợ, nhưng chị muốn thử! Sáng chủ nhật nhé.", 9, "Tuyệt vời! Chị dũng cảm ghê."],
        ["Chị chỉ thích ngắm biển thôi.", 4, "Ngắm cũng đẹp mà."],
        ["Lướt sóng nguy hiểm lắm.", -1, "Có em kèm thì an toàn mà chị."]] },
      { q: "Rác trên bãi biển nhiều quá, em muốn tổ chức nhặt rác mỗi tuần.", a: [
        ["Quán chị tài trợ nước uống cho tình nguyện viên!", 9, "Chị là nhất!"],
        ["Chị sẽ tham gia một buổi.", 7, "Hẹn chị sáng thứ bảy."],
        ["Mấy chuyện đó để nhà nước lo.", -3, "Biển là của tụi mình mà chị..."]] },
    ],
    story: [
      { h: 1, lines: ["Nhóm nhặt rác của em có ba chục người rồi.", "Ai cũng mặc áo in logo quán chị đó!"], reward: { flow: 0.03 } },
      { h: 3, lines: ["Em thắng giải lướt sóng miền Trung!", "Tiền thưởng em mời cả nhóm ăn và gửi quán chị một ít."], reward: { money: 500000 } },
      { h: 5, lines: ["Chị Uyên đứng được trên ván rồi! Em quay video lại rồi nè.", "Video viral luôn, ai cũng hỏi 'chị chủ quán lướt sóng' là ai."], reward: { rep: 6, flow: 0.03 } },
    ] },

  { id: "ngoc", name: "Chị Ngọc", title: "Hướng dẫn viên du lịch", loc: "danang", day: 1, fav: ["ca_phe_dua", "tra_dao"], patience: 0.9, tip: 1.3,
    look: { g: "f", age: "mid", skin: "#f3c7a4", hair: "bob", hc: "#2b1b12", shirt: "shirt", sc: "#52b788", acc: ["sunglasses"] },
    bio: "Nói được bốn thứ tiếng, dẫn đoàn lên Bà Nà, xuống Hội An mỗi ngày.",
    greet: ["Uyên ơi, đoàn khách Hàn tới sau mười phút nữa!", "Chị cần ly mát để nói tiếp tám tiếng.", "Hôm nay dẫn đoàn lên Ngũ Hành Sơn, mệt ghê."],
    happy: ["Ngon! Chị giới thiệu cho cả đoàn!", "Đúng chuẩn đặc sản biển."],
    sad: ["Khách hỏi thì chị biết nói sao đây..."],
    chats: [
      { q: "Khách nước ngoài hay hỏi chị: cà phê Việt có gì đặc biệt?", a: [
        ["Pha phin chậm rãi, như nhịp sống người Việt vậy chị.", 9, "Hay quá! Chị dùng câu này cho đoàn sau."],
        ["Đậm và ngọt, sữa đặc là bí quyết.", 6, "Đúng, nhưng còn thiếu chút cảm xúc."],
        ["Rẻ chị ạ.", -2, "Ờ... chị không nói vậy được."]] },
      { q: "Chị dẫn tour mười năm rồi mà chưa đi du lịch cho mình lần nào...", a: [
        ["Chị xứng đáng có một chuyến cho riêng mình đó!", 8, "Ừ nhỉ... chị sẽ đi Sa Pa."],
        ["Nghề của chị là đi mà.", 2, "Đi làm khác đi chơi em ạ."],
        ["Em cũng chưa đi đâu.", 4, "Vậy hai chị em hẹn nhau đi nhé."]] },
    ],
    story: [
      { h: 1, lines: ["Chị thêm quán em vào lịch trình tour ẩm thực.", "Mỗi tuần ít nhất ba đoàn ghé!"], reward: { flow: 0.04 } },
      { h: 3, lines: ["Công ty du lịch muốn ký hợp đồng cà phê với quán em.", "Đây là tiền đặt cọc."], reward: { money: 700000 } },
      { h: 5, lines: ["Chị đi Sa Pa về rồi! Lần đầu tiên làm khách du lịch.", "Chị mua quà cho em và quyết định: từ giờ mỗi năm đi một chuyến."], reward: { rep: 5 } },
    ] },

  { id: "long", name: "Long", title: "Kỹ sư cầu đường", loc: "danang", day: 2, fav: ["den_da", "bac_xiu"], patience: 0.9, tip: 1.1,
    look: { g: "m", age: "mid", skin: "#e0ac69", hair: "hardhat", hc: "#1a1a1a", shirt: "shirt", sc: "#f77f00", acc: [] },
    bio: "Tham gia xây cầu Rồng. Nhìn đâu cũng thấy kết cấu chịu lực.",
    greet: ["Uyên, một ly đậm cho kỹ sư!", "Công trình mới khởi công, bận ghê.", "Cái bàn này hơi cập kênh, để anh chỉnh."],
    happy: ["Chắc như móng cầu!", "Kết cấu vị hoàn hảo."],
    sad: ["Sai số hơi lớn em ơi."],
    chats: [
      { q: "Em có biết cầu Rồng phun lửa cuối tuần không? Anh tham gia làm đó.", a: [
        ["Tuyệt quá! Anh kể em nghe chuyện xây cầu đi.", 9, "Để anh kể từ cái trụ đầu tiên..."],
        ["Em xem rồi, đẹp lắm!", 6, "Lần sau anh dẫn em lên chỗ đẹp nhất."],
        ["Em không thích chỗ đông người.", 0, "Ừ, đông thật."]] },
      { q: "Anh làm xa nhà cả năm, con anh mới biết đi mà anh không thấy...", a: [
        ["Anh xin nghỉ phép về thăm con đi, công trình chờ được.", 9, "Em nói đúng... anh sẽ xin nghỉ."],
        ["Anh gọi video mỗi tối nha.", 6, "Ừ, anh vẫn gọi mà."],
        ["Vì công việc mà.", 0, "Ừ... vì công việc."]] },
    ],
    story: [
      { h: 1, lines: ["Anh sửa giúp em cái kệ hàng sắp sập rồi đó.", "Kỹ sư mà, không tính tiền!"], reward: { rep: 3 } },
      { h: 3, lines: ["Anh về thăm con rồi, con gọi 'ba' rõ lắm!", "Cảm ơn em đã khuyên anh. Quà nè."], reward: { money: 500000 } },
      { h: 5, lines: ["Công ty anh đặt cà phê cho cả công trường hai trăm người.", "Mỗi sáng, hợp đồng dài hạn với quán em."], reward: { flow: 0.04, money: 300000 } },
    ] },

  // ===== Huế =====
  { id: "thaylam", name: "Thầy Lâm", title: "Giáo viên Văn", loc: "hue", day: 1, fav: ["ca_phe_muoi", "den_nong"], patience: 1.5, tip: 1.1,
    look: { g: "m", age: "mid", skin: "#f0c8a0", hair: "side", hc: "#3a3a3a", shirt: "shirt", sc: "#f8f9fa", acc: ["glasses"] },
    bio: "Dạy Văn trường Quốc Học. Chấm bài bên ly cà phê muối mỗi chiều.",
    greet: ["Chào cô chủ, chiều Huế buồn mà đẹp.", "Chồng bài kiểm tra này cao quá...", "Cho thầy một ly muối, như mọi khi."],
    happy: ["Mặn mà như câu hò Huế.", "Thơm thảo quá, thầy cảm ơn."],
    sad: ["Bài này thầy cho điểm trung bình thôi."],
    chats: [
      { q: "Học trò bây giờ ít mê văn quá. Thầy phải làm sao?", a: [
        ["Thầy kể chuyện đời vào bài giảng, ai cũng thích nghe chuyện mà.", 9, "Ý hay... văn học vốn là chuyện đời."],
        ["Cho tụi nhỏ xem phim chuyển thể.", 5, "Cũng là một cách."],
        ["Văn chương thời nay khó kiếm tiền.", -2, "Không phải cái gì cũng đo bằng tiền."]] },
      { q: "Cô chủ thích bài thơ nào về Huế?", a: [
        ["'Đây thôn Vĩ Dạ' của Hàn Mặc Tử thầy ạ.", 9, "Sao anh không về chơi thôn Vĩ... Tuyệt."],
        ["Em thích nhạc Trịnh hơn.", 5, "Nhạc Trịnh cũng là thơ."],
        ["Em không thuộc bài nào.", 0, "Không sao, thầy đọc cho nghe."]] },
    ],
    story: [
      { h: 1, lines: ["Thầy dẫn học trò tới quán đọc thơ buổi chiều.", "Gọi là 'Chiều thơ bên ly cà phê muối'."], reward: { rep: 3 } },
      { h: 3, lines: ["Học trò thầy đạt giải nhất Văn toàn quốc!", "Em ấy viết bài về một quán cà phê nhỏ bên sông Hương."], reward: { money: 400000, rep: 3 } },
      { h: 5, lines: ["Thầy viết bài thơ tặng quán, khắc lên tấm gỗ.", "Treo ở cửa nhé: 'Giữ hương xưa, mở lối mới'."], reward: { rep: 7 } },
    ] },

  { id: "ohien", name: "O Hiền", title: "Bán chè hẻm", loc: "hue", day: 1, fav: ["ca_phe_muoi", "sua_da"], patience: 1.2, tip: 1.0,
    look: { g: "f", age: "mid", skin: "#eab991", hair: "nonla", hc: "#1a1a1a", shirt: "aodai", sc: "#9b5de5", acc: [] },
    bio: "Gánh chè ba mươi sáu món, nổi tiếng nhất hẻm Kiệt.",
    greet: ["Mệ ơi... à không, Uyên ơi, cho o ly cà phê muối!", "Hôm ni nắng chang chang, o mệt.", "O mang cho Uyên chén chè bột lọc nè."],
    happy: ["Ngon rứa! O khen thiệt đó.", "Mặn mặn ngọt ngọt, đúng vị Huế."],
    sad: ["Răng hôm ni hơi lạ rứa?"],
    chats: [
      { q: "Uyên có biết nói giọng Huế không? Thử nói 'răng rứa' coi!", a: [
        ["Răng rứa o? Con nói được chưa?", 9, "Được rồi đó! Giọng dễ thương ghê."],
        ["Con chịu thôi o ơi.", 3, "Từ từ tập nghe."],
        ["Khó nghe quá o.", -3, "Khó nghe mà dễ thương mà..."]] },
      { q: "O muốn bán chè ở quán Uyên, chung một góc được không?", a: [
        ["Được chứ o! Cà phê với chè, khách thích lắm!", 9, "Thiệt hả? O mừng quá!"],
        ["Để con tính toán chỗ đã o.", 4, "Ừ, không gấp."],
        ["Quán con nhỏ lắm o.", -1, "Ừ, o hiểu."]] },
    ],
    story: [
      { h: 1, lines: ["O dạy Uyên bí quyết kem muối: muối hột rang, đánh với kem thật bông.", "Người Huế uống là biết liền."], reward: { rep: 4 } },
      { h: 3, lines: ["Góc chè của o trong quán đắt khách lắm.", "O chia lại cho Uyên phần tiền chỗ nè."], reward: { money: 400000 } },
      { h: 5, lines: ["Báo du lịch viết về 'quán cà phê có chè o Hiền'!", "Giờ khách từ Hà Nội, Sài Gòn vô đều hỏi thăm."], reward: { flow: 0.05 } },
    ] },

  { id: "nam", name: "Nam", title: "Ca sĩ ca Huế", loc: "hue", day: 2, fav: ["tra_vai", "ca_phe_muoi"], patience: 1.2, tip: 1.2,
    look: { g: "m", age: "young", skin: "#f3cfa8", hair: "side", hc: "#1d1410", shirt: "aodai", sc: "#3a86ff", acc: [] },
    bio: "Hát ca Huế trên thuyền rồng mỗi tối. Giọng trong như nước sông Hương.",
    greet: ["Chị Uyên, tối ni em hát trên thuyền, chị nghe không?", "Giọng em hơi khàn, cho em ly trà mát.", "Hôm ni sông Hương đẹp lắm chị."],
    happy: ["Thanh mát như câu Nam ai!", "Ngon chi lạ rứa!"],
    sad: ["Lạc nhịp mất rồi chị ơi."],
    chats: [
      { q: "Người trẻ ít nghe ca Huế quá. Em có nên hát thêm nhạc trẻ không?", a: [
        ["Thử phối ca Huế với jazz đi, như nhạc quán chị!", 9, "Ca Huế jazz?! Nghe điên mà hay!"],
        ["Hát nhạc trẻ cho dễ nổi.", 3, "Nhưng em thương ca Huế..."],
        ["Ca Huế buồn ngủ lắm.", -4, "Chị nói vậy em buồn..."]] },
      { q: "Chị có muốn đi thuyền rồng nghe ca Huế một lần không?", a: [
        ["Có chứ! Tối thứ bảy chị đóng quán sớm đi.", 9, "Em hát tặng chị một bài riêng!"],
        ["Để khi nào rảnh nha em.", 3, "Dạ, chị nhớ nha."],
        ["Chị say sóng.", 0, "Sông Hương êm mà chị."]] },
    ],
    story: [
      { h: 1, lines: ["Em hát một đoạn 'Lý con sáo' tặng quán.", "Khách vỗ tay quá trời!"], reward: { rep: 3 } },
      { h: 3, lines: ["Bản ca Huế phối jazz của em lên sóng truyền hình!", "Em quay MV ở quán chị đó, chị không phiền chứ?"], reward: { flow: 0.04 } },
      { h: 5, lines: ["Em được mời biểu diễn ở Festival Huế.", "Em xin hát mở màn bằng bài 'Cửa hàng nhỏ của Uyên'... em mới sáng tác đó."], reward: { rep: 6, money: 500000 } },
    ] },
];

// ---------- Thành tựu ----------
const ACHIEVEMENTS = [
  { id: "first",   name: "Ly đầu tiên",        desc: "Phục vụ ly nước đầu tiên",               test: s => s.totals.served >= 1 },
  { id: "s100",    name: "Tay pha quen việc",  desc: "Phục vụ 100 ly",                          test: s => s.totals.served >= 100 },
  { id: "s1000",   name: "Nghìn ly yêu thương", desc: "Phục vụ 1.000 ly toàn chuỗi",           test: s => s.totals.served >= 1000 },
  { id: "p50",     name: "Đôi tay vàng",       desc: "50 ly hoàn hảo",                          test: s => s.totals.perfect >= 50 },
  { id: "friend",  name: "Người bạn thân",     desc: "Đạt 5 tim với một khách quen",            test: s => Object.values(s.chars).some(c => c.aff >= 100) },
  { id: "meet10",  name: "Quán của mọi người", desc: "Làm quen 10 khách quen",                  test: s => Object.values(s.chars).filter(c => c.met).length >= 10 },
  { id: "staff",   name: "Bà chủ thực thụ",    desc: "Thuê đủ 4 vị trí ở một quán",             test: s => s.shops.some(sh => ROLE_ORDER.every(r => sh.staff[r])) },
  { id: "shop2",   name: "Chi nhánh thứ hai",  desc: "Mở quán thứ 2",                            test: s => s.shops.length >= 2 },
  { id: "shop4",   name: "Chuỗi cà phê",       desc: "Mở 4 quán",                                test: s => s.shops.length >= 4 },
  { id: "shop6",   name: "Từ Bắc vào Nam",     desc: "Có quán ở cả 6 thành phố",                 test: s => s.shops.length >= 6 },
  { id: "rich",    name: "Triệu phú phin",     desc: "Có 50.000.000đ trong két",                 test: s => s.money >= 50000000 },
  { id: "secret",  name: "Sổ tay bí mật",      desc: "Mở khóa 3 công thức bí mật",               test: s => Object.keys(s.secrets).length >= 3 },
  { id: "rep5",    name: "Năm sao",            desc: "Một quán đạt uy tín 90",                   test: s => s.shops.some(sh => sh.rep >= 90) },
];

const INTRO = [
  { who: "ngoai", text: "Uyên à, nếu con đọc được những dòng này thì ngoại đã đi xa rồi." },
  { who: "ngoai", text: "Ngoại để lại cho con căn nhà nhỏ trong hẻm phố cổ, cái phin nhôm cũ và mấy người khách quen." },
  { who: "ngoai", text: "Đừng lo nhiều về tiền. Cứ pha bằng cả tấm lòng, khách sẽ ở lại." },
  { who: "ngoai", text: "Biết đâu một ngày, cửa hàng nhỏ của Uyên sẽ có mặt khắp đất nước này. Thương con. — Ngoại" },
  { who: "uyen",  text: "Ngoại ơi... con sẽ làm được. Hôm nay, Cửa hàng nhỏ của Uyên chính thức mở cửa!" },
];

const TUTORIAL = [
  "👆 Bấm vào khách có biểu tượng 💬 để nhận order (hoặc trò chuyện!).",
  "🧾 Phiếu order hiện ở quầy bên phải. Bấm phiếu để chọn, rồi bấm nguyên liệu theo đúng thứ tự công thức.",
  "✅ Bấm “Phục vụ” khi xong. Đúng thứ tự = Hoàn hảo, thêm tip và uy tín!",
  "📦 Nguyên liệu hết thì vào Kho để nhập. Cuối ngày sẽ trả tiền thuê, điện nước, lương nhân viên.",
  "👥 Khi uy tín tăng, hãy thuê lần lượt: Phục vụ → Tạp vụ → Thu ngân → Pha chế. Có pha chế rồi, Uyên mới mở được quán mới!",
];
