import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'

export function handleDatabaseError(error: unknown): NextResponse {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return NextResponse.json({ error: 'A record with this unique field already exists' }, { status: 409 })
      case 'P2025':
        return NextResponse.json({ error: 'Record not found' }, { status: 404 })
      // 添加其他 Prisma 错误代码的处理
    }
  }
  if (error instanceof Error) {
    return NextResponse.json({ error: 'Error processing request', details: error.message }, { status: 500 })
  }
  return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 })
}