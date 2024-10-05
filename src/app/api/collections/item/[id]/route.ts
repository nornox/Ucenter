import { verifyToken } from '@/utils/auth'
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

console.log('API 路由文件已加载')

const prisma = new PrismaClient()

async function addTag(favItemId: number, userId: number, tagName: string) {
  // 查找或创建标签
  const tag = await prisma.favTag.upsert({
    where: { name: tagName },
    update: {},
    create: { name: tagName },
  })

  console.log('favItemId:', favItemId)
  // 创建收藏项与标签的关系（如果不存在）
  await prisma.favItemTag.upsert({
    where: {
      itemId: favItemId,
      id: tag.id,
    },
    update: {},
    create: {
      itemId: favItemId,
      tagId: tag.id,
    },
  })
}

async function removeTag(favItemId: number, userId: number, tagName: string) {
  // 查找标签
  const tag = await prisma.favTag.findUnique({
    where: { name: tagName },
  })

  console.log('removeTag.favItemId:', favItemId)
  console.log('removeTag.tag:', tag)
  if (tag) {
    // 删除收藏项与标签的关系
    await prisma.favItemTag.deleteMany({
      where: {
        itemId: favItemId,
        tagId: tag.id,
      },
    })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params
  console.log(`开始处理更新收藏项请求，ID: ${id}`)

  try {
    // 从请求头中获取授权令牌
    const token = request.headers.get('Authorization')?.split(' ')[1]
    if (!token) {
      console.log('未提供授权令牌')
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    let decoded
    try {
      // 验证令牌
      decoded = await verifyToken(token)
      console.log('令牌验证成功')
    } catch (error) {
      console.error('令牌验证错误:', error)
      return NextResponse.json({ error: '无效的令牌' }, { status: 401 })
    }

    console.log(`用户ID: ${decoded.userId}`)

    // 解析请求体
    const { command, data } = await request.json()
    console.log(`收到的命令: ${command}, 数据:`, data)

    // 验证请求参数
    if (!id || !command || data === undefined) {
      console.log('无效的请求参数')
      return NextResponse.json({ error: '无效的请求参数' }, { status: 400 })
    }

    // 将 id 转换为整数
    const bookmarkId = parseInt(id, 10)
    if (isNaN(bookmarkId)) {
      return NextResponse.json({ error: '无效的 ID' }, { status: 400 })
    }

    let updateResult

    switch (command) {
      case 'updateDescription':
        if (typeof data !== 'string') {
          return NextResponse.json(
            { error: '描述必须是字符串' },
            { status: 400 },
          )
        }
        updateResult = await prisma.favItem.updateMany({
          where: {
            id: bookmarkId,
            userId: decoded.userId,
            isDeleted: false,
          },
          data: {
            content: data,
          },
        })
        break

      case 'updateParentId':
        const parentId = parseInt(data, 10)
        if (isNaN(parentId)) {
          return NextResponse.json({ error: '无效的父ID' }, { status: 400 })
        }
        updateResult = await prisma.favItem.updateMany({
          where: {
            id: bookmarkId,
            userId: decoded.userId,
            isDeleted: false,
          },
          data: {
            parentId: parentId,
          },
        })
        break

      case 'addTag':
        if (typeof data !== 'string') {
          return NextResponse.json(
            { error: '标签必须是字符串' },
            { status: 400 },
          )
        }
        await addTag(bookmarkId, decoded.userId, data)
        updateResult = { count: 1 } // 假设标签添加成功
        break

      case 'removeTag':
        if (typeof data !== 'string') {
          return NextResponse.json(
            { error: '标签必须是字符串' },
            { status: 400 },
          )
        }
        console.log('removeTag:', data)
        await removeTag(bookmarkId, decoded.userId, data)
        updateResult = { count: 1 } // 假设标签删除成功
        break

      default:
        return NextResponse.json({ error: '未知的命令' }, { status: 400 })
    }

    console.log(`更新操作影响的行数: ${updateResult.count}`)

    if (updateResult.count === 0) {
      console.log('未找到匹配的收藏项')
      return NextResponse.json({ error: '未找到匹配的收藏项' }, { status: 404 })
    }

    console.log('收藏项更新成功')
    return NextResponse.json({ message: '更新成功' })
  } catch (error) {
    console.error('更新收藏项错误:', error)
    return NextResponse.json({ error: '更新收藏项失败' }, { status: 500 })
  } finally {
    // 确保在操作结束后断开Prisma连接
    await prisma.$disconnect()
    console.log('Prisma连接已断开')
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  console.log(`开始处理删除收藏项请求，ID: ${id}`)

  try {
    // 从请求头中获取授权令牌
    const token = request.headers.get('Authorization')?.split(' ')[1]
    if (!token) {
      console.log('未提供授权令牌')
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    let decoded
    try {
      // 验证令牌
      decoded = await verifyToken(token)
      console.log('令牌验证成功')
    } catch (error) {
      console.error('令牌验证错误:', error)
      return NextResponse.json({ error: '无效的令牌' }, { status: 401 })
    }

    console.log(`用户ID: ${decoded.userId}`)

    // 将 id 转换为整数
    const bookmarkId = parseInt(id, 10)
    if (isNaN(bookmarkId)) {
      return NextResponse.json({ error: '无效的 ID' }, { status: 400 })
    }

    // 使用事务来确保所有操作都成功执行或全部回滚
    const result = await prisma.$transaction(async (prisma) => {
      // 首先删除与该收藏项相关的所有标签关系
      await prisma.favItemTag.deleteMany({
        where: {
          itemId: bookmarkId,
        },
      })

      // 然后删除收藏项
      const deletedItem = await prisma.favItem.deleteMany({
        where: {
          id: bookmarkId,
          userId: decoded.userId,
        },
      })

      return deletedItem
    })

    console.log(`删除操作影响的行数: ${result.count}`)

    if (result.count === 0) {
      console.log('未找到匹配的收藏项')
      return NextResponse.json({ error: '未找到匹配的收藏项' }, { status: 404 })
    }

    console.log('收藏项删除成功')
    return NextResponse.json({ message: '删除成功' })
  } catch (error) {
    console.error('删除收藏项错误:', error)
    return NextResponse.json({ error: '删除收藏项失败' }, { status: 500 })
  } finally {
    // 确保在操作结束后断开Prisma连接
    await prisma.$disconnect()
    console.log('Prisma连接已断开')
  }
}


