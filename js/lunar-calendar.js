/**
 * LUNAR CALENDAR ENGINE
 * Chuyển đổi Dương lịch sang Âm lịch và tính Can Chi
 * Minh Phước Feng Shui
 */

const LunarCalendar = (function () {
    // Thiên Can (10 Can)
    const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];

    // Địa Chi (12 Chi)
    const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

    // 12 Giờ theo Chi
    const GIO_CHI = [
        { name: 'Tý', start: 23, end: 1 },
        { name: 'Sửu', start: 1, end: 3 },
        { name: 'Dần', start: 3, end: 5 },
        { name: 'Mão', start: 5, end: 7 },
        { name: 'Thìn', start: 7, end: 9 },
        { name: 'Tỵ', start: 9, end: 11 },
        { name: 'Ngọ', start: 11, end: 13 },
        { name: 'Mùi', start: 13, end: 15 },
        { name: 'Thân', start: 15, end: 17 },
        { name: 'Dậu', start: 17, end: 19 },
        { name: 'Tuất', start: 19, end: 21 },
        { name: 'Hợi', start: 21, end: 23 }
    ];

    // Ngũ Hành
    const NGU_HANH = ['Kim', 'Thủy', 'Hỏa', 'Thổ', 'Mộc'];

    // Nạp Âm (60 năm giáp tử)
    const NAP_AM = [
        'Hải Trung Kim', 'Hải Trung Kim', 'Lư Trung Hỏa', 'Lư Trung Hỏa',
        'Đại Lâm Mộc', 'Đại Lâm Mộc', 'Lộ Bàng Thổ', 'Lộ Bàng Thổ',
        'Kiếm Phong Kim', 'Kiếm Phong Kim', 'Sơn Đầu Hỏa', 'Sơn Đầu Hỏa',
        'Giản Hạ Thủy', 'Giản Hạ Thủy', 'Thành Đầu Thổ', 'Thành Đầu Thổ',
        'Bạch Lạp Kim', 'Bạch Lạp Kim', 'Dương Liễu Mộc', 'Dương Liễu Mộc',
        'Tuyền Trung Thủy', 'Tuyền Trung Thủy', 'Ốc Thượng Thổ', 'Ốc Thượng Thổ',
        'Tích Lịch Hỏa', 'Tích Lịch Hỏa', 'Tùng Bách Mộc', 'Tùng Bách Mộc',
        'Trường Lưu Thủy', 'Trường Lưu Thủy', 'Sa Trung Kim', 'Sa Trung Kim',
        'Sơn Hạ Hỏa', 'Sơn Hạ Hỏa', 'Bình Địa Mộc', 'Bình Địa Mộc',
        'Bích Thượng Thổ', 'Bích Thượng Thổ', 'Kim Bạch Kim', 'Kim Bạch Kim',
        'Phú Đăng Hỏa', 'Phú Đăng Hỏa', 'Thiên Hà Thủy', 'Thiên Hà Thủy',
        'Đại Trạch Thổ', 'Đại Trạch Thổ', 'Thoa Xuyến Kim', 'Thoa Xuyến Kim',
        'Tang Đố Mộc', 'Tang Đố Mộc', 'Đại Khê Thủy', 'Đại Khê Thủy',
        'Sa Trung Thổ', 'Sa Trung Thổ', 'Thiên Thượng Hỏa', 'Thiên Thượng Hỏa',
        'Thạch Lựu Mộc', 'Thạch Lựu Mộc', 'Đại Hải Thủy', 'Đại Hải Thủy'
    ];

    // Lunar month days for leap calculation
    const LUNAR_MONTH_DAYS = [29, 30];

    // Thông tin tháng âm lịch (từ 1900-2100)
    // Format: 16-bit số, bit 0-11 cho 12 tháng (0=29 ngày, 1=30 ngày), bit 12-15 cho tháng nhuận
    const LUNAR_INFO = [
        0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
        0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
        0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
        0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
        0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
        0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
        0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
        0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
        0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
        0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
        0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
        0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
        0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
        0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
        0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
        0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,
        0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,
        0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,
        0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,
        0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,
        0x0d520
    ];

    // Tính số ngày trong tháng âm lịch
    function getLunarMonthDays(year, month) {
        if (month > 12 || month < 1) return -1;
        return (LUNAR_INFO[year - 1900] & (0x10000 >> month)) ? 30 : 29;
    }

    // Tính tháng nhuận và số ngày
    function getLeapMonth(year) {
        return LUNAR_INFO[year - 1900] & 0xf;
    }

    function getLeapMonthDays(year) {
        if (getLeapMonth(year)) {
            return (LUNAR_INFO[year - 1900] & 0x10000) ? 30 : 29;
        }
        return 0;
    }

    // Tính tổng số ngày trong năm âm lịch
    function getLunarYearDays(year) {
        let sum = 348;
        for (let i = 0x8000; i > 0x8; i >>= 1) {
            sum += (LUNAR_INFO[year - 1900] & i) ? 1 : 0;
        }
        return sum + getLeapMonthDays(year);
    }

    // Chuyển đổi Dương lịch sang Âm lịch
    function solarToLunar(year, month, day) {
        if (year < 1900 || year > 2100) return null;

        // Tính offset từ ngày 30/1/1900 (ngày 1/1/1900 âm lịch)
        let baseDate = new Date(1900, 0, 31);
        let targetDate = new Date(year, month - 1, day);
        let offset = Math.floor((targetDate - baseDate) / 86400000);

        let lunarYear = 1900;
        let lunarMonth = 1;
        let lunarDay = 1;
        let isLeap = false;

        // Tìm năm âm lịch
        let yearDays = getLunarYearDays(lunarYear);
        while (offset >= yearDays) {
            offset -= yearDays;
            lunarYear++;
            yearDays = getLunarYearDays(lunarYear);
        }

        // Tìm tháng âm lịch
        let leapMonth = getLeapMonth(lunarYear);
        let hasLeapPassed = false;

        for (let i = 1; i <= 12; i++) {
            let monthDays;

            if (leapMonth > 0 && i === leapMonth + 1 && !hasLeapPassed) {
                monthDays = getLeapMonthDays(lunarYear);
                hasLeapPassed = true;
                i--;
                isLeap = true;
            } else {
                monthDays = getLunarMonthDays(lunarYear, i);
                isLeap = false;
            }

            if (offset < monthDays) {
                lunarMonth = i;
                lunarDay = offset + 1;
                break;
            }
            offset -= monthDays;
        }

        return {
            year: lunarYear,
            month: lunarMonth,
            day: lunarDay,
            isLeap: isLeap
        };
    }

    // Tính Can Chi của năm
    function getYearCanChi(year) {
        const canIndex = (year - 4) % 10;
        const chiIndex = (year - 4) % 12;
        return {
            can: CAN[canIndex],
            chi: CHI[chiIndex],
            canIndex: canIndex,
            chiIndex: chiIndex,
            full: CAN[canIndex] + ' ' + CHI[chiIndex]
        };
    }

    // Tính Can Chi của tháng
    function getMonthCanChi(year, month) {
        // Can của tháng dựa vào năm
        const yearCan = (year - 4) % 10;
        const monthCanBase = (yearCan % 5) * 2;
        const canIndex = (monthCanBase + month - 1) % 10;
        const chiIndex = (month + 1) % 12;

        return {
            can: CAN[canIndex],
            chi: CHI[chiIndex],
            canIndex: canIndex,
            chiIndex: chiIndex,
            full: CAN[canIndex] + ' ' + CHI[chiIndex]
        };
    }

    // Tính Can Chi của ngày (cần ngày Julius)
    function getDayCanChi(year, month, day) {
        // Công thức tính ngày Julius đơn giản
        const a = Math.floor((14 - month) / 12);
        const y = year - a;
        const m = month + 12 * a - 3;
        const jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

        const canIndex = (jd + 9) % 10;
        const chiIndex = (jd + 1) % 12;

        return {
            can: CAN[canIndex],
            chi: CHI[chiIndex],
            canIndex: canIndex,
            chiIndex: chiIndex,
            full: CAN[canIndex] + ' ' + CHI[chiIndex]
        };
    }

    // Tính Can Chi của giờ
    function getHourCanChi(dayCan, hourIndex) {
        // Can của giờ dựa vào Can của ngày
        const dayCanIndex = CAN.indexOf(dayCan);
        const hourCanBase = (dayCanIndex % 5) * 2;
        const canIndex = (hourCanBase + hourIndex) % 10;

        return {
            can: CAN[canIndex],
            chi: CHI[hourIndex],
            canIndex: canIndex,
            chiIndex: hourIndex,
            full: CAN[canIndex] + ' ' + CHI[hourIndex]
        };
    }

    // Lấy chỉ số của giờ (0-11 tương ứng Tý-Hợi)
    function getHourIndex(hour) {
        if (hour === 23 || hour === 0) return 0; // Tý
        return Math.floor((hour + 1) / 2);
    }

    // Tính Nạp Âm của năm
    function getNapAm(year) {
        const index = (year - 4) % 60;
        return NAP_AM[index];
    }

    // Lấy Ngũ Hành của Nạp Âm
    function getNguHanh(napAm) {
        if (napAm.includes('Kim')) return 'Kim';
        if (napAm.includes('Mộc')) return 'Mộc';
        if (napAm.includes('Thủy')) return 'Thủy';
        if (napAm.includes('Hỏa')) return 'Hỏa';
        if (napAm.includes('Thổ')) return 'Thổ';
        return '';
    }

    // Public API
    return {
        CAN: CAN,
        CHI: CHI,
        GIO_CHI: GIO_CHI,
        NGU_HANH: NGU_HANH,

        solarToLunar: solarToLunar,
        getYearCanChi: getYearCanChi,
        getMonthCanChi: getMonthCanChi,
        getDayCanChi: getDayCanChi,
        getHourCanChi: getHourCanChi,
        getHourIndex: getHourIndex,
        getNapAm: getNapAm,
        getNguHanh: getNguHanh,
        getLeapMonth: getLeapMonth
    };
})();

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LunarCalendar;
}
