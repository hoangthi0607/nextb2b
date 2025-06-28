/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('../app/generated/prisma');
require('dotenv').config();
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const defaultAdmin = {
    username: 'admin',
    password: process.env.ADMIN_DEFAULT_PASSWORD ?? 'admin123',
    fullName: 'Super Admin',
    email: 'admin@example.com',
    phone: '0123456789',
  };

  // 1. Tạo Admin mặc định
  const existingAdmin = await prisma.admin.findUnique({
    where: { username: defaultAdmin.username },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(defaultAdmin.password, 10);
    await prisma.admin.create({
      data: {
        ...defaultAdmin,
        password: hashedPassword,
      },
    });
    console.log(`✅ Admin "${defaultAdmin.username}" đã được tạo.`);
  } else {
    console.log(`ℹ️ Admin "${defaultAdmin.username}" đã tồn tại.`);
  }

  // 2. Tạo Role mặc định: enterprise_admin
  const roleName = 'enterprise_admin';
  const existingRole = await prisma.role.findUnique({
    where: { name: roleName },
  });

  if (!existingRole) {
    await prisma.role.create({
      data: {
        name: roleName,
      },
    });
    console.log(`✅ Role "${roleName}" đã được tạo.`);
  } else {
    console.log(`ℹ️ Role "${roleName}" đã tồn tại.`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi seed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
