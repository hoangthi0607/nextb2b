import { NextRequest, NextResponse } from 'next/server';

export function roleMiddleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith('/admin')) {
    const role = request.cookies.get('role')?.value
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return null;
}
