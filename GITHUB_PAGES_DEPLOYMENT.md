# Hướng Dẫn Deploy Lên GitHub Pages (Vite + React)

## 🚀 Các Bước Chuẩn Bị

### 1. **Cấu Hình Vite (vite.config.js)**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/crm-mnfs/',  // ⚠️ QUAN TRỌNG: Đặt base path theo repo name
})
```
- `base: '/crm-mnfs/'` phải khớp với tên repository của bạn
- Nếu repo tên khác, thay thế `crm-mnfs` bằng tên của bạn

### 2. **Tạo File .nojekyll**
```bash
# Tạo .nojekyll trong public/ folder
touch public/.nojekyll
```
- File này **bắt buộc** để GitHub Pages không xử lý Jekyll
- Nếu thiếu, các file có dấu gạch dưới (underscore) sẽ không được phục vụ

### 3. **Sử Dụng HashRouter (Không Phải BrowserRouter)**
**File: src/App.jsx**
```javascript
// ❌ SAI - BrowserRouter không hoạt động trên GitHub Pages subdomain
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ✅ ĐÚNG - HashRouter dùng # trong URL
import { HashRouter as Router, Routes, Route } from "react-router-dom";
```

**Tại sao?**
- GitHub Pages không hỗ trợ client-side routing
- `BrowserRouter` dùng history API (không hoạt động)
- `HashRouter` dùng URL hash: `domain.com/#/dashboard` (hoạt động)

### 4. **Fix AuthProvider - Render Children Luôn**
**File: src/context/AuthContext.jsx**
```javascript
// ❌ SAI - App trắng khi loading
return (
  <AuthContext.Provider value={value}>
    {!loading && children}  // ← Vấn đề: children không render khi loading = true
  </AuthContext.Provider>
);

// ✅ ĐÚNG - Children luôn render, DashboardLayout sẽ tự redirect
return (
  <AuthContext.Provider value={value}>
    {children}  // ← Render luôn
  </AuthContext.Provider>
);
```

---

## 📋 Checklist Trước Khi Deploy

- [ ] Cập nhật `vite.config.js`: `base: '/crm-mnfs/'` (hoặc tên repo của bạn)
- [ ] Tạo `public/.nojekyll`
- [ ] Sửa `src/App.jsx`: Dùng `HashRouter` thay `BrowserRouter`
- [ ] Sửa `src/context/AuthContext.jsx`: Bỏ điều kiện `!loading`
- [ ] Chạy `npm run build` local để kiểm tra
- [ ] Kiểm tra `dist/` folder có file `.nojekyll` không

---

## 🔧 Lệnh Deploy

```bash
# Commit các thay đổi
git add -A
git commit -m "config: setup for GitHub Pages deployment"

# Build project
npm run build

# Push lên GitHub (GitHub Actions sẽ tự động deploy)
git push
```

---

## ✅ Xác Nhận Deploy Thành Công

1. Vào **Settings → Pages** trong repo
2. Kiểm tra **"Your site is live at: https://username.github.io/repo-name/"**
3. Truy cập link và kiểm tra:
   - Trang **KHÔNG bị trắng**
   - Có thể **login được** (username: `admin`, password: `ha123456`)
   - **Routing hoạt động** (URL có `#/`, ví dụ: `.../#/customers`)

---

## 🐛 Xử Lý Sự Cố

| Vấn đề | Nguyên Nhân | Cách Fix |
|--------|-----------|---------|
| **Trang trắng** | 1. Thiếu `.nojekyll` | Thêm `public/.nojekyll` |
| | 2. AuthProvider không render | Bỏ `!loading` condition |
| | 3. BrowserRouter không hoạt động | Dùng `HashRouter` |
| **CSS/JS không load** | `base` path sai | Cập nhật `vite.config.js` |
| **Routing lỗi 404** | Dùng BrowserRouter | Thay thành `HashRouter` |
| **Asset không tìm thấy** | Thiếu `.nojekyll` | Thêm file vào `public/` |

---

## 📚 Tham Khảo

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#github-pages)
- [React Router Hash Mode](https://reactrouter.com/start/library/installation)
- [GitHub Pages with Jekyll](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll)

---

## 🎯 Lần Tới Deploy Nhanh

```bash
# 1. Kiểm tra config
grep "base:" vite.config.js
ls -la public/.nojekyll
grep "HashRouter" src/App.jsx

# 2. Build & Deploy
npm run build
git add -A
git commit -m "update: [description]"
git push

# ✅ Xong! GitHub Actions sẽ deploy tự động (~1-2 phút)
```
