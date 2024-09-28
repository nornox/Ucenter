import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/utils/auth'
import { Prisma } from '@prisma/client'

// 修改 CollectionListProps 类型定义
type CollectionListProps = {
  cmd: 'all' | 'untagged' | 'web' | 'recent' | 'favorite' | 'album' | `search_${string}`;
  sort?: string;
  page?: number;
  search?: string;
  albumId?: string; // 新增 albumId 参数
}

export interface CollectionResult {
  // 在这里定义 CollectionResult 的属性
  id: number;
  title: string;
  coverImage: string | null;
  createdAt: Date;
  updatedAt: Date;
  type: string;
  url: string | null;
  userId: number;
  parentId: number | null;
  content: string | null;
  count: number;
  // ... 其他属性
}

export async function POST(request: NextRequest) {
  console.log('开始处理收藏夹列表请求')
  try {
    // 从请求体中获取参数
    const body: CollectionListProps = await request.json()
    const { cmd, sort = '最新收藏', page = 1, search = '', albumId } = body
    const pageSize = 20 // 每页显示的项目数

    console.log(`请求参数: cmd=${cmd}, sort=${sort}, page=${page}, search=${search}, albumId=${albumId}`)

    // 验证用户令牌
    const token = request.headers.get('Authorization')?.split(' ')[1]
    if (!token) {
      console.log('未提供授权令牌')
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    let decoded;
    try {
      decoded = await verifyToken(token)
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        console.log('令牌已过期')
        return NextResponse.json({ error: '令牌已过期' }, { status: 401 })
      }
      console.error('令牌验证错误:', error)
      return NextResponse.json({ error: '无效的令牌' }, { status: 401 })
    }

    console.log(`用户ID: ${decoded.userId}`)

    // 构建基础查询条件
    // 替换 any 类型
    let where: Prisma.FavItemWhereInput = {
      userId: decoded.userId,
      isDeleted: false,
    }

    // 定义排序条件
    let orderBy: Prisma.FavItemOrderByWithRelationInput = {}
    switch (sort) {
      case '最新收藏':
        orderBy = { createdAt: 'desc' }
        break
      case '最早收藏':
        orderBy = { createdAt: 'asc' }
        break
      case '标题正序':
        orderBy = { title: 'asc' }
        break
      case '标题倒序':
        orderBy = { title: 'desc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }
    console.log(`排序方式: ${JSON.stringify(orderBy)}`)

    let collections: CollectionResult[] = []
    let total = 0

    // 根据 cmd 参数调整查询条件
    switch (cmd) {
      case 'all':
        console.log('查询所有收藏')
        // 使用 Prisma 查询
        total = await prisma.favItem.count({ where })
        const items = await prisma.favItem.findMany({
          where,
          orderBy,
          skip: (page - 1) * pageSize,
          take: pageSize,
        })
        collections = items.map(item => ({ ...item, count: 0 }))
        break
      case 'untagged':
        console.log('查询未标记的收藏')
        console.log(orderBy)
        const offset = (page - 1) * pageSize
        const orderByField = Object.keys(orderBy)[0]
        const orderByDirection = Object.values(orderBy)[0] as string

        const untaggedFavItems = await prisma.$queryRaw`
          SELECT fi.* FROM kstudio_fav_items fi
          LEFT JOIN kstudio_fav_item_tags fit ON fi.id = fit."itemId"
          WHERE fi."type" !='collection' AND fi."userId" = ${decoded.userId} AND fi."isDeleted" = false AND fit."itemId" IS NULL
          ORDER BY fi.${Prisma.raw(`"${orderByField}"`)} ${Prisma.raw(orderByDirection)}
          LIMIT ${pageSize} OFFSET ${offset}
        `

        collections = (untaggedFavItems as CollectionResult[]).map(item => ({
          ...item,
          id: Number(item.id),
          userId: Number(item.userId),
          parentId: item.parentId ? Number(item.parentId) : null,
        }))

        // 获取总数
        const totalResult = await prisma.$queryRaw`
          SELECT COUNT(*)::integer as count FROM kstudio_fav_items fi
          LEFT JOIN kstudio_fav_item_tags fit ON fi.id = fit."itemId"
          WHERE fi."userId" = ${decoded.userId} AND fi."isDeleted" = false AND fit."itemId" IS NULL
        `
        total = (totalResult as CollectionResult[])[0].count
        break
      case 'web':
        console.log('查询网页收藏')
        where.type = 'url'
        total = await prisma.favItem.count({ where })
        
        // 查询网页收藏项目
        const items2 = await prisma.favItem.findMany({
          where,
          orderBy,
          skip: (page - 1) * pageSize,
          take: pageSize,
        })

        // 获取这些项目的 ID
        const itemIds = items2.map(item => item.id)

        // 单独查询每个项目的标签数量
        const tagCounts = await prisma.favItemTag.groupBy({
          by: ['itemId'],
          where: {
            itemId: {
              in: itemIds
            }
          },
          _count: {
            itemId: true
          }
        })

        // 创建一个映射，用于快速查找每个项目的标签数量
        const tagCountMap = new Map(tagCounts.map(tc => [tc.itemId, tc._count.itemId]))

        // 合并结果
        collections = items2.map(item => ({
          ...item,
          count: tagCountMap.get(item.id) || 0
        }))

        collections = items2.map(item => ({
          ...item,
          count: 0
        }))
        break
      case 'album':
        console.log('查询指定收藏夹内的项目')
        if (!albumId) {
          return NextResponse.json({ error: '未提供 albumId' }, { status: 400 })
        }
        where = {
          ...where,
          type: { not: 'collection' },
          parentId: parseInt(albumId)
        }
        total = await prisma.favItem.count({ where })
        const items3 = await prisma.favItem.findMany({
          where,
          orderBy,
          skip: (page - 1) * pageSize,
          take: pageSize,
        })
        
        collections = items3.map(item => ({
          ...item,
          count: 0
        }))
        break
      // 其他 case 需要实现
    }

    // 处理查询结果，添加 hasTag 字段
    const processedCollections = collections.map(item => ({
      id: Number(item.id),
      title: item.title,
      coverImage: item.coverImage,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      type: item.type,
      url: item.url,
      hasTag: cmd !== 'untagged' // 对于 album 查询，我们需要单独检查是否有标签
    }))

    // 如果是 album 查询，我们需要检查每个项目是否有标签
    if (cmd === 'album') {
      const itemIds = processedCollections.map(item => item.id)
      const taggedItems = await prisma.favItemTag.findMany({
        where: {
          itemId: { in: itemIds }
        },
        select: {
          itemId: true
        }
      })
      const taggedItemIds = new Set(taggedItems.map(item => item.itemId))
      processedCollections.forEach(item => {
        item.hasTag = taggedItemIds.has(item.id)
      })
    }

    // 构造响应数据
    const response = {
      collections: processedCollections,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / pageSize),
        totalItems: total,
      },
    }

    console.log('收藏夹列表请求处理完成')
    return NextResponse.json(response)
  } catch (error) {
    console.error('获取收藏夹列表错误:', error)
    return NextResponse.json({ error: '获取收藏夹列表失败' }, { status: 500 })
  }
}