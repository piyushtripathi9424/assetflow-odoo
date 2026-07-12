import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create the admin user that mock auth injects
  const admin = await prisma.user.upsert({
    where: { id: 'seed-admin-user-id' },
    update: {},
    create: {
      id: 'seed-admin-user-id',
      email: 'admin@assetflow.com',
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  // Create sample assets
  const laptop = await prisma.asset.upsert({
    where: { id: 'asset-laptop-1' },
    update: {},
    create: {
      id: 'asset-laptop-1',
      name: 'MacBook Pro 16"',
      serialNumber: 'C02DG43LMD6R',
      status: 'AVAILABLE',
      location: 'HQ - Floor 3',
    },
  });

  const projector = await prisma.asset.upsert({
    where: { id: 'asset-projector-1' },
    update: {},
    create: {
      id: 'asset-projector-1',
      name: 'Sony A7IV Camera',
      serialNumber: 'ILCE-7M4-001',
      status: 'AVAILABLE',
      location: 'Marketing Dept',
    },
  });

  const printer = await prisma.asset.upsert({
    where: { id: 'asset-printer-1' },
    update: {},
    create: {
      id: 'asset-printer-1',
      name: 'HP LaserJet Pro',
      serialNumber: 'VNC3J12345',
      status: 'AVAILABLE',
      location: 'HQ - Floor 1',
    },
  });

  console.log('✅ Seeded:', { admin: admin.email, assets: [laptop.name, projector.name, printer.name] });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
