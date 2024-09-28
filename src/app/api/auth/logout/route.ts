import { NextResponse } from 'next/server'
import { verifyToken, invalidateToken } from '@/utils/auth'

export async function POST(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1]
    if (!token) {
      return NextResponse.json({ error: '未提供令牌' }, { status: 401 })
    }

    await verifyToken(token)
    await invalidateToken(token)

    return NextResponse.json({ message: '用户已成功登出' }, { status: 200 })
  } catch (error) {
    console.error('用户登出错误:', error)
    return NextResponse.json({ error: '用户登出失败' }, { status: 500 })
  }
}