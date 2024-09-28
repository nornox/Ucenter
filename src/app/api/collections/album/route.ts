import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/utils/auth'

export async function POST(request: NextRequest) {
  console.log('开始处理收藏夹列表请求')
  try {
    // 验证用户令牌
    const token = request.headers.get('Authorization')?.split(' ')[1]
    if (!token) {
      console.log('未提供授权令牌')
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    let decoded;
    try {
      // 验证令牌
      decoded = await verifyToken(token)
    } catch (error) {
      console.error('令牌验证错误:', error)
      return NextResponse.json({ error: '无效的令牌' }, { status: 401 })
    }

    console.log(`用户ID: ${decoded.userId}`)

    // 查询用户的收藏夹列表
    const albums = await prisma.favItem.findMany({
      where: {
        userId: decoded.userId,
        type: 'collection',
        isDeleted: false,
      },
      select: {
        id: true,
        title: true,
        coverImage: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    console.log(`查询到 ${albums.length} 个收藏夹`)

    // 构造响应数据
    const response = {
      albums: albums.map(album => ({
        ...album,
        id: Number(album.id), // 确保 ID 是数字类型
      })),
    }

    console.log('收藏夹列表请求处理完成')
    return NextResponse.json(response)
  } catch (error) {
    console.error('获取收藏夹列表错误:', error)
    return NextResponse.json({ error: '获取收藏夹列表失败' }, { status: 500 })
  }
}