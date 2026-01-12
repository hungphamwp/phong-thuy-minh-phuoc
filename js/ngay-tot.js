/**
 * NGÀY TỐT XẤU ENGINE - XEM NGÀY HOÀNG ĐẠO
 * Tính toán ngày tốt xấu cho các sự kiện
 * Minh Phước Feng Shui
 */

const NgayTotEngine = (function () {

    // 12 Trực (Kiến Trừ)
    const TRUC = [
        { name: 'Kiến', tot: true, viec: ['Khởi công', 'Động thổ', 'Mở cửa hàng'] },
        { name: 'Trừ', tot: true, viec: ['Trị bệnh', 'Tẩy trần', 'Dọn dẹp'] },
        { name: 'Mãn', tot: true, viec: ['Cưới hỏi', 'Khai trương', 'Nhập trạch'] },
        { name: 'Bình', tot: true, viec: ['Tu sửa', 'Mở đường', 'Công việc thường ngày'] },
        { name: 'Định', tot: true, viec: ['Cưới hỏi', 'Giao dịch', 'Ký kết'] },
        { name: 'Chấp', tot: true, viec: ['Xây dựng', 'Bắt đầu công việc'] },
        { name: 'Phá', tot: false, viec: ['Phá dỡ', 'Trị bệnh'] },
        { name: 'Nguy', tot: false, viec: ['An táng', 'Thu hoạch'] },
        { name: 'Thành', tot: true, viec: ['Mọi việc đều tốt', 'Khai trương', 'Cưới hỏi'] },
        { name: 'Thu', tot: false, viec: ['Thu hoạch', 'Nhập kho'] },
        { name: 'Khai', tot: true, viec: ['Khai trương', 'Động thổ', 'Khởi công'] },
        { name: 'Bế', tot: false, viec: ['An táng', 'Tu sửa mồ mả'] }
    ];

    // 12 Sao Hoàng Đạo / Hắc Đạo
    const SAO_NGAY = {
        hoangDao: [
            { name: 'Thanh Long', description: 'Cát tinh, rất tốt cho mọi việc' },
            { name: 'Minh Đường', description: 'Cát tinh, tốt cho xây dựng, cưới hỏi' },
            { name: 'Kim Quỹ', description: 'Cát tinh, tốt cho tài lộc, mở cửa hàng' },
            { name: 'Thiên Đức', description: 'Cát tinh, tốt cho mọi việc hệ trọng' },
            { name: 'Ngọc Đường', description: 'Cát tinh, tốt cho cưới hỏi, khai trương' },
            { name: 'Tư Mệnh', description: 'Cát tinh, tốt cho khởi sự, động thổ' }
        ],
        hacDao: [
            { name: 'Thiên Hình', description: 'Hung tinh, tránh mọi việc lớn' },
            { name: 'Chu Tước', description: 'Hung tinh, hay gây thị phi' },
            { name: 'Bạch Hổ', description: 'Hung tinh, tránh cưới hỏi, động thổ' },
            { name: 'Thiên Lao', description: 'Hung tinh, tránh xuất hành, ký kết' },
            { name: 'Huyền Vũ', description: 'Hung tinh, tránh lo việc lớn' },
            { name: 'Câu Trần', description: 'Hung tinh, hay gây trì trệ' }
        ]
    };

    // Bảng Hoàng Đạo theo tháng và Chi ngày
    // Hoàng Đạo: Thanh Long, Minh Đường, Kim Quỹ, Thiên Đức, Ngọc Đường, Tư Mệnh
    const HOANG_DAO_TABLE = {
        1: [0, 1, 2, 3, 4, 5],   // Tháng Dần: Tý, Sửu, Thìn, Tỵ, Mùi, Thân
        2: [2, 3, 4, 5, 6, 7],   // Tháng Mão
        3: [4, 5, 6, 7, 8, 9],   // Tháng Thìn
        4: [6, 7, 8, 9, 10, 11], // Tháng Tỵ
        5: [8, 9, 10, 11, 0, 1], // Tháng Ngọ
        6: [10, 11, 0, 1, 2, 3], // Tháng Mùi
        7: [0, 1, 2, 3, 4, 5],   // Tháng Thân
        8: [2, 3, 4, 5, 6, 7],   // Tháng Dậu
        9: [4, 5, 6, 7, 8, 9],   // Tháng Tuất
        10: [6, 7, 8, 9, 10, 11], // Tháng Hợi
        11: [8, 9, 10, 11, 0, 1], // Tháng Tý
        12: [10, 11, 0, 1, 2, 3]  // Tháng Sửu
    };

    // Giờ Hoàng Đạo theo ngày
    const GIO_HOANG_DAO = {
        0: [0, 1, 4, 5, 6, 7],      // Ngày Tý: Tý, Sửu, Thìn, Tỵ, Ngọ, Mùi
        1: [0, 2, 3, 6, 7, 8],      // Ngày Sửu
        2: [0, 1, 4, 5, 8, 9],      // Ngày Dần
        3: [2, 3, 4, 5, 6, 11],     // Ngày Mão
        4: [0, 5, 6, 7, 10, 11],    // Ngày Thìn
        5: [0, 1, 4, 8, 9, 10],     // Ngày Tỵ
        6: [0, 1, 4, 5, 6, 7],      // Ngày Ngọ
        7: [0, 2, 3, 6, 7, 8],      // Ngày Mùi
        8: [0, 1, 4, 5, 8, 9],      // Ngày Thân
        9: [2, 3, 4, 5, 6, 11],     // Ngày Dậu
        10: [0, 5, 6, 7, 10, 11],   // Ngày Tuất
        11: [0, 1, 4, 8, 9, 10]     // Ngày Hợi
    };

    // Các loại sự kiện và ngày phù hợp
    const SU_KIEN = {
        cuoiHoi: {
            name: 'Cưới hỏi',
            icon: 'fa-heart',
            trucTot: ['Mãn', 'Định', 'Thành', 'Khai'],
            trucXau: ['Phá', 'Nguy', 'Thu', 'Bế'],
            chiTot: ['Dần', 'Ngọ', 'Tuất', 'Thân', 'Tý', 'Thìn'],
            chiXau: ['Mão', 'Dậu'],
            ngayTot: ['Thiên Đức', 'Nguyệt Đức', 'Thiên Ân'],
            ngayXau: ['Tam Nương', 'Thọ Tử', 'Nguyệt Kỵ']
        },
        khaiTruong: {
            name: 'Khai trương',
            icon: 'fa-store',
            trucTot: ['Mãn', 'Thành', 'Khai', 'Định'],
            trucXau: ['Phá', 'Bế', 'Thu'],
            chiTot: ['Dần', 'Mão', 'Tỵ', 'Ngọ', 'Thân', 'Dậu'],
            chiXau: [],
            ngayTot: ['Thiên Đức', 'Nguyệt Đức', 'Khai Nhật'],
            ngayXau: ['Nguyệt Phá', 'Tứ Ly']
        },
        dongTho: {
            name: 'Động thổ',
            icon: 'fa-shovel',
            trucTot: ['Kiến', 'Mãn', 'Định', 'Thành', 'Khai'],
            trucXau: ['Phá', 'Bế', 'Thu', 'Nguy'],
            chiTot: ['Dần', 'Ngọ', 'Tuất'],
            chiXau: ['Thìn', 'Tuất', 'Sửu', 'Mùi'],
            ngayTot: ['Thiên Đức', 'Nguyệt Đức'],
            ngayXau: ['Thổ Phủ', 'Địa Phá', 'Thổ Kỵ']
        },
        nhapTrach: {
            name: 'Nhập trạch',
            icon: 'fa-home',
            trucTot: ['Mãn', 'Định', 'Thành', 'Khai'],
            trucXau: ['Phá', 'Bế', 'Thu', 'Nguy'],
            chiTot: ['Dần', 'Ngọ', 'Tuất', 'Thân', 'Tý', 'Thìn'],
            chiXau: [],
            ngayTot: ['Thiên Ân', 'Thiên Mã'],
            ngayXau: ['Nguyệt Phá', 'Tứ Phế']
        },
        xuatHanh: {
            name: 'Xuất hành',
            icon: 'fa-plane',
            trucTot: ['Kiến', 'Mãn', 'Thành', 'Khai'],
            trucXau: ['Phá', 'Bế', 'Thu'],
            chiTot: ['Dần', 'Mão', 'Tỵ', 'Ngọ'],
            chiXau: ['Tuất', 'Hợi'],
            ngayTot: ['Thiên Mã', 'Dịch Mã'],
            ngayXau: ['Nguyệt Kỵ', 'Tứ Tuyệt']
        },
        kyKet: {
            name: 'Ký kết hợp đồng',
            icon: 'fa-file-signature',
            trucTot: ['Kiến', 'Mãn', 'Định', 'Thành'],
            trucXau: ['Phá', 'Bế'],
            chiTot: ['Dần', 'Thìn', 'Tỵ', 'Ngọ', 'Thân', 'Tuất'],
            chiXau: [],
            ngayTot: ['Thiên Đức', 'Nguyệt Hợp'],
            ngayXau: ['Nguyệt Phá']
        },
        catToc: {
            name: 'Cắt tóc',
            icon: 'fa-cut',
            trucTot: ['Kiến', 'Trừ', 'Mãn', 'Bình', 'Định', 'Thành', 'Khai'],
            trucXau: ['Phá', 'Bế'],
            chiTot: ['Thân', 'Dậu', 'Tuất', 'Hợi'],
            chiXau: ['Tý', 'Sửu'],
            ngayTot: [],
            ngayXau: ['Nguyệt Kỵ']
        },
        muaXe: {
            name: 'Mua xe',
            icon: 'fa-car',
            trucTot: ['Mãn', 'Định', 'Thành', 'Khai'],
            trucXau: ['Phá', 'Bế', 'Nguy'],
            chiTot: ['Dần', 'Mão', 'Thân', 'Dậu'],
            chiXau: [],
            ngayTot: ['Thiên Mã', 'Lộc Mã'],
            ngayXau: ['Nguyệt Phá', 'Tứ Phế']
        },
        anTang: {
            name: 'An táng',
            icon: 'fa-cross',
            trucTot: ['Nguy', 'Thu', 'Bế'],
            trucXau: ['Kiến', 'Mãn', 'Thành', 'Khai'],
            chiTot: [],
            chiXau: ['Dần', 'Ngọ', 'Tuất'],
            ngayTot: [],
            ngayXau: ['Trùng Tang', 'Trùng Phục']
        }
    };

    // Ngày Tam Nương (ngày kỵ mọi việc)
    const TAM_NUONG = [3, 7, 13, 18, 22, 27]; // Ngày 3, 7, 13, 18, 22, 27 âm lịch

    // Ngày Nguyệt Kỵ (ngày kỵ mỗi tháng)
    const NGUYET_KY = [5, 14, 23]; // Ngày 5, 14, 23 âm lịch

    // Ngày Sát Chủ (Thọ Tử)
    const SAT_CHU = {
        1: 13, 2: 11, 3: 9, 4: 7, 5: 5, 6: 3,
        7: 1, 8: 27, 9: 25, 10: 23, 11: 21, 12: 19
    };

    // Tính Trực trong ngày
    function getTruc(lunarMonth, dayChi) {
        // Trực Kiến ở Chi trùng với tháng (tháng Dần thì Kiến ở ngày Dần)
        const monthBase = (lunarMonth + 2 - 1) % 12; // Tháng 1 = Dần = index 2
        const trucIndex = (12 + dayChi - monthBase) % 12;
        return TRUC[trucIndex];
    }

    // Kiểm tra ngày Hoàng Đạo
    function isHoangDao(lunarMonth, dayChi) {
        const hoangDaoChis = HOANG_DAO_TABLE[lunarMonth] || [];
        return hoangDaoChis.includes(dayChi);
    }

    // Lấy sao ngày (Hoàng Đạo hoặc Hắc Đạo)
    function getSaoNgay(lunarMonth, dayChi) {
        if (isHoangDao(lunarMonth, dayChi)) {
            // Xác định sao Hoàng Đạo cụ thể
            const hoangDaoChis = HOANG_DAO_TABLE[lunarMonth];
            const saoIndex = hoangDaoChis.indexOf(dayChi);
            if (saoIndex >= 0 && saoIndex < SAO_NGAY.hoangDao.length) {
                return { type: 'hoangDao', sao: SAO_NGAY.hoangDao[saoIndex] };
            }
        }
        // Hắc Đạo
        return { type: 'hacDao', sao: SAO_NGAY.hacDao[Math.floor(Math.random() * SAO_NGAY.hacDao.length)] };
    }

    // Lấy giờ Hoàng Đạo trong ngày
    function getGioHoangDao(dayChi) {
        const hoangDaoHours = GIO_HOANG_DAO[dayChi] || [];
        return hoangDaoHours.map(h => ({
            chi: LunarCalendar.CHI[h],
            index: h,
            timeRange: getTimeRange(h)
        }));
    }

    // Lấy khoảng thời gian của giờ
    function getTimeRange(hourIndex) {
        const hours = [
            '23:00-01:00', '01:00-03:00', '03:00-05:00', '05:00-07:00',
            '07:00-09:00', '09:00-11:00', '11:00-13:00', '13:00-15:00',
            '15:00-17:00', '17:00-19:00', '19:00-21:00', '21:00-23:00'
        ];
        return hours[hourIndex];
    }

    // Kiểm tra ngày đặc biệt xấu
    function checkBadDays(lunarDay, lunarMonth) {
        const issues = [];

        if (TAM_NUONG.includes(lunarDay)) {
            issues.push({ type: 'Tam Nương', severity: 'high', desc: 'Ngày Tam Nương, kỵ cưới hỏi' });
        }

        if (NGUYET_KY.includes(lunarDay)) {
            issues.push({ type: 'Nguyệt Kỵ', severity: 'medium', desc: 'Ngày Nguyệt Kỵ, tránh việc lớn' });
        }

        if (SAT_CHU[lunarMonth] === lunarDay) {
            issues.push({ type: 'Thọ Tử', severity: 'high', desc: 'Ngày Sát Chủ, đại kỵ cưới hỏi' });
        }

        return issues;
    }

    // Đánh giá ngày cho sự kiện cụ thể
    function evaluateDay(solarYear, solarMonth, solarDay, eventType, birthYear) {
        // Chuyển sang âm lịch
        const lunar = LunarCalendar.solarToLunar(solarYear, solarMonth, solarDay);
        if (!lunar) return null;

        // Lấy Can Chi ngày
        const dayCanChi = LunarCalendar.getDayCanChi(solarYear, solarMonth, solarDay);
        const dayChiIndex = dayCanChi.chiIndex;

        // Lấy thông tin sự kiện
        const event = SU_KIEN[eventType];
        if (!event) return null;

        // Tính điểm
        let score = 50; // Điểm cơ bản
        const factors = [];

        // 1. Kiểm tra Trực
        const truc = getTruc(lunar.month, dayChiIndex);
        if (event.trucTot.includes(truc.name)) {
            score += 15;
            factors.push({ type: 'positive', text: `Ngày ${truc.name} - tốt cho ${event.name.toLowerCase()}` });
        } else if (event.trucXau.includes(truc.name)) {
            score -= 20;
            factors.push({ type: 'negative', text: `Ngày ${truc.name} - không tốt cho ${event.name.toLowerCase()}` });
        }

        // 2. Kiểm tra Hoàng Đạo
        const saoNgay = getSaoNgay(lunar.month, dayChiIndex);
        if (saoNgay.type === 'hoangDao') {
            score += 20;
            factors.push({ type: 'positive', text: `Ngày Hoàng Đạo - ${saoNgay.sao.name}: ${saoNgay.sao.description}` });
        } else {
            score -= 10;
            factors.push({ type: 'negative', text: `Ngày Hắc Đạo - ${saoNgay.sao.name}: ${saoNgay.sao.description}` });
        }

        // 3. Kiểm tra Chi ngày
        if (event.chiTot.includes(LunarCalendar.CHI[dayChiIndex])) {
            score += 10;
            factors.push({ type: 'positive', text: `Ngày ${LunarCalendar.CHI[dayChiIndex]} hợp với ${event.name.toLowerCase()}` });
        }
        if (event.chiXau.includes(LunarCalendar.CHI[dayChiIndex])) {
            score -= 15;
            factors.push({ type: 'negative', text: `Ngày ${LunarCalendar.CHI[dayChiIndex]} xung với ${event.name.toLowerCase()}` });
        }

        // 4. Kiểm tra ngày đặc biệt xấu
        const badDays = checkBadDays(lunar.day, lunar.month);
        badDays.forEach(bd => {
            if (bd.severity === 'high') {
                score -= 30;
            } else {
                score -= 15;
            }
            factors.push({ type: 'negative', text: `${bd.type}: ${bd.desc}` });
        });

        // 5. Kiểm tra xung tuổi (nếu có năm sinh)
        if (birthYear) {
            const birthYearChi = LunarCalendar.getYearCanChi(birthYear).chiIndex;
            // Xung: cách nhau 6 cung
            if (Math.abs(birthYearChi - dayChiIndex) === 6 || Math.abs(birthYearChi - dayChiIndex) === 6) {
                score -= 10;
                factors.push({ type: 'warning', text: 'Ngày xung với tuổi của bạn' });
            }
        }

        // Giới hạn điểm
        score = Math.max(0, Math.min(100, score));

        // Xác định đánh giá
        let rating;
        if (score >= 80) rating = { level: 'excellent', text: 'Rất tốt', color: '#28a745' };
        else if (score >= 65) rating = { level: 'good', text: 'Tốt', color: '#20c997' };
        else if (score >= 50) rating = { level: 'average', text: 'Bình thường', color: '#ffc107' };
        else if (score >= 35) rating = { level: 'below', text: 'Không tốt', color: '#fd7e14' };
        else rating = { level: 'bad', text: 'Xấu', color: '#dc3545' };

        // Lấy giờ hoàng đạo
        const gioHoangDao = getGioHoangDao(dayChiIndex);

        return {
            solarDate: { year: solarYear, month: solarMonth, day: solarDay },
            lunarDate: lunar,
            dayCanChi: dayCanChi,
            truc: truc,
            saoNgay: saoNgay,
            gioHoangDao: gioHoangDao,
            event: event,
            score: score,
            rating: rating,
            factors: factors,
            badDays: badDays
        };
    }

    // Tìm ngày tốt trong khoảng thời gian
    function findGoodDays(startDate, endDate, eventType, birthYear, minScore = 65) {
        const results = [];
        const start = new Date(startDate);
        const end = new Date(endDate);

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const evaluation = evaluateDay(
                d.getFullYear(),
                d.getMonth() + 1,
                d.getDate(),
                eventType,
                birthYear
            );

            if (evaluation && evaluation.score >= minScore) {
                results.push(evaluation);
            }
        }

        // Sắp xếp theo điểm giảm dần
        results.sort((a, b) => b.score - a.score);

        return results;
    }

    // Lấy tổng quan tháng
    function getMonthOverview(year, month, eventType) {
        const results = [];
        const daysInMonth = new Date(year, month, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const evaluation = evaluateDay(year, month, day, eventType, null);
            if (evaluation) {
                results.push({
                    day: day,
                    score: evaluation.score,
                    rating: evaluation.rating,
                    isHoangDao: evaluation.saoNgay.type === 'hoangDao',
                    truc: evaluation.truc.name
                });
            }
        }

        return results;
    }

    // Public API
    return {
        TRUC: TRUC,
        SAO_NGAY: SAO_NGAY,
        SU_KIEN: SU_KIEN,

        getTruc: getTruc,
        isHoangDao: isHoangDao,
        getSaoNgay: getSaoNgay,
        getGioHoangDao: getGioHoangDao,
        checkBadDays: checkBadDays,
        evaluateDay: evaluateDay,
        findGoodDays: findGoodDays,
        getMonthOverview: getMonthOverview
    };
})();

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NgayTotEngine;
}
