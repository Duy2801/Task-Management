# Task Management API

Backend Todo List sử dụng NestJS, Prisma và PostgreSQL.

## Cài đặt và chạy

```bash
# từ thư mục gốc monorepo
pnpm install
cp apps/backend/.env.dist apps/backend/.env

# tạo database/schema và Prisma Client
pnpm --filter backend exec prisma migrate dev --name init

# chạy development server
pnpm --filter backend start:dev
```

API mặc định chạy tại `http://localhost:3001/api`. Cập nhật `DATABASE_URL` trong
`apps/backend/.env` nếu thông tin PostgreSQL trên máy khác với file mẫu.

## API

| Method | Endpoint | Chức năng |
| --- | --- | --- |
| `GET` | `/api/tasks` | Danh sách và phân trang |
| `GET` | `/api/tasks/:id` | Chi tiết công việc |
| `POST` | `/api/tasks` | Tạo công việc |
| `PATCH` | `/api/tasks/:id` | Sửa nội dung/trạng thái |
| `DELETE` | `/api/tasks/:id` | Xóa công việc |

Query của danh sách:

- `search`: tìm không phân biệt hoa thường trong tiêu đề và mô tả.
- `completed=true|false`: lọc theo trạng thái.
- `page`: trang hiện tại, mặc định `1`.
- `limit`: số bản ghi mỗi trang, mặc định `10`, tối đa `100`.

Ví dụ tạo task:

```json
{
  "title": "Hoàn thiện bài test",
  "description": "Làm API và kiểm thử"
}
```

Ví dụ cập nhật trạng thái:

```json
{
  "completed": true
}
```

## Kiểm tra

```bash
pnpm --filter backend lint
pnpm --filter backend test
pnpm --filter backend build
```
