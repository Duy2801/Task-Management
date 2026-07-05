# Hướng dẫn chạy dự án Task Management

## 1. Chuẩn bị

Cài sẵn các phần mềm sau:

- Node.js 18 trở lên
- pnpm 10
- Docker Desktop
- Git

Nếu máy chưa có pnpm, mở Terminal và chạy:

```bash
npm install -g pnpm@10.12.1
```

## 2. Tải và mở dự án

Clone dự án, sau đó đi vào thư mục gốc của dự án:

```bash
git clone <LINK_GIT_CUA_DU_AN>
cd Task-Management
```

Nếu đã có source code thì chỉ cần mở Terminal tại thư mục `Task-Management`.

## 3. Cài thư viện

Chạy tại thư mục gốc:

```bash
pnpm install
```

## 4. Tạo file môi trường

Tạo file `apps/backend/.env` với nội dung:

```env
DATABASE_URL="postgresql://postgres:root@localhost:5432/task_dev?schema=public"
DIRECT_URL="postgresql://postgres:root@localhost:5432/task_dev?schema=public"
PORT=3001
```

Tạo file `apps/frontend/.env` với nội dung:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 5. Khởi động PostgreSQL

Mở Docker Desktop và chờ Docker chạy xong. Sau đó chạy tại thư mục gốc:

```bash
docker compose up -d
```

Kiểm tra container database:

```bash
docker compose ps
```

Container `postgres` phải có trạng thái đang chạy.

## 6. Tạo cấu trúc và dữ liệu mẫu cho database

Chạy lần lượt:

```bash
pnpm --filter backend prisma:generate
pnpm --filter backend db:migrate
pnpm --filter backend db:seed
```

Khi lệnh migrate hỏi tên migration, có thể nhập:

```text
init
```

Nếu database đã được migrate trước đó thì Prisma sẽ thông báo không có thay đổi mới.

## 7. Chạy dự án

Tại thư mục gốc, chạy:

```bash
pnpm dev
```

Sau khi chạy thành công:

- Giao diện: http://localhost:3000
- Backend API: http://localhost:3001/api

Giữ Terminal này mở trong lúc sử dụng dự án. Nhấn `Ctrl + C` để dừng frontend và backend.

## 8. Chạy lại vào những lần sau

Mở Docker Desktop, mở Terminal tại thư mục dự án rồi chạy:

```bash
docker compose up -d
pnpm dev
```

Không cần cài thư viện, migrate hoặc seed lại nếu source code và database không thay đổi.

## Một số lỗi thường gặp

### Không kết nối được database

Đảm bảo Docker Desktop đang chạy, sau đó kiểm tra:

```bash
docker compose ps
```

Nếu database chưa chạy:

```bash
docker compose up -d
```

### Cổng 3000, 3001 hoặc 5432 đã được sử dụng

Tắt ứng dụng đang chiếm cổng đó rồi chạy lại. Riêng backend có thể đổi `PORT` trong `apps/backend/.env`, nhưng phải cập nhật cùng cổng trong `NEXT_PUBLIC_API_URL` của frontend.

### Muốn dừng database

```bash
docker compose down
```

Lệnh trên chỉ dừng container, dữ liệu vẫn được giữ lại trong Docker volume.
