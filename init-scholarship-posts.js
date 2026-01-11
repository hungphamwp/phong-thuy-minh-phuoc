// Script để khởi tạo bài viết về Quỹ Khuyến Học
// Chạy script này từ Console của browser khi đã login vào admin

const scholarshipPosts = [
    {
        title: "Quỹ Khuyến Học Minh Phước - Sứ Mệnh Lan Tỏa Kiến Thức",
        excerpt: "Quỹ Khuyến Học Minh Phước được thành lập với sứ mệnh hỗ trợ học sinh, sinh viên có hoàn cảnh khó khăn nhưng học giỏi, giúp các em tiếp tục con đường học vấn.",
        content: `
            <h2>Giới Thiệu Về Quỹ</h2>
            <p>Quỹ Khuyến Học Minh Phước được thành lập vào năm 2020 với mục đích cao cả là giúp đỡ các em học sinh, sinh viên có hoàn cảnh khó khăn nhưng có thành tích học tập xuất sắc. Chúng tôi tin rằng giáo dục là chìa khóa để thay đổi cuộc đời và tạo ra một tương lai tốt đẹp hơn.</p>
            
            <h2>Sứ Mệnh Của Chúng Tôi</h2>
            <p>Sứ mệnh của Quỹ Khuyến Học Minh Phước là:</p>
            <ul>
                <li>Hỗ trợ tài chính cho học sinh, sinh viên nghèo vượt khó</li>
                <li>Trao tặng học bổng cho các em có thành tích học tập xuất sắc</li>
                <li>Xây dựng thư viện, tặng sách vở cho các em miền núi, vùng xa</li>
                <li>Tổ chức các lớp học kỹ năng sống miễn phí</li>
            </ul>

            <h2>Kết Quả Đạt Được</h2>
            <p>Từ khi thành lập đến nay, Quỹ Khuyến Học Minh Phước đã:</p>
            <ul>
                <li>Trao hơn 500 suất học bổng với tổng giá trị 2 tỷ đồng</li>
                <li>Xây dựng 3 thư viện tại các vùng núi cao</li>
                <li>Tặng hơn 10,000 cuốn sách và vở viết</li>
                <li>Hỗ trợ 100% học phí cho 50 sinh viên nghèo vượt khó</li>
            </ul>

            <h2>Cách Thức Đóng Góp</h2>
            <p>Mọi đóng góp của bạn, dù lớn hay nhỏ, đều có ý nghĩa to lớn đối với các em học sinh. Bạn có thể:</p>
            <ul>
                <li>Chuyển khoản trực tiếp vào tài khoản quỹ</li>
                <li>Tham gia các chương trình quyên góp</li>
                <li>Tài trợ học bổng dài hạn</li>
                <li>Đóng góp sách vở, dụng cụ học tập</li>
            </ul>

            <p><strong>Thông tin chuyển khoản:</strong></p>
            <p>Ngân hàng: Vietcombank<br>
            Số tài khoản: 1234567890<br>
            Chủ tài khoản: Quỹ Khuyến Học Minh Phước<br>
            Nội dung: Ủng hộ Quỹ Khuyến Học + Họ tên</p>
        `,
        category: "Quỹ Khuyến Học",
        author: "Ban Quản Lý Quỹ",
        featuredImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
        tags: ["quỹ khuyến học", "học bổng", "từ thiện", "giáo dục"],
        featured: true,
        status: "published"
    },
    {
        title: "Học Bổng Minh Phước 2026 - Cơ Hội Cho Học Sinh Nghèo Vượt Khó",
        excerpt: "Chương trình học bổng Minh Phước năm 2026 dành cho học sinh có thành tích học tập xuất sắc nhưng hoàn cảnh gia đình khó khăn. Tổng giá trị học bổng lên đến 500 triệu đồng.",
        content: `
            <h2>Thông Tin Chương Trình</h2>
            <p>Chương trình Học Bổng Minh Phước năm 2026 là chương trình học bổng thường niên lớn nhất của quỹ, nhằm khuyến khích và tạo điều kiện cho các em học sinh có hoàn cảnh khó khăn được tiếp tục con đường học vấn.</p>

            <h2>Đối Tượng Nhận Học Bổng</h2>
            <ul>
                <li>Học sinh THCS, THPT đang theo học tại các trường công lập</li>
                <li>Có thành tích học tập xuất sắc (học lực Giỏi hoặc Khá, hạnh kiểm Tốt)</li>
                <li>Hoàn cảnh gia đình khó khăn, thu nhập thấp</li>
                <li>Có tinh thần vượt khó, ý chí học tập cao</li>
            </ul>

            <h2>Giá Trị Học Bổng</h2>
            <p>Tổng giá trị học bổng: <strong>500 triệu đồng</strong></p>
            <ul>
                <li>Học bổng A: 10 triệu đồng/suất (10 suất)</li>
                <li>Học bổng B: 5 triệu đồng/suất (30 suất)</li>
                <li>Học bổng C: 3 triệu đồng/suất (50 suất)</li>
            </ul>

            <h2>Hồ Sơ Đăng Ký</h2>
            <p>Hồ sơ gồm:</p>
            <ol>
                <li>Đơn xin học bổng (theo mẫu)</li>
                <li>Bản sao học bạ (có công chứng)</li>
                <li>Giấy xác nhận hoàn cảnh gia đình</li>
                <li>2 ảnh 3x4 (chụp trong 6 tháng gần nhất)</li>
                <li>Bài luận "Ước mơ của em" (500-700 từ)</li>
            </ol>

            <h2>Thời Gian Nhận Hồ Sơ</h2>
            <p><strong>Từ ngày 01/02/2026 đến 30/03/2026</strong></p>
            <p>Địa chỉ nộp hồ sơ: 57 Đường Tạ Phương An Lạc, TP HCM</p>
            <p>Điện thoại: 0123 456 789</p>

            <h2>Lễ Trao Học Bổng</h2>
            <p>Lễ trao học bổng sẽ được tổ chức vào <strong>ngày 15/04/2026</strong> tại Hội trường Minh Phước.</p>
        `,
        category: "Quỹ Khuyến Học",
        author: "Ban Quản Lý Quỹ",
        featuredImage: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800",
        tags: ["học bổng 2026", "đăng ký học bổng", "học sinh nghèo"],
        featured: true,
        status: "published"
    },
    {
        title: "Câu Chuyện Thành Công - Em Nguyễn Thị Mai Và Hành Trình Vượt Khó",
        excerpt: "Mai, một học sinh nghèo từ vùng cao Lâm Đồng, đã vượt qua mọi khó khăn để trở thành thủ khoa đầu vào Đại học Y Hà Nội nhờ sự hỗ trợ của Quỹ Khuyến Học Minh Phước.",
        content: `
            <h2>Hoàn Cảnh Khó Khăn</h2>
            <p>Em Nguyễn Thị Mai sinh ra trong một gia đình nghèo tại xã Phan Rí Cửa, Lâm Đồng. Bố mẹ em là nông dân, thu nhập chỉ đủ trang trải cuộc sống hàng ngày. Dù hoàn cảnh khó khăn, Mai luôn là học sinh xuất sắc, luôn đứng đầu lớp.</p>

            <h2>Gặp Gỡ Quỹ Minh Phước</h2>
            <p>Năm 2022, khi đang học lớp 11, Mai gặp khó khăn lớn khi gia đình không đủ tiền để em tiếp tục học. May mắn thay, thông qua giới thiệu của thầy giáo chủ nhiệm, Mai đã được nhận học bổng từ Quỹ Khuyến Học Minh Phước.</p>

            <blockquote>
                <p>"Em vô cùng biết ơn Quỹ Minh Phước. Học bổng không chỉ giúp em có điều kiện học tập mà còn là động lực tinh thần lớn lao để em cố gắng hơn mỗi ngày."</p>
                <footer>- Nguyễn Thị Mai</footer>
            </blockquote>

            <h2>Thành Công Rực Rỡ</h2>
            <p>Với sự hỗ trợ của quỹ cùng nỗ lực không ngừng nghỉ, Mai đã đạt điểm số cao trong kỳ thi THPT Quốc gia và trở thành thủ khoa đầu vào Đại học Y Hà Nội năm 2024.</p>

            <p>Hiện tại, Mai đang theo học năm thứ 2 tại Đại học Y Hà Nội và vẫn tiếp tục nhận học bổng từ quỹ. Em mong muốn sau khi tốt nghiệp sẽ trở về quê hương để phục vụ bà con.</p>

            <h2>Lời Nhắn Gửi</h2>
            <p>Mai chia sẻ: "Em muốn gửi lời cảm ơn sâu sắc nhất đến Ban Quản Lý Quỹ và các nhà hảo tâm đã tin tưởng và giúp đỡ em. Em hứa sẽ cố gắng học thật tốt để sau này cũng có thể giúp đỡ nhiều bạn khác như em."</p>

            <p>Đây chỉ là một trong rất nhiều câu chuyện thành công của các em học sinh được quỹ hỗ trợ. Mỗi đóng góp của bạn đều tạo nên sự thay đổi lớn lao trong cuộc đời các em!</p>
        `,
        category: "Quỹ Khuyến Học",
        author: "Biên Tập Viên",
        featuredImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
        tags: ["câu chuyện thành công", "học sinh vượt khó", "thủ khoa"],
        featured: false,
        status: "published"
    },
    {
        title: "Thư Viện Minh Phước Tại Vùng Cao - Mang Tri Thức Đến Với Trẻ Em Miền Núi",
        excerpt: "Dự án xây dựng thư viện tại các vùng núi cao nhằm tạo điều kiện cho trẻ em miền núi được tiếp cận với sách vở và kiến thức, góp phần nâng cao chất lượng giáo dục.",
        content: `
            <h2>Dự Án Thư Viện Vùng Cao</h2>
            <p>Nhận thấy sự thiếu thốn về sách vở và tài liệu học tập tại các vùng núi cao, Quỹ Khuyến Học Minh Phước đã triển khai dự án xây dựng thư viện nhằm mang tri thức đến gần hơn với các em nhỏ vùng cao.</p>

            <h2>Các Thư Viện Đã Xây Dựng</h2>
            
            <h3>1. Thư Viện Tại Xã Phan Rí Cửa, Lâm Đồng</h3>
            <p>Thư viện đầu tiên được xây dựng vào tháng 3/2021 tại Chùa Quan Âm Cát, xã Phan Rí Cửa. Thư viện có:</p>
            <ul>
                <li>Diện tích: 80m²</li>
                <li>Sức chứa: 50 em học sinh</li>
                <li>Số lượng sách: 3,000 cuốn</li>
                <li>Trang thiết bị: Bàn ghế, tủ sách, đèn chiếu sáng</li>
            </ul>

            <h3>2. Thư Viện Tại Xã Đà Lạt, Lâm Đồng</h3>
            <p>Khai trương tháng 10/2022, phục vụ hơn 200 học sinh trong khu vực.</p>

            <h3>3. Thư Viện Tại Huyện Sa Pa, Lào Cai</h3>
            <p>Thư viện mới nhất, khai trương tháng 6/2023.</p>

            <h2>Hoạt Động Của Thư Viện</h2>
            <p>Các thư viện không chỉ cho mượn sách mà còn:</p>
            <ul>
                <li>Tổ chức các buổi đọc sách cùng nhau</li>
                <li>Dạy kỹ năng tìm kiếm thông tin</li>
                <li>Tổ chức các câu lạc bộ văn học, khoa học</li>
                <li>Chiếu phim giáo dục miễn phí</li>
            </ul>

            <h2>Kết Quả Đạt Được</h2>
            <p>Sau 3 năm hoạt động, các thư viện đã:</p>
            <ul>
                <li>Phục vụ hơn 5,000 lượt bạn đọc</li>
                <li>Cho mượn hơn 15,000 lượt sách</li>
                <li>Tổ chức 50+ hoạt động ngoại khóa</li>
                <li>Góp phần nâng cao điểm trung bình của học sinh trong vùng</li>
            </ul>

            <h2>Kế Hoạch Tương Lai</h2>
            <p>Quỹ dự định xây dựng thêm 2 thư viện mới tại:</p>
            <ul>
                <li>Huyện Mù Cang Chải, Yên Bái (2026)</li>
                <li>Huyện Đông Giang, Quảng Nam (2027)</li>
            </ul>

            <p>Chúng tôi rất mong nhận được sự đóng góp từ cộng đồng để có thể mang thêm nhiều thư viện đến với các em nhỏ vùng cao!</p>
        `,
        category: "Quỹ Khuyến Học",
        author: "Ban Quản Lý Quỹ",
        featuredImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800",
        tags: ["thư viện", "vùng cao", "trẻ em miền núi", "tri thức"],
        featured: false,
        status: "published"
    },
    {
        title: "Cách Đóng Góp Cho Quỹ Khuyến Học Minh Phước",
        excerpt: "Hướng dẫn chi tiết các cách bạn có thể đóng góp để giúp đỡ các em học sinh nghèo vượt khó tiếp tục con đường học vấn.",
        content: `
            <h2>Tại Sao Nên Đóng Góp?</h2>
            <p>Mỗi đóng góp của bạn, dù lớn hay nhỏ, đều tạo nên sự khác biệt lớn trong cuộc đời của các em học sinh:</p>
            <ul>
                <li>100,000 đồng = 10 cuốn vở và bút viết cho 1 em</li>
                <li>500,000 đồng = Hỗ trợ học phí 1 tháng</li>
                <li>3,000,000 đồng = Học bổng toàn phần 1 học kỳ</li>
                <li>10,000,000 đồng = Học bổng 1 năm học</li>
            </ul>

            <h2>Các Hình Thức Đóng Góp</h2>

            <h3>1. Chuyển Khoản Ngân Hàng</h3>
            <p><strong>Ngân hàng Vietcombank</strong></p>
            <ul>
                <li>Số tài khoản: 1234567890</li>
                <li>Chủ tài khoản: Quỹ Khuyến Học Minh Phước</li>
                <li>Chi nhánh: TP. Hồ Chí Minh</li>
                <li>Nội dung: Ủng hộ Quỹ Khuyến Học + Họ tên</li>
            </ul>

            <h3>2. Chuyển Khoản Qua Ví Điện Tử</h3>
            <ul>
                <li><strong>MoMo:</strong> 0123456789 - Quỹ Minh Phước</li>
                <li><strong>ZaloPay:</strong> 0123456789 - Quỹ Minh Phước</li>
                <li><strong>VNPay:</strong> 0123456789 - Quỹ Minh Phước</li>
            </ul>

            <h3>3. Đóng Góp Trực Tiếp</h3>
            <p>Bạn có thể đến trực tiếp văn phòng quỹ:</p>
            <ul>
                <li><strong>Địa chỉ 1:</strong> 57 Đường Tạ Phương An Lạc, TP HCM</li>
                <li><strong>Địa chỉ 2:</strong> Chùa Quan Âm Cát, xã Phan Rí Cửa, Lâm Đồng</li>
                <li><strong>Giờ làm việc:</strong> 8h00 - 17h00 (Thứ 2 - Thứ 7)</li>
            </ul>

            <h3>4. Tài Trợ Học Bổng Dài Hạn</h3>
            <p>Cam kết hỗ trợ 1 học sinh trong suốt quá trình học tập (tối thiểu 1 năm học)</p>
            <ul>
                <li>Học bổng THCS: 5 triệu đồng/năm</li>
                <li>Học bổng THPT: 8 triệu đồng/năm</li>
                <li>Học bổng Đại học: 15 triệu đồng/năm</li>
            </ul>

            <h3>5. Đóng Góp Hiện Vật</h3>
            <p>Quỹ cũng nhận đóng góp:</p>
            <ul>
                <li>Sách giáo khoa, sách tham khảo</li>
                <li>Văn phòng phẩm (vở, bút, thước, balo...)</li>
                <li>Máy tính, laptop (còn sử dụng tốt)</li>
                <li>Quần áo, đồng phục học sinh</li>
            </ul>

            <h2>Minh Bạch Tài Chính</h2>
            <p>Quỹ cam kết minh bạch 100% trong việc sử dụng nguồn tài trợ:</p>
            <ul>
                <li>Báo cáo tài chính hàng quý</li>
                <li>Công khai danh sách nhà tài trợ</li>
                <li>Công khai danh sách học sinh nhận hỗ trợ</li>
                <li>Cho phép nhà tài trợ theo dõi tiến độ học tập của em</li>
            </ul>

            <h2>Ưu Đãi Cho Nhà Tài Trợ</h2>
            <ul>
                <li>Giấy chứng nhận đóng góp Quỹ Khuyến Học</li>
                <li>Được ghi nhận công đức tại chùa</li>
                <li>Được mời tham dự lễ trao học bổng</li>
                <li>Nhận báo cáo định kỳ về hoạt động của quỹ</li>
            </ul>

            <p><strong>Liên hệ:</strong> 0123 456 789 hoặc email: quykhuyenhoc@minhphuoc.com</p>
        `,
        category: "Quỹ Khuyến Học",
        author: "Ban Quản Lý Quỹ",
        featuredImage: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800",
        tags: ["đóng góp", "tài trợ", "học bổng", "từ thiện"],
        featured: false,
        status: "published"
    }
];

// Hướng dẫn: Copy toàn bộ code trên và paste vào Console của trình duyệt
// sau khi đã đăng nhập vào admin panel

console.log("===== KHỞI TẠO BÀI VIẾT QUỸ KHUYẾN HỌC =====");
console.log(`Sẽ tạo ${scholarshipPosts.length} bài viết...`);

// Thêm từng bài viết
scholarshipPosts.forEach((post, index) => {
    const newPost = blogManager.createPost(post);
    console.log(`✓ Đã tạo bài ${index + 1}: ${post.title}`);
});

console.log("\n✅ Hoàn tất! Đã tạo tất cả bài viết về Quỹ Khuyến Học.");
console.log("Vui lòng reload trang để xem kết quả.");
