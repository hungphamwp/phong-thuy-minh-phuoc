# Hướng Dẫn Cài Đặt EmailJS cho Chức Năng Quên Mật Khẩu

## Bước 1: Đăng ký tài khoản EmailJS (MIỄN PHÍ)

1. Truy cập: https://www.emailjs.com/
2. Click "Sign Up" → Đăng ký tài khoản miễn phí
3. Xác nhận email

## Bước 2: Kết nối Email Service

1. Đăng nhập vào EmailJS Dashboard
2. Click "Add New Service"
3. Chọn Email Provider (khuyến nghị: **Gmail**)
4. Làm theo hướng dẫn để kết nối Gmail:
   - Nhập email Gmail của bạn
   - Click "Connect Account" → Đăng nhập Gmail
   - Cho phép EmailJS truy cập
5. Lưu lại **Service ID** (ví dụ: `service_abc1234`)

## Bước 3: Tạo Email Template

1. Vào tab "Email Templates"
2. Click "Create New Template"
3. Điền thông tin template:

**Template Name:** Reset Password - Minh Phước Feng Shui

**Subject:**
```
Đặt Lại Mật Khẩu - {{website_name}}
```

**Content (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #E31B23, #C41E3A); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; }
        .password-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #E31B23; border-radius: 5px; }
        .password { font-size: 24px; font-weight: bold; color: #E31B23; letter-spacing: 2px; font-family: monospace; }
        .footer { background: #333; color: #ccc; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px; }
        .btn { display: inline-block; background: #E31B23; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Đặt Lại Mật Khẩu</h1>
            <p>{{website_name}}</p>
        </div>

        <div class="content">
            <p>Xin chào <strong>{{to_name}}</strong>,</p>

            <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản <strong>{{to_email}}</strong></p>

            <div class="password-box">
                <p style="margin: 0 0 10px 0; color: #666;">Mật khẩu mới của bạn là:</p>
                <div class="password">{{new_password}}</div>
            </div>

            <div class="warning">
                ⚠️ <strong>Lưu ý:</strong> Đây là mật khẩu tạm thời. Vui lòng đăng nhập và đổi mật khẩu mới ngay lập tức để đảm bảo an toàn.
            </div>

            <p style="text-align: center;">
                <a href="https://hungphamwp.github.io/phong-thuy-minh-phuoc/" class="btn">Đăng Nhập Ngay</a>
            </p>

            <p style="margin-top: 30px; color: #666; font-size: 14px;">
                Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này hoặc liên hệ với chúng tôi ngay.
            </p>
        </div>

        <div class="footer">
            <p><strong>Minh Phước Feng Shui</strong></p>
            <p>Phong Thủy Chuyên Nghiệp - Tử Vi - Xem Ngày</p>
            <p>📧 Email: Contact.minhphuocfs@gmail.com | 📞 Hotline: 0888 081 050</p>
            <p style="margin-top: 15px; color: #999;">
                Email này được gửi tự động, vui lòng không trả lời.
            </p>
        </div>
    </div>
</body>
</html>
```

4. Save Template
5. Lưu lại **Template ID** (ví dụ: `template_xyz5678`)

## Bước 4: Lấy Public Key

1. Vào tab "Account" → "General"
2. Tìm phần "API Keys"
3. Copy **Public Key** (ví dụ: `AbCdEfGhIjKlMnOp`)

## Bước 5: Cập Nhật Code

Mở file `index.html`, tìm dòng 636 và 711, thay thế:

```javascript
// Dòng 636 - Thay YOUR_PUBLIC_KEY
emailjs.init({
    publicKey: "AbCdEfGhIjKlMnOp", // Thay bằng Public Key của bạn
});

// Dòng 711 - Thay YOUR_SERVICE_ID và YOUR_TEMPLATE_ID
emailjs.send('service_abc1234', 'template_xyz5678', templateParams)
```

## Bước 6: Test

1. Mở website
2. Click "Đăng Nhập" → "Quên mật khẩu?"
3. Nhập email đã đăng ký
4. Click "Gửi Mật Khẩu Mới"
5. Kiểm tra hộp thư email (cả Inbox và Spam)

## Giới Hạn Miễn Phí

EmailJS Free Plan:
- ✅ 200 emails/tháng
- ✅ 2 email services
- ✅ 1 template
- ✅ Đủ cho website nhỏ

Nếu cần nhiều hơn, nâng cấp lên Personal Plan ($15/tháng) cho 10,000 emails.

## Lưu Ý Bảo Mật

⚠️ **QUAN TRỌNG:**
- Public Key có thể public (đã có trong code)
- **KHÔNG BAO GIỜ** để lộ Private Key
- Service ID và Template ID không phải là bí mật
- Mật khẩu tạm thời được tạo ngẫu nhiên 10 ký tự

## Troubleshooting

### Email không được gửi
1. Kiểm tra Service ID và Template ID đúng chưa
2. Kiểm tra Public Key đúng chưa
3. Xem Console log trong trình duyệt (F12)
4. Kiểm tra Monthly Quota (200 emails/tháng)

### Email vào Spam
1. Vào EmailJS Dashboard → Settings
2. Bật "Verify Domain" để email không vào spam
3. Hoặc thêm email gửi vào danh sách contact

## Hỗ Trợ

- EmailJS Docs: https://www.emailjs.com/docs/
- EmailJS Support: support@emailjs.com
- Dashboard: https://dashboard.emailjs.com/

---

**Tạo bởi:** Claude Code
**Ngày cập nhật:** 11/01/2026
