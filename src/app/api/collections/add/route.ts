import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/utils/auth';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // 验证token
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: '未提供授权令牌' }, { status: 401 });
    }

    const decodedToken = await verifyToken(token);
    if (!decodedToken) {
      return NextResponse.json({ error: '无效的授权令牌' }, { status: 401 }); 
    }

    const userId = decodedToken.userId;

    // 解析请求体
    const { url, title, description } = await request.json();

    // 创建新的收藏项
    const newFavItem = await prisma.favItem.create({
      data: {
        userId,
        type: 'url',
        title,
        content: description,
        url,
        isDeleted: false,
        isPublic: false,
      },
    });

    return NextResponse.json({ success: true, data: newFavItem }, { status: 201 });
  } catch (error) {
    console.error('添加收藏时出错:', error);
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
