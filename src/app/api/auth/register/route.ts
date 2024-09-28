import { NextResponse } from 'next/server'
import { createUser } from '@/services/userService'
import { Prisma } from '@prisma/client'

export async function GET() {
  console.log('GET request received')
  return NextResponse.json({ message: 'GET API is working' })
}

export async function POST(request: Request) {
  console.log('POST request received')
  try {
    const body = await request.json()
    console.log('Request body:', body)
    
    const user = await createUser(body)
    
    console.log('User created:', user)
    return NextResponse.json({ message: 'User created successfully', user }, { status: 201 })
  } catch (error) {
    console.error('Error in POST request:', error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 })
      }
    }
    // 添加更多的错误日志
    console.error('Error details:', JSON.stringify(error, null, 2))
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}