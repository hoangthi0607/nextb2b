import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      enterpriseName,
      enterpriseType,
      taxCode,
      address,
      phone,
      email,
      description,
      username,
      password,
      fullName,
    } = body;

    // Validate bắt buộc
    if (!enterpriseName || !enterpriseType || !username || !password || !fullName) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
    }

    // Kiểm tra username đã tồn tại
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return NextResponse.json({ error: 'Tên đăng nhập đã tồn tại' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (tx) => {
      // Tạo enterprise
      const enterprise = await tx.enterprise.create({
        data: {
          name: enterpriseName,
          type: enterpriseType,
          taxCode,
          address,
          phone,
          email,
          description,
          status: 'pending', // doanh nghiệp chờ phê duyệt
        },
      });

      // Tạo user liên kết với enterprise
      const user = await tx.user.create({
        data: {
          enterpriseId: enterprise.id,
          username,
          password: hashedPassword,
          fullName,
          email,
          phone,
          status: 'active',
        },
      });

      // Gán role mặc định enterprise_admin nếu tồn tại
      const defaultRole = await tx.role.findUnique({
        where: { name: 'enterprise_admin' },
      });

      if (defaultRole) {
        await tx.userRole.create({
          data: {
            userId: user.id,
            roleId: defaultRole.id,
          },
        });
      }

      return { enterprise, user };
    });

    return NextResponse.json({
      message: 'Đăng ký thành công, doanh nghiệp đang chờ phê duyệt',
      user: {
        id: result.user.id,
        username: result.user.username,
        fullName: result.user.fullName,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 });
  }
}
