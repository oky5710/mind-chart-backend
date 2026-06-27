import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashed = await bcrypt.hash('test1234', 10)

  const user = await prisma.user.upsert({
    where: { email: 'test@test.com' },
    update: { name: '홍길동' },
    create: {
      email: 'test@test.com',
      password: hashed,
      name: '홍길동',
    },
  })

  console.log(`사용자 생성 완료: ${user.name} (${user.email}) — ID: ${user.id}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
