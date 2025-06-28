import { NextRequest } from 'next/server'

export function getClientIP(request: NextRequest): string {
  // Ưu tiên header x-forwarded-for nếu có (do proxy hoặc vercel/nginx cung cấp)
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  // Nếu không có, fallback sang IP của request (Edge Runtime không cung cấp trực tiếp IP nên đây chỉ là ví dụ)
  return 'unknown'
}

export function formatTime(date: Date): string {
  return date.toLocaleString('vi-VN', { hour12: false }) // Ví dụ: 25/06/2025, 22:11:10
}
