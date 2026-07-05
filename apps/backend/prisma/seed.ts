import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL chưa được cấu hình');

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const hoursFromNow = (hours: number) =>
  new Date(Date.now() + hours * 60 * 60 * 1000);

const tasks = [
  {
    title: 'Hoàn thiện giao diện Todo List',
    description:
      'Kiểm tra responsive trên điện thoại, tablet và desktop. Hoàn thiện các trạng thái loading và empty.',
    assignee: 'Nguyễn Minh Anh',
    startAt: hoursFromNow(-48),
    dueAt: hoursFromNow(-12),
    completed: true,
    completedAt: hoursFromNow(-15),
  },
  {
    title: 'Viết API quản lý công việc',
    description:
      'Hoàn thiện CRUD, tìm kiếm, lọc, sắp xếp và phân trang bằng NestJS và Prisma.',
    assignee: 'Trần Quốc Bảo',
    startAt: hoursFromNow(-30),
    dueAt: hoursFromNow(10),
    completed: false,
  },
  {
    title: 'Kiểm tra form validation',
    description:
      'Thử các trường hợp bỏ trống, tiêu đề quá dài và thời gian không hợp lệ.',
    assignee: 'Lê Thu Hà',
    startAt: hoursFromNow(-24),
    dueAt: hoursFromNow(-3),
    completed: false,
  },
  {
    title: 'Viết tài liệu README',
    description:
      'Bổ sung hướng dẫn cài đặt, migration, seed, cấu hình môi trường và chạy dự án.',
    assignee: 'Phạm Gia Huy',
    startAt: hoursFromNow(2),
    dueAt: hoursFromNow(30),
    completed: false,
  },
  {
    title: 'Tối ưu trải nghiệm dark mode',
    description:
      'Kiểm tra màu chữ, độ tương phản, trạng thái hover và khả năng truy cập.',
    assignee: 'Nguyễn Minh Anh',
    startAt: hoursFromNow(-6),
    dueAt: hoursFromNow(18),
    completed: false,
  },
  {
    title: 'Test tìm kiếm realtime',
    description:
      'Đảm bảo debounce hoạt động và không gửi request dư thừa khi nhập nhanh.',
    assignee: 'Lê Thu Hà',
    startAt: hoursFromNow(-20),
    dueAt: hoursFromNow(-5),
    completed: true,
    completedAt: hoursFromNow(-6),
  },
  {
    title: 'Kiểm tra bộ lọc trạng thái',
    description: 'Kiểm tra các bộ lọc đang làm, đã xong và quá hạn.',
    assignee: 'Trần Quốc Bảo',
    startAt: hoursFromNow(-10),
    dueAt: hoursFromNow(-1),
    completed: false,
  },
  {
    title: 'Review clean architecture',
    description: 'Rà soát luồng types, services, hooks và components.',
    assignee: 'Phạm Gia Huy',
    startAt: hoursFromNow(12),
    dueAt: hoursFromNow(48),
    completed: false,
  },
  {
    title: 'Chuẩn bị demo sản phẩm',
    description:
      'Tạo kịch bản demo ngắn gọn, nhấn mạnh các điểm kỹ thuật nổi bật.',
    assignee: 'Nguyễn Minh Anh',
    startAt: hoursFromNow(24),
    dueAt: hoursFromNow(72),
    completed: false,
  },
  {
    title: 'Chạy lint và unit test',
    description: 'Đảm bảo frontend và backend không còn lỗi trước khi bàn giao.',
    assignee: 'Trần Quốc Bảo',
    startAt: hoursFromNow(-8),
    dueAt: hoursFromNow(6),
    completed: true,
    completedAt: hoursFromNow(-1),
  },
  {
    title: 'Kiểm tra thông báo Toast',
    description: 'Thử các trường hợp tạo, sửa, xóa thành công và thất bại.',
    assignee: 'Lê Thu Hà',
    startAt: hoursFromNow(4),
    dueAt: hoursFromNow(28),
    completed: false,
  },
  {
    title: 'Dọn dẹp mã nguồn',
    description: 'Xóa import thừa và chuẩn hóa cách đặt tên trong dự án.',
    assignee: 'Phạm Gia Huy',
    startAt: hoursFromNow(30),
    dueAt: hoursFromNow(80),
    completed: false,
  },
];

async function main() {
  await prisma.$transaction([
    prisma.task.deleteMany(),
    prisma.task.createMany({ data: tasks }),
  ]);
  console.log(`Seed thành công ${tasks.length} công việc mẫu.`);
}

main()
  .catch((error: unknown) => {
    console.error('Seed thất bại:', error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
