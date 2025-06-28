import { NextRequest} from 'next/server';
import { getClientIP, formatTime } from  './utils';

export function loggerMiddleware(request: NextRequest) {
  const method = request.method;
  const url = request.nextUrl.pathname;
  const ip = getClientIP(request);
  const timestamp = formatTime(new Date());

  // Ghi log ra console (có thể gửi đến một endpoint nếu muốn)
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);

  return null;
}
