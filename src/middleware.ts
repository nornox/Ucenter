import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 从环境变量中获取允许的源列表
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : []

export function middleware(request: NextRequest) {
  console.log('中间件开始处理请求')

  // 获取请求的源
  const origin = request.headers.get('origin')
  console.log(`请求源: ${origin}`)
  
  // 检查源是否在允许列表中，或者是否未提供源（例如，直接的服务器对服务器请求）
  if ((origin && allowedOrigins.includes(origin))||(origin && origin.startsWith('chrome-extension://')) || !origin) {
    console.log('源在允许列表中或未提供，设置CORS头')
    const response = NextResponse.next()
    
    // 设置CORS头
    response.headers.set('Access-Control-Allow-Origin', origin || '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Allow-Credentials', 'true')

    console.log('CORS头已设置')

    // 处理预检请求
    if (request.method === 'OPTIONS') {
      console.log('处理OPTIONS预检请求')
      return new NextResponse(null, { status: 204, headers: response.headers })
    }

    console.log('返回带有CORS头的响应')
    return response
  }

  console.log('源不在允许列表中，拒绝请求')
  return new NextResponse(null, { status: 403 })
}

// 配置中间件匹配的路径
export const config = {
  matcher: ['/api/:path*', '/((?!_next/static|favicon.ico).*)'],
}

console.log('中间件配置完成')