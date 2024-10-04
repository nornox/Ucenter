import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, updateUser, deleteUser } from '@/services/userService'
import { verifyToken, invalidateToken } from '@/utils/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1]
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = await verifyToken(token)

    if (decoded.exp < Date.now() / 1000) {
      return NextResponse.json({ error: '令牌已过期' }, { status: 401 })
    }
    
    const user = await getUserByEmail(decoded.email)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword, { status: 200 })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({ error: 'Failed to get user information' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1]
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    const body = await request.json()

    const updatedUser = await updateUser(decoded.userId, body)
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(userWithoutPassword, { status: 200 })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json({ error: 'Failed to update user information' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1]
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    await deleteUser(decoded.userId)

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1]
    if (!token) {
      return NextResponse.json({ error: '未提供令牌' }, { status: 401 })
    }

    await verifyToken(token)
    
    // 使令牌失效
    await invalidateToken(token)

    return NextResponse.json({ message: '用户已成功登出' }, { status: 200 })
  } catch (error) {
    console.error('用户登出错误:', error)
    return NextResponse.json({ error: '用户登出失败' }, { status: 500 })
  }
}