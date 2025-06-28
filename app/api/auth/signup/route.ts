import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(req);
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

    // Validate đầu vào đơn giản
    if (!enterpriseName || !username || !password || !fullName || !enterpriseType) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
    }

    // Kiểm tra tài khoản đã tồn tại
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return NextResponse.json({ error: 'Tên đăng nhập đã tồn tại' }, { status: 400 });
    }

    // Băm mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo enterprise + user trong 1 transaction
    const result = await prisma.$transaction(async (tx) => {
      const enterprise = await tx.enterprise.create({
        data: {
          name: enterpriseName,
          address,
          taxCode,
          phone,
          email,
          type: enterpriseType,
          description,
          status: 'pending', // mặc định chờ duyệt
        },
      });

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

      // Gán role mặc định (nếu có)
      const defaultRole = await tx.role.findUnique({
        where: { name: 'enterprise_admin' }, // thay bằng tên role mặc định nếu có
      });

      if (defaultRole) {
        await tx.userRole.create({
          data: {
            userId: user.id,
            roleId: defaultRole.id,
          },
        });
      }

      return { user, enterprise };
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
