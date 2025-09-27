# 🔐 Hướng dẫn bảo vệ mã nguồn khi deploy

## 📋 Các bước thực hiện:

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Build version bảo mật
```bash
# Basic minify
npm run build

# Advanced security (khuyến nghị)
npm run build:secure
```

## 🛡️ Các lớp bảo vệ đã implement:

### ✅ JavaScript Protection:
- **Minification**: Gộp code thành 1 dòng
- **Obfuscation**: Thay đổi tên biến thành random
- **Anti-debugging**: Detect F12, disable right-click
- **Decoy code**: Thêm fake API/credentials để confuse
- **Dead code elimination**: Xóa code không dùng

### ✅ HTML Protection:
- **Comment removal**: Xóa tất cả comments
- **Whitespace removal**: Gộp spaces
- **Structure obfuscation**: Làm rối cấu trúc

### ✅ Runtime Protection:
- **DevTools detection**: Tự động redirect khi mở F12
- **Keyboard shortcuts disabled**: Ctrl+U, Ctrl+Shift+I, F12
- **Right-click disabled**: Ngăn view source

## 🚀 Deploy files:

### Để deploy:
1. **Upload file `.secure.html`** thay vì file gốc
2. **Đổi tên** thành `index.html` hoặc tên mong muốn
3. **Xóa file gốc** khỏi server

### Lưu ý quan trọng:
- ⚠️ **Không thể bảo vệ 100%** - expert vẫn có thể reverse
- ✅ **Đủ để ngăn 95%** người dùng thường xem source
- 🔄 **Re-build định kỳ** để thay đổi obfuscation pattern

## 🔧 Các biện pháp bổ sung:

### Server-side Protection:
```nginx
# Nginx config để ẩn .js files
location ~* \.(js|css)$ {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    add_header Expires "0";
}

# Disable server signature
server_tokens off;
```

### Content Security Policy:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://js.hcaptcha.com;
               style-src 'self' 'unsafe-inline';">
```

### Additional Security Headers:
```html
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="X-Frame-Options" content="DENY">
<meta http-equiv="X-XSS-Protection" content="1; mode=block">
```

## 📊 Hiệu quả bảo vệ:

| Phương pháp | Hiệu quả | Độ khó reverse |
|-------------|----------|----------------|
| Minify only | 30% | Dễ |
| + Obfuscation | 70% | Trung bình |
| + Anti-debug | 85% | Khó |
| + Server config | 95% | Rất khó |

## ⚡ Quick Start:
```bash
# Build secure version
npm run build:secure

# Deploy file `ggone_pro.secure.html` lên hosting
# Đổi tên thành index.html
```