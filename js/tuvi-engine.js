/**
 * TU VI ENGINE - TỬ VI ĐẨU SỐ
 * Lập lá số tử vi theo phương pháp truyền thống
 * Minh Phước Feng Shui
 */

const TuViEngine = (function () {

    // 12 Cung
    const CUNG = ['Mệnh', 'Phụ Mẫu', 'Phúc Đức', 'Điền Trạch', 'Quan Lộc', 'Nô Bộc',
        'Thiên Di', 'Tật Ách', 'Tài Bạch', 'Tử Tức', 'Phu Thê', 'Huynh Đệ'];

    // Thứ tự 12 cung trên lá số (theo chiều kim đồng hồ từ Dần)
    const CUNG_VI_TRI = ['Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu'];

    // 14 Chính Tinh
    const CHINH_TINH = {
        tuVi: { name: 'Tử Vi', nguHanh: 'Thổ', loai: 'chinh', amDuong: 'Dương' },
        thienCo: { name: 'Thiên Cơ', nguHanh: 'Mộc', loai: 'chinh', amDuong: 'Âm' },
        thaiDuong: { name: 'Thái Dương', nguHanh: 'Hỏa', loai: 'chinh', amDuong: 'Dương' },
        vuKhuc: { name: 'Vũ Khúc', nguHanh: 'Kim', loai: 'chinh', amDuong: 'Âm' },
        thienDong: { name: 'Thiên Đồng', nguHanh: 'Thủy', loai: 'chinh', amDuong: 'Dương' },
        liemTrinh: { name: 'Liêm Trinh', nguHanh: 'Hỏa', loai: 'chinh', amDuong: 'Âm' },
        thienPhu: { name: 'Thiên Phủ', nguHanh: 'Thổ', loai: 'chinh', amDuong: 'Dương' },
        thaiAm: { name: 'Thái Âm', nguHanh: 'Thủy', loai: 'chinh', amDuong: 'Âm' },
        thamLang: { name: 'Tham Lang', nguHanh: 'Mộc', loai: 'chinh', amDuong: 'Dương' },
        cuMon: { name: 'Cự Môn', nguHanh: 'Thủy', loai: 'chinh', amDuong: 'Âm' },
        thienTuong: { name: 'Thiên Tướng', nguHanh: 'Thủy', loai: 'chinh', amDuong: 'Dương' },
        thienLuong: { name: 'Thiên Lương', nguHanh: 'Mộc', loai: 'chinh', amDuong: 'Âm' },
        thatSat: { name: 'Thất Sát', nguHanh: 'Kim', loai: 'chinh', amDuong: 'Dương' },
        phaQuan: { name: 'Phá Quân', nguHanh: 'Thủy', loai: 'chinh', amDuong: 'Âm' }
    };

    // Phụ Tinh
    const PHU_TINH = {
        // Lục Sát
        kinhDuong: { name: 'Kình Dương', nguHanh: 'Kim', loai: 'sat' },
        daLa: { name: 'Đà La', nguHanh: 'Kim', loai: 'sat' },
        hoaTinh: { name: 'Hỏa Tinh', nguHanh: 'Hỏa', loai: 'sat' },
        linhTinh: { name: 'Linh Tinh', nguHanh: 'Hỏa', loai: 'sat' },
        diKhong: { name: 'Địa Không', nguHanh: 'Hỏa', loai: 'sat' },
        diKiep: { name: 'Địa Kiếp', nguHanh: 'Hỏa', loai: 'sat' },

        // Lục Cát
        vanXuong: { name: 'Văn Xương', nguHanh: 'Kim', loai: 'cat' },
        vanKhuc: { name: 'Văn Khúc', nguHanh: 'Thủy', loai: 'cat' },
        taHuu: { name: 'Tả Phù', nguHanh: 'Thổ', loai: 'cat' },
        huuBat: { name: 'Hữu Bật', nguHanh: 'Thủy', loai: 'cat' },
        thienKhoi: { name: 'Thiên Khôi', nguHanh: 'Hỏa', loai: 'cat' },
        thienViet: { name: 'Thiên Việt', nguHanh: 'Hỏa', loai: 'cat' },

        // Tứ Hóa
        hoaLoc: { name: 'Hóa Lộc', nguHanh: 'Mộc', loai: 'hoa' },
        hoaQuyen: { name: 'Hóa Quyền', nguHanh: 'Mộc', loai: 'hoa' },
        hoaKhoa: { name: 'Hóa Khoa', nguHanh: 'Thủy', loai: 'hoa' },
        hoaKy: { name: 'Hóa Kỵ', nguHanh: 'Thủy', loai: 'hoa' },

        // Các sao khác
        locTon: { name: 'Lộc Tồn', nguHanh: 'Thổ', loai: 'cat' },
        thienMa: { name: 'Thiên Mã', nguHanh: 'Hỏa', loai: 'cat' },
        hoaTinh2: { name: 'Hóa Tinh', nguHanh: 'Hỏa', loai: 'trung' },
        thienKhong: { name: 'Thiên Không', nguHanh: 'Hỏa', loai: 'sat' },
        thaiTue: { name: 'Thái Tuế', nguHanh: 'Hỏa', loai: 'trung' },
        tangMon: { name: 'Tang Môn', nguHanh: 'Mộc', loai: 'sat' },
        bachHo: { name: 'Bạch Hổ', nguHanh: 'Kim', loai: 'sat' },
        thienHinh: { name: 'Thiên Hình', nguHanh: 'Hỏa', loai: 'sat' },
        thienY: { name: 'Thiên Y', nguHanh: 'Thủy', loai: 'cat' },
        thienRieu: { name: 'Thiên Riêu', nguHanh: 'Thủy', loai: 'sat' },
        thienHi: { name: 'Thiên Hỉ', nguHanh: 'Thủy', loai: 'cat' },
        hongLoan: { name: 'Hồng Loan', nguHanh: 'Thủy', loai: 'cat' },
        thienDuc: { name: 'Thiên Đức', nguHanh: 'Hỏa', loai: 'cat' },
        nguyetDuc: { name: 'Nguyệt Đức', nguHanh: 'Hỏa', loai: 'cat' },
        longTri: { name: 'Long Trì', nguHanh: 'Thủy', loai: 'cat' },
        phuongCac: { name: 'Phượng Các', nguHanh: 'Thổ', loai: 'cat' },
        giaiThan: { name: 'Giải Thần', nguHanh: 'Mộc', loai: 'cat' },
        thienQuan: { name: 'Thiên Quan', nguHanh: 'Hỏa', loai: 'cat' },
        thienPhuc: { name: 'Thiên Phúc', nguHanh: 'Hỏa', loai: 'cat' },
        daoHoa: { name: 'Đào Hoa', nguHanh: 'Mộc', loai: 'trung' },
        coThan: { name: 'Cô Thần', nguHanh: 'Hỏa', loai: 'sat' },
        quaTu: { name: 'Quả Tú', nguHanh: 'Hỏa', loai: 'sat' },
        thieuDuong: { name: 'Thiểu Dương', nguHanh: 'Hỏa', loai: 'trung' },
        thieuAm: { name: 'Thiểu Âm', nguHanh: 'Thủy', loai: 'trung' },
        dauQuan: { name: 'Đẩu Quân', nguHanh: 'Thủy', loai: 'trung' },
        thienThuong: { name: 'Thiên Thương', nguHanh: 'Thủy', loai: 'sat' },
        thienSu: { name: 'Thiên Sứ', nguHanh: 'Thủy', loai: 'sat' },
        phiLiem: { name: 'Phi Liêm', nguHanh: 'Hỏa', loai: 'sat' },
        trucPhu: { name: 'Trực Phù', nguHanh: 'Hỏa', loai: 'trung' },
        loaDa: { name: 'Lưu Hà', nguHanh: 'Thủy', loai: 'trung' },
        phaToai: { name: 'Phá Toái', nguHanh: 'Hỏa', loai: 'sat' },
        thienViet2: { name: 'Thiên Việt', nguHanh: 'Hỏa', loai: 'cat' },
        daiHao: { name: 'Đại Hao', nguHanh: 'Hỏa', loai: 'sat' },
        tieuHao: { name: 'Tiểu Hao', nguHanh: 'Hỏa', loai: 'sat' },
        quocAn: { name: 'Quốc Ấn', nguHanh: 'Thổ', loai: 'cat' },
        duongPhu: { name: 'Đường Phù', nguHanh: 'Mộc', loai: 'cat' },
        taPhu: { name: 'Tả Phù', nguHanh: 'Thổ', loai: 'cat' },
        thienLa: { name: 'Thiên La', nguHanh: 'Thổ', loai: 'sat' },
        diaVong: { name: 'Địa Võng', nguHanh: 'Thổ', loai: 'sat' },
        benhPhu: { name: 'Bệnh Phù', nguHanh: 'Thủy', loai: 'sat' },
        thienTai: { name: 'Thiên Tài', nguHanh: 'Thổ', loai: 'cat' },
        thienTho: { name: 'Thiên Thọ', nguHanh: 'Thổ', loai: 'cat' },
        phucBinh: { name: 'Phục Binh', nguHanh: 'Hỏa', loai: 'sat' },
        trucPhu2: { name: 'Trực Phủ', nguHanh: 'Mộc', loai: 'cat' }
    };

    // Bảng vị trí Tử Vi theo ngày sinh và cục
    const TUVI_POSITION = {
        // Thủy Nhị Cục
        2: {
            1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 0,
            13: 1, 14: 2, 15: 3, 16: 4, 17: 5, 18: 6, 19: 7, 20: 8, 21: 9, 22: 10, 23: 11, 24: 0,
            25: 1, 26: 2, 27: 3, 28: 4, 29: 5, 30: 6
        },
        // Mộc Tam Cục
        3: {
            1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3, 7: 4, 8: 4, 9: 5, 10: 5, 11: 6, 12: 6,
            13: 7, 14: 7, 15: 8, 16: 8, 17: 9, 18: 9, 19: 10, 20: 10, 21: 11, 22: 11, 23: 0, 24: 0,
            25: 1, 26: 1, 27: 2, 28: 2, 29: 3, 30: 3
        },
        // Kim Tứ Cục
        4: {
            1: 1, 2: 1, 3: 1, 4: 2, 5: 2, 6: 2, 7: 3, 8: 3, 9: 3, 10: 4, 11: 4, 12: 4,
            13: 5, 14: 5, 15: 5, 16: 6, 17: 6, 18: 6, 19: 7, 20: 7, 21: 7, 22: 8, 23: 8, 24: 8,
            25: 9, 26: 9, 27: 9, 28: 10, 29: 10, 30: 10
        },
        // Thổ Ngũ Cục
        5: {
            1: 1, 2: 1, 3: 1, 4: 1, 5: 2, 6: 2, 7: 2, 8: 2, 9: 3, 10: 3, 11: 3, 12: 3,
            13: 4, 14: 4, 15: 4, 16: 4, 17: 5, 18: 5, 19: 5, 20: 5, 21: 6, 22: 6, 23: 6, 24: 6,
            25: 7, 26: 7, 27: 7, 28: 7, 29: 8, 30: 8
        },
        // Hỏa Lục Cục
        6: {
            1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 2, 7: 2, 8: 2, 9: 2, 10: 2, 11: 3, 12: 3,
            13: 3, 14: 3, 15: 3, 16: 4, 17: 4, 18: 4, 19: 4, 20: 4, 21: 5, 22: 5, 23: 5, 24: 5,
            25: 5, 26: 6, 27: 6, 28: 6, 29: 6, 30: 6
        }
    };

    // Bảng Cục theo Can Chi
    const CUC_TABLE = [
        // Giáp, Ất, Bính, Đinh, Mậu, Kỷ, Canh, Tân, Nhâm, Quý (theo Can)
        // Tý, Sửu, Dần, Mão, Thìn, Tỵ, Ngọ, Mùi, Thân, Dậu, Tuất, Hợi (theo Chi của cung Mệnh)
        [2, 6, 3, 3, 5, 2, 4, 4, 3, 6, 5, 2], // Giáp, Kỷ
        [6, 2, 5, 5, 3, 6, 4, 4, 5, 2, 3, 6], // Ất, Canh
        [3, 5, 2, 2, 6, 3, 4, 4, 2, 5, 6, 3], // Bính, Tân
        [5, 3, 6, 6, 2, 5, 4, 4, 6, 3, 2, 5], // Đinh, Nhâm
        [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]  // Mậu, Quý
    ];

    const CUC_NAME = {
        2: 'Thủy Nhị Cục',
        3: 'Mộc Tam Cục',
        4: 'Kim Tứ Cục',
        5: 'Thổ Ngũ Cục',
        6: 'Hỏa Lục Cục'
    };

    // Xác định cung Mệnh
    function getMenhCung(lunarMonth, hourIndex) {
        // Công thức: Cung Dần + tháng sinh - giờ sinh
        // Cung Dần = 2 (index trong CUNG_VI_TRI)
        let menhIndex = (14 - lunarMonth + hourIndex) % 12;
        return menhIndex;
    }

    // Xác định cung Thân
    function getThanCung(lunarMonth, hourIndex) {
        let thanIndex = (2 + lunarMonth + hourIndex) % 12;
        return thanIndex;
    }

    // Lấy Cục
    function getCuc(yearCan, menhCungIndex) {
        let canGroup;
        if (yearCan === 0 || yearCan === 5) canGroup = 0; // Giáp, Kỷ
        else if (yearCan === 1 || yearCan === 6) canGroup = 1; // Ất, Canh
        else if (yearCan === 2 || yearCan === 7) canGroup = 2; // Bính, Tân
        else if (yearCan === 3 || yearCan === 8) canGroup = 3; // Đinh, Nhâm
        else canGroup = 4; // Mậu, Quý

        return CUC_TABLE[canGroup][menhCungIndex];
    }

    // An Tử Vi
    function getTuViPosition(lunarDay, cuc) {
        if (!TUVI_POSITION[cuc] || !TUVI_POSITION[cuc][lunarDay]) {
            // Fallback calculation
            let pos = Math.ceil(lunarDay / cuc);
            return (pos - 1) % 12;
        }
        return TUVI_POSITION[cuc][lunarDay];
    }

    // An các sao Chính Tinh theo Tử Vi
    function getMainStarsPositions(tuViPos) {
        const positions = {};

        // Tử Vi (đã có vị trí)
        positions['Tử Vi'] = tuViPos;

        // Thiên Cơ: cách Tử Vi 1 cung ngược
        positions['Thiên Cơ'] = (tuViPos + 11) % 12;

        // Thái Dương: cách Tử Vi 3 cung ngược
        positions['Thái Dương'] = (tuViPos + 9) % 12;

        // Vũ Khúc: cách Tử Vi 4 cung ngược
        positions['Vũ Khúc'] = (tuViPos + 8) % 12;

        // Thiên Đồng: cách Tử Vi 5 cung ngược
        positions['Thiên Đồng'] = (tuViPos + 7) % 12;

        // Liêm Trinh: cách Tử Vi 8 cung ngược (hoặc 4 cung thuận)
        positions['Liêm Trinh'] = (tuViPos + 4) % 12;

        return positions;
    }

    // An Thiên Phủ và bộ sao Thiên Phủ
    function getThienPhuStarsPositions(tuViPos) {
        const positions = {};

        // Thiên Phủ: đối xứng với Tử Vi qua trục Dần-Thân
        // Công thức: Thiên Phủ = (4 - tuViPos) mod 12 (Dần = index 0 trong hệ này)
        // Hoặc: nếu Tử Vi ở cung X thì Thiên Phủ ở cung (12 - X + 4) mod 12
        let thienPhuPos = (16 - tuViPos) % 12;
        positions['Thiên Phủ'] = thienPhuPos;

        // Thái Âm: cách Thiên Phủ 1 cung thuận
        positions['Thái Âm'] = (thienPhuPos + 1) % 12;

        // Tham Lang: cách Thiên Phủ 2 cung thuận
        positions['Tham Lang'] = (thienPhuPos + 2) % 12;

        // Cự Môn: cách Thiên Phủ 3 cung thuận
        positions['Cự Môn'] = (thienPhuPos + 3) % 12;

        // Thiên Tướng: cách Thiên Phủ 4 cung thuận
        positions['Thiên Tướng'] = (thienPhuPos + 4) % 12;

        // Thiên Lương: cách Thiên Phủ 5 cung thuận
        positions['Thiên Lương'] = (thienPhuPos + 5) % 12;

        // Thất Sát: cách Thiên Phủ 6 cung thuận
        positions['Thất Sát'] = (thienPhuPos + 6) % 12;

        // Phá Quân: cách Thiên Phủ 10 cung thuận (hoặc 2 cung ngược)
        positions['Phá Quân'] = (thienPhuPos + 10) % 12;

        return positions;
    }

    // An Tả Phù, Hữu Bật (theo tháng sinh)
    function getTaPhuHuuBat(lunarMonth) {
        // Tả Phù: Thìn + tháng sinh
        const taPhu = (4 + lunarMonth - 1) % 12;
        // Hữu Bật: Tuất - tháng sinh
        const huuBat = (10 - lunarMonth + 1 + 12) % 12;
        return { taPhu, huuBat };
    }

    // An Văn Xương, Văn Khúc (theo giờ sinh)
    function getVanXuongVanKhuc(hourIndex) {
        // Văn Xương: Tuất - giờ sinh
        const vanXuong = (10 - hourIndex + 12) % 12;
        // Văn Khúc: Thìn + giờ sinh
        const vanKhuc = (4 + hourIndex) % 12;
        return { vanXuong, vanKhuc };
    }

    // An Thiên Khôi, Thiên Việt (theo can năm)
    function getThienKhoiThienViet(yearCan) {
        const khoi = [1, 0, 3, 3, 1, 0, 7, 6, 3, 3]; // Sửu, Tý, Hợi...
        const viet = [7, 8, 9, 9, 7, 8, 1, 2, 5, 5];
        return {
            thienKhoi: khoi[yearCan],
            thienViet: viet[yearCan]
        };
    }

    // An Lộc Tồn (theo Can năm)
    function getLocTon(yearCan) {
        const locTonPos = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0];
        return locTonPos[yearCan];
    }

    // An Kình Dương, Đà La
    function getKinhDuongDaLa(locTonPos) {
        return {
            kinhDuong: (locTonPos + 1) % 12,
            daLa: (locTonPos + 11) % 12
        };
    }

    // An Hỏa Tinh, Linh Tinh (theo Chi năm và giờ sinh)
    function getHoaTinhLinhTinh(yearChi, hourIndex) {
        // Hỏa Tinh
        let hoaTinhBase;
        if ([2, 6, 10].includes(yearChi)) hoaTinhBase = 1; // Dần, Ngọ, Tuất
        else if ([4, 8, 0].includes(yearChi)) hoaTinhBase = 3; // Thìn, Thân, Tý
        else if ([5, 9, 1].includes(yearChi)) hoaTinhBase = 3; // Tỵ, Dậu, Sửu
        else hoaTinhBase = 9; // Hợi, Mão, Mùi

        // Linh Tinh
        let linhTinhBase;
        if ([2, 6, 10].includes(yearChi)) linhTinhBase = 3;
        else if ([4, 8, 0].includes(yearChi)) linhTinhBase = 10;
        else if ([5, 9, 1].includes(yearChi)) linhTinhBase = 10;
        else linhTinhBase = 3;

        return {
            hoaTinh: (hoaTinhBase + hourIndex) % 12,
            linhTinh: (linhTinhBase + hourIndex) % 12
        };
    }

    // An Địa Không, Địa Kiếp (theo giờ sinh)
    function getDiaKhongDiaKiep(hourIndex) {
        return {
            diaKhong: (11 - hourIndex + 12) % 12,
            diaKiep: (hourIndex + 11) % 12
        };
    }

    // An Thiên Mã (theo Chi năm)
    function getThienMa(yearChi) {
        const maPos = [2, 11, 8, 5, 2, 11, 8, 5, 2, 11, 8, 5];
        return maPos[yearChi];
    }

    // An Đào Hoa (theo Chi năm)
    function getDaoHoa(yearChi) {
        const daoHoaPos = [9, 6, 3, 0, 9, 6, 3, 0, 9, 6, 3, 0];
        return daoHoaPos[yearChi];
    }

    // An Hồng Loan, Thiên Hỉ (theo Chi năm)
    function getHongLoanThienHi(yearChi) {
        return {
            hongLoan: (3 - yearChi + 12) % 12,
            thienHi: (9 - yearChi + 12) % 12
        };
    }

    // An Tứ Hóa (theo Can năm)
    function getTuHoa(yearCan, allStarPositions) {
        // Bảng Tứ Hóa theo Can
        const tuHoa = {
            0: ['Liêm Trinh', 'Phá Quân', 'Vũ Khúc', 'Thái Dương'],     // Giáp
            1: ['Thiên Cơ', 'Thiên Lương', 'Tử Vi', 'Thái Âm'],          // Ất
            2: ['Thiên Đồng', 'Thiên Cơ', 'Văn Xương', 'Liêm Trinh'],   // Bính
            3: ['Thái Âm', 'Thiên Đồng', 'Thiên Cơ', 'Cự Môn'],         // Đinh
            4: ['Tham Lang', 'Thái Âm', 'Hữu Bật', 'Thiên Cơ'],         // Mậu
            5: ['Vũ Khúc', 'Tham Lang', 'Thiên Lương', 'Văn Khúc'],     // Kỷ
            6: ['Thái Dương', 'Vũ Khúc', 'Thái Âm', 'Thiên Đồng'],      // Canh
            7: ['Cự Môn', 'Thái Dương', 'Văn Khúc', 'Văn Xương'],       // Tân
            8: ['Thiên Lương', 'Tử Vi', 'Tả Phù', 'Vũ Khúc'],           // Nhâm
            9: ['Phá Quân', 'Cự Môn', 'Thái Âm', 'Tham Lang']           // Quý
        };

        const hoaNames = ['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Hóa Kỵ'];
        const result = {};

        tuHoa[yearCan].forEach((starName, index) => {
            if (allStarPositions[starName] !== undefined) {
                result[hoaNames[index]] = {
                    position: allStarPositions[starName],
                    attachedTo: starName
                };
            }
        });

        return result;
    }

    // Tính Thân Chủ và Mệnh Chủ
    function getMenhChuThanChu(yearChi, menhCungIndex) {
        // Mệnh Chủ theo Chi Mệnh
        const menhChu = ['Tham Lang', 'Cự Môn', 'Lộc Tồn', 'Văn Khúc', 'Liêm Trinh', 'Vũ Khúc',
            'Phá Quân', 'Vũ Khúc', 'Liêm Trinh', 'Văn Khúc', 'Lộc Tồn', 'Cự Môn'];

        // Thân Chủ theo Chi năm sinh
        const thanChu = ['Linh Tinh', 'Thiên Tướng', 'Thiên Đồng', 'Văn Xương', 'Thiên Cơ', 'Hỏa Tinh',
            'Linh Tinh', 'Thiên Tướng', 'Thiên Đồng', 'Văn Xương', 'Thiên Cơ', 'Hỏa Tinh'];

        return {
            menhChu: menhChu[menhCungIndex],
            thanChu: thanChu[yearChi]
        };
    }

    // Lập Lá Số Tử Vi
    function createChart(name, gender, solarYear, solarMonth, solarDay, hourIndex, viewYear) {
        // Chuyển sang âm lịch
        const lunar = LunarCalendar.solarToLunar(solarYear, solarMonth, solarDay);
        if (!lunar) return null;

        // Lấy Can Chi
        const yearCanChi = LunarCalendar.getYearCanChi(lunar.year);
        const monthCanChi = LunarCalendar.getMonthCanChi(lunar.year, lunar.month);
        const dayCanChi = LunarCalendar.getDayCanChi(solarYear, solarMonth, solarDay);
        const hourCanChi = LunarCalendar.getHourCanChi(dayCanChi.can, hourIndex);

        // Nạp Âm
        const napAm = LunarCalendar.getNapAm(lunar.year);
        const nguHanh = LunarCalendar.getNguHanh(napAm);

        // Xác định cung Mệnh và Thân
        const menhCungIndex = getMenhCung(lunar.month, hourIndex);
        const thanCungIndex = getThanCung(lunar.month, hourIndex);

        // Lấy Cục
        const cuc = getCuc(yearCanChi.canIndex, menhCungIndex);

        // An Tử Vi
        const tuViPos = getTuViPosition(lunar.day, cuc);

        // An các Chính Tinh
        const tuViStars = getMainStarsPositions(tuViPos);
        const thienPhuStars = getThienPhuStarsPositions(tuViPos);

        // Gộp tất cả vị trí sao
        let allStarPositions = { ...tuViStars, ...thienPhuStars };

        // An Tả Phù, Hữu Bật
        const taPhuHuuBat = getTaPhuHuuBat(lunar.month);
        allStarPositions['Tả Phù'] = taPhuHuuBat.taPhu;
        allStarPositions['Hữu Bật'] = taPhuHuuBat.huuBat;

        // An Văn Xương, Văn Khúc
        const vanXuongKhuc = getVanXuongVanKhuc(hourIndex);
        allStarPositions['Văn Xương'] = vanXuongKhuc.vanXuong;
        allStarPositions['Văn Khúc'] = vanXuongKhuc.vanKhuc;

        // An Thiên Khôi, Thiên Việt
        const khoiViet = getThienKhoiThienViet(yearCanChi.canIndex);
        allStarPositions['Thiên Khôi'] = khoiViet.thienKhoi;
        allStarPositions['Thiên Việt'] = khoiViet.thienViet;

        // An Lộc Tồn
        const locTonPos = getLocTon(yearCanChi.canIndex);
        allStarPositions['Lộc Tồn'] = locTonPos;

        // An Kình Dương, Đà La
        const kinhDuongDaLa = getKinhDuongDaLa(locTonPos);
        allStarPositions['Kình Dương'] = kinhDuongDaLa.kinhDuong;
        allStarPositions['Đà La'] = kinhDuongDaLa.daLa;

        // An Hỏa Tinh, Linh Tinh
        const hoaLinh = getHoaTinhLinhTinh(yearCanChi.chiIndex, hourIndex);
        allStarPositions['Hỏa Tinh'] = hoaLinh.hoaTinh;
        allStarPositions['Linh Tinh'] = hoaLinh.linhTinh;

        // An Địa Không, Địa Kiếp
        const diaKhongKiep = getDiaKhongDiaKiep(hourIndex);
        allStarPositions['Địa Không'] = diaKhongKiep.diaKhong;
        allStarPositions['Địa Kiếp'] = diaKhongKiep.diaKiep;

        // An Thiên Mã
        allStarPositions['Thiên Mã'] = getThienMa(yearCanChi.chiIndex);

        // An Đào Hoa
        allStarPositions['Đào Hoa'] = getDaoHoa(yearCanChi.chiIndex);

        // An Hồng Loan, Thiên Hỉ
        const hongLoanHi = getHongLoanThienHi(yearCanChi.chiIndex);
        allStarPositions['Hồng Loan'] = hongLoanHi.hongLoan;
        allStarPositions['Thiên Hỉ'] = hongLoanHi.thienHi;

        // An Tứ Hóa
        const tuHoa = getTuHoa(yearCanChi.canIndex, allStarPositions);

        // Mệnh Chủ, Thân Chủ
        const chuTinh = getMenhChuThanChu(yearCanChi.chiIndex, menhCungIndex);

        // Tạo 12 cung với vị trí sao
        const cungArray = [];
        for (let i = 0; i < 12; i++) {
            const cungData = {
                viTri: CUNG_VI_TRI[i],
                cungName: CUNG[(12 - menhCungIndex + i) % 12],
                isMenh: i === menhCungIndex,
                isThan: i === thanCungIndex,
                stars: []
            };

            // Thêm sao vào cung
            for (const [starName, pos] of Object.entries(allStarPositions)) {
                if (pos === i) {
                    const starInfo = CHINH_TINH[Object.keys(CHINH_TINH).find(k => CHINH_TINH[k].name === starName)] ||
                        PHU_TINH[Object.keys(PHU_TINH).find(k => PHU_TINH[k].name === starName)] ||
                        { name: starName, loai: 'trung' };

                    const star = {
                        name: starName,
                        loai: starInfo ? starInfo.loai : 'trung',
                        hoa: []
                    };

                    // Kiểm tra Tứ Hóa
                    for (const [hoaName, hoaData] of Object.entries(tuHoa)) {
                        if (hoaData.attachedTo === starName) {
                            star.hoa.push(hoaName.replace('Hóa ', '').charAt(0));
                        }
                    }

                    cungData.stars.push(star);
                }
            }

            cungArray.push(cungData);
        }

        return {
            // Thông tin cơ bản
            name: name,
            gender: gender,
            solarDate: { year: solarYear, month: solarMonth, day: solarDay },
            lunarDate: lunar,
            hourIndex: hourIndex,
            hourChi: LunarCalendar.CHI[hourIndex],
            viewYear: viewYear,

            // Can Chi
            yearCanChi: yearCanChi,
            monthCanChi: monthCanChi,
            dayCanChi: dayCanChi,
            hourCanChi: hourCanChi,

            // Mệnh và Cục
            napAm: napAm,
            nguHanh: nguHanh,
            cuc: cuc,
            cucName: CUC_NAME[cuc],
            menhCungIndex: menhCungIndex,
            menhCung: CUNG_VI_TRI[menhCungIndex],
            thanCungIndex: thanCungIndex,
            thanCung: CUNG_VI_TRI[thanCungIndex],
            menhChu: chuTinh.menhChu,
            thanChu: chuTinh.thanChu,

            // Lá số
            cung: cungArray,
            tuHoa: tuHoa
        };
    }

    // Public API
    return {
        CUNG: CUNG,
        CUNG_VI_TRI: CUNG_VI_TRI,
        CHINH_TINH: CHINH_TINH,
        PHU_TINH: PHU_TINH,
        CUC_NAME: CUC_NAME,

        createChart: createChart,
        getMenhCung: getMenhCung,
        getThanCung: getThanCung,
        getCuc: getCuc
    };
})();

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TuViEngine;
}
