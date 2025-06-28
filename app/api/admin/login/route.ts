import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: 'Thiếu tài khoản hoặc mật khẩu' }, { status: 400 });
  }

  const admin = await prisma.admin.findUnique({
    where: { username },
  });

  if (!admin) {
    return NextResponse.json({ error: 'Tài khoản không tồn tại' }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) {
    return NextResponse.json({ error: 'Sai mật khẩu' }, { status: 401 });
  }

  const secret = process.env.JWT_SECRET!;
  const refreshSecret = process.env.REFRESH_SECRET ?? secret;

  // Tạo access token (2 giờ)
  const accessToken = jwt.sign(
    {
      adminId: admin.id,
      role: 'admin',
    },
    secret,
    { expiresIn: '2h' }
  );

  // Tạo refresh token (7 ngày)
  const refreshToken = jwt.sign(
    {
      adminId: admin.id,
      role: 'admin',
    },
    refreshSecret,
    { expiresIn: '7d' }
  );

  // Lưu vào DB nếu muốn quản lý (optional)
  await prisma.refreshToken.create({
    data: {
      adminId: admin.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  // Set cookie HttpOnly
  const response = NextResponse.json({
    token: accessToken,
    admin: {
      id: admin.id,
      username: admin.username,
      fullName: admin.fullName,
      email: admin.email,
    },
  });

  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 ngày
  });

  return response;
}
