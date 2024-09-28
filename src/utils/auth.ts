import jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma'

// 定义一个新的接口来描述我们的JWT payload
interface CustomJwtPayload extends jwt.JwtPayload {
  exp: number;
  email: string;
  userId: number;
}

export async function signToken(payload: object): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '4320h' }, (err, token) => {
      if (err) reject(err)
      else resolve(token as string)
    })
  })
}

export async function verifyToken(token: string): Promise<CustomJwtPayload> {
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as CustomJwtPayload
  
  // 异步检查令牌是否在黑名单中
  const invalidToken = await prisma.invalidToken.findUnique({
    where: { token }
  })

  if (invalidToken) {
    throw new Error('令牌已失效')
  }
  
  return decoded
}

export async function invalidateToken(token: string): Promise<void> {
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as CustomJwtPayload
  const expirationDate = new Date(decoded.exp * 1000) // 转换为毫秒

  await prisma.invalidToken.create({
    data: {
      token,
      expiresAt: expirationDate,
      userId: decoded.userId
    }
  })
}