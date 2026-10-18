# Cấu Hình Tự Động Build Và Xuất Bản Lên GitHub Pages Bằng GitHub Actions

Kế hoạch này giải quyết triệt để lỗi "trang web trắng tinh" khi đưa toàn bộ mã nguồn lên GitHub bằng cách thiết lập quy trình tự động hóa CI/CD với GitHub Actions, giúp GitHub tự động cài đặt gói, biên dịch mã TypeScript/React và xuất bản trang web hoàn chỉnh lên GitHub Pages mỗi khi bạn cập nhật code.

## User Review & Critical Decisions

> [!IMPORTANT]
> Người dùng đã chọn phương án **"Cấu hình tự động build toàn bộ thư mục bằng GitHub Actions"**.
> Sau khi áp dụng kế hoạch, khi bạn tải toàn bộ thư mục mã nguồn lên GitHub, GitHub sẽ tự động thực hiện lệnh `npm run build` trên máy chủ đám mây và đưa thư mục `dist` lên trang web công khai, không còn phụ thuộc vào việc trình duyệt phải đọc file `.tsx`.

- **Phương án đã xác nhận**: Tự động hóa hoàn toàn quy trình biên dịch và triển khai qua GitHub Actions workflow.
- **Cấu hình đường dẫn Vite**: Thiết lập `base: './'` trong `vite.config.ts` để web nhận đúng tài nguyên hình ảnh và script dù kho lưu trữ của bạn được đặt bất kỳ tên gì trên GitHub Pages.

---

## 1. Tổng Quan & Nguyên Nhân Kỹ Thuật

- **Vấn đề cốt lõi**: Trình duyệt web không thể đọc trực tiếp các tệp `.tsx` trong thư mục `src/`. Khi GitHub Pages chạy ở chế độ mặc định, nó phục vụ trực tiếp file `index.html` của mã nguồn chưa qua biên dịch, dẫn đến lỗi cú pháp JavaScript và màn hình trắng tinh.
- **Giải pháp**: Thiết lập GitHub Actions Workflow tiêu chuẩn của GitHub. Mỗi khi có lượt đẩy mã (`git push`), máy chủ GitHub sẽ khởi chạy Node.js, chạy lệnh đóng gói dự án (`npm run build`), và tự động đẩy sản phẩm đã đóng gói sang máy chủ GitHub Pages.

---

## 2. Các Bước Thực Hiện Chi Tiết

### Bước 1: Cấu hình `vite.config.ts` cho GitHub Pages
- Thêm thuộc tính `base: './'` vào file `vite.config.ts`.
- Điều này đảm bảo tất cả đường dẫn tài nguyên (CSS, JS, ảnh) trong thư mục `dist` sau khi build sẽ sử dụng đường dẫn tương đối, không bị lỗi 404 khi đặt trong tên miền con dạng `https://username.github.io/ten-repo/`.

### Bước 2: Tạo tệp quy trình tự động hóa `.github/workflows/deploy.yml`
- Tạo thư mục `.github/workflows/` và tệp `deploy.yml` với cấu hình:
  - **Quyền hạn (Permissions)**: Cấp quyền đọc mã nguồn (`contents: read`) và quyền xuất bản GitHub Pages (`pages: write`, `id-token: write`).
  - **Triggers**: Kích hoạt tự động khi đẩy code lên nhánh `main` hoặc `master`.
  - **Build Job**: Khởi tạo môi trường Ubuntu với Node.js 22, chạy `npm ci` (hoặc `npm install`), chạy `npm run build`.
  - **Deploy Job**: Dùng action chính thức `actions/deploy-pages@v4` để đưa toàn bộ sản phẩm trong thư mục `dist/` lên GitHub Pages.

### Bước 3: Dọn dẹp các tệp tạm và đảm bảo mã nguồn sạch sẽ
- Xóa tệp `main.html` tạm chứa biến chưa điền `${imageSrc}` để tránh nhầm lẫn khi người dùng tải lên GitHub.
- Kiểm tra quá trình `npm run build` cục bộ để đảm bảo không có bất kỳ cảnh báo hoặc lỗi TypeScript nào làm gián đoạn tiến trình GitHub Actions.

---

## 3. Kiến Trúc Quy Trình Triển Khai (Deployment Flow)

```
┌─────────────────────────────────┐
│ Người dùng đẩy mã nguồn lên     │
│ GitHub (nhánh main / master)    │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│ GitHub Actions tự động kích hoạt│
│ - Tải môi trường Ubuntu & Node 22│
│ - Chạy `npm install`            │
│ - Chạy `npm run build` (Vite)   │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│ Tạo thư mục `dist` hoàn chỉnh:   │
│ HTML + JS thuần + CSS + Ảnh     │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│ GitHub Pages xuất bản trang web │
│ https://username.github.io/repo/│
│ (Không còn màn hình trắng tinh) │
└─────────────────────────────────┘
```

---

## 4. Hướng Dẫn Thao Tác Sau Khi Triển Khai (Dành Cho Người Dùng)

Sau khi mã nguồn được cập nhật:
1. Bạn đưa toàn bộ thư mục dự án lên kho lưu trữ trên GitHub như bình thường.
2. Trên giao diện GitHub của kho lưu trữ:
   - Vào tab **Settings** ➔ chọn mục **Pages** (cột bên trái).
   - Tại phần **Build and deployment** ➔ mục **Source**: Chuyển từ *"Deploy from a branch"* sang **"GitHub Actions"**.
3. Bạn vào tab **Actions** trên GitHub sẽ thấy quy trình build tự động chạy màu xanh lá (✓), và đường link web chính thức sẽ xuất hiện ngay sau đó!
