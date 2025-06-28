import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: 'Không tìm thấy refresh token' }, { status: 401 });
  }

  const secret = process.env.JWT_SECRET!;
  const refreshSecret = process.env.REFRESH_SECRET ?? secret;

  try {
    const payload = jwt.verify(refreshToken, refreshSecret) as { adminId: string, role: string };

    // Kiểm tra token có trong DB không (nếu bạn dùng lưu DB)
    const exists = await prisma.refreshToken.findFirst({
        where: { token: refreshToken },
      });
      

    if (!exists) {
      return NextResponse.json({ error: 'Refresh token không hợp lệ' }, { status: 403 });
    }

    // Tạo lại access token
    const newAccessToken = jwt.sign(
      {
        adminId: payload.adminId,
        role: payload.role,
      },
      secret,
      { expiresIn: '2h' }
    );

    return NextResponse.json({ token: newAccessToken });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
} catch (err: any) {
    console.error('Lỗi khi xử lý refresh token:', err?.message ?? err);
  
    if (err.name === 'TokenExpiredError') {
      return NextResponse.json({ error: 'Refresh token đã hết hạn' }, { status: 403 });
    }
  
    return NextResponse.json({ error: 'Refresh token không hợp lệ' }, { status: 403 });
  }
}
