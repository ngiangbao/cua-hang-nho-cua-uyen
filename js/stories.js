// ===== Tâm sự với khách ruột, kỷ vật và sổ sưu tập =====

// Lời đáp của Uyên sau mỗi đoạn tâm sự (3 đoạn / khách): [câu của Uyên, điểm thân thiết, khách đáp lại]
const STORY_REPLIES = {
  minh: [
    [[L("Chị đồng ý! Làm xong nhớ dạy chị dùng nha."), 6, L("Dạ! Em sẽ làm giao diện thật dễ thương cho chị.")], [L("App gọi món có pha được cà phê không em?"), 2, L("Haha chưa, nhưng nó giúp chị đỡ chạy tới chạy lui.")], [L("Lo học trước đã em."), -2, L("Dạ... em vẫn học mà chị.")]],
    [[L("Chị tự hào về em lắm! Tiền này em giữ mà mua laptop mới."), 6, L("Chị cứ nhận đi, laptop em vẫn chạy tốt... dù hơi nóng.")], [L("Giải nhì là giỏi rồi, lần sau giải nhất nhé!"), 4, L("Dạ, em sẽ quay lại phục thù!")], [L("Thế còn deadline môn học thì sao?"), -1, L("Ơ... chị đừng nhắc...")]],
    [[L("Văn phòng thứ hai lúc nào cũng mở cửa đón em."), 6, L("Em biết mà. Em có món quà muốn tặng chị...")], [L("Lương cao rồi nhớ bao chị ly cà phê nha!"), 4, L("Ly nào cũng do chị pha, em bao kiểu gì đây haha.")], [L("Đi làm rồi chắc ít ghé thôi."), -2, L("Không đâu chị, em hứa mà.")]],
  ],
  lan: [
    [[L("Con nhớ chứ! Kẹo lạc cô mua ngon nhất phố."), 6, L("Ôi, con còn nhớ thật à? Cô cảm động quá.")], [L("Thật hả cô? Hồi đó con bé lắm."), 3, L("Bé xíu, tóc hai bím, chạy khắp hẻm.")], [L("Con không nhớ gì hết cô ạ."), -2, L("Ừ, trẻ con mau quên mà.")]],
    [[L("Cô viết hay quá, con sẽ cắt bài báo dán lên tường!"), 6, L("Dán cạnh ảnh ngoại con nhé.")], [L("Con đâu xứng với tiêu đề đó cô ơi."), 4, L("Xứng chứ, con gái khiêm tốn quá.")], [L("Báo phường ít người đọc lắm cô."), -3, L("Ít nhưng mà quý con ạ.")]],
    [[L("Con cảm ơn cô đã giữ giúp bà bao năm."), 6, L("Giữ cho con là niềm vui của cô. Còn cái này nữa...")], [L("Tối nay con gọi cảm ơn ngoại liền!"), 5, L("Ừ, bà mừng lắm đấy.")], [L("Sao giờ cô mới đưa ạ?"), -2, L("Bà dặn phải đợi con vững vàng đã con ạ.")]],
  ],
  tuan: [
    [[L("Anh là đại sứ thương hiệu của quán em rồi!"), 6, L("Đại sứ hai bánh, chạy khắp thành phố!")], [L("Cảm ơn anh, để em mời anh ly sữa đá."), 5, L("Thế thì anh không từ chối đâu.")], [L("Dán vậy có bị phạt không anh?"), 0, L("Yên tâm, anh dán đúng chỗ mà.")]],
    [[L("Chúc mừng anh! Xe mới chạy êm ru luôn."), 6, L("Em ngồi thử không? Anh chở một vòng hồ.")], [L("Anh giỏi quá, tự lực cánh sinh."), 5, L("Toàn nhờ mấy ly cà phê lấy sức đó.")], [L("Xe mới nhớ chạy chậm thôi nha anh."), 4, L("Ừ, anh hứa. An toàn là trên hết.")]],
    [[L("Em ký liền! Đối tác đầu tiên của anh mà."), 7, L("Vậy là mình làm ăn chung rồi nha. Cầm lấy cái này...")], [L("Anh làm chủ rồi, nhớ đối xử tốt với shipper nha."), 5, L("Đương nhiên, anh từng chạy mà.")], [L("Giá hữu nghị là bao nhiêu anh?"), 1, L("Haha, rẻ nhất thành phố!")]],
  ],
  mai: [
    [[L("Quán mình sao? Mai cho Uyên đọc trước được không?"), 6, L("Được, nhưng phải góp ý thật lòng đó.")], [L("Nhớ viết nhân vật chủ quán xinh đẹp nha!"), 4, L("Haha, xinh và hơi tự tin.")], [L("Viết truyện có kiếm được tiền không?"), -2, L("Chưa... nhưng mình vẫn viết.")]],
    [[L("Được chứ! Uyên vinh dự lắm."), 7, L("Cảm ơn Uyên, mình sẽ ghi lời cảm ơn ở trang đầu.")], [L("Đặt vậy người ta tưởng sách dạy kinh doanh mất."), 3, L("Haha, thì có chương kinh doanh mà.")], [L("Phải trả bản quyền tên quán nha!"), 2, L("Trả bằng một trăm ly cà phê được không?")]],
    [[L("Uyên sẽ chuẩn bị bánh và trà cho độc giả!"), 6, L("Uyên là nhất. Mình có cái này tặng Uyên...")], [L("Mai nhớ ký tặng Uyên cuốn đầu tiên nhé."), 5, L("Cuốn đầu tiên vốn dành cho Uyên rồi.")], [L("Đông người quá quán không đủ chỗ đâu."), 0, L("Thì mình đứng ký ngoài hẻm cũng được.")]],
  ],
  ongba: [
    [[L("Ngoại đẹp quá ông ơi! Cháu sẽ gửi ảnh về quê cho bà xem."), 7, L("Ừ, bà xem chắc cười mắng ông giữ ảnh lâu thế.")], [L("Cháu có giống ngoại không ông?"), 5, L("Giống lắm, nhất là đôi mắt.")], [L("Ảnh cũ quá, mờ hết rồi ông."), -2, L("Mờ ảnh chứ không mờ ký ức đâu cháu.")]],
    [[L("Cháu sẽ dành góc đẹp nhất cho các ông."), 6, L("Tốt lắm. Các ông hát to, cháu đừng ngại nhé.")], [L("Các ông kể chuyện xưa cho cháu nghe với."), 6, L("Được, chuyện ba ngày ba đêm chưa hết.")], [L("Họp có ồn lắm không ông?"), 0, L("Ồn tí thôi, vui mà.")]],
    [[L("Cháu hứa sẽ mang hồn quán đi thật xa."), 7, L("Ông tin cháu. Cầm lấy cái này, ông giữ nó cả đời...")], [L("Ông phải sống thật lâu uống cà phê cháu pha."), 6, L("Ừ, ông cố. Một trăm tuổi nhé.")], [L("Ông đừng nói chuyện buồn."), 3, L("Không buồn đâu cháu, đời mà.")]],
  ],
  khoa: [
    [[L("Cảm ơn anh, em sẽ giao đúng giờ!"), 6, L("Anh biết em đúng hẹn mà.")], [L("Họp thứ sáu có bánh không anh?"), 2, L("Có, anh đặt thêm bánh mì luôn.")], [L("Đặt nhiều không anh, em sợ làm không kịp."), 1, L("Hai mươi ly thôi.")]],
    [[L("Chúc mừng anh! Anh xứng đáng lắm."), 6, L("Cảm ơn em. Mà đừng gọi giám đốc, ngại lắm.")], [L("Lên chức rồi nhớ nghỉ ngơi nhiều hơn nha anh."), 7, L("Em là người đầu tiên nói câu đó với anh...")], [L("Vậy giờ anh bao cả quán đi."), 3, L("Được, hôm nay anh bao!")]],
    [[L("Anh là quý nhân của em đó!"), 6, L("Quý nhân gì, anh chỉ trả ơn mấy ly bạc xỉu thôi. Giữ cái này nhé...")], [L("Em cảm ơn, nhưng anh đừng để mình mệt quá nhé."), 6, L("Anh học được cách nghỉ rồi. Nhờ em đó.")], [L("Rẻ hơn bao nhiêu anh?"), 2, L("Đủ để em thuê thêm một nhân viên.")]],
  ],
  linh: [
    [[L("Linh giỏi quá! Chị chuẩn bị tinh thần đón khách đây."), 6, L("Chị nhớ cười thật tươi lúc khách tới nha!")], [L("Chị lên hình có xinh không em?"), 4, L("Xinh xỉu chị ơi!")], [L("Đông quá chị làm không kịp đâu."), 0, L("Thuê thêm người đi chị!")]],
    [[L("Quay ở quán chị thoải mái nhé!"), 6, L("Chị là chị gái quốc dân luôn.")], [L("Có kịch bản chưa em?"), 4, L("Chị chỉ cần làm như mọi ngày thôi.")], [L("Tiền tài trợ chia sao em?"), 1, L("Haha, chị lo xa ghê.")]],
    [[L("Chị tin em từ ly trà đào đầu tiên."), 7, L("Em nhớ mà. Em tặng chị cái này...")], [L("Giờ em là người nổi tiếng rồi!"), 4, L("Nổi tiếng mấy em vẫn là Linh của quán chị.")], [L("Đừng quên quán chị nha."), 5, L("Làm sao quên được chị!")]],
  ],
  cuhoa: [
    [[L("Cháu sẽ nhớ: nhẹ tay như đi quân sĩ."), 6, L("Đúng rồi, học nhanh lắm.")], [L("Cụ dạy cháu thêm nước cờ nữa đi."), 5, L("Từ từ, ăn chắc mặc bền.")], [L("Máy đánh trứng làm hết rồi cụ ơi."), -2, L("Máy không có tâm, con ạ.")]],
    [[L("Cháu sẽ ghi tên cụ lên thực đơn!"), 7, L("Hà hà, cụ thành người nổi tiếng rồi.")], [L("Ngon thật! Sao cụ biết công thức này?"), 5, L("Bà nhà cụ ngày xưa hay pha thế...")], [L("Thêm ca cao có ngọt quá không cụ?"), 2, L("Thử đi rồi biết.")]],
    [[L("Cháu sẽ lau cúp mỗi sáng cụ ạ."), 6, L("Ngoan. Cụ có món quà nữa...")], [L("Năm sau cụ thắng tiếp nhé!"), 5, L("Chắc chắn, đối thủ toàn bọn trẻ.")], [L("Cúp to thế để đâu bây giờ cụ?"), 1, L("Để chỗ nào nhiều người thấy ấy.")]],
  ],
  hang: [
    [[L("Đẹp quá em ơi! Chị treo ngay cạnh quầy."), 6, L("Chị thích là em vui rồi.")], [L("Em vẽ chị có đẹp hơn ngoài đời không?"), 3, L("Ngoài đời đẹp hơn, nhưng tranh giữ được lâu.")], [L("Em vẽ thiếu cái cây kìa."), 0, L("Ơ... để em vẽ thêm.")]],
    [[L("Menu này khách nào cũng chụp hình!"), 6, L("Em vui ghê, như có triển lãm nhỏ.")], [L("Chị trả công cho em nhé."), 4, L("Thôi chị, mời em ly cà phê trứng là được.")], [L("Chữ hơi khó đọc em ơi."), -1, L("Dạ... em sửa lại.")]],
    [[L("Bố mẹ em tới là điều quý nhất rồi."), 7, L("Bố em khóc đó chị. Em muốn tặng chị cái này...")], [L("Chị muốn mua bức tranh đó lắm!"), 5, L("Người ta mua mất rồi, nhưng em vẽ chị bức khác.")], [L("Bán được bao nhiêu em?"), 1, L("Đủ mua màu cả năm chị ạ.")]],
  ],
  duc: [
    [[L("Bài này sẽ là nhạc hiệu của quán!"), 6, L("Nghe sang chưa! Nhạc hiệu luôn.")], [L("Anh chơi trực tiếp cho em nghe đi."), 6, L("Để anh lấy sax ra... đây.")], [L("Có lời không anh?"), 1, L("Jazz không cần lời em ạ.")]],
    [[L("Em sẽ pha nó mỗi tối thứ bảy."), 6, L("Thứ bảy là đêm jazz mà.")], [L("Club cũ của anh giờ sao rồi?"), 5, L("Đóng cửa rồi... nhưng công thức thì sống tiếp ở đây.")], [L("Nhiều nguyên liệu thế khó nhớ quá."), 1, L("Cứ nhớ theo nhịp: một, hai, ba, bốn, năm.")]],
    [[L("Em sẽ sắp xếp sân khấu thật đẹp!"), 6, L("Giữ hộ anh cái này nhé, nó là bùa may mắn.")], [L("Anh hát luôn được không?"), 3, L("Giọng anh thì... thôi để sax hát.")], [L("Hàng xóm có phàn nàn không anh?"), 1, L("Mình mời họ tới nghe luôn.")]],
  ],
  chithu: [
    [[L("Quán có hoa của chị là đẹp nhất phố."), 6, L("Em khen hoa hay khen chị đấy?")], [L("Để em trả tiền hoa nhé chị."), 4, L("Thôi, chị tặng mà.")], [L("Hoa héo thì sao chị?"), 0, L("Thì chị thay bó mới.")]],
    [[L("Chúc mừng cháu! Chị nuôi con giỏi quá."), 7, L("Nó giỏi chứ chị có làm gì đâu.")], [L("Chị dắt cháu tới quán em khao nhé."), 6, L("Ừ, nó thích uống trà đào lắm.")], [L("Học chuyên vất vả lắm đó chị."), 2, L("Chị biết, chị sẽ bớt la nó.")]],
    [[L("Chị vất vả bao năm, giờ được nghỉ chân rồi."), 7, L("Ừ... không phải đạp xe nắng mưa nữa. Em giữ cái này nhé.")], [L("Hàng xóm thật rồi! Sáng nào em cũng mua hoa."), 6, L("Chị để dành bó đẹp nhất cho em.")], [L("Có sạp rồi còn đi xe đạp không chị?"), 3, L("Vẫn đi, để chở hoa cho em.")]],
  ],
  bao: [
    [[L("Bàn dài là của team em!"), 6, L("Chị là nhà đầu tư thiên thần đầu tiên rồi đó.")], [L("Ồn quá chị đuổi đó nha."), 2, L("Tụi em sẽ thì thầm ạ.")], [L("Mỗi người phải gọi một ly đó!"), 4, L("Chắc chắn, ba ly mỗi người luôn.")]],
    [[L("Chị biết em làm được mà!"), 6, L("Nhờ câu 'ủ cà phê' của chị đó.")], [L("Có tiền rồi nhớ ngủ đủ giấc nha."), 7, L("Em sẽ ngủ... bảy tiếng. Hứa.")], [L("Chị được chia cổ phần không?"), 2, L("Một cổ phần vĩnh viễn trong tim em.")]],
    [[L("Ký! Chị sẽ pha cho cả công ty em."), 6, L("Và đây là món quà kỷ niệm...")], [L("Em nhớ chăm sóc nhân viên mình nhé."), 6, L("Em học từ cách chị đối xử với nhân viên đó.")], [L("Năm mươi người chị pha không kịp đâu."), 2, L("Thì chị thuê thêm pha chế.")]],
  ],
  vy: [
    [[L("Ngon quá! Chị sẽ giới thiệu cho mọi khách."), 6, L("Em vui muốn khóc luôn.")], [L("Bánh này hợp với bạc xỉu lắm."), 5, L("Đúng gu em, cặp đôi hoàn hảo!")], [L("Hơi ngọt chút em ơi."), 1, L("Lần sau em giảm đường.")]],
    [[L("Em làm được rồi kìa, giỏi quá!"), 6, L("Nhờ lời khuyên bắt đầu nhỏ của chị.")], [L("Hoa hồng em giữ mà mua lò nướng mới."), 6, L("Chị tốt quá, em mua lò thật đó.")], [L("Ngân hàng biết không em?"), 0, L("Suỵt... chưa đâu chị.")]],
    [[L("Đối tác nhé! Bánh của em, cà phê của chị."), 7, L("Em tặng chị cái này để kỷ niệm...")], [L("Khai trương chị sẽ gửi hoa!"), 5, L("Hoa chị Thu nhé, em nghe tiếng rồi.")], [L("Nghỉ ngân hàng rồi có tiếc không?"), 3, L("Không tiếc chút nào chị ạ.")]],
  ],
  chusau: [
    [[L("Con cảm ơn chú, con pha thật nhiều đá cho các chú."), 6, L("Tụi nó mê đá lắm đó con.")], [L("Các chú đông quá ngồi đâu chú?"), 3, L("Ngồi ghế nhựa lề đường, quen rồi.")], [L("Các chú có trả tiền không chú?"), -1, L("Trời, trả đủ chớ con.")]],
    [[L("Chú giỏi ghê, học nhanh hơn con nữa."), 6, L("Có con chỉ thì chú mới học được.")], [L("Tiền đó chú để dành cho cháu đi chú."), 6, L("Con có lòng quá... thôi chú nghe con.")], [L("App có trừ chiết khấu nhiều không chú?"), 2, L("Cũng đỡ hơn ngồi chờ khách.")]],
    [[L("Con nhận! Con sẽ dạy cháu tận tình."), 7, L("Chú cảm ơn con. Chú gửi con kỷ vật này...")], [L("Cháu chú có thích cà phê không?"), 4, L("Mê lắm, sáng nào cũng đòi uống.")], [L("Học việc có lương không chú?"), 1, L("Con tính sao cũng được.")]],
  ],
  jenny: [
    [[L("Chị cũng xúc động... cho chị gửi lời chào mẹ em."), 7, L("Mẹ em nói cảm ơn chị nhiều lắm.")], [L("Lần sau mời mẹ em về uống nha."), 6, L("Mẹ hứa Tết này sẽ về!")], [L("Quán nào chẳng giống quán nào em."), -2, L("Không đâu, quán chị đặc biệt mà.")]],
    [[L("Tìm được rồi! Chị mừng cho em quá."), 7, L("Cô ấy còn giữ cái ly của bà em nữa.")], [L("Em hỏi cô ấy về bà em chưa?"), 6, L("Rồi, bà em hay hát khi pha cà phê.")], [L("Chợ đông quá chị mệt xỉu."), 1, L("Sorry chị, em mời chị ăn chè.")]],
    [[L("Ở lại đi em, Việt Nam luôn chào đón em."), 7, L("Em có món quà muốn đưa chị...")], [L("Blog nhớ chụp chị đẹp nha."), 4, L("Chị lúc nào cũng đẹp mà.")], [L("Viết tiếng Việt luôn cho chị đọc."), 5, L("Em sẽ thử, chị sửa lỗi chính tả nha!")]],
  ],
  phuong: [
    [[L("Dâu ngọt quá! Uyên pha trà dâu thử nhé."), 6, L("Nghe ngon rồi đó!")], [L("Phương trồng có cực lắm không?"), 6, L("Cực mà vui, sáng nào cũng nghe chim hót.")], [L("Dâu có phun thuốc không Phương?"), -1, L("Hữu cơ hết đó Uyên.")]],
    [[L("Uyên sẽ ghi 'Dâu vườn Phương' lên menu."), 7, L("Trời ơi, Uyên dễ thương quá!")], [L("Món này sẽ là đặc sản Đà Lạt của quán!"), 6, L("Mình vui quá, dâu mình có chỗ đứng rồi.")], [L("Dâu đắt quá Uyên lời ít lắm."), 0, L("Mình bán giá mềm cho Uyên mà.")]],
    [[L("Phương xứng đáng lắm, giỏi quá!"), 6, L("Cảm ơn Uyên. Đây là quà từ vườn mình...")], [L("Uyên ghé vườn chơi được không?"), 6, L("Lúc nào cũng được, mình hái dâu cùng nhau.")], [L("Chứng nhận có tốn tiền không?"), 1, L("Có, nhưng đáng.")]],
  ],
  khang: [
    [[L("Ảnh đẹp quá, em sẽ in ra treo lên tường!"), 6, L("Phải in khổ lớn mới đã.")], [L("Anh chụp em hay chụp khói vậy?"), 4, L("Cả hai. Khói đẹp, người còn đẹp hơn.")], [L("Em xấu lắm, xóa đi anh."), -1, L("Ai bảo vậy, nhìn lại đi.")]],
    [[L("Anh giữ nhuận ảnh đi mà mua phim!"), 6, L("Em hiểu dân chụp phim quá.")], [L("Tạp chí nào vậy anh, em mua liền."), 5, L("Để anh tặng em một cuốn.")], [L("Có ghi tên quán không anh?"), 3, L("Có chứ, in đậm luôn.")]],
    [[L("Cảm ơn anh đã kể câu chuyện của quán em."), 7, L("Và đây là thứ anh muốn em giữ...")], [L("Anh có buồn khi chụp xong không?"), 5, L("Không, mỗi tấm ảnh là một lời tạm biệt đẹp.")], [L("Ảnh bìa là em thật hả?"), 3, L("Thật, em nổi tiếng rồi.")]],
  ],
  bamuoi: [
    [[L("Con sẽ đeo mỗi sáng, ấm lắm bà ạ."), 7, L("Bà đan bằng cả tấm lòng đấy cháu.")], [L("Màu cà phê sữa dễ thương quá bà."), 5, L("Bà chọn mãi mới được màu này.")], [L("Đà Lạt lạnh thật bà nhỉ."), 2, L("Lạnh nên mới cần khăn chứ.")]],
    [[L("Bà là cô giáo của cả phường rồi!"), 6, L("Già rồi còn có ích, bà vui lắm.")], [L("Tiền đó bà để dành đi bà."), 6, L("Bà đủ rồi, cháu cứ cầm.")], [L("Bán được nhiều không bà?"), 2, L("Du khách mua quá trời.")]],
    [[L("Cháu thứ mười một chào cả nhà ạ!"), 7, L("Hà hà, cả nhà thương cháu lắm. Bà có cái này cho cháu...")], [L("Bà vui quá, con cũng vui lây."), 6, L("Ừ, hôm nay là ngày đẹp nhất của bà.")], [L("Đông người quá bà ơi."), 1, L("Đông mới vui chứ.")]],
  ],
  tom: [
    [[L("Thank you Tom! Cảm ơn nhiều lắm!"), 6, L("Không có chi! Tôi nói đúng chưa?")], [L("Tom viết bằng tiếng Việt chưa?"), 4, L("Một câu: 'Ngon quá!'")], [L("Năm sao thật hả?"), 3, L("Sáu sao nếu có!")]],
    [[L("Chúc tour thành công nha Tom!"), 7, L("Cảm ơn Uyên! Partnership!")], [L("Khách tour có thích nước mót không?"), 5, L("Họ mê, gọi là 'herbal magic'.")], [L("Đạp xe mệt không Tom?"), 3, L("Mệt, nhưng đồng lúa đẹp quá.")]],
    [[L("Chào mừng Tom về nhà!"), 7, L("Nhà tôi đây rồi. Quà cho Uyên...")], [L("Giờ Tom là người Hội An rồi."), 6, L("Tôi biết làm cao lầu rồi đó!")], [L("Có nhớ nước Úc không?"), 3, L("Nhớ, nhưng ở đây vui hơn.")]],
  ],
  cosau: [
    [[L("Đẹp quá cô ơi, nhân viên con sẽ mê lắm!"), 6, L("Mặc vào nhìn chuyên nghiệp hẳn.")], [L("Con trả tiền vải nhé cô."), 4, L("Thôi, cô tặng mà.")], [L("Màu này hơi chói cô ạ."), -1, L("Ừ... để cô sửa.")]],
    [[L("Cô là người quảng cáo giỏi nhất Hội An!"), 6, L("Haha, cô chỉ nói thật thôi.")], [L("Con mời cô ly nước mót nhé."), 5, L("Ừ, cô thèm từ sáng.")], [L("Khách nước ngoài có khó tính không cô?"), 3, L("Không, họ thân thiện lắm.")]],
    [[L("Con sẽ mặc nó hôm khai trương cô ạ!"), 7, L("Con gái cô cũng giúp may đấy. Còn cái này nữa...")], [L("Cô thêu cái phin đẹp quá!"), 6, L("Mất ba đêm đó con.")], [L("Áo dài có vừa không cô?"), 3, L("Cô đo bằng mắt, chuẩn luôn.")]],
  ],
  nghia: [
    [[L("Treo cửa sáng rực luôn, đẹp quá!"), 6, L("Chị thích là em vui.")], [L("Em làm mất bao lâu vậy?"), 4, L("Một tuần, từng nan tre.")], [L("Có hư khi mưa không em?"), 1, L("Vải lụa bền lắm chị.")]],
    [[L("Em đang giữ nghề cho cả phố đó!"), 7, L("Chị nói vậy em có thêm động lực.")], [L("Chị đăng ký học một buổi!"), 6, L("Học viên đặc biệt, miễn phí!")], [L("Lớp học có ồn không?"), 1, L("Không, ai cũng chăm chú.")]],
    [[L("Chị tự hào về em lắm!"), 7, L("Em tặng chị chiếc đèn nhỏ này...")], [L("Chiếc lớn nhất là bao lớn?"), 3, L("To bằng cái quán luôn chị.")], [L("Treo ở quán có vừa không em?"), 2, L("Em làm vừa khít mà.")]],
  ],
  hai: [
    [[L("Logo quán trên áo nhặt rác, chị tự hào lắm!"), 6, L("Tụi em cũng vậy!")], [L("Chị tham gia luôn tuần này."), 6, L("Tuyệt! Chị mang găng tay nhé.")], [L("Có bị nắng không em?"), 2, L("Đi sáng sớm nên mát.")]],
    [[L("Vô địch rồi! Đỉnh quá Hải ơi!"), 6, L("Sóng hôm đó cao ba mét đó chị.")], [L("Có nguy hiểm không em?"), 4, L("Một chút, nhưng em quen rồi.")], [L("Tiền thưởng nhiều không em?"), 1, L("Đủ mua ván mới.")]],
    [[L("Chị đứng được cũng nhờ em dạy!"), 7, L("Chị là học trò giỏi nhất. Em tặng chị cái này...")], [L("Chị té bao nhiêu lần trong video vậy?"), 5, L("Hai mươi ba lần, em đếm rồi.")], [L("Ngại quá, xóa video đi em!"), 1, L("Không được, nó viral rồi.")]],
  ],
  ngoc: [
    [[L("Cảm ơn chị, em sẽ đón khách thật chu đáo!"), 6, L("Chị tin em mà.")], [L("Khách Hàn thích uống gì chị?"), 5, L("Cà phê cốt dừa, mê luôn.")], [L("Đông vậy em làm không kịp."), 0, L("Thuê thêm người đi em.")]],
    [[L("Chị là quý nhân của em!"), 6, L("Quý nhân gì, chị chỉ nói thật.")], [L("Chị nhớ nghỉ ngơi nha chị."), 6, L("Ừ, sắp được đi chơi rồi.")], [L("Đặt cọc bao nhiêu chị?"), 1, L("Đủ để em mua thêm máy.")]],
    [[L("Chuyến đi vui không chị? Kể em nghe đi!"), 7, L("Vui lắm! Đây, quà từ Sa Pa...")], [L("Năm sau chị đi đâu?"), 5, L("Côn Đảo, em đi cùng không?")], [L("Sa Pa có lạnh không chị?"), 3, L("Lạnh run luôn em.")]],
  ],
  long: [
    [[L("Anh là kỹ sư số một!"), 6, L("Kết cấu giờ chắc chắn rồi.")], [L("Em mời anh ly bạc xỉu nhé."), 5, L("Thế thì anh không từ chối.")], [L("Kệ có sập nữa không anh?"), 2, L("Anh bảo hành trọn đời.")]],
    [[L("Con gọi 'ba' rồi à? Em mừng cho anh!"), 7, L("Anh khóc luôn đó em.")], [L("Anh ở lại với con lâu hơn nhé."), 6, L("Anh xin thêm phép rồi.")], [L("Công trình có bị chậm không anh?"), 1, L("Ổn, anh em lo giúp.")]],
    [[L("Hai trăm ly mỗi sáng, em xắn tay áo ngay!"), 6, L("Anh tặng em cái này, kỷ niệm cây cầu...")], [L("Công nhân vất vả, em pha thật đậm nhé."), 6, L("Họ sẽ thương em lắm.")], [L("Nhiều quá em pha sao kịp anh."), 2, L("Thuê thêm pha chế đi em.")]],
  ],
  thaylam: [
    [[L("Quán sẽ tắt nhạc để nghe thơ thầy ạ."), 6, L("Thơ và cà phê, hợp nhau lắm.")], [L("Thầy đọc thơ cho em nghe trước nhé."), 6, L("Được, bài 'Đây thôn Vĩ Dạ'.")], [L("Học trò có chịu tới không thầy?"), 2, L("Có cà phê muối là tới.")]],
    [[L("Thầy dạy giỏi quá, chúc mừng thầy!"), 6, L("Công của em ấy chứ.")], [L("Em đọc bài văn đó được không thầy?"), 6, L("Thầy mang bản in cho em.")], [L("Quán em được nhắc trong bài à?"), 3, L("Đoạn hay nhất đó em.")]],
    [[L("Câu thơ ấy em sẽ khắc ghi mãi."), 7, L("Còn một món nữa thầy muốn tặng em...")], [L("Thầy tự khắc à? Đẹp quá!"), 5, L("Mất cả tháng đó em.")], [L("Treo ở cửa có bị mưa không thầy?"), 2, L("Gỗ mít bền lắm.")]],
  ],
  ohien: [
    [[L("Bí quyết này con giữ kỹ lắm o!"), 6, L("Ừ, người Huế mới biết thôi.")], [L("O dạy con nấu chè luôn nha."), 6, L("Từ từ, ba mươi sáu món lận.")], [L("Muối hột có mặn quá không o?"), 2, L("Vừa đủ thôi con.")]],
    [[L("O cứ giữ phần tiền đó mà o."), 6, L("Con có lòng quá. O cảm ơn.")], [L("Chè o bán chạy hơn cà phê con rồi!"), 5, L("Haha, hai thứ đi đôi mà.")], [L("Khách có chê gì không o?"), 2, L("Không, ai cũng khen.")]],
    [[L("O có mệt không khi khách đông?"), 7, L("Mệt mà vui con ạ. O có quà nì...")], [L("O nổi tiếng khắp nước rồi!"), 6, L("Rứa là nhờ con.")], [L("Báo viết đúng không o?"), 2, L("Đúng hết, cả chuyện o hát.")]],
  ],
  nam: [
    [[L("Giọng em hay quá, chị nổi da gà luôn!"), 6, L("Chị khen làm em ngượng.")], [L("Em hát thêm bài nữa đi."), 6, L("Bài 'Lý qua đèo' nhé.")], [L("Ca Huế khó nghe quá em."), -3, L("Nghe lâu sẽ thấm chị ạ.")]],
    [[L("Quay thoải mái, chị mời cả ekip!"), 6, L("Ekip mê cà phê muối của chị.")], [L("Chị được đóng vai không?"), 5, L("Vai chủ quán, đúng vai luôn!")], [L("MV có làm quán ồn không?"), 1, L("Tụi em quay sáng sớm.")]],
    [[L("Bài hát về quán chị? Chị khóc mất!"), 7, L("Đây là bản nhạc viết tay, em tặng chị...")], [L("Chị sẽ đóng cửa quán để đi xem em diễn."), 6, L("Chị ngồi hàng đầu nhé!")], [L("Bài hát có tên chị thật à?"), 3, L("Thật, cả cái phin nữa.")]],
  ],
};

// ---------- Kỷ vật ----------
// from: id khách ruột trao tặng; souvenir: lấy khi uy tín quán thành phố đó đạt 60; start: có sẵn từ đầu
const ITEMS = {
  phin_ngoai:   { name: L("Cái phin nhôm của ngoại"), icon: "☕", set: "global", start: true, desc: L("Chiếc phin ngoại dùng suốt bốn mươi năm, ngoại trao lại trước khi về quê dưỡng già.") },
  ban_phim:     { name: L("Bàn phím cơ cũ"), icon: "⌨️", set: "global", from: "minh", desc: L("Chiếc bàn phím Minh gõ những dòng code đầu tiên. Phím Enter đã mòn.") },
  but_tim:      { name: L("Cây bút mực tím"), icon: "🖋️", set: "global", from: "lan", desc: L("Cây bút cô Lan chấm bài suốt ba mươi năm đứng lớp.") },
  mu_bao_hiem:  { name: L("Mũ bảo hiểm cũ"), icon: "⛑️", set: "global", from: "tuan", desc: L("Chiếc mũ theo Tuấn qua mười nghìn đơn hàng, đầy vết trầy.") },
  ban_thao:     { name: L("Bản thảo viết tay"), icon: "📜", set: "global", from: "mai", desc: L("Chương đầu tiên của 'Cửa hàng nhỏ', còn dính vệt cà phê.") },
  huy_hieu:     { name: L("Huy hiệu đồng đội"), icon: "🎖️", set: "global", from: "ongba", desc: L("Huy hiệu ông Ba đeo những năm ở tổ thanh niên xung phong cùng ngoại.") },
  ca_vat:       { name: L("Cà vạt may mắn"), icon: "👔", set: "global", from: "khoa", desc: L("Chiếc cà vạt anh Khoa đeo trong buổi phỏng vấn đầu tiên.") },
  gay_selfie:   { name: L("Cây gậy selfie"), icon: "🤳", set: "global", from: "linh", desc: L("Cây gậy đã quay video triệu view đầu tiên của Linh.") },

  quan_tuong:   { name: L("Quân Tướng bằng gỗ"), icon: "♟️", set: "hanoi", from: "cuhoa", desc: L("Quân cờ Cụ Hòa giữ từ ván cờ vô địch đầu tiên.") },
  hop_mau:      { name: L("Hộp màu nước"), icon: "🎨", set: "hanoi", from: "hang", desc: L("Hộp màu cũ của Hằng, ô màu nâu cà phê đã dùng gần hết.") },
  dam_ken:      { name: L("Dăm kèn saxophone"), icon: "🎷", set: "hanoi", from: "duc", desc: L("Chiếc dăm kèn Đức thổi trong đêm diễn đầu tiên ở phố Tạ Hiện.") },
  non_hoa:      { name: L("Nón lá thêu hoa"), icon: "👒", set: "hanoi", from: "chithu", desc: L("Chiếc nón chị Thu đội suốt mười năm rong ruổi bán hoa.") },
  rua_ho_guom:  { name: L("Tượng rùa Hồ Gươm"), icon: "🐢", set: "hanoi", souvenir: "hanoi", desc: L("Quà lưu niệm khi quán Hà Nội đạt uy tín 60.") },

  ban_pitch:    { name: L("Bản pitch đầu tiên"), icon: "📈", set: "saigon", from: "bao", desc: L("Slide gọi vốn bị từ chối lần đầu, Bảo giữ để nhắc mình đừng bỏ cuộc.") },
  khuon_banh:   { name: L("Khuôn bánh bông lan"), icon: "🧁", set: "saigon", from: "vy", desc: L("Chiếc khuôn Vy nướng mẻ bánh đầu tiên lúc nửa đêm.") },
  chia_khoa:    { name: L("Chìa khóa xe Cub"), icon: "🔑", set: "saigon", from: "chusau", desc: L("Chìa khóa chiếc Cub chở khách khắp Sài Gòn bốn mươi năm.") },
  buu_thiep:    { name: L("Bưu thiếp California"), icon: "💌", set: "saigon", from: "jenny", desc: L("Tấm bưu thiếp mẹ Jenny viết 'Nhớ quê' từ năm 1995.") },
  cho_ben_thanh:{ name: L("Mô hình chợ Bến Thành"), icon: "🏛️", set: "saigon", souvenir: "saigon", desc: L("Quà lưu niệm khi quán Sài Gòn đạt uy tín 60.") },

  hat_dau:      { name: L("Hạt giống dâu tây"), icon: "🌱", set: "dalat", from: "phuong", desc: L("Gói hạt từ cây dâu đầu tiên Phương trồng ở Đà Lạt.") },
  cuon_phim:    { name: L("Cuộn phim 35mm"), icon: "🎞️", set: "dalat", from: "khang", desc: L("Cuộn phim chụp buổi sương sớm đầu tiên ở quán.") },
  cuon_len:     { name: L("Cuộn len đỏ"), icon: "🧶", set: "dalat", from: "bamuoi", desc: L("Cuộn len bà Mười giữ từ chiếc áo đầu tiên đan cho chồng.") },
  da_quy:       { name: L("Hoa dã quỳ ép khô"), icon: "🌼", set: "dalat", souvenir: "dalat", desc: L("Quà lưu niệm khi quán Đà Lạt đạt uy tín 60.") },

  boomerang:    { name: L("Boomerang nhỏ"), icon: "🪃", set: "hoian", from: "tom", desc: L("Món đồ Tom mang theo từ Úc, giờ nó đã có nhà mới.") },
  kim_chi:      { name: L("Cây kim ba đời"), icon: "🪡", set: "hoian", from: "cosau", desc: L("Cây kim của tiệm may ba đời, từng may áo cưới cho cả phố.") },
  den_long:     { name: L("Đèn lồng tí hon"), icon: "🏮", set: "hoian", from: "nghia", desc: L("Chiếc đèn lồng đầu tiên Nghĩa làm năm mười hai tuổi.") },
  hoa_dang:     { name: L("Hoa đăng sông Hoài"), icon: "🪷", set: "hoian", souvenir: "hoian", desc: L("Quà lưu niệm khi quán Hội An đạt uy tín 60.") },

  vo_oc:        { name: L("Vỏ ốc Mỹ Khê"), icon: "🐚", set: "danang", from: "hai", desc: L("Vỏ ốc Hải nhặt sau lần đầu Uyên đứng vững trên ván.") },
  co_hdv:       { name: L("Lá cờ hướng dẫn viên"), icon: "🚩", set: "danang", from: "ngoc", desc: L("Lá cờ chị Ngọc giơ cao dẫn hơn một nghìn đoàn khách.") },
  oc_vit:       { name: L("Con ốc cầu Rồng"), icon: "🔩", set: "danang", from: "long", desc: L("Con ốc dự phòng từ công trình cầu Rồng.") },
  cau_rong:     { name: L("Mô hình cầu Rồng"), icon: "🐉", set: "danang", souvenir: "danang", desc: L("Quà lưu niệm khi quán Đà Nẵng đạt uy tín 60.") },

  tap_tho:      { name: L("Tập thơ chép tay"), icon: "📖", set: "hue", from: "thaylam", desc: L("Tập thơ Thầy Lâm chép từ năm hai mươi tuổi, giấy đã ngả vàng.") },
  quang_ganh:   { name: L("Đôi quang gánh tre"), icon: "🎋", set: "hue", from: "ohien", desc: L("Đôi quang gánh o Hiền gánh chè suốt hai mươi năm khắp kiệt Huế.") },
  dan_nguyet:   { name: L("Cây đàn nguyệt nhỏ"), icon: "🪕", set: "hue", from: "nam", desc: L("Cây đàn Nam học những nốt đầu tiên của ca Huế.") },
  ngo_mon:      { name: L("Mô hình Ngọ Môn"), icon: "🏯", set: "hue", souvenir: "hue", desc: L("Quà lưu niệm khi quán Huế đạt uy tín 60.") },
};

// Phần thưởng khi gom đủ một bộ
const ITEM_SETS = {
  global: { name: L("Những người bạn khắp nơi"), reward: { money: 3000000, flow: 0.05 }, desc: L("+3.000.000đ, +5% khách toàn chuỗi") },
  hanoi:  { name: L("Hồn phố cổ Hà Nội"),        reward: { money: 1500000, tipLoc: "hanoi" },  desc: L("+1.500.000đ, quán Hà Nội +10% tip vĩnh viễn") },
  saigon: { name: L("Nhịp sống Sài Gòn"),        reward: { money: 2000000, tipLoc: "saigon" }, desc: L("+2.000.000đ, quán Sài Gòn +10% tip vĩnh viễn") },
  dalat:  { name: L("Sương sớm Đà Lạt"),         reward: { money: 2000000, tipLoc: "dalat" },  desc: L("+2.000.000đ, quán Đà Lạt +10% tip vĩnh viễn") },
  hoian:  { name: L("Đèn lồng Hội An"),          reward: { money: 2500000, tipLoc: "hoian" },  desc: L("+2.500.000đ, quán Hội An +10% tip vĩnh viễn") },
  danang: { name: L("Gió biển Đà Nẵng"),         reward: { money: 2500000, tipLoc: "danang" }, desc: L("+2.500.000đ, quán Đà Nẵng +10% tip vĩnh viễn") },
  hue:    { name: L("Mộng mơ xứ Huế"),           reward: { money: 3000000, tipLoc: "hue" },    desc: L("+3.000.000đ, quán Huế +10% tip vĩnh viễn") },
};
const SET_ORDER = ["global", "hanoi", "saigon", "dalat", "hoian", "danang", "hue"];

// Ngoại ghé thăm khi gom đủ mọi bộ sưu tập
const ENDING = [
  L("Uyên ơi! Ngoại đây! Ngoại đi xe khách từ quê lên thăm con đấy."),
  L("Mấy người bạn cũ kể với ngoại hết rồi: con mở quán khắp sáu thành phố, ai cũng thương con."),
  L("Cái phin nhôm ngày xưa giờ nằm cạnh cả một tủ kỷ vật của bao nhiêu con người..."),
  L("Ngoại pha cho con một ly nhé. Hôm nay con là khách của ngoại."),
];

// ---------- Tình huống bất ngờ (quick time event) ----------
// taps: số lần bấm cần thiết; time: số giây; move: biểu tượng nhảy chỗ sau mỗi lần bấm
const QTES = {
  generator: { icon: "⚙️", title: L("Cúp điện! Quay máy phát điện!"), hint: L("Bấm liên tục"), taps: 12, time: 6, move: false },
  spill:     { icon: "🥤", title: L("Khách vấp chân, ly sắp đổ!"), hint: L("Bấm để đỡ ly"), taps: 1, time: 2.2, move: false },
  cat:       { icon: "🐈", title: L("Mèo hoang lẻn vào quầy!"), hint: L("Bấm vào mèo 3 lần"), taps: 3, time: 4.5, move: true },
  leak:      { icon: "🪣", title: L("Mái dột rồi! Đặt xô hứng nước!"), hint: L("Bấm nhanh"), taps: 1, time: 2.6, move: false },
  wallet:    { icon: "👛", title: L("Khách bỏ quên ví!"), hint: L("Bấm để giữ lại trả khách"), taps: 1, time: 3.5, move: false },
  rush:      { icon: "📣", title: L("Đoàn khách du lịch tới bất ngờ!"), hint: L("Bấm 5 lần để sắp xếp bàn ghế"), taps: 5, time: 4.5, move: true },
};

// ---------- Nhạc trong quán ----------
const MUSIC_PRESETS = {
  auto:   { name: L("Jazz theo thành phố"), icon: "🎷", desc: L("Tự đổi giọng và nhịp theo từng quán") },
  swing:  { name: L("Swing sôi động"), icon: "🎺", desc: L("Nhanh, vui, hợp giờ cao điểm"), tempo: 138, key: 3, style: "swing" },
  bossa:  { name: L("Bossa nova Sài Gòn"), icon: "🌴", desc: L("Nhẹ nhàng, đung đưa"), tempo: 118, key: 7, style: "bossa" },
  lofi:   { name: L("Lo-fi đêm mưa"), icon: "🌧️", desc: L("Chậm, ấm, có tiếng đĩa than"), tempo: 74, key: 2, style: "lofi" },
  ballad: { name: L("Piano ballad"), icon: "🎹", desc: L("Thư thái, ít trống"), tempo: 66, key: 8, style: "ballad" },
};
const YT_SUGGEST = ["vietnamese coffee jazz", L("nhạc Trịnh jazz"), "lofi hip hop radio", "bossa nova cafe", "jazz piano rainy day", L("acoustic cà phê sáng")];

// ===================== Cốt truyện theo chương =====================
const CHAPTERS = [
  { n: 1, icon: "🌿", title: L("Mầm Nắng Đầu Tiên"), sub: L("Hương vị quen thuộc"),
    intro: [L("Căn nhà cũ cuối phố, góc sân nhỏ phủ đầy lá khô. Uyên lau lại từng chiếc ghế gỗ, kê lại quầy pha chế của ngoại."),
            L("Những vị khách đầu tiên trong khu phố ghé qua: bác hàng xóm, cô sinh viên, anh họa sĩ tự do... Menu chỉ có vài món cà phê truyền thống và trà thảo mộc."),
            L("Uyên buộc lại tạp dề, hít một hơi thật sâu: “Bắt đầu thôi, Uyên ơi!”")],
    goals: [
      { text: L("Phục vụ 40 ly"), test: S => S.totals.served >= 40 },
      { text: L("Mua máy móc đầu tiên cho quán"), test: S => S.shops.some(sh => Object.keys(sh.equip || {}).length > 0) },
      { text: L("Làm quen 3 khách ruột"), test: S => Object.values(S.chars).filter(c => c.met).length >= 3 },
    ] },
  { n: 2, icon: "🌼", title: L("Tiếng Tách Trà Chiều"), sub: L("Mở lòng & kết nối"),
    intro: [L("Quán dần thành điểm hẹn thân thuộc. Mỗi vị khách mang theo một câu chuyện: sự mệt mỏi sau giờ làm, nỗi băn khoăn về tương lai, hay nỗi cô đơn giữa thành phố."),
            L("Có những người chẳng gọi món, chỉ nói: “Chị chọn giúp em một ly hợp tâm trạng nhé.”"),
            L("Hãy lắng nghe. Pha đúng ly hợp lòng khách, họ sẽ trải lòng và để lại những mảnh ghép câu chuyện.")],
    goals: [
      { text: L("Pha 6 ly hợp tâm trạng khách"), test: S => S.story.moodMatches >= 6 },
      { text: L("Khôi phục 5 trang sổ tay"), test: S => Object.keys(S.story.pages).length >= 5 },
      { text: L("Một khách ruột đạt 3 tim"), test: S => Object.values(S.chars).some(c => c.aff >= 60) },
      { text: L("Lắp 2 món trang trí ấm cúng"), test: S => S.shops.reduce((a, sh) => a + Object.keys(sh.decor).length, 0) >= 2 },
    ] },
  { n: 3, icon: "🍁", title: L("Thử Thách & Bão Rào Ban Đêm"), sub: L("Giữ vững bình yên"),
    intro: [L("Đầu phố bỗng rực đèn: một chuỗi cà phê thương mại lớn khai trương, nhạc to, khuyến mãi rầm rộ. Khách quen thưa dần."),
            L("Uyên ngồi lặng bên quầy: “Mình có nên thay đổi để chạy theo họ, hay giữ nguyên quán nhỏ bình dị của ngoại?”")],
    goals: [
      { text: L("Vượt qua đêm bão"), test: S => !!S.story.stormDone },
      { text: L("Sáng tạo một món signature"), test: S => (S.signatures || []).length >= 1 },
      { text: L("Mở sân vườn nhỏ hoặc góc đọc sách"), test: S => S.shops.some(sh => sh.decor.san_vuon || sh.decor.goc_sach) },
      { text: L("Khôi phục 8 trang sổ tay"), test: S => Object.keys(S.story.pages).length >= 8 },
    ] },
  { n: 4, icon: "🌸", title: L("Hương Cà Phê Đơm Hoa"), sub: L("Góc trú ẩn bất tận"),
    intro: [L("Cuốn sổ tay của ngoại gần như đã trọn vẹn. Chỉ còn trang cuối cùng, trắng tinh."),
            L("Ngoại để lại một dòng: “Trang này không phải của ngoại. Nó dành cho người sẽ tiếp tục giữ lửa.”")],
    goals: [
      { text: L("Cùng Uyên viết trang cuối của sổ tay"), test: S => !!S.story.lastPage },
    ] },
];

// Tâm trạng khách và nhóm vị đồ uống hợp với tâm trạng đó
const MOODS = {
  met:      { name: L("Mệt mỏi"),   icon: "😮‍💨", feel: "dam",  ask: [L("Hôm nay chạy deadline cả ngày, mệt rã rời..."), L("Tối qua mất ngủ, giờ mắt cứ díp lại.")] },
  buon:     { name: L("Buồn"),      icon: "🥺", feel: "am",   ask: [L("Hôm nay có chuyện không vui... mình muốn cái gì đó ấm áp."), L("Tự dưng thấy lòng nặng trĩu.")] },
  bankhoan: { name: L("Băn khoăn"), icon: "🤔", feel: "diu",  ask: [L("Mình đang phân vân chuyện đổi việc, đầu óc rối bời."), L("Nhiều chuyện phải nghĩ quá, cần chút tĩnh lặng.")] },
  codon:    { name: L("Cô đơn"),    icon: "🫥", feel: "am",   ask: [L("Mới chuyển lên thành phố, chưa quen ai cả..."), L("Cuối tuần mà chẳng biết đi đâu.")] },
  nong:     { name: L("Nóng nực"),  icon: "🥵", feel: "mat",  ask: [L("Trời nóng như đổ lửa, cần gì đó mát lạnh!"), L("Đạp xe nãy giờ, khát khô cổ rồi.")] },
  vui:      { name: L("Vui vẻ"),    icon: "🥳", feel: "ngot", ask: [L("Mình vừa được tin vui! Muốn ăn mừng bằng gì đó ngọt ngào."), L("Hôm nay là sinh nhật mình đó!")] },
};
const FEELS = { dam: L("đậm, tỉnh táo"), am: L("ấm áp, vỗ về"), diu: L("dịu nhẹ, thư thái"), mat: L("mát lạnh, sảng khoái"), ngot: L("ngọt ngào") };
const DRINK_FEEL = {
  den_da: "dam", den_nong: "dam", sua_da: "dam", espresso: "dam", cf_cu_hoa: "dam", cf_com: "dam",
  ca_cao_nong: "am", latte: "am", cappuccino: "am", ca_phe_trung: "am", jazz_latte: "am", sua_dau_nanh: "am",
  tra_sen: "diu", tra_atiso: "diu", tra_dao: "diu", tra_vai: "diu", tra_cung_dinh: "diu", matcha_latte: "diu", tra_la_dua: "diu", nuoc_mot: "diu",
  tra_chanh: "mat", tra_tac: "mat", nuoc_cam: "mat", nuoc_dua: "mat", rau_ma_dx: "mat", sinh_to_bo: "mat", sua_chua_cf: "mat", tra_dau: "mat",
  bac_xiu: "ngot", tra_sua: "ngot", ca_phe_dua: "ngot", ca_phe_muoi: "ngot", sua_sen: "ngot", dua_dam: "ngot", ky_uc: "am",
};

// Sổ tay công thức cũ của ngoại: trang mờ cần mảnh ghép để khôi phục
const NOTEBOOK = [
  { title: L("Cà phê phin của ngoại"), need: 0, text: L("Hai thìa cà phê, chút nước sôi để ủ, chờ ba mươi giây rồi mới chế tiếp. Vội là đắng, chậm là thơm.") },
  { title: L("Bạc xỉu cho con bé"), need: 0, text: L("Nhiều sữa, ít cà phê. Ngày Uyên lên năm, con bé uống một ngụm rồi cười tít mắt. Ngoại đặt tên nó là “ly của Uyên”.") },
  { title: L("Ca cao ngày mưa"), need: 0, text: L("Mưa là khách ngồi lâu. Pha ca cao thật đặc, để họ cầm ly cho ấm tay mà kể chuyện.") },
  { title: L("Người khách áo mưa xanh"), need: 2, text: L("Ông ấy ngày nào cũng gọi đen nóng, không đường. Một hôm ông khóc. Ngoại không hỏi, chỉ thêm một chiếc bánh quy vào đĩa. Hôm sau ông lại tới và cười."), reward: { rep: 3 } },
  { title: L("Bí mật của ly hợp lòng"), need: 3, text: L("Người mệt cần đậm. Người buồn cần ấm. Người rối cần dịu. Người vui cần ngọt. Đừng hỏi họ muốn gì, hãy nghe họ đang thế nào."), reward: { moodTip: 0.05 } },
  { title: L("Góc sân và giàn hoa giấy"), need: 4, text: L("Ông ngoại trồng giàn hoa giấy năm ngoại mở quán. Ông bảo: quán nào cũng cần một góc để người ta ngồi im mà không thấy ngại."), reward: { money: 500000 } },
  { title: L("Những lá thư không gửi"), need: 5, text: L("Có cô sinh viên viết thư cho mẹ ở quê, viết xong lại gấp cất. Ngoại bảo cứ để lại quán, khi nào đủ can đảm thì gửi. Hộp thư ấy giờ vẫn ở dưới quầy."), reward: { flow: 0.03 } },
  { title: L("Khi quán vắng khách"), need: 6, text: L("Có năm quán vắng đến mức ngoại định đóng cửa. Rồi hàng xóm rủ nhau tới, mỗi người một ly. Quán nhỏ sống được là nhờ người ta thương nó."), reward: { rep: 5 } },
  { title: L("Ly nước cho người tìm lại ký ức"), need: 8, text: L("Cà phê phin cho ký ức đậm, sữa đặc cho những ngày ngọt, sữa tươi cho hiện tại dịu dàng, ca cao rắc lên cho chút hơi ấm. Ngoại chưa đặt tên, để dành cho ai đó..."), reward: { money: 800000 } },
  { title: L("Trang cuối"), need: -1, text: "" },
];

// Mùa trong năm (mỗi mùa 14 ngày)
const SEASONS = [
  { name: L("Xuân"), icon: "🌸", feel: "ngot", desc: L("Đầu xuân, khách thích món ngọt ngào"), event: L("Phố treo đèn đón xuân, khách đi chơi đông hơn!") },
  { name: L("Hạ"),   icon: "☀️", feel: "mat",  desc: L("Mùa hè, món mát bán chạy"), event: L("Hè về, học sinh nghỉ học ghé quán đông vui!") },
  { name: L("Thu"),  icon: "🍂", feel: "diu",  desc: L("Thu dịu dàng, trà được ưa chuộng"), event: L("Gió heo may về, khách thích ngồi lâu nhâm nhi trà.") },
  { name: L("Đông"), icon: "❄️", feel: "am",   desc: L("Đông lạnh, món ấm áp đắt hàng"), event: L("Gió mùa đông bắc tràn về, ai cũng tìm một ly ấm.") },
];

// Phòng thử công thức signature: chấm điểm theo các nhóm nguyên liệu
const SIG_BASE = ["phin", "espresso", "tra", "cacao", "matcha", "dau", "dua_tuoi", "rau_ma", "atiso", "dau_nanh", "sen", "bo", "cam"];
const SIG_SWEET = ["sua_dac", "duong", "dua", "sua_chua", "vai", "dao"];
const SIG_TOP = ["foam", "trung", "muoi", "tran_chau", "cacao"];
const SIG_MAX = 3;

// ===================== Câu chuyện riêng của từng chi nhánh =====================
// Chỉ diễn ra khi Uyên đứng quầy ở đúng quán đó. Mỗi cảnh mở khi đủ điều kiện:
// at (số phút chơi thật ở quán), days (số ngày từ khi mở quán), local (số ly món đặc trưng Uyên bán ở quán), rep (uy tín quán).
// who: 0 hoặc 1 là nhân vật của câu chuyện, "uyen" là Uyên. Lựa chọn có hiệu ứng: money, rep, flow, tip (riêng quán).
const CITY_STORIES = {
  hanoi: { title: L("Gánh xôi cuối phố"), icon: "🏮",
    npc: { name: L("Bà Tư bán xôi"), look: { g: "f", age: "old", skin: "#e8b88a", hair: "nonla", hc: "#cfcfcf", shirt: "blouse", sc: "#6d597a", acc: [] } },
    reward: { money: 1500000, flow: 0.1 }, perk: L("+10% khách quán Hà Nội"),
    acts: [
      { at: 80, title: L("Tiếng rao lúc năm giờ sáng"),
        lines: [L("Năm giờ sáng, tiếng rao “Xôi đây...” vang lên đầu ngõ. Bà Tư gánh xôi đã bán ở phố này bốn mươi năm."),
                L("“Ngày xưa bà ngồi trước hiên quán ngoại cháu. Mấy năm nay phố đông xe, người ta đuổi bà đi chỗ khác.”")],
        choice: { q: L("Uyên có muốn mời bà Tư ngồi bán trước hiên quán không?"), a: [
          { label: L("Mời bà ngồi trước hiên mỗi sáng"), reply: L("Bà Tư rưng rưng: “Cháu giống ngoại cháu thật.” Khách mua xôi rồi ghé luôn ly cà phê."), eff: { flow: 0.05, rep: 2 } },
          { label: L("Mời bà ly trà nóng, chỉ đường sang chợ"), reply: L("Bà Tư cảm ơn rồi gánh xôi đi. Uyên thấy lòng hơi chùng xuống."), eff: { money: 0 } } ] } },
      { at: 160, local: 10, title: L("Mùa hoa sữa"),
        lines: [L("Phố cổ vào mùa hoa sữa. Bà Tư kể ngày xưa ông nhà hay mua cốm làng Vòng về pha cà phê cho bà, gọi là “cà phê mùa thu”."),
                L("“Giờ ông đi rồi, bà chẳng còn ai pha cho nữa...”")],
        choice: { q: L("Uyên làm gì cho bà Tư?"), a: [
          { label: L("Pha tặng bà ly cà phê cốm đầu mùa"), reply: L("Bà Tư uống từng ngụm nhỏ, mắt đỏ hoe: “Đúng vị ông pha ngày xưa.”"), eff: { rep: 4 } },
          { label: L("Ghi công thức “cà phê mùa thu” lên bảng thực đơn"), reply: L("Khách phố cổ tò mò gọi thử. Bà Tư cười móm mém khoe với cả ngõ."), eff: { tip: 0.05 } } ] } },
      { at: 240, rep: 60, title: L("Gánh xôi ở lại"),
        lines: [L("Phường mở đợt dẹp hàng rong. Bà Tư sợ mất chỗ bán cuối cùng."),
                L("Khách quen của quán ký tên kín cả trang giấy: “Gánh xôi bà Tư là một phần của phố cổ.” Phường đồng ý cho bà bán cố định trước hiên quán.")] },
    ] },
  saigon: { title: L("Sài Gòn Bạc Xỉu & Nhịp Sống Đêm"), icon: "🌆", theme: L("Sự năng động, lòng bao dung và những cuộc gặp gỡ tình cờ"),
    drinks: ["bac_xiu", "tra_tac", "rau_ma_dx"],
    npcs: [{ name: L("Cô Tám tạp hóa"), look: { g: "f", age: "mid", skin: "#e0ac69", hair: "bun", hc: "#2b1b12", shirt: "blouse", sc: "#ff99c8", acc: ["earrings"] } },
           { name: L("Phát ôm đàn"), look: { g: "m", age: "young", skin: "#d9a066", hair: "curly", hc: "#1a1a1a", shirt: "tee", sc: "#2b2d42", acc: ["headphones"] } }],
    parts: [L("Mở Cửa Giữa Dòng Người Nối Đuôi"), L("Tiếng Nhạc Cầm Chừng Chiều Mưa"), L("Nhịp Sống Hối Hả Xâm Lấn"), L("Đèn Vàng Không Bao Giờ Tắt")],
    reward: { money: 2500000, flow: 0.12 }, perk: L("+12% khách quán Sài Gòn"),
    scenes: [
      { part: 0, at: 0, who: "uyen", title: L("Tầng hai chung cư cũ"),
        lines: [L("Chi nhánh Sài Gòn nằm trên tầng hai một chung cư cũ ở Quận 1. Cầu thang hẹp, tường bong vữa, nhưng ban công nhìn thẳng xuống dòng xe không bao giờ ngớt."),
                L("Khách đầu tiên là những người trẻ bận rộn: sinh viên thức muộn ôn thi, y tá vừa tan ca đêm, anh tài xế công nghệ tranh thủ chợp mắt.")] },
      { part: 0, at: 30, who: 0, title: L("Ly bạc xỉu của cô Tám"),
        lines: [L("Cô Tám bán tạp hóa dưới tầng trệt lên uống thử, nhăn mặt: “Bạc xỉu con pha ngon, mà chưa ra chất Sài Gòn xưa. Hồi đó tụi cô uống cà phê vợt, đậm mà thơm.”")],
        choice: { q: L("Uyên đáp lời cô Tám thế nào?"), a: [
          { label: L("Nhờ cô dạy cách pha cà phê vợt"), reply: L("Cô Tám lôi ra cái vợt vải đã ngả màu: “Nè, phải trụng nước sôi ba lần.” Ly cà phê vợt đầu tiên làm cả tầng hai thơm lừng."), eff: { tip: 0.04 } },
          { label: L("Giữ cà phê phin, mở cửa tới khuya cho người làm đêm"), reply: L("Cô Tám gật gù: “Ừ, Sài Gòn đêm cũng cần chỗ để về.” Khách ca đêm bắt đầu ghé đông."), eff: { flow: 0.04 } } ] } },
      { part: 1, at: 60, who: 1, title: L("Ban công trú mưa"),
        lines: [L("Cơn mưa chiều ập xuống bất chợt. Ban công nhỏ của quán thành chỗ trú mưa của cả chục người lạ."),
                L("Một chàng trai tên Phát ôm cây đàn ướt sũng, ngồi lặng lẽ dạo vài hợp âm. Tiếng đàn cầm chừng hòa với tiếng mưa rơi trên mái tôn.")] },
      { part: 1, at: 90, local: 10, who: "uyen", title: L("Góc Trút Bỏ Nỗi Buồn"),
        lines: [L("Uyên dựng một tấm bảng gỗ ở góc ban công: “Góc Trút Bỏ Nỗi Buồn”. Ai có tâm sự cứ viết lên mẩu giấy, quán sẽ pha một ly hợp tâm trạng."),
                L("Mẩu giấy đầu tiên viết: “Mình vừa trượt phỏng vấn lần thứ năm.”")],
        choice: { q: L("Uyên trả lời những mẩu giấy thế nào?"), a: [
          { label: L("Để mọi tâm sự ẩn danh, chỉ pha ly nước đáp lại"), reply: L("Những mẩu giấy dày dần. Không ai biết ai, nhưng ai cũng thấy nhẹ lòng."), eff: { rep: 5 } },
          { label: L("Viết thư tay trả lời từng mẩu giấy"), reply: L("Sáng hôm sau, mẩu giấy “trượt phỏng vấn” có thêm dòng chữ: “Lần thứ sáu mình đậu rồi! Cảm ơn quán.”"), eff: { tip: 0.05 } } ] } },
      { part: 2, at: 120, who: 0, title: L("Tờ thông báo ở cầu thang"),
        lines: [L("Một tờ thông báo dán ở chân cầu thang: chung cư sẽ bị giải tỏa để xây trung tâm thương mại."),
                L("Cô Tám ngồi thừ trước tiệm tạp hóa: “Cô sống ở đây bốn mươi năm. Đi đâu bây giờ con...”")] },
      { part: 2, at: 150, who: 1, title: L("Đêm nhạc không cắm loa"),
        lines: [L("Phát đề nghị: “Mình làm một đêm nhạc unplugged đi chị. Không loa, không đèn sân khấu, chỉ có đàn và giọng hát. Vừa gây quỹ cho cư dân, vừa quay lại những thước phim cuối cùng của chung cư.”")],
        choice: { q: L("Uyên tổ chức đêm nhạc thế nào?"), a: [
          { label: L("Mở quán miễn phí, ai đến cũng có ly bạc xỉu"), reply: L("Cả chung cư rủ nhau lên tầng hai. Người ngồi kín cầu thang, trẻ con ngồi trên vai bố."), eff: { rep: 6, money: -400000 } },
          { label: L("Bán vé ủng hộ, toàn bộ tiền gửi cư dân"), reply: L("Vé bán hết trong một buổi chiều. Quỹ cư dân đủ thuê luật sư lên tiếng giữ chung cư."), eff: { money: 600000, rep: 2 } } ] } },
      { part: 3, at: 180, who: 1, title: L("Những thước phim cuối cùng"),
        lines: [L("Đêm nhạc diễn ra dưới ánh đèn vàng. Phát hát những bài về Sài Gòn, cả chung cư hát theo."),
                L("Đoạn phim quay đêm đó lan khắp mạng: “Chung cư cũ có một quán cà phê không bao giờ tắt đèn.”")] },
      { part: 3, at: 210, rep: 60, who: 0, title: L("Tin vui từ phường"),
        lines: [L("Phường thông báo: chung cư được giữ lại như một công trình kiến trúc cần bảo tồn. Việc giải tỏa tạm hoãn."),
                L("Cô Tám ôm chầm lấy Uyên: “Con ơi, cô ở lại được rồi!”")],
        choice: { q: L("Uyên muốn quán Sài Gòn từ nay thế nào?"), a: [
          { label: L("Mở cửa muộn, làm chỗ dừng chân cho người làm đêm"), reply: L("Bảng giờ mở cửa mới: “Từ chiều tới khi người cuối cùng về nhà.”"), eff: { flow: 0.05 } },
          { label: L("Giữ “Góc Trút Bỏ Nỗi Buồn” mãi mãi"), reply: L("Tấm bảng gỗ được đóng đinh chắc vào tường, cạnh tấm ảnh đêm nhạc."), eff: { rep: 4 } } ] } },
      { part: 3, at: 240, who: "uyen", title: L("Đèn vàng không bao giờ tắt"),
        lines: [L("Uyên treo một bóng đèn vàng ở ban công. Nó sáng mỗi đêm, như lời hẹn với những ai còn đang trên đường."),
                L("Dù Sài Gòn hối hả đến đâu, vẫn có một khoảng không ấm áp trên tầng hai chung cư cũ, vỗ về những tâm hồn mệt mỏi sau ngày dài bôn ba.")] },
    ] },
  dalat: { title: L("Sương Mù & Tách Trà Dã Quỳ"), icon: "🌲", theme: L("Chữa lành, sự riêng tư và tình yêu thiên nhiên"),
    drinks: ["tra_atiso", "sua_dau_nanh", "ca_cao_nong"],
    npcs: [{ name: L("Chị Hạnh nhặt lá thông"), look: { g: "f", age: "mid", skin: "#e6b98f", hair: "beanie", hc: "#3d2314", shirt: "flannel", sc: "#588157", acc: ["scarf"] } },
           { name: L("Bà Lan Hương"), look: { g: "f", age: "old", skin: "#f3cfa8", hair: "bob", hc: "#e0e0e0", shirt: "blouse", sc: "#b5838d", acc: ["scarf", "glasses"] } }],
    parts: [L("Căn Nhà Gỗ Trên Triền Dốc"), L("Sưu Tầm Hương Vị Thảo Mộc"), L("Vệt Sương Khói Lạnh Cùng Nỗi Cô Đơn"), L("Bình Minh Qua Rừng Thông")],
    reward: { money: 2500000, tip: 0.1 }, perk: L("+10% tip quán Đà Lạt"),
    scenes: [
      { part: 0, at: 0, who: "uyen", title: L("Góc hiên giữa rừng thông"),
        lines: [L("Chi nhánh Đà Lạt là một căn nhà gỗ nhỏ ẩn mình trên triền dốc, giữa rừng thông bạt ngàn. Sáng sớm, sương phủ kín hiên."),
                L("Khách tìm tới đây không vội. Họ trốn khói bụi thành thị, chỉ cần một ly ấm và sự tĩnh lặng.")] },
      { part: 0, at: 30, who: 0, title: L("Vị khách không gọi món"),
        lines: [L("Có một vị khách ngồi ở hiên từ sáng tới chiều, chỉ nhìn sương trôi qua rừng thông, không gọi gì."),
                L("Chị Hạnh, người nhặt lá thông thuê, thì thầm: “Người thành phố lên đây để thở đó em.”")],
        choice: { q: L("Uyên làm gì?"), a: [
          { label: L("Lặng lẽ mang ra một ly trà ấm, không lấy tiền"), reply: L("Vị khách cầm ly trà, khẽ cúi đầu cảm ơn. Chiều về, anh để lại mẩu giấy: “Lâu lắm rồi tôi mới thấy yên.”"), eff: { rep: 4 } },
          { label: L("Dựng “góc tĩnh lặng” không wifi, không nhạc"), reply: L("Góc tĩnh lặng luôn kín chỗ. Người ta tắt điện thoại, nghe tiếng thông reo."), eff: { tip: 0.04 } } ] } },
      { part: 1, at: 60, who: "uyen", title: L("Tay lấm đất đỏ"),
        lines: [L("Uyên mượn cuốc của chị Hạnh, tự tay trồng một luống atiso và thảo mộc sau nhà. Chiều chiều đi hái dã quỳ vàng rực ven đồi."),
                L("Gian bếp nhỏ treo kín những bó thảo mộc phơi khô, thơm nồng.")] },
      { part: 1, at: 90, local: 10, who: 0, title: L("Tách trà dã quỳ"),
        lines: [L("Từ hoa dã quỳ, atiso và quả rừng, Uyên thử pha những món mới. Chị Hạnh nếm thử từng ly, gật gù.")],
        choice: { q: L("Món nào sẽ thành món đặc trưng của quán?"), a: [
          { label: L("Trà dã quỳ mật ong ấm"), reply: L("Ly trà vàng óng như nắng chiều trên đồi. Khách gọi nó là “tách nắng”."), eff: { tip: 0.05 } },
          { label: L("Cà phê ủ lạnh ướp hương mâm xôi rừng"), reply: L("Cold brew chua nhẹ, thơm rừng, thành món khách trẻ check-in không ngớt."), eff: { flow: 0.05 } } ] } },
      { part: 2, at: 120, who: "uyen", title: L("Đèo sạt lở"),
        lines: [L("Mùa đông năm ấy lạnh và dài bất thường. Mưa dầm làm sạt lở đường đèo, xe khách ngưng chạy."),
                L("Quán vắng hoe. Chỉ có tiếng gió lùa qua khe gỗ và ngọn lửa nhỏ trong lò sưởi.")] },
      { part: 2, at: 150, who: "uyen", title: L("Giữ lửa cho mình"),
        lines: [L("Lần đầu tiên, Uyên thấy cô đơn. Ngày nào cũng chữa lành cho người khác, nhưng ai sẽ vỗ về Uyên?"),
                L("Uyên gọi điện cho ngoại. Ngoại bảo: “Muốn sưởi ấm người khác, con phải giữ lửa cho mình trước đã.”")],
        choice: { q: L("Uyên tự chữa lành thế nào?"), a: [
          { label: L("Tự pha cho mình một ly, ngồi viết nhật ký bên lò sưởi"), reply: L("Uyên viết kín ba trang giấy. Viết xong, lòng nhẹ hẳn. Sáng hôm sau, nắng lên."), eff: { rep: 4 } },
          { label: L("Viết thư tay gửi những vị khách từng ghé quán"), reply: L("Uyên viết hai mươi lá thư, gửi theo chuyến xe đầu tiên khi đèo thông."), eff: { flow: 0.05 } } ] } },
      { part: 3, at: 180, who: 1, title: L("Hộp thư thiếc dưới gác"),
        lines: [L("Dọn gác mái chuẩn bị đón khách lại, Uyên tìm thấy một hộp thiếc đầy thư năm 1968, gửi cho một người tên Lan Hương, chưa lá nào được gửi đi."),
                L("Ít hôm sau, một bà cụ tóc bạc chống gậy bước vào: “Bà là Lan Hương. Người ta bảo quán có những lá thư của bà.” Bà đọc từng lá rất lâu, rồi khẽ ngân bản nhạc người xưa từng hát.")] },
      { part: 3, at: 210, rep: 60, who: 0, title: L("Thư tay quay về"),
        lines: [L("Đèo thông. Bưu điện mang tới cả một túi thư tay — những vị khách cũ gửi về: “Mùa đông này tụi mình lên với quán nhé.”")],
        choice: { q: L("Uyên chuẩn bị đón khách thế nào?"), a: [
          { label: L("Nhóm lửa trại giữa sân, mời mọi người cùng hội ngộ"), reply: L("Đêm ấy lửa trại bập bùng. Người lạ thành người quen, ai cũng kể một câu chuyện."), eff: { rep: 5 } },
          { label: L("Treo những lá thư lên tường thành “bức tường thương nhớ”"), reply: L("Khách mới tới đọc thư của khách cũ, rồi lại viết thư cho người sau."), eff: { tip: 0.04 } } ] } },
      { part: 3, at: 240, who: "uyen", title: L("Bình minh qua rừng thông"),
        lines: [L("Nắng sớm xuyên qua rừng thông, rọi vào hiên gỗ. Căn nhà nhỏ giờ là điểm tựa tinh thần của bao người giữa lòng đại ngàn."),
                L("Uyên hiểu ra: chữa lành không phải là làm cho nỗi buồn biến mất, mà là có một nơi để nỗi buồn được nghỉ ngơi.")] },
    ] },
  hoian: { title: L("Đèn Lồng Rực Rỡ & Trà Mót Thảo Mộc"), icon: "🏮", theme: L("Sự giao thoa văn hóa, hoài cổ và nét dịu dàng mộc mạc"),
    drinks: ["nuoc_mot", "tra_la_dua", "ca_phe_dua"],
    npcs: [{ name: L("Chú Bảy lái đò"), look: { g: "m", age: "old", skin: "#c68642", hair: "cap", hc: "#9e9e9e", shirt: "shirt", sc: "#2a9d8f", acc: ["mustache"] } },
           { name: L("Emma du khách Pháp"), look: { g: "f", age: "young", skin: "#fbe3d2", hair: "long", hc: "#c9873f", shirt: "tee", sc: "#ffafcc", acc: ["sunglasses"] } }],
    parts: [L("Mái Bức Bàn Bên Dòng Sông Hoài"), L("Đêm Rằm Lên Đèn"), L("Mùa Lũ Đột Ngột"), L("Hoa Giấy Nở Lại Sau Mưa")],
    reward: { money: 3000000, flow: 0.1 }, perk: L("+10% khách quán Hội An"),
    scenes: [
      { part: 0, at: 0, who: "uyen", title: L("Ngôi nhà tường vàng"),
        lines: [L("Chi nhánh Hội An nằm trong một ngôi nhà cổ tường vàng, hoa giấy hồng rủ xuống hiên. Cửa bức bàn gỗ mở ra dòng sông Hoài."),
                L("Quán bán trà thảo mộc hương chanh sả, cà phê cốt dừa và những món bánh dân dã.")] },
      { part: 0, at: 30, who: 0, title: L("Mẹt bánh của bà cụ"),
        lines: [L("Chú Bảy lái đò dắt một bà cụ tới: “Bà làm bánh ít lá gai ngon nhất phố, mà giờ không ai bán giùm.”")],
        choice: { q: L("Uyên giúp bà cụ thế nào?"), a: [
          { label: L("Bày bánh của bà bán cùng trà ở quán"), reply: L("Khách gọi trà là gọi luôn đĩa bánh ít. Bà cụ ngày nào cũng ghé, cười móm mém."), eff: { rep: 4 } },
          { label: L("Nhờ bà dạy Uyên làm bánh"), reply: L("Uyên học gói bánh suốt một tuần. Chiếc bánh méo xẹo đầu tiên bà vẫn khen “ngon rồi đó con”."), eff: { tip: 0.04 } } ] } },
      { part: 1, at: 60, who: 1, title: L("Phố tắt đèn"),
        lines: [L("Đêm rằm, phố Hội tắt toàn bộ đèn điện. Quán chỉ còn ánh nến và những chiếc đèn lồng thủ công."),
                L("Emma, cô du khách người Pháp, ngồi nhìn dòng sông lấp lánh: “Ở Lyon quê tôi cũng có lễ hội ánh sáng. Nhưng ở đây ánh sáng... dịu dàng hơn.”")] },
      { part: 1, at: 90, local: 10, who: 1, title: L("Đèn hoa đăng và điều ước"),
        lines: [L("Khách xin được tự tay làm hoa đăng. Mỗi người viết một nguyện ước, kể một câu chuyện từ quê nhà mình.")],
        choice: { q: L("Uyên làm gì cho đêm rằm?"), a: [
          { label: L("Mở lớp làm hoa đăng miễn phí mỗi đêm rằm"), reply: L("Bàn quán kín giấy màu và nến. Emma làm chiếc hoa đăng hình tháp Eiffel, cả quán bật cười."), eff: { flow: 0.05 } },
          { label: L("Đặt một cuốn sổ để khách viết nguyện ước"), reply: L("Cuốn sổ đầy dần những thứ tiếng: tiếng Việt, tiếng Pháp, tiếng Hàn, tiếng Nhật..."), eff: { tip: 0.04 } } ] } },
      { part: 2, at: 120, who: 0, title: L("Nước dâng"),
        lines: [L("Mưa lớn nhiều ngày. Nước sông Hoài dâng cao, tràn vào phố cổ, ngập tới bậc thềm quán."),
                L("Chú Bảy chèo đò len lỏi qua từng con hẻm: “Nhiều nhà kẹt lại, chưa có gì ăn con ơi!”")] },
      { part: 2, at: 150, who: 0, title: L("Trạm tiếp tế nhỏ"),
        lines: [L("Thay vì đóng cửa, Uyên kê hàng lên cao, nhóm bếp. Quán thành trạm tiếp tế nhỏ giữa phố ngập.")],
        choice: { q: L("Uyên giúp hàng xóm thế nào?"), a: [
          { label: L("Đun nước gừng, nấu mì suốt đêm cho người chống lũ"), reply: L("Nồi mì này nối nồi mì khác. Hàng xóm thay nhau tới nhóm lửa phụ Uyên."), eff: { rep: 6, money: -300000 } },
          { label: L("Theo đò chú Bảy chở đồ ăn tới từng nhà"), reply: L("Uyên ướt sũng, tay rét cóng, nhưng nhà nào cũng nhận được một túi đồ ăn ấm."), eff: { rep: 5 } } ] } },
      { part: 3, at: 180, who: "uyen", title: L("Tường vàng phai màu"),
        lines: [L("Nước rút. Bức tường vàng in vệt bùn, bàn ghế phải lau lại từng chiếc. Quán phai màu thời gian, nhưng kiên cường hơn."),
                L("Giàn hoa giấy tưởng đã úng, vài tuần sau lại đâm chồi.")] },
      { part: 3, at: 210, rep: 60, who: 1, title: L("Cuốn sổ lưu niệm"),
        lines: [L("Emma quay lại Hội An cùng gia đình. Cô lật cuốn sổ lưu niệm của quán, giờ đã kín chữ ký và lời cảm ơn của du khách thập phương.")],
        choice: { q: L("Uyên giữ cuốn sổ thế nào?"), a: [
          { label: L("Đặt sổ ở quầy cho mọi người cùng đọc"), reply: L("Người ta đọc lời nhau, cười với nhau dù không chung ngôn ngữ."), eff: { flow: 0.04 } },
          { label: L("Chép những lời hay nhất lên tường vàng"), reply: L("Bức tường giờ có cả chữ Việt, chữ Pháp, chữ Hàn quấn quýt bên giàn hoa giấy."), eff: { rep: 4 } } ] } },
      { part: 3, at: 240, who: 0, title: L("Hoa giấy nở lại sau mưa"),
        lines: [L("Chú Bảy thả một chiếc hoa đăng xuống sông Hoài: “Một cho bà nhà, một cho cái quán nhỏ đã giữ ấm cả xóm.”"),
                L("Giàn hoa giấy trước hiên nở hồng rực, như chưa từng có mùa lũ nào đi qua.")] },
    ] },
  danang: { title: L("Sóng Biển & Ly Matcha Dừa"), icon: "🌊", theme: L("Tinh thần tự do, sự tươi mới và khát vọng vươn xa"),
    drinks: ["nuoc_dua", "dua_dam", "matcha_latte", "ca_phe_muoi"],
    npcs: [{ name: L("Vy chạy bộ"), look: { g: "f", age: "young", skin: "#d9a066", hair: "pony", hc: "#1d1410", shirt: "tank", sc: "#06d6a0", acc: ["headphones"] } },
           { name: L("Chị Sương vợ ngư dân"), look: { g: "f", age: "mid", skin: "#b5774a", hair: "nonla", hc: "#1a1a1a", shirt: "blouse", sc: "#48cae4", acc: [] } }],
    parts: [L("Gió Biển Mỹ Khê"), L("Giao Hưởng Của Biển Và Cà Phê"), L("Thử Thách Mùa Bão Biển"), L("Ánh Bình Minh Trên Biển Đông")],
    reward: { money: 3000000, tip: 0.1 }, perk: L("+10% tip quán Đà Nẵng"),
    scenes: [
      { part: 0, at: 0, who: "uyen", title: L("Không gian mở ven biển"),
        lines: [L("Chi nhánh Đà Nẵng nằm sát bờ biển Mỹ Khê. Không vách ngăn, chỉ có gió biển, nắng sớm và tiếng sóng."),
                L("Khách là những người yêu vận động: người chạy bộ buổi sáng, dân lướt sóng, du khách trẻ mang ba lô.")] },
      { part: 0, at: 30, who: 0, title: L("Câu lạc bộ chạy bộ"),
        lines: [L("Vy, trưởng nhóm chạy bộ năm giờ sáng, hỏi: “Tụi em lấy quán làm điểm tập kết được không chị? Chạy xong ai cũng khát khô.”")],
        choice: { q: L("Uyên trả lời Vy thế nào?"), a: [
          { label: L("Tặng mỗi người một ly nước dừa sau buổi chạy"), reply: L("Sáng nào cũng có ba chục người ùa vào quán, mồ hôi nhễ nhại, cười nói rộn ràng."), eff: { flow: 0.05 } },
          { label: L("Mở cửa từ năm giờ sáng đón nhóm chạy"), reply: L("Ánh đèn quán là thứ đầu tiên nhóm chạy thấy mỗi sớm. Họ gọi quán là “vạch đích”."), eff: { rep: 4 } } ] } },
      { part: 1, at: 60, who: "uyen", title: L("Menu nhiệt đới"),
        lines: [L("Uyên tận dụng đặc sản biển: muối biển rang cho ly cà phê muối, dừa nướng than cho ly matcha dừa thơm lừng."),
                L("Quán thành trạm nạp năng lượng của dân lướt sóng sau những giờ ngâm mình giữa biển.")] },
      { part: 1, at: 90, local: 10, who: 0, title: L("Biển cần được giữ sạch"),
        lines: [L("Vy dẫn nhóm chạy đi nhặt rác dọc bờ biển mỗi chủ nhật. Túi rác nào cũng đầy chai nhựa.")],
        choice: { q: L("Quán góp sức thế nào?"), a: [
          { label: L("Giảm giá cho ai mang theo ly cá nhân"), reply: L("Ly nhựa trong quán giảm hẳn. Khách mang theo đủ kiểu ly, có người mang cả... ống tre."), eff: { rep: 5 } },
          { label: L("Làm vòi tắm nước ngọt miễn phí cho dân lướt sóng"), reply: L("Dân lướt sóng tắm xong là ghé quán. Quán đông vui từ sáng tới chiều."), eff: { flow: 0.05 } } ] } },
      { part: 2, at: 120, who: 1, title: L("Bão miền Trung"),
        lines: [L("Cơn bão lớn đổ bộ miền Trung. Gió giật tung mái che ngoài trời của quán, cát bay mù mịt."),
                L("Chị Sương, vợ một ngư dân, chạy tới: “Tàu nhà chị chưa về em ơi...”")] },
      { part: 2, at: 150, who: 1, title: L("Chằng chống và chờ đợi"),
        lines: [L("Uyên cùng người dân chằng chống nhà cửa. Hàng mầm phi lao Uyên vừa gieo xuống lớp cát mặn trước quán đang bị gió quật rạp.")],
        choice: { q: L("Uyên ưu tiên điều gì?"), a: [
          { label: L("Mở quán suốt đêm cho các gia đình ngư dân chờ tin"), reply: L("Uyên pha từng bình ca cao nóng. Không ai phải chờ một mình. Rạng sáng, còi tàu vang lên — đoàn tàu về đủ."), eff: { rep: 6, money: -200000 } },
          { label: L("Lấy bao cát che chắn hàng mầm phi lao"), reply: L("Tay Uyên rát cát, nhưng hàng mầm non vẫn còn đứng đó sau đêm bão."), eff: { rep: 4 } } ] } },
      { part: 3, at: 180, who: "uyen", title: L("Trời trong sau bão"),
        lines: [L("Sau bão, bầu trời trong vắt. Biển lặng như chưa từng nổi giận."),
                L("Hàng phi lao non trước quán vẫn đứng vững, xanh mướt dưới nắng mới.")] },
      { part: 3, at: 210, rep: 60, who: 1, title: L("Chiếc phao cứu sinh"),
        lines: [L("Chị Sương mang tới quán chiếc phao cứu sinh cũ của chồng: “Treo ở quán đi em. Để ai cũng nhớ có một nơi chờ mình trở về.”")],
        choice: { q: L("Uyên treo chiếc phao ở đâu?"), a: [
          { label: L("Ngay cửa ra vào, nơi ai cũng nhìn thấy"), reply: L("Chiếc phao đỏ thành biểu tượng của quán. Ngư dân đi ngang đều giơ tay chào."), eff: { rep: 4 } },
          { label: L("Trên bức tường hướng ra biển, kèm lời chúc bình an"), reply: L("Mỗi sáng, ánh bình minh đầu tiên rọi đúng vào chiếc phao và dòng chữ “Bình an trở về”."), eff: { tip: 0.04 } } ] } },
      { part: 3, at: 240, who: "uyen", title: L("Ánh bình minh trên Biển Đông"),
        lines: [L("Mỗi sáng, quán đứng vững như một ngọn hải đăng nhỏ, đón ánh mặt trời đầu tiên của Biển Đông."),
                L("Gió biển vẫn thổi, sóng vẫn vỗ. Và quán nhỏ vẫn ở đó, lạc quan và bền bỉ như những con người nơi đây.")] },
    ] },
  hue: { title: L("Mưa Cố Đô & Trà Cung Đình"), icon: "🏰", theme: L("Sự trầm mặc, chiều sâu tâm hồn và nét tinh tế hoài cổ"),
    drinks: ["tra_cung_dinh", "ca_phe_muoi", "sua_sen"],
    npcs: [{ name: L("Ông Khải giữ nhà vườn"), look: { g: "m", age: "old", skin: "#eab991", hair: "bald", hc: "#e0e0e0", shirt: "aodai", sc: "#5e548e", acc: ["glasses", "beard"] } },
           { name: L("Mệ Thu"), look: { g: "f", age: "old", skin: "#f0c29b", hair: "bun", hc: "#d6d6d6", shirt: "aodai", sc: "#9b5de5", acc: [] } }],
    parts: [L("Nhịp Bước Chậm Bên Sông Hương"), L("Tiếng Mưa Dầm Khắc Khoải"), L("Bí Mật Trong Khúc Nhạc Cũ"), L("Chiều Tím Mộng Mơ")],
    reward: { money: 3500000, flow: 0.1 }, perk: L("+10% khách quán Huế"),
    scenes: [
      { part: 0, at: 0, who: 0, title: L("Khuôn viên nhà vườn"),
        lines: [L("Chi nhánh Huế nằm trong một khuôn viên nhà vườn rợp bóng cây thanh trà. Ông Khải, người giữ nhà vườn, dẫn Uyên đi một vòng: “Nhà rường này trăm năm rồi con.”"),
                L("Thực đơn tập trung vào trà cung đình ướp sen, cà phê muối nguyên bản và đĩa mứt gừng.")] },
      { part: 0, at: 30, who: 0, title: L("Lề lối nhà vườn"),
        lines: [L("Ông Khải dặn: “Ở nhà vườn, người ta nói khẽ, đi chậm. Uống trà là để nghe mình thở.”")],
        choice: { q: L("Uyên giữ không khí nhà vườn thế nào?"), a: [
          { label: L("Tắt nhạc buổi sáng, chỉ để tiếng chim và tiếng lá"), reply: L("Khách nói chuyện nhỏ nhẹ hẳn. Ông Khải gật đầu hài lòng."), eff: { rep: 4 } },
          { label: L("Pha trà theo lễ cũ, kể chuyện từng ấm trà"), reply: L("Mỗi ấm trà đi kèm một câu chuyện cung đình. Khách nghe say sưa, quên cả giờ về."), eff: { tip: 0.04 } } ] } },
      { part: 1, at: 60, who: 1, title: L("Mưa dầm"),
        lines: [L("Mùa mưa dầm về, mưa cả tuần không dứt. Những vị khách tới quán mang theo nhiều tâm sự ngổn ngang."),
                L("Mệ Thu, bà cụ hàng xóm, ngồi bên hiên nhìn mưa: “Mưa Huế dai lắm con. Mưa như nỗi nhớ.”")] },
      { part: 1, at: 90, local: 10, who: "uyen", title: L("Vị mặn của muối"),
        lines: [L("Một cô gái ngồi khóc lặng lẽ ở góc quán. Uyên pha cho cô một ly cà phê muối: vị đắng của cà phê, vị mặn của muối, vị béo của kem."),
                L("“Uống đi em. Đắng với mặn rồi sẽ thành ngọt.”")],
        choice: { q: L("Uyên học được gì từ những ngày mưa?"), a: [
          { label: L("Biến mỗi nỗi buồn thành một công thức pha chế"), reply: L("Uyên ghi vào sổ: “Vị mặn để trung hòa nước mắt.” Khách tìm tới quán mỗi khi lòng nặng trĩu."), eff: { tip: 0.05 } },
          { label: L("Mời khách ngồi lại, cùng nghe mưa"), reply: L("Không ai nói gì, chỉ có tiếng mưa trên mái ngói. Vậy mà ai cũng thấy được an ủi."), eff: { rep: 5 } } ] } },
      { part: 2, at: 120, who: 0, title: L("Hộp gỗ trên xà nhà"),
        lines: [L("Ông Khải trèo thang lấy xuống một hộp gỗ cũ giấu trên xà nhà. Bên trong là những đĩa than nhạc Trịnh và nhạc dạ cổ, cùng chiếc máy hát cũ."),
                L("“Của ông cố để lại. Nhà không ai nghe nữa, ông cất lâu rồi.”")] },
      { part: 2, at: 150, who: 1, title: L("Góc đĩa than"),
        lines: [L("Uyên lau chiếc máy hát, đặt nó ở góc quán. Tiếng nhạc lạo xạo vang lên, Mệ Thu bật khóc: “Bài này ông nhà hát cho mệ nghe hồi mới cưới.”")],
        choice: { q: L("Uyên dùng góc đĩa than thế nào?"), a: [
          { label: L("Mời ông bà, cha mẹ, con cháu cùng tới nghe nhạc"), reply: L("Chiều thứ bảy, ông cháu ngồi cạnh nhau nghe đĩa than. Người già kể chuyện, người trẻ lắng nghe."), eff: { rep: 5 } },
          { label: L("Cho khách tự chọn đĩa, mỗi người một bài kỷ niệm"), reply: L("Mỗi chiếc đĩa gắn một câu chuyện. Uyên ghi lại tất cả vào sổ tay."), eff: { tip: 0.04 } } ] } },
      { part: 3, at: 180, who: 0, title: L("Chiều tím"),
        lines: [L("Mưa tạnh. Chiều tím buông trên sông Hương, mặt nước lặng như gương."),
                L("Cậu cháu nội ông Khải tới quán, ngồi nghe đĩa than rất lâu, rồi nói: “Ông ơi, con không bán nhà vườn nữa.”")] },
      { part: 3, at: 210, rep: 60, who: 1, title: L("Chốn dừng chân thanh tịnh"),
        lines: [L("Mệ Thu tặng Uyên một chiếc nón bài thơ: “Đội nón này đi qua cầu Trường Tiền, con sẽ thấy Huế thương con.”")],
        choice: { q: L("Uyên muốn quán Huế mãi là gì?"), a: [
          { label: L("Chốn dừng chân thanh tịnh nhất của cả chuỗi"), reply: L("Quán giữ nguyên sự chậm rãi. Ai mệt mỏi cũng có thể ghé, ngồi yên mà không bị làm phiền."), eff: { rep: 4 } },
          { label: L("Nơi giữ gìn những câu chuyện của Cố đô"), reply: L("Góc đĩa than, ấm trà cung đình, chiếc nón bài thơ... tất cả được giữ cẩn thận như một bảo tàng nhỏ."), eff: { flow: 0.05 } } ] } },
      { part: 3, at: 240, who: "uyen", title: L("Chiều tím mộng mơ"),
        lines: [L("Mọi ồn ào, ưu phiền của khách đều tan theo dòng Hương Giang."),
                L("Uyên ngồi bên hiên nhà vườn, nghĩ về sáu chi nhánh, sáu thành phố, sáu câu chuyện. Hành trình của Cửa hàng nhỏ của Uyên đã trọn vẹn — và vẫn sẽ còn tiếp tục, mỗi sáng mở cửa.")] },
    ] },
};
