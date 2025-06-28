// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  // Validate
  if (!username || !password) {
    return NextResponse.json({ error: 'Thiếu tên đăng nhập hoặc mật khẩu' }, { status: 400 });
  }

  // Tìm user
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      roles: { include: { role: true } },
      enterprise: true,
    },
  });

  if (!user || user.status !== 'active') {
    return NextResponse.json({ error: 'Tài khoản không tồn tại hoặc bị khóa' }, { status: 401 });
  }

  // So sánh mật khẩu
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: 'Sai mật khẩu' }, { status: 401 });
  }

  // Kiểm tra JWT_SECRET
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET chưa được cấu hình');

  // Tạo JWT token
  const token = jwt.sign(
    {
      userId: user.id,
      username: user.username,
      roles: user.roles.map((r) => r.role.name),
      enterpriseId: user.enterpriseId,
      enterpriseType: user.enterprise.type,
    },
    secret,
    { expiresIn: '2h' }
  );

  // Trả về token + user
  return NextResponse.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      roles: user.roles.map((r) => r.role.name),
      enterpriseId: user.enterpriseId,
      enterpriseType: user.enterprise.type,
    },
  });
}
