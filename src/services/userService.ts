import prisma from '../lib/prisma'
import type { User } from '@prisma/client'
import bcrypt from 'bcrypt'

function generateRandomUsername(): string {
  return Math.random().toString(36).substring(2, 8);
}

/**
 * 创建新用户
 * @param userData - 用户数据，只需要 email 和 password
 * @returns 创建的用户对象
 */
export async function createUser(userData: { email: string; password: string }): Promise<User> {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10)
    const username = generateRandomUsername()
    
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        username: username,
        name: username, // 使用生成的用户名作为初始名称
      },
    })
    console.log('User created in database:', user)
    return user
  } catch (error) {
    console.error('Error in createUser:', error)
    throw error; // 重新抛出错误，以便在路由处理器中捕获
  }
}

// 其他函数保持不变
/**
 * 通过邮箱查找用户
 * @param email - 用户邮箱
 * @returns 找到的用户对象，如果不存在则返回 null
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
  })
}

/**
 * 通过用户名查找用户
 * @param username - 用户名
 * @returns 找到的用户对象，如果不存在则返回 null
 */
export async function getUserByUsername(username: string): Promise<User | null> {
  return prisma.user.findFirst({
    where: { username },
  })
}

/**
 * 更新用户信息
 * @param id - 用户 ID
 * @param userData - 需要更新的用户数据
 * @returns 更新后的用户对象
 */
export async function updateUser(id: number, userData: Partial<User>): Promise<User> {
  return prisma.user.update({
    where: { id },
    data: userData,
  })
}

/**
 * 删除用户
 * @param id - 用户 ID
 * @returns 被删除的用户对象
 */
export async function deleteUser(id: number): Promise<User> {
  return prisma.user.delete({
    where: { id },
  })
}