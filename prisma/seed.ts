import { PrismaClient, Role } from "@prisma/client";
import { hashPassword } from "../lib/auth/password";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await hashPassword("Admin123!");
  const customerPassword = await hashPassword("Mario123!");

  await prisma.user.upsert({
    where: { email: "admin@openpayd.local" },
    update: {
      name: "OpenPayd",
      surname: "Admin",
      password: adminPassword,
      role: Role.ADMIN,
      balance: 0
    },
    create: {
      name: "OpenPayd",
      surname: "Admin",
      email: "admin@openpayd.local",
      password: adminPassword,
      role: Role.ADMIN,
      balance: 0
    }
  });

  await prisma.user.upsert({
    where: { email: "mario@openpayd.local" },
    update: {
      name: "Mario",
      surname: "Rossi",
      password: customerPassword,
      role: Role.CUSTOMER,
      balance: 12450.87
    },
    create: {
      name: "Mario",
      surname: "Rossi",
      email: "mario@openpayd.local",
      password: customerPassword,
      role: Role.CUSTOMER,
      balance: 12450.87
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
