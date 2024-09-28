import { NextResponse } from 'next/server'
import { signToken } from '@/utils/auth'
import prisma from '@/lib/prisma'
import bcrypt from 'bcrypt'

export async function POST(request: Request) {
  console.log('【POST /api/auth/login】开始处理登录请求')
  try {
    const { email, password } = await request.json() as { email: string; password: string }
    console.log(`【POST /api/auth/login】接收到登录请求，邮箱: ${email}`)

    // 从数据库中查找用户
    console.log(`【POST /api/auth/login】开始查找用户: ${email}`)
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log(`【POST /api/auth/login】用户不存在: ${email}`)
      return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 })
    }
    console.log(`【POST /api/auth/login】成功找到用户: ${email}`)

    // 验证密码
    console.log(`【POST /api/auth/login】开始验证密码`)
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      console.log(`【POST /api/auth/login】密码验证失败: ${email}`)
      return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 })
    }
    console.log(`【POST /api/auth/login】密码验证成功: ${email}`)

    // 生成 token
    console.log(`【POST /api/auth/login】开始生成token`)
    const token = await signToken({ userId: user.id, email: user.email })
    console.log(`【POST /api/auth/login】成功生成token`)

    console.log(`【POST /api/auth/login】登录成功: ${email}`)
    return NextResponse.json({ token }, { status: 200 })
  } catch (error: unknown) {
    console.error('【POST /api/auth/login】登录错误:', error)
    return NextResponse.json({ error: '登录失败' }, { status: 500 })
  }
}