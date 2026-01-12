/**
 * Lịch Vạn Sự - Vietnamese Lunar Calendar
 * Giống mẫu phongthuylamphong.com 100%
 */

// ==================== LUNAR CALENDAR CALCULATIONS ====================

const PI = Math.PI;
const TIMEZONE = 7.0;

function jdFromDate(dd, mm, yy) {
    let a = Math.floor((14 - mm) / 12);
    let y = yy + 4800 - a;
    let m = mm + 12 * a - 3;
    let jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    if (jd < 2299161) {
        jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
    }
    return jd;
}

function getNewMoonDay(k) {
    let T = k / 1236.85;
    let T2 = T * T;
    let T3 = T2 * T;
    let dr = PI / 180;
    let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
    Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
    let M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
    let Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
    let F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
    let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
    C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
    C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
    C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
    C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
    C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
    C1 = C1 + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
    let deltat;
    if (T < -11) {
        deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
    } else {
        deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
    }
    return Math.floor(Jd1 + C1 - deltat + 0.5 + TIMEZONE / 24);
}

function getSunLongitude(jdn) {
    let T = (jdn - 2451545.5 - TIMEZONE / 24) / 36525;
    let T2 = T * T;
    let dr = PI / 180;
    let M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
    let L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
    let DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
    DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
    let L = L0 + DL;
    L = L * dr;
    L = L - PI * 2 * (Math.floor(L / (PI * 2)));
    return Math.floor(L / PI * 6);
}

function getLunarMonth11(yy) {
    let off = jdFromDate(31, 12, yy) - 2415021;
    let k = Math.floor(off / 29.530588853);
    let nm = getNewMoonDay(k);
    let sunLong = getSunLongitude(nm);
    if (sunLong >= 9) {
        nm = getNewMoonDay(k - 1);
    }
    return nm;
}

function getLeapMonthOffset(a11) {
    let k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
    let last = 0;
    let i = 1;
    let arc = getSunLongitude(getNewMoonDay(k + i));
    do {
        last = arc;
        i++;
        arc = getSunLongitude(getNewMoonDay(k + i));
    } while (arc != last && i < 14);
    return i - 1;
}

function convertSolar2Lunar(dd, mm, yy) {
    let dayNumber = jdFromDate(dd, mm, yy);
    let k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
    let monthStart = getNewMoonDay(k + 1);
    if (monthStart > dayNumber) {
        monthStart = getNewMoonDay(k);
    }
    let a11 = getLunarMonth11(yy);
    let b11 = a11;
    let lunarYear;
    if (a11 >= monthStart) {
        lunarYear = yy;
        a11 = getLunarMonth11(yy - 1);
    } else {
        lunarYear = yy + 1;
        b11 = getLunarMonth11(yy + 1);
    }
    let lunarDay = dayNumber - monthStart + 1;
    let diff = Math.floor((monthStart - a11) / 29);
    let lunarLeap = 0;
    let lunarMonth = diff + 11;
    if (b11 - a11 > 365) {
        let leapMonthDiff = getLeapMonthOffset(a11);
        if (diff >= leapMonthDiff) {
            lunarMonth = diff + 10;
            if (diff == leapMonthDiff) {
                lunarLeap = 1;
            }
        }
    }
    if (lunarMonth > 12) {
        lunarMonth = lunarMonth - 12;
    }
    if (lunarMonth >= 11 && diff < 4) {
        lunarYear -= 1;
    }
    return [lunarDay, lunarMonth, lunarYear, lunarLeap];
}

// ==================== CAN CHI ====================

const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const CHI_HOUR_TIME = ['23-01', '01-03', '03-05', '05-07', '07-09', '09-11', '11-13', '13-15', '15-17', '17-19', '19-21', '21-23'];

const THAP_NHI_TRUC = ['Kiến', 'Trừ', 'Mãn', 'Bình', 'Định', 'Chấp', 'Phá', 'Nguy', 'Thành', 'Thu', 'Khai', 'Bế'];
const THAP_NHI_TRUC_INFO = {
    'Kiến': { type: 'hung', desc: 'Xấu - Không nên động thổ, xây dựng' },
    'Trừ': { type: 'cat', desc: 'Tốt - Trừ bỏ, dọn dẹp, cúng tế' },
    'Mãn': { type: 'cat', desc: 'Tốt - Khai trương, cưới hỏi, ký kết' },
    'Bình': { type: 'cat', desc: 'Tốt - Bình an, mọi việc hanh thông' },
    'Định': { type: 'cat', desc: 'Tốt - Định đoạt, ký kết hợp đồng' },
    'Chấp': { type: 'trung', desc: 'Trung bình - Xây dựng, sửa chữa' },
    'Phá': { type: 'hung', desc: 'Xấu - Không nên làm việc lớn' },
    'Nguy': { type: 'hung', desc: 'Xấu - Cẩn thận tai nạn, không đi xa' },
    'Thành': { type: 'cat', desc: 'Tốt - Mọi việc thành công' },
    'Thu': { type: 'trung', desc: 'Trung bình - Thu hoạch, cất giữ' },
    'Khai': { type: 'cat', desc: 'Tốt - Khai trương, khởi sự' },
    'Bế': { type: 'hung', desc: 'Xấu - Không khởi sự việc mới' }
};

const NHI_THAP_BAT_TU = [
    'Giác Mộc Giao', 'Cang Kim Long', 'Đê Thổ Lạc', 'Phòng Nhật Thố', 'Tâm Nguyệt Hồ', 'Vĩ Hỏa Hổ', 'Cơ Thủy Báo',
    'Đẩu Mộc Giải', 'Ngưu Kim Ngưu', 'Nữ Thổ Bức', 'Hư Nhật Thử', 'Nguy Nguyệt Yến', 'Thất Hỏa Trư', 'Bích Thủy Du',
    'Khuê Mộc Lang', 'Lâu Kim Cẩu', 'Vị Thổ Trĩ', 'Mão Nhật Kê', 'Tất Nguyệt Ô', 'Chủy Hỏa Hầu', 'Sâm Thủy Viên',
    'Tỉnh Mộc Hoàn', 'Quỷ Kim Dương', 'Liễu Thổ Chương', 'Tinh Nhật Mã', 'Trương Nguyệt Lộc', 'Dực Hỏa Xà', 'Chẩn Thủy Trùng'
];

const TIET_KHI = [
    'Tiểu Hàn', 'Đại Hàn', 'Lập Xuân', 'Vũ Thủy', 'Kinh Trập', 'Xuân Phân',
    'Thanh Minh', 'Cốc Vũ', 'Lập Hạ', 'Tiểu Mãn', 'Mang Chủng', 'Hạ Chí',
    'Tiểu Thử', 'Đại Thử', 'Lập Thu', 'Xử Thử', 'Bạch Lộ', 'Thu Phân',
    'Hàn Lộ', 'Sương Giáng', 'Lập Đông', 'Tiểu Tuyết', 'Đại Tuyết', 'Đông Chí'
];

const NAP_AM = [
    'Hải Trung Kim', 'Lư Trung Hỏa', 'Đại Lâm Mộc', 'Lộ Bàng Thổ', 'Kiếm Phong Kim', 'Sơn Đầu Hỏa',
    'Giản Hạ Thủy', 'Thành Đầu Thổ', 'Bạch Lạp Kim', 'Dương Liễu Mộc', 'Tuyền Trung Thủy', 'Ốc Thượng Thổ',
    'Tích Lịch Hỏa', 'Tùng Bách Mộc', 'Trường Lưu Thủy', 'Sa Trung Kim', 'Sơn Hạ Hỏa', 'Bình Địa Mộc',
    'Bích Thượng Thổ', 'Kim Bạc Kim', 'Phú Đăng Hỏa', 'Thiên Hà Thủy', 'Đại Dịch Thổ', 'Thoa Xuyến Kim',
    'Tang Đố Mộc', 'Đại Khê Thủy', 'Sa Trung Thổ', 'Thiên Thượng Hỏa', 'Thạch Lựu Mộc', 'Đại Hải Thủy'
];

const HAC_DAO = ['Thanh Long', 'Minh Đường', 'Thiên Hình', 'Chu Tước', 'Kim Quỹ', 'Thiên Đức',
    'Bạch Hổ', 'Ngọc Đường', 'Thiên Lao', 'Huyền Vũ', 'Tư Mệnh', 'Câu Trận'];
const HOANG_DAO_NAMES = ['Thanh Long', 'Minh Đường', 'Kim Quỹ', 'Thiên Đức', 'Ngọc Đường', 'Tư Mệnh'];

const LUC_NHAM = ['Đại An', 'Lưu Niên', 'Tốc Hỷ', 'Xích Khẩu', 'Tiểu Cát', 'Không Vong'];

const CAT_TINH_LIST = ['Thiên Đức', 'Nguyệt Đức', 'Thiên Ân', 'Thiên Quý', 'Phúc Sinh', 'Thiên Hỷ', 'Lộc Mã',
    'Thiên Tài', 'Địa Tài', 'Tam Hợp', 'Lục Hợp', 'Thiên Thành'];
const HUNG_TINH_LIST = ['Thiên Cương', 'Tử Phù', 'Đại Hao', 'Tiểu Hao', 'Ngũ Quỷ', 'Bạch Hổ', 'Huyền Vũ',
    'Thiên Hình', 'Địa Phá', 'Nguyệt Phá'];

const HUONG_LIST = ['Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc', 'Bắc', 'Đông Bắc'];

// ==================== CALCULATION FUNCTIONS ====================

function getCanChi(jd) {
    let can = (jd + 9) % 10;
    let chi = (jd + 1) % 12;
    return { can: can, chi: chi, canChi: CAN[can] + ' ' + CHI[chi] };
}

function getCanChiYear(year) {
    let can = (year + 6) % 10;
    let chi = (year + 8) % 12;
    return CAN[can] + ' ' + CHI[chi];
}

function getCanChiMonth(month, year) {
    let yearCan = (year + 6) % 10;
    let monthCan = (yearCan * 2 + month) % 10;
    let monthChi = (month + 1) % 12;
    return CAN[monthCan] + ' ' + CHI[monthChi];
}

function getCanChiHour(jd) {
    let dayCan = (jd + 9) % 10;
    let hourCan = (dayCan * 2) % 10;
    return CAN[hourCan] + ' ' + CHI[0]; // Giờ Tý
}

function getThapNhiTruc(lunarDay, lunarMonth) {
    let index = (lunarDay + lunarMonth - 2) % 12;
    let truc = THAP_NHI_TRUC[index];
    return { name: truc, ...THAP_NHI_TRUC_INFO[truc] };
}

function getNhiThapBatTu(jd) {
    let index = (jd + 11) % 28;
    return NHI_THAP_BAT_TU[index];
}

function getTietKhi(jd) {
    let sunLong = getSunLongitude(jd);
    return TIET_KHI[sunLong * 2] || TIET_KHI[0];
}

function getNapAm(jd) {
    let index = jd % 30;
    return NAP_AM[index];
}

function getHacDao(jd) {
    let index = jd % 12;
    return HAC_DAO[index];
}

function getLucNham(lunarDay) {
    let index = (lunarDay - 1) % 6;
    return LUC_NHAM[index];
}

function isHoangDao(hacDao) {
    return HOANG_DAO_NAMES.includes(hacDao);
}

// Giờ Hoàng Đạo cho mỗi ngày
function getHoangDaoHours(dayChi) {
    const HOANG_DAO_MAP = {
        'Tý': [0, 1, 4, 5, 8, 9],
        'Ngọ': [0, 1, 4, 5, 8, 9],
        'Sửu': [2, 3, 6, 7, 10, 11],
        'Mùi': [2, 3, 6, 7, 10, 11],
        'Dần': [0, 1, 4, 5, 8, 9],
        'Thân': [0, 1, 4, 5, 8, 9],
        'Mão': [2, 3, 6, 7, 10, 11],
        'Dậu': [2, 3, 6, 7, 10, 11],
        'Thìn': [0, 1, 4, 5, 8, 9],
        'Tuất': [0, 1, 4, 5, 8, 9],
        'Tỵ': [2, 3, 6, 7, 10, 11],
        'Hợi': [2, 3, 6, 7, 10, 11]
    };
    return HOANG_DAO_MAP[dayChi] || [0, 1, 4, 5, 8, 9];
}

function getTuoiXung(jd) {
    let dayChi = (jd + 1) % 12;
    let xungChi = (dayChi + 6) % 12;
    return CHI[xungChi];
}

function getTamHop(jd) {
    let dayChi = (jd + 1) % 12;
    let tamHop = [(dayChi + 4) % 12, (dayChi + 8) % 12];
    return [CHI[tamHop[0]], CHI[tamHop[1]], CHI[dayChi]];
}

function getCatTinh(jd, lunarMonth) {
    let result = [];
    let startIndex = jd % CAT_TINH_LIST.length;
    for (let i = 0; i < 4; i++) {
        result.push(CAT_TINH_LIST[(startIndex + i * 2) % CAT_TINH_LIST.length]);
    }
    return result;
}

function getHungTinh(jd, lunarMonth) {
    let result = [];
    let startIndex = (jd + 3) % HUNG_TINH_LIST.length;
    for (let i = 0; i < 3; i++) {
        result.push(HUNG_TINH_LIST[(startIndex + i * 2) % HUNG_TINH_LIST.length]);
    }
    return result;
}

function getHuongXuatHanh(jd) {
    let index = jd % 8;
    let tot = [HUONG_LIST[index], HUONG_LIST[(index + 2) % 8], HUONG_LIST[(index + 4) % 8]];
    let xau = [HUONG_LIST[(index + 1) % 8], HUONG_LIST[(index + 5) % 8]];
    return { tot, xau };
}

function getDayInfo(dd, mm, yy) {
    let jd = jdFromDate(dd, mm, yy);
    let lunar = convertSolar2Lunar(dd, mm, yy);
    let canChi = getCanChi(jd);
    let dayChi = CHI[(jd + 1) % 12];
    let hacDao = getHacDao(jd);

    return {
        solar: { day: dd, month: mm, year: yy },
        lunar: { day: lunar[0], month: lunar[1], year: lunar[2], leap: lunar[3] },
        jd: jd,
        canChi: canChi,
        canChiYear: getCanChiYear(lunar[2]),
        canChiMonth: getCanChiMonth(lunar[1], lunar[2]),
        canChiHour: getCanChiHour(jd),
        dayChi: dayChi,
        thapNhiTruc: getThapNhiTruc(lunar[0], lunar[1]),
        nhiThapBatTu: getNhiThapBatTu(jd),
        tietKhi: getTietKhi(jd),
        napAm: getNapAm(jd),
        hacDao: hacDao,
        isHoangDao: isHoangDao(hacDao),
        lucNham: getLucNham(lunar[0]),
        hoangDaoHours: getHoangDaoHours(dayChi),
        tuoiXung: getTuoiXung(jd),
        tamHop: getTamHop(jd),
        catTinh: getCatTinh(jd, lunar[1]),
        hungTinh: getHungTinh(jd, lunar[1]),
        huong: getHuongXuatHanh(jd),
        dayOfWeek: getDayOfWeek(jd)
    };
}

function getDayOfWeek(jd) {
    const DAYS = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];
    return DAYS[jd % 7];
}

function getLunarMonthName(month) {
    const names = ['Giêng', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín', 'Mười', 'Mười Một', 'Chạp'];
    return names[month - 1] || month;
}

function getLunarDayName(day) {
    if (day <= 10) {
        const names = ['Mùng 1', 'Mùng 2', 'Mùng 3', 'Mùng 4', 'Mùng 5', 'Mùng 6', 'Mùng 7', 'Mùng 8', 'Mùng 9', 'Mùng 10'];
        return names[day - 1];
    }
    return day.toString();
}

// ==================== CALENDAR GENERATION ====================

function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function getFirstDayOfMonth(month, year) {
    return new Date(year, month - 1, 1).getDay();
}

function generateCalendarData(month, year) {
    let daysInMonth = getDaysInMonth(month, year);
    let firstDay = getFirstDayOfMonth(month, year);
    let days = [];

    let prevMonth = month === 1 ? 12 : month - 1;
    let prevYear = month === 1 ? year - 1 : year;
    let prevDays = getDaysInMonth(prevMonth, prevYear);

    let startDay = firstDay === 0 ? 6 : firstDay - 1;

    for (let i = startDay - 1; i >= 0; i--) {
        let day = prevDays - i;
        let lunar = convertSolar2Lunar(day, prevMonth, prevYear);
        days.push({
            day: day, month: prevMonth, year: prevYear,
            lunar: lunar[0], lunarMonth: lunar[1],
            isCurrentMonth: false
        });
    }

    for (let i = 1; i <= daysInMonth; i++) {
        let lunar = convertSolar2Lunar(i, month, year);
        let jd = jdFromDate(i, month, year);
        days.push({
            day: i, month: month, year: year,
            lunar: lunar[0], lunarMonth: lunar[1], lunarYear: lunar[2],
            isCurrentMonth: true,
            canChi: getCanChi(jd).canChi
        });
    }

    let nextMonth = month === 12 ? 1 : month + 1;
    let nextYear = month === 12 ? year + 1 : year;
    let remaining = 42 - days.length;

    for (let i = 1; i <= remaining; i++) {
        let lunar = convertSolar2Lunar(i, nextMonth, nextYear);
        days.push({
            day: i, month: nextMonth, year: nextYear,
            lunar: lunar[0], lunarMonth: lunar[1],
            isCurrentMonth: false
        });
    }

    return days;
}

// ==================== UI RENDERING ====================

let currentMonth, currentYear, selectedDate;

function initLichVanSu() {
    const today = new Date();
    currentMonth = today.getMonth() + 1;
    currentYear = today.getFullYear();
    selectedDate = {
        day: today.getDate(),
        month: currentMonth,
        year: currentYear
    };

    initSelectors();
    renderCalendar();
    renderDayInfo();
    setupEventListeners();
}

function initSelectors() {
    // Days
    const daySelect = document.getElementById('lvs-day-select');
    if (daySelect) {
        daySelect.innerHTML = '';
        for (let i = 1; i <= 31; i++) {
            daySelect.innerHTML += `<option value="${i}">${i}</option>`;
        }
        daySelect.value = selectedDate.day;
    }

    // Month
    const monthSelect = document.getElementById('lvs-month-select');
    if (monthSelect) {
        monthSelect.value = selectedDate.month;
    }

    // Years
    const yearSelect = document.getElementById('lvs-year-select');
    if (yearSelect) {
        yearSelect.innerHTML = '';
        for (let i = currentYear - 100; i <= currentYear + 50; i++) {
            yearSelect.innerHTML += `<option value="${i}">${i}</option>`;
        }
        yearSelect.value = selectedDate.year;
    }
}

function renderCalendar() {
    const calendarGrid = document.getElementById('lvs-calendar-grid');
    const monthLabel = document.getElementById('lvs-month-year-label');

    if (!calendarGrid) return;

    if (monthLabel) {
        monthLabel.textContent = `Tháng ${currentMonth}, ${currentYear}`;
    }

    const days = generateCalendarData(currentMonth, currentYear);

    let html = '';
    days.forEach((day, index) => {
        let isToday = day.day === new Date().getDate() &&
            day.month === new Date().getMonth() + 1 &&
            day.year === new Date().getFullYear() &&
            day.isCurrentMonth;
        let isSelected = day.day === selectedDate.day &&
            day.month === selectedDate.month &&
            day.year === selectedDate.year;

        let classes = ['lvs-day'];
        if (!day.isCurrentMonth) classes.push('other-month');
        if (isToday) classes.push('today');
        if (isSelected) classes.push('selected');
        if (index % 7 === 5 || index % 7 === 6) classes.push('weekend');

        html += `
            <div class="${classes.join(' ')}" data-day="${day.day}" data-month="${day.month}" data-year="${day.year}">
                <span class="solar">${day.day}</span>
                <span class="lunar">${day.lunar}${day.lunar === 1 ? '/' + day.lunarMonth : ''}</span>
            </div>
        `;
    });

    calendarGrid.innerHTML = html;

    document.querySelectorAll('.lvs-day').forEach(dayEl => {
        dayEl.addEventListener('click', function () {
            selectedDate = {
                day: parseInt(this.dataset.day),
                month: parseInt(this.dataset.month),
                year: parseInt(this.dataset.year)
            };

            if (selectedDate.month !== currentMonth || selectedDate.year !== currentYear) {
                currentMonth = selectedDate.month;
                currentYear = selectedDate.year;
            }

            updateSelectors();
            renderCalendar();
            renderDayInfo();
        });
    });
}

function updateSelectors() {
    const daySelect = document.getElementById('lvs-day-select');
    const monthSelect = document.getElementById('lvs-month-select');
    const yearSelect = document.getElementById('lvs-year-select');

    if (daySelect) daySelect.value = selectedDate.day;
    if (monthSelect) monthSelect.value = selectedDate.month;
    if (yearSelect) yearSelect.value = selectedDate.year;
}

function renderDayInfo() {
    const info = getDayInfo(selectedDate.day, selectedDate.month, selectedDate.year);

    // Big Day Number
    const bigDay = document.getElementById('lvs-big-day');
    if (bigDay) bigDay.textContent = info.solar.day;

    // Lunar Date
    const lunarDate = document.getElementById('lvs-lunar-date');
    if (lunarDate) {
        lunarDate.textContent = `${getLunarDayName(info.lunar.day)} tháng ${getLunarMonthName(info.lunar.month)}`;
    }

    // Can Chi
    const gioCanChi = document.getElementById('lvs-gio-canchi');
    if (gioCanChi) gioCanChi.textContent = info.canChiHour;

    const ngayCanChi = document.getElementById('lvs-ngay-canchi');
    if (ngayCanChi) ngayCanChi.textContent = info.canChi.canChi;

    const thangCanChi = document.getElementById('lvs-thang-canchi');
    if (thangCanChi) thangCanChi.textContent = info.canChiMonth;

    const namCanChi = document.getElementById('lvs-nam-canchi');
    if (namCanChi) namCanChi.textContent = info.canChiYear;

    // Tiết khí
    const tietKhi = document.getElementById('lvs-tiet-khi');
    if (tietKhi) tietKhi.textContent = info.tietKhi;

    // Nạp âm
    const napAm = document.getElementById('lvs-nap-am');
    if (napAm) napAm.textContent = info.napAm;

    // Hắc đạo / Hoàng đạo
    const hacDao = document.getElementById('lvs-hac-dao');
    if (hacDao) {
        hacDao.textContent = info.hacDao;
        hacDao.className = 'tag-value ' + (info.isHoangDao ? 'cyan' : 'red');
    }

    // Lục nhâm
    const lucNham = document.getElementById('lvs-luc-nham');
    if (lucNham) lucNham.textContent = info.lucNham;

    // Thập nhị trực
    const truc = document.getElementById('lvs-truc');
    if (truc) {
        truc.textContent = info.thapNhiTruc.name;
        truc.className = 'tag-value ' + (info.thapNhiTruc.type === 'cat' ? 'cyan' :
            info.thapNhiTruc.type === 'hung' ? 'red' : '');
    }

    // Hours Grid
    renderHoursGrid(info);

    // Detail Cards
    renderDetailCards(info);
}

function renderHoursGrid(info) {
    const grid = document.getElementById('lvs-hours-grid');
    if (!grid) return;

    let html = '';
    for (let i = 0; i < 12; i++) {
        let isHoangDao = info.hoangDaoHours.includes(i);
        let hourClass = isHoangDao ? 'hoang-dao' : 'hac-dao';
        let label = isHoangDao ? 'Hoàng đạo' : 'Hắc đạo';

        html += `
            <div class="lvs-hour ${hourClass}">
                <div class="hour-chi">${CHI[i]}</div>
                <div class="hour-time">${CHI_HOUR_TIME[i]}</div>
                <div class="hour-type">${label}</div>
            </div>
        `;
    }
    grid.innerHTML = html;
}

function renderDetailCards(info) {
    // Thập nhị trực detail
    const trucDetail = document.getElementById('lvs-thap-nhi-truc');
    if (trucDetail) {
        trucDetail.innerHTML = `
            <div class="card-value ${info.thapNhiTruc.type}">${info.thapNhiTruc.name}</div>
            <div class="card-desc">${info.thapNhiTruc.desc}</div>
        `;
    }

    // Tuổi Xung
    const tuoiXung = document.getElementById('lvs-tuoi-xung');
    if (tuoiXung) {
        tuoiXung.innerHTML = `
            <div class="card-value red">${info.tuoiXung}</div>
            <div class="card-desc">Tam hợp: ${info.tamHop.join(', ')}</div>
        `;
    }

    // Quẻ Mai Hoa
    const queMaiHoa = document.getElementById('lvs-que-mai-hoa');
    if (queMaiHoa) {
        const QUE = ['Càn', 'Đoài', 'Ly', 'Chấn', 'Tốn', 'Khảm', 'Cấn', 'Khôn'];
        let thuong = QUE[(info.lunar.month + info.lunar.day) % 8];
        let ha = QUE[(info.lunar.month + info.lunar.day + info.jd % 12) % 8];
        queMaiHoa.innerHTML = `<div class="card-value">${thuong} ${ha}</div>`;
    }

    // Nhị Thập Bát Tú
    const nhiThapBatTu = document.getElementById('lvs-nhi-thap-bat-tu');
    if (nhiThapBatTu) {
        nhiThapBatTu.innerHTML = `<div class="card-value">${info.nhiThapBatTu}</div>`;
    }

    // Hướng Tốt
    const huongTot = document.getElementById('lvs-huong-tot');
    if (huongTot) {
        huongTot.innerHTML = `<div class="card-value cyan">${info.huong.tot.join(', ')}</div>`;
    }

    // Hướng Xấu
    const huongXau = document.getElementById('lvs-huong-xau');
    if (huongXau) {
        huongXau.innerHTML = `<div class="card-value red">${info.huong.xau.join(', ')}</div>`;
    }

    // Cát Tình - Table format
    const catTinh = document.getElementById('lvs-cat-tinh');
    if (catTinh) {
        const cells = info.catTinh.map(t => `<div class="tinh-cell cat-tinh-cell">${t}</div>`).join('');
        catTinh.innerHTML = `<div class="tinh-table">${cells}</div>`;
    }

    // Hung Tình - Table format
    const hungTinh = document.getElementById('lvs-hung-tinh');
    if (hungTinh) {
        const cells = info.hungTinh.map(t => `<div class="tinh-cell hung-tinh-cell">${t}</div>`).join('');
        hungTinh.innerHTML = `<div class="tinh-table">${cells}</div>`;
    }
}

function setupEventListeners() {
    // Previous month
    const prevBtn = document.getElementById('lvs-prev-month');
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 1) { currentMonth = 12; currentYear--; }
            renderCalendar();
        });
    }

    // Next month
    const nextBtn = document.getElementById('lvs-next-month');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 12) { currentMonth = 1; currentYear++; }
            renderCalendar();
        });
    }

    // Today button
    const todayBtn = document.getElementById('lvs-today-btn');
    if (todayBtn) {
        todayBtn.addEventListener('click', goToToday);
    }

    // View button
    const viewBtn = document.getElementById('lvs-view-btn');
    if (viewBtn) {
        viewBtn.addEventListener('click', () => {
            const daySelect = document.getElementById('lvs-day-select');
            const monthSelect = document.getElementById('lvs-month-select');
            const yearSelect = document.getElementById('lvs-year-select');

            if (daySelect && monthSelect && yearSelect) {
                selectedDate = {
                    day: parseInt(daySelect.value),
                    month: parseInt(monthSelect.value),
                    year: parseInt(yearSelect.value)
                };
                currentMonth = selectedDate.month;
                currentYear = selectedDate.year;
                renderCalendar();
                renderDayInfo();
            }
        });
    }
}

function goToToday() {
    const today = new Date();
    currentMonth = today.getMonth() + 1;
    currentYear = today.getFullYear();
    selectedDate = {
        day: today.getDate(),
        month: currentMonth,
        year: currentYear
    };
    updateSelectors();
    renderCalendar();
    renderDayInfo();
}

// Initialize
document.addEventListener('DOMContentLoaded', initLichVanSu);
