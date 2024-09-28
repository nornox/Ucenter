import { NextResponse } from 'next/server'

// 允许的源列表，包括前端开发服务器和生产环境域名
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'] // 添加您的前端域名

/**
 * CORS中间件函数
 * @param request 传入的请求对象
 * @returns 包含CORS头部的Headers对象
 */
export function corsMiddleware(request: Request): Headers {
  // 从请求头中获取origin
  const origin = request.headers.get('origin')

  console.log(`收到来自 ${origin} 的请求`)

  // 检查origin是否在允许列表中
  if (origin && allowedOrigins.includes(origin)) {
    console.log(`允许来自 ${origin} 的跨域请求`)
    // 返回包含CORS头部的Headers对象
    return new Headers({
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    })
  }

  console.log(`不允许来自 ${origin} 的跨域请求`)
  // 如果origin不在允许列表中，返回空的Headers对象
  return new Headers()
}

/**
 * 处理CORS预检请求的函数
 *
 * @returns {NextResponse} 包含CORS头部的NextResponse对象
 */
export function handleCorsPreflightRequest(): NextResponse {
  console.log('开始处理CORS预检请求')

  const headers = new Headers({
    'Access-Control-Allow-Origin': '*', // 或者使用特定的origin
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  })

  console.log('CORS预检请求处理完成')
  return new NextResponse(null, { status: 204, headers })
}
