// middleware.ts
import { authMiddleware } from  './lib/middleware/auth';
import { roleMiddleware } from  './lib/middleware/role';
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {

  let response = authMiddleware(request);
  if (response) return response;

  response = roleMiddleware(request);
  if (response) return response;

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/profile/:path*',
  ],
}
