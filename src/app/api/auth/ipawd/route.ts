import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'

export async function GET(request: Request) {
  try {
    // 从 URL 参数中获取 pass
    const { searchParams } = new URL(request.url)
    const pass = searchParams.get('pass')

    if (!pass) {
      return NextResponse.json({ error: '缺少密码参数' }, { status: 400 })
    }

    // 使用 bcrypt 加密密码
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(pass, saltRounds)

    // 返回加密后的密码
    return NextResponse.json({ hashedPassword }, { status: 200 })
  } catch (error) {
    console.error('密码加密错误:', error)
    return NextResponse.json({ error: '密码加密失败' }, { status: 500 })
  }
}