// ===== Tâm sự với khách ruột, kỷ vật và sổ sưu tập =====

// Lời đáp của Uyên sau mỗi đoạn tâm sự (3 đoạn / khách): [câu của Uyên, điểm thân thiết, khách đáp lại]
const STORY_REPLIES = {
  minh: [
    [["Chị đồng ý! Làm xong nhớ dạy chị dùng nha.", 6, "Dạ! Em sẽ làm giao diện thật dễ thương cho chị."], ["App gọi món có pha được cà phê không em?", 2, "Haha chưa, nhưng nó giúp chị đỡ chạy tới chạy lui."], ["Lo học trước đã em.", -2, "Dạ... em vẫn học mà chị."]],
    [["Chị tự hào về em lắm! Tiền này em giữ mà mua laptop mới.", 6, "Chị cứ nhận đi, laptop em vẫn chạy tốt... dù hơi nóng."], ["Giải nhì là giỏi rồi, lần sau giải nhất nhé!", 4, "Dạ, em sẽ quay lại phục thù!"], ["Thế còn deadline môn học thì sao?", -1, "Ơ... chị đừng nhắc..."]],
    [["Văn phòng thứ hai lúc nào cũng mở cửa đón em.", 6, "Em biết mà. Em có món quà muốn tặng chị..."], ["Lương cao rồi nhớ bao chị ly cà phê nha!", 4, "Ly nào cũng do chị pha, em bao kiểu gì đây haha."], ["Đi làm rồi chắc ít ghé thôi.", -2, "Không đâu chị, em hứa mà."]],
  ],
  lan: [
    [["Con nhớ chứ! Kẹo lạc cô mua ngon nhất phố.", 6, "Ôi, con còn nhớ thật à? Cô cảm động quá."], ["Thật hả cô? Hồi đó con bé lắm.", 3, "Bé xíu, tóc hai bím, chạy khắp hẻm."], ["Con không nhớ gì hết cô ạ.", -2, "Ừ, trẻ con mau quên mà."]],
    [["Cô viết hay quá, con sẽ cắt bài báo dán lên tường!", 6, "Dán cạnh ảnh ngoại con nhé."], ["Con đâu xứng với tiêu đề đó cô ơi.", 4, "Xứng chứ, con gái khiêm tốn quá."], ["Báo phường ít người đọc lắm cô.", -3, "Ít nhưng mà quý con ạ."]],
    [["Con cảm ơn cô đã giữ giúp bà bao năm.", 6, "Giữ cho con là niềm vui của cô. Còn cái này nữa..."], ["Tối nay con gọi cảm ơn ngoại liền!", 5, "Ừ, bà mừng lắm đấy."], ["Sao giờ cô mới đưa ạ?", -2, "Bà dặn phải đợi con vững vàng đã con ạ."]],
  ],
  tuan: [
    [["Anh là đại sứ thương hiệu của quán em rồi!", 6, "Đại sứ hai bánh, chạy khắp thành phố!"], ["Cảm ơn anh, để em mời anh ly sữa đá.", 5, "Thế thì anh không từ chối đâu."], ["Dán vậy có bị phạt không anh?", 0, "Yên tâm, anh dán đúng chỗ mà."]],
    [["Chúc mừng anh! Xe mới chạy êm ru luôn.", 6, "Em ngồi thử không? Anh chở một vòng hồ."], ["Anh giỏi quá, tự lực cánh sinh.", 5, "Toàn nhờ mấy ly cà phê lấy sức đó."], ["Xe mới nhớ chạy chậm thôi nha anh.", 4, "Ừ, anh hứa. An toàn là trên hết."]],
    [["Em ký liền! Đối tác đầu tiên của anh mà.", 7, "Vậy là mình làm ăn chung rồi nha. Cầm lấy cái này..."], ["Anh làm chủ rồi, nhớ đối xử tốt với shipper nha.", 5, "Đương nhiên, anh từng chạy mà."], ["Giá hữu nghị là bao nhiêu anh?", 1, "Haha, rẻ nhất thành phố!"]],
  ],
  mai: [
    [["Quán mình sao? Mai cho Uyên đọc trước được không?", 6, "Được, nhưng phải góp ý thật lòng đó."], ["Nhớ viết nhân vật chủ quán xinh đẹp nha!", 4, "Haha, xinh và hơi tự tin."], ["Viết truyện có kiếm được tiền không?", -2, "Chưa... nhưng mình vẫn viết."]],
    [["Được chứ! Uyên vinh dự lắm.", 7, "Cảm ơn Uyên, mình sẽ ghi lời cảm ơn ở trang đầu."], ["Đặt vậy người ta tưởng sách dạy kinh doanh mất.", 3, "Haha, thì có chương kinh doanh mà."], ["Phải trả bản quyền tên quán nha!", 2, "Trả bằng một trăm ly cà phê được không?"]],
    [["Uyên sẽ chuẩn bị bánh và trà cho độc giả!", 6, "Uyên là nhất. Mình có cái này tặng Uyên..."], ["Mai nhớ ký tặng Uyên cuốn đầu tiên nhé.", 5, "Cuốn đầu tiên vốn dành cho Uyên rồi."], ["Đông người quá quán không đủ chỗ đâu.", 0, "Thì mình đứng ký ngoài hẻm cũng được."]],
  ],
  ongba: [
    [["Ngoại đẹp quá ông ơi! Cháu sẽ gửi ảnh về quê cho bà xem.", 7, "Ừ, bà xem chắc cười mắng ông giữ ảnh lâu thế."], ["Cháu có giống ngoại không ông?", 5, "Giống lắm, nhất là đôi mắt."], ["Ảnh cũ quá, mờ hết rồi ông.", -2, "Mờ ảnh chứ không mờ ký ức đâu cháu."]],
    [["Cháu sẽ dành góc đẹp nhất cho các ông.", 6, "Tốt lắm. Các ông hát to, cháu đừng ngại nhé."], ["Các ông kể chuyện xưa cho cháu nghe với.", 6, "Được, chuyện ba ngày ba đêm chưa hết."], ["Họp có ồn lắm không ông?", 0, "Ồn tí thôi, vui mà."]],
    [["Cháu hứa sẽ mang hồn quán đi thật xa.", 7, "Ông tin cháu. Cầm lấy cái này, ông giữ nó cả đời..."], ["Ông phải sống thật lâu uống cà phê cháu pha.", 6, "Ừ, ông cố. Một trăm tuổi nhé."], ["Ông đừng nói chuyện buồn.", 3, "Không buồn đâu cháu, đời mà."]],
  ],
  khoa: [
    [["Cảm ơn anh, em sẽ giao đúng giờ!", 6, "Anh biết em đúng hẹn mà."], ["Họp thứ sáu có bánh không anh?", 2, "Có, anh đặt thêm bánh mì luôn."], ["Đặt nhiều không anh, em sợ làm không kịp.", 1, "Hai mươi ly thôi."]],
    [["Chúc mừng anh! Anh xứng đáng lắm.", 6, "Cảm ơn em. Mà đừng gọi giám đốc, ngại lắm."], ["Lên chức rồi nhớ nghỉ ngơi nhiều hơn nha anh.", 7, "Em là người đầu tiên nói câu đó với anh..."], ["Vậy giờ anh bao cả quán đi.", 3, "Được, hôm nay anh bao!"]],
    [["Anh là quý nhân của em đó!", 6, "Quý nhân gì, anh chỉ trả ơn mấy ly bạc xỉu thôi. Giữ cái này nhé..."], ["Em cảm ơn, nhưng anh đừng để mình mệt quá nhé.", 6, "Anh học được cách nghỉ rồi. Nhờ em đó."], ["Rẻ hơn bao nhiêu anh?", 2, "Đủ để em thuê thêm một nhân viên."]],
  ],
  linh: [
    [["Linh giỏi quá! Chị chuẩn bị tinh thần đón khách đây.", 6, "Chị nhớ cười thật tươi lúc khách tới nha!"], ["Chị lên hình có xinh không em?", 4, "Xinh xỉu chị ơi!"], ["Đông quá chị làm không kịp đâu.", 0, "Thuê thêm người đi chị!"]],
    [["Quay ở quán chị thoải mái nhé!", 6, "Chị là chị gái quốc dân luôn."], ["Có kịch bản chưa em?", 4, "Chị chỉ cần làm như mọi ngày thôi."], ["Tiền tài trợ chia sao em?", 1, "Haha, chị lo xa ghê."]],
    [["Chị tin em từ ly trà đào đầu tiên.", 7, "Em nhớ mà. Em tặng chị cái này..."], ["Giờ em là người nổi tiếng rồi!", 4, "Nổi tiếng mấy em vẫn là Linh của quán chị."], ["Đừng quên quán chị nha.", 5, "Làm sao quên được chị!"]],
  ],
  cuhoa: [
    [["Cháu sẽ nhớ: nhẹ tay như đi quân sĩ.", 6, "Đúng rồi, học nhanh lắm."], ["Cụ dạy cháu thêm nước cờ nữa đi.", 5, "Từ từ, ăn chắc mặc bền."], ["Máy đánh trứng làm hết rồi cụ ơi.", -2, "Máy không có tâm, con ạ."]],
    [["Cháu sẽ ghi tên cụ lên thực đơn!", 7, "Hà hà, cụ thành người nổi tiếng rồi."], ["Ngon thật! Sao cụ biết công thức này?", 5, "Bà nhà cụ ngày xưa hay pha thế..."], ["Thêm ca cao có ngọt quá không cụ?", 2, "Thử đi rồi biết."]],
    [["Cháu sẽ lau cúp mỗi sáng cụ ạ.", 6, "Ngoan. Cụ có món quà nữa..."], ["Năm sau cụ thắng tiếp nhé!", 5, "Chắc chắn, đối thủ toàn bọn trẻ."], ["Cúp to thế để đâu bây giờ cụ?", 1, "Để chỗ nào nhiều người thấy ấy."]],
  ],
  hang: [
    [["Đẹp quá em ơi! Chị treo ngay cạnh quầy.", 6, "Chị thích là em vui rồi."], ["Em vẽ chị có đẹp hơn ngoài đời không?", 3, "Ngoài đời đẹp hơn, nhưng tranh giữ được lâu."], ["Em vẽ thiếu cái cây kìa.", 0, "Ơ... để em vẽ thêm."]],
    [["Menu này khách nào cũng chụp hình!", 6, "Em vui ghê, như có triển lãm nhỏ."], ["Chị trả công cho em nhé.", 4, "Thôi chị, mời em ly cà phê trứng là được."], ["Chữ hơi khó đọc em ơi.", -1, "Dạ... em sửa lại."]],
    [["Bố mẹ em tới là điều quý nhất rồi.", 7, "Bố em khóc đó chị. Em muốn tặng chị cái này..."], ["Chị muốn mua bức tranh đó lắm!", 5, "Người ta mua mất rồi, nhưng em vẽ chị bức khác."], ["Bán được bao nhiêu em?", 1, "Đủ mua màu cả năm chị ạ."]],
  ],
  duc: [
    [["Bài này sẽ là nhạc hiệu của quán!", 6, "Nghe sang chưa! Nhạc hiệu luôn."], ["Anh chơi trực tiếp cho em nghe đi.", 6, "Để anh lấy sax ra... đây."], ["Có lời không anh?", 1, "Jazz không cần lời em ạ."]],
    [["Em sẽ pha nó mỗi tối thứ bảy.", 6, "Thứ bảy là đêm jazz mà."], ["Club cũ của anh giờ sao rồi?", 5, "Đóng cửa rồi... nhưng công thức thì sống tiếp ở đây."], ["Nhiều nguyên liệu thế khó nhớ quá.", 1, "Cứ nhớ theo nhịp: một, hai, ba, bốn, năm."]],
    [["Em sẽ sắp xếp sân khấu thật đẹp!", 6, "Giữ hộ anh cái này nhé, nó là bùa may mắn."], ["Anh hát luôn được không?", 3, "Giọng anh thì... thôi để sax hát."], ["Hàng xóm có phàn nàn không anh?", 1, "Mình mời họ tới nghe luôn."]],
  ],
  chithu: [
    [["Quán có hoa của chị là đẹp nhất phố.", 6, "Em khen hoa hay khen chị đấy?"], ["Để em trả tiền hoa nhé chị.", 4, "Thôi, chị tặng mà."], ["Hoa héo thì sao chị?", 0, "Thì chị thay bó mới."]],
    [["Chúc mừng cháu! Chị nuôi con giỏi quá.", 7, "Nó giỏi chứ chị có làm gì đâu."], ["Chị dắt cháu tới quán em khao nhé.", 6, "Ừ, nó thích uống trà đào lắm."], ["Học chuyên vất vả lắm đó chị.", 2, "Chị biết, chị sẽ bớt la nó."]],
    [["Chị vất vả bao năm, giờ được nghỉ chân rồi.", 7, "Ừ... không phải đạp xe nắng mưa nữa. Em giữ cái này nhé."], ["Hàng xóm thật rồi! Sáng nào em cũng mua hoa.", 6, "Chị để dành bó đẹp nhất cho em."], ["Có sạp rồi còn đi xe đạp không chị?", 3, "Vẫn đi, để chở hoa cho em."]],
  ],
  bao: [
    [["Bàn dài là của team em!", 6, "Chị là nhà đầu tư thiên thần đầu tiên rồi đó."], ["Ồn quá chị đuổi đó nha.", 2, "Tụi em sẽ thì thầm ạ."], ["Mỗi người phải gọi một ly đó!", 4, "Chắc chắn, ba ly mỗi người luôn."]],
    [["Chị biết em làm được mà!", 6, "Nhờ câu 'ủ cà phê' của chị đó."], ["Có tiền rồi nhớ ngủ đủ giấc nha.", 7, "Em sẽ ngủ... bảy tiếng. Hứa."], ["Chị được chia cổ phần không?", 2, "Một cổ phần vĩnh viễn trong tim em."]],
    [["Ký! Chị sẽ pha cho cả công ty em.", 6, "Và đây là món quà kỷ niệm..."], ["Em nhớ chăm sóc nhân viên mình nhé.", 6, "Em học từ cách chị đối xử với nhân viên đó."], ["Năm mươi người chị pha không kịp đâu.", 2, "Thì chị thuê thêm pha chế."]],
  ],
  vy: [
    [["Ngon quá! Chị sẽ giới thiệu cho mọi khách.", 6, "Em vui muốn khóc luôn."], ["Bánh này hợp với bạc xỉu lắm.", 5, "Đúng gu em, cặp đôi hoàn hảo!"], ["Hơi ngọt chút em ơi.", 1, "Lần sau em giảm đường."]],
    [["Em làm được rồi kìa, giỏi quá!", 6, "Nhờ lời khuyên bắt đầu nhỏ của chị."], ["Hoa hồng em giữ mà mua lò nướng mới.", 6, "Chị tốt quá, em mua lò thật đó."], ["Ngân hàng biết không em?", 0, "Suỵt... chưa đâu chị."]],
    [["Đối tác nhé! Bánh của em, cà phê của chị.", 7, "Em tặng chị cái này để kỷ niệm..."], ["Khai trương chị sẽ gửi hoa!", 5, "Hoa chị Thu nhé, em nghe tiếng rồi."], ["Nghỉ ngân hàng rồi có tiếc không?", 3, "Không tiếc chút nào chị ạ."]],
  ],
  chusau: [
    [["Con cảm ơn chú, con pha thật nhiều đá cho các chú.", 6, "Tụi nó mê đá lắm đó con."], ["Các chú đông quá ngồi đâu chú?", 3, "Ngồi ghế nhựa lề đường, quen rồi."], ["Các chú có trả tiền không chú?", -1, "Trời, trả đủ chớ con."]],
    [["Chú giỏi ghê, học nhanh hơn con nữa.", 6, "Có con chỉ thì chú mới học được."], ["Tiền đó chú để dành cho cháu đi chú.", 6, "Con có lòng quá... thôi chú nghe con."], ["App có trừ chiết khấu nhiều không chú?", 2, "Cũng đỡ hơn ngồi chờ khách."]],
    [["Con nhận! Con sẽ dạy cháu tận tình.", 7, "Chú cảm ơn con. Chú gửi con kỷ vật này..."], ["Cháu chú có thích cà phê không?", 4, "Mê lắm, sáng nào cũng đòi uống."], ["Học việc có lương không chú?", 1, "Con tính sao cũng được."]],
  ],
  jenny: [
    [["Chị cũng xúc động... cho chị gửi lời chào mẹ em.", 7, "Mẹ em nói cảm ơn chị nhiều lắm."], ["Lần sau mời mẹ em về uống nha.", 6, "Mẹ hứa Tết này sẽ về!"], ["Quán nào chẳng giống quán nào em.", -2, "Không đâu, quán chị đặc biệt mà."]],
    [["Tìm được rồi! Chị mừng cho em quá.", 7, "Cô ấy còn giữ cái ly của bà em nữa."], ["Em hỏi cô ấy về bà em chưa?", 6, "Rồi, bà em hay hát khi pha cà phê."], ["Chợ đông quá chị mệt xỉu.", 1, "Sorry chị, em mời chị ăn chè."]],
    [["Ở lại đi em, Việt Nam luôn chào đón em.", 7, "Em có món quà muốn đưa chị..."], ["Blog nhớ chụp chị đẹp nha.", 4, "Chị lúc nào cũng đẹp mà."], ["Viết tiếng Việt luôn cho chị đọc.", 5, "Em sẽ thử, chị sửa lỗi chính tả nha!"]],
  ],
  phuong: [
    [["Dâu ngọt quá! Uyên pha trà dâu thử nhé.", 6, "Nghe ngon rồi đó!"], ["Phương trồng có cực lắm không?", 6, "Cực mà vui, sáng nào cũng nghe chim hót."], ["Dâu có phun thuốc không Phương?", -1, "Hữu cơ hết đó Uyên."]],
    [["Uyên sẽ ghi 'Dâu vườn Phương' lên menu.", 7, "Trời ơi, Uyên dễ thương quá!"], ["Món này sẽ là đặc sản Đà Lạt của quán!", 6, "Mình vui quá, dâu mình có chỗ đứng rồi."], ["Dâu đắt quá Uyên lời ít lắm.", 0, "Mình bán giá mềm cho Uyên mà."]],
    [["Phương xứng đáng lắm, giỏi quá!", 6, "Cảm ơn Uyên. Đây là quà từ vườn mình..."], ["Uyên ghé vườn chơi được không?", 6, "Lúc nào cũng được, mình hái dâu cùng nhau."], ["Chứng nhận có tốn tiền không?", 1, "Có, nhưng đáng."]],
  ],
  khang: [
    [["Ảnh đẹp quá, em sẽ in ra treo lên tường!", 6, "Phải in khổ lớn mới đã."], ["Anh chụp em hay chụp khói vậy?", 4, "Cả hai. Khói đẹp, người còn đẹp hơn."], ["Em xấu lắm, xóa đi anh.", -1, "Ai bảo vậy, nhìn lại đi."]],
    [["Anh giữ nhuận ảnh đi mà mua phim!", 6, "Em hiểu dân chụp phim quá."], ["Tạp chí nào vậy anh, em mua liền.", 5, "Để anh tặng em một cuốn."], ["Có ghi tên quán không anh?", 3, "Có chứ, in đậm luôn."]],
    [["Cảm ơn anh đã kể câu chuyện của quán em.", 7, "Và đây là thứ anh muốn em giữ..."], ["Anh có buồn khi chụp xong không?", 5, "Không, mỗi tấm ảnh là một lời tạm biệt đẹp."], ["Ảnh bìa là em thật hả?", 3, "Thật, em nổi tiếng rồi."]],
  ],
  bamuoi: [
    [["Con sẽ đeo mỗi sáng, ấm lắm bà ạ.", 7, "Bà đan bằng cả tấm lòng đấy cháu."], ["Màu cà phê sữa dễ thương quá bà.", 5, "Bà chọn mãi mới được màu này."], ["Đà Lạt lạnh thật bà nhỉ.", 2, "Lạnh nên mới cần khăn chứ."]],
    [["Bà là cô giáo của cả phường rồi!", 6, "Già rồi còn có ích, bà vui lắm."], ["Tiền đó bà để dành đi bà.", 6, "Bà đủ rồi, cháu cứ cầm."], ["Bán được nhiều không bà?", 2, "Du khách mua quá trời."]],
    [["Cháu thứ mười một chào cả nhà ạ!", 7, "Hà hà, cả nhà thương cháu lắm. Bà có cái này cho cháu..."], ["Bà vui quá, con cũng vui lây.", 6, "Ừ, hôm nay là ngày đẹp nhất của bà."], ["Đông người quá bà ơi.", 1, "Đông mới vui chứ."]],
  ],
  tom: [
    [["Thank you Tom! Cảm ơn nhiều lắm!", 6, "Không có chi! Tôi nói đúng chưa?"], ["Tom viết bằng tiếng Việt chưa?", 4, "Một câu: 'Ngon quá!'"], ["Năm sao thật hả?", 3, "Sáu sao nếu có!"]],
    [["Chúc tour thành công nha Tom!", 7, "Cảm ơn Uyên! Partnership!"], ["Khách tour có thích nước mót không?", 5, "Họ mê, gọi là 'herbal magic'."], ["Đạp xe mệt không Tom?", 3, "Mệt, nhưng đồng lúa đẹp quá."]],
    [["Chào mừng Tom về nhà!", 7, "Nhà tôi đây rồi. Quà cho Uyên..."], ["Giờ Tom là người Hội An rồi.", 6, "Tôi biết làm cao lầu rồi đó!"], ["Có nhớ nước Úc không?", 3, "Nhớ, nhưng ở đây vui hơn."]],
  ],
  cosau: [
    [["Đẹp quá cô ơi, nhân viên con sẽ mê lắm!", 6, "Mặc vào nhìn chuyên nghiệp hẳn."], ["Con trả tiền vải nhé cô.", 4, "Thôi, cô tặng mà."], ["Màu này hơi chói cô ạ.", -1, "Ừ... để cô sửa."]],
    [["Cô là người quảng cáo giỏi nhất Hội An!", 6, "Haha, cô chỉ nói thật thôi."], ["Con mời cô ly nước mót nhé.", 5, "Ừ, cô thèm từ sáng."], ["Khách nước ngoài có khó tính không cô?", 3, "Không, họ thân thiện lắm."]],
    [["Con sẽ mặc nó hôm khai trương cô ạ!", 7, "Con gái cô cũng giúp may đấy. Còn cái này nữa..."], ["Cô thêu cái phin đẹp quá!", 6, "Mất ba đêm đó con."], ["Áo dài có vừa không cô?", 3, "Cô đo bằng mắt, chuẩn luôn."]],
  ],
  nghia: [
    [["Treo cửa sáng rực luôn, đẹp quá!", 6, "Chị thích là em vui."], ["Em làm mất bao lâu vậy?", 4, "Một tuần, từng nan tre."], ["Có hư khi mưa không em?", 1, "Vải lụa bền lắm chị."]],
    [["Em đang giữ nghề cho cả phố đó!", 7, "Chị nói vậy em có thêm động lực."], ["Chị đăng ký học một buổi!", 6, "Học viên đặc biệt, miễn phí!"], ["Lớp học có ồn không?", 1, "Không, ai cũng chăm chú."]],
    [["Chị tự hào về em lắm!", 7, "Em tặng chị chiếc đèn nhỏ này..."], ["Chiếc lớn nhất là bao lớn?", 3, "To bằng cái quán luôn chị."], ["Treo ở quán có vừa không em?", 2, "Em làm vừa khít mà."]],
  ],
  hai: [
    [["Logo quán trên áo nhặt rác, chị tự hào lắm!", 6, "Tụi em cũng vậy!"], ["Chị tham gia luôn tuần này.", 6, "Tuyệt! Chị mang găng tay nhé."], ["Có bị nắng không em?", 2, "Đi sáng sớm nên mát."]],
    [["Vô địch rồi! Đỉnh quá Hải ơi!", 6, "Sóng hôm đó cao ba mét đó chị."], ["Có nguy hiểm không em?", 4, "Một chút, nhưng em quen rồi."], ["Tiền thưởng nhiều không em?", 1, "Đủ mua ván mới."]],
    [["Chị đứng được cũng nhờ em dạy!", 7, "Chị là học trò giỏi nhất. Em tặng chị cái này..."], ["Chị té bao nhiêu lần trong video vậy?", 5, "Hai mươi ba lần, em đếm rồi."], ["Ngại quá, xóa video đi em!", 1, "Không được, nó viral rồi."]],
  ],
  ngoc: [
    [["Cảm ơn chị, em sẽ đón khách thật chu đáo!", 6, "Chị tin em mà."], ["Khách Hàn thích uống gì chị?", 5, "Cà phê cốt dừa, mê luôn."], ["Đông vậy em làm không kịp.", 0, "Thuê thêm người đi em."]],
    [["Chị là quý nhân của em!", 6, "Quý nhân gì, chị chỉ nói thật."], ["Chị nhớ nghỉ ngơi nha chị.", 6, "Ừ, sắp được đi chơi rồi."], ["Đặt cọc bao nhiêu chị?", 1, "Đủ để em mua thêm máy."]],
    [["Chuyến đi vui không chị? Kể em nghe đi!", 7, "Vui lắm! Đây, quà từ Sa Pa..."], ["Năm sau chị đi đâu?", 5, "Côn Đảo, em đi cùng không?"], ["Sa Pa có lạnh không chị?", 3, "Lạnh run luôn em."]],
  ],
  long: [
    [["Anh là kỹ sư số một!", 6, "Kết cấu giờ chắc chắn rồi."], ["Em mời anh ly bạc xỉu nhé.", 5, "Thế thì anh không từ chối."], ["Kệ có sập nữa không anh?", 2, "Anh bảo hành trọn đời."]],
    [["Con gọi 'ba' rồi à? Em mừng cho anh!", 7, "Anh khóc luôn đó em."], ["Anh ở lại với con lâu hơn nhé.", 6, "Anh xin thêm phép rồi."], ["Công trình có bị chậm không anh?", 1, "Ổn, anh em lo giúp."]],
    [["Hai trăm ly mỗi sáng, em xắn tay áo ngay!", 6, "Anh tặng em cái này, kỷ niệm cây cầu..."], ["Công nhân vất vả, em pha thật đậm nhé.", 6, "Họ sẽ thương em lắm."], ["Nhiều quá em pha sao kịp anh.", 2, "Thuê thêm pha chế đi em."]],
  ],
  thaylam: [
    [["Quán sẽ tắt nhạc để nghe thơ thầy ạ.", 6, "Thơ và cà phê, hợp nhau lắm."], ["Thầy đọc thơ cho em nghe trước nhé.", 6, "Được, bài 'Đây thôn Vĩ Dạ'."], ["Học trò có chịu tới không thầy?", 2, "Có cà phê muối là tới."]],
    [["Thầy dạy giỏi quá, chúc mừng thầy!", 6, "Công của em ấy chứ."], ["Em đọc bài văn đó được không thầy?", 6, "Thầy mang bản in cho em."], ["Quán em được nhắc trong bài à?", 3, "Đoạn hay nhất đó em."]],
    [["Câu thơ ấy em sẽ khắc ghi mãi.", 7, "Còn một món nữa thầy muốn tặng em..."], ["Thầy tự khắc à? Đẹp quá!", 5, "Mất cả tháng đó em."], ["Treo ở cửa có bị mưa không thầy?", 2, "Gỗ mít bền lắm."]],
  ],
  ohien: [
    [["Bí quyết này con giữ kỹ lắm o!", 6, "Ừ, người Huế mới biết thôi."], ["O dạy con nấu chè luôn nha.", 6, "Từ từ, ba mươi sáu món lận."], ["Muối hột có mặn quá không o?", 2, "Vừa đủ thôi con."]],
    [["O cứ giữ phần tiền đó mà o.", 6, "Con có lòng quá. O cảm ơn."], ["Chè o bán chạy hơn cà phê con rồi!", 5, "Haha, hai thứ đi đôi mà."], ["Khách có chê gì không o?", 2, "Không, ai cũng khen."]],
    [["O có mệt không khi khách đông?", 7, "Mệt mà vui con ạ. O có quà nì..."], ["O nổi tiếng khắp nước rồi!", 6, "Rứa là nhờ con."], ["Báo viết đúng không o?", 2, "Đúng hết, cả chuyện o hát."]],
  ],
  nam: [
    [["Giọng em hay quá, chị nổi da gà luôn!", 6, "Chị khen làm em ngượng."], ["Em hát thêm bài nữa đi.", 6, "Bài 'Lý qua đèo' nhé."], ["Ca Huế khó nghe quá em.", -3, "Nghe lâu sẽ thấm chị ạ."]],
    [["Quay thoải mái, chị mời cả ekip!", 6, "Ekip mê cà phê muối của chị."], ["Chị được đóng vai không?", 5, "Vai chủ quán, đúng vai luôn!"], ["MV có làm quán ồn không?", 1, "Tụi em quay sáng sớm."]],
    [["Bài hát về quán chị? Chị khóc mất!", 7, "Đây là bản nhạc viết tay, em tặng chị..."], ["Chị sẽ đóng cửa quán để đi xem em diễn.", 6, "Chị ngồi hàng đầu nhé!"], ["Bài hát có tên chị thật à?", 3, "Thật, cả cái phin nữa."]],
  ],
};

// ---------- Kỷ vật ----------
// from: id khách ruột trao tặng; souvenir: lấy khi uy tín quán thành phố đó đạt 60; start: có sẵn từ đầu
const ITEMS = {
  phin_ngoai:   { name: "Cái phin nhôm của ngoại", icon: "☕", set: "global", start: true, desc: "Chiếc phin ngoại dùng suốt bốn mươi năm, ngoại trao lại trước khi về quê dưỡng già." },
  ban_phim:     { name: "Bàn phím cơ cũ", icon: "⌨️", set: "global", from: "minh", desc: "Chiếc bàn phím Minh gõ những dòng code đầu tiên. Phím Enter đã mòn." },
  but_tim:      { name: "Cây bút mực tím", icon: "🖋️", set: "global", from: "lan", desc: "Cây bút cô Lan chấm bài suốt ba mươi năm đứng lớp." },
  mu_bao_hiem:  { name: "Mũ bảo hiểm cũ", icon: "⛑️", set: "global", from: "tuan", desc: "Chiếc mũ theo Tuấn qua mười nghìn đơn hàng, đầy vết trầy." },
  ban_thao:     { name: "Bản thảo viết tay", icon: "📜", set: "global", from: "mai", desc: "Chương đầu tiên của 'Cửa hàng nhỏ', còn dính vệt cà phê." },
  huy_hieu:     { name: "Huy hiệu đồng đội", icon: "🎖️", set: "global", from: "ongba", desc: "Huy hiệu ông Ba đeo những năm ở tổ thanh niên xung phong cùng ngoại." },
  ca_vat:       { name: "Cà vạt may mắn", icon: "👔", set: "global", from: "khoa", desc: "Chiếc cà vạt anh Khoa đeo trong buổi phỏng vấn đầu tiên." },
  gay_selfie:   { name: "Cây gậy selfie", icon: "🤳", set: "global", from: "linh", desc: "Cây gậy đã quay video triệu view đầu tiên của Linh." },

  quan_tuong:   { name: "Quân Tướng bằng gỗ", icon: "♟️", set: "hanoi", from: "cuhoa", desc: "Quân cờ Cụ Hòa giữ từ ván cờ vô địch đầu tiên." },
  hop_mau:      { name: "Hộp màu nước", icon: "🎨", set: "hanoi", from: "hang", desc: "Hộp màu cũ của Hằng, ô màu nâu cà phê đã dùng gần hết." },
  dam_ken:      { name: "Dăm kèn saxophone", icon: "🎷", set: "hanoi", from: "duc", desc: "Chiếc dăm kèn Đức thổi trong đêm diễn đầu tiên ở phố Tạ Hiện." },
  non_hoa:      { name: "Nón lá thêu hoa", icon: "👒", set: "hanoi", from: "chithu", desc: "Chiếc nón chị Thu đội suốt mười năm rong ruổi bán hoa." },
  rua_ho_guom:  { name: "Tượng rùa Hồ Gươm", icon: "🐢", set: "hanoi", souvenir: "hanoi", desc: "Quà lưu niệm khi quán Hà Nội đạt uy tín 60." },

  ban_pitch:    { name: "Bản pitch đầu tiên", icon: "📈", set: "saigon", from: "bao", desc: "Slide gọi vốn bị từ chối lần đầu, Bảo giữ để nhắc mình đừng bỏ cuộc." },
  khuon_banh:   { name: "Khuôn bánh bông lan", icon: "🧁", set: "saigon", from: "vy", desc: "Chiếc khuôn Vy nướng mẻ bánh đầu tiên lúc nửa đêm." },
  chia_khoa:    { name: "Chìa khóa xe Cub", icon: "🔑", set: "saigon", from: "chusau", desc: "Chìa khóa chiếc Cub chở khách khắp Sài Gòn bốn mươi năm." },
  buu_thiep:    { name: "Bưu thiếp California", icon: "💌", set: "saigon", from: "jenny", desc: "Tấm bưu thiếp mẹ Jenny viết 'Nhớ quê' từ năm 1995." },
  cho_ben_thanh:{ name: "Mô hình chợ Bến Thành", icon: "🏛️", set: "saigon", souvenir: "saigon", desc: "Quà lưu niệm khi quán Sài Gòn đạt uy tín 60." },

  hat_dau:      { name: "Hạt giống dâu tây", icon: "🌱", set: "dalat", from: "phuong", desc: "Gói hạt từ cây dâu đầu tiên Phương trồng ở Đà Lạt." },
  cuon_phim:    { name: "Cuộn phim 35mm", icon: "🎞️", set: "dalat", from: "khang", desc: "Cuộn phim chụp buổi sương sớm đầu tiên ở quán." },
  cuon_len:     { name: "Cuộn len đỏ", icon: "🧶", set: "dalat", from: "bamuoi", desc: "Cuộn len bà Mười giữ từ chiếc áo đầu tiên đan cho chồng." },
  da_quy:       { name: "Hoa dã quỳ ép khô", icon: "🌼", set: "dalat", souvenir: "dalat", desc: "Quà lưu niệm khi quán Đà Lạt đạt uy tín 60." },

  boomerang:    { name: "Boomerang nhỏ", icon: "🪃", set: "hoian", from: "tom", desc: "Món đồ Tom mang theo từ Úc, giờ nó đã có nhà mới." },
  kim_chi:      { name: "Cây kim ba đời", icon: "🪡", set: "hoian", from: "cosau", desc: "Cây kim của tiệm may ba đời, từng may áo cưới cho cả phố." },
  den_long:     { name: "Đèn lồng tí hon", icon: "🏮", set: "hoian", from: "nghia", desc: "Chiếc đèn lồng đầu tiên Nghĩa làm năm mười hai tuổi." },
  hoa_dang:     { name: "Hoa đăng sông Hoài", icon: "🪷", set: "hoian", souvenir: "hoian", desc: "Quà lưu niệm khi quán Hội An đạt uy tín 60." },

  vo_oc:        { name: "Vỏ ốc Mỹ Khê", icon: "🐚", set: "danang", from: "hai", desc: "Vỏ ốc Hải nhặt sau lần đầu Uyên đứng vững trên ván." },
  co_hdv:       { name: "Lá cờ hướng dẫn viên", icon: "🚩", set: "danang", from: "ngoc", desc: "Lá cờ chị Ngọc giơ cao dẫn hơn một nghìn đoàn khách." },
  oc_vit:       { name: "Con ốc cầu Rồng", icon: "🔩", set: "danang", from: "long", desc: "Con ốc dự phòng từ công trình cầu Rồng." },
  cau_rong:     { name: "Mô hình cầu Rồng", icon: "🐉", set: "danang", souvenir: "danang", desc: "Quà lưu niệm khi quán Đà Nẵng đạt uy tín 60." },

  tap_tho:      { name: "Tập thơ chép tay", icon: "📖", set: "hue", from: "thaylam", desc: "Tập thơ Thầy Lâm chép từ năm hai mươi tuổi, giấy đã ngả vàng." },
  quang_ganh:   { name: "Đôi quang gánh tre", icon: "🎋", set: "hue", from: "ohien", desc: "Đôi quang gánh o Hiền gánh chè suốt hai mươi năm khắp kiệt Huế." },
  dan_nguyet:   { name: "Cây đàn nguyệt nhỏ", icon: "🪕", set: "hue", from: "nam", desc: "Cây đàn Nam học những nốt đầu tiên của ca Huế." },
  ngo_mon:      { name: "Mô hình Ngọ Môn", icon: "🏯", set: "hue", souvenir: "hue", desc: "Quà lưu niệm khi quán Huế đạt uy tín 60." },
};

// Phần thưởng khi gom đủ một bộ
const ITEM_SETS = {
  global: { name: "Những người bạn khắp nơi", reward: { money: 3000000, flow: 0.05 }, desc: "+3.000.000đ, +5% khách toàn chuỗi" },
  hanoi:  { name: "Hồn phố cổ Hà Nội",        reward: { money: 1500000, tipLoc: "hanoi" },  desc: "+1.500.000đ, quán Hà Nội +10% tip vĩnh viễn" },
  saigon: { name: "Nhịp sống Sài Gòn",        reward: { money: 2000000, tipLoc: "saigon" }, desc: "+2.000.000đ, quán Sài Gòn +10% tip vĩnh viễn" },
  dalat:  { name: "Sương sớm Đà Lạt",         reward: { money: 2000000, tipLoc: "dalat" },  desc: "+2.000.000đ, quán Đà Lạt +10% tip vĩnh viễn" },
  hoian:  { name: "Đèn lồng Hội An",          reward: { money: 2500000, tipLoc: "hoian" },  desc: "+2.500.000đ, quán Hội An +10% tip vĩnh viễn" },
  danang: { name: "Gió biển Đà Nẵng",         reward: { money: 2500000, tipLoc: "danang" }, desc: "+2.500.000đ, quán Đà Nẵng +10% tip vĩnh viễn" },
  hue:    { name: "Mộng mơ xứ Huế",           reward: { money: 3000000, tipLoc: "hue" },    desc: "+3.000.000đ, quán Huế +10% tip vĩnh viễn" },
};
const SET_ORDER = ["global", "hanoi", "saigon", "dalat", "hoian", "danang", "hue"];

// Ngoại ghé thăm khi gom đủ mọi bộ sưu tập
const ENDING = [
  "Uyên ơi! Ngoại đây! Ngoại đi xe khách từ quê lên thăm con đấy.",
  "Mấy người bạn cũ kể với ngoại hết rồi: con mở quán khắp sáu thành phố, ai cũng thương con.",
  "Cái phin nhôm ngày xưa giờ nằm cạnh cả một tủ kỷ vật của bao nhiêu con người...",
  "Ngoại pha cho con một ly nhé. Hôm nay con là khách của ngoại.",
];

// ---------- Tình huống bất ngờ (quick time event) ----------
// taps: số lần bấm cần thiết; time: số giây; move: biểu tượng nhảy chỗ sau mỗi lần bấm
const QTES = {
  generator: { icon: "⚙️", title: "Cúp điện! Quay máy phát điện!", hint: "Bấm liên tục", taps: 12, time: 6, move: false },
  spill:     { icon: "🥤", title: "Khách vấp chân, ly sắp đổ!", hint: "Bấm để đỡ ly", taps: 1, time: 2.2, move: false },
  cat:       { icon: "🐈", title: "Mèo hoang lẻn vào quầy!", hint: "Bấm vào mèo 3 lần", taps: 3, time: 4.5, move: true },
  leak:      { icon: "🪣", title: "Mái dột rồi! Đặt xô hứng nước!", hint: "Bấm nhanh", taps: 1, time: 2.6, move: false },
  wallet:    { icon: "👛", title: "Khách bỏ quên ví!", hint: "Bấm để giữ lại trả khách", taps: 1, time: 3.5, move: false },
  rush:      { icon: "📣", title: "Đoàn khách du lịch tới bất ngờ!", hint: "Bấm 5 lần để sắp xếp bàn ghế", taps: 5, time: 4.5, move: true },
};

// ---------- Nhạc trong quán ----------
const MUSIC_PRESETS = {
  auto:   { name: "Jazz theo thành phố", icon: "🎷", desc: "Tự đổi giọng và nhịp theo từng quán" },
  swing:  { name: "Swing sôi động", icon: "🎺", desc: "Nhanh, vui, hợp giờ cao điểm", tempo: 138, key: 3, style: "swing" },
  bossa:  { name: "Bossa nova Sài Gòn", icon: "🌴", desc: "Nhẹ nhàng, đung đưa", tempo: 118, key: 7, style: "bossa" },
  lofi:   { name: "Lo-fi đêm mưa", icon: "🌧️", desc: "Chậm, ấm, có tiếng đĩa than", tempo: 74, key: 2, style: "lofi" },
  ballad: { name: "Piano ballad", icon: "🎹", desc: "Thư thái, ít trống", tempo: 66, key: 8, style: "ballad" },
};
const YT_SUGGEST = ["vietnamese coffee jazz", "nhạc Trịnh jazz", "lofi hip hop radio", "bossa nova cafe", "jazz piano rainy day", "acoustic cà phê sáng"];

// ===================== Cốt truyện theo chương =====================
const CHAPTERS = [
  { n: 1, icon: "🌿", title: "Mầm Nắng Đầu Tiên", sub: "Hương vị quen thuộc",
    intro: ["Căn nhà cũ cuối phố, góc sân nhỏ phủ đầy lá khô. Uyên lau lại từng chiếc ghế gỗ, kê lại quầy pha chế của ngoại.",
            "Những vị khách đầu tiên trong khu phố ghé qua: bác hàng xóm, cô sinh viên, anh họa sĩ tự do... Menu chỉ có vài món cà phê truyền thống và trà thảo mộc.",
            "Uyên buộc lại tạp dề, hít một hơi thật sâu: “Bắt đầu thôi, Uyên ơi!”"],
    goals: [
      { text: "Phục vụ 40 ly", test: S => S.totals.served >= 40 },
      { text: "Mua máy móc đầu tiên cho quán", test: S => S.shops.some(sh => Object.keys(sh.equip || {}).length > 0) },
      { text: "Làm quen 3 khách ruột", test: S => Object.values(S.chars).filter(c => c.met).length >= 3 },
    ] },
  { n: 2, icon: "🌼", title: "Tiếng Tách Trà Chiều", sub: "Mở lòng & kết nối",
    intro: ["Quán dần thành điểm hẹn thân thuộc. Mỗi vị khách mang theo một câu chuyện: sự mệt mỏi sau giờ làm, nỗi băn khoăn về tương lai, hay nỗi cô đơn giữa thành phố.",
            "Có những người chẳng gọi món, chỉ nói: “Chị chọn giúp em một ly hợp tâm trạng nhé.”",
            "Hãy lắng nghe. Pha đúng ly hợp lòng khách, họ sẽ trải lòng và để lại những mảnh ghép câu chuyện."],
    goals: [
      { text: "Pha 6 ly hợp tâm trạng khách", test: S => S.story.moodMatches >= 6 },
      { text: "Khôi phục 5 trang sổ tay", test: S => Object.keys(S.story.pages).length >= 5 },
      { text: "Một khách ruột đạt 3 tim", test: S => Object.values(S.chars).some(c => c.aff >= 60) },
      { text: "Lắp 2 món trang trí ấm cúng", test: S => S.shops.reduce((a, sh) => a + Object.keys(sh.decor).length, 0) >= 2 },
    ] },
  { n: 3, icon: "🍁", title: "Thử Thách & Bão Rào Ban Đêm", sub: "Giữ vững bình yên",
    intro: ["Đầu phố bỗng rực đèn: một chuỗi cà phê thương mại lớn khai trương, nhạc to, khuyến mãi rầm rộ. Khách quen thưa dần.",
            "Uyên ngồi lặng bên quầy: “Mình có nên thay đổi để chạy theo họ, hay giữ nguyên quán nhỏ bình dị của ngoại?”"],
    goals: [
      { text: "Vượt qua đêm bão", test: S => !!S.story.stormDone },
      { text: "Sáng tạo một món signature", test: S => (S.signatures || []).length >= 1 },
      { text: "Mở sân vườn nhỏ hoặc góc đọc sách", test: S => S.shops.some(sh => sh.decor.san_vuon || sh.decor.goc_sach) },
      { text: "Khôi phục 8 trang sổ tay", test: S => Object.keys(S.story.pages).length >= 8 },
    ] },
  { n: 4, icon: "🌸", title: "Hương Cà Phê Đơm Hoa", sub: "Góc trú ẩn bất tận",
    intro: ["Cuốn sổ tay của ngoại gần như đã trọn vẹn. Chỉ còn trang cuối cùng, trắng tinh.",
            "Ngoại để lại một dòng: “Trang này không phải của ngoại. Nó dành cho người sẽ tiếp tục giữ lửa.”"],
    goals: [
      { text: "Cùng Uyên viết trang cuối của sổ tay", test: S => !!S.story.lastPage },
    ] },
];

// Tâm trạng khách và nhóm vị đồ uống hợp với tâm trạng đó
const MOODS = {
  met:      { name: "Mệt mỏi",   icon: "😮‍💨", feel: "dam",  ask: ["Hôm nay chạy deadline cả ngày, mệt rã rời...", "Tối qua mất ngủ, giờ mắt cứ díp lại."] },
  buon:     { name: "Buồn",      icon: "🥺", feel: "am",   ask: ["Hôm nay có chuyện không vui... mình muốn cái gì đó ấm áp.", "Tự dưng thấy lòng nặng trĩu."] },
  bankhoan: { name: "Băn khoăn", icon: "🤔", feel: "diu",  ask: ["Mình đang phân vân chuyện đổi việc, đầu óc rối bời.", "Nhiều chuyện phải nghĩ quá, cần chút tĩnh lặng."] },
  codon:    { name: "Cô đơn",    icon: "🫥", feel: "am",   ask: ["Mới chuyển lên thành phố, chưa quen ai cả...", "Cuối tuần mà chẳng biết đi đâu."] },
  nong:     { name: "Nóng nực",  icon: "🥵", feel: "mat",  ask: ["Trời nóng như đổ lửa, cần gì đó mát lạnh!", "Đạp xe nãy giờ, khát khô cổ rồi."] },
  vui:      { name: "Vui vẻ",    icon: "🥳", feel: "ngot", ask: ["Mình vừa được tin vui! Muốn ăn mừng bằng gì đó ngọt ngào.", "Hôm nay là sinh nhật mình đó!"] },
};
const FEELS = { dam: "đậm, tỉnh táo", am: "ấm áp, vỗ về", diu: "dịu nhẹ, thư thái", mat: "mát lạnh, sảng khoái", ngot: "ngọt ngào" };
const DRINK_FEEL = {
  den_da: "dam", den_nong: "dam", sua_da: "dam", espresso: "dam", cf_cu_hoa: "dam", cf_com: "dam",
  ca_cao_nong: "am", latte: "am", cappuccino: "am", ca_phe_trung: "am", jazz_latte: "am", sua_dau_nanh: "am",
  tra_sen: "diu", tra_atiso: "diu", tra_dao: "diu", tra_vai: "diu", tra_cung_dinh: "diu", matcha_latte: "diu", tra_la_dua: "diu", nuoc_mot: "diu",
  tra_chanh: "mat", tra_tac: "mat", nuoc_cam: "mat", nuoc_dua: "mat", rau_ma_dx: "mat", sinh_to_bo: "mat", sua_chua_cf: "mat", tra_dau: "mat",
  bac_xiu: "ngot", tra_sua: "ngot", ca_phe_dua: "ngot", ca_phe_muoi: "ngot", sua_sen: "ngot", dua_dam: "ngot", ky_uc: "am",
};

// Sổ tay công thức cũ của ngoại: trang mờ cần mảnh ghép để khôi phục
const NOTEBOOK = [
  { title: "Cà phê phin của ngoại", need: 0, text: "Hai thìa cà phê, chút nước sôi để ủ, chờ ba mươi giây rồi mới chế tiếp. Vội là đắng, chậm là thơm." },
  { title: "Bạc xỉu cho con bé", need: 0, text: "Nhiều sữa, ít cà phê. Ngày Uyên lên năm, con bé uống một ngụm rồi cười tít mắt. Ngoại đặt tên nó là “ly của Uyên”." },
  { title: "Ca cao ngày mưa", need: 0, text: "Mưa là khách ngồi lâu. Pha ca cao thật đặc, để họ cầm ly cho ấm tay mà kể chuyện." },
  { title: "Người khách áo mưa xanh", need: 2, text: "Ông ấy ngày nào cũng gọi đen nóng, không đường. Một hôm ông khóc. Ngoại không hỏi, chỉ thêm một chiếc bánh quy vào đĩa. Hôm sau ông lại tới và cười.", reward: { rep: 3 } },
  { title: "Bí mật của ly hợp lòng", need: 3, text: "Người mệt cần đậm. Người buồn cần ấm. Người rối cần dịu. Người vui cần ngọt. Đừng hỏi họ muốn gì, hãy nghe họ đang thế nào.", reward: { moodTip: 0.05 } },
  { title: "Góc sân và giàn hoa giấy", need: 4, text: "Ông ngoại trồng giàn hoa giấy năm ngoại mở quán. Ông bảo: quán nào cũng cần một góc để người ta ngồi im mà không thấy ngại.", reward: { money: 500000 } },
  { title: "Những lá thư không gửi", need: 5, text: "Có cô sinh viên viết thư cho mẹ ở quê, viết xong lại gấp cất. Ngoại bảo cứ để lại quán, khi nào đủ can đảm thì gửi. Hộp thư ấy giờ vẫn ở dưới quầy.", reward: { flow: 0.03 } },
  { title: "Khi quán vắng khách", need: 6, text: "Có năm quán vắng đến mức ngoại định đóng cửa. Rồi hàng xóm rủ nhau tới, mỗi người một ly. Quán nhỏ sống được là nhờ người ta thương nó.", reward: { rep: 5 } },
  { title: "Ly nước cho người tìm lại ký ức", need: 8, text: "Cà phê phin cho ký ức đậm, sữa đặc cho những ngày ngọt, sữa tươi cho hiện tại dịu dàng, ca cao rắc lên cho chút hơi ấm. Ngoại chưa đặt tên, để dành cho ai đó...", reward: { money: 800000 } },
  { title: "Trang cuối", need: -1, text: "" },
];

// Mùa trong năm (mỗi mùa 14 ngày)
const SEASONS = [
  { name: "Xuân", icon: "🌸", feel: "ngot", desc: "Đầu xuân, khách thích món ngọt ngào", event: "Phố treo đèn đón xuân, khách đi chơi đông hơn!" },
  { name: "Hạ",   icon: "☀️", feel: "mat",  desc: "Mùa hè, món mát bán chạy", event: "Hè về, học sinh nghỉ học ghé quán đông vui!" },
  { name: "Thu",  icon: "🍂", feel: "diu",  desc: "Thu dịu dàng, trà được ưa chuộng", event: "Gió heo may về, khách thích ngồi lâu nhâm nhi trà." },
  { name: "Đông", icon: "❄️", feel: "am",   desc: "Đông lạnh, món ấm áp đắt hàng", event: "Gió mùa đông bắc tràn về, ai cũng tìm một ly ấm." },
];

// Phòng thử công thức signature: chấm điểm theo các nhóm nguyên liệu
const SIG_BASE = ["phin", "espresso", "tra", "cacao", "matcha", "dau", "dua_tuoi", "rau_ma", "atiso", "dau_nanh", "sen", "bo", "cam"];
const SIG_SWEET = ["sua_dac", "duong", "dua", "sua_chua", "vai", "dao"];
const SIG_TOP = ["foam", "trung", "muoi", "tran_chau", "cacao"];
const SIG_MAX = 3;
