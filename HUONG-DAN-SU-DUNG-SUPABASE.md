# Hướng Dẫn Sử Dụng Supabase Cho Website Phong Thủy

## 🎯 Tổng Quan

Website của bạn đã được tích hợp **Supabase Database**. Bài viết sẽ được lưu vào database thay vì localStorage.

---

## 📋 Các Bước Setup

### Bước 1: Chạy SQL Script Tạo Database

1. Đăng nhập **Supabase Dashboard**: https://supabase.com/dashboard
2. Chọn project: **hungphamwp's Project**
3. Click **SQL Editor** (menu bên trái)
4. Click **New query**
5. Mở file `database-schema.sql` trong thư mục dự án
6. Copy toàn bộ nội dung
7. Paste vào SQL Editor
8. Click **Run** (hoặc Ctrl/Cmd + Enter)
9. Chờ script chạy xong (~10-15 giây)

✅ **Kết quả**: Bạn sẽ có 10 bảng database mới trong project

### Bước 2: Kết Nối Supabase Với Website

#### Cách 1: Qua Task Manager (Khuyến nghị)

1. Mở file `task-manager.html` trong trình duyệt
2. Nhập thông tin:
   - **URL**: `https://kabojqukrwuhwyzbadic.supabase.co`
   - **Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (key đầy đủ bạn đã có)
3. Click **"Kết nối"**
4. Nếu thành công, thông tin sẽ được lưu vào localStorage

✅ **Sau bước này**: Tất cả trang admin sẽ tự động kết nối với Supabase

#### Cách 2: Thủ công (Backup)

Nếu cách 1 không hoạt động, mở Console (F12) và chạy:

```javascript
localStorage.setItem('supabaseUrl', 'https://kabojqukrwuhwyzbadic.supabase.co');
localStorage.setItem('supabaseKey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthYm9qcXVrcnd1aHd5emJhZGljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxMjY1OTksImV4cCI6MjA4MzcwMjU5OX0.XvGFTeMqgwmE4glGLBNsaHpNVLn0MFb6uFpfe5GDxB8');
```

---

## 📝 Cách Sử Dụng Admin Panel

### 1. Tạo Bài Viết Mới

1. Mở `admin-editor.html` hoặc click "Tạo Bài Viết Mới" trong admin panel
2. Điền thông tin:
   - **Tiêu đề**: Tên bài viết
   - **Nội dung**: Sử dụng editor để viết nội dung
   - **Danh mục**: Chọn từ dropdown (Phong Thủy, Tử Vi, Quỹ Khuyến Học...)
   - **Ảnh đại diện**: Upload hoặc paste URL
   - **Trạng thái**: Draft hoặc Published
3. Click **"Lưu Bài Viết"** hoặc **"Xuất Bản"**

✅ **Kết quả**:
- Bài viết sẽ được lưu vào bảng `blog_posts` trong Supabase
- Bạn sẽ thấy log trong Console: "Đã tạo bài viết thành công: [Tên bài viết]"

### 2. Xem Danh Sách Bài Viết

1. Mở `admin-posts.html`
2. Bạn sẽ thấy danh sách tất cả bài viết từ Supabase
3. Thông tin hiển thị:
   - Tiêu đề
   - Danh mục
   - Tác giả
   - Ngày đăng
   - Lượt xem
   - Trạng thái

### 3. Chỉnh Sửa Bài Viết

1. Trong `admin-posts.html`, click icon **Edit** (bút) ở bài viết
2. Trang editor sẽ mở với nội dung bài viết
3. Chỉnh sửa nội dung
4. Click **"Cập Nhật"**

✅ **Kết quả**: Bài viết được update trong database

### 4. Xóa Bài Viết

1. Click icon **Delete** (thùng rác)
2. Confirm xóa
3. Bài viết sẽ bị xóa khỏi database

---

## 🔍 Kiểm Tra Kết Nối

### Cách 1: Xem Console

1. Mở `admin-posts.html`
2. Nhấn F12 để mở Console
3. Bạn sẽ thấy các log:
   ```
   Đang kết nối Supabase...
   ✅ Đã kết nối Supabase thành công!
   BlogManager: Sử dụng Supabase
   Blog posts sẽ được lưu vào database
   ```

### Cách 2: Kiểm tra trực tiếp trong Supabase

1. Mở **Supabase Dashboard**
2. Click **Table Editor**
3. Click bảng `blog_posts`
4. Bạn sẽ thấy các bài viết đã lưu

---

## 🔄 Migration Dữ Liệu

Nếu bạn có bài viết trong localStorage, chúng sẽ **tự động migrate** sang Supabase:

1. Khi load trang admin lần đầu sau khi kết nối Supabase
2. Hệ thống sẽ kiểm tra localStorage
3. Nếu có data, sẽ tự động copy sang Supabase
4. Bạn sẽ thấy log: "Đang migrate dữ liệu từ localStorage sang Supabase..."

---

## 📊 Cấu Trúc Database

### Bảng `blog_posts`

```
id              UUID (Primary Key)
title           TEXT - Tiêu đề
slug            TEXT - URL-friendly slug
content         TEXT - Nội dung HTML
excerpt         TEXT - Tóm tắt
featured_image  TEXT - URL ảnh đại diện
category        TEXT - Danh mục (scholarship/fengshui/astrology/news/other)
tags            TEXT[] - Array các tag
author_id       UUID - ID tác giả
status          TEXT - Trạng thái (draft/published/archived)
view_count      INTEGER - Lượt xem
published_at    TIMESTAMP - Ngày xuất bản
created_at      TIMESTAMP - Ngày tạo
updated_at      TIMESTAMP - Ngày cập nhật
```

---

## 🎨 Mapping Categories

Website của bạn sử dụng tên tiếng Việt, nhưng database dùng English keys:

| Tên hiển thị      | Database key |
|-------------------|--------------|
| Quỹ Khuyến Học    | scholarship  |
| Phong Thủy        | fengshui     |
| Tử Vi             | astrology    |
| Tin Tức           | news         |
| Khác              | other        |

Hệ thống tự động convert qua lại, bạn không cần làm gì.

---

## ⚠️ Lưu Ý Quan Trọng

### 1. Kết Nối Supabase

- Thông tin kết nối được lưu trong **localStorage**
- Nếu clear browser cache, cần kết nối lại
- Khuyến nghị: Lưu URL và Key vào file text riêng

### 2. Fallback Mode

Nếu Supabase không kết nối được:
- Hệ thống tự động chuyển về **localStorage**
- Bạn vẫn có thể tạo/sửa/xóa bài viết bình thường
- Bài viết sẽ lưu local, không đồng bộ database

### 3. Realtime Updates

Database hỗ trợ realtime, nhưng cần setup thêm:

```javascript
// Subscribe to blog_posts changes
const subscription = supabaseClient.getClient()
    .channel('blog_changes')
    .on('postgres_changes',
        { event: '*', schema: 'public', table: 'blog_posts' },
        (payload) => {
            console.log('Blog post changed:', payload);
            // Reload data
        }
    )
    .subscribe();
```

### 4. Security

- Hiện tại RLS policies cho phép public read/write để demo
- Production: Nên thêm authentication và giới hạn quyền
- Xem file `HUONG-DAN-DATABASE.md` phần RLS

---

## 🚀 Workflow Hoàn Chỉnh

### Lần đầu setup:

1. ✅ Chạy `database-schema.sql` trong Supabase
2. ✅ Kết nối Supabase qua `task-manager.html`
3. ✅ Reload trang admin để migrate data (nếu có)
4. ✅ Bắt đầu tạo bài viết

### Sử dụng hàng ngày:

1. ✅ Mở `admin-posts.html` hoặc `admin-editor.html`
2. ✅ Hệ thống tự động kết nối Supabase
3. ✅ Tạo/sửa/xóa bài viết như bình thường
4. ✅ Dữ liệu tự động lưu vào database

---

## 🔧 Troubleshooting

### Lỗi: "Supabase client chưa được khởi tạo"

**Nguyên nhân**: Chưa kết nối Supabase

**Giải pháp**:
1. Mở `task-manager.html`
2. Nhập URL và Key
3. Click "Kết nối"

---

### Lỗi: "relation 'blog_posts' does not exist"

**Nguyên nhân**: Chưa chạy SQL script

**Giải pháp**:
1. Mở Supabase Dashboard > SQL Editor
2. Chạy file `database-schema.sql`

---

### Bài viết không hiện trong database

**Nguyên nhân**: Đang dùng localStorage mode

**Kiểm tra**:
1. Mở Console (F12)
2. Xem log có chữ "Sử dụng Supabase" hay "Sử dụng localStorage"
3. Nếu là localStorage, kết nối lại Supabase

---

### Bài viết bị duplicate

**Nguyên nhân**: Migration chạy nhiều lần

**Giải pháp**:
1. Mở Supabase > Table Editor > blog_posts
2. Xóa các bài trùng thủ công
3. Hoặc: Xóa toàn bộ table và chạy lại SQL script

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề:

1. **Check Console**: F12 > Console để xem error messages
2. **Check Network**: F12 > Network > Filter "supabase" để xem API calls
3. **Check Supabase Logs**: Dashboard > Logs để xem server-side errors

---

## 🎉 Hoàn Tất!

Bây giờ bạn có thể:
- ✅ Tạo bài viết và lưu vào Supabase
- ✅ Quản lý bài viết trực quan qua admin panel
- ✅ Dữ liệu được lưu trữ an toàn trên cloud
- ✅ Có thể truy cập từ nhiều thiết bị

**Chúc bạn sử dụng hiệu quả! 🚀**
